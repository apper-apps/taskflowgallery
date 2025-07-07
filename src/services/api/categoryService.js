import categoriesData from '@/services/mockData/categories.json';

let categories = [...categoriesData];

// Helper to get next ID
const getNextId = () => {
  const maxId = Math.max(...categories.map(c => c.Id), 0);
  return maxId + 1;
};

export const categoryService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [...categories].sort((a, b) => a.order - b.order);
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 150));
    const category = categories.find(c => c.Id === id);
    if (!category) throw new Error('Category not found');
    return { ...category };
  },

  async create(categoryData) {
    await new Promise(resolve => setTimeout(resolve, 250));
    const newCategory = {
      Id: getNextId(),
      name: categoryData.name,
      color: categoryData.color || '#5B21B6',
      icon: categoryData.icon || null,
      order: categories.length + 1,
      taskCount: 0,
      completedCount: 0
    };
    categories.push(newCategory);
    return { ...newCategory };
  },

  async update(id, updates) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const index = categories.findIndex(c => c.Id === id);
    if (index === -1) throw new Error('Category not found');
    
    categories[index] = { ...categories[index], ...updates };
    return { ...categories[index] };
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const index = categories.findIndex(c => c.Id === id);
    if (index === -1) throw new Error('Category not found');
    
    categories.splice(index, 1);
    return true;
  }
};