import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import SearchBar from '@/components/molecules/SearchBar';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const Header = ({ onSearch, onQuickAdd, onMenuToggle }) => {
  const location = useLocation();
  const [searchValue, setSearchValue] = useState('');

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'All Tasks';
      case '/today':
        return 'Today';
      case '/upcoming':
        return 'Upcoming';
      case '/categories':
        return 'Categories';
      case '/completed':
        return 'Completed';
      default:
        return 'Tasks';
    }
  };

  const handleSearch = (value) => {
    setSearchValue(value);
    onSearch?.(value);
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuToggle}
            className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ApperIcon name="Menu" size={20} />
          </button>
          
          <div>
            <h1 className="text-2xl font-bold gradient-text">
              {getPageTitle()}
            </h1>
            <p className="text-sm text-gray-600">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:block">
            <SearchBar
              placeholder="Search tasks..."
              onSearch={handleSearch}
              className="w-80"
            />
          </div>
          
          <Button
            onClick={onQuickAdd}
            variant="primary"
            size="md"
            className="hover-lift"
          >
            <ApperIcon name="Plus" size={16} />
            <span className="hidden sm:inline">Add Task</span>
          </Button>
        </div>
      </div>

      {/* Mobile search */}
      <div className="md:hidden mt-4">
        <SearchBar
          placeholder="Search tasks..."
          onSearch={handleSearch}
        />
      </div>
    </header>
  );
};

export default Header;