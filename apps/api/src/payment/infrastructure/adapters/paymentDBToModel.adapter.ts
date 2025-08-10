import { PaymentMethod } from "src/payment/domain/PaymentMethod.model";

import { PaymentMethodDB } from "#database/infrastructure/prisma/client";

export function paymentMethodDBToModel(
	paymentMethodDB: PaymentMethodDB
): PaymentMethod {
	return new PaymentMethod({
		paymentMethodId: paymentMethodDB.payment_method_id,
		name: paymentMethodDB.name,
		active: paymentMethodDB.active,
		createdAt: paymentMethodDB.created_at,
		updatedAt: paymentMethodDB.updated_at,
	});
}
