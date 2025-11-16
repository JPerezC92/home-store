import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DeleteTaskUseCase } from '@tasks/application/use-cases/delete-task.use-case';
import { ITaskRepository } from '@tasks/domain/repositories/task.repository.interface';

describe('DeleteTaskUseCase', () => {
  let deleteTaskUseCase: DeleteTaskUseCase;
  let mockTaskRepository: ITaskRepository;

  beforeEach(() => {
    mockTaskRepository = {
      create: vi.fn(),
      findAll: vi.fn(),
      findById: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };

    deleteTaskUseCase = new DeleteTaskUseCase(mockTaskRepository);
  });

  it('should delete a task by id', async () => {
    vi.spyOn(mockTaskRepository, 'delete').mockResolvedValue(undefined);

    await deleteTaskUseCase.execute(1);

    expect(mockTaskRepository.delete).toHaveBeenCalledWith(1);
    expect(mockTaskRepository.delete).toHaveBeenCalledTimes(1);
  });

  it('should pass correct id to repository', async () => {
    vi.spyOn(mockTaskRepository, 'delete').mockResolvedValue(undefined);

    await deleteTaskUseCase.execute(42);

    expect(mockTaskRepository.delete).toHaveBeenCalledWith(42);
  });

  it('should not return any value', async () => {
    vi.spyOn(mockTaskRepository, 'delete').mockResolvedValue(undefined);

    const result = await deleteTaskUseCase.execute(1);

    expect(result).toBeUndefined();
  });

  it('should handle large ids', async () => {
    vi.spyOn(mockTaskRepository, 'delete').mockResolvedValue(undefined);

    await deleteTaskUseCase.execute(999999);

    expect(mockTaskRepository.delete).toHaveBeenCalledWith(999999);
  });
});
