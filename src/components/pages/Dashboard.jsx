import React, { useEffect, useState } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { endOfWeek, format, startOfWeek } from "date-fns";
import { toast } from "react-toastify";
import Chart from "react-apexcharts";
import ApperIcon from "@/components/ApperIcon";
import TaskModal from "@/components/organisms/TaskModal";
import Header from "@/components/organisms/Header";
import Button from "@/components/atoms/Button";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import Projects from "@/components/pages/Projects";
import Tasks from "@/components/pages/Tasks";
import TaskCard from "@/components/molecules/TaskCard";
import { projectService } from "@/services/api/projectService";
import { taskService } from "@/services/api/taskService";
const Dashboard = () => {
  const { onMenuClick, onProjectsChange } = useOutletContext();
  const navigate = useNavigate();
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
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md transition-shadow duration-200"
              onClick={() => {
                const filterMap = {
                  'Tasks Due Today': 'today',
                  'Completed This Week': 'completed',
                  'Overdue Tasks': 'overdue'
                };
                const filterParam = filterMap[stat.title];
                if (filterParam) {
                  navigate(`/tasks?filter=${filterParam}`);
                }
              }}
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

        {/* Analytics Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Analytics</h3>
            <p className="text-gray-600">Visual insights into your task and project data</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Task Status Chart */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">Task Status Distribution</h4>
                  <p className="text-sm text-gray-500 mt-1">Breakdown of tasks by current status</p>
                </div>
                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                  <ApperIcon name="PieChart" size={16} className="text-blue-600" />
                </div>
              </div>
              
              {tasks.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ApperIcon name="PieChart" size={32} className="text-gray-300" />
                  </div>
                  <p className="text-gray-500">No task data available</p>
                </div>
              ) : (
                <Chart
                  options={{
                    chart: {
                      type: 'pie',
                      height: 350,
                      toolbar: { show: false },
                      animations: {
                        enabled: true,
                        easing: 'easeinout',
                        speed: 800
                      }
                    },
                    labels: ['To Do', 'In Progress', 'Completed'],
                    colors: ['#94a3b8', '#3b82f6', '#10b981'],
                    legend: {
                      position: 'bottom',
                      fontSize: '14px',
                      fontFamily: 'Inter, sans-serif',
                      markers: { width: 8, height: 8, radius: 4 }
                    },
                    plotOptions: {
                      pie: {
                        donut: {
                          size: '45%'
                        }
                      }
                    },
                    dataLabels: {
                      enabled: true,
                      style: {
                        fontSize: '12px',
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: 600
                      }
                    },
                    responsive: [{
                      breakpoint: 480,
                      options: {
                        chart: { width: 300 },
                        legend: { position: 'bottom' }
                      }
                    }]
                  }}
                  series={[
                    tasks.filter(t => t.status === 'ToDo').length,
                    tasks.filter(t => t.status === 'InProgress').length,
                    tasks.filter(t => t.status === 'Done').length
                  ]}
                  type="pie"
                  height={350}
                />
              )}
            </div>

            {/* Task Priority Chart */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">Task Priority Breakdown</h4>
                  <p className="text-sm text-gray-500 mt-1">Distribution of tasks by priority level</p>
                </div>
                <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                  <ApperIcon name="BarChart3" size={16} className="text-green-600" />
                </div>
              </div>
              
              {tasks.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ApperIcon name="BarChart3" size={32} className="text-gray-300" />
                  </div>
                  <p className="text-gray-500">No task data available</p>
                </div>
              ) : (
                <Chart
                  options={{
                    chart: {
                      type: 'bar',
                      height: 350,
                      toolbar: { show: false },
                      animations: {
                        enabled: true,
                        easing: 'easeinout',
                        speed: 800
                      }
                    },
                    plotOptions: {
                      bar: {
                        borderRadius: 8,
                        horizontal: false,
                        columnWidth: '60%'
                      }
                    },
                    dataLabels: { enabled: false },
                    colors: ['#ef4444', '#f59e0b', '#10b981'],
                    xaxis: {
                      categories: ['High', 'Medium', 'Low'],
                      labels: {
                        style: {
                          fontSize: '12px',
                          fontFamily: 'Inter, sans-serif'
                        }
                      }
                    },
                    yaxis: {
                      labels: {
                        style: {
                          fontSize: '12px',
                          fontFamily: 'Inter, sans-serif'
                        }
                      }
                    },
                    grid: {
                      borderColor: '#f1f5f9',
                      strokeDashArray: 3
                    },
                    tooltip: {
                      y: {
                        formatter: function (val) {
                          return val + ' tasks'
                        }
                      }
                    }
                  }}
                  series={[{
                    name: 'Tasks',
                    data: [
                      tasks.filter(t => t.priority === 'High').length,
                      tasks.filter(t => t.priority === 'Medium').length,
                      tasks.filter(t => t.priority === 'Low').length
                    ]
                  }]}
                  type="bar"
                  height={350}
                />
              )}
            </div>
          </div>
        </motion.div>

        {/* Today's Tasks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Tasks Due Today
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {todayTasks.length} {todayTasks.length === 1 ? 'task' : 'tasks'} requiring attention
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                  <ApperIcon name="Calendar" size={16} className="text-blue-600" />
                </div>
              </div>
            </div>
            
            {todayTasks.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ApperIcon name="CheckCircle" size={32} className="text-green-500" />
                </div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">All caught up!</h4>
                <p className="text-gray-500 mb-4">No tasks are due today. Great work!</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={openTaskModal}
                  className="text-blue-600 border-blue-200 hover:bg-blue-50"
                >
                  <ApperIcon name="Plus" size={16} className="mr-2" />
                  Plan Tomorrow
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {todayTasks.slice(0, 4).map((task) => (
                  <motion.div
                    key={task.Id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border border-gray-100 rounded-lg p-4 hover:border-gray-200 hover:shadow-sm transition-all duration-200"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          {task.projectName && (
                            <div className="flex items-center space-x-2">
                              <div 
                                className="w-3 h-3 rounded-full"
                                style={{ 
                                  backgroundColor: projects.find(p => p.Id === task.projectId)?.color || '#3b82f6' 
                                }}
                              />
                              <span className="text-xs font-medium text-gray-600 bg-gray-50 px-2 py-1 rounded-md">
                                {task.projectName}
                              </span>
                            </div>
                          )}
                          <div className={`text-xs font-medium px-2 py-1 rounded-md ${
                            task.priority === 'High' 
                              ? 'bg-red-50 text-red-700' 
                              : task.priority === 'Medium' 
                              ? 'bg-yellow-50 text-yellow-700' 
                              : 'bg-green-50 text-green-700'
                          }`}>
                            {task.priority}
                          </div>
                        </div>
                        <h4 className="font-medium text-gray-900 mb-1">
                          {task.title || task.Name}
                        </h4>
                        {task.description && (
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {task.description}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => handleToggleStatus(task.Id)}
                          className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                            task.status === 'Done'
                              ? 'bg-green-500 border-green-500'
                              : 'border-gray-300 hover:border-green-400'
                          }`}
                        >
                          {task.status === 'Done' && (
                            <ApperIcon name="Check" size={14} className="text-white" />
                          )}
                        </button>
                        <button
                          onClick={() => handleTaskEdit(task)}
                          className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-blue-600 transition-colors"
                        >
                          <ApperIcon name="Edit2" size={14} />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className={`text-xs px-2 py-1 rounded-md ${
                        task.status === 'ToDo' 
                          ? 'bg-gray-100 text-gray-700'
                          : task.status === 'InProgress'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {task.status === 'ToDo' ? 'To Do' : task.status === 'InProgress' ? 'In Progress' : 'Completed'}
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        <ApperIcon name="Clock" size={12} className="mr-1" />
                        Due today
                      </div>
                    </div>
                  </motion.div>
                ))}
                {todayTasks.length > 4 && (
                  <div className="text-center pt-4 border-t border-gray-100">
                    <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                      <ApperIcon name="ChevronDown" size={16} className="mr-2" />
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
<div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                Projects
              </h3>
            </div>
            
            {projects.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ApperIcon name="FolderPlus" size={32} className="text-gray-300" />
                </div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h4>
                <p className="text-gray-500">Create your first project to get started</p>
              </div>
            ) : (
              <div className="space-y-4">
                {projects.map((project) => (
                  <motion.div
                    key={project.Id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border border-gray-100 rounded-lg p-6 hover:border-gray-200 hover:shadow-sm transition-all duration-200"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <div 
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: project.color || '#3b82f6' }}
                          />
                          <h4 className="text-lg font-semibold text-gray-900">
                            {project.name}
                          </h4>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <ApperIcon name="CheckSquare" size={14} />
                            <span>{project.tasksCount || 0} tasks</span>
                          </div>
                          {project.createdAt && (
                            <div className="flex items-center space-x-1">
                              <ApperIcon name="Calendar" size={14} />
                              <span>Created {format(new Date(project.createdAt), 'MMM d, yyyy')}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
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