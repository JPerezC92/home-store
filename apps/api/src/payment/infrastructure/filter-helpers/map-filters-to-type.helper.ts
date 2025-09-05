import { DbFieldType } from "#database/infrastructure/constants/db-field-type.constant";
import {
	FilterOperator,
	Operator,
} from "#shared/domain/criteria/FilterOperator";

/**
 * Maps filter DTOs to typed filters using a field type map.
 */
export function mapFiltersToType<
	TFilterDto extends { field: string; value: unknown; operator: unknown },
	TFilter
>(filters: TFilterDto[], fieldTypeMap: Record<string, DbFieldType>): TFilter[] {
	return filters.map((dto) => {
		const type = fieldTypeMap[dto.field];

		if (!type) throw new Error(`Unknown field: ${dto.field}`);

		let value: string | number | Date;
		switch (type) {
			case DbFieldType.Number:
				value = Number(dto.value);
				break;
			case DbFieldType.Date:
				value = new Date(dto.value as string);
				break;
			case DbFieldType.String:
				value = String(dto.value);
				break;
			default:
				throw new Error(`Unknown type for field: ${dto.field}`);
		}
		return {
			field: dto.field,
			operator: new FilterOperator(dto.operator as Operator),
			value,
		} as TFilter;
	});
}
