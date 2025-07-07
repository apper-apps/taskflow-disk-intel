import { useState } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import SearchBar from '@/components/molecules/SearchBar';

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