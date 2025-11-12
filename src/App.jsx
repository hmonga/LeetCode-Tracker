import { useRef, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Crosshair from './Crosshair';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import './App.css';

function AppContent() {
  const { currentUser } = useAuth();
  const containerRef = useRef(null);
  const [isLogin, setIsLogin] = useState(true);

  if (!currentUser) {
    return (
      <div ref={containerRef} className="app-container">
        <Crosshair containerRef={containerRef} color="#ffffff" />
        {isLogin ? (
          <Login onToggle={() => setIsLogin(false)} />
        ) : (
          <Signup onToggle={() => setIsLogin(true)} />
        )}
      </div>
    );
  }

  return (
    <div ref={containerRef} className="app-container">
      <Crosshair containerRef={containerRef} color="#ffffff" />
      <Dashboard />
    </div>
  );
}

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
};

export default App;

