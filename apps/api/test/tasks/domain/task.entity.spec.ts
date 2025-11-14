import { describe, it, expect } from 'vitest';
import { Task } from '@tasks/domain/entities/task.entity';

describe('Task Entity', () => {
  describe('constructor', () => {
    it('should create a task with all properties', () => {
      const now = new Date();
      const task = new Task(
        1,
        'Test Task',
        'Test Description',
        'high',
        false,
        now,
        now
      );

      expect(task.id).toBe(1);
      expect(task.title).toBe('Test Task');
      expect(task.description).toBe('Test Description');
      expect(task.priority).toBe('high');
      expect(task.completed).toBe(false);
      expect(task.createdAt).toBe(now);
      expect(task.updatedAt).toBe(now);
    });

    it('should create a task with null description', () => {
      const now = new Date();
      const task = new Task(
        1,
        'Test Task',
        null,
        'medium',
        false,
        now,
        now
      );

      expect(task.description).toBeNull();
    });
  });

  describe('Task.create', () => {
    it('should create a partial task with required fields only', () => {
      const taskData = Task.create({ title: 'New Task' });

      expect(taskData.title).toBe('New Task');
      expect(taskData.description).toBeNull();
      expect(taskData.priority).toBe('medium');
      expect(taskData.completed).toBe(false);
    });

    it('should create a partial task with all fields', () => {
      const taskData = Task.create({
        title: 'Complete Task',
        description: 'This is a complete task',
        priority: 'high',
        completed: true,
      });

      expect(taskData.title).toBe('Complete Task');
      expect(taskData.description).toBe('This is a complete task');
      expect(taskData.priority).toBe('high');
      expect(taskData.completed).toBe(true);
    });

    it('should use default priority when not provided', () => {
      const taskData = Task.create({ title: 'Task with default priority' });

      expect(taskData.priority).toBe('medium');
    });

    it('should use default completed status when not provided', () => {
      const taskData = Task.create({ title: 'Task with default status' });

      expect(taskData.completed).toBe(false);
    });

    it('should handle all priority levels', () => {
      const lowPriority = Task.create({ title: 'Low', priority: 'low' });
      const mediumPriority = Task.create({ title: 'Medium', priority: 'medium' });
      const highPriority = Task.create({ title: 'High', priority: 'high' });

      expect(lowPriority.priority).toBe('low');
      expect(mediumPriority.priority).toBe('medium');
      expect(highPriority.priority).toBe('high');
    });
  });

  describe('isCompleted', () => {
    it('should return true when task is completed', () => {
      const now = new Date();
      const task = new Task(1, 'Task', null, 'medium', true, now, now);

      expect(task.isCompleted()).toBe(true);
    });

    it('should return false when task is not completed', () => {
      const now = new Date();
      const task = new Task(1, 'Task', null, 'medium', false, now, now);

      expect(task.isCompleted()).toBe(false);
    });
  });

  describe('isHighPriority', () => {
    it('should return true when priority is high', () => {
      const now = new Date();
      const task = new Task(1, 'Task', null, 'high', false, now, now);

      expect(task.isHighPriority()).toBe(true);
    });

    it('should return false when priority is medium', () => {
      const now = new Date();
      const task = new Task(1, 'Task', null, 'medium', false, now, now);

      expect(task.isHighPriority()).toBe(false);
    });

    it('should return false when priority is low', () => {
      const now = new Date();
      const task = new Task(1, 'Task', null, 'low', false, now, now);

      expect(task.isHighPriority()).toBe(false);
    });
  });

  describe('immutability', () => {
    it('should have readonly properties', () => {
      const now = new Date();
      const task = new Task(1, 'Task', null, 'medium', false, now, now);

      // TypeScript enforces readonly at compile time
      // This test verifies the properties exist and are accessible
      expect(task.id).toBe(1);
      expect(task.title).toBe('Task');
      expect(task.description).toBeNull();
      expect(task.priority).toBe('medium');
      expect(task.completed).toBe(false);
      expect(task.createdAt).toBe(now);
      expect(task.updatedAt).toBe(now);
    });
  });
});
