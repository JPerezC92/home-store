export enum Operator {
	EQUALS = "EQUALS",
	NOT_EQUAL = "NOT_EQUAL",
	GT = "GT",
	GTE = "GTE",
	LT = "LT",
	LTE = "LTE",
	CONTAINS = "CONTAINS",
	NOT_CONTAINS = "NOT_CONTAINS",
}

export class FilterOperator {
	static fromValue(value: string): Operator {
		for (const key of Object.keys(Operator)) {
			if (key === value) {
				return Operator[key as keyof typeof Operator];
			}
		}

		throw new Error(`Unsupported operator value: ${value}`);
	}

	constructor(readonly value: Operator) {}

	isPositive(): boolean {
		return (
			this.value !== Operator.NOT_EQUAL &&
			this.value !== Operator.NOT_CONTAINS
		);
	}

	isContaining(): boolean {
		return (
			this.value === Operator.CONTAINS ||
			this.value === Operator.NOT_CONTAINS
		);
	}
}
