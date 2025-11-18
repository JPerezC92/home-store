import { Injectable } from '@nestjs/common';
import { TransactionRepository } from '../../infrastructure/repositories/transaction.repository';

@Injectable()
export class GetStatisticsUseCase {
  constructor(
    private readonly transactionRepository: TransactionRepository,
  ) {}

  async execute(): Promise<{
    totalTransactions: number;
    totalReceived: number;
    totalPaid: number;
    totalReceivedAmount: number;
    totalPaidAmount: number;
    balance: number;
  }> {
    return await this.transactionRepository.getStatistics();
  }
}
