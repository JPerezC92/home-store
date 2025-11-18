import { Transaction } from '../entities/transaction.entity';
import type { TransactionFilters } from '@repo/api';

export const TRANSACTION_REPOSITORY = Symbol('TRANSACTION_REPOSITORY');

export interface TransactionRepositoryInterface {
  create(transaction: Partial<Transaction>): Promise<Transaction>;
  createMany(transactions: Partial<Transaction>[]): Promise<number>;
  findAll(filters?: TransactionFilters): Promise<Transaction[]>;
  findById(id: number): Promise<Transaction | null>;
  findDuplicates(transactions: Partial<Transaction>[]): Promise<Transaction[]>;
  update(id: number, transaction: Partial<Transaction>): Promise<Transaction | null>;
  delete(id: number): Promise<boolean>;
  count(filters?: TransactionFilters): Promise<number>;
  getStatistics(): Promise<{
    totalTransactions: number;
    totalReceived: number;
    totalPaid: number;
    totalReceivedAmount: number;
    totalPaidAmount: number;
    balance: number;
  }>;
}
