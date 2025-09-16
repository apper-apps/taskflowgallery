import React, { useState, useContext } from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import SearchBar from "@/components/molecules/SearchBar";
import Button from "@/components/atoms/Button";
import { AuthContext } from "@/App";
const Header = ({ onSearch, onQuickAdd, onMenuToggle, onAddProject }) => {
  const location = useLocation();
const [searchValue, setSearchValue] = useState('');
  const { logout } = useContext(AuthContext);
  const { user } = useSelector((state) => state.user);

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
      case '/projects':
        return 'Projects';
      case '/subtasks':
        return 'Subtasks';
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
        {location.pathname === '/projects' && onAddProject && (
          <Button 
            onClick={onAddProject}
            variant="primary"
            size="sm"
            className="flex items-center gap-2"
          >
            <ApperIcon name="Plus" size={16} />
            Add Project
          </Button>
        )}
        
        <div className="hidden md:block">
          <SearchBar
            placeholder="Search tasks..."
            onSearch={handleSearch}
            className="w-80"
          />
        </div>
        
        {/* User Info and Logout */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
            <div className="w-6 h-6 bg-gradient-to-r from-primary to-primary-light rounded-full flex items-center justify-center">
              <span className="text-xs font-medium text-white">
                {user?.firstName?.charAt(0) || user?.emailAddress?.charAt(0) || 'U'}
              </span>
            </div>
            <span className="text-sm font-medium text-gray-700">
              {user?.firstName || user?.emailAddress?.split('@')[0] || 'User'}
            </span>
          </div>
          
          <Button
            onClick={logout}
            variant="outline"
            size="sm"
            className="flex items-center gap-2 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
          >
            <ApperIcon name="LogOut" size={16} />
            <span className="hidden sm:inline">Logout</span>
          </Button>
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