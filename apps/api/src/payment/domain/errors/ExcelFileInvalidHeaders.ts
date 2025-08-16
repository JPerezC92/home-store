import { DomainError } from "#shared/domain/DomainError";
import { ErrorCodes } from "#shared/domain/ErrorCodes";

export class ExcelFileInvalidHeaders extends DomainError {
	public static readonly code = ErrorCodes.EXCEL_FILE_INVALID_HEADERS;
	public readonly code = ExcelFileInvalidHeaders.code;
	public readonly message: string = "Invalid Excel headers";

	constructor() {
		super();
	}
}
