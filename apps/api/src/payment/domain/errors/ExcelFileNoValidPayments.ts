import { DomainError } from "#shared/domain/DomainError";
import { ErrorCodes } from "#shared/domain/ErrorCodes";

export class ExcelFileNoValidPayments extends DomainError {
	public static readonly code = ErrorCodes.EXCEL_FILE_NO_VALID_PAYMENTS;
	public readonly code = ExcelFileNoValidPayments.code;
	public readonly message =
		"No valid payment records were found in the uploaded file";
}
