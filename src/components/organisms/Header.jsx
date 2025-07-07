import { useState, useContext } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import SearchBar from '@/components/molecules/SearchBar';
import { AuthContext } from '@/App';

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
  const { user, isAuthenticated } = useSelector((state) => state.user);

  const handleLogout = async () => {
    setShowUserMenu(false);
    await logout();
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white border-b border-gray-200 sticky top-0 z-30"
    >
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onMenuClick}
              className="lg:hidden h-8 w-8 p-0"
            >
              <ApperIcon name="Menu" size={20} />
            </Button>
            
            <div>
              <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {showSearch && (
              <motion.div
                animate={{ 
                  width: isSearchFocused ? 320 : 250,
                }}
                className="hidden sm:block"
              >
                <SearchBar
                  value={searchQuery}
                  onChange={onSearchChange}
                  onClear={onSearchClear}
                  placeholder="Search tasks..."
                />
              </motion.div>
            )}

            <div className="flex items-center space-x-2">
              {actions.map((action, index) => (
                <Button
                  key={index}
                  variant={action.variant || 'default'}
                  size="sm"
                  onClick={action.onClick}
                  className={action.className}
                >
                  {action.icon && <ApperIcon name={action.icon} size={16} className="mr-1" />}
                  <span className="hidden sm:inline">{action.label}</span>
                  {!action.label && action.icon && (
                    <span className="sm:hidden">
                      <ApperIcon name={action.icon} size={16} />
                    </span>
                  )}
                </Button>
              ))}

              {/* User Menu */}
              {isAuthenticated && user && (
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 h-8"
                  >
                    <div className="w-6 h-6 bg-gradient-to-r from-primary to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-medium">
                      {user.firstName?.[0] || user.emailAddress?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <span className="hidden md:inline text-sm font-medium text-gray-700">
                      {user.firstName || user.emailAddress?.split('@')[0]}
                    </span>
                    <ApperIcon name="ChevronDown" size={14} className="text-gray-500" />
                  </Button>

                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                    >
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-xs text-gray-500">{user.emailAddress}</p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center space-x-2"
                      >
                        <ApperIcon name="LogOut" size={16} />
                        <span>Logout</span>
                      </button>
                    </motion.div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile search */}
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