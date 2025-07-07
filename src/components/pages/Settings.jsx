import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { useOutletContext } from 'react-router-dom';
import { toast } from 'react-toastify';
import Header from '@/components/organisms/Header';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import { cn } from '@/utils/cn';
import { setTheme, setSettings, updateSetting } from '@/store/userSlice';
import { settingService } from '@/services/api/settingService';

const Settings = () => {
  const { onMenuClick } = useOutletContext();
  const dispatch = useDispatch();
  const { user, currentTheme, settings, settingsLoading } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState('appearance');
  
  const isDark = currentTheme === 'dark';

  useEffect(() => {
    loadUserSettings();
  }, [user]);

  const loadUserSettings = async () => {
    if (!user?.userId) return;
    
    setLoading(true);
    try {
      const userSettings = await settingService.getAll(user.userId);
      dispatch(setSettings(userSettings));
      
      // Set theme from settings
      const themeSetting = userSettings.find(s => s.setting_name === 'theme');
      if (themeSetting) {
        dispatch(setTheme(themeSetting.setting_value));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleThemeChange = async (newTheme) => {
    if (!user?.userId) return;
    
    setLoading(true);
    try {
      dispatch(setTheme(newTheme));
      
      const updatedSetting = await settingService.updateUserSetting(
        user.userId,
        'theme',
        newTheme
      );
      
      if (updatedSetting) {
        dispatch(updateSetting({
          setting_name: 'theme',
          setting_value: newTheme
        }));
        toast.success(`Switched to ${newTheme} theme`);
      }
    } catch (error) {
      console.error('Error updating theme:', error);
      toast.error('Failed to update theme');
    } finally {
      setLoading(false);
    }
  };

  const settingSections = [
    {
      id: 'appearance',
      name: 'Appearance',
      icon: 'Palette',
      description: 'Customize the look and feel'
    },
    {
      id: 'notifications',
      name: 'Notifications',
      icon: 'Bell',
      description: 'Manage notification preferences'
    },
    {
      id: 'account',
      name: 'Account',
      icon: 'User',
      description: 'Account and profile settings'
    }
  ];

  const themeOptions = [
    {
      value: 'light',
      name: 'Light',
      description: 'Clean and bright interface',
      icon: 'Sun',
      preview: 'bg-gradient-to-br from-blue-50 to-indigo-100'
    },
    {
      value: 'dark',
      name: 'Dark',
      description: 'Easy on the eyes',
      icon: 'Moon',
      preview: 'bg-gradient-to-br from-gray-800 to-gray-900'
    }
  ];

  return (
    <div className={`min-h-screen ${isDark ? 'bg-surface-900' : 'bg-surface-50'}`}>
      <Header
        title="Settings"
        onMenuClick={onMenuClick}
        actions={[
          {
            label: 'Save Changes',
            icon: 'Save',
            onClick: () => toast.info('Settings are automatically saved'),
            variant: 'default'
          }
        ]}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Settings Sidebar */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className={`hidden lg:flex w-80 flex-col border-r ${
            isDark ? 'border-surface-700 bg-surface-800/50' : 'border-surface-200 bg-white/50'
          }`}
          style={{
            backdropFilter: 'blur(10px)',
          }}
        >
          <div className="p-6">
            <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Settings
            </h2>
            <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Manage your preferences
            </p>
          </div>

          <nav className="flex-1 px-6 pb-6 space-y-2">
            {settingSections.map((section) => (
              <motion.button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={cn(
                  'w-full flex items-center space-x-4 px-4 py-3 rounded-xl text-left transition-all duration-200',
                  activeSection === section.id
                    ? isDark
                      ? 'bg-primary/20 text-primary-light border border-primary/30'
                      : 'bg-primary/10 text-primary border border-primary/20'
                    : isDark
                      ? 'text-gray-300 hover:bg-surface-700/50 hover:text-white'
                      : 'text-gray-700 hover:bg-surface-100 hover:text-gray-900'
                )}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <ApperIcon 
                  name={section.icon} 
                  size={20} 
                  className={activeSection === section.id ? 'text-primary' : 'opacity-70'} 
                />
                <div className="flex-1">
                  <div className="font-semibold">{section.name}</div>
                  <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                    {section.description}
                  </div>
                </div>
              </motion.button>
            ))}
          </nav>
        </motion.div>

        {/* Settings Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto p-6 lg:p-8">
            {activeSection === 'appearance' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                <div>
                  <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Appearance
                  </h3>
                  <p className={`text-sm mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Customize how TaskFlow Pro looks and feels
                  </p>
                </div>

                {/* Theme Selection */}
                <div className={`p-6 rounded-2xl ${
                  isDark ? 'bg-surface-800/50 border border-surface-700' : 'bg-white border border-surface-200'
                }`}>
                  <div className="flex items-center space-x-3 mb-6">
                    <ApperIcon name="Palette" size={24} className="text-primary" />
                    <div>
                      <h4 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Theme
                      </h4>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Choose your preferred color scheme
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {themeOptions.map((option) => (
                      <motion.button
                        key={option.value}
                        onClick={() => handleThemeChange(option.value)}
                        disabled={loading}
                        className={cn(
                          'relative p-6 rounded-xl border-2 transition-all duration-200 text-left',
                          currentTheme === option.value
                            ? 'border-primary bg-primary/5'
                            : isDark
                              ? 'border-surface-600 hover:border-surface-500 bg-surface-700/50'
                              : 'border-surface-300 hover:border-surface-400 bg-surface-50',
                          loading && 'opacity-50 cursor-not-allowed'
                        )}
                        whileHover={{ scale: loading ? 1 : 1.02 }}
                        whileTap={{ scale: loading ? 1 : 0.98 }}
                      >
                        <div className="flex items-center space-x-4">
                          <div className={`w-12 h-12 rounded-xl ${option.preview} flex items-center justify-center`}>
                            <ApperIcon 
                              name={option.icon} 
                              size={24} 
                              className={option.value === 'dark' ? 'text-white' : 'text-gray-700'} 
                            />
                          </div>
                          <div className="flex-1">
                            <div className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                              {option.name}
                            </div>
                            <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                              {option.description}
                            </div>
                          </div>
                          {currentTheme === option.value && (
                            <ApperIcon name="Check" size={20} className="text-primary" />
                          )}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeSection === 'notifications' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                <div>
                  <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Notifications
                  </h3>
                  <p className={`text-sm mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Control when and how you receive notifications
                  </p>
                </div>

                <div className={`p-6 rounded-2xl ${
                  isDark ? 'bg-surface-800/50 border border-surface-700' : 'bg-white border border-surface-200'
                }`}>
                  <div className={`text-center py-12 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    <ApperIcon name="Bell" size={48} className="mx-auto mb-4 opacity-50" />
                    <p>Notification settings will be available in a future update</p>
                  </div>
                </div>
              </motion.div>
            )}

            {activeSection === 'account' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                <div>
                  <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Account
                  </h3>
                  <p className={`text-sm mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Manage your account information and preferences
                  </p>
                </div>

                <div className={`p-6 rounded-2xl ${
                  isDark ? 'bg-surface-800/50 border border-surface-700' : 'bg-white border border-surface-200'
                }`}>
                  <div className={`text-center py-12 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    <ApperIcon name="User" size={48} className="mx-auto mb-4 opacity-50" />
                    <p>Account settings will be available in a future update</p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;