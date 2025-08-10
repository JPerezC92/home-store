import {
	ArgumentsHost,
	Catch,
	ConflictException,
	ExceptionFilter,
	InternalServerErrorException,
	NotFoundException,
} from "@nestjs/common";
import { Request, Response } from "express";

import {
	DomainError,
	PaymentMethodAlreadyExists,
} from "#shared/domain/DomainError";

const errorCodeToHttpExceptionMap = new Map([
	[PaymentMethodAlreadyExists.code, ConflictException],
]);

@Catch(DomainError)
export class DomainErrorFilter implements ExceptionFilter {
	catch(exception: DomainError, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		const request = ctx.getRequest<Request>();
		const domainErrorCode = exception.code;

		const exceptionFilter =
			errorCodeToHttpExceptionMap.get(domainErrorCode);

		if (!exceptionFilter) {
			throw new InternalServerErrorException("Domain error not catch");
		}

		throw new exceptionFilter(exception.message);
	}
}
