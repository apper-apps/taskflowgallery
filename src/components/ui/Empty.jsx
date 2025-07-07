import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const Empty = ({ 
  icon = 'CheckSquare',
  title = 'No tasks yet',
  description = 'Create your first task to get started with TaskFlow',
  actionText = 'Create Task',
  onAction,
  className = ''
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`flex flex-col items-center justify-center py-16 px-4 ${className}`}
    >
      <div className="text-center max-w-md">
        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-primary to-primary-light rounded-full flex items-center justify-center">
          <ApperIcon name={icon} size={40} className="text-white" />
        </div>
        
        <h3 className="text-xl font-semibold text-gray-900 mb-3 gradient-text">
          {title}
        </h3>
        
        <p className="text-gray-600 mb-8 leading-relaxed">
          {description}
        </p>
        
        {onAction && (
          <Button 
            onClick={onAction} 
            variant="primary"
            size="lg"
            className="hover-lift"
          >
            <ApperIcon name="Plus" size={20} />
            {actionText}
          </Button>
        )}
      </div>
    </motion.div>
  );
};

export default Empty;