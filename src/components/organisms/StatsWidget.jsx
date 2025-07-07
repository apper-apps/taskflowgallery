import { motion } from 'framer-motion';
import ProgressRing from '@/components/molecules/ProgressRing';
import ApperIcon from '@/components/ApperIcon';

const StatsWidget = ({ stats = {}, className = '' }) => {
  const statCards = [
    {
      title: 'Total Tasks',
      value: stats.totalTasks || 0,
      icon: 'CheckSquare',
      color: '#5B21B6',
      change: '+2 from yesterday',
      trend: 'up'
    },
    {
      title: 'Completed Today',
      value: stats.completedToday || 0,
      icon: 'CheckCircle',
      color: '#10B981',
      change: `${stats.completedToday || 0} of ${stats.totalToday || 0} tasks`,
      trend: 'up'
    },
    {
      title: 'In Progress',
      value: stats.inProgress || 0,
      icon: 'Clock',
      color: '#F59E0B',
      change: 'Due this week',
      trend: 'neutral'
    },
    {
      title: 'Overdue',
      value: stats.overdue || 0,
      icon: 'AlertCircle',
      color: '#EF4444',
      change: 'Need attention',
      trend: 'down'
    }
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Progress Overview */}
      <div className="bg-gradient-to-r from-primary/10 to-primary-light/10 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Today's Progress
            </h3>
            <p className="text-gray-600">
              {stats.completedToday || 0} of {stats.totalToday || 0} tasks completed
            </p>
          </div>
          <ProgressRing
            progress={stats.todayProgress || 0}
            size={80}
            strokeWidth={6}
            color="#5B21B6"
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 hover-lift"
          >
            <div className="flex items-center justify-between mb-4">
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${stat.color}15` }}
              >
                <ApperIcon 
                  name={stat.icon} 
                  size={24} 
                  style={{ color: stat.color }}
                />
              </div>
              <div className={`flex items-center gap-1 text-xs ${
                stat.trend === 'up' ? 'text-success' : 
                stat.trend === 'down' ? 'text-error' : 'text-gray-500'
              }`}>
                <ApperIcon 
                  name={stat.trend === 'up' ? 'TrendingUp' : 
                        stat.trend === 'down' ? 'TrendingDown' : 'Minus'} 
                  size={12} 
                />
              </div>
            </div>
            
            <div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {stat.value}
              </div>
              <div className="text-sm font-medium text-gray-700 mb-2">
                {stat.title}
              </div>
              <div className="text-xs text-gray-500">
                {stat.change}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default StatsWidget;