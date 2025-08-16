import { DateTime } from "luxon";
import { z } from "zod";

export const YapeExcelRawRowSchema = z.object({
	"Tipo de Transacción": z.string(),
	Origen: z.string(),
	Destino: z.string(),
	Monto: z.string().or(z.number()),
	Mensaje: z.string().optional(),
	"Fecha de operación": z.string().or(z.date()),
	Estado: z.string().optional(),
});

export type YapeExcelRawRow = z.infer<typeof YapeExcelRawRowSchema>;

const preprocessAmount = z.preprocess(
	(value) => (value ? value : undefined),
	z.coerce.number().gt(0)
);

export const YapeExcelRowSchema = z
	.object({
		"Tipo de Transacción": z.string(),
		Origen: z.string(),
		Destino: z.string(),
		Monto: z.string().transform((value) => preprocessAmount.parse(value)),
		Mensaje: z.string().or(z.null()).default(""),
		"Fecha de operación": z
			.string()
			.transform((dateString) =>
				DateTime.fromFormat(dateString, "dd/MM/yyyy HH:mm:ss")
			),
	})
	.check((context) => {
		const amount = context.value.Monto;
		const operationDate = context.value["Fecha de operación"];
		if (amount < 0) {
			context.issues.push({
				code: "custom",
				message: "Monto should be greater than 0",
				input: amount,
				path: ["Monto"],
			});
		}

		if (!operationDate.isValid) {
			context.issues.push({
				code: "custom",
				message: `Invalid date format for 'Fecha de operación': ${operationDate.invalidReason}`,
				input: operationDate,
				path: ["Fecha de operación"],
			});
		}
	});

export const YapePaymentDtoSchema = YapeExcelRowSchema.transform((data) => {
	return {
		transactionType: data["Tipo de Transacción"],
		origin: data.Origen,
		destination: data.Destino,
		amount: Number(data.Monto),
		message: data.Mensaje ?? "",
		operationDate:
			data["Fecha de operación"].toISO() ?? new Date().toISOString(),
	};
});

export type YapePaymentDto = z.infer<typeof YapePaymentDtoSchema>;

export const YAPE_EXCEL_HEADERS = z.tuple([
	z.literal("Tipo de Transacción"),
	z.literal("Origen"),
	z.literal("Destino"),
	z.literal("Monto"),
	z.literal("Mensaje"),
	z.literal("Fecha de operación"),
]);
