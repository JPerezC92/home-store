export interface ApiError {
  message: string;
  statusCode?: number;
}

export type TaskFilter = 'all' | 'active' | 'completed';
export type TaskPriorityFilter = 'all' | 'low' | 'medium' | 'high';

export interface TaskFilters {
  status: TaskFilter;
  priority: TaskPriorityFilter;
  searchQuery: string;
}
