import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const Error = ({ message = "Something went wrong", onRetry, variant = 'default' }) => {
  const getErrorContent = () => {
    switch (variant) {
      case 'tasks':
        return {
          icon: 'CheckSquare',
          title: 'Unable to load tasks',
          description: 'There was a problem loading your tasks. Please try again.'
        };
      case 'projects':
        return {
          icon: 'FolderOpen',
          title: 'Unable to load projects',
          description: 'There was a problem loading your projects. Please try again.'
        };
      case 'network':
        return {
          icon: 'Wifi',
          title: 'Connection problem',
          description: 'Please check your internet connection and try again.'
        };
      default:
        return {
          icon: 'AlertCircle',
          title: 'Oops! Something went wrong',
          description: message
        };
    }
  };

  const content = getErrorContent();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center min-h-[400px] p-8"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
        className="mb-6"
      >
        <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg">
          <ApperIcon name={content.icon} size={32} className="text-white" />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-center max-w-md"
      >
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {content.title}
        </h3>
        <p className="text-gray-600 mb-6">
          {content.description}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {onRetry && (
            <Button
              onClick={onRetry}
              className="bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-2 transform hover:scale-105 transition-all duration-200"
            >
              <ApperIcon name="RefreshCw" size={16} className="mr-2" />
              Try Again
            </Button>
          )}
          <Button
            variant="outline"
            onClick={() => window.location.reload()}
            className="px-6 py-2 hover:bg-gray-50 transition-colors duration-200"
          >
            <ApperIcon name="RotateCcw" size={16} className="mr-2" />
            Refresh Page
          </Button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-8 text-center"
      >
        <p className="text-sm text-gray-500">
          If this problem persists, please contact support
        </p>
      </motion.div>
    </motion.div>
  );
};

export default Error;