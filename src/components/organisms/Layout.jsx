import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from '@/components/organisms/Sidebar';
import Header from '@/components/organisms/Header';
import TaskModal from '@/components/organisms/TaskModal';
import { useTasks } from '@/hooks/useTasks';
import { useCategories } from '@/hooks/useCategories';

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [projectCreateHandler, setProjectCreateHandler] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTask, setSelectedTask] = useState(null);

  const { tasks } = useTasks();
  const { categories } = useCategories();

  // Calculate stats for sidebar
  const stats = {
    totalTasks: tasks.filter(t => !t.completed).length,
    todayTasks: tasks.filter(t => {
      if (t.completed) return false;
      const today = new Date().toDateString();
      return t.dueDate ? new Date(t.dueDate).toDateString() === today : false;
    }).length,
    upcomingTasks: tasks.filter(t => {
      if (t.completed) return false;
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      return t.dueDate ? new Date(t.dueDate) > tomorrow : false;
    }).length,
    categories: categories.length,
    completedTasks: tasks.filter(t => t.completed).length,
    todayProgress: (() => {
      const todayTasks = tasks.filter(t => {
        if (!t.dueDate) return false;
        const today = new Date().toDateString();
        return new Date(t.dueDate).toDateString() === today;
      });
      if (todayTasks.length === 0) return 0;
      const completed = todayTasks.filter(t => t.completed).length;
      return (completed / todayTasks.length) * 100;
    })(),
    completedToday: tasks.filter(t => {
      if (!t.completed || !t.dueDate) return false;
      const today = new Date().toDateString();
      return new Date(t.dueDate).toDateString() === today;
    }).length,
    totalToday: tasks.filter(t => {
      if (!t.dueDate) return false;
      const today = new Date().toDateString();
      return new Date(t.dueDate).toDateString() === today;
    }).length,
  };

  const handleQuickAdd = () => {
    setSelectedTask(null);
    setIsTaskModalOpen(true);
  };

  const handleTaskEdit = (task) => {
    setSelectedTask(task);
setIsTaskModalOpen(true);
  };

  const handleAddProject = () => {
    if (projectCreateHandler) {
      projectCreateHandler();
    }
  };
  const handleTaskModalClose = () => {
    setIsTaskModalOpen(false);
    setSelectedTask(null);
  };

  return (
    <div className="h-screen flex bg-gray-50">
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)}
        stats={stats}
      />
      
<div className="flex-1 flex flex-col min-w-0">
        <Header 
          onSearch={setSearchQuery}
          onQuickAdd={handleQuickAdd}
          onMenuToggle={() => setIsSidebarOpen(true)}
          onAddProject={handleAddProject}
        />
        
        <main className="flex-1 overflow-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="p-6"
          >
<Outlet context={{ 
              searchQuery, 
              onTaskEdit: handleTaskEdit,
              stats,
              setProjectCreateHandler
            }} />
          </motion.div>
        </main>
      </div>

      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={handleTaskModalClose}
        task={selectedTask}
      />
    </div>
  );
};

export default Layout;