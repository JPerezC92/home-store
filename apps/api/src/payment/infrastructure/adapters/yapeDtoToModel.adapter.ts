import { Income } from "#payment/domain/Income.model";
import { PaymentMethod } from "#payment/domain/PaymentMethod.model";
import { YapePaymentDto } from "#payment/infrastructure/dtos/yape-payment-excel.dto";

/**
 * Converts a YapePaymentDto to an Income domain model
 */
export function yapePaymentDtoToModel(
	dto: YapePaymentDto,
	paymentMethod: PaymentMethod
): Income {
	return Income.create({
		senderName: dto.origin,
		amount: dto.amount,
		paymentNote: dto.message,
		transactionDate: new Date(dto.operationDate),
		paymentMethod,
	});
}
