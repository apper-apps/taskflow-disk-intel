import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import { cn } from '@/utils/cn';

const Sidebar = ({ projects = [], onProjectSelect }) => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navigationItems = [
    {
      name: 'Dashboard',
      path: '/',
      icon: 'LayoutDashboard',
      color: 'text-blue-600'
    },
    {
      name: 'All Tasks',
      path: '/tasks',
      icon: 'CheckSquare',
      color: 'text-green-600'
    },
    {
      name: 'Projects',
      path: '/projects',
      icon: 'FolderOpen',
      color: 'text-purple-600'
    }
  ];

  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className={cn(
        'hidden lg:flex flex-col bg-white border-r border-gray-200 transition-all duration-300',
        isCollapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <motion.div
            animate={{ opacity: isCollapsed ? 0 : 1 }}
            className="flex items-center space-x-3"
          >
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-blue-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="CheckSquare" size={20} className="text-white" />
            </div>
            {!isCollapsed && (
              <div>
                <h1 className="text-xl font-bold text-gray-900">TaskFlow</h1>
                <p className="text-sm text-gray-600">Pro</p>
              </div>
            )}
          </motion.div>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 hover:bg-gray-100 rounded-md transition-colors"
          >
            <ApperIcon 
              name={isCollapsed ? "ChevronRight" : "ChevronLeft"} 
              size={16} 
              className="text-gray-500" 
            />
          </button>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                'flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              )
            }
          >
            <ApperIcon name={item.icon} size={20} className={item.color} />
            {!isCollapsed && <span>{item.name}</span>}
          </NavLink>
        ))}

        {!isCollapsed && projects.length > 0 && (
          <div className="pt-4 border-t border-gray-200 mt-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Projects
            </h3>
            <div className="space-y-1 max-h-64 overflow-y-auto custom-scrollbar">
              {projects.map((project) => (
                <motion.button
                  key={project.Id}
                  onClick={() => onProjectSelect(project)}
                  className="w-full flex items-center space-x-3 px-3 py-2 text-left rounded-lg text-sm hover:bg-gray-100 transition-colors"
                  whileHover={{ x: 2 }}
                >
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: project.color }}
                  />
                  <span className="text-gray-700 truncate">{project.name}</span>
                  <span className="text-xs text-gray-500 ml-auto">
                    {project.tasksCount || 0}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>
        )}
      </nav>
    </motion.div>
  );
};

export default Sidebar;