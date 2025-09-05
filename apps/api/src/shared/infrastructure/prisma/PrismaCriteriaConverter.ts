import { Criteria } from "#shared/domain/criteria/Criteria";
import { Filter } from "#shared/domain/criteria/Filter";
import { Operator } from "#shared/domain/criteria/FilterOperator";

interface PrismaFilter {
	[key: string]: { [key: string]: unknown } | unknown;
}

export class PrismaCriteriaConverter {
	private filterTransformers: Map<Operator, (filter: Filter) => PrismaFilter>;

	constructor() {
		this.filterTransformers = new Map<
			Operator,
			(filter: Filter) => PrismaFilter
		>([
			[Operator.EQUALS, this.equalFilter],
			[Operator.NOT_EQUAL, this.notEqualFilter],
			[Operator.GT, this.greaterThanFilter],
			[Operator.GTE, this.greaterThanOrEqualFilter],
			[Operator.LT, this.lessThanFilter],
			[Operator.LTE, this.lessThanOrEqualFilter],
			[Operator.CONTAINS, this.containsFilter],
			[Operator.NOT_CONTAINS, this.notContainsFilter],
		]);
	}

	public convert(criteria: Criteria): {
		where?: PrismaFilter;
		orderBy?: { [key: string]: "asc" | "desc" };
		take?: number;
		skip?: number;
	} {
		const query: {
			where?: PrismaFilter;
			orderBy?: { [key: string]: "asc" | "desc" };
			take?: number;
			skip?: number;
		} = {};

		if (criteria.hasFilters()) {
			query.where = this.generateFilters(criteria.filters);
		}

		if (criteria.order.isNone() === false && criteria.order.orderBy.value) {
			query.orderBy = {
				[criteria.order.orderBy.value]:
					criteria.order.orderType.value.toLowerCase() as
						| "asc"
						| "desc",
			};
		}

		if (criteria.limit) {
			query.take = criteria.limit;
		}

		if (criteria.offset) {
			query.skip = criteria.offset;
		}

		return query;
	}

	protected generateFilters(filters: Filter[]): PrismaFilter {
		const filter = filters.map((filter) => {
			const transformer = this.filterTransformers.get(
				filter.operator.value
			);

			if (!transformer) {
				throw new Error(
					`Unexpected operator value ${filter.operator.value}`
				);
			}

			return transformer(filter);
		});

		return { AND: filter };
	}

	// No need for convertValue; values are already typed

	private equalFilter = (filter: Filter): PrismaFilter => {
		const field = filter.field;
		const value = filter.value;
		return { [field]: { equals: value } };
	};

	private notEqualFilter = (filter: Filter): PrismaFilter => {
		const field = filter.field;
		const value = filter.value;
		return { [field]: { not: value } };
	};

	private greaterThanFilter = (filter: Filter): PrismaFilter => {
		const field = filter.field;
		const value = filter.value;
		return { [field]: { gt: value } };
	};

	private greaterThanOrEqualFilter = (filter: Filter): PrismaFilter => {
		const field = filter.field;
		const value = filter.value;
		return { [field]: { gte: value } };
	};

	private lessThanFilter = (filter: Filter): PrismaFilter => {
		const field = filter.field;
		const value = filter.value;
		return { [field]: { lt: value } };
	};

	private lessThanOrEqualFilter = (filter: Filter): PrismaFilter => {
		const field = filter.field;
		const value = filter.value;
		return { [field]: { lte: value } };
	};

	private containsFilter = (filter: Filter): PrismaFilter => {
		const field = filter.field;
		const value = filter.value;
		return {
			[field]: {
				contains: value,
				mode: "insensitive",
			},
		};
	};

	private notContainsFilter = (filter: Filter): PrismaFilter => {
		const field = filter.field;
		const value = filter.value;
		return {
			[field]: {
				not: { contains: value, mode: "insensitive" },
			},
		};
	};
}
