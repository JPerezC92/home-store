import type { Task } from '@repo/api';
import { apiFetch } from '../config/api';

export interface CreateTaskInput {
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  completed?: boolean;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high';
  completed?: boolean;
}

/**
 * Fetch all tasks
 */
export async function fetchTasks(): Promise<Task[]> {
  return apiFetch<Task[]>('/tasks');
}

/**
 * Fetch a single task by ID
 */
export async function fetchTaskById(id: number): Promise<Task> {
  return apiFetch<Task>(`/tasks/${id}`);
}

/**
 * Create a new task
 */
export async function createTask(data: CreateTaskInput): Promise<Task> {
  return apiFetch<Task>('/tasks', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Update an existing task
 */
export async function updateTask(id: number, data: UpdateTaskInput): Promise<Task> {
  return apiFetch<Task>(`/tasks/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

/**
 * Delete a task
 */
export async function deleteTask(id: number): Promise<void> {
  return apiFetch<void>(`/tasks/${id}`, {
    method: 'DELETE',
  });
}
