import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const Empty = ({ variant = 'tasks', onAction, actionText = 'Get Started' }) => {
  const getEmptyContent = () => {
    switch (variant) {
      case 'tasks':
        return {
          icon: 'CheckSquare',
          title: 'No tasks yet',
          description: 'Create your first task to get started with your productivity journey.',
          illustration: (
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center">
                <ApperIcon name="Plus" size={32} className="text-blue-600" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center">
                <ApperIcon name="Sparkles" size={16} className="text-white" />
              </div>
            </div>
          )
        };
      case 'projects':
        return {
          icon: 'FolderOpen',
          title: 'No projects yet',
          description: 'Create your first project to organize your tasks and boost your productivity.',
          illustration: (
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center">
                <ApperIcon name="FolderPlus" size={32} className="text-purple-600" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center">
                <ApperIcon name="Zap" size={16} className="text-white" />
              </div>
            </div>
          )
        };
      case 'search':
        return {
          icon: 'Search',
          title: 'No results found',
          description: 'Try adjusting your search terms or filters to find what you\'re looking for.',
          illustration: (
            <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center">
              <ApperIcon name="Search" size={32} className="text-gray-600" />
            </div>
          )
        };
      case 'completed':
        return {
          icon: 'CheckCircle',
          title: 'No completed tasks',
          description: 'Complete some tasks to see them here. You\'re doing great!',
          illustration: (
            <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center">
              <ApperIcon name="Trophy" size={32} className="text-green-600" />
            </div>
          )
        };
      default:
        return {
          icon: 'Inbox',
          title: 'Nothing to show',
          description: 'There\'s nothing here yet. Start by adding some content.',
          illustration: (
            <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center">
              <ApperIcon name="Inbox" size={32} className="text-gray-600" />
            </div>
          )
        };
    }
  };

  const content = getEmptyContent();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center min-h-[400px] p-8"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
        className="mb-6"
      >
        {content.illustration}
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

        {onAction && variant !== 'search' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Button
              onClick={onAction}
              className="bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              <ApperIcon name="Plus" size={16} className="mr-2" />
              {actionText}
            </Button>
          </motion.div>
        )}
      </motion.div>

      {variant === 'search' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6 text-center"
        >
          <p className="text-sm text-gray-500">
            Try using different keywords or remove some filters
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Empty;