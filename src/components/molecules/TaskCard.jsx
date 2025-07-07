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
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ 
        duration: 0.4,
        type: "spring",
        stiffness: 300,
        damping: 20
      }}
      className={cn(
        'relative rounded-2xl p-6 group cursor-pointer overflow-hidden',
        isDragging && 'shadow-2xl rotate-2 scale-105 z-10',
        className
      )}
      style={{
        background: isOverdue 
          ? `
              linear-gradient(145deg, 
                rgba(254, 242, 242, 0.9) 0%,
                rgba(255, 255, 255, 0.95) 25%,
                rgba(254, 226, 226, 0.3) 50%,
                rgba(255, 255, 255, 0.9) 100%
              )
            `
          : `
              linear-gradient(145deg, 
                rgba(255, 255, 255, 0.9) 0%,
                rgba(248, 250, 252, 0.95) 25%,
                rgba(241, 245, 249, 0.3) 50%,
                rgba(255, 255, 255, 0.9) 100%
              )
            `,
        backdropFilter: 'blur(20px)',
        border: isOverdue 
          ? '1px solid rgba(239, 68, 68, 0.2)' 
          : '1px solid rgba(255, 255, 255, 0.3)',
        boxShadow: `
          0 10px 25px rgba(0, 0, 0, 0.08),
          0 4px 15px rgba(0, 0, 0, 0.05),
          inset 1px 1px 0 rgba(255, 255, 255, 0.2)
        `,
      }}
    >
      {/* Animated background gradient */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `
            linear-gradient(135deg, 
              rgba(59, 130, 246, 0.02) 0%,
              rgba(147, 51, 234, 0.01) 50%,
              rgba(236, 72, 153, 0.02) 100%
            )
          `,
          animation: 'gradient-shift 6s ease infinite',
        }}
      />
      
      {/* Overdue indicator */}
      {isOverdue && (
        <div 
          className="absolute top-0 right-0 w-16 h-16 opacity-20"
          style={{
            background: 'linear-gradient(135deg, #ef4444, #dc2626)',
            clipPath: 'polygon(100% 0%, 0% 100%, 100% 100%)',
          }}
        />
      )}
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className={cn(
              'text-lg font-bold mb-2 leading-tight',
              task.status === 'Done' 
                ? 'line-through text-gray-500' 
                : 'text-gray-900'
            )}>
              {task.title}
            </h3>
            {task.description && (
              <p className="text-sm text-gray-600 mb-3 line-clamp-2 leading-relaxed">
                {task.description}
              </p>
            )}
          </div>
          
          {/* Action buttons */}
          <div className="flex items-center space-x-2 ml-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(task)}
                className="h-9 w-9 p-0 rounded-xl transition-all duration-300"
                style={{
                  background: 'rgba(59, 130, 246, 0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(59, 130, 246, 0.2)',
                }}
              >
                <ApperIcon name="Edit2" size={16} className="text-blue-600" />
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(task.Id)}
                className="h-9 w-9 p-0 rounded-xl transition-all duration-300"
                style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                }}
              >
                <ApperIcon name="Trash2" size={16} className="text-red-600" />
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Badges */}
        <div className="flex items-center space-x-3 mb-4">
          <Badge variant={getPriorityColor(task.priority)} size="sm" className="font-semibold">
            {task.priority}
          </Badge>
          <Badge variant={getStatusColor(task.status)} size="sm" className="font-semibold">
            {task.status === 'ToDo' ? 'To Do' : task.status === 'InProgress' ? 'In Progress' : 'Done'}
          </Badge>
        </div>

        {/* Bottom section */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {task.dueDate && (
              <div 
                className={cn(
                  'flex items-center text-sm font-medium px-3 py-1.5 rounded-xl',
                  isOverdue 
                    ? 'text-red-700 bg-red-100/50 border border-red-200/50' 
                    : 'text-gray-600 bg-gray-100/50 border border-gray-200/50'
                )}
                style={{ backdropFilter: 'blur(10px)' }}
              >
                <ApperIcon 
                  name={isOverdue ? "AlertCircle" : "Calendar"} 
                  size={14} 
                  className="mr-2" 
                />
                {format(new Date(task.dueDate), 'MMM d')}
                {isOverdue && <span className="ml-1 text-xs">(Overdue)</span>}
              </div>
            )}
          </div>

          {task.status !== 'Done' && (
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onToggleStatus(task.Id)}
                className="h-10 w-10 p-0 rounded-xl transition-all duration-300"
                style={{
                  background: 'rgba(16, 185, 129, 0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                }}
              >
                <ApperIcon name="Check" size={16} className="text-green-600" />
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default TaskCard;