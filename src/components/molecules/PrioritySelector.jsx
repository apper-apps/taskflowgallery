import { cn } from '@/utils/cn';
import ApperIcon from '@/components/ApperIcon';

const PrioritySelector = ({ 
  value = 'medium', 
  onChange, 
  className = '',
  compact = false
}) => {
  const priorities = [
    { value: 'low', label: 'Low', color: 'text-success', icon: 'ArrowDown' },
    { value: 'medium', label: 'Medium', color: 'text-warning', icon: 'Minus' },
    { value: 'high', label: 'High', color: 'text-error', icon: 'ArrowUp' },
  ];

  if (compact) {
    return (
      <div className={cn('flex gap-1', className)}>
        {priorities.map((priority) => (
          <button
            key={priority.value}
            onClick={() => onChange?.(priority.value)}
            className={cn(
              'w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200',
              value === priority.value 
                ? `bg-gradient-to-r ${priority.value === 'high' ? 'from-error to-red-600' : priority.value === 'medium' ? 'from-warning to-yellow-600' : 'from-success to-green-600'} text-white shadow-md`
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            )}
          >
            <ApperIcon name={priority.icon} size={14} />
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className={cn('space-y-2', className)}>
      <label className="block text-sm font-medium text-gray-700">
        Priority
      </label>
      <div className="flex gap-2">
        {priorities.map((priority) => (
          <button
            key={priority.value}
            type="button"
            onClick={() => onChange?.(priority.value)}
            className={cn(
              'flex items-center gap-2 px-3 py-2 rounded-lg border transition-all duration-200 hover:scale-105',
              value === priority.value
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
            )}
          >
            <ApperIcon name={priority.icon} size={16} className={priority.color} />
            <span className="text-sm font-medium">{priority.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default PrioritySelector;