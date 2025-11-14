import 'reflect-metadata';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mock, MockProxy } from 'vitest-mock-extended';
import request from 'supertest';
import { TasksController } from '@tasks/infrastructure/tasks.controller';
import { TasksService } from '@tasks/infrastructure/tasks.service';
import { TASK_REPOSITORY } from '@tasks/domain/repositories/task.repository.interface';
import type { ITaskRepository } from '@tasks/domain/repositories/task.repository.interface';
import { GetAllTasksUseCase } from '@tasks/application/use-cases/get-all-tasks.use-case';
import { GetTaskByIdUseCase } from '@tasks/application/use-cases/get-task-by-id.use-case';
import { CreateTaskUseCase } from '@tasks/application/use-cases/create-task.use-case';
import { UpdateTaskUseCase } from '@tasks/application/use-cases/update-task.use-case';
import { DeleteTaskUseCase } from '@tasks/application/use-cases/delete-task.use-case';
import { TaskFactory } from './helpers/task.factory';

describe('TasksController (Integration)', () => {
  let app: INestApplication;
  let mockTaskRepository: MockProxy<ITaskRepository>;

  beforeEach(async () => {
    // Create mock repository using vitest-mock-extended
    mockTaskRepository = mock<ITaskRepository>();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        TasksService,
        // Mock repository
        {
          provide: TASK_REPOSITORY,
          useValue: mockTaskRepository,
        },
        // Use Cases with factory providers
        {
          provide: GetAllTasksUseCase,
          useFactory: (taskRepository: ITaskRepository) => {
            return new GetAllTasksUseCase(taskRepository);
          },
          inject: [TASK_REPOSITORY],
        },
        {
          provide: GetTaskByIdUseCase,
          useFactory: (taskRepository: ITaskRepository) => {
            return new GetTaskByIdUseCase(taskRepository);
          },
          inject: [TASK_REPOSITORY],
        },
        {
          provide: CreateTaskUseCase,
          useFactory: (taskRepository: ITaskRepository) => {
            return new CreateTaskUseCase(taskRepository);
          },
          inject: [TASK_REPOSITORY],
        },
        {
          provide: UpdateTaskUseCase,
          useFactory: (taskRepository: ITaskRepository) => {
            return new UpdateTaskUseCase(taskRepository);
          },
          inject: [TASK_REPOSITORY],
        },
        {
          provide: DeleteTaskUseCase,
          useFactory: (taskRepository: ITaskRepository) => {
            return new DeleteTaskUseCase(taskRepository);
          },
          inject: [TASK_REPOSITORY],
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('POST /tasks', () => {
    it('should create a new task with all fields', async () => {
      const createTaskDto = {
        title: 'Test Task',
        description: 'Test Description',
        priority: 'high',
      };

      const expectedTask = TaskFactory.create({
        id: 1,
        title: 'Test Task',
        description: 'Test Description',
        priority: 'high',
        completed: false,
      });

      mockTaskRepository.create.mockResolvedValue(expectedTask);

      const response = await request(app.getHttpServer())
        .post('/tasks')
        .send(createTaskDto)
        .expect(201);

      expect(response.body).toMatchObject({
        id: 1,
        title: 'Test Task',
        description: 'Test Description',
        priority: 'high',
        completed: false,
      });
      expect(mockTaskRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Test Task',
          description: 'Test Description',
          priority: 'high',
          completed: false,
        }),
      );
    });

    it('should create a task with default priority when not provided', async () => {
      const createTaskDto = {
        title: 'Test Task',
      };

      const expectedTask = TaskFactory.create({
        id: 1,
        title: 'Test Task',
        description: null,
        priority: 'medium',
        completed: false,
      });

      mockTaskRepository.create.mockResolvedValue(expectedTask);

      const response = await request(app.getHttpServer())
        .post('/tasks')
        .send(createTaskDto)
        .expect(201);

      expect(response.body).toMatchObject({
        id: 1,
        title: 'Test Task',
        priority: 'medium',
        completed: false,
      });
    });

    it('should create a low priority task', async () => {
      const createTaskDto = {
        title: 'Low Priority Task',
        priority: 'low',
      };

      const expectedTask = TaskFactory.create({
        id: 1,
        title: 'Low Priority Task',
        priority: 'low',
      });

      mockTaskRepository.create.mockResolvedValue(expectedTask);

      const response = await request(app.getHttpServer())
        .post('/tasks')
        .send(createTaskDto)
        .expect(201);

      expect(response.body.priority).toBe('low');
    });
  });

  describe('GET /tasks', () => {
    it('should return all tasks', async () => {
      const tasks = TaskFactory.createMany(3);

      mockTaskRepository.findAll.mockResolvedValue(tasks);

      const response = await request(app.getHttpServer())
        .get('/tasks')
        .expect(200);

      expect(response.body).toHaveLength(3);
      expect(mockTaskRepository.findAll).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no tasks exist', async () => {
      mockTaskRepository.findAll.mockResolvedValue([]);

      const response = await request(app.getHttpServer())
        .get('/tasks')
        .expect(200);

      expect(response.body).toEqual([]);
    });

    it('should return tasks with all properties', async () => {
      const tasks = [
        TaskFactory.create({
          id: 1,
          title: 'Task 1',
          priority: 'high',
          completed: false,
        }),
      ];

      mockTaskRepository.findAll.mockResolvedValue(tasks);

      const response = await request(app.getHttpServer())
        .get('/tasks')
        .expect(200);

      expect(response.body[0]).toMatchObject({
        id: 1,
        title: 'Task 1',
        priority: 'high',
        completed: false,
      });
    });
  });

  describe('GET /tasks/:id', () => {
    it('should return a task by id', async () => {
      const task = TaskFactory.create({ id: 1, title: 'Test Task' });

      mockTaskRepository.findById.mockResolvedValue(task);

      const response = await request(app.getHttpServer())
        .get('/tasks/1')
        .expect(200);

      expect(response.body).toMatchObject({
        id: 1,
        title: 'Test Task',
      });
      expect(mockTaskRepository.findById).toHaveBeenCalledWith(1);
    });

    it('should return 404 when task does not exist', async () => {
      mockTaskRepository.findById.mockResolvedValue(null);

      const response = await request(app.getHttpServer())
        .get('/tasks/999')
        .expect(404);

      expect(response.body.message).toContain('Task with ID 999 not found');
    });

    it('should return 400 for invalid id format', async () => {
      await request(app.getHttpServer()).get('/tasks/invalid').expect(400);
    });

    it('should return task with all fields', async () => {
      const task = TaskFactory.create({
        id: 5,
        title: 'Complete Task',
        description: 'Full description',
        priority: 'high',
        completed: true,
      });

      mockTaskRepository.findById.mockResolvedValue(task);

      const response = await request(app.getHttpServer())
        .get('/tasks/5')
        .expect(200);

      expect(response.body).toMatchObject({
        id: 5,
        title: 'Complete Task',
        description: 'Full description',
        priority: 'high',
        completed: true,
      });
    });
  });

  describe('PATCH /tasks/:id', () => {
    it('should update a task', async () => {
      const existingTask = TaskFactory.create({ id: 1, title: 'Old Title' });
      const updatedTask = TaskFactory.create({ id: 1, title: 'New Title' });

      mockTaskRepository.findById.mockResolvedValue(existingTask);
      mockTaskRepository.update.mockResolvedValue(updatedTask);

      const response = await request(app.getHttpServer())
        .patch('/tasks/1')
        .send({ title: 'New Title' })
        .expect(200);

      expect(response.body.title).toBe('New Title');
      expect(mockTaskRepository.findById).toHaveBeenCalledWith(1);
      expect(mockTaskRepository.update).toHaveBeenCalledWith(1, {
        title: 'New Title',
      });
    });

    it('should return 404 when updating non-existent task', async () => {
      mockTaskRepository.findById.mockResolvedValue(null);

      const response = await request(app.getHttpServer())
        .patch('/tasks/999')
        .send({ title: 'New Title' })
        .expect(404);

      expect(response.body.message).toContain('Task with ID 999 not found');
    });

    it('should update only completed status', async () => {
      const existingTask = TaskFactory.create({ id: 1, completed: false });
      const updatedTask = TaskFactory.create({ id: 1, completed: true });

      mockTaskRepository.findById.mockResolvedValue(existingTask);
      mockTaskRepository.update.mockResolvedValue(updatedTask);

      const response = await request(app.getHttpServer())
        .patch('/tasks/1')
        .send({ completed: true })
        .expect(200);

      expect(response.body.completed).toBe(true);
    });

    it('should update priority', async () => {
      const existingTask = TaskFactory.create({ id: 1, priority: 'medium' });
      const updatedTask = TaskFactory.create({ id: 1, priority: 'high' });

      mockTaskRepository.findById.mockResolvedValue(existingTask);
      mockTaskRepository.update.mockResolvedValue(updatedTask);

      const response = await request(app.getHttpServer())
        .patch('/tasks/1')
        .send({ priority: 'high' })
        .expect(200);

      expect(response.body.priority).toBe('high');
    });

    it('should return 400 for invalid id format', async () => {
      await request(app.getHttpServer())
        .patch('/tasks/invalid')
        .send({ title: 'New Title' })
        .expect(400);
    });
  });

  describe('DELETE /tasks/:id', () => {
    it('should delete a task', async () => {
      const existingTask = TaskFactory.create({ id: 1 });

      mockTaskRepository.findById.mockResolvedValue(existingTask);
      mockTaskRepository.delete.mockResolvedValue(undefined);

      await request(app.getHttpServer()).delete('/tasks/1').expect(200);

      expect(mockTaskRepository.findById).toHaveBeenCalledWith(1);
      expect(mockTaskRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should return 404 when deleting non-existent task', async () => {
      mockTaskRepository.findById.mockResolvedValue(null);

      const response = await request(app.getHttpServer())
        .delete('/tasks/999')
        .expect(404);

      expect(response.body.message).toContain('Task with ID 999 not found');
    });

    it('should return 400 for invalid id format', async () => {
      await request(app.getHttpServer()).delete('/tasks/invalid').expect(400);
    });
  });
});
