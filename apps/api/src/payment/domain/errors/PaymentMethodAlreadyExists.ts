import { DomainError } from "#shared/domain/DomainError";
import { ErrorCodes } from "#shared/domain/ErrorCodes";

export class PaymentMethodAlreadyExists extends DomainError {
	public static readonly code = ErrorCodes.PAYMENT_METHOD_ALREADY_EXISTS;
	public readonly code = PaymentMethodAlreadyExists.code;
	public readonly message: string = "Payment method already exists";
}
