import { Module } from '@nestjs/common';
import { DATABASE_CONNECTION } from '@repo/database';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { TransactionRepository } from './repositories/transaction.repository';
import { TRANSACTION_REPOSITORY } from '../domain/repositories/transaction.repository.interface';
import { ExcelParserService } from './parsers/excel-parser.service';
import { UploadExcelUseCase } from '../application/use-cases/upload-excel.use-case';
import { GetTransactionsUseCase } from '../application/use-cases/get-transactions.use-case';
import { GetStatisticsUseCase } from '../application/use-cases/get-statistics.use-case';
import { GetUploadHistoryUseCase } from '../application/use-cases/get-upload-history.use-case';

@Module({
  controllers: [TransactionsController],
  providers: [
    TransactionsService,
    ExcelParserService,
    // Repository
    {
      provide: TRANSACTION_REPOSITORY,
      useFactory: (database) => new TransactionRepository(database),
      inject: [DATABASE_CONNECTION],
    },
    {
      provide: TransactionRepository,
      useFactory: (database) => new TransactionRepository(database),
      inject: [DATABASE_CONNECTION],
    },
    // Use Cases
    {
      provide: UploadExcelUseCase,
      useFactory: (excelParser, transactionRepository) =>
        new UploadExcelUseCase(excelParser, transactionRepository),
      inject: [ExcelParserService, TransactionRepository],
    },
    {
      provide: GetTransactionsUseCase,
      useFactory: (transactionRepository) =>
        new GetTransactionsUseCase(transactionRepository),
      inject: [TransactionRepository],
    },
    {
      provide: GetStatisticsUseCase,
      useFactory: (transactionRepository) =>
        new GetStatisticsUseCase(transactionRepository),
      inject: [TransactionRepository],
    },
    {
      provide: GetUploadHistoryUseCase,
      useFactory: (transactionRepository) =>
        new GetUploadHistoryUseCase(transactionRepository),
      inject: [TransactionRepository],
    },
  ],
})
export class TransactionsModule {}
