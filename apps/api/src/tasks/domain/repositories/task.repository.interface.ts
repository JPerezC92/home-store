import { Task } from '../entities/task.entity';

// Repository interface (port in hexagonal architecture)
export interface ITaskRepository {
  findAll(): Promise<Task[]>;
  findById(id: number): Promise<Task | null>;
  create(taskData: Partial<Task>): Promise<Task>;
  update(id: number, taskData: Partial<Task>): Promise<Task>;
  delete(id: number): Promise<void>;
}

// Symbol for dependency injection
export const TASK_REPOSITORY = Symbol('TASK_REPOSITORY');
