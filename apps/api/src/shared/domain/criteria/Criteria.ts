import { Filter } from "./Filter";
import { Order } from "./Order";

export class Criteria {
	constructor(
		readonly filters: Filter[],
		readonly order: Order,
		readonly limit?: number,
		readonly offset?: number
	) {}

	hasFilters(): boolean {
		return this.filters.length > 0;
	}
}
