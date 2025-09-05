import { FilterOperator } from "#shared/domain/criteria/FilterOperator";

export interface Filter<F = string, O = FilterOperator, V = unknown> {
	field: F;
	operator: O;
	value: V;
}
