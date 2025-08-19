import * as crypto from "node:crypto";

import { PaymentMethod } from "./PaymentMethod.model";

export interface IncomeProps {
	incomeId: string;
	senderName: string;
	amount: number;
	paymentNote: string;
	transactionDate: Date; // The date when the payment/transaction actually occurred (from Excel)
	paymentMethod: PaymentMethod;
	createdAt: Date; // When the record was created in our system
	updatedAt: Date; // When the record was last updated in our system
}

export class Income {
	readonly incomeId: string;
	readonly senderName: string;
	readonly amount: number;
	readonly paymentNote: string;
	readonly transactionDate: Date;
	readonly paymentMethod: PaymentMethod;
	readonly createdAt: Date;
	readonly updatedAt: Date;

	constructor(props: IncomeProps) {
		this.incomeId = props.incomeId;
		this.senderName = props.senderName;
		this.amount = props.amount;
		this.paymentNote = props.paymentNote;
		this.transactionDate = props.transactionDate;
		this.paymentMethod = props.paymentMethod;
		this.createdAt = props.createdAt;
		this.updatedAt = props.updatedAt;
	}

	static create(
		props: Omit<IncomeProps, "incomeId" | "createdAt" | "updatedAt">
	) {
		return new Income({
			incomeId: crypto.randomUUID(),
			createdAt: new Date(),
			updatedAt: new Date(),
			...props,
		});
	}
}
