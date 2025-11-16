import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { TaskRepository } from '@tasks/infrastructure/repositories/task.repository';
import { Task } from '@tasks/domain/entities/task.entity';
import type { Database, DbTask } from '@repo/database';

describe('TaskRepository', () => {
  let repository: TaskRepository;
  let mockDb: any;

  beforeEach(() => {
    // Create comprehensive mock with chainable methods
    mockDb = {
      select: vi.fn().mockReturnThis(),
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      values: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      set: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      returning: vi.fn().mockReturnThis(),
    };

    repository = new TaskRepository(mockDb as unknown as Database);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all tasks from database', async () => {
      const mockDbTasks: DbTask[] = [
        {
          id: 1,
          title: 'Task 1',
          description: 'Description 1',
          priority: 'high',
          completed: false,
          createdAt: new Date('2025-01-01'),
          updatedAt: new Date('2025-01-01'),
        },
        {
          id: 2,
          title: 'Task 2',
          description: null,
          priority: 'medium',
          completed: true,
          createdAt: new Date('2025-01-02'),
          updatedAt: new Date('2025-01-02'),
        },
      ];

      mockDb.select.mockReturnValue({
        from: vi.fn().mockResolvedValue(mockDbTasks),
      });

      const result = await repository.findAll();

      expect(result).toHaveLength(2);
      expect(result[0]).toBeInstanceOf(Task);
      expect(result[0].id).toBe(1);
      expect(result[0].title).toBe('Task 1');
      expect(result[1].id).toBe(2);
      expect(mockDb.select).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no tasks exist', async () => {
      mockDb.select.mockReturnValue({
        from: vi.fn().mockResolvedValue([]),
      });

      const result = await repository.findAll();

      expect(result).toEqual([]);
      expect(mockDb.select).toHaveBeenCalledTimes(1);
    });

    it('should correctly map database model to domain entity', async () => {
      const mockDbTask: DbTask = {
        id: 5,
        title: 'Test Task',
        description: 'Test Description',
        priority: 'low',
        completed: true,
        createdAt: new Date('2025-11-11'),
        updatedAt: new Date('2025-11-12'),
      };

      mockDb.select.mockReturnValue({
        from: vi.fn().mockResolvedValue([mockDbTask]),
      });

      const result = await repository.findAll();

      expect(result[0].id).toBe(5);
      expect(result[0].title).toBe('Test Task');
      expect(result[0].description).toBe('Test Description');
      expect(result[0].priority).toBe('low');
      expect(result[0].completed).toBe(true);
      expect(result[0].createdAt).toEqual(new Date('2025-11-11'));
      expect(result[0].updatedAt).toEqual(new Date('2025-11-12'));
    });
  });

  describe('findById', () => {
    it('should return a task when it exists', async () => {
      const mockDbTask: DbTask = {
        id: 1,
        title: 'Found Task',
        description: 'Description',
        priority: 'high',
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockDb.select.mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([mockDbTask]),
          }),
        }),
      });

      const result = await repository.findById(1);

      expect(result).not.toBeNull();
      expect(result).toBeInstanceOf(Task);
      expect(result?.id).toBe(1);
      expect(result?.title).toBe('Found Task');
      expect(mockDb.select).toHaveBeenCalledTimes(1);
    });

    it('should return null when task does not exist', async () => {
      mockDb.select.mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([]),
          }),
        }),
      });

      const result = await repository.findById(999);

      expect(result).toBeNull();
      expect(mockDb.select).toHaveBeenCalledTimes(1);
    });

    it('should handle null description', async () => {
      const mockDbTask: DbTask = {
        id: 1,
        title: 'Task',
        description: null,
        priority: 'medium',
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockDb.select.mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([mockDbTask]),
          }),
        }),
      });

      const result = await repository.findById(1);

      expect(result?.description).toBeNull();
    });
  });

  describe('create', () => {
    it('should create a task with all fields', async () => {
      const taskData = {
        title: 'New Task',
        description: 'New Description',
        priority: 'high' as const,
        completed: false,
      };

      const mockDbTask: DbTask = {
        id: 1,
        ...taskData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockDb.insert.mockReturnValue({
        values: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([mockDbTask]),
        }),
      });

      const result = await repository.create(taskData);

      expect(result).toBeInstanceOf(Task);
      expect(result.title).toBe('New Task');
      expect(result.description).toBe('New Description');
      expect(result.priority).toBe('high');
      expect(mockDb.insert).toHaveBeenCalledTimes(1);
    });

    it('should create a task with default values', async () => {
      const taskData = {
        title: 'Simple Task',
      };

      const mockDbTask: DbTask = {
        id: 1,
        title: 'Simple Task',
        description: null,
        priority: 'medium',
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockDb.insert.mockReturnValue({
        values: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([mockDbTask]),
        }),
      });

      const result = await repository.create(taskData);

      expect(result.description).toBeNull();
      expect(result.priority).toBe('medium');
      expect(result.completed).toBe(false);
    });

    it('should handle null description', async () => {
      const taskData = {
        title: 'Task',
        description: null,
      };

      const mockDbTask: DbTask = {
        id: 1,
        title: 'Task',
        description: null,
        priority: 'medium',
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockDb.insert.mockReturnValue({
        values: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([mockDbTask]),
        }),
      });

      const result = await repository.create(taskData);

      expect(result.description).toBeNull();
    });
  });

  describe('update', () => {
    it('should update a task with all fields', async () => {
      const updateData = {
        title: 'Updated Title',
        description: 'Updated Description',
        priority: 'low' as const,
        completed: true,
      };

      const mockDbTask: DbTask = {
        id: 1,
        ...updateData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockDb.update.mockReturnValue({
        set: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            returning: vi.fn().mockResolvedValue([mockDbTask]),
          }),
        }),
      });

      const result = await repository.update(1, updateData);

      expect(result).toBeInstanceOf(Task);
      expect(result.title).toBe('Updated Title');
      expect(result.description).toBe('Updated Description');
      expect(result.priority).toBe('low');
      expect(result.completed).toBe(true);
      expect(mockDb.update).toHaveBeenCalledTimes(1);
    });

    it('should update partial fields', async () => {
      const updateData = {
        completed: true,
      };

      const mockDbTask: DbTask = {
        id: 1,
        title: 'Original Title',
        description: null,
        priority: 'medium',
        completed: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockDb.update.mockReturnValue({
        set: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            returning: vi.fn().mockResolvedValue([mockDbTask]),
          }),
        }),
      });

      const result = await repository.update(1, updateData);

      expect(result.completed).toBe(true);
    });

    it('should update updatedAt timestamp', async () => {
      const updateData = { title: 'New Title' };
      const now = new Date();

      const mockDbTask: DbTask = {
        id: 1,
        title: 'New Title',
        description: null,
        priority: 'medium',
        completed: false,
        createdAt: new Date('2025-01-01'),
        updatedAt: now,
      };

      mockDb.update.mockReturnValue({
        set: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            returning: vi.fn().mockResolvedValue([mockDbTask]),
          }),
        }),
      });

      const result = await repository.update(1, updateData);

      expect(result.updatedAt).toEqual(now);
    });
  });

  describe('delete', () => {
    it('should delete a task by id', async () => {
      mockDb.delete.mockReturnValue({
        where: vi.fn().mockResolvedValue(undefined),
      });

      await repository.delete(1);

      expect(mockDb.delete).toHaveBeenCalledTimes(1);
    });

    it('should not return any value', async () => {
      mockDb.delete.mockReturnValue({
        where: vi.fn().mockResolvedValue(undefined),
      });

      const result = await repository.delete(1);

      expect(result).toBeUndefined();
    });
  });
});
