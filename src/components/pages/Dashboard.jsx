import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import Chart from 'react-apexcharts';
import { motion } from 'framer-motion';
import { format, startOfWeek, endOfWeek } from 'date-fns';
import Header from '@/components/organisms/Header';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import TaskCard from '@/components/molecules/TaskCard';
import TaskModal from '@/components/organisms/TaskModal';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import { taskService } from '@/services/api/taskService';
import { projectService } from '@/services/api/projectService';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const { onMenuClick, onProjectsChange } = useOutletContext();
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [tasksData, projectsData] = await Promise.all([
        taskService.getAll(),
        projectService.getAll()
      ]);
      setTasks(tasksData);
      setProjects(projectsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskSave = async (savedTask) => {
    if (selectedTask) {
      setTasks(tasks.map(t => t.Id === savedTask.Id ? savedTask : t));
    } else {
      setTasks([...tasks, savedTask]);
    }
    setSelectedTask(null);
    onProjectsChange?.();
  };

  const handleTaskEdit = (task) => {
    setSelectedTask(task);
    setIsTaskModalOpen(true);
  };

  const handleTaskDelete = async (taskId) => {
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
      await taskService.delete(taskId);
      setTasks(tasks.filter(task => task.Id !== taskId));
      toast.success('Task deleted successfully');
      onProjectsChange?.();
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
      onProjectsChange?.();
    } catch (err) {
      toast.error('Failed to update task');
    }
  };

  const openTaskModal = () => {
    setSelectedTask(null);
    setIsTaskModalOpen(true);
  };

  // Calculate dashboard metrics
  const today = new Date();
  const startWeek = startOfWeek(today);
  const endWeek = endOfWeek(today);

  const todayTasks = tasks.filter(task => {
    if (!task.dueDate) return false;
    const taskDate = new Date(task.dueDate);
    return taskDate.toDateString() === today.toDateString();
  });

  const weekTasks = tasks.filter(task => {
    if (!task.dueDate) return false;
    const taskDate = new Date(task.dueDate);
    return taskDate >= startWeek && taskDate <= endWeek;
  });

  const completedThisWeek = weekTasks.filter(task => task.status === 'Done').length;
  const overdueTasks = tasks.filter(task => {
    if (!task.dueDate || task.status === 'Done') return false;
    return new Date(task.dueDate) < today;
  });

  const dashboardStats = [
    {
      title: 'Tasks Due Today',
      value: todayTasks.length,
      icon: 'Calendar',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Completed This Week',
      value: completedThisWeek,
      icon: 'CheckCircle',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Overdue Tasks',
      value: overdueTasks.length,
      icon: 'AlertCircle',
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    }
  ];
// Calculate chart data
  const taskStatusData = {
    series: [
      tasks.filter(t => t.status === 'ToDo').length,
      tasks.filter(t => t.status === 'InProgress').length,
      tasks.filter(t => t.status === 'Done').length
    ],
    options: {
      chart: { type: 'pie', fontFamily: 'Inter, sans-serif' },
      labels: ['To Do', 'In Progress', 'Completed'],
      colors: ['#f59e0b', '#3b82f6', '#10b981'],
      legend: { position: 'bottom' },
      responsive: [{
        breakpoint: 480,
        options: { chart: { width: 300 }, legend: { position: 'bottom' } }
      }]
    }
  };

  const priorityData = {
    series: [
      tasks.filter(t => t.priority === 'High').length,
      tasks.filter(t => t.priority === 'Medium').length,
      tasks.filter(t => t.priority === 'Low').length
    ],
    options: {
      chart: { type: 'donut', fontFamily: 'Inter, sans-serif' },
      labels: ['High Priority', 'Medium Priority', 'Low Priority'],
      colors: ['#ef4444', '#f59e0b', '#10b981'],
      legend: { position: 'bottom' },
      plotOptions: { pie: { donut: { size: '70%' } } }
    }
  };

  const projectTaskData = {
    series: [{
      name: 'Tasks',
      data: projects.map(project => 
        tasks.filter(task => task.projectId === project.Id).length
      )
    }],
    options: {
      chart: { type: 'bar', fontFamily: 'Inter, sans-serif' },
      plotOptions: { bar: { horizontal: true, borderRadius: 4 } },
      xaxis: { categories: projects.map(p => p.Name || p.name) },
      colors: projects.map(p => p.color || '#3b82f6'),
      dataLabels: { enabled: false }
    }
  };

  const weeklyProgressData = {
    series: [
      { name: 'Completed', data: [completedThisWeek] },
      { name: 'Total', data: [weekTasks.length] }
    ],
    options: {
      chart: { type: 'bar', fontFamily: 'Inter, sans-serif' },
      plotOptions: { bar: { columnWidth: '60%' } },
      colors: ['#10b981', '#e5e7eb'],
      xaxis: { categories: ['This Week'] },
      legend: { position: 'top' }
    }
  };

  if (loading) return <Loading variant="dashboard" />;
  if (error) return <Error message={error} onRetry={loadDashboardData} />;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        title="Dashboard"
        onMenuClick={onMenuClick}
        actions={[
          {
            label: 'New Task',
            icon: 'Plus',
            onClick: openTaskModal,
            className: 'bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white'
          }
        ]}
      />

      <div className="p-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Good morning! 👋
          </h2>
          <p className="text-gray-600">
            Here's what's happening with your tasks today.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {dashboardStats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>
                <div className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                  <ApperIcon name={stat.icon} size={24} className={stat.color} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Analytics Charts */}
        {tasks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Analytics Overview</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Task Status Distribution */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h4 className="text-md font-medium text-gray-900 mb-4">Task Status Distribution</h4>
                <Chart
                  options={taskStatusData.options}
                  series={taskStatusData.series}
                  type="pie"
                  height={280}
                />
              </div>

              {/* Priority Distribution */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h4 className="text-md font-medium text-gray-900 mb-4">Priority Distribution</h4>
                <Chart
                  options={priorityData.options}
                  series={priorityData.series}
                  type="donut"
                  height={280}
                />
              </div>

              {/* Tasks by Project */}
              {projects.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h4 className="text-md font-medium text-gray-900 mb-4">Tasks by Project</h4>
                  <Chart
                    options={projectTaskData.options}
                    series={projectTaskData.series}
                    type="bar"
                    height={280}
                  />
                </div>
              )}

              {/* Weekly Progress */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h4 className="text-md font-medium text-gray-900 mb-4">Weekly Progress</h4>
                <Chart
                  options={weeklyProgressData.options}
                  series={weeklyProgressData.series}
                  type="bar"
                  height={280}
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* Today's Tasks */}
        {/* Today's Tasks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Due Today
              </h3>
              <ApperIcon name="Calendar" size={20} className="text-gray-500" />
            </div>
            
            {todayTasks.length === 0 ? (
              <div className="text-center py-8">
                <ApperIcon name="CheckCircle" size={48} className="text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No tasks due today</p>
                <p className="text-sm text-gray-400">You're all caught up!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {todayTasks.slice(0, 3).map((task) => (
                  <TaskCard
                    key={task.Id}
                    task={task}
                    onEdit={handleTaskEdit}
                    onDelete={handleTaskDelete}
                    onToggleStatus={handleToggleStatus}
                  />
                ))}
                {todayTasks.length > 3 && (
                  <div className="text-center pt-2">
                    <Button variant="ghost" size="sm">
                      View all {todayTasks.length} tasks
                    </Button>
                  </div>
                )}
              </div>
            )}
          </motion.div>

          {/* Recent Projects */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Recent Projects
              </h3>
              <ApperIcon name="FolderOpen" size={20} className="text-gray-500" />
            </div>
            
            {projects.length === 0 ? (
              <div className="text-center py-8">
                <ApperIcon name="FolderPlus" size={48} className="text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No projects yet</p>
                <p className="text-sm text-gray-400">Create your first project to get started</p>
              </div>
            ) : (
              <div className="space-y-3">
                {projects.slice(0, 4).map((project) => (
                  <motion.div
                    key={project.Id}
                    whileHover={{ x: 2 }}
                    className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: project.color }}
                      />
                      <div>
                        <p className="font-medium text-gray-900">{project.name}</p>
                        <p className="text-sm text-gray-500">
                          {project.tasksCount || 0} tasks
                        </p>
                      </div>
                    </div>
                    <ApperIcon name="ChevronRight" size={16} className="text-gray-400" />
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>

      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        task={selectedTask}
        onSave={handleTaskSave}
      />
    </div>
  );
};

export default Dashboard;