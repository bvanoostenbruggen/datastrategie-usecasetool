
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Index from '@/pages/Index';
import Challenges from '@/pages/Challenges';
import Roadmap from '@/pages/Roadmap';
import Login from '@/pages/Login';
import ForgotPassword from '@/pages/ForgotPassword';
import NotFound from '@/pages/NotFound';
import ProjectSelection from '@/pages/ProjectSelection';
import { AuthLayout } from '@/components/AuthLayout';
import ProjectRedirect from '@/components/ProjectRedirect';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";
import { TeamProvider } from './contexts/TeamContext';
import { AuthProvider } from './hooks/useAuth';
import { ProjectsProvider } from './hooks/useProjects';

function App() {
  return (
    <AuthProvider>
      <ProjectsProvider>
        <TeamProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/" element={
                <ProtectedRoute>
                  <ProjectRedirect>
                    <Index />
                  </ProjectRedirect>
                </ProtectedRoute>
              } />
              <Route path="/challenges" element={
                <ProtectedRoute>
                  <ProjectRedirect>
                    <Challenges />
                  </ProjectRedirect>
                </ProtectedRoute>
              } />
              <Route path="/roadmap" element={
                <ProtectedRoute>
                  <ProjectRedirect>
                    <Roadmap />
                  </ProjectRedirect>
                </ProtectedRoute>
              } />
              <Route path="/project-selection" element={
                <ProtectedRoute>
                  <ProjectSelection />
                </ProtectedRoute>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
            <SonnerToaster position="top-right" />
          </BrowserRouter>
        </TeamProvider>
      </ProjectsProvider>
    </AuthProvider>
  );
}

export default App;
