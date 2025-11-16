import 'reflect-metadata';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import request from 'supertest';
import { TasksModule } from '@tasks/infrastructure/tasks.module';
import { TestDatabaseModule } from '@database/infrastructure/test-database.module';
import { DATABASE_CONNECTION, type TestDatabase } from '@repo/database';
import { resetTestDatabase } from '../helpers/test-database.helper';

describe('TasksController (e2e)', () => {
  let app: INestApplication;
  let db: TestDatabase;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TasksModule, TestDatabaseModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    db = moduleFixture.get(DATABASE_CONNECTION);
    await app.init();
  });

  afterEach(async () => {
    // Clean database between tests for isolation
    await resetTestDatabase(db);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /tasks', () => {
    it('should create a new task', async () => {
      const createTaskDto = {
        title: 'E2E Test Task',
        description: 'This is an e2e test',
        priority: 'high',
      };

      const response = await request(app.getHttpServer())
        .post('/tasks')
        .send(createTaskDto)
        .expect(201);

      expect(response.body).toMatchObject({
        title: 'E2E Test Task',
        description: 'This is an e2e test',
        priority: 'high',
        completed: false,
      });
      expect(response.body.id).toBeDefined();
      expect(response.body.createdAt).toBeDefined();
      expect(response.body.updatedAt).toBeDefined();
    });

    it('should create a task with default values', async () => {
      const createTaskDto = {
        title: 'Minimal Task',
      };

      const response = await request(app.getHttpServer())
        .post('/tasks')
        .send(createTaskDto)
        .expect(201);

      expect(response.body.title).toBe('Minimal Task');
      expect(response.body.description).toBeNull();
      expect(response.body.priority).toBe('medium');
      expect(response.body.completed).toBe(false);
    });
  });

  describe('GET /tasks', () => {
    it('should return all tasks', async () => {
      const response = await request(app.getHttpServer()).get('/tasks').expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      response.body.forEach((task: any) => {
        expect(task).toHaveProperty('id');
        expect(task).toHaveProperty('title');
        expect(task).toHaveProperty('priority');
        expect(task).toHaveProperty('completed');
        expect(task).toHaveProperty('createdAt');
        expect(task).toHaveProperty('updatedAt');
      });
    });
  });

  describe('GET /tasks/:id', () => {
    it('should return a specific task', async () => {
      // First create a task
      const createResponse = await request(app.getHttpServer())
        .post('/tasks')
        .send({ title: 'Task to Find' })
        .expect(201);

      const taskId = createResponse.body.id;

      // Then retrieve it
      const response = await request(app.getHttpServer())
        .get(`/tasks/${taskId}`)
        .expect(200);

      expect(response.body.id).toBe(taskId);
      expect(response.body.title).toBe('Task to Find');
    });

    it('should return 404 for non-existent task', async () => {
      const response = await request(app.getHttpServer()).get('/tasks/99999').expect(404);

      expect(response.body.message).toContain('Task with ID 99999 not found');
    });
  });

  describe('PATCH /tasks/:id', () => {
    it('should update a task', async () => {
      // First create a task
      const createResponse = await request(app.getHttpServer())
        .post('/tasks')
        .send({ title: 'Task to Update', priority: 'low' })
        .expect(201);

      const taskId = createResponse.body.id;

      // Then update it
      const updateResponse = await request(app.getHttpServer())
        .patch(`/tasks/${taskId}`)
        .send({ title: 'Updated Task', priority: 'high', completed: true })
        .expect(200);

      expect(updateResponse.body.id).toBe(taskId);
      expect(updateResponse.body.title).toBe('Updated Task');
      expect(updateResponse.body.priority).toBe('high');
      expect(updateResponse.body.completed).toBe(true);

      // Verify the update persisted
      const getResponse = await request(app.getHttpServer())
        .get(`/tasks/${taskId}`)
        .expect(200);

      expect(getResponse.body.title).toBe('Updated Task');
      expect(getResponse.body.priority).toBe('high');
      expect(getResponse.body.completed).toBe(true);
    });

    it('should return 404 when updating non-existent task', async () => {
      const response = await request(app.getHttpServer())
        .patch('/tasks/99999')
        .send({ title: 'New Title' })
        .expect(404);

      expect(response.body.message).toContain('Task with ID 99999 not found');
    });
  });

  describe('DELETE /tasks/:id', () => {
    it('should delete a task', async () => {
      // First create a task
      const createResponse = await request(app.getHttpServer())
        .post('/tasks')
        .send({ title: 'Task to Delete' })
        .expect(201);

      const taskId = createResponse.body.id;

      // Then delete it
      await request(app.getHttpServer()).delete(`/tasks/${taskId}`).expect(200);

      // Verify it's deleted
      await request(app.getHttpServer()).get(`/tasks/${taskId}`).expect(404);
    });

    it('should return 404 when deleting non-existent task', async () => {
      const response = await request(app.getHttpServer()).delete('/tasks/99999').expect(404);

      expect(response.body.message).toContain('Task with ID 99999 not found');
    });
  });

  describe('Complete CRUD flow', () => {
    it('should perform full create, read, update, delete cycle', async () => {
      // Create
      const createResponse = await request(app.getHttpServer())
        .post('/tasks')
        .send({
          title: 'Full Cycle Task',
          description: 'Testing full CRUD',
          priority: 'medium',
        })
        .expect(201);

      const taskId = createResponse.body.id;
      expect(createResponse.body.title).toBe('Full Cycle Task');

      // Read
      const readResponse = await request(app.getHttpServer())
        .get(`/tasks/${taskId}`)
        .expect(200);

      expect(readResponse.body.title).toBe('Full Cycle Task');
      expect(readResponse.body.description).toBe('Testing full CRUD');

      // Update
      const updateResponse = await request(app.getHttpServer())
        .patch(`/tasks/${taskId}`)
        .send({ completed: true, priority: 'high' })
        .expect(200);

      expect(updateResponse.body.completed).toBe(true);
      expect(updateResponse.body.priority).toBe('high');

      // Delete
      await request(app.getHttpServer()).delete(`/tasks/${taskId}`).expect(200);

      // Verify deletion
      await request(app.getHttpServer()).get(`/tasks/${taskId}`).expect(404);
    });
  });
});
