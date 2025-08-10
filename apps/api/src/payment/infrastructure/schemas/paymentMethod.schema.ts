import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { MinLength } from "class-validator";

export class PaymentMethodDto {
	static nameMinLength = 1;

	@ApiProperty({ minLength: PaymentMethodDto.nameMinLength, example: "Cash" })
	@MinLength(PaymentMethodDto.nameMinLength)
	name: string;

	@ApiProperty()
	@Type(() => Boolean)
	active: boolean;
}
