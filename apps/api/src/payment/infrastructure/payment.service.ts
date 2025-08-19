import { Injectable } from "@nestjs/common";

import { YapeExcelParser } from "./adapters/yapeExcelParser.adapter";
import { PaymentPostgreeRepository } from "./repository/PaymentPostgreeRepository";

import { PrismaService } from "#database/infrastructure/services/prisma.service";
import { PaymentMethodCreator } from "#payment/application/PaymentMethodCreator";
import {
	ProcessYapeBatchCreator,
	type ProcessYapeBatchResult,
} from "#payment/application/ProcessYapeBatchCreator";
import { ExcelFile } from "#payment/domain/interfaces/ExcelParser.interface";
import { PaymentMethod } from "#payment/domain/PaymentMethod.model";
import { DomainError } from "#shared/domain/DomainError";

@Injectable()
export class PaymentService {
	constructor(private readonly prisma: PrismaService) {}

	async createPaymentMethod(name: Pick<PaymentMethod, "name" | "active">) {
		const result = await this.prisma.$transaction(async (db) => {
			return await new PaymentMethodCreator({
				PaymentRepository: new PaymentPostgreeRepository(db),
			}).execute({
				name: name.name,
				active: name.active,
			});
		});

		if (DomainError.isDomainError(result)) {
			throw result;
		}

		return result;
	}

	async processYapeBatch(
		file: ExcelFile,
		paymentMethod: string
	): Promise<ProcessYapeBatchResult> {
		const result = await this.prisma.$transaction(async (db) => {
			return await new ProcessYapeBatchCreator({
				PaymentRepository: new PaymentPostgreeRepository(db),
				ExcelParser: new YapeExcelParser(),
			}).execute({ file, paymentMethod });
		});

		if (DomainError.isDomainError(result)) {
			throw result;
		}

		return result;
	}
}
