import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import FormField from '@/components/molecules/FormField';
import Select from '@/components/atoms/Select';
import { taskService } from '@/services/api/taskService';
import { projectService } from '@/services/api/projectService';

const TaskModal = ({ 
  isOpen, 
  onClose, 
  task, 
  onSave 
}) => {
const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'Medium',
    status: 'ToDo',
    projectId: '',
    tags: [],
    reminder: '',
    recurrence: 'none',
    isArchived: false
  });
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [tagInput, setTagInput] = useState('');
useEffect(() => {
    if (isOpen) {
      loadProjects();
      if (task) {
        const taskTags = task.Tags ? task.Tags.split(',').filter(tag => tag.trim()) : [];
        setFormData({
          title: task.title || '',
          description: task.description || '',
          dueDate: task.dueDate ? format(new Date(task.dueDate), 'yyyy-MM-dd') : '',
          priority: task.priority || 'Medium',
          status: task.status || 'ToDo',
          projectId: task.projectId || '',
          tags: taskTags,
          reminder: task.reminder || '',
          recurrence: task.recurrence || 'none',
          isArchived: task.is_archived || false
        });
      } else {
        setFormData({
          title: '',
          description: '',
          dueDate: '',
          priority: 'Medium',
          status: 'ToDo',
          projectId: '',
          tags: [],
          reminder: '',
          recurrence: 'none',
          isArchived: false
        });
      }
      setErrors({});
      setTagInput('');
    }
  }, [isOpen, task]);

  const loadProjects = async () => {
    try {
      const data = await projectService.getAll();
      setProjects(data);
    } catch (err) {
      console.error('Failed to load projects:', err);
    }
  };

const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.projectId) newErrors.projectId = 'Project is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    
    try {
      const taskData = {
        ...formData,
        dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null,
        Tags: formData.tags.join(','),
        is_archived: formData.isArchived
      };

      // Schedule reminder if set
      if (formData.reminder && formData.dueDate) {
        scheduleReminder(formData.title, formData.dueDate, formData.reminder);
      }

      let savedTask;
      if (task) {
        savedTask = await taskService.update(task.Id, taskData);
        toast.success('Task updated successfully');
        
        // If this is a recurring task and it's being marked as complete, create next instance
        if (formData.status === 'Done' && formData.recurrence !== 'none' && task.status !== 'Done') {
          await createRecurringTask(savedTask);
        }
      } else {
        savedTask = await taskService.create(taskData);
        toast.success('Task created successfully');
      }

      onSave(savedTask);
      onClose();
    } catch (err) {
      toast.error(task ? 'Failed to update task' : 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  const scheduleReminder = (title, dueDate, reminderTime) => {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return;
    }

    if (Notification.permission !== 'granted') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          setReminder(title, dueDate, reminderTime);
        }
      });
    } else {
      setReminder(title, dueDate, reminderTime);
    }
  };

  const setReminder = (title, dueDate, reminderTime) => {
    const due = new Date(dueDate);
    const now = new Date();
    let reminderDate;

    switch (reminderTime) {
      case '10min':
        reminderDate = new Date(due.getTime() - 10 * 60 * 1000);
        break;
      case '1hour':
        reminderDate = new Date(due.getTime() - 60 * 60 * 1000);
        break;
      case '1day':
        reminderDate = new Date(due.getTime() - 24 * 60 * 60 * 1000);
        break;
      default:
        return;
    }

    if (reminderDate > now) {
      const timeUntilReminder = reminderDate.getTime() - now.getTime();
      setTimeout(() => {
        new Notification(`Task Reminder: ${title}`, {
          body: `Due ${format(due, 'MMM d, yyyy at h:mm a')}`,
          icon: '/favicon.ico',
          tag: `task-${title}`
        });
      }, timeUntilReminder);
    }
  };

  const createRecurringTask = async (completedTask) => {
    try {
      const nextDueDate = calculateNextDueDate(completedTask.dueDate, formData.recurrence);
      const recurringTaskData = {
        title: completedTask.title,
        description: completedTask.description,
        dueDate: nextDueDate,
        priority: completedTask.priority,
        status: 'ToDo',
        projectId: completedTask.projectId,
        tags: formData.tags,
        reminder: formData.reminder,
        recurrence: formData.recurrence,
        isArchived: false
      };

      await taskService.create(recurringTaskData);
      toast.success('Next recurring task created');
    } catch (err) {
      console.error('Failed to create recurring task:', err);
      toast.error('Failed to create next recurring task');
    }
  };

  const calculateNextDueDate = (currentDueDate, recurrence) => {
    const current = new Date(currentDueDate);
    switch (recurrence) {
      case 'daily':
        return new Date(current.getTime() + 24 * 60 * 60 * 1000).toISOString();
      case 'weekly':
        return new Date(current.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();
      case 'monthly':
        const nextMonth = new Date(current);
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        return nextMonth.toISOString();
      default:
        return currentDueDate;
    }
  };

const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleAddTag = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim();
      if (!formData.tags.includes(newTag)) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, newTag]
        }));
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
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
          className="bg-gradient-to-br from-white/95 to-surface-50/95 backdrop-blur-xl rounded-2xl shadow-hard border border-white/20 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
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
                {task ? 'Edit Task' : 'Create New Task'}
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
                label="Title"
                id="title"
                required
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                error={errors.title}
                placeholder="Enter task title"
              />

              <FormField
                label="Description"
                id="description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Enter task description"
              >
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Enter task description"
                  className="flex min-h-[100px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200"
                  rows={4}
                />
              </FormField>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  label="Due Date"
                  id="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => handleChange('dueDate', e.target.value)}
                />

                <FormField
                  label="Priority"
                  id="priority"
                  value={formData.priority}
                  onChange={(e) => handleChange('priority', e.target.value)}
                >
                  <Select
                    id="priority"
                    value={formData.priority}
                    onChange={(e) => handleChange('priority', e.target.value)}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </Select>
                </FormField>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  label="Status"
                  id="status"
                  value={formData.status}
                  onChange={(e) => handleChange('status', e.target.value)}
                >
                  <Select
                    id="status"
                    value={formData.status}
                    onChange={(e) => handleChange('status', e.target.value)}
                  >
                    <option value="ToDo">To Do</option>
                    <option value="InProgress">In Progress</option>
                    <option value="Done">Done</option>
                  </Select>
                </FormField>

                <FormField
                  label="Project"
                  id="projectId"
                  required
                  value={formData.projectId}
                  onChange={(e) => handleChange('projectId', e.target.value)}
                  error={errors.projectId}
                >
                  <Select
                    id="projectId"
                    value={formData.projectId}
                    onChange={(e) => handleChange('projectId', e.target.value)}
                    error={errors.projectId}
                  >
                    <option value="">Select a project</option>
                    {projects.map(project => (
                      <option key={project.Id} value={project.Id}>
                        {project.name}
                      </option>
                    ))}
                  </Select>
                </FormField>
</div>

              {/* Tags Section */}
              <FormField
                label="Tags"
                id="tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder="Type a tag and press Enter"
              />
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200"
                    >
                      #{tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        <ApperIcon name="X" size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Reminder and Recurrence Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  label="Reminder"
                  id="reminder"
                  value={formData.reminder}
                  onChange={(e) => handleChange('reminder', e.target.value)}
                >
                  <Select
                    id="reminder"
                    value={formData.reminder}
                    onChange={(e) => handleChange('reminder', e.target.value)}
                  >
                    <option value="">No reminder</option>
                    <option value="10min">10 minutes before</option>
                    <option value="1hour">1 hour before</option>
                    <option value="1day">1 day before</option>
                  </Select>
                </FormField>

                <FormField
                  label="Recurrence"
                  id="recurrence"
                  value={formData.recurrence}
                  onChange={(e) => handleChange('recurrence', e.target.value)}
                >
                  <Select
                    id="recurrence"
                    value={formData.recurrence}
                    onChange={(e) => handleChange('recurrence', e.target.value)}
                  >
                    <option value="none">No recurrence</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </Select>
                </FormField>
              </div>

              {/* Archive Section (only show for existing tasks) */}
              {task && (
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="isArchived"
                    checked={formData.isArchived}
                    onChange={(e) => handleChange('isArchived', e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="isArchived" className="text-sm font-medium text-gray-700">
                    Archive this task
                  </label>
                </div>
              )}
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
                        {task ? 'Updating...' : 'Creating...'}
                      </>
                    ) : (
                      <>
                        <ApperIcon name="Save" size={16} className="mr-2" />
                        {task ? 'Update Task' : 'Create Task'}
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

export default TaskModal;