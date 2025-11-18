import { ApiProperty } from '@nestjs/swagger';

// Domain Entity - Encapsulates business logic
export class Transaction {
  @ApiProperty({ description: 'Transaction ID', example: 1 })
  public readonly id: number;

  @ApiProperty({
    description: 'Transaction type',
    example: 'TE PAGÓ',
  })
  public readonly transactionType: string;

  @ApiProperty({
    description: 'Origin/Sender name',
    example: 'Jean C. Guevara M.',
  })
  public readonly origin: string;

  @ApiProperty({
    description: 'Destination/Recipient name',
    example: 'Philip J. Perez C.',
  })
  public readonly destination: string;

  @ApiProperty({
    description: 'Transaction amount',
    example: 25.50,
  })
  public readonly amount: number;

  @ApiProperty({
    description: 'Transaction message',
    example: 'Payment for service',
    nullable: true,
  })
  public readonly message: string | null;

  @ApiProperty({
    description: 'Operation date',
    example: '2025-11-10T21:49:04.000Z',
  })
  public readonly operationDate: Date;

  @ApiProperty({
    description: 'Phone number extracted from file',
    example: '+51922076456',
    nullable: true,
  })
  public readonly phoneNumber: string | null;

  @ApiProperty({
    description: 'Transaction status',
    example: 'completed',
    nullable: true,
  })
  public readonly status: string | null;

  @ApiProperty({
    description: 'Transaction creation date',
    example: '2025-11-16T10:00:00.000Z',
  })
  public readonly createdAt: Date;

  @ApiProperty({
    description: 'Transaction last update date',
    example: '2025-11-16T10:00:00.000Z',
  })
  public readonly updatedAt: Date;

  constructor(
    id: number,
    transactionType: string,
    origin: string,
    destination: string,
    amount: number,
    message: string | null,
    operationDate: Date,
    phoneNumber: string | null,
    status: string | null,
    createdAt: Date,
    updatedAt: Date,
  ) {
    this.id = id;
    this.transactionType = transactionType;
    this.origin = origin;
    this.destination = destination;
    this.amount = amount;
    this.message = message;
    this.operationDate = operationDate;
    this.phoneNumber = phoneNumber;
    this.status = status;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  // Factory method for creating new transactions
  static create(data: {
    transactionType: string;
    origin: string;
    destination: string;
    amount: number;
    message?: string | null;
    operationDate: Date;
    phoneNumber?: string | null;
    status?: string | null;
  }): Partial<Transaction> {
    return {
      transactionType: data.transactionType,
      origin: data.origin,
      destination: data.destination,
      amount: data.amount,
      message: data.message ?? null,
      operationDate: data.operationDate,
      phoneNumber: data.phoneNumber ?? null,
      status: data.status ?? null,
    };
  }

  // Domain methods
  isReceived(): boolean {
    return this.transactionType.toLowerCase().includes('pagó') ||
           this.transactionType.toLowerCase().includes('received');
  }

  isPaid(): boolean {
    return this.transactionType.toLowerCase().includes('pagaste') ||
           this.transactionType.toLowerCase().includes('paid');
  }

  isPositive(): boolean {
    return this.amount > 0;
  }

  hasMessage(): boolean {
    return this.message !== null && this.message.trim().length > 0;
  }

  getFormattedAmount(): string {
    return `S/ ${this.amount.toFixed(2)}`;
  }
}
