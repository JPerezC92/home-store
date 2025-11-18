// Transaction entity interface (shared TypeScript type)
export interface Transaction {
  id: number;
  transactionType: string;
  origin: string;
  destination: string;
  amount: number;
  message: string | null;
  operationDate: Date;
  phoneNumber: string | null;
  status: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// Upload history entity interface
export interface UploadHistory {
  id: number;
  fileName: string;
  phoneNumber: string | null;
  totalRecords: number;
  successfulRecords: number;
  failedRecords: number;
  duplicateRecords: number;
  errors: string | null;
  uploadDate: Date;
}

// Response types
export type TransactionResponse = Transaction;
export type TransactionListResponse = Transaction[];
export type UploadHistoryResponse = UploadHistory;
export type UploadHistoryListResponse = UploadHistory[];
