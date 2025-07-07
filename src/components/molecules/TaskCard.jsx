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
      whileHover={{ y: -2, scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all duration-200',
        isDragging && 'shadow-lg rotate-1 scale-105',
        isOverdue && 'border-red-200 bg-red-50/30',
        className
      )}
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
        <div className="flex items-center space-x-1 ml-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(task)}
            className="h-8 w-8 p-0 hover:bg-gray-100"
          >
            <ApperIcon name="Edit2" size={14} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(task.Id)}
            className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600"
          >
            <ApperIcon name="Trash2" size={14} />
          </Button>
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
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onToggleStatus(task.Id)}
              className="h-8 w-8 p-0 hover:bg-green-100 hover:text-green-600"
            >
              <ApperIcon name="Check" size={14} />
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default TaskCard;