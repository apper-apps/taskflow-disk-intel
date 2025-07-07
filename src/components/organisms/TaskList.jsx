import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-toastify";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import TaskCard from "@/components/molecules/TaskCard";
import { taskService } from "@/services/api/taskService";

const TaskList = ({ 
  projectId, 
  searchQuery, 
  filters, 
  onTaskEdit,
  onTaskCreate,
  presetFilter 
}) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadTasks();
  }, [projectId]);

  const loadTasks = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = projectId 
        ? await taskService.getByProject(projectId)
        : await taskService.getAll();
      setTasks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
      await taskService.delete(taskId);
      setTasks(tasks.filter(task => task.Id !== taskId));
      toast.success('Task deleted successfully');
    } catch (err) {
      toast.error('Failed to delete task');
    }
  };

  const handleToggleStatus = async (taskId) => {
    try {
      const task = tasks.find(t => t.Id === taskId);
      const newStatus = task.status === 'Done' ? 'ToDo' : 'Done';
      
      const updatedTask = await taskService.update(taskId, { 
        ...task, 
        status: newStatus 
      });
      
      setTasks(tasks.map(t => t.Id === taskId ? updatedTask : t));
      toast.success(`Task marked as ${newStatus === 'Done' ? 'completed' : 'pending'}`);
    } catch (err) {
      toast.error('Failed to update task');
    }
  };

const filteredTasks = tasks.filter(task => {
    const matchesSearch = !searchQuery || 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = !filters.status || filters.status === 'all' || task.status === filters.status;
    const matchesPriority = !filters.priority || filters.priority === 'all' || task.priority === filters.priority;
    const matchesProject = !filters.project || filters.project === 'all' || task.projectId === filters.project;
    
    // Apply preset filter from dashboard drill-down
    let matchesPresetFilter = true;
    if (presetFilter) {
      const today = new Date();
      const taskDate = task.dueDate ? new Date(task.dueDate) : null;
      
      switch (presetFilter) {
        case 'today':
          matchesPresetFilter = taskDate && taskDate.toDateString() === today.toDateString();
          break;
        case 'overdue':
          matchesPresetFilter = taskDate && taskDate < today && task.status !== 'Done';
          break;
        case 'completed':
          const startWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
          const endWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 6);
          matchesPresetFilter = task.status === 'Done' && taskDate && taskDate >= startWeek && taskDate <= endWeek;
          break;
        default:
          matchesPresetFilter = true;
      }
    }
    
    return matchesSearch && matchesStatus && matchesPriority && matchesProject && matchesPresetFilter;
  });

  if (loading) return <Loading variant="tasks" />;
  if (error) return <Error message={error} onRetry={loadTasks} variant="tasks" />;

  if (filteredTasks.length === 0) {
    if (searchQuery || Object.values(filters).some(v => v && v !== 'all')) {
      return <Empty variant="search" />;
    }
    return <Empty variant="tasks" onAction={onTaskCreate} actionText="Create First Task" />;
  }

  return (
    <div className="space-y-4">
      <AnimatePresence mode="popLayout">
        {filteredTasks.map((task) => (
          <motion.div
            key={task.Id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <TaskCard
              task={task}
              onEdit={onTaskEdit}
              onDelete={handleDeleteTask}
              onToggleStatus={handleToggleStatus}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default TaskList;