import { Inject } from '@nestjs/common';
import { eq, and, gte, lte, or, like, sql, inArray } from 'drizzle-orm';
import {
  Database,
  DATABASE_CONNECTION,
  transactions,
  DbTransaction,
  uploadHistory,
  DbUploadHistory,
} from '@repo/database';
import { TransactionRepositoryInterface } from '../../domain/repositories/transaction.repository.interface';
import { Transaction } from '../../domain/entities/transaction.entity';
import type { TransactionFilters } from '@repo/api';

export class TransactionRepository implements TransactionRepositoryInterface {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: Database,
  ) {}

  async findAll(filters?: TransactionFilters): Promise<Transaction[]> {
    let query = this.db.select().from(transactions);

    // Apply filters
    const conditions = [];

    if (filters?.transactionType) {
      conditions.push(eq(transactions.transactionType, filters.transactionType));
    }

    if (filters?.startDate) {
      conditions.push(gte(transactions.operationDate, new Date(filters.startDate)));
    }

    if (filters?.endDate) {
      conditions.push(lte(transactions.operationDate, new Date(filters.endDate)));
    }

    if (filters?.minAmount) {
      conditions.push(gte(transactions.amount, filters.minAmount));
    }

    if (filters?.maxAmount) {
      conditions.push(lte(transactions.amount, filters.maxAmount));
    }

    if (filters?.search) {
      const searchPattern = `%${filters.search}%`;
      conditions.push(
        or(
          like(transactions.origin, searchPattern),
          like(transactions.destination, searchPattern),
          like(transactions.message, searchPattern),
        )!,
      );
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions)!) as typeof query;
    }

    // Pagination
    const limit = filters?.limit ?? 20;
    const page = filters?.page ?? 1;
    const offset = (page - 1) * limit;

    const result = await query.limit(limit).offset(offset).orderBy(transactions.operationDate);

    return result.map(this.toDomain);
  }

  async findById(id: number): Promise<Transaction | null> {
    const result = await this.db
      .select()
      .from(transactions)
      .where(eq(transactions.id, id))
      .limit(1);

    if (result.length === 0) {
      return null;
    }

    return this.toDomain(result[0]);
  }

  async create(transactionData: Partial<Transaction>): Promise<Transaction> {
    const result = await this.db
      .insert(transactions)
      .values({
        transactionType: transactionData.transactionType!,
        origin: transactionData.origin!,
        destination: transactionData.destination!,
        amount: transactionData.amount!,
        message: transactionData.message ?? null,
        operationDate: transactionData.operationDate!,
        phoneNumber: transactionData.phoneNumber ?? null,
        status: transactionData.status ?? null,
      })
      .returning();

    return this.toDomain(result[0]);
  }

  async createMany(transactionsData: Partial<Transaction>[]): Promise<number> {
    if (transactionsData.length === 0) return 0;

    const batchSize = 100;
    let totalInserted = 0;

    // Insert in batches to avoid query size limits
    for (let i = 0; i < transactionsData.length; i += batchSize) {
      const batch = transactionsData.slice(i, i + batchSize);

      const values = batch.map((t) => ({
        transactionType: t.transactionType!,
        origin: t.origin!,
        destination: t.destination!,
        amount: t.amount!,
        message: t.message ?? null,
        operationDate: t.operationDate!,
        phoneNumber: t.phoneNumber ?? null,
        status: t.status ?? null,
      }));

      const result = await this.db.insert(transactions).values(values).returning();
      totalInserted += result.length;
    }

    return totalInserted;
  }

  async findDuplicates(transactionsData: Partial<Transaction>[]): Promise<Transaction[]> {
    if (transactionsData.length === 0) return [];

    // For large datasets, check in batches of 100
    const batchSize = 100;
    const allDuplicates: Transaction[] = [];

    for (let i = 0; i < transactionsData.length; i += batchSize) {
      const batch = transactionsData.slice(i, i + batchSize);

      // Build conditions to find duplicates
      const duplicateConditions = batch.map((t) =>
        and(
          eq(transactions.operationDate, t.operationDate!),
          eq(transactions.amount, t.amount!),
          eq(transactions.origin, t.origin!),
          eq(transactions.destination, t.destination!),
        ),
      );

      const result = await this.db
        .select()
        .from(transactions)
        .where(or(...duplicateConditions)!);

      allDuplicates.push(...result.map(this.toDomain));
    }

    return allDuplicates;
  }

  async update(
    id: number,
    transactionData: Partial<Transaction>,
  ): Promise<Transaction | null> {
    const result = await this.db
      .update(transactions)
      .set({
        ...transactionData,
        updatedAt: new Date(),
      })
      .where(eq(transactions.id, id))
      .returning();

    if (result.length === 0) {
      return null;
    }

    return this.toDomain(result[0]);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.db
      .delete(transactions)
      .where(eq(transactions.id, id))
      .returning();

    return result.length > 0;
  }

  async count(filters?: TransactionFilters): Promise<number> {
    const conditions = [];

    if (filters?.transactionType) {
      conditions.push(eq(transactions.transactionType, filters.transactionType));
    }

    if (filters?.startDate) {
      conditions.push(gte(transactions.operationDate, new Date(filters.startDate)));
    }

    if (filters?.endDate) {
      conditions.push(lte(transactions.operationDate, new Date(filters.endDate)));
    }

    let query = this.db
      .select({ count: sql<number>`count(*)` })
      .from(transactions);

    if (conditions.length > 0) {
      query = query.where(and(...conditions)!) as typeof query;
    }

    const result = await query;
    return Number(result[0]?.count ?? 0);
  }

  async getStatistics(): Promise<{
    totalTransactions: number;
    totalReceived: number;
    totalPaid: number;
    totalReceivedAmount: number;
    totalPaidAmount: number;
    balance: number;
  }> {
    const allTransactions = await this.db.select().from(transactions);

    const stats = {
      totalTransactions: allTransactions.length,
      totalReceived: 0,
      totalPaid: 0,
      totalReceivedAmount: 0,
      totalPaidAmount: 0,
      balance: 0,
    };

    allTransactions.forEach((t) => {
      const isReceived = t.transactionType.toLowerCase().includes('pagó');

      if (isReceived) {
        stats.totalReceived++;
        stats.totalReceivedAmount += t.amount;
      } else {
        stats.totalPaid++;
        stats.totalPaidAmount += t.amount;
      }
    });

    stats.balance = stats.totalReceivedAmount - stats.totalPaidAmount;

    return stats;
  }

  // Upload history methods
  async createUploadHistory(data: {
    fileName: string;
    phoneNumber: string | null;
    totalRecords: number;
    successfulRecords: number;
    failedRecords: number;
    duplicateRecords: number;
    errors: string | null;
  }): Promise<DbUploadHistory> {
    const result = await this.db
      .insert(uploadHistory)
      .values(data)
      .returning();

    return result[0];
  }

  async getUploadHistory(): Promise<DbUploadHistory[]> {
    return await this.db
      .select()
      .from(uploadHistory)
      .orderBy(uploadHistory.uploadDate);
  }

  // Helper method to convert database model to domain entity
  private toDomain(dbTransaction: DbTransaction): Transaction {
    return new Transaction(
      dbTransaction.id,
      dbTransaction.transactionType,
      dbTransaction.origin,
      dbTransaction.destination,
      dbTransaction.amount,
      dbTransaction.message,
      dbTransaction.operationDate,
      dbTransaction.phoneNumber,
      dbTransaction.status,
      dbTransaction.createdAt,
      dbTransaction.updatedAt,
    );
  }
}
