import type {
	ExcelFile,
	ExcelParser,
} from "#payment/domain/interfaces/ExcelParser.interface";

import { PaymentMethodNotFound } from "#payment/domain/errors/PaymentMethodNotFound";
import { PaymentRepository } from "#payment/domain/PaymentRepository";
import { DomainError } from "#shared/domain/DomainError";

interface Dependencies {
	PaymentRepository: PaymentRepository;
	ExcelParser: ExcelParser;
}

interface ExecuteInput {
	file: ExcelFile;
	paymentMethod: string;
}

export interface ProcessYapeBatchResult {
	count: number;
}

export class ProcessYapeBatchCreator {
	constructor(private readonly deps: Dependencies) {}

	async execute({
		file,
	}: ExecuteInput): Promise<ProcessYapeBatchResult | DomainError> {
		const yapePaymentMethod = await this.deps.PaymentRepository.findByName(
			"Yape"
		);

		if (!yapePaymentMethod) {
			return new PaymentMethodNotFound("Yape");
		}

		const parsedIncomes = await this.deps.ExcelParser.parse(
			file,
			yapePaymentMethod
		);

		if (DomainError.isDomainError(parsedIncomes)) {
			return parsedIncomes;
		}

		if (parsedIncomes.length > 0) {
			await this.deps.PaymentRepository.createBulkIncome(parsedIncomes);
		}

		return {
			count: parsedIncomes.length,
		};
	}
}
