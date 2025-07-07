import { motion } from "framer-motion";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";
import React from "react";

const ProjectCard = ({ 
  project, 
  onEdit, 
  onDelete, 
  onClick,
  className 
}) => {
  const getProgressPercentage = () => {
    if (!project.tasks || project.tasks.length === 0) return 0;
    const completedTasks = project.tasks.filter(task => task.status === 'Done').length;
    return Math.round((completedTasks / project.tasks.length) * 100);
  };

  const progress = getProgressPercentage();

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
        'bg-gradient-to-br from-white/95 to-surface-50/95 backdrop-blur-sm rounded-xl shadow-soft border border-white/20 p-6 hover:shadow-medium hover:border-white/40 transition-all duration-300 cursor-pointer group',
        className
      )}
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)',
        backdropFilter: 'blur(10px)'
      }}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-2">{project.name}</h3>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center">
              <ApperIcon name="CheckSquare" size={16} className="mr-1" />
              {project.tasksCount || 0} tasks
            </div>
            <div className="flex items-center">
              <ApperIcon name="TrendingUp" size={16} className="mr-1" />
              {progress}% complete
            </div>
          </div>
        </div>
<div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(project);
              }}
              className="h-8 w-8 p-0 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 hover:text-blue-600 rounded-lg shadow-soft hover:shadow-medium transition-all duration-300"
            >
              <ApperIcon name="Edit2" size={14} />
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(project.Id);
              }}
              className="h-8 w-8 p-0 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 hover:text-red-600 rounded-lg shadow-soft hover:shadow-medium transition-all duration-300"
            >
              <ApperIcon name="Trash2" size={14} />
            </Button>
          </motion.div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Progress</span>
          <span className="font-medium text-gray-900">{progress}%</span>
        </div>
<div className="w-full bg-gradient-to-r from-gray-200 to-gray-300 rounded-full h-3 shadow-inner-soft">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, delay: 0.2, type: "spring", stiffness: 100 }}
            className="bg-gradient-to-r from-primary via-primary-light to-blue-600 h-3 rounded-full shadow-soft relative overflow-hidden"
            style={{
              boxShadow: '0 2px 8px rgba(37, 99, 235, 0.3)'
            }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ 
                repeat: Infinity, 
                duration: 2, 
                ease: "linear",
                repeatDelay: 1 
              }}
            />
          </motion.div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
<div className="flex items-center space-x-2">
          <motion.div 
            className="w-4 h-4 rounded-full shadow-soft"
            style={{ 
              background: `linear-gradient(135deg, ${project.color || '#3b82f6'}, ${project.color || '#3b82f6'}dd)`,
              boxShadow: `0 2px 8px ${project.color || '#3b82f6'}40`
            }}
            whileHover={{ scale: 1.2, rotate: 180 }}
            transition={{ type: "spring", stiffness: 400 }}
          />
          <span className="text-sm text-gray-600 font-medium">
            {project.color || 'Default'}
          </span>
        </div>
        <div className="text-sm text-gray-500">
          {project.createdAt && `Created ${format(new Date(project.createdAt), 'MMM d, yyyy')}`}
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;