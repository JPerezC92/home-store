import { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { Task } from '@repo/api';
import { taskStyles } from '../../styles/tasks.styles';
import { StatisticsCard } from '../../components/tasks/statistics-card';
import { useColorScheme } from '../../hooks/use-color-scheme';
import * as tasksApi from '../../services/tasks-api.service';
import {
  getTaskStatistics,
  filterTasks,
  getPriorityColor,
  getPriorityLabel,
  formatDate,
} from '../../utils/task-helpers';
import type { TaskFilter, TaskPriorityFilter } from '../../types/api.types';

export default function TasksScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const insets = useSafeAreaInsets();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState<TaskFilter>('all');
  const [priorityFilter, setPriorityFilter] = useState<TaskPriorityFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
  });

  const fetchTasks = useCallback(async () => {
    try {
      const data = await tasksApi.fetchTasks();
      setTasks(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load tasks');
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchTasks();
  };

  const handleToggleComplete = async (task: Task) => {
    try {
      await tasksApi.updateTask(task.id, { completed: !task.completed });
      fetchTasks();
    } catch (error) {
      Alert.alert('Error', 'Failed to update task');
    }
  };

  const handleDelete = (task: Task) => {
    Alert.alert('Delete Task', 'Are you sure you want to delete this task?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await tasksApi.deleteTask(task.id);
            fetchTasks();
          } catch (error) {
            Alert.alert('Error', 'Failed to delete task');
          }
        },
      },
    ]);
  };

  const handleCreateTask = async () => {
    if (!formData.title.trim()) {
      Alert.alert('Error', 'Please enter a task title');
      return;
    }

    try {
      await tasksApi.createTask({
        title: formData.title,
        description: formData.description || undefined,
        priority: formData.priority,
        completed: false,
      });
      setFormData({ title: '', description: '', priority: 'medium' });
      setShowForm(false);
      fetchTasks();
    } catch (error) {
      Alert.alert('Error', 'Failed to create task');
    }
  };

  const filteredTasks = filterTasks(tasks, statusFilter, priorityFilter, searchQuery);
  const stats = getTaskStatistics(tasks);

  const bgColor = isDark ? '#000' : '#fff';
  const textColor = isDark ? '#fff' : '#000';
  const borderColor = isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.15)';

  if (loading) {
    return (
      <View style={[taskStyles.loadingContainer, { backgroundColor: bgColor, paddingTop: insets.top }]}>
        <ActivityIndicator size="large" color="#22d3ee" />
        <Text style={[taskStyles.loadingText, { color: textColor }]}>Loading tasks...</Text>
      </View>
    );
  }

  return (
    <View style={[taskStyles.container, { backgroundColor: bgColor, paddingTop: insets.top }]}>
      {/* Statistics */}
      <View style={taskStyles.statsContainer}>
        <View style={taskStyles.statsGrid}>
          <StatisticsCard label="Total Tasks" value={stats.total} color="#22d3ee" />
          <StatisticsCard label="Completed" value={stats.completed} color="#34d399" />
          <StatisticsCard label="Pending" value={stats.pending} color="#fb923c" />
          <StatisticsCard label="High Priority" value={stats.highPriority} color="#c084fc" />
        </View>
      </View>

      {/* Search */}
      <View style={taskStyles.searchContainer}>
        <TextInput
          style={[taskStyles.searchInput, { backgroundColor: bgColor, color: textColor, borderColor }]}
          placeholder="Search tasks..."
          placeholderTextColor={isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)'}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Filters */}
      <View style={taskStyles.filterContainer}>
        {(['all', 'active', 'completed'] as TaskFilter[]).map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              taskStyles.filterButton,
              { borderColor: statusFilter === filter ? '#22d3ee' : borderColor },
              statusFilter === filter && taskStyles.filterButtonActive,
            ]}
            onPress={() => setStatusFilter(filter)}
          >
            <Text style={[taskStyles.filterButtonText, { color: statusFilter === filter ? '#22d3ee' : textColor }]}>
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Task List */}
      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#22d3ee" />}
        ListEmptyComponent={
          <View style={taskStyles.emptyState}>
            <Text style={taskStyles.emptyStateIcon}>📝</Text>
            <Text style={[taskStyles.emptyStateTitle, { color: textColor }]}>No tasks found</Text>
            <Text style={[taskStyles.emptyStateText, { color: textColor }]}>
              {searchQuery ? 'Try a different search' : 'Create your first task to get started!'}
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          const priorityColors = getPriorityColor(item.priority);
          return (
            <View
              style={[
                taskStyles.taskItem,
                { backgroundColor: bgColor, borderColor: `${priorityColors.border}` },
              ]}
            >
              <View style={taskStyles.taskContent}>
                <TouchableOpacity
                  style={[
                    taskStyles.checkbox,
                    item.completed && taskStyles.checkboxChecked,
                    { borderColor: item.completed ? '#22d3ee' : borderColor },
                  ]}
                  onPress={() => handleToggleComplete(item)}
                >
                  {item.completed && <Text style={{ color: '#22d3ee', fontSize: 16 }}>✓</Text>}
                </TouchableOpacity>

                <View style={taskStyles.taskDetails}>
                  <View style={taskStyles.taskHeader}>
                    <Text
                      style={[
                        taskStyles.taskTitle,
                        { color: textColor },
                        item.completed && taskStyles.taskTitleCompleted,
                      ]}
                      numberOfLines={2}
                    >
                      {item.title}
                    </Text>
                    <View
                      style={[
                        taskStyles.priorityBadge,
                        { backgroundColor: priorityColors.background, borderColor: priorityColors.border },
                      ]}
                    >
                      <Text style={[taskStyles.priorityText, { color: priorityColors.text }]}>
                        {getPriorityLabel(item.priority)}
                      </Text>
                    </View>
                  </View>

                  {item.description && (
                    <Text
                      style={[taskStyles.taskDescription, { color: textColor, opacity: item.completed ? 0.5 : 0.8 }]}
                      numberOfLines={3}
                    >
                      {item.description}
                    </Text>
                  )}

                  <View style={[taskStyles.taskFooter, { borderTopColor: borderColor }]}>
                    <View style={taskStyles.taskMeta}>
                      <Text style={[taskStyles.taskDate, { color: textColor }]}>
                        Created: {formatDate(item.createdAt)}
                      </Text>
                      <View
                        style={[
                          taskStyles.statusBadge,
                          {
                            backgroundColor: item.completed ? 'rgba(52, 211, 153, 0.2)' : 'rgba(251, 146, 60, 0.2)',
                            borderColor: item.completed ? 'rgba(52, 211, 153, 0.4)' : 'rgba(251, 146, 60, 0.4)',
                          },
                        ]}
                      >
                        <Text
                          style={[taskStyles.statusText, { color: item.completed ? '#34d399' : '#fb923c' }]}
                        >
                          {item.completed ? 'Completed' : 'Pending'}
                        </Text>
                      </View>
                    </View>
                    <TouchableOpacity style={taskStyles.deleteButton} onPress={() => handleDelete(item)}>
                      <Text style={taskStyles.deleteButtonText}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          );
        }}
      />

      {/* FAB */}
      {!showForm && (
        <TouchableOpacity style={taskStyles.fab} onPress={() => setShowForm(true)}>
          <Text style={taskStyles.fabText}>+</Text>
        </TouchableOpacity>
      )}

      {/* Simple Form Modal Overlay */}
      {showForm && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: bgColor,
            paddingTop: 60,
          }}
        >
          <View style={taskStyles.modalContainer}>
            <View style={taskStyles.modalHeader}>
              <Text style={[taskStyles.modalTitle, { color: textColor }]}>Create New Task</Text>
              <TouchableOpacity onPress={() => setShowForm(false)}>
                <Text style={[taskStyles.closeButtonText, { color: textColor }]}>×</Text>
              </TouchableOpacity>
            </View>

            <View style={taskStyles.formGroup}>
              <Text style={[taskStyles.label, { color: textColor }]}>Title *</Text>
              <TextInput
                style={[taskStyles.input, { backgroundColor: bgColor, color: textColor, borderColor }]}
                placeholder="Enter task title"
                placeholderTextColor={isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)'}
                value={formData.title}
                onChangeText={(text) => setFormData({ ...formData, title: text })}
              />
            </View>

            <View style={taskStyles.formGroup}>
              <Text style={[taskStyles.label, { color: textColor }]}>Description</Text>
              <TextInput
                style={[taskStyles.input, taskStyles.textArea, { backgroundColor: bgColor, color: textColor, borderColor }]}
                placeholder="Enter description (optional)"
                placeholderTextColor={isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)'}
                multiline
                numberOfLines={4}
                value={formData.description}
                onChangeText={(text) => setFormData({ ...formData, description: text })}
              />
            </View>

            <View style={taskStyles.formGroup}>
              <Text style={[taskStyles.label, { color: textColor }]}>Priority</Text>
              <View style={taskStyles.priorityButtons}>
                {(['low', 'medium', 'high'] as const).map((priority) => {
                  const priorityColors = getPriorityColor(priority);
                  const isActive = formData.priority === priority;
                  return (
                    <TouchableOpacity
                      key={priority}
                      style={[
                        taskStyles.priorityButton,
                        {
                          backgroundColor: isActive ? priorityColors.background : bgColor,
                          borderColor: isActive ? priorityColors.border : borderColor,
                        },
                      ]}
                      onPress={() => setFormData({ ...formData, priority })}
                    >
                      <Text
                        style={[
                          taskStyles.priorityButtonText,
                          { color: isActive ? priorityColors.text : textColor },
                        ]}
                      >
                        {getPriorityLabel(priority)}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <TouchableOpacity style={taskStyles.submitButton} onPress={handleCreateTask}>
              <Text style={taskStyles.submitButtonText}>Create Task</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}
