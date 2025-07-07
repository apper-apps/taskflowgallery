import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const Error = ({ message = 'Something went wrong', onRetry, className = '' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col items-center justify-center py-12 px-4 ${className}`}
    >
      <div className="text-center max-w-md">
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-error to-red-600 rounded-full flex items-center justify-center">
          <ApperIcon name="AlertCircle" size={32} className="text-white" />
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Oops! Something went wrong
        </h3>
        
        <p className="text-gray-600 mb-6">
          {message}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {onRetry && (
            <Button onClick={onRetry} variant="primary">
              <ApperIcon name="RefreshCw" size={16} />
              Try Again
            </Button>
          )}
          <Button 
            onClick={() => window.location.reload()} 
            variant="secondary"
          >
            <ApperIcon name="RotateCcw" size={16} />
            Reload Page
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default Error;