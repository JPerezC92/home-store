import { Prisma } from "#database/infrastructure/prisma/client";
import { Income } from "#payment/domain/Income.model";
import { PaymentMethod } from "#payment/domain/PaymentMethod.model";
import { PaymentRepository } from "#payment/domain/PaymentRepository";
import { incomeDbToModel } from "#payment/infrastructure/adapters/incomeDbToModel.adapter";
import { paymentMethodDBToModel } from "#payment/infrastructure/adapters/paymentMethodDBToModel.adapter";
import { Criteria } from "#shared/domain/criteria/Criteria";
import { PrismaCriteriaConverter } from "#shared/infrastructure/prisma/PrismaCriteriaConverter";

type DB = Prisma.TransactionClient;

export class PaymentPostgreeRepository implements PaymentRepository {
	private readonly criteriaConverter = new PrismaCriteriaConverter();

	constructor(private readonly db: DB) {}

	async findByName(name: string): Promise<PaymentMethod | null> {
		const method = await this.db.paymentMethodDB.findFirst({
			where: { name },
		});

		return method ? paymentMethodDBToModel(method) : null;
	}

	async createPaymentMethod(
		paymentMethod: PaymentMethod
	): Promise<PaymentMethod> {
		await this.db.paymentMethodDB.create({
			data: {
				payment_method_id: paymentMethod.paymentMethodId,
				name: paymentMethod.name,
				active: paymentMethod.active,
				created_at: new Date(),
				updated_at: new Date(),
			},
		});

		return paymentMethod;
	}

	async createBulkIncome(incomes: Income[]): Promise<void> {
		await this.db.incomeDB.createMany({
			data: incomes.map((income) => ({
				income_id: income.incomeId,
				amount: income.amount,
				sender_name: income.senderName,
				payment_note: income.paymentNote,
				transaction_date: income.transactionDate,
				payment_method_id: income.paymentMethod.paymentMethodId,
				created_at: income.createdAt || new Date(),
				updated_at: income.updatedAt || new Date(),
			})),
			skipDuplicates: true,
		});
	}

	async matchingWithCount(
		criteria: Criteria
	): Promise<{ data: Income[]; total: number }> {
		try {
			const query = this.criteriaConverter.convert(criteria);

			const queryWithIncludes = {
				...query,
				include: {
					PaymentMethodDB: true,
				},
			};

			const [results, total] = await Promise.all([
				this.db.incomeDB.findMany(queryWithIncludes),
				this.db.incomeDB.count({ where: query.where }),
			]);

			return {
				data: results.map((incomeDB) =>
					incomeDbToModel(incomeDB, incomeDB.PaymentMethodDB)
				),
				total,
			};
		} catch (error) {
			console.error(
				"Error in PaymentPostgreeRepository.matchingWithCount:",
				error
			);
			throw new Error("Failed to retrieve incomes and count by criteria");
		}
	}
}
