import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const PublicLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-dark-950 text-white">
      <Navbar />
      
      <main className="flex-1 w-full relative">
        <Outlet />
      </main>
      
      <Footer />
    </div>
  );
};

export default PublicLayout;
