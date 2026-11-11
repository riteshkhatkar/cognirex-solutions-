import React, { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';
import { useAuthStore } from './store/authStore';
import { DashboardShell } from './components/DashboardShell';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { ImageLibrary } from './pages/ImageLibrary';
import { Inquiries } from './pages/Inquiries';
import { Bookings } from './pages/Bookings';
import { CareersAdmin } from './pages/CareersAdmin';
import { Settings } from './pages/Settings';
import { Profile } from './pages/Profile';
import { NavigationBrandEditor } from './pages/editors/NavigationBrandEditor';
import { HeroEditor } from './pages/editors/HeroEditor';
import { AboutEditor } from './pages/editors/AboutEditor';
import { SolutionsEditor } from './pages/editors/SolutionsEditor';
import { WhyChooseUsEditor } from './pages/editors/WhyChooseUsEditor';
import { ProcessEditor } from './pages/editors/ProcessEditor';
import { IndustriesEditor } from './pages/editors/IndustriesEditor';
import { InnovationEditor } from './pages/editors/InnovationEditor';
import { ContactPortalEditor } from './pages/editors/ContactPortalEditor';
import { CareersEditor } from './pages/editors/CareersEditor';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F7FC] text-[#1F1B2E]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-4 border-[#7C3AED] border-t-transparent animate-spin" />
          <p className="text-xs font-bold tracking-wider uppercase text-[#7C3AED]">
            Connecting Cognirex CMS...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <DashboardShell>{children}</DashboardShell>;
};

export function App() {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    void checkAuth();
  }, [checkAuth]);

  return (
    <BrowserRouter basename="/cms">
      <Toaster position="top-right" richColors closeButton />
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/editors/brand"
          element={
            <ProtectedRoute>
              <NavigationBrandEditor />
            </ProtectedRoute>
          }
        />
        <Route
          path="/editors/hero"
          element={
            <ProtectedRoute>
              <HeroEditor />
            </ProtectedRoute>
          }
        />
        <Route
          path="/editors/about"
          element={
            <ProtectedRoute>
              <AboutEditor />
            </ProtectedRoute>
          }
        />
        <Route
          path="/editors/solutions"
          element={
            <ProtectedRoute>
              <SolutionsEditor />
            </ProtectedRoute>
          }
        />
        <Route
          path="/editors/why-choose-us"
          element={
            <ProtectedRoute>
              <WhyChooseUsEditor />
            </ProtectedRoute>
          }
        />
        <Route
          path="/editors/process"
          element={
            <ProtectedRoute>
              <ProcessEditor />
            </ProtectedRoute>
          }
        />
        <Route
          path="/editors/industries"
          element={
            <ProtectedRoute>
              <IndustriesEditor />
            </ProtectedRoute>
          }
        />
        <Route
          path="/editors/innovation"
          element={
            <ProtectedRoute>
              <InnovationEditor />
            </ProtectedRoute>
          }
        />
        <Route
          path="/editors/contact"
          element={
            <ProtectedRoute>
              <ContactPortalEditor />
            </ProtectedRoute>
          }
        />
        <Route
          path="/editors/careers"
          element={
            <ProtectedRoute>
              <CareersEditor />
            </ProtectedRoute>
          }
        />

        <Route
          path="/images"
          element={
            <ProtectedRoute>
              <ImageLibrary />
            </ProtectedRoute>
          }
        />
        <Route
          path="/inquiries"
          element={
            <ProtectedRoute>
              <Inquiries />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bookings"
          element={
            <ProtectedRoute>
              <Bookings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/applications"
          element={
            <ProtectedRoute>
              <CareersAdmin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
