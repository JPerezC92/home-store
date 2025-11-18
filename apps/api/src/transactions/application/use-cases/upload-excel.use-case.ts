import { Injectable, Logger } from '@nestjs/common';
import { ExcelParserService } from '../../infrastructure/parsers/excel-parser.service';
import { TransactionRepository } from '../../infrastructure/repositories/transaction.repository';
import type { UploadResult } from '@repo/api';

@Injectable()
export class UploadExcelUseCase {
  private readonly logger = new Logger(UploadExcelUseCase.name);

  constructor(
    private readonly excelParser: ExcelParserService,
    private readonly transactionRepository: TransactionRepository,
  ) {}

  /**
   * Validate Excel file and return preview with duplicates
   */
  async validateFile(fileBuffer: Buffer, fileName: string): Promise<UploadResult> {
    this.logger.log(`Validating file: ${fileName}`);

    // Parse Excel file
    const parseResult = await this.excelParser.parseExcelFile(
      fileBuffer,
      fileName,
    );

    // Find duplicates within the file
    const { duplicates, uniqueTransactions } =
      this.excelParser.findDuplicatesInParsed(parseResult.validTransactions);

    const result: UploadResult = {
      totalRecords: parseResult.totalRecords,
      validRecords: uniqueTransactions.length,
      invalidRecords: parseResult.invalidRecords,
      duplicateRecords: duplicates.length,
      skippedEmptyRows: parseResult.skippedEmptyRows,
      skippedRowDetails: parseResult.skippedRowDetails,
      duplicates,
      errors: parseResult.errors,
    };

    this.logger.log(
      `Validation complete: ${result.validRecords} valid, ${result.duplicateRecords} duplicates, ${result.invalidRecords} errors`,
    );

    return result;
  }

  /**
   * Confirm and save transactions to database
   */
  async confirmUpload(
    fileBuffer: Buffer,
    fileName: string,
  ): Promise<{ savedCount: number; uploadHistoryId: number }> {
    this.logger.log(`Confirming upload for file: ${fileName}`);

    // Parse file again
    const parseResult = await this.excelParser.parseExcelFile(
      fileBuffer,
      fileName,
    );

    // Find duplicates within file only
    const { duplicates, uniqueTransactions } =
      this.excelParser.findDuplicatesInParsed(parseResult.validTransactions);

    // Save transactions (duplicates within file already removed)
    const savedCount = await this.transactionRepository.createMany(
      uniqueTransactions,
    );

    // Create upload history record
    const uploadHistoryRecord =
      await this.transactionRepository.createUploadHistory({
        fileName,
        phoneNumber: uniqueTransactions[0]?.phoneNumber || null,
        totalRecords: parseResult.totalRecords,
        successfulRecords: savedCount,
        failedRecords: parseResult.invalidRecords,
        duplicateRecords: duplicates.length,
        errors:
          parseResult.errors.length > 0
            ? JSON.stringify(parseResult.errors)
            : null,
      });

    this.logger.log(`Upload confirmed: ${savedCount} transactions saved`);

    return {
      savedCount,
      uploadHistoryId: uploadHistoryRecord.id,
    };
  }
}
