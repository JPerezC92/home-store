import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UpdateTaskUseCase } from '@tasks/application/use-cases/update-task.use-case';
import { ITaskRepository } from '@tasks/domain/repositories/task.repository.interface';
import { TaskFactory } from '@src/../test/tasks/helpers/task.factory';

describe('UpdateTaskUseCase', () => {
  let updateTaskUseCase: UpdateTaskUseCase;
  let mockTaskRepository: ITaskRepository;

  beforeEach(() => {
    mockTaskRepository = {
      create: vi.fn(),
      findAll: vi.fn(),
      findById: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };

    updateTaskUseCase = new UpdateTaskUseCase(mockTaskRepository);
  });

  it('should update a task with all fields', async () => {
    const updateData = {
      title: 'Updated Task',
      description: 'Updated Description',
      priority: 'high' as const,
      completed: true,
    };

    const updatedTask = TaskFactory.create({
      id: 1,
      ...updateData,
    });

    vi.spyOn(mockTaskRepository, 'update').mockResolvedValue(updatedTask);

    const result = await updateTaskUseCase.execute(1, updateData);

    expect(mockTaskRepository.update).toHaveBeenCalledWith(1, updateData);
    expect(mockTaskRepository.update).toHaveBeenCalledTimes(1);
    expect(result).toBe(updatedTask);
  });

  it('should update only title', async () => {
    const updateData = {
      title: 'New Title',
    };

    const updatedTask = TaskFactory.create({ id: 1, title: 'New Title' });

    vi.spyOn(mockTaskRepository, 'update').mockResolvedValue(updatedTask);

    const result = await updateTaskUseCase.execute(1, updateData);

    expect(mockTaskRepository.update).toHaveBeenCalledWith(1, updateData);
    expect(result.title).toBe('New Title');
  });

  it('should update only priority', async () => {
    const updateData = {
      priority: 'low' as const,
    };

    const updatedTask = TaskFactory.create({ id: 1, priority: 'low' });

    vi.spyOn(mockTaskRepository, 'update').mockResolvedValue(updatedTask);

    const result = await updateTaskUseCase.execute(1, updateData);

    expect(mockTaskRepository.update).toHaveBeenCalledWith(1, updateData);
    expect(result.priority).toBe('low');
  });

  it('should update completed status', async () => {
    const updateData = {
      completed: true,
    };

    const updatedTask = TaskFactory.create({ id: 1, completed: true });

    vi.spyOn(mockTaskRepository, 'update').mockResolvedValue(updatedTask);

    const result = await updateTaskUseCase.execute(1, updateData);

    expect(mockTaskRepository.update).toHaveBeenCalledWith(1, updateData);
    expect(result.completed).toBe(true);
  });

  it('should update description to null', async () => {
    const updateData = {
      description: null,
    };

    const updatedTask = TaskFactory.create({
      id: 1,
      description: null
    });

    vi.spyOn(mockTaskRepository, 'update').mockResolvedValue(updatedTask);

    const result = await updateTaskUseCase.execute(1, updateData);

    expect(mockTaskRepository.update).toHaveBeenCalledWith(1, updateData);
    expect(result).toBe(updatedTask);
    expect(updatedTask.description).toBeNull();
  });

  it('should pass correct id to repository', async () => {
    const updateData = { title: 'Test' };
    const updatedTask = TaskFactory.create({ id: 42 });

    vi.spyOn(mockTaskRepository, 'update').mockResolvedValue(updatedTask);

    await updateTaskUseCase.execute(42, updateData);

    expect(mockTaskRepository.update).toHaveBeenCalledWith(42, updateData);
  });

  it('should update with empty object', async () => {
    const updateData = {};
    const updatedTask = TaskFactory.create({ id: 1 });

    vi.spyOn(mockTaskRepository, 'update').mockResolvedValue(updatedTask);

    const result = await updateTaskUseCase.execute(1, updateData);

    expect(mockTaskRepository.update).toHaveBeenCalledWith(1, updateData);
    expect(result).toBe(updatedTask);
  });
});
