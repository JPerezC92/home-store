import { PaymentMethod } from "#payment/domain/PaymentMethod.model";
import { DomainError } from "#shared/domain/DomainError";
import { ErrorCodes } from "#shared/domain/ErrorCodes";

export class PaymentMethodNotFound extends DomainError {
	public static readonly code = ErrorCodes.PAYMENT_METHOD_NOT_FOUND;
	public readonly code = PaymentMethodNotFound.code;
	public readonly message: string = "Payment method not found";

	constructor(paymentMethodName?: PaymentMethod["name"]) {
		super();
		this.message = paymentMethodName
			? `Payment method ${paymentMethodName} not found`
			: this.message;
	}
}
