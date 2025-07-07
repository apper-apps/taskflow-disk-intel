import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import Header from '@/components/organisms/Header';
import ProjectCard from '@/components/molecules/ProjectCard';
import ProjectModal from '@/components/organisms/ProjectModal';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import { projectService } from '@/services/api/projectService';
import { taskService } from '@/services/api/taskService';

const Projects = () => {
  const { onMenuClick, onProjectsChange } = useOutletContext();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [projectsData, tasksData] = await Promise.all([
        projectService.getAll(),
        taskService.getAll()
      ]);

      // Attach task counts to projects
      const projectsWithCounts = projectsData.map(project => ({
        ...project,
        tasksCount: tasksData.filter(task => task.projectId === project.Id).length,
        tasks: tasksData.filter(task => task.projectId === project.Id)
      }));

      setProjects(projectsWithCounts);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleProjectSave = async (savedProject) => {
    if (selectedProject) {
      setProjects(projects.map(p => 
        p.Id === savedProject.Id 
          ? { ...savedProject, tasksCount: p.tasksCount, tasks: p.tasks }
          : p
      ));
    } else {
      setProjects([...projects, { ...savedProject, tasksCount: 0, tasks: [] }]);
    }
    setSelectedProject(null);
    onProjectsChange?.();
  };

  const handleProjectEdit = (project) => {
    setSelectedProject(project);
    setIsProjectModalOpen(true);
  };

  const handleProjectDelete = async (projectId) => {
    const project = projects.find(p => p.Id === projectId);
    if (project?.tasksCount > 0) {
      if (!confirm(`This project has ${project.tasksCount} tasks. Are you sure you want to delete it? All tasks will be deleted too.`)) {
        return;
      }
    } else {
      if (!confirm('Are you sure you want to delete this project?')) {
        return;
      }
    }

    try {
      await projectService.delete(projectId);
      setProjects(projects.filter(project => project.Id !== projectId));
      toast.success('Project deleted successfully');
      onProjectsChange?.();
    } catch (err) {
      toast.error('Failed to delete project');
    }
  };

  const handleProjectClick = (project) => {
    // Could navigate to project-specific task view
    console.log('Project clicked:', project);
  };

  const openProjectModal = () => {
    setSelectedProject(null);
    setIsProjectModalOpen(true);
  };

  const headerActions = [
    {
      label: 'New Project',
      icon: 'Plus',
      onClick: openProjectModal,
      className: 'bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white'
    }
  ];

  if (loading) return <Loading variant="dashboard" />;
  if (error) return <Error message={error} onRetry={loadProjects} variant="projects" />;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        title="Projects"
        onMenuClick={onMenuClick}
        actions={headerActions}
      />

      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Your Projects
          </h2>
          <p className="text-gray-600">
            Organize your tasks into projects for better productivity.
          </p>
        </div>

        {projects.length === 0 ? (
          <Empty
            variant="projects"
            onAction={openProjectModal}
            actionText="Create First Project"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {projects.map((project) => (
                <motion.div
                  key={project.Id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <ProjectCard
                    project={project}
                    onEdit={handleProjectEdit}
                    onDelete={handleProjectDelete}
                    onClick={() => handleProjectClick(project)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <ProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        project={selectedProject}
        onSave={handleProjectSave}
      />
    </div>
  );
};

export default Projects;