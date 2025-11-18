/**
 * Transactions API Service
 * Handles all API calls related to transactions
 */

import { apiFetch } from '../config/api';

export interface Transaction {
  id: number;
  transactionType: string;
  origin: string;
  destination: string;
  amount: number;
  message: string | null;
  operationDate: string;
  phoneNumber: string | null;
  status: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Statistics {
  totalTransactions: number;
  totalReceived: number;
  totalPaid: number;
  totalReceivedAmount: number;
  totalPaidAmount: number;
  balance: number;
}

export interface TransactionFilters {
  transactionType?: string;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
  search?: string;
  page?: number;
  limit?: number;
}

/**
 * Fetch all transactions with optional filters
 */
export async function getTransactions(filters?: TransactionFilters): Promise<Transaction[]> {
  const params = new URLSearchParams();

  if (filters?.transactionType) params.append('transactionType', filters.transactionType);
  if (filters?.startDate) params.append('startDate', filters.startDate);
  if (filters?.endDate) params.append('endDate', filters.endDate);
  if (filters?.minAmount !== undefined) params.append('minAmount', filters.minAmount.toString());
  if (filters?.maxAmount !== undefined) params.append('maxAmount', filters.maxAmount.toString());
  if (filters?.search) params.append('search', filters.search);
  if (filters?.page) params.append('page', filters.page.toString());
  if (filters?.limit) params.append('limit', filters.limit.toString());

  const queryString = params.toString();
  const endpoint = queryString ? `/transactions?${queryString}` : '/transactions';

  return apiFetch<Transaction[]>(endpoint);
}

/**
 * Fetch transaction statistics
 */
export async function getStatistics(): Promise<Statistics> {
  return apiFetch<Statistics>('/transactions/statistics');
}

/**
 * Fetch a single transaction by ID
 */
export async function getTransactionById(id: number): Promise<Transaction> {
  return apiFetch<Transaction>(`/transactions/${id}`);
}
