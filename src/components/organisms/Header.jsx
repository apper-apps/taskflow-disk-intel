import React, { useContext, useState } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { AuthContext } from "@/App";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";

const Header = ({ 
  title, 
  onMenuClick, 
  showSearch = false,
  searchQuery = '',
  onSearchChange,
  onSearchClear,
  actions = []
}) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
const [showUserMenu, setShowUserMenu] = useState(false);
  const { logout } = useContext(AuthContext);
  const { user, isAuthenticated, currentTheme } = useSelector((state) => state.user);
  const isDark = currentTheme === 'dark';
  const handleLogout = async () => {
    setShowUserMenu(false);
    await logout();
  };

return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-30 relative"
style={{
        background: isDark 
          ? `
              linear-gradient(135deg, 
                rgba(15, 23, 42, 0.85) 0%,
                rgba(30, 41, 59, 0.9) 25%,
                rgba(51, 65, 85, 0.85) 50%,
                rgba(30, 41, 59, 0.9) 75%,
                rgba(15, 23, 42, 0.85) 100%
              )
            `
          : `
              linear-gradient(135deg, 
                rgba(255, 255, 255, 0.85) 0%,
                rgba(248, 250, 252, 0.9) 25%,
                rgba(241, 245, 249, 0.85) 50%,
                rgba(248, 250, 252, 0.9) 75%,
                rgba(255, 255, 255, 0.85) 100%
              )
            `,
        backdropFilter: 'blur(25px)',
        borderBottom: isDark 
          ? '1px solid rgba(255, 255, 255, 0.1)' 
          : '1px solid rgba(255, 255, 255, 0.3)',
        boxShadow: isDark
          ? `
              0 8px 32px rgba(0, 0, 0, 0.3),
              0 1px 3px rgba(0, 0, 0, 0.2),
              inset 0 -1px 0 rgba(255, 255, 255, 0.1)
            `
          : `
              0 8px 32px rgba(0, 0, 0, 0.08),
              0 1px 3px rgba(0, 0, 0, 0.1),
              inset 0 -1px 0 rgba(255, 255, 255, 0.2)
            `,
      }}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute top-0 left-0 w-full h-full opacity-30"
          style={{
            background: `
              linear-gradient(90deg, 
                rgba(59, 130, 246, 0.02) 0%,
                rgba(147, 51, 234, 0.01) 50%,
                rgba(236, 72, 153, 0.02) 100%
              )
            `,
            animation: 'gradient-shift 8s ease infinite',
          }}
        />
      </div>
      
      <div className="relative px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          <div className="flex items-center space-x-6">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={onMenuClick}
                className="lg:hidden h-10 w-10 p-0 rounded-xl"
style={{
                  background: isDark 
                    ? 'rgba(15, 23, 42, 0.5)' 
                    : 'rgba(255, 255, 255, 0.5)',
                  backdropFilter: 'blur(10px)',
                  border: isDark 
                    ? '1px solid rgba(255, 255, 255, 0.1)' 
                    : '1px solid rgba(255, 255, 255, 0.3)',
                }}
              >
                <ApperIcon name="Menu" size={22} />
              </Button>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
<h1 
                className="text-2xl font-bold bg-clip-text text-transparent"
                style={{
                  backgroundImage: isDark
                    ? `
                        linear-gradient(135deg, 
                          #f8fafc 0%, 
                          #e2e8f0 25%, 
                          #cbd5e1 50%, 
                          #e2e8f0 75%, 
                          #f8fafc 100%
                        )
                      `
                    : `
                        linear-gradient(135deg, 
                          #1f2937 0%, 
                          #374151 25%, 
                          #4b5563 50%, 
                          #374151 75%, 
                          #1f2937 100%
                        )
                      `,
                }}
              >
                {title}
              </h1>
            </motion.div>
          </div>

          <div className="flex items-center space-x-4">
            {showSearch && (
              <motion.div
                animate={{ 
                  width: isSearchFocused ? 350 : 280,
                }}
                className="hidden sm:block"
              >
                <SearchBar
                  value={searchQuery}
                  onChange={onSearchChange}
                  onClear={onSearchClear}
                  placeholder="Search tasks..."
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                />
              </motion.div>
            )}

            <div className="flex items-center space-x-3">
              {actions.map((action, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant={action.variant || 'default'}
                    size="sm"
                    onClick={action.onClick}
                    className={cn(
                      'shadow-lg hover:shadow-xl transition-all duration-300',
                      action.className
                    )}
                  >
                    {action.icon && <ApperIcon name={action.icon} size={18} className="mr-2" />}
                    <span className="hidden sm:inline font-semibold">{action.label}</span>
                    {!action.label && action.icon && (
                      <span className="sm:hidden">
                        <ApperIcon name={action.icon} size={18} />
                      </span>
                    )}
                  </Button>
                </motion.div>
              ))}

              {/* Enhanced User Menu */}
              {isAuthenticated && user && (
                <div className="relative">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex items-center space-x-3 h-12 px-4 rounded-xl"
style={{
                        background: isDark 
                          ? 'rgba(15, 23, 42, 0.6)' 
                          : 'rgba(255, 255, 255, 0.6)',
                        backdropFilter: 'blur(10px)',
                        border: isDark 
                          ? '1px solid rgba(255, 255, 255, 0.1)' 
                          : '1px solid rgba(255, 255, 255, 0.3)',
                      }}
                    >
<div 
                        className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-lg"
                        style={{
                          background: `
                            linear-gradient(135deg, 
                              #3b82f6 0%, 
                              #8b5cf6 50%, 
                              #06b6d4 100%
                            )
                          `,
                          boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)',
                        }}
                      >
                        {user.firstName?.[0] || user.emailAddress?.[0]?.toUpperCase() || 'U'}
                      </div>
                      <span className={`hidden md:inline text-sm font-semibold ${
                        isDark ? 'text-gray-200' : 'text-gray-700'
                      }`}>
                        {user.firstName || user.emailAddress?.split('@')[0]}
                      </span>
                      <motion.div
                        animate={{ rotate: showUserMenu ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ApperIcon name="ChevronDown" size={16} className="text-gray-500" />
                      </motion.div>
                    </Button>
                  </motion.div>

                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-3 w-72 z-50 rounded-2xl overflow-hidden"
style={{
                        background: isDark 
                          ? `
                              linear-gradient(145deg, 
                                rgba(15, 23, 42, 0.9) 0%,
                                rgba(30, 41, 59, 0.95) 100%
                              )
                            `
                          : `
                              linear-gradient(145deg, 
                                rgba(255, 255, 255, 0.9) 0%,
                                rgba(248, 250, 252, 0.95) 100%
                              )
                            `,
                        backdropFilter: 'blur(25px)',
                        border: isDark 
                          ? '1px solid rgba(255, 255, 255, 0.1)' 
                          : '1px solid rgba(255, 255, 255, 0.3)',
                        boxShadow: isDark
                          ? `
                              0 25px 50px rgba(0, 0, 0, 0.5),
                              0 12px 30px rgba(0, 0, 0, 0.3),
                              inset 1px 1px 0 rgba(255, 255, 255, 0.1)
                            `
                          : `
                              0 25px 50px rgba(0, 0, 0, 0.15),
                              0 12px 30px rgba(0, 0, 0, 0.1),
                              inset 1px 1px 0 rgba(255, 255, 255, 0.3)
                            `,
                      }}
                    >
<div 
                        className={`px-6 py-4 border-b ${
                          isDark ? 'border-white/10' : 'border-white/30'
                        }`}
                        style={{
                          background: isDark
                            ? `
                                linear-gradient(135deg, 
                                  rgba(59, 130, 246, 0.08) 0%, 
                                  rgba(147, 51, 234, 0.05) 100%
                                )
                              `
                            : `
                                linear-gradient(135deg, 
                                  rgba(59, 130, 246, 0.05) 0%, 
                                  rgba(147, 51, 234, 0.03) 100%
                                )
                              `,
                          backdropFilter: 'blur(10px)'
                        }}
                      >
                        <p 
className="text-lg font-bold bg-clip-text text-transparent"
                          style={{
                            backgroundImage: isDark
                              ? 'linear-gradient(135deg, #f8fafc 0%, #cbd5e1 100%)'
                              : 'linear-gradient(135deg, #1f2937 0%, #4b5563 100%)'
                          }}
                        >
                          {user.firstName} {user.lastName}
                        </p>
                        <p className={`text-sm font-medium mt-1 ${
                          isDark ? 'text-gray-300' : 'text-gray-600'
                        }`}>{user.emailAddress}</p>
                      </div>
                      <motion.button
                        onClick={handleLogout}
                        className="w-full px-6 py-4 text-left flex items-center space-x-3 font-semibold transition-all duration-300 relative group"
                        style={{
                          color: '#dc2626',
                        }}
                        whileHover={{ x: 4 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-red-50/50 to-red-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <ApperIcon name="LogOut" size={18} className="relative z-10" />
                        <span className="relative z-10">Logout</span>
                      </motion.button>
                    </motion.div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Enhanced Mobile search */}
        {showSearch && (
          <div className="sm:hidden pb-4">
            <SearchBar
              value={searchQuery}
              onChange={onSearchChange}
              onClear={onSearchClear}
              placeholder="Search tasks..."
            />
          </div>
        )}
      </div>
    </motion.header>
  );
};

export default Header;