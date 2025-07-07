import { cn } from '@/utils/cn';
import ApperIcon from '@/components/ApperIcon';

const CategoryPill = ({ 
  category,
  isActive = false,
  onClick,
  showCount = false,
  className = ''
}) => {
  if (!category) return null;

  return (
    <button
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105 category-pill',
        isActive && 'bg-primary/15 border-primary/30 text-primary',
        className
      )}
      style={{
        backgroundColor: isActive ? `${category.color}15` : `${category.color}10`,
        borderColor: isActive ? `${category.color}30` : `${category.color}20`,
        color: isActive ? category.color : category.color
      }}
    >
      {category.icon && (
        <ApperIcon name={category.icon} size={14} />
      )}
      <span>{category.name}</span>
      {showCount && (
        <span className="bg-white/20 px-1.5 py-0.5 rounded-full text-xs">
          {category.taskCount || 0}
        </span>
      )}
    </button>
  );
};

export default CategoryPill;