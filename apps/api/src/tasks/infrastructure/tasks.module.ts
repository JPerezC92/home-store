import { Module } from '@nestjs/common';
import { DATABASE_CONNECTION } from '@repo/database';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TaskRepository } from './repositories/task.repository';
import { TASK_REPOSITORY } from '../domain/repositories/task.repository.interface';
import { GetAllTasksUseCase } from '../application/use-cases/get-all-tasks.use-case';
import { GetTaskByIdUseCase } from '../application/use-cases/get-task-by-id.use-case';
import { CreateTaskUseCase } from '../application/use-cases/create-task.use-case';
import { UpdateTaskUseCase } from '../application/use-cases/update-task.use-case';
import { DeleteTaskUseCase } from '../application/use-cases/delete-task.use-case';

@Module({
  controllers: [TasksController],
  providers: [
    TasksService,
    // Repository
    {
      provide: TASK_REPOSITORY,
      useFactory: (database) => new TaskRepository(database),
      inject: [DATABASE_CONNECTION],
    },
    // Use Cases
    {
      provide: GetAllTasksUseCase,
      useFactory: (taskRepository) => new GetAllTasksUseCase(taskRepository),
      inject: [TASK_REPOSITORY],
    },
    {
      provide: GetTaskByIdUseCase,
      useFactory: (taskRepository) => new GetTaskByIdUseCase(taskRepository),
      inject: [TASK_REPOSITORY],
    },
    {
      provide: CreateTaskUseCase,
      useFactory: (taskRepository) => new CreateTaskUseCase(taskRepository),
      inject: [TASK_REPOSITORY],
    },
    {
      provide: UpdateTaskUseCase,
      useFactory: (taskRepository) => new UpdateTaskUseCase(taskRepository),
      inject: [TASK_REPOSITORY],
    },
    {
      provide: DeleteTaskUseCase,
      useFactory: (taskRepository) => new DeleteTaskUseCase(taskRepository),
      inject: [TASK_REPOSITORY],
    },
  ],
})
export class TasksModule {}
