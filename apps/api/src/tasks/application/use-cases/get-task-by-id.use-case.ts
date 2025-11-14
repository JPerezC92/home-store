import { Inject } from '@nestjs/common';
import { ITaskRepository, TASK_REPOSITORY } from '../../domain/repositories/task.repository.interface';
import { Task } from '../../domain/entities/task.entity';

export class GetTaskByIdUseCase {
  constructor(
    @Inject(TASK_REPOSITORY)
    private readonly taskRepository: ITaskRepository,
  ) {}

  async execute(id: number): Promise<Task | null> {
    return this.taskRepository.findById(id);
  }
}
