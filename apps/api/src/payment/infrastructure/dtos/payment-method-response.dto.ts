import { ApiProperty } from "@nestjs/swagger";

export class PaymentMethodResponseDto {
	@ApiProperty({ description: "Unique identifier for the payment method" })
	paymentMethodId: string;

	@ApiProperty({ description: "Name of the payment method" })
	name: string;

	@ApiProperty({ description: "Whether the payment method is active" })
	active: boolean;

	@ApiProperty({ description: "Date when the payment method was created" })
	createdAt: Date;

	@ApiProperty({
		description: "Date when the payment method was last updated",
	})
	updatedAt: Date;

	constructor(partial: Partial<PaymentMethodResponseDto>) {
		Object.assign(this, partial);
	}
}

export class PaymentMethodListResponseDto {
	@ApiProperty({
		type: [PaymentMethodResponseDto],
		description: "List of payment methods",
	})
	data: PaymentMethodResponseDto[];

	constructor(data: PaymentMethodResponseDto[]) {
		this.data = data;
	}
}
