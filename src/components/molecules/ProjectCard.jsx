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
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ 
        duration: 0.4,
        type: "spring",
        stiffness: 300,
        damping: 20
      }}
      className={cn(
        'relative rounded-2xl p-6 cursor-pointer group overflow-hidden',
        className
      )}
      style={{
        background: `
          linear-gradient(145deg, 
            rgba(255, 255, 255, 0.9) 0%,
            rgba(248, 250, 252, 0.95) 25%,
            rgba(241, 245, 249, 0.3) 50%,
            rgba(255, 255, 255, 0.9) 100%
          )
        `,
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        boxShadow: `
          0 10px 25px rgba(0, 0, 0, 0.08),
          0 4px 15px rgba(0, 0, 0, 0.05),
          inset 1px 1px 0 rgba(255, 255, 255, 0.2)
        `,
      }}
      onClick={onClick}
    >
      {/* Animated background gradient */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `
            linear-gradient(135deg, 
              ${project.color || '#3b82f6'}08 0%,
              ${project.color || '#3b82f6'}04 50%,
              ${project.color || '#3b82f6'}08 100%
            )
          `,
          animation: 'gradient-shift 8s ease infinite',
        }}
      />
      
      {/* Project color accent */}
      <div 
        className="absolute top-0 right-0 w-20 h-20 opacity-10 rounded-bl-full"
        style={{
          background: `linear-gradient(135deg, ${project.color || '#3b82f6'}, ${project.color || '#3b82f6'}80)`,
        }}
      />
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-3">
              <motion.div 
                className="w-6 h-6 rounded-xl shadow-lg"
                style={{ 
                  background: `linear-gradient(135deg, ${project.color || '#3b82f6'}, ${project.color || '#3b82f6'}dd)`,
                  boxShadow: `0 4px 15px ${project.color || '#3b82f6'}40`
                }}
                whileHover={{ scale: 1.2, rotate: 180 }}
                transition={{ type: "spring", stiffness: 400 }}
              />
              <h3 className="text-xl font-bold text-gray-900">{project.name}</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div 
                className="flex items-center space-x-2 px-3 py-2 rounded-xl"
                style={{
                  background: 'rgba(59, 130, 246, 0.1)',
                  border: '1px solid rgba(59, 130, 246, 0.2)',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <ApperIcon name="CheckSquare" size={18} className="text-blue-600" />
                <span className="font-semibold text-gray-700">{project.tasksCount || 0} tasks</span>
              </div>
              <div 
                className="flex items-center space-x-2 px-3 py-2 rounded-xl"
                style={{
                  background: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <ApperIcon name="TrendingUp" size={18} className="text-green-600" />
                <span className="font-semibold text-gray-700">{progress}% done</span>
              </div>
            </div>
          </div>
          
          {/* Action buttons */}
          <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(project);
                }}
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
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(project.Id);
                }}
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

        {/* Enhanced Progress Bar */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold text-gray-600">Project Progress</span>
            <span className="font-bold text-lg" style={{ color: project.color || '#3b82f6' }}>
              {progress}%
            </span>
          </div>
          
          <div 
            className="w-full h-4 rounded-xl overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.1))',
              boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)'
            }}
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1.2, delay: 0.3, type: "spring", stiffness: 100 }}
              className="h-4 rounded-xl relative overflow-hidden"
              style={{
                background: `
                  linear-gradient(135deg, 
                    ${project.color || '#3b82f6'} 0%, 
                    ${project.color || '#3b82f6'}dd 50%, 
                    ${project.color || '#3b82f6'} 100%
                  )
                `,
                boxShadow: `0 2px 10px ${project.color || '#3b82f6'}50`
              }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 2.5, 
                  ease: "linear",
                  repeatDelay: 1.5 
                }}
              />
            </motion.div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-semibold text-gray-600">Color Theme</span>
            <motion.div 
              className="w-5 h-5 rounded-lg shadow-lg"
              style={{ 
                background: `linear-gradient(135deg, ${project.color || '#3b82f6'}, ${project.color || '#3b82f6'}80)`,
                boxShadow: `0 3px 12px ${project.color || '#3b82f6'}40`
              }}
              whileHover={{ scale: 1.3, rotate: 45 }}
              transition={{ type: "spring", stiffness: 400 }}
            />
          </div>
          <div className="text-sm text-gray-500 font-medium">
            {project.createdAt && `Created ${format(new Date(project.createdAt), 'MMM d, yyyy')}`}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;