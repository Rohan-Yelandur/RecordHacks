import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import './App.css';
import Jam from './components/Jam';

// Move HomePage outside of App function
const HomePage = ({ dynamicPages, newPageName, setNewPageName, createNewPage }) => {
  const navigate = useNavigate();
  
  return (
    <div className="page" style={{ position: 'relative', minHeight: '100vh', paddingBottom: '100px' }}>
      {/* Add login/signup buttons in top left */}
      <div className="auth-buttons" style={{ 
        position: 'absolute', 
        top: '20px', 
        left: '20px', 
        display: 'flex', 
        gap: '10px',
        zIndex: 100 
      }}>
        <button 
          className="login-button"
          onClick={() => navigate('/login')}
          style={{
            padding: '10px 20px',
            borderRadius: '8px',
            background: 'linear-gradient(45deg, #2196F3, #0D47A1)',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            fontWeight: '600',
            boxShadow: '0 4px 6px rgba(0,0,0,0.15)'
          }}
        >
          Login
        </button>
        <button 
          className="signup-button"
          onClick={() => navigate('/signup')}
          style={{
            padding: '10px 20px',
            borderRadius: '8px',
            background: 'linear-gradient(45deg, #9C27B0, #4A148C)',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            fontWeight: '600',
            boxShadow: '0 4px 6px rgba(0,0,0,0.15)'
          }}
        >
          Sign Up
        </button>
      </div>

      <h1>Bubblr</h1>
      <h2>Explore Music Together</h2>
      
      {/* Dynamic navigation buttons */}
      {dynamicPages.map((page) => (
        <Jam 
          key={page.id}
          destination={page.path} 
          label={page.title} 
          color={page.color} 
          size={page.size || 100} 
          x={page.x}
          y={page.y}
        />
      ))}

      {/* Form to create new pages */}
      <div className="create-jam-form" style={{ position: 'fixed', bottom: '20px', left: '20px', zIndex: 100 }}>
        <form onSubmit={createNewPage}>
          <input
            type="text"
            value={newPageName}
            onChange={(e) => setNewPageName(e.target.value)}
            placeholder="Enter jam name"
          />
          <button 
            className="create-jam-button"
            type="submit"
          >
            Start a Jam
          </button>
        </form>
      </div>
    </div>
  );
};

// Create Login and Signup page components
const LoginPage = () => {
  const navigate = useNavigate();
  
  return (
    <div className="page auth-page">
      <h1>Login</h1>
      <div className="auth-form">
        <form>
          <div className="form-group">
            <label>Email</label>
            <input type="email" placeholder="Enter your email" />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" placeholder="Enter your password" />
          </div>
          <button type="submit" className="auth-button">Login</button>
        </form>
      </div>
      <button
        className="back-button"
        onClick={() => navigate('/')}
      >
        ← Back to Home
      </button>
    </div>
  );
};

const SignupPage = () => {
  const navigate = useNavigate();
  
  return (
    <div className="page auth-page">
      <h1>Sign Up</h1>
      <div className="auth-form">
        <form>
          <div className="form-group">
            <label>Email</label>
            <input type="email" placeholder="Enter your email" />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" placeholder="Create a password" />
          </div>
          <div className="form-group">
            <label>Confirm Password</label>
            <input type="password" placeholder="Confirm your password" />
          </div>
          <button type="submit" className="auth-button">Create Account</button>
        </form>
      </div>
      <button
        className="back-button"
        onClick={() => navigate('/')}
      >
        ← Back to Home
      </button>
    </div>
  );
};


// Convert DynamicPage to a function that can use hooks
const DynamicPage = ({ title }) => {
  const navigate = useNavigate();
  
  return (
    // Remove the "page" class to prevent inheriting homepage styles
    <div className="dynamic-page">
      <h1>{title}</h1>
      
      <button
        className="back-button"
        onClick={() => navigate('/')}
      >
        ← Back to Home
      </button>
    </div>
  );
};

// App content component that can use routing hooks
const AppContent = ({ dynamicPages, newPageName, setNewPageName, createNewPage }) => {
  const location = useLocation();
  
  // Reset the body height and background when navigating
  React.useEffect(() => {
    // Set body background to match app background to avoid black bar
    document.body.style.background = 'linear-gradient(135deg, #1a237e 0%, #4a148c 100%)';
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    
    if (location.pathname !== '/' && !location.pathname.includes('login') && !location.pathname.includes('signup')) {
      document.body.style.height = '100vh';
      document.body.style.minHeight = '100vh';
      document.body.style.overflow = 'hidden';
    } else {
      // Restore expandable size for homepage
      const maxHeight = dynamicPages.length > 0 
        ? Math.max(...dynamicPages.map(page => page.y + page.size)) + 200
        : '100vh';
      document.body.style.minHeight = `${maxHeight}px`;
      document.body.style.height = 'auto';
      document.body.style.overflow = 'auto';
    }
  }, [location.pathname, dynamicPages]);
  
  return (
    <div className="App" style={{ 
      minHeight: '100vh',
      margin: 0,
      padding: 0,
      overflowX: 'hidden',
      // Constrain height on dynamic pages
      ...(location.pathname !== '/' && !location.pathname.includes('login') && !location.pathname.includes('signup') ? { height: '100vh', overflow: 'hidden' } : {})
    }}>
      <header className="App-header" style={{ 
        minHeight: '100vh',
        margin: 0,
        padding: 0,
        width: '100%', 
        background: 'linear-gradient(135deg, #1a237e 0%, #4a148c 100%)',
        // Only apply expanded padding on the homepage
        paddingBottom: location.pathname === '/' ? 
          `${Math.max(100, dynamicPages.length * 120)}px` : '0',
        // Constrain height on dynamic pages
        ...(location.pathname !== '/' && !location.pathname.includes('login') && !location.pathname.includes('signup') ? { height: '100vh', maxHeight: '100vh' } : {})
      }}>
        <Routes>
          {/* Main routes */}
          <Route 
            path="/" 
            element={
              <HomePage 
                dynamicPages={dynamicPages} 
                newPageName={newPageName} 
                setNewPageName={setNewPageName} 
                createNewPage={createNewPage}
              />
            } 
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          
          {/* Generate routes for each dynamic page */}
          {dynamicPages.map(page => (
            <Route
              key={page.id}
              path={page.path}
              element={<DynamicPage title={page.title} />}
            />
          ))}
        </Routes>
      </header>
    </div>
  );
};

function App() {
  // State to store dynamically created pages
  const [dynamicPages, setDynamicPages] = useState([]);
  // State for the form input
  const [newPageName, setNewPageName] = useState('');

  // Random color generator
  const getRandomColor = () => {
    const colors = ['#4CAF50', '#2196F3', '#f44336', '#FF9800', '#9C27B0', '#795548', '#607D8B'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // Constants for Jam component sizing and positioning
  const MIN_SIZE = 80;
  const MAX_SIZE = 150;
  const MIN_DISTANCE = 100; // Minimum distance between components

  // Function to create a new page
  const createNewPage = (e) => {
    e.preventDefault();
    if (newPageName.trim()) {
      const path = `/${newPageName.toLowerCase().replace(/\s+/g, '-')}`;
      
      // Generate a random size between MIN_SIZE and MAX_SIZE
      const size = Math.floor(Math.random() * (MAX_SIZE - MIN_SIZE + 1)) + MIN_SIZE;
      
      // Fixed positioning bounds for X-axis (these seem to work well)
      const minX = 0;  // Left margin
      const maxX = 1000;   // Right boundary
      
      // Generate initial X position
      let x = Math.floor(Math.random() * (maxX - minX + 1)) + minX;
      
      // Improved Y position generation:
      // First, determine the valid vertical range
      const minY = 120; // Minimum Y to avoid header content
      
      // Find the maximum Y position of any existing component
      let maxExistingY = minY;
      if (dynamicPages.length > 0) {
        maxExistingY = Math.max(...dynamicPages.map(page => page.y + page.size));
      }
      
      // Set our max Y value with some padding for new components
      const maxY = maxExistingY + 200;
      
      // Generate initial Y position anywhere within the valid range
      let y = Math.floor(Math.random() * (maxY - minY + 1)) + minY;
      
      // Make sure components maintain MIN_DISTANCE from each existing component
      let validPosition = false;
      let attempts = 0;
      const maxAttempts = 30;
      
      while (!validPosition && attempts < maxAttempts) {
        validPosition = true;
        
        // Check distance from each existing component
        for (const page of dynamicPages) {
          const distance = Math.sqrt(
            Math.pow(x - page.x, 2) + 
            Math.pow(y - page.y, 2)
          );
          
          if (distance < MIN_DISTANCE) {
            validPosition = false;
            
            // Try completely new random positions
            x = Math.floor(Math.random() * (maxX - minX + 1)) + minX;
            y = Math.floor(Math.random() * (maxY - minY + 1)) + minY;
            
            break;
          }
        }
        
        attempts++;
      }
      
      const newPage = {
        id: Date.now(),
        title: newPageName,
        path: path,
        color: getRandomColor(),
        size: size,
        x: x,
        y: y
      };
      
      setDynamicPages([...dynamicPages, newPage]);
      setNewPageName('');
      
      // Update the page's min height to accommodate components
      const pageHeight = Math.max(
        ...dynamicPages.map(page => page.y + page.size), 
        y + size
      );
      document.body.style.minHeight = `${pageHeight + 200}px`;
    }
  };

  return (
    <Router>
      <AppContent 
        dynamicPages={dynamicPages}
        newPageName={newPageName}
        setNewPageName={setNewPageName}
        createNewPage={createNewPage}
      />
    </Router>
  );
}

// Add this to ensure the app's background expands properly
const style = document.createElement('style');
style.textContent = `
  body, html {
    margin: 0;
    padding: 0;
    min-height: 100vh;
    height: auto;
    overflow-x: hidden;
  }
  
  #root {
    min-height: 100vh;
    height: auto;
  }
  
  .App, .App-header {
    min-height: 100vh;
    height: auto;
  }
`;
document.head.appendChild(style);

export default App;