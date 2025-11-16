import { z } from 'zod';

// Schema for creating a new task
export const insertTaskSchema = z
  .object({
    title: z
      .string()
      .min(1, 'Title is required')
      .max(255, 'Title must be less than 255 characters')
      .describe('Task title'),
    description: z
      .string()
      .max(1000, 'Description must be less than 1000 characters')
      .optional()
      .describe('Task description (optional)'),
    priority: z
      .enum(['low', 'medium', 'high'])
      .optional()
      .default('medium')
      .describe('Task priority (low, medium, high)'),
    completed: z
      .boolean()
      .optional()
      .default(false)
      .describe('Whether the task is completed'),
  })
  .describe('Create task request');

// Schema for updating an existing task
export const updateTaskSchema = z
  .object({
    title: z
      .string()
      .min(1, 'Title must not be empty')
      .max(255, 'Title must be less than 255 characters')
      .optional()
      .describe('Task title'),
    description: z
      .string()
      .max(1000, 'Description must be less than 1000 characters')
      .optional()
      .describe('Task description'),
    priority: z
      .enum(['low', 'medium', 'high'])
      .optional()
      .describe('Task priority (low, medium, high)'),
    completed: z.boolean().optional().describe('Whether the task is completed'),
  })
  .describe('Update task request');
