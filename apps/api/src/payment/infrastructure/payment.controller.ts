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
} from "@nestjs/swagger";

import * as paymentSchemas from "./dtos/payment-method.dto";
import { YapeUploadResponseDto } from "./dtos/yape-upload-response.dto";
import { PaymentService } from "./payment.service";

import { ExcelFile } from "#payment/domain/interfaces/ExcelParser.interface";
import { DomainErrorFilter } from "#shared/infrastructure/filters/domainError.filter";

@Controller("payment")
@UseFilters(DomainErrorFilter)
export class PaymentController {
	constructor(private readonly paymentService: PaymentService) {}

	@Post("methods")
	@ApiCreatedResponse({ type: paymentSchemas.PaymentMethodDto })
	@ApiConflictResponse()
	paymentMethodCreate(@Body() body: paymentSchemas.PaymentMethodDto) {
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
}
