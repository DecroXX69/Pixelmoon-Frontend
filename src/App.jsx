import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './components/context/ThemeContext';
import { AuthProvider } from './components/context/AuthContext';
import Navbar from './components/Navbar/Navbar';
import HomePage from './components/pages/Home/Home';
import AuthPage from './components/pages/Login/AuthPage';
import GamesPage from './components/pages/Games/GameListing';
import GameDisplay from './components/pages/Games/GameDisplay';
import AdminPanel from './components/pages/Admin/Admin';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import TailwindTest from './components/pages/Admin/TailwindTest';
// import DashboardPage from './pages/DashboardPage';
// import GamesPage from './pages/GamesPage';
// import BlogsPage from './pages/BlogsPage';
// import ContactPage from './pages/ContactPage';
// import NotFoundPage from './pages/NotFoundPage';
// import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
// import './App.css';
import './index.css'; // Import your main CSS file
function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <div className="app">
            <Navbar />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<AuthPage />} />
                <Route path="/register" element={<AuthPage />} />
                <Route path="/games" element={<GamesPage />} />
                {/* <Route path="/blogs" element={<BlogsPage />} />
                <Route path="/contact-us" element={<ContactPage />} /> */}
                
                {/* Protected Routes */}
                <Route 
                path="/games/:gameId" 
                element={
                  <ProtectedRoute>
                    <GameDisplay />
                  </ProtectedRoute>
                } 
              />
               {/* Admin Routes */}
               <Route 
                path="/admin" 
                element={
                  <ProtectedRoute adminOnly={true}>
                    <AdminPanel />
                  </ProtectedRoute>
                } 
              />
              
              {/* Catch all route */}
              {/* <Route path="*" element={<div>Page Not Found</div>} /> */}
                
                {/* 404 Page */}
                {/* <Route path="*" element={<NotFoundPage />} /> */}
              </Routes>
            </main>
          </div>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;