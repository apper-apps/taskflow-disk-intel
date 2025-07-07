import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import { cn } from '@/utils/cn';

const MobileSidebar = ({ isOpen, onClose }) => {
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
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Enhanced backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 lg:hidden"
            style={{
              background: `
                radial-gradient(circle at 30% 40%, rgba(59, 130, 246, 0.15) 0%, transparent 50%),
                radial-gradient(circle at 70% 80%, rgba(147, 51, 234, 0.1) 0%, transparent 50%),
                linear-gradient(135deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.6) 100%)
              `,
              backdropFilter: 'blur(20px)',
            }}
            onClick={onClose}
          />
          
          {/* Enhanced sidebar */}
          <motion.div
            initial={{ x: '-100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '-100%', opacity: 0 }}
            transition={{ 
              type: 'spring', 
              stiffness: 300, 
              damping: 30,
              opacity: { duration: 0.4 }
            }}
            className="fixed top-0 left-0 h-full w-72 z-50 lg:hidden relative"
            style={{
              background: `
                linear-gradient(145deg, 
                  rgba(255, 255, 255, 0.95) 0%,
                  rgba(255, 255, 255, 0.85) 25%,
                  rgba(248, 250, 252, 0.9) 50%,
                  rgba(241, 245, 249, 0.85) 75%,
                  rgba(255, 255, 255, 0.9) 100%
                )
              `,
              backdropFilter: 'blur(30px)',
              borderRight: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: `
                0 25px 50px rgba(0, 0, 0, 0.25),
                0 12px 30px rgba(0, 0, 0, 0.15),
                inset 1px 0 0 rgba(255, 255, 255, 0.3)
              `,
            }}
          >
            {/* Animated background */}
            <div 
              className="absolute inset-0 opacity-40"
              style={{
                background: `
                  linear-gradient(135deg, 
                    rgba(59, 130, 246, 0.03) 0%,
                    rgba(147, 51, 234, 0.02) 50%,
                    rgba(236, 72, 153, 0.03) 100%
                  )
                `,
                animation: 'gradient-shift 6s ease infinite',
              }}
            />
            
            {/* Header */}
            <div className="relative p-6 border-b border-white/20">
              <div 
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(to right, rgba(59, 130, 246, 0.03), rgba(147, 51, 234, 0.02))',
                  backdropFilter: 'blur(10px)'
                }}
              />
              <div className="relative flex items-center justify-between">
                <motion.div 
                  className="flex items-center space-x-4"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <motion.div 
                    className="relative"
                    whileHover={{ scale: 1.05 }}
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
                        boxShadow: '0 8px 25px rgba(59, 130, 246, 0.4), 0 3px 10px rgba(0, 0, 0, 0.2)',
                      }}
                    >
                      <ApperIcon name="CheckSquare" size={22} className="text-white relative z-10" />
                    </div>
                  </motion.div>
                  <div>
                    <h1 
                      className="text-xl font-bold bg-clip-text text-transparent"
                      style={{
                        backgroundImage: 'linear-gradient(135deg, #1f2937 0%, #374151 50%, #4b5563 100%)'
                      }}
                    >
                      TaskFlow
                    </h1>
                    <p className="text-sm font-semibold text-purple-600/80">Pro Edition</p>
                  </div>
                </motion.div>
                <motion.button
                  onClick={onClose}
                  className="relative p-2.5 rounded-xl transition-all duration-300 group overflow-hidden"
                  style={{
                    background: 'rgba(239, 68, 68, 0.1)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                  }}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-red-100/50 to-red-200/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <ApperIcon name="X" size={18} className="text-red-500 group-hover:text-red-600 transition-colors relative z-10" />
                </motion.button>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-6 space-y-3">
              {navigationItems.map((item, index) => (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + index * 0.1 }}
                >
                  <NavLink
                    to={item.path}
                    onClick={onClose}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center space-x-4 px-5 py-4 rounded-2xl text-sm font-semibold transition-all duration-300 group relative overflow-hidden',
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
                                    rgba(255, 255, 255, 0.6) 0%,
                                    rgba(248, 250, 252, 0.4) 100%
                                  )
                                `,
                            backdropFilter: 'blur(10px)',
                            border: isActive 
                              ? '1px solid rgba(59, 130, 246, 0.2)' 
                              : '1px solid rgba(255, 255, 255, 0.3)',
                          }}
                        />
                        
                        <motion.div
                          whileHover={{ scale: 1.1, rotate: 5 }}
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
                        <span className="relative z-10 font-semibold">{item.name}</span>
                        
                        {isActive && (
                          <motion.div
                            layoutId="activeMobileIndicator"
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
                </motion.div>
              ))}
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileSidebar;