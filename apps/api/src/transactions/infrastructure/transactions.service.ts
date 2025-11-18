import { Injectable } from '@nestjs/common';
import { UploadExcelUseCase } from '../application/use-cases/upload-excel.use-case';
import { GetTransactionsUseCase } from '../application/use-cases/get-transactions.use-case';
import { GetStatisticsUseCase } from '../application/use-cases/get-statistics.use-case';
import { GetUploadHistoryUseCase } from '../application/use-cases/get-upload-history.use-case';
import { Transaction } from '../domain/entities/transaction.entity';
import type { TransactionFilters, UploadResult } from '@repo/api';
import type { DbUploadHistory } from '@repo/database';

@Injectable()
export class TransactionsService {
  constructor(
    private readonly uploadExcelUseCase: UploadExcelUseCase,
    private readonly getTransactionsUseCase: GetTransactionsUseCase,
    private readonly getStatisticsUseCase: GetStatisticsUseCase,
    private readonly getUploadHistoryUseCase: GetUploadHistoryUseCase,
  ) {}

  async validateExcelFile(
    fileBuffer: Buffer,
    fileName: string,
  ): Promise<UploadResult> {
    return await this.uploadExcelUseCase.validateFile(fileBuffer, fileName);
  }

  async confirmUpload(
    fileBuffer: Buffer,
    fileName: string,
  ): Promise<{ savedCount: number; uploadHistoryId: number }> {
    return await this.uploadExcelUseCase.confirmUpload(fileBuffer, fileName);
  }

  async findAll(filters?: TransactionFilters): Promise<Transaction[]> {
    return await this.getTransactionsUseCase.execute(filters);
  }

  async findById(id: number): Promise<Transaction | null> {
    return await this.getTransactionsUseCase.getById(id);
  }

  async getCount(filters?: TransactionFilters): Promise<number> {
    return await this.getTransactionsUseCase.getCount(filters);
  }

  async getStatistics(): Promise<{
    totalTransactions: number;
    totalReceived: number;
    totalPaid: number;
    totalReceivedAmount: number;
    totalPaidAmount: number;
    balance: number;
  }> {
    return await this.getStatisticsUseCase.execute();
  }

  async getUploadHistory(): Promise<DbUploadHistory[]> {
    return await this.getUploadHistoryUseCase.execute();
  }
}
