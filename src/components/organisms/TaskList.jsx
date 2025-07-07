import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { format, isToday, isPast } from 'date-fns';
import Checkbox from '@/components/atoms/Checkbox';
import Badge from '@/components/atoms/Badge';
import Button from '@/components/atoms/Button';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import TaskQuickActions from '@/components/molecules/TaskQuickActions';
import CategoryPill from '@/components/molecules/CategoryPill';
import ApperIcon from '@/components/ApperIcon';
import { useTasks } from '@/hooks/useTasks';
import { useCategories } from '@/hooks/useCategories';

const TaskList = ({ 
  tasks = [], 
  loading = false, 
  error = '', 
  onTaskEdit,
  onRefresh,
  showCompleted = false,
  emptyMessage = 'No tasks found',
  emptyDescription = 'Create your first task to get started',
  onQuickAdd
}) => {
  const [deletingTask, setDeletingTask] = useState(null);
  
  const { deleteTask, toggleComplete, addTask } = useTasks();
  const { categories } = useCategories();

  const getCategoryById = (categoryId) => {
    return categories.find(cat => cat.Id === categoryId);
  };

  const handleToggleComplete = async (taskId) => {
    try {
      await toggleComplete(taskId);
      const task = tasks.find(t => t.Id === taskId);
      toast.success(
        task?.completed ? 'Task marked as incomplete' : 'Task completed! 🎉'
      );
    } catch (error) {
      toast.error('Failed to update task status');
    }
  };

  const handleDelete = async (taskId) => {
    if (deletingTask) return;
    
    setDeletingTask(taskId);
    try {
      await deleteTask(taskId);
      toast.success('Task deleted successfully');
    } catch (error) {
      toast.error('Failed to delete task');
    } finally {
      setDeletingTask(null);
    }
  };

  const handleDuplicate = async (task) => {
    try {
      await addTask({
        title: `${task.title} (Copy)`,
        description: task.description,
        categoryId: task.categoryId,
        priority: task.priority,
        dueDate: task.dueDate,
      });
      toast.success('Task duplicated successfully');
    } catch (error) {
      toast.error('Failed to duplicate task');
    }
  };

  const getDueDateDisplay = (dueDate) => {
    if (!dueDate) return null;
    
    const date = new Date(dueDate);
    const now = new Date();
    
    if (isToday(date)) {
      return {
        text: format(date, 'h:mm a'),
        color: 'text-primary',
        bgColor: 'bg-primary/10',
        icon: 'Clock'
      };
    }
    
    if (isPast(date)) {
      return {
        text: format(date, 'MMM d'),
        color: 'text-error',
        bgColor: 'bg-error/10',
        icon: 'AlertCircle'
      };
    }
    
    return {
      text: format(date, 'MMM d'),
      color: 'text-gray-600',
      bgColor: 'bg-gray-100',
      icon: 'Calendar'
    };
  };

  if (loading) {
    return <Loading type="tasks" />;
  }

  if (error) {
    return (
      <Error 
        message={error} 
        onRetry={onRefresh}
      />
    );
  }

  if (tasks.length === 0) {
    return (
      <Empty
        title={emptyMessage}
        description={emptyDescription}
        onAction={onQuickAdd}
        actionText="Create Task"
      />
    );
  }

  return (
    <div className="space-y-3">
      <AnimatePresence>
        {tasks.map((task) => {
          const category = getCategoryById(task.categoryId);
          const dueDateInfo = getDueDateDisplay(task.dueDate);
          
          return (
            <motion.div
              key={task.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.2 }}
              className={`bg-white rounded-lg border border-gray-200 p-4 hover:shadow-lg transition-all duration-200 hover-lift ${
                task.completed ? 'opacity-75' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="pt-1">
                    <Checkbox
                      checked={task.completed}
                      onChange={() => handleToggleComplete(task.Id)}
                      className="checkbox-animate"
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={`font-medium text-gray-900 ${
                        task.completed ? 'line-through text-gray-500' : ''
                      }`}>
                        {task.title}
                      </h3>
                      <Badge variant={task.priority} size="sm">
                        {task.priority}
                      </Badge>
                    </div>
                    
                    {task.description && (
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {task.description}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-2 flex-wrap">
                      {category && (
                        <CategoryPill category={category} />
                      )}
                      
                      {dueDateInfo && (
                        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${dueDateInfo.bgColor} ${dueDateInfo.color}`}>
                          <ApperIcon name={dueDateInfo.icon} size={12} />
                          {dueDateInfo.text}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onTaskEdit?.(task)}
                  >
                    <ApperIcon name="Edit" size={16} />
                  </Button>
                  
                  <TaskQuickActions
                    task={task}
                    onEdit={() => onTaskEdit?.(task)}
                    onDelete={() => handleDelete(task.Id)}
                    onDuplicate={() => handleDuplicate(task)}
                  />
                </div>
              </div>
              
              {deletingTask === task.Id && (
                <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <ApperIcon name="Loader2" size={16} className="animate-spin" />
                    Deleting...
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default TaskList;