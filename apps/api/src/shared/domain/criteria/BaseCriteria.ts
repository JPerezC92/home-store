import { Order } from "./Order";

export class BaseCriteria<TFilter = {}> {
	constructor(
		readonly filters: TFilter[],
		readonly order: Order,
		readonly limit?: number,
		readonly offset?: number
	) {}

	hasFilters(): boolean {
		return this.filters.length > 0;
	}
}
