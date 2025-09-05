import {
	Body,
	Controller,
	Post,
	UploadedFile,
	UseFilters,
	UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import {
	ApiConflictResponse,
	ApiConsumes,
	ApiCreatedResponse,
	ApiResponse,
} from "@nestjs/swagger";

import { incomeListToDto } from "./adapters/incomeToDto.adapter";
import {
	DEFAULT_FIND_INCOMES_BY_CRITERIA,
	FindIncomesByCriteriaDTO,
} from "./dtos/find-incomes-by-criteria.dto";
import { IncomeListResponseDto } from "./dtos/income-response.dto";
import * as paymentSchemas from "./dtos/payment-method-create.dto";
import { YapeUploadResponseDto } from "./dtos/yape-upload-response.dto";
import { PaymentService } from "./payment.service";

import { ExcelFile } from "#payment/domain/interfaces/ExcelParser.interface";
import { DomainErrorFilter } from "#shared/infrastructure/filters/domainError.filter";

@Controller("payment")
@UseFilters(DomainErrorFilter)
export class PaymentController {
	constructor(private readonly paymentService: PaymentService) {}

	@Post("payment-methods")
	@ApiCreatedResponse({ type: paymentSchemas.PaymentMethodCreateDto })
	@ApiConflictResponse()
	paymentMethodCreate(@Body() body: paymentSchemas.PaymentMethodCreateDto) {
		return this.paymentService.createPaymentMethod(body);
	}

	@Post("import/yape")
	@UseInterceptors(FileInterceptor("file"))
	@ApiConsumes("multipart/form-data")
	@ApiCreatedResponse({
		description: "Payments imported successfully",
		type: YapeUploadResponseDto,
	})
	async importYapePayments(
		@UploadedFile() file: ExcelFile
	): Promise<YapeUploadResponseDto> {
		const result = await this.paymentService.processYapeBatch(file, "yape");

		return {
			success: true,
			processedCount: result.count,
		};
	}

	@Post("incomes/search")
	@ApiResponse({
		status: 200,
		description: "List of incomes matching the criteria",
		type: IncomeListResponseDto,
	})
	async searchIncomes(
		@Body() body: FindIncomesByCriteriaDTO
	): Promise<IncomeListResponseDto> {
		// Merge defaults per field
		const criteria = {
			filters:
				body.filters && body.filters.length > 0
					? body.filters
					: DEFAULT_FIND_INCOMES_BY_CRITERIA.filters,
			orderBy: body.orderBy ?? DEFAULT_FIND_INCOMES_BY_CRITERIA.orderBy,
			orderType:
				body.orderType ?? DEFAULT_FIND_INCOMES_BY_CRITERIA.orderType,
			limit: body.limit ?? DEFAULT_FIND_INCOMES_BY_CRITERIA.limit,
			offset: body.offset ?? DEFAULT_FIND_INCOMES_BY_CRITERIA.offset,
		};

		try {
			const { data: incomes, total } =
				await this.paymentService.searchIncomes(
					criteria.filters,
					criteria.orderBy,
					criteria.orderType,
					criteria.limit,
					criteria.offset
				);
			return {
				data: incomeListToDto(incomes),
				total,
			};
		} catch (error) {
			// Optionally log or handle error
			throw error;
		}
	}
}
