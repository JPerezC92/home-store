import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GetAllTasksUseCase } from '@tasks/application/use-cases/get-all-tasks.use-case';
import { ITaskRepository } from '@tasks/domain/repositories/task.repository.interface';
import { TaskFactory } from '@src/../test/tasks/helpers/task.factory';

describe('GetAllTasksUseCase', () => {
  let getAllTasksUseCase: GetAllTasksUseCase;
  let mockTaskRepository: ITaskRepository;

  beforeEach(() => {
    mockTaskRepository = {
      create: vi.fn(),
      findAll: vi.fn(),
      findById: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };

    getAllTasksUseCase = new GetAllTasksUseCase(mockTaskRepository);
  });

  it('should return all tasks from repository', async () => {
    const expectedTasks = TaskFactory.createMany(3);

    vi.spyOn(mockTaskRepository, 'findAll').mockResolvedValue(expectedTasks);

    const result = await getAllTasksUseCase.execute();

    expect(mockTaskRepository.findAll).toHaveBeenCalledTimes(1);
    expect(result).toBe(expectedTasks);
    expect(result).toHaveLength(3);
  });

  it('should return empty array when no tasks exist', async () => {
    vi.spyOn(mockTaskRepository, 'findAll').mockResolvedValue([]);

    const result = await getAllTasksUseCase.execute();

    expect(mockTaskRepository.findAll).toHaveBeenCalledTimes(1);
    expect(result).toEqual([]);
    expect(result).toHaveLength(0);
  });

  it('should return tasks with different priorities', async () => {
    const tasks = [
      TaskFactory.create({ priority: 'low' }),
      TaskFactory.create({ priority: 'medium' }),
      TaskFactory.create({ priority: 'high' }),
    ];

    vi.spyOn(mockTaskRepository, 'findAll').mockResolvedValue(tasks);

    const result = await getAllTasksUseCase.execute();

    expect(result).toHaveLength(3);
    expect(result[0].priority).toBe('low');
    expect(result[1].priority).toBe('medium');
    expect(result[2].priority).toBe('high');
  });

  it('should return both completed and incomplete tasks', async () => {
    const tasks = [
      TaskFactory.create({ completed: true }),
      TaskFactory.create({ completed: false }),
    ];

    vi.spyOn(mockTaskRepository, 'findAll').mockResolvedValue(tasks);

    const result = await getAllTasksUseCase.execute();

    expect(result).toHaveLength(2);
    expect(result[0].completed).toBe(true);
    expect(result[1].completed).toBe(false);
  });
});
