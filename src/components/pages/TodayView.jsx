import { useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { isToday } from 'date-fns';
import TaskList from '@/components/organisms/TaskList';
import ProgressRing from '@/components/molecules/ProgressRing';
import ApperIcon from '@/components/ApperIcon';
import { useTasks } from '@/hooks/useTasks';

const TodayView = () => {
  const { searchQuery, onTaskEdit } = useOutletContext();
  const { tasks, loading, error, refetch } = useTasks();

  // Filter tasks for today
  const todayTasks = useMemo(() => {
    let filtered = tasks.filter(task => {
      if (!task.dueDate) return false;
      return isToday(new Date(task.dueDate));
    });

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered.sort((a, b) => {
      // Sort by completion status first (incomplete first)
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      // Then by priority
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }, [tasks, searchQuery]);

  // Calculate progress
  const progress = useMemo(() => {
    const total = todayTasks.length;
    const completed = todayTasks.filter(t => t.completed).length;
    return {
      total,
      completed,
      percentage: total > 0 ? (completed / total) * 100 : 0
    };
  }, [todayTasks]);

  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Good morning' : currentHour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="space-y-6">
      {/* Today's Overview */}
      <div className="bg-gradient-to-r from-primary/10 to-primary-light/10 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {greeting}! 👋
            </h2>
            <p className="text-gray-600 mb-4">
              {progress.total === 0 
                ? "You have no tasks scheduled for today. Great job staying on top of things!"
                : `You have ${progress.total} task${progress.total === 1 ? '' : 's'} scheduled for today.`
              }
            </p>
            
            {progress.total > 0 && (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <ApperIcon name="CheckCircle" size={16} className="text-success" />
                  <span>{progress.completed} completed</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <ApperIcon name="Clock" size={16} className="text-warning" />
                  <span>{progress.total - progress.completed} remaining</span>
                </div>
              </div>
            )}
          </div>
          
          {progress.total > 0 && (
            <ProgressRing
              progress={progress.percentage}
              size={80}
              strokeWidth={6}
              color="#5B21B6"
            />
          )}
        </div>
      </div>

      {/* Today's Tasks */}
      <div className="bg-white rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Today's Tasks
          </h3>
          {progress.total > 0 && (
            <div className="text-sm text-gray-600">
              {progress.completed} of {progress.total} completed
            </div>
          )}
        </div>
        
        <TaskList
          tasks={todayTasks}
          loading={loading}
          error={error}
          onTaskEdit={onTaskEdit}
          onRefresh={refetch}
          emptyMessage="No tasks scheduled for today"
          emptyDescription="You're all caught up! Add a task or check your upcoming tasks."
        />
      </div>
    </div>
  );
};

export default TodayView;