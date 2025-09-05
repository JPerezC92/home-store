import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
	IsArray,
	IsIn,
	IsNumber,
	IsOptional,
	IsString,
	ValidateNested,
} from "class-validator";

import {
	INCOME_DB_FIELDS,
	IncomeField,
} from "#payment/infrastructure/IncomeCriteria";
import { Operator } from "#shared/domain/criteria/FilterOperator";
import { OrderTypeEnum } from "#shared/domain/criteria/OrderType";

export const DEFAULT_FIND_INCOMES_BY_CRITERIA: FindIncomesByCriteriaDTO = {
	filters: [{ field: "amount", operator: Operator.GT, value: "0" }],
	orderBy: "amount",
	orderType: OrderTypeEnum.ASC,
	limit: 20,
	offset: 0,
};

export class FilterDto {
	@ApiProperty({
		enum: INCOME_DB_FIELDS,
	})
	@IsString()
	@IsIn(INCOME_DB_FIELDS)
	field: IncomeField;

	@ApiProperty()
	@IsString()
	operator: Operator;

	@ApiProperty()
	@IsString()
	value: string;
}

export class PaginationDto {
	@ApiProperty({ required: false, example: 20 })
	@IsOptional()
	@IsNumber()
	limit?: number;

	@ApiProperty({ required: false, example: 10 })
	@IsOptional()
	@IsNumber()
	offset?: number;
}

export class FindIncomesByCriteriaDTO extends PaginationDto {
	@ApiProperty({
		type: [FilterDto],
		example: [{ field: "amount", operator: "GT", value: "0" }],
	})
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => FilterDto)
	filters: FilterDto[];

	@ApiProperty({ required: false, enum: INCOME_DB_FIELDS })
	@IsOptional()
	@IsString()
	@IsIn(INCOME_DB_FIELDS)
	orderBy?: string;

	@ApiProperty({ required: false, enum: ["asc", "desc"] })
	@IsOptional()
	@IsString()
	orderType?: OrderTypeEnum;
}
