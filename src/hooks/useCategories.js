import { useState, useEffect } from 'react';
import { categoryService } from '@/services/api/categoryService';

export function useCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError('');
      await new Promise(resolve => setTimeout(resolve, 200));
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (err) {
      setError('Failed to load categories. Please try again.');
      console.error('Error loading categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const addCategory = async (categoryData) => {
    try {
      const newCategory = await categoryService.create(categoryData);
      setCategories(prev => [...prev, newCategory]);
      return newCategory;
    } catch (err) {
      console.error('Error adding category:', err);
      throw err;
    }
  };

  const updateCategory = async (id, updates) => {
    try {
      const updatedCategory = await categoryService.update(id, updates);
      setCategories(prev => prev.map(category => 
        category.Id === id ? updatedCategory : category
      ));
      return updatedCategory;
    } catch (err) {
      console.error('Error updating category:', err);
      throw err;
    }
  };

  const deleteCategory = async (id) => {
    try {
      await categoryService.delete(id);
      setCategories(prev => prev.filter(category => category.Id !== id));
    } catch (err) {
      console.error('Error deleting category:', err);
      throw err;
    }
  };

  return {
    categories,
    loading,
    error,
    addCategory,
    updateCategory,
    deleteCategory,
    refetch: loadCategories
  };
}