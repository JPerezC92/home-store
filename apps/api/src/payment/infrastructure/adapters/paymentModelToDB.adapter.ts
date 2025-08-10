import { PaymentMethod } from "src/payment/domain/PaymentMethod.model";

import { PaymentMethodDB } from "#database/infrastructure/prisma/client";

export function paymentModelToDB(
	paymentMethod: PaymentMethod
): PaymentMethodDB {
	return {
		payment_method_id: paymentMethod.paymentMethodId,
		name: paymentMethod.name,
		active: paymentMethod.active,
		created_at: paymentMethod.createdAt,
		updated_at: paymentMethod.updatedAt,
	};
}
