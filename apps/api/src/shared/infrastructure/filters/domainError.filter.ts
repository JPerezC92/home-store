import {
	ArgumentsHost,
	BadRequestException,
	Catch,
	ConflictException,
	ExceptionFilter,
	InternalServerErrorException,
	HttpException as NestHttpException,
	NotFoundException,
} from "@nestjs/common";
import { Request, Response } from "express";

import { ExcelFileInvalidHeaders } from "#payment/domain/errors/ExcelFileInvalidHeaders";
import { ExcelFileNoValidPayments } from "#payment/domain/errors/ExcelFileNoValidPayments";
import { ExcelFileWorksheetNotFound } from "#payment/domain/errors/ExcelFileWorksheetNotFound";
import { PaymentMethodAlreadyExists } from "#payment/domain/errors/PaymentMethodAlreadyExists";
import { PaymentMethodNotFound } from "#payment/domain/errors/PaymentMethodNotFound";
import { DomainError } from "#shared/domain/DomainError";
import { ErrorCodes } from "#shared/domain/ErrorCodes";

type ExceptionType = new (
	objectOrError?: unknown,
	description?: string | undefined
) => NestHttpException;

const errorCodeToHttpExceptionMap: Record<ErrorCodes, ExceptionType> = {
	[PaymentMethodAlreadyExists.code]: ConflictException,
	[PaymentMethodNotFound.code]: NotFoundException,
	[ExcelFileWorksheetNotFound.code]: BadRequestException,
	[ExcelFileInvalidHeaders.code]: BadRequestException,
	[ExcelFileNoValidPayments.code]: BadRequestException,
};

@Catch(DomainError)
export class DomainErrorFilter implements ExceptionFilter {
	catch(exception: DomainError, host: ArgumentsHost) {
		const httpContext = host.switchToHttp();
		const response = httpContext.getResponse<Response>();
		const request = httpContext.getRequest<Request>();
		const errorCode = exception.code;

		const httpExceptionType = errorCodeToHttpExceptionMap[errorCode];

		if (!httpExceptionType) {
			throw new InternalServerErrorException("Domain error not catch");
		}

		throw new httpExceptionType(exception.message);
	}
}
