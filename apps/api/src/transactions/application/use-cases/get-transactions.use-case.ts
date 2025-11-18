import { Injectable } from '@nestjs/common';
import { TransactionRepository } from '../../infrastructure/repositories/transaction.repository';
import { Transaction } from '../../domain/entities/transaction.entity';
import type { TransactionFilters } from '@repo/api';

@Injectable()
export class GetTransactionsUseCase {
  constructor(
    private readonly transactionRepository: TransactionRepository,
  ) {}

  async execute(filters?: TransactionFilters): Promise<Transaction[]> {
    return await this.transactionRepository.findAll(filters);
  }

  async getById(id: number): Promise<Transaction | null> {
    return await this.transactionRepository.findById(id);
  }

  async getCount(filters?: TransactionFilters): Promise<number> {
    return await this.transactionRepository.count(filters);
  }
}
