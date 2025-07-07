import { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import Select from '@/components/atoms/Select';
import CategoryPill from '@/components/molecules/CategoryPill';
import ApperIcon from '@/components/ApperIcon';
import { useCategories } from '@/hooks/useCategories';

const TaskFilters = ({ 
  onFilterChange, 
  filters = {},
  showCategoryFilter = true,
  showPriorityFilter = true,
  showStatusFilter = true,
  showSortFilter = true,
  className = ''
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { categories } = useCategories();

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    onFilterChange?.(newFilters);
  };

  const clearFilters = () => {
    onFilterChange?.({});
  };

  const hasActiveFilters = Object.values(filters).some(value => value);

  const priorityOptions = [
    { value: '', label: 'All Priorities' },
    { value: 'high', label: 'High Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'low', label: 'Low Priority' },
  ];

  const statusOptions = [
    { value: '', label: 'All Tasks' },
    { value: 'active', label: 'Active Tasks' },
    { value: 'completed', label: 'Completed Tasks' },
  ];

  const sortOptions = [
    { value: 'created', label: 'Date Created' },
    { value: 'dueDate', label: 'Due Date' },
    { value: 'priority', label: 'Priority' },
    { value: 'title', label: 'Title' },
  ];

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ApperIcon name="Filter" size={20} className="text-gray-600" />
          <h3 className="font-medium text-gray-900">Filters</h3>
          {hasActiveFilters && (
            <div className="w-2 h-2 bg-primary rounded-full"></div>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-gray-600 hover:text-gray-900"
            >
              <ApperIcon name="X" size={16} />
              Clear
            </Button>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="lg:hidden"
          >
            <ApperIcon 
              name={isExpanded ? "ChevronUp" : "ChevronDown"} 
              size={16} 
            />
          </Button>
        </div>
      </div>

      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ 
          height: isExpanded || window.innerWidth >= 1024 ? 'auto' : 0,
          opacity: isExpanded || window.innerWidth >= 1024 ? 1 : 0
        }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="space-y-4">
          {/* Category Filter */}
          {showCategoryFilter && categories.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <div className="flex flex-wrap gap-2">
                <CategoryPill
                  category={{ name: 'All', color: '#6B7280' }}
                  isActive={!filters.category}
                  onClick={() => handleFilterChange('category', '')}
                />
                {categories.map(category => (
                  <CategoryPill
                    key={category.Id}
                    category={category}
                    isActive={filters.category === category.Id}
                    onClick={() => handleFilterChange('category', category.Id)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Priority Filter */}
          {showPriorityFilter && (
            <div>
              <Select
                label="Priority"
                value={filters.priority || ''}
                onChange={(e) => handleFilterChange('priority', e.target.value)}
              >
                {priorityOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </div>
          )}

          {/* Status Filter */}
          {showStatusFilter && (
            <div>
              <Select
                label="Status"
                value={filters.status || ''}
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </div>
          )}

          {/* Sort Filter */}
          {showSortFilter && (
            <div>
              <Select
                label="Sort by"
                value={filters.sort || 'created'}
                onChange={(e) => handleFilterChange('sort', e.target.value)}
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default TaskFilters;