import { createZodDto } from 'nestjs-zod';
import {
  createTransactionSchema,
  updateTransactionSchema,
  transactionFiltersSchema,
  uploadResultSchema,
} from '../schemas/transaction-validation.schema';

// DTO for creating a transaction
export class CreateTransactionDto extends createZodDto(createTransactionSchema) {}

// DTO for updating a transaction
export class UpdateTransactionDto extends createZodDto(updateTransactionSchema) {}

// DTO for filtering transactions
export class TransactionFiltersDto extends createZodDto(transactionFiltersSchema) {}

// DTO for upload result
export class UploadResultDto extends createZodDto(uploadResultSchema) {}
