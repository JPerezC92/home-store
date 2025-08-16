import { Income } from "#payment/domain/Income.model";
import { PaymentMethod } from "#payment/domain/PaymentMethod.model";
import { DomainError } from "#shared/domain/DomainError";

export interface ExcelFile {
	buffer: Buffer;
	originalname: string;
	mimetype: string;
	size: number;
}

export interface ExcelParser {
	parse(
		file: ExcelFile,
		paymentMethod: PaymentMethod
	): Promise<Income[] | DomainError>;
}
