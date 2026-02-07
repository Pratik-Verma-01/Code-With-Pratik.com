import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';
import AISidebar from '@components/ai/AISidebar';
import { useIsMobile } from '@hooks/useMediaQuery';

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isMobile = useIsMobile();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="flex flex-col min-h-screen bg-dark-950 text-white">
      <Navbar onMobileMenuToggle={toggleSidebar} isMobileMenuOpen={isSidebarOpen} />
      
      <div className="flex flex-1 pt-0 relative">
        <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
        
        <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 mb-16 lg:mb-0 transition-all duration-300">
          <Outlet />
        </main>
        
        {/* Global AI Chat Sidebar (Desktop Only) */}
        {!isMobile && <AISidebar />}
      </div>
      
      {/* Mobile Bottom Navigation */}
      <MobileNav />
    </div>
  );
};

export default DashboardLayout;
