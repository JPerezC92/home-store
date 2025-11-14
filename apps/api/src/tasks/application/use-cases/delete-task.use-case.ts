import { Inject } from '@nestjs/common';
import { ITaskRepository, TASK_REPOSITORY } from '../../domain/repositories/task.repository.interface';

export class DeleteTaskUseCase {
  constructor(
    @Inject(TASK_REPOSITORY)
    private readonly taskRepository: ITaskRepository,
  ) {}

  async execute(id: number): Promise<void> {
    return this.taskRepository.delete(id);
  }
}
