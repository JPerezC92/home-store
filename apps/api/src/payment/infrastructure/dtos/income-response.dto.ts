import { ApiProperty } from "@nestjs/swagger";

export class IncomeResponseDto {
	@ApiProperty({ description: "Unique identifier for the income record" })
	incomeId: string;

	@ApiProperty({ description: "Name of the sender" })
	senderName: string;

	@ApiProperty({ description: "Amount of the income" })
	amount: number;

	@ApiProperty({
		description: "Payment note or description",
		required: false,
	})
	paymentNote?: string;

	@ApiProperty({ description: "Date of the transaction" })
	transactionDate: Date;

	@ApiProperty({
		description: "Payment method details",
		type: "object",
		properties: {
			paymentMethodId: { type: "string" },
			name: { type: "string" },
			active: { type: "boolean" },
			createdAt: { type: "string", format: "date-time" },
			updatedAt: { type: "string", format: "date-time" },
		},
	})
	paymentMethod: {
		paymentMethodId: string;
		name: string;
		active: boolean;
		createdAt: Date;
		updatedAt: Date;
	};

	@ApiProperty({ description: "Date when the record was created" })
	createdAt: Date;

	@ApiProperty({ description: "Date when the record was last updated" })
	updatedAt: Date;
}

export class IncomeListResponseDto {
	@ApiProperty({
		type: [IncomeResponseDto],
		description: "List of income records",
	})
	data: IncomeResponseDto[];

	@ApiProperty({
		description: "Total count of records matching the criteria",
		required: false,
	})
	total?: number;
}
