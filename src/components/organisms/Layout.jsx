import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Sidebar from './Sidebar';
import MobileSidebar from './MobileSidebar';

const Layout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { currentTheme } = useSelector((state) => state.user);
  const isDark = currentTheme === 'dark';
return (
    <div 
      className={`min-h-screen relative overflow-hidden transition-all duration-500 ${isDark ? 'bg-surface-900' : 'bg-surface-50'}`}
      style={{
        background: isDark 
          ? `
              radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(147, 51, 234, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 40% 80%, rgba(236, 72, 153, 0.08) 0%, transparent 50%),
              linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #1e293b 75%, #0f172a 100%)
            `
          : `
              radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.15) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.15) 0%, transparent 50%),
              radial-gradient(circle at 40% 80%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
              linear-gradient(135deg, #f8fafc 0%, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%, #f8fafc 100%)
            `,
      }}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl animate-float ${
          isDark 
            ? 'bg-gradient-to-br from-blue-500/10 to-purple-600/10' 
            : 'bg-gradient-to-br from-blue-400/20 to-purple-600/20'
        }`} />
        <div className={`absolute -bottom-40 -left-40 w-80 h-80 rounded-full blur-3xl animate-float ${
          isDark 
            ? 'bg-gradient-to-tr from-pink-500/10 to-blue-600/10' 
            : 'bg-gradient-to-tr from-pink-400/20 to-blue-600/20'
        }`} style={{ animationDelay: '1s' }} />
        <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl animate-pulse ${
          isDark 
            ? 'bg-gradient-to-r from-indigo-500/5 to-cyan-500/5' 
            : 'bg-gradient-to-r from-indigo-400/10 to-cyan-400/10'
        }`} />
      </div>
      
      <div className="relative flex h-screen backdrop-blur-sm">
        <Sidebar />
        
        <MobileSidebar
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        />

        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 overflow-y-auto custom-scrollbar">
            <Outlet context={{ 
              onMenuClick: () => setIsMobileMenuOpen(true)
            }} />
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;