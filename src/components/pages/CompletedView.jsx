import { useState, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { motion } from 'framer-motion';
import TaskList from '@/components/organisms/TaskList';
import Button from '@/components/atoms/Button';
import Select from '@/components/atoms/Select';
import ApperIcon from '@/components/ApperIcon';
import { useTasks } from '@/hooks/useTasks';

const CompletedView = () => {
  const { searchQuery, onTaskEdit } = useOutletContext();
  const { tasks, loading, error, refetch } = useTasks();
  const [timeFilter, setTimeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('completedAt');

  // Filter completed tasks
  const completedTasks = useMemo(() => {
    let filtered = tasks.filter(task => task.completed);

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply time filter
    if (timeFilter !== 'all' && filtered.length > 0) {
      const now = new Date();
      let dateRange;

      switch (timeFilter) {
        case 'week':
          dateRange = {
            start: startOfWeek(now),
            end: endOfWeek(now)
          };
          break;
        case 'month':
          dateRange = {
            start: startOfMonth(now),
            end: endOfMonth(now)
          };
          break;
        default:
          dateRange = null;
      }

      if (dateRange) {
        filtered = filtered.filter(task => {
          if (!task.completedAt) return false;
          return isWithinInterval(new Date(task.completedAt), dateRange);
        });
      }
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'completedAt':
          return new Date(b.completedAt || b.createdAt) - new Date(a.completedAt || a.createdAt);
        case 'title':
          return a.title.localeCompare(b.title);
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        default:
          return new Date(b.completedAt || b.createdAt) - new Date(a.completedAt || a.createdAt);
      }
    });

    return filtered;
  }, [tasks, searchQuery, timeFilter, sortBy]);

  // Calculate stats
  const stats = useMemo(() => {
    const allCompleted = tasks.filter(task => task.completed);
    const now = new Date();
    const thisWeek = allCompleted.filter(task => {
      if (!task.completedAt) return false;
      return isWithinInterval(new Date(task.completedAt), {
        start: startOfWeek(now),
        end: endOfWeek(now)
      });
    });
    const thisMonth = allCompleted.filter(task => {
      if (!task.completedAt) return false;
      return isWithinInterval(new Date(task.completedAt), {
        start: startOfMonth(now),
        end: endOfMonth(now)
      });
    });

    return {
      total: allCompleted.length,
      thisWeek: thisWeek.length,
      thisMonth: thisMonth.length,
      filtered: completedTasks.length
    };
  }, [tasks, completedTasks]);

  const timeFilterOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' }
  ];

  const sortOptions = [
    { value: 'completedAt', label: 'Completion Date' },
    { value: 'title', label: 'Title' },
    { value: 'priority', label: 'Priority' }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="bg-gradient-to-r from-success/10 to-green-600/10 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Completed Tasks 🎉
            </h2>
            <p className="text-gray-600 mb-4">
              Great job! You've completed {stats.total} task{stats.total === 1 ? '' : 's'} in total.
            </p>
            
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-success rounded-full"></div>
                <span className="text-gray-600">This Week: {stats.thisWeek}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                <span className="text-gray-600">This Month: {stats.thisMonth}</span>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-3xl font-bold text-success mb-1">
              {stats.filtered}
            </div>
            <div className="text-sm text-gray-600">
              {timeFilter === 'all' ? 'Total' : timeFilterOptions.find(opt => opt.value === timeFilter)?.label}
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Filter & Sort
          </h3>
          <div className="text-sm text-gray-600">
            Showing {completedTasks.length} task{completedTasks.length === 1 ? '' : 's'}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Time Period"
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
          >
            {timeFilterOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
          
          <Select
            label="Sort By"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </div>
      </div>

      {/* Completed Tasks List */}
      <div className="bg-white rounded-xl p-6">
        <TaskList
          tasks={completedTasks}
          loading={loading}
          error={error}
          onTaskEdit={onTaskEdit}
          onRefresh={refetch}
          emptyMessage="No completed tasks found"
          emptyDescription="Complete some tasks to see them here. You've got this!"
          showCompleted={true}
        />
      </div>
    </div>
  );
};

export default CompletedView;