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
        'hidden lg:flex flex-col relative transition-all duration-500 ease-out',
        isCollapsed ? 'w-20' : 'w-72'
      )}
      style={{
        background: `
          linear-gradient(145deg, 
            rgba(255, 255, 255, 0.25) 0%,
            rgba(255, 255, 255, 0.1) 25%,
            rgba(248, 250, 252, 0.25) 50%,
            rgba(241, 245, 249, 0.15) 75%,
            rgba(255, 255, 255, 0.2) 100%
          )
        `,
        backdropFilter: 'blur(25px)',
        borderRight: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: `
          0 8px 32px rgba(31, 41, 55, 0.08),
          0 1px 3px rgba(0, 0, 0, 0.1),
          inset 1px 0 0 rgba(255, 255, 255, 0.2)
        `,
      }}
    >
      {/* Animated gradient overlay */}
      <div 
        className="absolute inset-0 opacity-60 pointer-events-none"
        style={{
          background: `
            linear-gradient(135deg, 
              rgba(59, 130, 246, 0.02) 0%,
              rgba(147, 51, 234, 0.02) 50%,
              rgba(236, 72, 153, 0.02) 100%
            )
          `,
          animation: 'gradient-shift 8s ease infinite',
        }}
      />
      
      {/* Header Section */}
      <div className="relative p-6 border-b border-white/10">
        <div 
          className="absolute inset-0 bg-gradient-to-r from-primary/3 via-purple-500/2 to-pink-500/3"
          style={{ backdropFilter: 'blur(10px)' }}
        />
        <div className="relative flex items-center justify-between">
          <motion.div
            animate={{ opacity: isCollapsed ? 0 : 1 }}
            className="flex items-center space-x-4"
          >
            <motion.div 
              className="relative"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <div 
                className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-xl relative overflow-hidden"
                style={{
                  background: `
                    linear-gradient(135deg, 
                      #3b82f6 0%, 
                      #8b5cf6 25%, 
                      #06b6d4 50%, 
                      #3b82f6 100%
                    )
                  `,
                  boxShadow: '0 8px 25px rgba(59, 130, 246, 0.3), 0 3px 10px rgba(0, 0, 0, 0.2)',
                }}
              >
                <ApperIcon name="CheckSquare" size={22} className="text-white relative z-10" />
                <div 
                  className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                  style={{ animation: 'gradient-shift 3s ease infinite' }}
                />
              </div>
            </motion.div>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h1 
                  className="text-xl font-bold bg-clip-text text-transparent"
                  style={{
                    backgroundImage: 'linear-gradient(135deg, #1f2937 0%, #374151 50%, #4b5563 100%)'
                  }}
                >
                  TaskFlow
                </h1>
                <p className="text-sm font-semibold text-purple-600/80">Pro Edition</p>
              </motion.div>
            )}
          </motion.div>
          <motion.button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="relative p-2.5 rounded-xl transition-all duration-300 group overflow-hidden"
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <ApperIcon 
              name={isCollapsed ? "ChevronRight" : "ChevronLeft"} 
              size={16} 
              className="text-gray-600 group-hover:text-primary transition-colors relative z-10" 
            />
          </motion.button>
        </div>
      </div>

      {/* Navigation Section */}
      <nav className="flex-1 p-6 space-y-3">
        {navigationItems.map((item, index) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                'flex items-center relative overflow-hidden rounded-2xl text-sm font-semibold transition-all duration-300 group',
                isCollapsed ? 'px-3 py-4 justify-center' : 'px-5 py-4 space-x-4',
                isActive
                  ? 'text-primary shadow-xl'
                  : 'text-gray-700 hover:text-gray-900 hover:shadow-lg'
              )
            }
          >
            {({ isActive }) => (
              <>
                {/* Background */}
                <div 
                  className={cn(
                    'absolute inset-0 transition-all duration-300',
                    isActive
                      ? 'opacity-100'
                      : 'opacity-0 group-hover:opacity-100'
                  )}
                  style={{
                    background: isActive 
                      ? `
                          linear-gradient(135deg, 
                            rgba(59, 130, 246, 0.15) 0%,
                            rgba(147, 51, 234, 0.1) 50%,
                            rgba(59, 130, 246, 0.05) 100%
                          )
                        `
                      : `
                          linear-gradient(135deg, 
                            rgba(255, 255, 255, 0.5) 0%,
                            rgba(248, 250, 252, 0.3) 100%
                          )
                        `,
                    backdropFilter: 'blur(10px)',
                    border: isActive 
                      ? '1px solid rgba(59, 130, 246, 0.2)' 
                      : '1px solid rgba(255, 255, 255, 0.2)',
                  }}
                />
                
                {/* Icon */}
                <motion.div
                  whileHover={{ scale: 1.1, rotate: isActive ? 0 : 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                  className="relative z-10"
                >
                  <ApperIcon 
                    name={item.icon} 
                    size={22} 
                    className={cn(
                      'transition-all duration-300',
                      isActive 
                        ? 'text-primary drop-shadow-lg' 
                        : `${item.color} group-hover:text-primary group-hover:drop-shadow-md`
                    )} 
                  />
                </motion.div>
                
                {/* Text */}
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="relative z-10 font-semibold"
                  >
                    {item.name}
                  </motion.span>
                )}
                
                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-8 rounded-l-full"
                    style={{
                      background: 'linear-gradient(to bottom, #3b82f6, #8b5cf6)',
                      boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)',
                    }}
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