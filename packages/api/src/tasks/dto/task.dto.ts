import { createZodDto } from 'nestjs-zod';
import { insertTaskSchema, updateTaskSchema } from '../schemas/task-validation.schema';

// DTO for creating a task
export class CreateTaskDto extends createZodDto(insertTaskSchema) {}

// DTO for updating a task
export class UpdateTaskDto extends createZodDto(updateTaskSchema) {}
