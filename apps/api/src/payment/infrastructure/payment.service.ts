import { Injectable } from "@nestjs/common";

import { paymentMethodDBToModel } from "./adapters/paymentMethodDBToModel.adapter";
import { YapeExcelParser } from "./adapters/yapeExcelParser.adapter";
import { dateFilterExpander } from "./filter-helpers/date-filter-expander.helper";
import { mapFiltersToType } from "./filter-helpers/map-filters-to-type.helper";
import { PaymentPostgreeRepository } from "./repository/PaymentPostgreeRepository";

import { incomeDbFieldTypes } from "#database/infrastructure/constants/income-db-fields-type.constant";
import { PrismaService } from "#database/infrastructure/services/prisma.service";
import { FindIncomesByCriteria } from "#payment/application/find-incomes-by-criteria/FindIncomesByCriteria";
import { PaymentMethodCreator } from "#payment/application/PaymentMethodCreator";
import {
	ProcessYapeBatchCreator,
	type ProcessYapeBatchResult,
} from "#payment/application/ProcessYapeBatchCreator";
import { Income } from "#payment/domain/Income.model";
import { ExcelFile } from "#payment/domain/interfaces/ExcelParser.interface";
import { PaymentMethod } from "#payment/domain/PaymentMethod.model";
import { FilterDto } from "#payment/infrastructure/dtos/find-incomes-by-criteria.dto";
import {
	IncomeCriteria,
	IncomeFilter,
} from "#payment/infrastructure/IncomeCriteria";
import { OrderTypeEnum } from "#shared/domain/criteria/OrderType";
import { DomainError } from "#shared/domain/DomainError";

@Injectable()
export class PaymentService {
	constructor(private readonly prisma: PrismaService) {}

	public async getPaymentMethods(): Promise<PaymentMethod[]> {
		const methods = await this.prisma.paymentMethodDB.findMany({
			where: { active: true },
			orderBy: { name: "asc" },
		});

		return methods.map((method) => paymentMethodDBToModel(method));
	}

	public async searchIncomes(
		filters: FilterDto[],
		orderBy?: string,
		orderType?: OrderTypeEnum,
		limit?: number,
		offset?: number
	): Promise<{ data: Income[]; total: number }> {
		const typedFilters = mapFiltersToType<FilterDto, IncomeFilter>(
			dateFilterExpander(filters, incomeDbFieldTypes),
			incomeDbFieldTypes
		);

		const criteria = IncomeCriteria.create(
			typedFilters,
			orderBy,
			orderType,
			limit,
			offset
		);

		const result = await new FindIncomesByCriteria({
			PaymentRepository: new PaymentPostgreeRepository(this.prisma),
		}).execute({ criteria });

		return result;
	}

	async createPaymentMethod({
		name,
		active,
	}: Pick<PaymentMethod, "name" | "active">): Promise<void> {
		const result = await this.prisma.$transaction(async (db) => {
			return await new PaymentMethodCreator({
				PaymentRepository: new PaymentPostgreeRepository(db),
			}).execute({ name, active });
		});

		if (DomainError.isDomainError(result)) {
			throw result;
		}

		return;
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
