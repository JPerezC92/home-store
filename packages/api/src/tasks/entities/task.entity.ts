// Task entity interface (shared TypeScript type)
export interface Task {
  id: number;
  title: string;
  description: string | null;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Response types
export type TaskResponse = Task;
export type TaskListResponse = Task[];
