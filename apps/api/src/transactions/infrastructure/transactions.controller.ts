import {
  Controller,
  Get,
  Post,
  Query,
  Param,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  ParseIntPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { TransactionsService } from './transactions.service';
import { Transaction } from '../domain/entities/transaction.entity';
import { TransactionFiltersDto } from '@repo/api';
import { Express } from 'express';

@ApiTags('transactions')
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post('upload/validate')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({
    summary: 'Validate Excel file and preview duplicates',
    description:
      'Upload an Excel file for validation. Returns a preview of valid records, duplicates, and errors without saving to database.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Excel file (.xlsx)',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Validation result with duplicates and errors',
  })
  @ApiResponse({ status: 400, description: 'Invalid file or format' })
  async validateUpload(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    if (
      !file.mimetype.includes('spreadsheet') &&
      !file.originalname.endsWith('.xlsx')
    ) {
      throw new BadRequestException('File must be an Excel file (.xlsx)');
    }

    return await this.transactionsService.validateExcelFile(
      file.buffer,
      file.originalname,
    );
  }

  @Post('upload/confirm')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({
    summary: 'Confirm and save Excel data',
    description:
      'Upload and save transactions from Excel file to database, skipping duplicates.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Excel file (.xlsx)',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Transactions saved successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid file or format' })
  async confirmUpload(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    if (
      !file.mimetype.includes('spreadsheet') &&
      !file.originalname.endsWith('.xlsx')
    ) {
      throw new BadRequestException('File must be an Excel file (.xlsx)');
    }

    return await this.transactionsService.confirmUpload(
      file.buffer,
      file.originalname,
    );
  }

  @Get()
  @ApiOperation({
    summary: 'Get all transactions',
    description: 'Retrieve transactions with optional filtering and pagination',
  })
  @ApiQuery({ name: 'transactionType', required: false, type: String })
  @ApiQuery({ name: 'startDate', required: false, type: Date })
  @ApiQuery({ name: 'endDate', required: false, type: Date })
  @ApiQuery({ name: 'minAmount', required: false, type: Number })
  @ApiQuery({ name: 'maxAmount', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 20 })
  @ApiResponse({
    status: 200,
    description: 'List of transactions',
    type: [Transaction],
  })
  async findAll(@Query() filters: TransactionFiltersDto): Promise<Transaction[]> {
    return await this.transactionsService.findAll(filters);
  }

  @Get('statistics')
  @ApiOperation({
    summary: 'Get transaction statistics',
    description:
      'Get summary statistics including total transactions, received, paid, and balance',
  })
  @ApiResponse({
    status: 200,
    description: 'Transaction statistics',
    schema: {
      type: 'object',
      properties: {
        totalTransactions: { type: 'number', example: 100 },
        totalReceived: { type: 'number', example: 75 },
        totalPaid: { type: 'number', example: 25 },
        totalReceivedAmount: { type: 'number', example: 1500.50 },
        totalPaidAmount: { type: 'number', example: 500.25 },
        balance: { type: 'number', example: 1000.25 },
      },
    },
  })
  async getStatistics() {
    return await this.transactionsService.getStatistics();
  }

  @Get('upload-history')
  @ApiOperation({
    summary: 'Get upload history',
    description: 'Retrieve history of all file uploads with metadata',
  })
  @ApiResponse({
    status: 200,
    description: 'List of upload history records',
  })
  async getUploadHistory() {
    return await this.transactionsService.getUploadHistory();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get transaction by ID',
    description: 'Retrieve a single transaction by its ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Transaction found',
    type: Transaction,
  })
  @ApiResponse({ status: 404, description: 'Transaction not found' })
  async findById(@Param('id', ParseIntPipe) id: number): Promise<Transaction | null> {
    return await this.transactionsService.findById(id);
  }
}
