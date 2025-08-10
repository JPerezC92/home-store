import { PaymentRepository } from "../domain/PaymentRepository";

import { PaymentMethod } from "#payment/domain/PaymentMethod.model";
import { PaymentMethodAlreadyExists } from "#shared/domain/DomainError";

interface Dependencies {
	PaymentRepository: PaymentRepository;
}

interface Input extends Pick<PaymentMethod, "name" | "active"> {}

export function PaymentMethodCreator({ PaymentRepository }: Dependencies) {
	return {
		async execute({ name, active }: Input) {
			const paymentMethod = await PaymentRepository.findByName(name);

			if (paymentMethod) {
				return new PaymentMethodAlreadyExists();
			}

			return await PaymentRepository.createPaymentMethod(
				PaymentMethod.create({ name, active })
			);
		},
	};
}
