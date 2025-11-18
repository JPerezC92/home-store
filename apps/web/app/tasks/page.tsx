'use client';

import { useState, useEffect } from 'react';
import type { Task } from '@repo/api';

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');

  // Fetch tasks
  const fetchTasks = async () => {
    try {
      const response = await fetch('http://localhost:3000/tasks');
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Create task
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, priority, completed: false }),
      });
      if (response.ok) {
        setTitle('');
        setDescription('');
        setPriority('medium');
        fetchTasks();
      }
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  // Update task
  const handleUpdate = async (id: number, completed: boolean) => {
    try {
      await fetch(`http://localhost:3000/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed }),
      });
      fetchTasks();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  // Delete task
  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    try {
      await fetch(`http://localhost:3000/tasks/${id}`, {
        method: 'DELETE',
      });
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const pendingCount = tasks.length - completedCount;
  const highPriorityCount = tasks.filter(t => t.priority === 'high' && !t.completed).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="text-center py-12 text-foreground">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-jpc-cyan-400"></div>
            <p className="mt-4 text-muted-foreground/90">Loading tasks...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground">Tasks Manager</h1>
          <p className="mt-3 text-base text-muted-foreground/90">
            Manage your tasks efficiently with Clean Architecture pattern
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-card border border-jpc-cyan-500/20 rounded-xl p-6 shadow-xl hover:shadow-2xl hover:shadow-jpc-cyan-500/10 transition-all duration-300 hover:border-jpc-cyan-500/40 group">
            <div className="text-xs font-semibold text-muted-foreground/70 uppercase tracking-wider mb-2">Total Tasks</div>
            <div className="text-4xl font-bold text-jpc-cyan-400 group-hover:scale-105 transition-transform duration-300">{tasks.length}</div>
          </div>
          <div className="bg-card border border-jpc-emerald-500/20 rounded-xl p-6 shadow-xl hover:shadow-2xl hover:shadow-jpc-emerald-500/10 transition-all duration-300 hover:border-jpc-emerald-500/40 group">
            <div className="text-xs font-semibold text-muted-foreground/70 uppercase tracking-wider mb-2">Completed</div>
            <div className="text-4xl font-bold text-jpc-emerald-400 group-hover:scale-105 transition-transform duration-300">{completedCount}</div>
          </div>
          <div className="bg-card border border-jpc-orange-500/20 rounded-xl p-6 shadow-xl hover:shadow-2xl hover:shadow-jpc-orange-500/10 transition-all duration-300 hover:border-jpc-orange-500/40 group">
            <div className="text-xs font-semibold text-muted-foreground/70 uppercase tracking-wider mb-2">Pending</div>
            <div className="text-4xl font-bold text-jpc-orange-400 group-hover:scale-105 transition-transform duration-300">{pendingCount}</div>
          </div>
          <div className="bg-card border border-jpc-purple-500/20 rounded-xl p-6 shadow-xl hover:shadow-2xl hover:shadow-jpc-purple-500/10 transition-all duration-300 hover:border-jpc-purple-500/40 group">
            <div className="text-xs font-semibold text-muted-foreground/70 uppercase tracking-wider mb-2">High Priority</div>
            <div className="text-4xl font-bold text-jpc-purple-400 group-hover:scale-105 transition-transform duration-300">{highPriorityCount}</div>
          </div>
        </div>

        {/* Create Task Form */}
        <form onSubmit={handleCreate} className="bg-card border border-jpc-cyan-500/20 rounded-xl p-8 shadow-xl hover:shadow-2xl hover:shadow-jpc-cyan-500/10 transition-all duration-300 mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Create New Task</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder="Task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-4 py-3 bg-background border border-border/60 rounded-lg text-foreground placeholder-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
              className="w-full px-4 py-3 bg-background border border-border/60 rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
          </div>
          <textarea
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-3 mb-4 bg-background border border-border/60 rounded-lg text-foreground placeholder-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[100px] resize-y"
          />
          <button
            type="submit"
            className="bg-jpc-cyan-500/20 text-jpc-cyan-400 border border-jpc-cyan-500/40 hover:bg-jpc-cyan-500/30 hover:shadow-lg hover:shadow-jpc-cyan-500/20 px-6 py-3 rounded-lg font-medium transition-all duration-300"
          >
            Add Task
          </button>
        </form>

        {/* Tasks List */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">Your Tasks</h2>
            <span className="bg-jpc-cyan-500/20 text-jpc-cyan-400 border border-jpc-cyan-500/40 px-3 py-1 rounded-full text-sm font-medium">
              {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
            </span>
          </div>

          {tasks.length === 0 ? (
            <div className="text-center py-16 bg-jpc-cyan-50 border border-jpc-cyan-500/20 rounded-xl shadow-xl">
              <div className="text-7xl mb-6">📝</div>
              <p className="text-foreground text-xl font-bold mb-3 mt-6">No tasks yet</p>
              <p className="text-muted-foreground/70">Create your first task above to get started!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-card border border-jpc-cyan-500/20 rounded-xl p-6 shadow-xl hover:shadow-2xl hover:shadow-jpc-cyan-500/10 hover:border-jpc-cyan-500/40 transition-all duration-300 group"
                >
                  <div className="flex items-start gap-4">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={(e) => handleUpdate(task.id, e.target.checked)}
                      className="w-5 h-5 mt-1 cursor-pointer accent-jpc-cyan-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className={`text-xl font-semibold ${task.completed ? 'line-through text-muted-foreground/60' : 'text-foreground'}`}>
                          {task.title}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                          task.priority === 'high'
                            ? 'bg-jpc-purple-500/20 text-jpc-purple-400 border-jpc-purple-500/40'
                            : task.priority === 'medium'
                            ? 'bg-jpc-orange-500/20 text-jpc-orange-400 border-jpc-orange-500/40'
                            : 'bg-jpc-emerald-500/20 text-jpc-emerald-400 border-jpc-emerald-500/40'
                        }`}>
                          {task.priority === 'high' ? 'High' : task.priority === 'medium' ? 'Medium' : 'Low'}
                        </span>
                      </div>
                      {task.description && (
                        <p className={`mb-4 leading-relaxed ${task.completed ? 'text-muted-foreground/50' : 'text-muted-foreground/80'}`}>
                          {task.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between pt-4 border-t border-border/60">
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-muted-foreground/70">
                            Created: {new Date(task.createdAt).toLocaleDateString()}
                          </span>
                          {task.completed ? (
                            <span className="bg-jpc-emerald-500/20 text-jpc-emerald-400 border border-jpc-emerald-500/40 px-3 py-1 rounded-full text-xs font-medium">
                              Completed
                            </span>
                          ) : (
                            <span className="bg-jpc-orange-500/20 text-jpc-orange-400 border border-jpc-orange-500/40 px-3 py-1 rounded-full text-xs font-medium">
                              Pending
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => handleDelete(task.id)}
                          className="bg-jpc-pink-500/20 text-jpc-pink-600 border border-jpc-pink-500/40 hover:bg-jpc-pink-500/30 hover:shadow-lg hover:shadow-jpc-pink-500/20 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
