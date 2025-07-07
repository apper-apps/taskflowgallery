import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import CategoryPill from '@/components/molecules/CategoryPill';
import ApperIcon from '@/components/ApperIcon';
import { useCategories } from '@/hooks/useCategories';
import { useTasks } from '@/hooks/useTasks';

const CategoriesView = () => {
  const { searchQuery } = useOutletContext();
  const { categories, loading, error, addCategory, updateCategory, deleteCategory, refetch } = useCategories();
  const { tasks } = useTasks();
  const [isCreating, setIsCreating] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryColor, setNewCategoryColor] = useState('#5B21B6');

  const predefinedColors = [
    '#5B21B6', '#3B82F6', '#10B981', '#F59E0B', 
    '#EF4444', '#8B5CF6', '#EC4899', '#6366F1'
  ];

  const predefinedIcons = [
    'Briefcase', 'Code', 'Users', 'Heart', 'Home', 'ShoppingCart',
    'Book', 'Music', 'Camera', 'Car', 'Plane', 'Coffee'
  ];

  // Filter categories based on search
  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate category stats
  const getCategoryStats = (categoryId) => {
    const categoryTasks = tasks.filter(task => task.categoryId === categoryId);
    const completedTasks = categoryTasks.filter(task => task.completed);
    return {
      total: categoryTasks.length,
      completed: completedTasks.length,
      progress: categoryTasks.length > 0 ? (completedTasks.length / categoryTasks.length) * 100 : 0
    };
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      toast.error('Category name is required');
      return;
    }

    try {
      await addCategory({
        name: newCategoryName.trim(),
        color: newCategoryColor,
        icon: predefinedIcons[0]
      });
      setNewCategoryName('');
      setNewCategoryColor('#5B21B6');
      setIsCreating(false);
      toast.success('Category created successfully!');
    } catch (error) {
      toast.error('Failed to create category');
    }
  };

  const handleUpdateCategory = async (categoryId, updates) => {
    try {
      await updateCategory(categoryId, updates);
      setEditingCategory(null);
      toast.success('Category updated successfully!');
    } catch (error) {
      toast.error('Failed to update category');
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    const categoryTasks = tasks.filter(task => task.categoryId === categoryId);
    
    if (categoryTasks.length > 0) {
      toast.error('Cannot delete category with existing tasks');
      return;
    }

    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await deleteCategory(categoryId);
        toast.success('Category deleted successfully!');
      } catch (error) {
        toast.error('Failed to delete category');
      }
    }
  };

  if (loading) {
    return <Loading type="categories" />;
  }

  if (error) {
    return <Error message={error} onRetry={refetch} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Categories</h2>
          <p className="text-gray-600">
            Organize your tasks with custom categories
          </p>
        </div>
        
        <Button
          onClick={() => setIsCreating(true)}
          variant="primary"
          className="hover-lift"
        >
          <ApperIcon name="Plus" size={16} />
          Add Category
        </Button>
      </div>

      {/* Create Category Form */}
      {isCreating && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 border border-gray-200"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Create New Category
          </h3>
          
          <div className="space-y-4">
            <Input
              label="Category Name"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Enter category name..."
              required
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color
              </label>
              <div className="flex gap-2">
                {predefinedColors.map(color => (
                  <button
                    key={color}
                    onClick={() => setNewCategoryColor(color)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      newCategoryColor === color 
                        ? 'border-gray-900 scale-110' 
                        : 'border-gray-300 hover:scale-105'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button
                onClick={handleCreateCategory}
                variant="primary"
                className="flex-1"
              >
                Create Category
              </Button>
              <Button
                onClick={() => {
                  setIsCreating(false);
                  setNewCategoryName('');
                  setNewCategoryColor('#5B21B6');
                }}
                variant="secondary"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Categories List */}
      {filteredCategories.length === 0 ? (
        <Empty
          icon="Folder"
          title="No categories found"
          description="Create your first category to organize your tasks better"
          onAction={() => setIsCreating(true)}
          actionText="Create Category"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map(category => {
            const stats = getCategoryStats(category.Id);
            
            return (
              <motion.div
                key={category.Id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-200 hover-lift"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${category.color}15` }}
                    >
                      <ApperIcon
                        name={category.icon || 'Folder'}
                        size={20}
                        style={{ color: category.color }}
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {category.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {stats.total} task{stats.total === 1 ? '' : 's'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingCategory(category)}
                    >
                      <ApperIcon name="Edit" size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteCategory(category.Id)}
                      className="text-error hover:text-error hover:bg-error/10"
                    >
                      <ApperIcon name="Trash2" size={16} />
                    </Button>
                  </div>
                </div>
                
                {stats.total > 0 && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-medium">
                        {stats.completed}/{stats.total}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all duration-500"
                        style={{ 
                          width: `${stats.progress}%`,
                          backgroundColor: category.color
                        }}
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CategoriesView;