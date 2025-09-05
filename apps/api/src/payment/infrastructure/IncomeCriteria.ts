import { IncomeDB } from "#database/infrastructure/prisma/client";
import { BaseCriteria } from "#shared/domain/criteria/BaseCriteria";
import { FilterOperator } from "#shared/domain/criteria/FilterOperator";
import { Order } from "#shared/domain/criteria/Order";
import { OrderBy } from "#shared/domain/criteria/OrderBy";
import { OrderType, OrderTypeEnum } from "#shared/domain/criteria/OrderType";

export type IncomeField = keyof IncomeDB;

export const INCOME_DB_FIELDS = [
	"payment_method_id",
	"updated_at",
	"created_at",
	"transaction_date",
	"payment_note",
	"sender_name",
	"amount",
	"income_id",
] as const satisfies ReadonlyArray<keyof IncomeDB>;

type FilterValueType<T> = T extends number
	? number
	: T extends Date
	? Date
	: string;

type FieldTypeMap = {
	[K in keyof IncomeDB]: {
		field: K;
		operator: FilterOperator;
		value: FilterValueType<IncomeDB[K]>;
	};
};

export type IncomeFilter = FieldTypeMap[IncomeField];

export class IncomeCriteria extends BaseCriteria<IncomeFilter> {
	static create(
		filters: IncomeFilter[],
		orderBy?: string,
		orderType?: OrderTypeEnum,
		limit?: number,
		offset?: number
	): IncomeCriteria {
		return new IncomeCriteria(
			filters,
			orderBy && orderType
				? new Order(new OrderBy(orderBy), new OrderType(orderType))
				: Order.none(),
			limit,
			offset
		);
	}
}
