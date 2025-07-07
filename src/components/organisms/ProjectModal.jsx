import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import FormField from '@/components/molecules/FormField';
import { projectService } from '@/services/api/projectService';

const ProjectModal = ({ 
  isOpen, 
  onClose, 
  project, 
  onSave 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    color: '#3b82f6'
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const colorOptions = [
    { value: '#3b82f6', label: 'Blue' },
    { value: '#10b981', label: 'Green' },
    { value: '#f59e0b', label: 'Yellow' },
    { value: '#ef4444', label: 'Red' },
    { value: '#8b5cf6', label: 'Purple' },
    { value: '#06b6d4', label: 'Cyan' },
    { value: '#f97316', label: 'Orange' },
    { value: '#84cc16', label: 'Lime' }
  ];

  useEffect(() => {
    if (isOpen) {
      if (project) {
        setFormData({
          name: project.name || '',
          color: project.color || '#3b82f6'
        });
      } else {
        setFormData({
          name: '',
          color: '#3b82f6'
        });
      }
      setErrors({});
    }
  }, [isOpen, project]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Project name is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    
    try {
      let savedProject;
      if (project) {
        savedProject = await projectService.update(project.Id, formData);
        toast.success('Project updated successfully');
      } else {
        savedProject = await projectService.create(formData);
        toast.success('Project created successfully');
      }

      onSave(savedProject);
      onClose();
    } catch (err) {
      toast.error(project ? 'Failed to update project' : 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  if (!isOpen) return null;

return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-gradient-to-br from-black/60 via-black/50 to-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          transition={{ 
            type: "spring",
            stiffness: 400,
            damping: 25,
            duration: 0.4 
          }}
          className="bg-gradient-to-br from-white/95 to-surface-50/95 backdrop-blur-xl rounded-2xl shadow-hard border border-white/20 max-w-md w-full"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.2)'
          }}
          onClick={(e) => e.stopPropagation()}
        >
>
          <div className="p-8 bg-gradient-to-br from-white/50 to-surface-50/30 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-8">
              <motion.h2 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent"
              >
                {project ? 'Edit Project' : 'Create New Project'}
              </motion.h2>
              <motion.div
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="h-10 w-10 p-0 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 hover:text-red-600 rounded-xl border border-transparent hover:border-red-200/50 transition-all duration-300"
                >
                  <ApperIcon name="X" size={18} />
                </Button>
              </motion.div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <FormField
                label="Project Name"
                id="name"
                required
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                error={errors.name}
                placeholder="Enter project name"
              />

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Color
                </label>
                <div className="grid grid-cols-4 gap-3">
                  {colorOptions.map((option) => (
<motion.button
                      key={option.value}
                      type="button"
                      onClick={() => handleChange('color', option.value)}
                      className={`relative w-12 h-12 rounded-xl border-2 transition-all duration-300 shadow-soft hover:shadow-medium ${
                        formData.color === option.value 
                          ? 'border-white/80 scale-110 shadow-hard' 
                          : 'border-white/40 hover:border-white/60'
                      }`}
                      style={{ 
                        background: `linear-gradient(135deg, ${option.value}, ${option.value}dd)`,
                        boxShadow: formData.color === option.value 
                          ? `0 8px 20px ${option.value}40, 0 0 0 2px ${option.value}20`
                          : `0 2px 8px ${option.value}20`
                      }}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {formData.color === option.value && (
                        <motion.div 
                          initial={{ scale: 0, rotate: -90 }}
                          animate={{ scale: 1, rotate: 0 }}
                          className="absolute inset-0 flex items-center justify-center"
                        >
                          <ApperIcon name="Check" size={16} className="text-white drop-shadow-lg" />
                        </motion.div>
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>

<div className="flex justify-end space-x-4 pt-8 border-t border-gradient-to-r from-transparent via-gray-200 to-transparent">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    disabled={loading}
                    className="shadow-soft hover:shadow-medium transition-all duration-300"
                  >
                    Cancel
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-gradient-to-r from-primary via-primary-light to-blue-600 hover:from-blue-600 hover:via-blue-700 hover:to-primary-dark shadow-medium hover:shadow-hard hover:shadow-glow transition-all duration-300 border border-primary/20"
                  >
                    {loading ? (
                      <>
                        <ApperIcon name="Loader2" size={16} className="mr-2 animate-spin" />
                        {project ? 'Updating...' : 'Creating...'}
                      </>
                    ) : (
                      <>
                        <ApperIcon name="Save" size={16} className="mr-2" />
                        {project ? 'Update Project' : 'Create Project'}
                      </>
                    )}
                  </Button>
                </motion.div>
              </div>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProjectModal;