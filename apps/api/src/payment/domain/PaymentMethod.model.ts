import * as crypto from "node:crypto";

export interface PaymentMethodProps {
	paymentMethodId: string;
	name: string;
	active: boolean;
	createdAt: Date;
	updatedAt: Date;
}

export class PaymentMethod {
	readonly paymentMethodId: string;
	readonly name: string;
	readonly active: boolean;
	readonly createdAt: Date;
	readonly updatedAt: Date;

	constructor(props: PaymentMethodProps) {
		this.paymentMethodId = props.paymentMethodId;
		this.name = props.name;
		this.active = props.active;
		this.createdAt = props.createdAt;
		this.updatedAt = props.updatedAt;
	}

	static create(
		props: Omit<
			PaymentMethodProps,
			"paymentMethodId" | "createdAt" | "updatedAt"
		>
	) {
		return new PaymentMethod({
			paymentMethodId: crypto.randomUUID(),
			createdAt: new Date(),
			updatedAt: new Date(),
			name: props.name,
			active: props.active,
		});
	}
}
