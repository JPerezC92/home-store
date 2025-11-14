import type { Task } from '@repo/api';
import type { TaskFilter, TaskPriorityFilter } from '../types/api.types';

/**
 * Get priority color based on priority level
 */
export function getPriorityColor(priority: string): {
  text: string;
  background: string;
  border: string;
} {
  switch (priority) {
    case 'high':
      return {
        text: '#c084fc',
        background: 'rgba(192, 132, 252, 0.2)',
        border: 'rgba(192, 132, 252, 0.4)',
      };
    case 'medium':
      return {
        text: '#fb923c',
        background: 'rgba(251, 146, 60, 0.2)',
        border: 'rgba(251, 146, 60, 0.4)',
      };
    case 'low':
      return {
        text: '#34d399',
        background: 'rgba(52, 211, 153, 0.2)',
        border: 'rgba(52, 211, 153, 0.4)',
      };
    default:
      return {
        text: '#94a3b8',
        background: 'rgba(148, 163, 184, 0.2)',
        border: 'rgba(148, 163, 184, 0.4)',
      };
  }
}

/**
 * Format date to local date string
 */
export function formatDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString();
}

/**
 * Get capitalized priority label
 */
export function getPriorityLabel(priority: string): string {
  return priority.charAt(0).toUpperCase() + priority.slice(1);
}

/**
 * Filter tasks based on filters
 */
export function filterTasks(
  tasks: Task[],
  statusFilter: TaskFilter,
  priorityFilter: TaskPriorityFilter,
  searchQuery: string
): Task[] {
  return tasks.filter((task) => {
    // Status filter
    if (statusFilter === 'active' && task.completed) return false;
    if (statusFilter === 'completed' && !task.completed) return false;

    // Priority filter
    if (priorityFilter !== 'all' && task.priority !== priorityFilter) return false;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const titleMatch = task.title.toLowerCase().includes(query);
      const descMatch = task.description?.toLowerCase().includes(query);
      if (!titleMatch && !descMatch) return false;
    }

    return true;
  });
}

/**
 * Calculate task statistics
 */
export function getTaskStatistics(tasks: Task[]) {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const pending = total - completed;
  const highPriority = tasks.filter((t) => t.priority === 'high' && !t.completed).length;

  return {
    total,
    completed,
    pending,
    highPriority,
  };
}
