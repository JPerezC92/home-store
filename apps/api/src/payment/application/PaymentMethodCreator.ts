import { PaymentRepository } from "../domain/PaymentRepository";

import { PaymentMethodAlreadyExists } from "#payment/domain/errors/PaymentMethodAlreadyExists";
import { PaymentMethod } from "#payment/domain/PaymentMethod.model";

interface Dependencies {
	PaymentRepository: PaymentRepository;
}

interface Input extends Pick<PaymentMethod, "name" | "active"> {}

export class PaymentMethodCreator {
	constructor(private readonly deps: Dependencies) {}

	async execute({ name, active }: Input) {
		const paymentMethod = await this.deps.PaymentRepository.findByName(
			name
		);

		if (paymentMethod) {
			return new PaymentMethodAlreadyExists();
		}

		return await this.deps.PaymentRepository.createPaymentMethod(
			PaymentMethod.create({ name, active })
		);
	}
}
