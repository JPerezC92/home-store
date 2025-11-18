import { z } from 'zod';

// Excel row schema (raw data from Excel)
export const excelRowSchema = z.object({
  'Tipo de Transacción': z.string().min(1, 'Transaction type is required'),
  Origen: z.string().min(1, 'Origin is required'),
  Destino: z.string().min(1, 'Destination is required'),
  Monto: z.string().or(z.number()),
  Mensaje: z.string().optional(),
  'Fecha de operación': z.string().min(1, 'Operation date is required'),
});

// Transaction creation schema
export const createTransactionSchema = z.object({
  transactionType: z.string().min(1),
  origin: z.string().min(1),
  destination: z.string().min(1),
  amount: z.number().positive('Amount must be positive'),
  message: z.string().nullable().optional(),
  operationDate: z.coerce.date(),
  phoneNumber: z.string().nullable().optional(),
  status: z.string().nullable().optional(),
});

// Transaction update schema
export const updateTransactionSchema = createTransactionSchema.partial();

// Transaction filters schema
export const transactionFiltersSchema = z.object({
  transactionType: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  minAmount: z.coerce.number().positive().optional(),
  maxAmount: z.coerce.number().positive().optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

// Upload result schema
export const uploadResultSchema = z.object({
  totalRecords: z.number().int(),
  validRecords: z.number().int(),
  invalidRecords: z.number().int(),
  duplicateRecords: z.number().int(),
  skippedEmptyRows: z.number().int().default(0),
  skippedRowDetails: z.array(
    z.object({
      row: z.number(),
      reason: z.string(),
    })
  ).default([]),
  duplicates: z.array(
    z.object({
      row: z.number(),
      data: excelRowSchema,
      reason: z.string(),
      originalRow: z.number(),
      originalData: excelRowSchema,
    })
  ),
  errors: z.array(
    z.object({
      row: z.number(),
      error: z.string(),
    })
  ),
});

// Export types
export type ExcelRow = z.infer<typeof excelRowSchema>;
export type CreateTransaction = z.infer<typeof createTransactionSchema>;
export type UpdateTransaction = z.infer<typeof updateTransactionSchema>;
export type TransactionFilters = z.infer<typeof transactionFiltersSchema>;
export type UploadResult = z.infer<typeof uploadResultSchema>;
