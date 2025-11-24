import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Contacts } from './pages/Contacts';
import { Deals } from './pages/Deals';
import { Tasks } from './pages/Tasks';
import { Settings } from './pages/Settings';
import { Login } from './pages/Login';
import { Register } from './pages/Register';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authView, setAuthView] = useState<'login' | 'register'>('login');
  const [currentPage, setCurrentPage] = useState('dashboard');

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentPage('dashboard');
    setAuthView('login');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentPage} />;
      case 'contacts':
        return <Contacts />;
      case 'deals':
        return <Deals />;
      case 'tasks':
        return <Tasks />;
      case 'settings':
         return <Settings />;
      default:
        return <Dashboard onNavigate={setCurrentPage} />;
    }
  };

  if (!isAuthenticated) {
    if (authView === 'register') {
      return (
        <Register 
          onRegister={handleLogin} 
          onSwitchToLogin={() => setAuthView('login')} 
        />
      );
    }
    return (
      <Login 
        onLogin={handleLogin} 
        onSwitchToRegister={() => setAuthView('register')} 
      />
    );
  }

  return (
    <Layout 
      activePage={currentPage} 
      onNavigate={setCurrentPage} 
      onLogout={handleLogout}
    >
      {renderPage()}
    </Layout>
  );
};

export default App;