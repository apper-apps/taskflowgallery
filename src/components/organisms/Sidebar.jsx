import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import ApperIcon from '@/components/ApperIcon';
import ProgressRing from '@/components/molecules/ProgressRing';

const Sidebar = ({ isOpen, onClose, stats = {} }) => {
const navigation = [
    { name: 'All Tasks', href: '/', icon: 'CheckSquare', count: stats.totalTasks || 0 },
    { name: 'Today', href: '/today', icon: 'Calendar', count: stats.todayTasks || 0 },
    { name: 'Upcoming', href: '/upcoming', icon: 'Clock', count: stats.upcomingTasks || 0 },
    { name: 'Categories', href: '/categories', icon: 'Folder', count: stats.categories || 0 },
    { name: 'Projects', href: '/projects', icon: 'ClipboardList', count: stats.projects || 0 },
    { name: 'Completed', href: '/completed', icon: 'CheckCircle', count: stats.completedTasks || 0 },
  ];

  const SidebarContent = () => (
    <div className="h-full flex flex-col bg-white border-r border-gray-200">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-primary to-primary-light rounded-lg flex items-center justify-center">
            <ApperIcon name="CheckSquare" size={20} className="text-white" />
          </div>
          <h1 className="text-xl font-bold gradient-text">TaskFlow</h1>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            onClick={onClose}
            className={({ isActive }) => cn(
              'flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 hover:bg-gray-50 group',
              isActive ? 'bg-gradient-to-r from-primary/10 to-primary-light/10 text-primary border-r-2 border-primary' : 'text-gray-700 hover:text-primary'
            )}
          >
            <div className="flex items-center gap-3">
              <ApperIcon name={item.icon} size={20} />
              <span className="font-medium">{item.name}</span>
            </div>
            {item.count > 0 && (
              <span className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs font-medium group-hover:bg-primary/10 group-hover:text-primary">
                {item.count}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Progress Summary */}
      <div className="p-4 border-t border-gray-200">
        <div className="bg-gradient-to-r from-primary/5 to-primary-light/5 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-700">Today's Progress</h3>
            <ProgressRing 
              progress={stats.todayProgress || 0} 
              size={40} 
              strokeWidth={3}
              color="#5B21B6"
            />
          </div>
          <div className="text-xs text-gray-600">
            {stats.completedToday || 0} of {stats.totalToday || 0} tasks completed
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64 h-full">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div 
            className="absolute inset-0 bg-black/50"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="relative w-80 max-w-[80vw] h-full"
          >
            <SidebarContent />
          </motion.div>
        </div>
      )}
    </>
  );
};

export default Sidebar;