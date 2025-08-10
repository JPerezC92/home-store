import { Body, Controller, Post, UseFilters } from "@nestjs/common";
import { ApiConflictResponse, ApiCreatedResponse } from "@nestjs/swagger";

import { PaymentService } from "./payment.service";
import * as paymentSchemas from "./schemas/paymentMethod.schema";

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
}
