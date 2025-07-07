import { useState, useEffect } from 'react';
import { taskService } from '@/services/api/taskService';

export function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError('');
      await new Promise(resolve => setTimeout(resolve, 300));
      const data = await taskService.getAll();
      setTasks(data);
    } catch (err) {
      setError('Failed to load tasks. Please try again.');
      console.error('Error loading tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const addTask = async (taskData) => {
    try {
      const newTask = await taskService.create(taskData);
      setTasks(prev => [newTask, ...prev]);
      return newTask;
    } catch (err) {
      console.error('Error adding task:', err);
      throw err;
    }
  };

  const updateTask = async (id, updates) => {
    try {
      const updatedTask = await taskService.update(id, updates);
      setTasks(prev => prev.map(task => 
        task.Id === id ? updatedTask : task
      ));
      return updatedTask;
    } catch (err) {
      console.error('Error updating task:', err);
      throw err;
    }
  };

  const deleteTask = async (id) => {
    try {
      await taskService.delete(id);
      setTasks(prev => prev.filter(task => task.Id !== id));
    } catch (err) {
      console.error('Error deleting task:', err);
      throw err;
    }
  };

  const toggleComplete = async (id) => {
    const task = tasks.find(t => t.Id === id);
    if (!task) return;

    const updates = {
      completed: !task.completed,
      completedAt: !task.completed ? new Date().toISOString() : null
    };

    return updateTask(id, updates);
  };

  return {
    tasks,
    loading,
    error,
    addTask,
    updateTask,
    deleteTask,
    toggleComplete,
    refetch: loadTasks
  };
}