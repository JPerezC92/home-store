import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

// Transactions table schema
export const transactions = sqliteTable('transactions', {
  id: integer('id').primaryKey({ autoIncrement: true }),

  // Transaction details
  transactionType: text('transaction_type').notNull(), // "TE PAGÓ", "PAGASTE", etc.
  origin: text('origin').notNull(),
  destination: text('destination').notNull(),
  amount: real('amount').notNull(),
  message: text('message'),

  // Metadata
  operationDate: integer('operation_date', { mode: 'timestamp' }).notNull(),
  phoneNumber: text('phone_number'), // Extracted from filename
  status: text('status'),

  // Audit fields
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
});

// Upload history table schema
export const uploadHistory = sqliteTable('upload_history', {
  id: integer('id').primaryKey({ autoIncrement: true }),

  fileName: text('file_name').notNull(),
  phoneNumber: text('phone_number'),
  totalRecords: integer('total_records').notNull(),
  successfulRecords: integer('successful_records').notNull(),
  failedRecords: integer('failed_records').notNull(),
  duplicateRecords: integer('duplicate_records').notNull().default(0),
  errors: text('errors'), // JSON string of errors

  uploadDate: integer('upload_date', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
});

// Drizzle ORM types (for internal database operations)
export type DbTransaction = typeof transactions.$inferSelect;
export type NewDbTransaction = typeof transactions.$inferInsert;

export type DbUploadHistory = typeof uploadHistory.$inferSelect;
export type NewDbUploadHistory = typeof uploadHistory.$inferInsert;
