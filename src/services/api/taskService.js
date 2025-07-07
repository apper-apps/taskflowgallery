import tasksData from '@/services/mockData/tasks.json';

let tasks = [...tasksData];

// Helper to get next ID
const getNextId = () => {
  const maxId = Math.max(...tasks.map(t => t.Id), 0);
  return maxId + 1;
};

export const taskService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...tasks].sort((a, b) => b.order - a.order);
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const task = tasks.find(t => t.Id === id);
    if (!task) throw new Error('Task not found');
    return { ...task };
  },

  async create(taskData) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const newTask = {
      Id: getNextId(),
      title: taskData.title,
      description: taskData.description || '',
      categoryId: taskData.categoryId || '',
      priority: taskData.priority || 'medium',
      dueDate: taskData.dueDate || null,
      completed: false,
      completedAt: null,
      createdAt: new Date().toISOString(),
      order: tasks.length + 1
    };
    tasks.unshift(newTask);
    return { ...newTask };
  },

  async update(id, updates) {
    await new Promise(resolve => setTimeout(resolve, 250));
    const index = tasks.findIndex(t => t.Id === id);
    if (index === -1) throw new Error('Task not found');
    
    tasks[index] = { ...tasks[index], ...updates };
    return { ...tasks[index] };
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const index = tasks.findIndex(t => t.Id === id);
    if (index === -1) throw new Error('Task not found');
    
    tasks.splice(index, 1);
    return true;
  }
};