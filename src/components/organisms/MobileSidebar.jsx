import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import { cn } from '@/utils/cn';

const MobileSidebar = ({ isOpen, onClose, projects = [], onProjectSelect }) => {
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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gradient-to-br from-black/60 via-black/50 to-black/60 backdrop-blur-md z-40 lg:hidden"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ x: '-100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '-100%', opacity: 0 }}
            transition={{ 
              type: 'spring', 
              stiffness: 400, 
              damping: 40,
              opacity: { duration: 0.3 }
            }}
            className="fixed top-0 left-0 h-full w-64 bg-gradient-to-br from-white/95 to-surface-50/95 backdrop-blur-xl shadow-hard border-r border-white/20 z-50 lg:hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)',
              backdropFilter: 'blur(20px)'
            }}
          >
            <div className="p-6 border-b border-white/10 bg-gradient-to-r from-primary/5 to-secondary/5">
              <div className="flex items-center justify-between">
                <motion.div 
                  className="flex items-center space-x-3"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-primary via-primary-light to-secondary rounded-xl flex items-center justify-center shadow-medium animate-glow">
                    <ApperIcon name="CheckSquare" size={20} className="text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">TaskFlow</h1>
                    <p className="text-sm text-gray-600 font-medium">Pro</p>
                  </div>
                </motion.div>
                <motion.button
                  onClick={onClose}
                  className="p-2 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 hover:text-red-600 rounded-xl transition-all duration-300"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ApperIcon name="X" size={20} className="text-gray-500 transition-colors" />
                </motion.button>
              </div>
            </div>

            <nav className="flex-1 p-4 space-y-2">
              {navigationItems.map((item, index) => (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + index * 0.1 }}
                >
                  <NavLink
                    to={item.path}
                    onClick={onClose}
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
                        <span className="font-medium">{item.name}</span>
                        {isActive && (
                          <motion.div
                            layoutId="activeMobileIndicator"
                            className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl border border-primary/20"
                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                          />
                        )}
                      </>
                    )}
                  </NavLink>
                </motion.div>
              ))}

              {projects.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="pt-6 border-t border-gradient-to-r from-transparent via-gray-200 to-transparent mt-6"
                >
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 px-2">
                    Projects
                  </h3>
                  <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
                    {projects.map((project, index) => (
                      <motion.button
                        key={project.Id}
                        onClick={() => {
                          onProjectSelect(project);
                          onClose();
                        }}
                        className="w-full flex items-center space-x-3 px-4 py-3 text-left rounded-xl text-sm hover:bg-gradient-to-r hover:from-white/50 hover:to-surface-50/50 hover:shadow-soft hover:border hover:border-white/30 transition-all duration-300 group"
                        whileHover={{ x: 4, scale: 1.02 }}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                      >
                        <motion.div 
                          className="w-4 h-4 rounded-full shadow-soft"
                          style={{ 
                            background: `linear-gradient(135deg, ${project.color}, ${project.color}dd)`,
                            boxShadow: `0 2px 8px ${project.color}40`
                          }}
                          whileHover={{ scale: 1.2, rotate: 180 }}
                          transition={{ type: "spring", stiffness: 400 }}
                        />
                        <span className="text-gray-700 truncate group-hover:text-gray-900 font-medium transition-colors">
                          {project.name}
                        </span>
                        <motion.span 
                          className="text-xs text-gray-500 ml-auto bg-gray-100 px-2 py-1 rounded-md group-hover:bg-primary/10 group-hover:text-primary transition-all duration-300"
                          whileHover={{ scale: 1.1 }}
                        >
                          {project.tasksCount || 0}
                        </motion.span>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileSidebar;