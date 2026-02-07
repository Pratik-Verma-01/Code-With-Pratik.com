import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Hooks
import { useAuth } from '@hooks/useAuth';
import { useTheme } from '@hooks/useTheme';

// Layout Components
import DashboardLayout from '@components/layout/DashboardLayout';
import AuthLayout from '@components/layout/AuthLayout';
import PublicLayout from '@components/layout/PublicLayout';

// Route Guards
import ProtectedRoute from '@components/auth/ProtectedRoute';
import PublicRoute from '@components/auth/PublicRoute';

// UI Components
import Loader from '@components/ui/Loader';
import PageTransition from '@components/effects/PageTransition';

// Route configuration
import { ROUTES } from '@config/routes.config';

// Lazy load pages for code splitting
const LandingPage = lazy(() => import('@pages/Public/LandingPage'));
const AuthPage = lazy(() => import('@pages/Auth/AuthPage'));
const ForgotPasswordPage = lazy(() => import('@pages/Auth/ForgotPasswordPage'));
const VerifyEmailPage = lazy(() => import('@pages/VerifyEmail'));

// Dashboard pages
const DashboardHome = lazy(() => import('@pages/Dashboard/DashboardHome'));
const UploadProject = lazy(() => import('@pages/Dashboard/UploadProject'));
const MyProjects = lazy(() => import('@pages/Dashboard/MyProjects'));
const EditProject = lazy(() => import('@pages/Dashboard/EditProject'));
const ExploreAI = lazy(() => import('@pages/Dashboard/ExploreAI'));
const Profile = lazy(() => import('@pages/Dashboard/Profile'));
const EditProfile = lazy(() => import('@pages/Dashboard/EditProfile'));
const Rewards = lazy(() => import('@pages/Dashboard/Rewards'));
const Notifications = lazy(() => import('@pages/Dashboard/Notifications'));
const Settings = lazy(() => import('@pages/Dashboard/Settings'));

// Project pages
const ProjectPage = lazy(() => import('@pages/Project/ProjectPage'));
const PublicProjectPage = lazy(() => import('@pages/Project/PublicProjectPage'));

// Public pages
const AboutPage = lazy(() => import('@pages/Public/AboutPage'));
const FeaturesPage = lazy(() => import('@pages/Public/FeaturesPage'));
const PublicProjects = lazy(() => import('@pages/Public/PublicProjects'));

// Error pages
const NotFoundPage = lazy(() => import('@pages/NotFound'));
const BlockedPage = lazy(() => import('@pages/Blocked'));
const MaintenancePage = lazy(() => import('@pages/Maintenance'));

// Full page loader component
const FullPageLoader = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-dark-950">
    <Loader size="lg" />
  </div>
);

// Page loader with transition
const PageLoader = () => (
  <div className="flex min-h-[60vh] items-center justify-center">
    <Loader size="md" text="Loading..." />
  </div>
);

function App() {
  const { isLoading: authLoading, isBlocked, user } = useAuth();
  const { theme } = useTheme();
  const location = useLocation();

  // Show loading state while auth is initializing
  if (authLoading) {
    return <FullPageLoader />;
  }

  // Redirect blocked users
  if (isBlocked && !location.pathname.includes('/blocked')) {
    return <Navigate to={ROUTES.BLOCKED} replace />;
  }

  // Check for maintenance mode
  const isMaintenanceMode = import.meta.env.VITE_MAINTENANCE_MODE === 'true';
  if (isMaintenanceMode && !location.pathname.includes('/maintenance')) {
    return <Navigate to={ROUTES.MAINTENANCE} replace />;
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark' : ''}`}>
      <div className="min-h-screen bg-dark-50 text-dark-900 transition-colors duration-300 dark:bg-dark-950 dark:text-dark-50">
        {/* Animated mesh gradient background */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute -left-1/4 -top-1/4 h-1/2 w-1/2 animate-pulse-slow rounded-full bg-neon-blue/5 blur-3xl" />
          <div className="absolute -bottom-1/4 -right-1/4 h-1/2 w-1/2 animate-pulse-slow rounded-full bg-neon-purple/5 blur-3xl" />
          <div className="animate-float absolute left-1/2 top-1/2 h-1/3 w-1/3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-neon-pink/5 blur-3xl" />
        </div>

        {/* Main content */}
        <AnimatePresence mode="wait" initial={false}>
          <Suspense fallback={<PageLoader />}>
            <Routes location={location} key={location.pathname}>
              {/* ============ PUBLIC ROUTES ============ */}
              <Route element={<PublicLayout />}>
                {/* Landing page */}
                <Route
                  path={ROUTES.HOME}
                  element={
                    <PageTransition>
                      <LandingPage />
                    </PageTransition>
                  }
                />

                {/* About page */}
                <Route
                  path={ROUTES.ABOUT}
                  element={
                    <PageTransition>
                      <AboutPage />
                    </PageTransition>
                  }
                />

                {/* Features page */}
                <Route
                  path={ROUTES.FEATURES}
                  element={
                    <PageTransition>
                      <FeaturesPage />
                    </PageTransition>
                  }
                />

                {/* Public projects browse */}
                <Route
                  path={ROUTES.EXPLORE}
                  element={
                    <PageTransition>
                      <PublicProjects />
                    </PageTransition>
                  }
                />

                {/* Public project view */}
                <Route
                  path={ROUTES.PUBLIC_PROJECT}
                  element={
                    <PageTransition>
                      <PublicProjectPage />
                    </PageTransition>
                  }
                />
              </Route>

              {/* ============ AUTH ROUTES ============ */}
              <Route element={<AuthLayout />}>
                {/* Login/Signup */}
                <Route
                  path={ROUTES.AUTH}
                  element={
                    <PublicRoute>
                      <PageTransition>
                        <AuthPage />
                      </PageTransition>
                    </PublicRoute>
                  }
                />

                {/* Login (redirect to auth) */}
                <Route
                  path={ROUTES.LOGIN}
                  element={<Navigate to={ROUTES.AUTH} replace />}
                />

                {/* Signup (redirect to auth) */}
                <Route
                  path={ROUTES.SIGNUP}
                  element={<Navigate to={`${ROUTES.AUTH}?mode=signup`} replace />}
                />

                {/* Forgot Password */}
                <Route
                  path={ROUTES.FORGOT_PASSWORD}
                  element={
                    <PublicRoute>
                      <PageTransition>
                        <ForgotPasswordPage />
                      </PageTransition>
                    </PublicRoute>
                  }
                />

                {/* Email Verification */}
                <Route
                  path={ROUTES.VERIFY_EMAIL}
                  element={
                    <PageTransition>
                      <VerifyEmailPage />
                    </PageTransition>
                  }
                />
              </Route>

              {/* ============ DASHBOARD ROUTES (PROTECTED) ============ */}
              <Route
                element={
                  <ProtectedRoute>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                {/* Dashboard Home */}
                <Route
                  path={ROUTES.DASHBOARD}
                  element={
                    <PageTransition>
                      <DashboardHome />
                    </PageTransition>
                  }
                />

                {/* Upload Project */}
                <Route
                  path={ROUTES.UPLOAD_PROJECT}
                  element={
                    <PageTransition>
                      <UploadProject />
                    </PageTransition>
                  }
                />

                {/* My Projects */}
                <Route
                  path={ROUTES.MY_PROJECTS}
                  element={
                    <PageTransition>
                      <MyProjects />
                    </PageTransition>
                  }
                />

                {/* Edit Project */}
                <Route
                  path={ROUTES.EDIT_PROJECT}
                  element={
                    <PageTransition>
                      <EditProject />
                    </PageTransition>
                  }
                />

                {/* View Project (with AI) */}
                <Route
                  path={ROUTES.PROJECT}
                  element={
                    <PageTransition>
                      <ProjectPage />
                    </PageTransition>
                  }
                />

                {/* Explore AI */}
                <Route
                  path={ROUTES.EXPLORE_AI}
                  element={
                    <PageTransition>
                      <ExploreAI />
                    </PageTransition>
                  }
                />

                {/* Profile */}
                <Route
                  path={ROUTES.PROFILE}
                  element={
                    <PageTransition>
                      <Profile />
                    </PageTransition>
                  }
                />

                {/* Edit Profile */}
                <Route
                  path={ROUTES.EDIT_PROFILE}
                  element={
                    <PageTransition>
                      <EditProfile />
                    </PageTransition>
                  }
                />

                {/* Rewards */}
                <Route
                  path={ROUTES.REWARDS}
                  element={
                    <PageTransition>
                      <Rewards />
                    </PageTransition>
                  }
                />

                {/* Notifications */}
                <Route
                  path={ROUTES.NOTIFICATIONS}
                  element={
                    <PageTransition>
                      <Notifications />
                    </PageTransition>
                  }
                />

                {/* Settings */}
                <Route
                  path={ROUTES.SETTINGS}
                  element={
                    <PageTransition>
                      <Settings />
                    </PageTransition>
                  }
                />
              </Route>

              {/* ============ ERROR ROUTES ============ */}
              {/* Blocked user page */}
              <Route
                path={ROUTES.BLOCKED}
                element={
                  <PageTransition>
                    <BlockedPage />
                  </PageTransition>
                }
              />

              {/* Maintenance page */}
              <Route
                path={ROUTES.MAINTENANCE}
                element={
                  <PageTransition>
                    <MaintenancePage />
                  </PageTransition>
                }
              />

              {/* 404 - Not Found */}
              <Route
                path="*"
                element={
                  <PageTransition>
                    <NotFoundPage />
                  </PageTransition>
                }
              />
            </Routes>
          </Suspense>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;
