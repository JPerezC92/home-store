import { PaymentMethod } from "#payment/domain/PaymentMethod.model";

export interface PaymentRepository {
	findByName(name: string): Promise<PaymentMethod | null>;
	createPaymentMethod(paymentMethod: PaymentMethod): Promise<void>;
}
