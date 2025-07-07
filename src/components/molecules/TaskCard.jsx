import { motion } from 'framer-motion';
import { format } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Badge from '@/components/atoms/Badge';
import Button from '@/components/atoms/Button';
import { cn } from '@/utils/cn';

const TaskCard = ({ 
  task, 
  onEdit, 
  onDelete, 
  onToggleStatus,
  className,
  isDragging = false 
}) => {
  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'high';
      case 'medium': return 'medium';
      case 'low': return 'low';
      default: return 'default';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Done': return 'success';
      case 'InProgress': return 'primary';
      case 'ToDo': return 'default';
      default: return 'default';
    }
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'Done';

return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ 
        duration: 0.3,
        type: "spring",
        stiffness: 400,
        damping: 25
      }}
      className={cn(
        'bg-gradient-to-br from-white/95 to-surface-50/95 backdrop-blur-sm rounded-xl shadow-soft border border-white/20 p-5 hover:shadow-medium hover:border-white/40 transition-all duration-300 group',
        isDragging && 'shadow-hard rotate-2 scale-105 border-primary/30',
        isOverdue && 'border-red-200/50 bg-gradient-to-br from-red-50/30 to-white/95',
        className
      )}
      style={{
        background: isOverdue 
          ? 'linear-gradient(135deg, rgba(254,242,242,0.5) 0%, rgba(255,255,255,0.95) 100%)'
          : 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)',
        backdropFilter: 'blur(10px)'
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className={cn(
            'font-medium text-gray-900 mb-1',
            task.status === 'Done' && 'line-through text-gray-500'
          )}>
            {task.title}
          </h3>
          {task.description && (
            <p className="text-sm text-gray-600 mb-2 line-clamp-2">
              {task.description}
            </p>
          )}
        </div>
<div className="flex items-center space-x-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(task)}
              className="h-8 w-8 p-0 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 hover:text-blue-600 rounded-lg shadow-soft hover:shadow-medium transition-all duration-300"
            >
              <ApperIcon name="Edit2" size={14} />
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(task.Id)}
              className="h-8 w-8 p-0 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 hover:text-red-600 rounded-lg shadow-soft hover:shadow-medium transition-all duration-300"
            >
              <ApperIcon name="Trash2" size={14} />
            </Button>
          </motion.div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Badge variant={getPriorityColor(task.priority)} size="sm">
            {task.priority}
          </Badge>
          <Badge variant={getStatusColor(task.status)} size="sm">
            {task.status === 'ToDo' ? 'To Do' : task.status === 'InProgress' ? 'In Progress' : 'Done'}
          </Badge>
        </div>

        <div className="flex items-center space-x-2">
          {task.dueDate && (
            <div className={cn(
              'flex items-center text-sm',
              isOverdue ? 'text-red-600' : 'text-gray-500'
            )}>
              <ApperIcon name="Calendar" size={14} className="mr-1" />
              {format(new Date(task.dueDate), 'MMM d')}
            </div>
          )}
{task.status !== 'Done' && (
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onToggleStatus(task.Id)}
                className="h-8 w-8 p-0 hover:bg-gradient-to-r hover:from-green-50 hover:to-green-100 hover:text-green-600 rounded-lg shadow-soft hover:shadow-medium transition-all duration-300"
              >
                <ApperIcon name="Check" size={14} />
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default TaskCard;