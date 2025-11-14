import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto, UpdateTaskDto } from '@repo/api';
import { GetAllTasksUseCase } from '../application/use-cases/get-all-tasks.use-case';
import { GetTaskByIdUseCase } from '../application/use-cases/get-task-by-id.use-case';
import { CreateTaskUseCase } from '../application/use-cases/create-task.use-case';
import { UpdateTaskUseCase } from '../application/use-cases/update-task.use-case';
import { DeleteTaskUseCase } from '../application/use-cases/delete-task.use-case';
import { Task } from '../domain/entities/task.entity';

@Injectable()
export class TasksService {
  constructor(
    private readonly getAllTasksUseCase: GetAllTasksUseCase,
    private readonly getTaskByIdUseCase: GetTaskByIdUseCase,
    private readonly createTaskUseCase: CreateTaskUseCase,
    private readonly updateTaskUseCase: UpdateTaskUseCase,
    private readonly deleteTaskUseCase: DeleteTaskUseCase,
  ) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    return this.createTaskUseCase.execute(createTaskDto);
  }

  async findAll(): Promise<Task[]> {
    return this.getAllTasksUseCase.execute();
  }

  async findOne(id: number): Promise<Task> {
    const task = await this.getTaskByIdUseCase.execute(id);
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return task;
  }

  async update(id: number, updateTaskDto: UpdateTaskDto): Promise<Task> {
    // Check if task exists
    await this.findOne(id);
    return this.updateTaskUseCase.execute(id, updateTaskDto);
  }

  async remove(id: number): Promise<void> {
    // Check if task exists
    await this.findOne(id);
    return this.deleteTaskUseCase.execute(id);
  }
}
