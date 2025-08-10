import { Injectable } from "@nestjs/common";

import { PaymentPostgreeRepository } from "./repository/PaymentPostgreeRepository";

import { PrismaService } from "#database/infrastructure/services/prisma.service";
import { PaymentMethodCreator } from "#payment/application/PaymentMethodCreator";
import { PaymentMethod } from "#payment/domain/PaymentMethod.model";
import { DomainError } from "#shared/domain/DomainError";

@Injectable()
export class PaymentService {
	constructor(private readonly prisma: PrismaService) {}

	async createPaymentMethod(name: Pick<PaymentMethod, "name" | "active">) {
		const result = await this.prisma.$transaction(async (db) => {
			return await PaymentMethodCreator({
				PaymentRepository: new PaymentPostgreeRepository(db),
			}).execute({ name: name.name, active: name.active });
		});

		if (DomainError.isDomainError(result)) {
			throw result;
		}

		return result;
	}
}
