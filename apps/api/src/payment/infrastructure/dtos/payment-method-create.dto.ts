import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { MinLength } from "class-validator";

export class PaymentMethodCreateDto {
	static nameMinLength = 1;

	@ApiProperty({
		minLength: PaymentMethodCreateDto.nameMinLength,
		example: "Cash",
	})
	@MinLength(PaymentMethodCreateDto.nameMinLength)
	name: string;

	@ApiProperty()
	@Type(() => Boolean)
	active: boolean;
}
