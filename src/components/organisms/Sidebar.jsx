import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import { cn } from '@/utils/cn';

const Sidebar = () => {
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
        'hidden lg:flex flex-col bg-gradient-to-br from-white/95 to-surface-50/95 backdrop-blur-xl border-r border-white/20 shadow-soft transition-all duration-300',
        isCollapsed ? 'w-16' : 'w-64'
      )}
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)',
        backdropFilter: 'blur(20px)',
        borderRight: '1px solid rgba(255,255,255,0.2)'
      }}
    >
      <div className="p-6 border-b border-white/10 bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="flex items-center justify-between">
          <motion.div
            animate={{ opacity: isCollapsed ? 0 : 1 }}
            className="flex items-center space-x-3"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-primary via-primary-light to-secondary rounded-xl flex items-center justify-center shadow-medium animate-glow">
              <ApperIcon name="CheckSquare" size={20} className="text-white" />
            </div>
            {!isCollapsed && (
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">TaskFlow</h1>
                <p className="text-sm text-gray-600 font-medium">Pro</p>
              </div>
            )}
          </motion.div>
          <motion.button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 hover:bg-gradient-to-r hover:from-primary/10 hover:to-secondary/10 rounded-xl transition-all duration-300 group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ApperIcon 
              name={isCollapsed ? "ChevronRight" : "ChevronLeft"} 
              size={16} 
              className="text-gray-500 group-hover:text-primary transition-colors" 
            />
          </motion.button>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item, index) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                'flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 group relative overflow-hidden',
                isActive
                  ? 'bg-gradient-to-r from-primary/15 to-secondary/15 text-primary shadow-soft border border-primary/20'
                  : 'text-gray-700 hover:bg-gradient-to-r hover:from-primary/5 hover:to-secondary/5 hover:text-gray-900 hover:shadow-soft hover:border hover:border-white/20'
              )
            }
          >
            {({ isActive }) => (
              <>
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <ApperIcon 
                    name={item.icon} 
                    size={20} 
                    className={cn(
                      'transition-colors duration-300',
                      isActive ? 'text-primary' : item.color + ' group-hover:text-primary'
                    )} 
                  />
                </motion.div>
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="font-medium"
                  >
                    {item.name}
                  </motion.span>
                )}
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl border border-primary/20"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </>
            )}
          </NavLink>
        ))}

      </nav>
    </motion.div>
  );
};

export default Sidebar;