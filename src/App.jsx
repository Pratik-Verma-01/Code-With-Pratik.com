import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/layout/Layout';

// Pages
import Home from './pages/Home';
import AuthPage from './pages/Auth';
import Dashboard from './pages/Dashboard';
import UploadProject from './pages/UploadProject';
import ProjectDetails from './pages/ProjectDetails';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<AuthPage />} />
            
            {/* Protected Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute><Dashboard /></ProtectedRoute>
            } />
            <Route path="/dashboard/profile" element={
              <ProtectedRoute><Profile /></ProtectedRoute>
            } />
            <Route path="/upload" element={
              <ProtectedRoute><UploadProject /></ProtectedRoute>
            } />
            
            {/* Project Routes (Public view, but gate logic inside) */}
            <Route path="/project/:slug" element={<ProjectDetails />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
