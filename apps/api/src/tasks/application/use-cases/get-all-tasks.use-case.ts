import { Inject } from '@nestjs/common';
import { ITaskRepository, TASK_REPOSITORY } from '../../domain/repositories/task.repository.interface';
import { Task } from '../../domain/entities/task.entity';

export class GetAllTasksUseCase {
  constructor(
    @Inject(TASK_REPOSITORY)
    private readonly taskRepository: ITaskRepository,
  ) {}

  async execute(): Promise<Task[]> {
    return this.taskRepository.findAll();
  }
}
