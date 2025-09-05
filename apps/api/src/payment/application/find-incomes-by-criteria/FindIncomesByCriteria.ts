import type { Income } from "#payment/domain/Income.model";
import type { PaymentRepository } from "#payment/domain/PaymentRepository";

import { BaseCriteria } from "#shared/domain/criteria/BaseCriteria";
import { Criteria } from "#shared/domain/criteria/Criteria";

interface Params {
	criteria: BaseCriteria;
}

export class FindIncomesByCriteria {
	constructor(
		private readonly deps: { PaymentRepository: PaymentRepository }
	) {}

	async execute({
		criteria,
	}: Params): Promise<{ data: Income[]; total: number }> {
		return await this.deps.PaymentRepository.matchingWithCount(criteria);
	}
}
