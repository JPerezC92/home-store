import { DateTime } from "luxon";

import { FilterDto } from "#payment/infrastructure/dtos/find-incomes-by-criteria.dto";
import { Operator } from "#shared/domain/criteria/FilterOperator";

/**
 * Expands a single date filter into a range covering the entire day.
 * If only one filter for a date field exists, returns two filters: one for the start of the day and one for the end of the day.
 */
export function dateFilterExpander(
	filters: FilterDto[],
	fieldsType: Record<string, "string" | "number" | "Date">
): FilterDto[] {
	const result: FilterDto[] = [];
	const dateFieldCounts: Record<string, number> = {};

	for (const filter of filters) {
		if (fieldsType[filter.field] === "Date") {
			dateFieldCounts[filter.field] =
				(dateFieldCounts[filter.field] || 0) + 1;
		}
	}

	for (const filter of filters) {
		if (
			fieldsType[filter.field] === "Date" &&
			dateFieldCounts[filter.field] === 1
		) {
			const date = DateTime.fromISO(String(filter.value), {
				zone: "utc",
			});
			const start = date.startOf("day");
			const end = start.plus({ days: 1 });

			if (!date.isValid || !start.isValid || !end.isValid) {
				throw new Error(`Invalid date: ${filter.value}`);
			}

			result.push({
				field: filter.field,
				operator: Operator.GTE,
				value: start.toISO(),
			});
			result.push({
				field: filter.field,
				operator: Operator.LT,
				value: end.toISO(),
			});
		} else {
			result.push(filter);
		}
	}

	return result;
}
