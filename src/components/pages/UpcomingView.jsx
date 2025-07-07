import { useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { isAfter, startOfDay, format, isThisWeek, isNextWeek } from 'date-fns';
import TaskList from '@/components/organisms/TaskList';
import ApperIcon from '@/components/ApperIcon';
import { useTasks } from '@/hooks/useTasks';

const UpcomingView = () => {
  const { searchQuery, onTaskEdit } = useOutletContext();
  const { tasks, loading, error, refetch } = useTasks();

  // Group upcoming tasks by time period
  const upcomingTasks = useMemo(() => {
    const tomorrow = startOfDay(new Date());
    tomorrow.setDate(tomorrow.getDate() + 1);

    let filtered = tasks.filter(task => {
      if (task.completed || !task.dueDate) return false;
      return isAfter(new Date(task.dueDate), tomorrow);
    });

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Group by time period
    const thisWeek = [];
    const nextWeek = [];
    const later = [];

    filtered.forEach(task => {
      const dueDate = new Date(task.dueDate);
      if (isThisWeek(dueDate)) {
        thisWeek.push(task);
      } else if (isNextWeek(dueDate)) {
        nextWeek.push(task);
      } else {
        later.push(task);
      }
    });

    // Sort each group
    const sortTasks = (tasks) => {
      return tasks.sort((a, b) => {
        const dateA = new Date(a.dueDate);
        const dateB = new Date(b.dueDate);
        if (dateA.getTime() !== dateB.getTime()) {
          return dateA - dateB;
        }
        // If same date, sort by priority
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      });
    };

    return {
      thisWeek: sortTasks(thisWeek),
      nextWeek: sortTasks(nextWeek),
      later: sortTasks(later),
      total: filtered.length
    };
  }, [tasks, searchQuery]);

  const TaskSection = ({ title, tasks, icon, emptyMessage }) => {
    if (tasks.length === 0) return null;
    
    return (
      <div className="bg-white rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-gradient-to-r from-primary/10 to-primary-light/10 rounded-lg flex items-center justify-center">
            <ApperIcon name={icon} size={18} className="text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-sm font-medium">
            {tasks.length}
          </span>
        </div>
        
        <TaskList
          tasks={tasks}
          loading={false}
          error=""
          onTaskEdit={onTaskEdit}
          onRefresh={refetch}
          emptyMessage={emptyMessage}
        />
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Overview */}
      <div className="bg-gradient-to-r from-primary/10 to-primary-light/10 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Upcoming Tasks
            </h2>
            <p className="text-gray-600">
              {upcomingTasks.total === 0 
                ? "No upcoming tasks scheduled. You're all caught up!"
                : `You have ${upcomingTasks.total} task${upcomingTasks.total === 1 ? '' : 's'} coming up.`
              }
            </p>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <ApperIcon name="Calendar" size={16} />
              <span>This Week: {upcomingTasks.thisWeek.length}</span>
            </div>
            <div className="flex items-center gap-2">
              <ApperIcon name="CalendarDays" size={16} />
              <span>Next Week: {upcomingTasks.nextWeek.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Task Sections */}
      <TaskSection
        title="This Week"
        tasks={upcomingTasks.thisWeek}
        icon="Calendar"
        emptyMessage="No tasks this week"
      />
      
      <TaskSection
        title="Next Week"
        tasks={upcomingTasks.nextWeek}
        icon="CalendarDays"
        emptyMessage="No tasks next week"
      />
      
      <TaskSection
        title="Later"
        tasks={upcomingTasks.later}
        icon="CalendarPlus"
        emptyMessage="No tasks scheduled for later"
      />

      {/* Empty State */}
      {upcomingTasks.total === 0 && (
        <div className="bg-white rounded-xl p-12 text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-primary/10 to-primary-light/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <ApperIcon name="Calendar" size={32} className="text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No upcoming tasks
          </h3>
          <p className="text-gray-600">
            You're all caught up! Create new tasks or check your completed tasks.
          </p>
        </div>
      )}
    </div>
  );
};

export default UpcomingView;