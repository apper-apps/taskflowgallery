import { motion } from 'framer-motion';

const Loading = ({ type = 'tasks' }) => {
  const SkeletonBar = ({ width = 'w-full', height = 'h-4' }) => (
    <div className={`${width} ${height} bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-pulse`} />
  );

  const TaskSkeleton = () => (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-5 h-5 bg-gray-300 rounded animate-pulse" />
          <div className="flex-1 space-y-2">
            <SkeletonBar width="w-3/4" height="h-4" />
            <SkeletonBar width="w-1/2" height="h-3" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-16 h-6 bg-gray-300 rounded-full animate-pulse" />
          <div className="w-20 h-6 bg-gray-300 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );

  const CategorySkeleton = () => (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gray-300 rounded-full animate-pulse" />
          <div className="space-y-2">
            <SkeletonBar width="w-24" height="h-4" />
            <SkeletonBar width="w-16" height="h-3" />
          </div>
        </div>
        <div className="w-8 h-8 bg-gray-300 rounded animate-pulse" />
      </div>
    </div>
  );

  const renderSkeletons = () => {
    switch (type) {
      case 'categories':
        return Array(4).fill(0).map((_, i) => <CategorySkeleton key={i} />);
      case 'stats':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="space-y-3">
                  <SkeletonBar width="w-1/2" height="h-4" />
                  <SkeletonBar width="w-1/3" height="h-8" />
                  <SkeletonBar width="w-2/3" height="h-3" />
                </div>
              </div>
            ))}
          </div>
        );
      default:
        return Array(5).fill(0).map((_, i) => <TaskSkeleton key={i} />);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      {renderSkeletons()}
    </motion.div>
  );
};

export default Loading;