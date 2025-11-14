import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GetTaskByIdUseCase } from '@tasks/application/use-cases/get-task-by-id.use-case';
import { ITaskRepository } from '@tasks/domain/repositories/task.repository.interface';
import { TaskFactory } from '@src/../test/tasks/helpers/task.factory';

describe('GetTaskByIdUseCase', () => {
  let getTaskByIdUseCase: GetTaskByIdUseCase;
  let mockTaskRepository: ITaskRepository;

  beforeEach(() => {
    mockTaskRepository = {
      create: vi.fn(),
      findAll: vi.fn(),
      findById: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };

    getTaskByIdUseCase = new GetTaskByIdUseCase(mockTaskRepository);
  });

  it('should return a task when it exists', async () => {
    const expectedTask = TaskFactory.create({ id: 1 });

    vi.spyOn(mockTaskRepository, 'findById').mockResolvedValue(expectedTask);

    const result = await getTaskByIdUseCase.execute(1);

    expect(mockTaskRepository.findById).toHaveBeenCalledWith(1);
    expect(mockTaskRepository.findById).toHaveBeenCalledTimes(1);
    expect(result).toBe(expectedTask);
  });

  it('should return null when task does not exist', async () => {
    vi.spyOn(mockTaskRepository, 'findById').mockResolvedValue(null);

    const result = await getTaskByIdUseCase.execute(999);

    expect(mockTaskRepository.findById).toHaveBeenCalledWith(999);
    expect(result).toBeNull();
  });

  it('should call repository with correct id', async () => {
    const task = TaskFactory.create({ id: 42 });
    vi.spyOn(mockTaskRepository, 'findById').mockResolvedValue(task);

    await getTaskByIdUseCase.execute(42);

    expect(mockTaskRepository.findById).toHaveBeenCalledWith(42);
  });

  it('should return task with all properties', async () => {
    const task = TaskFactory.create({
      id: 5,
      title: 'Test Task',
      description: 'Description',
      priority: 'high',
      completed: true,
    });

    vi.spyOn(mockTaskRepository, 'findById').mockResolvedValue(task);

    const result = await getTaskByIdUseCase.execute(5);

    expect(result).not.toBeNull();
    expect(result?.id).toBe(5);
    expect(result?.title).toBe('Test Task');
    expect(result?.description).toBe('Description');
    expect(result?.priority).toBe('high');
    expect(result?.completed).toBe(true);
  });
});
