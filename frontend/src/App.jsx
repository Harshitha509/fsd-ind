import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

// Lazy Load all pages so they are split into separate, tiny files!
// This makes the initial website load practically instant.
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const JobTracker = lazy(() => import('./pages/JobTracker'));
const SkillAnalyzer = lazy(() => import('./pages/SkillAnalyzer'));
const Profile = lazy(() => import('./pages/Profile'));

const ProtectedRoute = ({ children }) => {
  const { user, loading } = React.useContext(AuthContext);
  if (loading) return <div className="min-h-screen flex items-center justify-center text-primary-500">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  return children;
};

const AppLayout = ({ children }) => {
  return (
    <div className="flex h-screen bg-dark-900 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-dark-900 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

// A beautiful loading fallback for when pages are downloading in the background
const PageLoader = () => (
  <div className="flex items-center justify-center h-full w-full">
    <div className="w-8 h-8 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin"></div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route path="/" element={
              <ProtectedRoute>
                <AppLayout><Dashboard /></AppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/jobs" element={
              <ProtectedRoute>
                <AppLayout><JobTracker /></AppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/analyze" element={
              <ProtectedRoute>
                <AppLayout><SkillAnalyzer /></AppLayout>
              </ProtectedRoute>
            } />

            <Route path="/profile" element={
              <ProtectedRoute>
                <AppLayout><Profile /></AppLayout>
              </ProtectedRoute>
            } />
          </Routes>
        </Suspense>
      </Router>
    </AuthProvider>
  );
}

export default App;
