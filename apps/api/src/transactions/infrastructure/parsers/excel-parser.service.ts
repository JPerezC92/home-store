import { Injectable, Logger } from '@nestjs/common';
import * as XLSX from 'xlsx';
import { excelRowSchema, type UploadResult } from '@repo/api';
import {
  ExcelFileWorksheetNotFoundError,
  ExcelFileInvalidHeadersError,
  ExcelFileNoValidDataError,
} from '../../domain/errors/excel-parsing.errors';

const EXPECTED_HEADERS = [
  'Tipo de Transacción',
  'Origen',
  'Destino',
  'Monto',
  'Mensaje',
  'Fecha de operación',
];

interface ParsedTransaction {
  transactionType: string;
  origin: string;
  destination: string;
  amount: number;
  message: string | null;
  operationDate: Date;
  phoneNumber: string | null;
}

@Injectable()
export class ExcelParserService {
  private readonly logger = new Logger(ExcelParserService.name);

  /**
   * Parse Excel file and validate data
   */
  async parseExcelFile(
    fileBuffer: Buffer,
    fileName: string,
  ): Promise<UploadResult & { validTransactions: ParsedTransaction[] }> {
    this.logger.log(`Parsing Excel file: ${fileName}`);

    // Read workbook
    const workbook = XLSX.read(fileBuffer, { type: 'buffer' });

    // Get first worksheet
    if (workbook.SheetNames.length === 0) {
      throw new ExcelFileWorksheetNotFoundError();
    }

    const worksheet = workbook.Sheets[workbook.SheetNames[0]];

    // Convert to array of arrays
    const rawData = XLSX.utils.sheet_to_json(worksheet, {
      header: 1,
      defval: null,
    }) as any[][];

    if (rawData.length < 6) {
      throw new ExcelFileNoValidDataError();
    }

    // Extract headers from row 5 (index 4)
    const headers = (rawData[4] as string[]).filter(
      (h) => h !== null && h !== '',
    );

    // Validate headers
    this.validateHeaders(headers);

    // Extract phone number from filename
    const phoneNumber = this.extractPhoneNumber(fileName);

    // Parse data rows (starting from row 6, index 5)
    const dataRows = rawData.slice(5);

    // Track skipped rows with details
    const skippedRowDetails: Array<{ row: number; reason: string }> = [];

    // Filter out empty rows and track them
    const nonEmptyRows = dataRows
      .map((row, index) => ({ row, originalIndex: index }))
      .filter(({ row, originalIndex }) => {
        const rowNumber = originalIndex + 6; // Actual Excel row number
        const isEmpty = !row || row.every((cell) => cell === null || cell === '');

        if (isEmpty) {
          skippedRowDetails.push({
            row: rowNumber,
            reason: 'Empty row (all cells are blank)',
          });
          return false;
        }
        return true;
      });

    const skippedEmptyRows = dataRows.length - nonEmptyRows.length;

    const result: UploadResult & { validTransactions: ParsedTransaction[] } = {
      totalRecords: nonEmptyRows.length,
      validRecords: 0,
      invalidRecords: 0,
      duplicateRecords: 0,
      skippedEmptyRows,
      skippedRowDetails,
      duplicates: [],
      errors: [],
      validTransactions: [],
    };

    // Parse each row
    nonEmptyRows.forEach(({ row, originalIndex }) => {
      const rowNumber = originalIndex + 6; // Actual row number in Excel

      try {
        const rowData = this.mapRowToObject(headers, row);
        const validatedRow = excelRowSchema.parse(rowData);

        // Transform to transaction object
        const transaction = this.transformToTransaction(
          validatedRow,
          phoneNumber,
        );

        result.validTransactions.push(transaction);
        result.validRecords++;
      } catch (error) {
        result.invalidRecords++;
        result.errors.push({
          row: rowNumber,
          error: error instanceof Error ? error.message : String(error),
        });
        this.logger.warn(
          `Row ${rowNumber} validation failed: ${error instanceof Error ? error.message : String(error)}`,
        );
      }
    });

    if (result.validRecords === 0) {
      throw new ExcelFileNoValidDataError();
    }

    this.logger.log(
      `Parsing complete: ${result.validRecords} valid, ${result.invalidRecords} invalid`,
    );

    return result;
  }

  /**
   * Find duplicates in transactions
   */
  findDuplicatesInParsed(transactions: ParsedTransaction[]): {
    duplicates: Array<{
      row: number;
      data: any;
      reason: string;
      originalRow: number;
      originalData: any;
    }>;
    uniqueTransactions: ParsedTransaction[];
  } {
    const seen = new Map<
      string,
      { index: number; transaction: ParsedTransaction }
    >();
    const duplicates: Array<{
      row: number;
      data: any;
      reason: string;
      originalRow: number;
      originalData: any;
    }> = [];
    const uniqueTransactions: ParsedTransaction[] = [];

    transactions.forEach((transaction, index) => {
      // Create a unique key based on transaction properties
      const key = `${transaction.operationDate.toISOString()}_${transaction.amount}_${transaction.origin}_${transaction.destination}`;

      if (seen.has(key)) {
        const original = seen.get(key)!;
        const originalRow = original.index + 6;
        const originalTransaction = original.transaction;

        duplicates.push({
          row: index + 6,
          data: {
            'Tipo de Transacción': transaction.transactionType,
            Origen: transaction.origin,
            Destino: transaction.destination,
            Monto: transaction.amount,
            Mensaje: transaction.message || '',
            'Fecha de operación': transaction.operationDate.toLocaleString(
              'es-PE',
            ),
          },
          originalRow,
          originalData: {
            'Tipo de Transacción': originalTransaction.transactionType,
            Origen: originalTransaction.origin,
            Destino: originalTransaction.destination,
            Monto: originalTransaction.amount,
            Mensaje: originalTransaction.message || '',
            'Fecha de operación':
              originalTransaction.operationDate.toLocaleString('es-PE'),
          },
          reason: `Duplicate of row ${originalRow}`,
        });
      } else {
        seen.set(key, { index, transaction });
        uniqueTransactions.push(transaction);
      }
    });

    return { duplicates, uniqueTransactions };
  }

  /**
   * Validate Excel headers
   */
  private validateHeaders(headers: string[]): void {
    const missingHeaders = EXPECTED_HEADERS.filter(
      (expected) => !headers.includes(expected),
    );

    if (missingHeaders.length > 0) {
      throw new ExcelFileInvalidHeadersError(EXPECTED_HEADERS, headers);
    }
  }

  /**
   * Map row array to object using headers
   */
  private mapRowToObject(headers: string[], row: any[]): Record<string, any> {
    const obj: Record<string, any> = {};
    headers.forEach((header, index) => {
      obj[header] = row[index];
    });
    return obj;
  }

  /**
   * Transform validated Excel row to Transaction object
   */
  private transformToTransaction(
    row: any,
    phoneNumber: string | null,
  ): ParsedTransaction {
    // Parse date from DD/MM/YYYY HH:mm:ss format
    const dateParts = row['Fecha de operación'].split(' ');
    const [day, month, year] = dateParts[0].split('/');
    const [hours, minutes, seconds] = dateParts[1].split(':');

    const operationDate = new Date(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day),
      parseInt(hours),
      parseInt(minutes),
      parseInt(seconds),
    );

    // Parse amount (handle both string and number)
    const amount =
      typeof row.Monto === 'number'
        ? row.Monto
        : parseFloat(row.Monto.replace(',', '.'));

    return {
      transactionType: row['Tipo de Transacción'],
      origin: row.Origen,
      destination: row.Destino,
      amount,
      message: row.Mensaje || null,
      operationDate,
      phoneNumber,
    };
  }

  /**
   * Extract phone number from filename
   */
  private extractPhoneNumber(fileName: string): string | null {
    // Extract phone number from filename like "ReporteTransacciones+51922076456.xlsx"
    const match = fileName.match(/\+?\d{11,15}/);
    return match ? match[0] : null;
  }
}
