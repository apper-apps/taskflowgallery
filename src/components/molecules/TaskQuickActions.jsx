import { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import { cn } from '@/utils/cn';

const TaskQuickActions = ({ 
  task,
  onEdit,
  onDelete,
  onToggleComplete,
  onDuplicate,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const actions = [
    { icon: 'Edit', label: 'Edit', onClick: onEdit },
    { icon: 'Copy', label: 'Duplicate', onClick: onDuplicate },
    { icon: 'Trash2', label: 'Delete', onClick: onDelete, variant: 'danger' },
  ];

  return (
    <div className={cn('relative', className)}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="w-8 h-8 p-0"
      >
        <ApperIcon name="MoreHorizontal" size={16} />
      </Button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="absolute right-0 top-full mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20"
          >
            {actions.map((action, index) => (
              <button
                key={index}
                onClick={() => {
                  action.onClick?.();
                  setIsOpen(false);
                }}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2 text-sm text-left hover:bg-gray-50 transition-colors',
                  action.variant === 'danger' ? 'text-error hover:bg-red-50' : 'text-gray-700'
                )}
              >
                <ApperIcon name={action.icon} size={16} />
                {action.label}
              </button>
            ))}
          </motion.div>
        </>
      )}
    </div>
  );
};

export default TaskQuickActions;