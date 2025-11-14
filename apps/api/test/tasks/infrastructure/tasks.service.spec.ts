import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mock, MockProxy } from 'vitest-mock-extended';
import { NotFoundException } from '@nestjs/common';
import { TasksService } from '@tasks/infrastructure/tasks.service';
import { GetAllTasksUseCase } from '@tasks/application/use-cases/get-all-tasks.use-case';
import { GetTaskByIdUseCase } from '@tasks/application/use-cases/get-task-by-id.use-case';
import { CreateTaskUseCase } from '@tasks/application/use-cases/create-task.use-case';
import { UpdateTaskUseCase } from '@tasks/application/use-cases/update-task.use-case';
import { DeleteTaskUseCase } from '@tasks/application/use-cases/delete-task.use-case';
import { TaskFactory } from '@src/../test/tasks/helpers/task.factory';

describe('TasksService', () => {
  let service: TasksService;
  let mockGetAllTasksUseCase: MockProxy<GetAllTasksUseCase>;
  let mockGetTaskByIdUseCase: MockProxy<GetTaskByIdUseCase>;
  let mockCreateTaskUseCase: MockProxy<CreateTaskUseCase>;
  let mockUpdateTaskUseCase: MockProxy<UpdateTaskUseCase>;
  let mockDeleteTaskUseCase: MockProxy<DeleteTaskUseCase>;

  beforeEach(() => {
    mockGetAllTasksUseCase = mock<GetAllTasksUseCase>();
    mockGetTaskByIdUseCase = mock<GetTaskByIdUseCase>();
    mockCreateTaskUseCase = mock<CreateTaskUseCase>();
    mockUpdateTaskUseCase = mock<UpdateTaskUseCase>();
    mockDeleteTaskUseCase = mock<DeleteTaskUseCase>();

    service = new TasksService(
      mockGetAllTasksUseCase,
      mockGetTaskByIdUseCase,
      mockCreateTaskUseCase,
      mockUpdateTaskUseCase,
      mockDeleteTaskUseCase,
    );
  });

  describe('create', () => {
    it('should create a task', async () => {
      const createTaskDto = {
        title: 'New Task',
        description: 'Task Description',
        priority: 'high' as const,
        completed: false,
      };

      const expectedTask = TaskFactory.create({
        id: 1,
        ...createTaskDto,
      });

      mockCreateTaskUseCase.execute.mockResolvedValue(expectedTask);

      const result = await service.create(createTaskDto);

      expect(mockCreateTaskUseCase.execute).toHaveBeenCalledWith(createTaskDto);
      expect(result).toBe(expectedTask);
    });

    it('should create a task with default values', async () => {
      const createTaskDto = {
        title: 'Simple Task',
        priority: 'medium' as const,
        completed: false,
      };

      const expectedTask = TaskFactory.create({
        id: 1,
        title: 'Simple Task',
        priority: 'medium',
        completed: false,
      });

      mockCreateTaskUseCase.execute.mockResolvedValue(expectedTask);

      const result = await service.create(createTaskDto);

      expect(mockCreateTaskUseCase.execute).toHaveBeenCalledWith(createTaskDto);
      expect(result.title).toBe('Simple Task');
    });
  });

  describe('findAll', () => {
    it('should return all tasks', async () => {
      const expectedTasks = TaskFactory.createMany(3);

      mockGetAllTasksUseCase.execute.mockResolvedValue(expectedTasks);

      const result = await service.findAll();

      expect(mockGetAllTasksUseCase.execute).toHaveBeenCalledTimes(1);
      expect(result).toBe(expectedTasks);
      expect(result).toHaveLength(3);
    });

    it('should return empty array when no tasks exist', async () => {
      mockGetAllTasksUseCase.execute.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a task when it exists', async () => {
      const expectedTask = TaskFactory.create({ id: 1 });

      mockGetTaskByIdUseCase.execute.mockResolvedValue(expectedTask);

      const result = await service.findOne(1);

      expect(mockGetTaskByIdUseCase.execute).toHaveBeenCalledWith(1);
      expect(result).toBe(expectedTask);
    });

    it('should throw NotFoundException when task does not exist', async () => {
      mockGetTaskByIdUseCase.execute.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
      await expect(service.findOne(999)).rejects.toThrow('Task with ID 999 not found');
    });

    it('should call use case with correct id', async () => {
      const task = TaskFactory.create({ id: 42 });
      mockGetTaskByIdUseCase.execute.mockResolvedValue(task);

      await service.findOne(42);

      expect(mockGetTaskByIdUseCase.execute).toHaveBeenCalledWith(42);
    });
  });

  describe('update', () => {
    it('should update a task when it exists', async () => {
      const updateTaskDto = {
        title: 'Updated Task',
        completed: true,
      };

      const existingTask = TaskFactory.create({ id: 1 });
      const updatedTask = TaskFactory.create({
        id: 1,
        title: 'Updated Task',
        completed: true,
      });

      mockGetTaskByIdUseCase.execute.mockResolvedValue(existingTask);
      mockUpdateTaskUseCase.execute.mockResolvedValue(updatedTask);

      const result = await service.update(1, updateTaskDto);

      expect(mockGetTaskByIdUseCase.execute).toHaveBeenCalledWith(1);
      expect(mockUpdateTaskUseCase.execute).toHaveBeenCalledWith(1, updateTaskDto);
      expect(result).toBe(updatedTask);
    });

    it('should throw NotFoundException when task does not exist', async () => {
      const updateTaskDto = { title: 'Updated' };

      mockGetTaskByIdUseCase.execute.mockResolvedValue(null);

      await expect(service.update(999, updateTaskDto)).rejects.toThrow(NotFoundException);
      await expect(service.update(999, updateTaskDto)).rejects.toThrow(
        'Task with ID 999 not found',
      );
    });

    it('should check if task exists before updating', async () => {
      const updateTaskDto = { title: 'Updated' };
      const existingTask = TaskFactory.create({ id: 1 });
      const updatedTask = TaskFactory.create({ id: 1, title: 'Updated' });

      mockGetTaskByIdUseCase.execute.mockResolvedValue(existingTask);
      mockUpdateTaskUseCase.execute.mockResolvedValue(updatedTask);

      await service.update(1, updateTaskDto);

      expect(mockGetTaskByIdUseCase.execute).toHaveBeenCalledBefore(
        mockUpdateTaskUseCase.execute as any,
      );
    });

    it('should update partial fields', async () => {
      const updateTaskDto = { completed: true };
      const existingTask = TaskFactory.create({ id: 1, completed: false });
      const updatedTask = TaskFactory.create({ id: 1, completed: true });

      mockGetTaskByIdUseCase.execute.mockResolvedValue(existingTask);
      mockUpdateTaskUseCase.execute.mockResolvedValue(updatedTask);

      const result = await service.update(1, updateTaskDto);

      expect(result.completed).toBe(true);
    });
  });

  describe('remove', () => {
    it('should delete a task when it exists', async () => {
      const existingTask = TaskFactory.create({ id: 1 });

      mockGetTaskByIdUseCase.execute.mockResolvedValue(existingTask);
      mockDeleteTaskUseCase.execute.mockResolvedValue(undefined);

      await service.remove(1);

      expect(mockGetTaskByIdUseCase.execute).toHaveBeenCalledWith(1);
      expect(mockDeleteTaskUseCase.execute).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when task does not exist', async () => {
      mockGetTaskByIdUseCase.execute.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
      await expect(service.remove(999)).rejects.toThrow('Task with ID 999 not found');
    });

    it('should check if task exists before deleting', async () => {
      const existingTask = TaskFactory.create({ id: 1 });

      mockGetTaskByIdUseCase.execute.mockResolvedValue(existingTask);
      mockDeleteTaskUseCase.execute.mockResolvedValue(undefined);

      await service.remove(1);

      expect(mockGetTaskByIdUseCase.execute).toHaveBeenCalledBefore(
        mockDeleteTaskUseCase.execute as any,
      );
    });

    it('should not return any value', async () => {
      const existingTask = TaskFactory.create({ id: 1 });

      mockGetTaskByIdUseCase.execute.mockResolvedValue(existingTask);
      mockDeleteTaskUseCase.execute.mockResolvedValue(undefined);

      const result = await service.remove(1);

      expect(result).toBeUndefined();
    });
  });
});
