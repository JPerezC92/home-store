import { Prisma } from "#database/infrastructure/prisma/client";
import { Income } from "#payment/domain/Income.model";
import { PaymentMethod } from "#payment/domain/PaymentMethod.model";
import { PaymentRepository } from "#payment/domain/PaymentRepository";
import { paymentMethodDBToModel } from "#payment/infrastructure/adapters/paymentMethodDBToModel.adapter";

type DB = Prisma.TransactionClient;

export class PaymentPostgreeRepository implements PaymentRepository {
	constructor(private readonly db: DB) {}

	async createPaymentMethod(paymentMethod: PaymentMethod): Promise<void> {
		await this.db.paymentMethodDB.create({
			data: {
				name: paymentMethod.name,
			},
		});

		return;
	}

	async findByName(name: string): Promise<PaymentMethod | null> {
		const paymentMethod = await this.db.paymentMethodDB.findFirst({
			where: {
				name: name,
			},
		});

		return paymentMethod ? paymentMethodDBToModel(paymentMethod) : null;
	}

	async createBulkIncome(incomes: Income[]): Promise<void> {
		await this.db.incomeDB.createMany({
			data: incomes.map((income) => ({
				income_id: crypto.randomUUID(),
				amount: income.amount,
				sender_name: income.senderName,
				payment_note: income.paymentNote,
				payment_method_id: income.paymentMethod.paymentMethodId,
				transaction_date: income.transactionDate,
				created_at: new Date(),
				updated_at: new Date(),
			})),
			skipDuplicates: true,
		});
	}
}
