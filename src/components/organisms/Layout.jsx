import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import MobileSidebar from './MobileSidebar';
import { projectService } from '@/services/api/projectService';

const Layout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const data = await projectService.getAll();
      setProjects(data);
    } catch (err) {
      console.error('Failed to load projects:', err);
    }
  };

  const handleProjectSelect = (project) => {
    // Handle project selection logic here
    console.log('Selected project:', project);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        <Sidebar 
          projects={projects} 
          onProjectSelect={handleProjectSelect}
        />
        
        <MobileSidebar
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
          projects={projects}
          onProjectSelect={handleProjectSelect}
        />

        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 overflow-y-auto">
            <Outlet context={{ 
              projects, 
              onMenuClick: () => setIsMobileMenuOpen(true),
              onProjectsChange: loadProjects
            }} />
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;