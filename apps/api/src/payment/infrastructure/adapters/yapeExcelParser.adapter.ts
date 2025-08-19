import * as ExcelJS from "exceljs";
import z from "zod";

import { yapePaymentDtoToModel } from "./yapeDtoToModel.adapter";

import { ExcelFileInvalidHeaders } from "#payment/domain/errors/ExcelFileInvalidHeaders";
import { ExcelFileNoValidPayments } from "#payment/domain/errors/ExcelFileNoValidPayments";
import { ExcelFileWorksheetNotFound } from "#payment/domain/errors/ExcelFileWorksheetNotFound";
import { Income } from "#payment/domain/Income.model";
import {
	ExcelFile,
	ExcelParser,
} from "#payment/domain/interfaces/ExcelParser.interface";
import { PaymentMethod } from "#payment/domain/PaymentMethod.model";
import {
	YAPE_EXCEL_HEADERS,
	YapePaymentDto,
	YapePaymentDtoSchema,
} from "#payment/infrastructure/dtos/yape-payment-excel.dto";
import { DomainError } from "#shared/domain/DomainError";

export class YapeExcelParser implements ExcelParser {
	private readonly EXCEL_COLUMNS = ["A", "B", "C", "D", "E", "F"] as const;

	async parse(
		file: ExcelFile,
		paymentMethod: PaymentMethod
	): Promise<Income[] | DomainError> {
		const workbook = new ExcelJS.Workbook();
		await workbook.xlsx.load(file.buffer);

		const [firstWorksheet] = workbook.worksheets;
		if (!firstWorksheet) {
			return new ExcelFileWorksheetNotFound();
		}

		const incomes: Income[] = [];

		const headerValues = this.EXCEL_COLUMNS.map(
			(column) => firstWorksheet.getCell(`${column}5`).value
		);

		const parsedHeaders = YAPE_EXCEL_HEADERS.safeParse(headerValues);

		if (!parsedHeaders.success) {
			return new ExcelFileInvalidHeaders();
		}

		firstWorksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
			if (rowNumber <= 5) return;

			const headerColumnMap = new Map(
				this.EXCEL_COLUMNS.map((columnLetter, index) => {
					const headerName = parsedHeaders.data[index];
					return [
						headerName,
						row.getCell(columnLetter).value,
					] as const;
				})
			);

			const rowData = Object.fromEntries(headerColumnMap);

			const validatedRow = YapePaymentDtoSchema.safeParse(rowData);

			if (!validatedRow.success) {
				return new ExcelFileNoValidPayments();
			}

			if (validatedRow.data.transactionType !== "PAGASTE") {
				const income = yapePaymentDtoToModel(
					validatedRow.data,
					paymentMethod
				);
				incomes.push(income);
			}
		});

		if (incomes.length === 0) {
			return new ExcelFileNoValidPayments();
		}

		return incomes;
	}
}
