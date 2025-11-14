import { Inject } from '@nestjs/common';
import { ITaskRepository, TASK_REPOSITORY } from '../../domain/repositories/task.repository.interface';
import { Task } from '../../domain/entities/task.entity';

export class UpdateTaskUseCase {
  constructor(
    @Inject(TASK_REPOSITORY)
    private readonly taskRepository: ITaskRepository,
  ) {}

  async execute(
    id: number,
    data: {
      title?: string;
      description?: string | null;
      priority?: 'low' | 'medium' | 'high';
      completed?: boolean;
    },
  ): Promise<Task> {
    return this.taskRepository.update(id, data);
  }
}
