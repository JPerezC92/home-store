import { Income } from "#payment/domain/Income.model";
import { PaymentMethod } from "#payment/domain/PaymentMethod.model";
import { BaseCriteria } from "#shared/domain/criteria/BaseCriteria";
import { Criteria } from "#shared/domain/criteria/Criteria";

export interface PaymentRepository {
	matchingWithCount(
		criteria: BaseCriteria
	): Promise<{ data: Income[]; total: number }>;
	findByName(name: string): Promise<PaymentMethod | null>;
	createPaymentMethod(paymentMethod: PaymentMethod): Promise<PaymentMethod>;
	createBulkIncome(paymentList: Income[]): Promise<void>;
}
