import { useState, useEffect } from 'react';
import { useOutletContext, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '@/components/organisms/Header';
import TaskList from '@/components/organisms/TaskList';
import KanbanBoard from '@/components/organisms/KanbanBoard';
import TaskModal from '@/components/organisms/TaskModal';
import FilterBar from '@/components/molecules/FilterBar';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import { taskService } from '@/services/api/taskService';
import { projectService } from '@/services/api/projectService';

const Tasks = () => {
const { onMenuClick, onProjectsChange } = useOutletContext();
  const [searchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    project: 'all'
  });
  const [projects, setProjects] = useState([]);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [currentProjectName, setCurrentProjectName] = useState('');

  useEffect(() => {
    loadProjects();
    
    // Check for project parameter in URL
    const projectId = searchParams.get('project');
    if (projectId) {
      setFilters(prev => ({
        ...prev,
        project: projectId
      }));
    }
  }, [searchParams]);

const loadProjects = async () => {
    try {
      const data = await projectService.getAll();
      setProjects(data);
      
      // Set current project name if filtering by project
      const projectId = searchParams.get('project');
      if (projectId) {
        const project = data.find(p => p.Id.toString() === projectId);
        setCurrentProjectName(project?.Name || '');
      }
    } catch (err) {
      console.error('Failed to load projects:', err);
    }
  };

  const handleTaskSave = async (savedTask) => {
    if (selectedTask) {
      // Task updated - handled by child components
    } else {
      // Task created - handled by child components
    }
    setSelectedTask(null);
    onProjectsChange?.();
  };

  const handleTaskEdit = (task) => {
    setSelectedTask(task);
    setIsTaskModalOpen(true);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      status: 'all',
      priority: 'all',
      project: 'all'
    });
  };

  const openTaskModal = () => {
    setSelectedTask(null);
    setIsTaskModalOpen(true);
  };

  const headerActions = [
    {
      label: 'New Task',
      icon: 'Plus',
      onClick: openTaskModal,
      className: 'bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white'
    }
  ];

const getPageTitle = () => {
    if (currentProjectName) {
      return `${currentProjectName} Tasks`;
    }
    return 'All Tasks';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        title={getPageTitle()}
        onMenuClick={onMenuClick}
        showSearch={true}
        searchQuery={searchQuery}
        onSearchChange={(e) => setSearchQuery(e.target.value)}
        onSearchClear={() => setSearchQuery('')}
        actions={headerActions}
      />

      <div className="p-6">
        <div className="mb-6">
          <FilterBar
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
          />
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <h2 className="text-lg font-semibold text-gray-900">
              {viewMode === 'list' ? 'Task List' : 'Kanban Board'}
            </h2>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="flex items-center space-x-2"
            >
              <ApperIcon name="List" size={16} />
              <span className="hidden sm:inline">List</span>
            </Button>
            <Button
              variant={viewMode === 'kanban' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('kanban')}
              className="flex items-center space-x-2"
            >
              <ApperIcon name="Columns" size={16} />
              <span className="hidden sm:inline">Kanban</span>
            </Button>
          </div>
        </div>

        <motion.div
          key={viewMode}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {viewMode === 'list' ? (
            <TaskList
              searchQuery={searchQuery}
              filters={filters}
              onTaskEdit={handleTaskEdit}
              onTaskCreate={openTaskModal}
            />
          ) : (
            <KanbanBoard
              searchQuery={searchQuery}
              filters={filters}
              onTaskEdit={handleTaskEdit}
              onTaskCreate={openTaskModal}
            />
          )}
        </motion.div>
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

export default Tasks;