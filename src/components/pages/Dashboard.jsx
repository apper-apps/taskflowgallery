import { useState, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { isToday, isTomorrow, isPast } from 'date-fns';
import StatsWidget from '@/components/organisms/StatsWidget';
import TaskList from '@/components/organisms/TaskList';
import TaskFilters from '@/components/organisms/TaskFilters';
import { useTasks } from '@/hooks/useTasks';

const Dashboard = () => {
  const { searchQuery, onTaskEdit } = useOutletContext();
  const { tasks, loading, error, refetch } = useTasks();
  const [filters, setFilters] = useState({});

  // Filter and sort tasks based on search and filters
  const filteredTasks = useMemo(() => {
    let filtered = [...tasks];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply category filter
    if (filters.category) {
      filtered = filtered.filter(task => task.categoryId === filters.category);
    }

    // Apply priority filter
    if (filters.priority) {
      filtered = filtered.filter(task => task.priority === filters.priority);
    }

    // Apply status filter
    if (filters.status) {
      if (filters.status === 'active') {
        filtered = filtered.filter(task => !task.completed);
      } else if (filters.status === 'completed') {
        filtered = filtered.filter(task => task.completed);
      }
    }

    // Apply sorting
    const sortBy = filters.sort || 'created';
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'dueDate':
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate) - new Date(b.dueDate);
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

    return filtered;
  }, [tasks, searchQuery, filters]);

  // Calculate stats
  const stats = useMemo(() => {
    const today = new Date();
    
    const totalTasks = tasks.filter(t => !t.completed).length;
    const completedTasks = tasks.filter(t => t.completed).length;
    
    const todayTasks = tasks.filter(t => {
      if (!t.dueDate) return false;
      return isToday(new Date(t.dueDate));
    });
    
    const completedToday = todayTasks.filter(t => t.completed).length;
    const totalToday = todayTasks.length;
    
    const overdueTasks = tasks.filter(t => {
      if (t.completed || !t.dueDate) return false;
      return isPast(new Date(t.dueDate)) && !isToday(new Date(t.dueDate));
    }).length;
    
    const inProgressTasks = tasks.filter(t => {
      if (t.completed) return false;
      if (!t.dueDate) return true;
      const dueDate = new Date(t.dueDate);
      return !isPast(dueDate) || isToday(dueDate) || isTomorrow(dueDate);
    }).length;

    return {
      totalTasks,
      completedTasks,
      completedToday,
      totalToday,
      todayProgress: totalToday > 0 ? (completedToday / totalToday) * 100 : 0,
      overdue: overdueTasks,
      inProgress: inProgressTasks,
    };
  }, [tasks]);

  return (
    <div className="space-y-6">
      <StatsWidget stats={stats} />
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <TaskFilters
            filters={filters}
            onFilterChange={setFilters}
            className="sticky top-6"
          />
        </div>
        
        <div className="lg:col-span-3">
          <TaskList
            tasks={filteredTasks}
            loading={loading}
            error={error}
            onTaskEdit={onTaskEdit}
            onRefresh={refetch}
            emptyMessage="No tasks found"
            emptyDescription="Create your first task or adjust your filters to see tasks here."
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;