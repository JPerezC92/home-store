import { Prisma } from "#database/infrastructure/prisma/client";
import { PaymentMethod } from "#payment/domain/PaymentMethod.model";
import { PaymentRepository } from "#payment/domain/PaymentRepository";
import { paymentMethodDBToModel } from "#payment/infrastructure/adapters/paymentDBToModel.adapter";

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
}
