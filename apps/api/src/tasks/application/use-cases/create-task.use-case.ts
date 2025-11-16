import { Inject } from '@nestjs/common';
import { ITaskRepository, TASK_REPOSITORY } from '../../domain/repositories/task.repository.interface';
import { Task } from '../../domain/entities/task.entity';

export class CreateTaskUseCase {
  constructor(
    @Inject(TASK_REPOSITORY)
    private readonly taskRepository: ITaskRepository,
  ) {}

  async execute(data: {
    title: string;
    description?: string | null;
    priority?: 'low' | 'medium' | 'high';
    completed?: boolean;
  }): Promise<Task> {
    const taskData = Task.create(data);
    return this.taskRepository.create(taskData);
  }
}
