import { ErrorCodes } from "./ErrorCodes";

export abstract class DomainError extends Error {
	public abstract readonly code: string;
	public abstract readonly message: string;

	public static isDomainError(error: unknown): error is DomainError {
		return error instanceof DomainError;
	}
}

export class PaymentMethodAlreadyExists extends DomainError {
	public static readonly code: string =
		ErrorCodes.PAYMENT_METHOD_ALREADY_EXISTS;
	public readonly code: string = PaymentMethodAlreadyExists.code;
	public readonly message: string = "Payment method already exists";
}
