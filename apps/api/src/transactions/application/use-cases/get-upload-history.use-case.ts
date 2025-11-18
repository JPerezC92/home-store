import { Injectable } from '@nestjs/common';
import { TransactionRepository } from '../../infrastructure/repositories/transaction.repository';
import type { DbUploadHistory } from '@repo/database';

@Injectable()
export class GetUploadHistoryUseCase {
  constructor(
    private readonly transactionRepository: TransactionRepository,
  ) {}

  async execute(): Promise<DbUploadHistory[]> {
    return await this.transactionRepository.getUploadHistory();
  }
}
