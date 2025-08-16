import { DomainError } from "#shared/domain/DomainError";
import { ErrorCodes } from "#shared/domain/ErrorCodes";

export class ExcelFileWorksheetNotFound extends DomainError {
	public static readonly code = ErrorCodes.EXCEL_FILE_WORKSHEET_NOT_FOUND;
	public readonly code = ExcelFileWorksheetNotFound.code;
	public readonly message: string = "Excel file worksheet not found";

	constructor() {
		super();
	}
}
