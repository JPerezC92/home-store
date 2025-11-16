import { ApiProperty } from '@nestjs/swagger';

// Domain Entity - Encapsulates business logic
export class Task {
  @ApiProperty({ description: 'Task ID', example: 1 })
  public readonly id: number;

  @ApiProperty({ description: 'Task title', example: 'Buy groceries' })
  public readonly title: string;

  @ApiProperty({
    description: 'Task description',
    example: 'Need to buy milk and eggs',
    nullable: true,
  })
  public readonly description: string | null;

  @ApiProperty({
    description: 'Task priority level',
    enum: ['low', 'medium', 'high'],
    example: 'medium',
  })
  public readonly priority: 'low' | 'medium' | 'high';

  @ApiProperty({ description: 'Task completion status', example: false })
  public readonly completed: boolean;

  @ApiProperty({ description: 'Task creation date', example: '2025-11-11T10:00:00.000Z' })
  public readonly createdAt: Date;

  @ApiProperty({ description: 'Task last update date', example: '2025-11-11T10:00:00.000Z' })
  public readonly updatedAt: Date;

  constructor(
    id: number,
    title: string,
    description: string | null,
    priority: 'low' | 'medium' | 'high',
    completed: boolean,
    createdAt: Date,
    updatedAt: Date,
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.priority = priority;
    this.completed = completed;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  // Factory method for creating new tasks
  static create(data: {
    title: string;
    description?: string | null;
    priority?: 'low' | 'medium' | 'high';
    completed?: boolean;
  }): Partial<Task> {
    return {
      title: data.title,
      description: data.description ?? null,
      priority: data.priority ?? 'medium',
      completed: data.completed ?? false,
    };
  }

  // Domain methods can be added here
  isCompleted(): boolean {
    return this.completed;
  }

  isHighPriority(): boolean {
    return this.priority === 'high';
  }
}
