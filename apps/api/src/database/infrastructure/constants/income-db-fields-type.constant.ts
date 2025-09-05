import { DbFieldType } from "./db-field-type.constant";

export const incomeDbFieldTypes = {
	income_id: DbFieldType.String,
	amount: DbFieldType.Number,
	sender_name: DbFieldType.String,
	payment_note: DbFieldType.String,
	transaction_date: DbFieldType.Date,
	created_at: DbFieldType.Date,
	updated_at: DbFieldType.Date,
	payment_method_id: DbFieldType.String,
} as const;
