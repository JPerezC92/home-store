import { Inject } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { Database, DATABASE_CONNECTION, tasks, DbTask } from '@repo/database';
import { ITaskRepository } from '../../domain/repositories/task.repository.interface';
import { Task } from '../../domain/entities/task.entity';

export class TaskRepository implements ITaskRepository {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: Database,
  ) {}

  async findAll(): Promise<Task[]> {
    const result = await this.db.select().from(tasks);
    return result.map(this.toDomain);
  }

  async findById(id: number): Promise<Task | null> {
    const result = await this.db
      .select()
      .from(tasks)
      .where(eq(tasks.id, id))
      .limit(1);

    if (result.length === 0) {
      return null;
    }

    return this.toDomain(result[0]);
  }

  async create(taskData: Partial<Task>): Promise<Task> {
    const result = await this.db
      .insert(tasks)
      .values({
        title: taskData.title!,
        description: taskData.description ?? null,
        priority: taskData.priority ?? 'medium',
        completed: taskData.completed ?? false,
      })
      .returning();

    return this.toDomain(result[0]);
  }

  async update(id: number, taskData: Partial<Task>): Promise<Task> {
    const result = await this.db
      .update(tasks)
      .set({
        ...taskData,
        updatedAt: new Date(),
      })
      .where(eq(tasks.id, id))
      .returning();

    return this.toDomain(result[0]);
  }

  async delete(id: number): Promise<void> {
    await this.db.delete(tasks).where(eq(tasks.id, id));
  }

  // Helper method to convert database model to domain entity
  private toDomain(dbTask: DbTask): Task {
    return new Task(
      dbTask.id,
      dbTask.title,
      dbTask.description,
      dbTask.priority,
      dbTask.completed,
      dbTask.createdAt,
      dbTask.updatedAt,
    );
  }
}
