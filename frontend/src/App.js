import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import './App.css';
import Jam from './components/Jam';
import ChatBox from './components/Chatbox';
import axios from 'axios'; // Add this import for axios


// In the HomePage component - removed spotifyInput and setSpotifyInput
const HomePage = ({ dynamicPages, newPageName, setNewPageName, createNewPage }) => {
  const navigate = useNavigate();

  return (
    <div className="page" style={{ 
      position: 'relative', 
      minHeight: '100vh', 
      paddingBottom: '100px',
      paddingTop: '0',  // Explicitly set top padding to 0
      margin: '0'       // Ensure no margin
    }}>
      {/* Login button in top left - with updated positioning */}
      <div className="auth-buttons" style={{ 
        position: 'absolute', 
        top: '0',
        left: '0',
        display: 'flex', 
        gap: '10px',
        zIndex: 100 
      }}>
        <button 
          className="login-button"
          onClick={() => navigate('/login')}
          style={{
            padding: '10px 20px',
            borderRadius: '0 0 8px 0',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            fontWeight: '600',
            boxShadow: '0 4px 6px rgba(0,0,0,0.15)'
          }}
        >
          Login
        </button>
      </div>

      <h1>Bubblr</h1>
      <h2>Explore Music Together</h2>
      
      {/* Add this section to render Jam components */}
      {dynamicPages.map((page) => (
        <Jam 
          key={page.id}
          destination={page.path} 
          label={page.title} 
          color={page.color} 
          size={page.size || 100} 
          x={page.x}
          y={page.y}
          highlight={page.highlight} // Pass the highlight flag
        />
      ))}
      
      {/* Simplified form without Spotify input */}
      <div className="create-jam-form" style={{ position: 'fixed', bottom: '20px', left: '20px', zIndex: 100 }}>
        <form onSubmit={createNewPage}>
          <input
            type="text"
            value={newPageName}
            onChange={(e) => setNewPageName(e.target.value)}
            placeholder="Enter jam name"
            style={{ marginBottom: '10px' }}
          />
          <button 
            className="create-jam-button"
            type="submit"
          >
            Create a Jam
          </button>
        </form>
      </div>
    </div>
  );
};

// Update in App.js
const DynamicPage = ({ title, spotifyId }) => {
  const navigate = useNavigate();
  
  return (
    <div className="dynamic-page" style={{ paddingTop: '120px' }}> {/* Increased padding for more space */}
      <h1>{title}</h1>
      
      {/* Container for side-by-side layout */}
      <div className="content-container" style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '90%',
        maxWidth: '1200px',
        margin: '20px auto',
        gap: '20px',
        alignItems: 'flex-start'
      }}>
        {/* Spotify Embed - Left side */}
        <div className="spotify-container" style={{ 
          width: '30%', 
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
        }}>
          <iframe 
            style={{ borderRadius: '12px' }} 
            src={`https://open.spotify.com/embed/track/1KdjbgMfPmQQANYVS2IfTJ?utm_source=generator`}
            width="100%" 
            height="352" 
            frameBorder="0" 
            allowFullScreen=""
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
            loading="lazy"
          ></iframe>
        </div>
        
        {/* ChatBox - Right side with adjustable height */}
        <div style={{ width: '30%' }}>
          <ChatBox 
            jamId={title.toLowerCase().replace(/\s+/g, '-')} 
            height="365px" /* Match Spotify embed height */
          />
        </div>
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

// Updated LoginPage with multiple music service login options
const LoginPage = () => {
  const navigate = useNavigate();

  // const handleLoginClick = async () => {
  //   try {
  //     // Send GET request using axios instead of fetch
  //     const response = await axios.get('http://localhost:3001/auth/login', {
  //       headers: {
  //         'Content-Type': 'application/json'
  //         // Note: If you need to use a Bearer token later, you would add:
  //         // 'Authorization': `Bearer ${yourAccessToken}`
  //       },
  //       withCredentials: true // This replaces 'credentials: include' for cookies
  //     });
      
  //     // Axios automatically parses JSON responses
  //     const data = response.data;
      
  //     console.log('Login request successful:', data);
  //     // Navigate to login page or handle successful login
  //     navigate('/login');
  //   } catch (error) {
  //     console.error('Error during login request:', error);
  //     // Error handling - still navigate to login page
  //     // You can access error.response for more details if available
  //     if (error.response) {
  //       console.error('Response error data:', error.response.data);
  //     }
  //     navigate('/login');
  //   }
  // };

  // const handleLoginClick = () => {
  //   window.location.href = 'http://localhost:3001/auth/login';
  // };

  const handleLoginClick = () => {
    // Open a popup window for login
    const popup = window.open(
      'http://localhost:3001/auth/login',
      'Spotify Login',
      'width=500,height=600'
    );
  
    // Listen for messages from the popup
    window.addEventListener('message', (event) => {
      // Verify the origin of the message for security
      if (event.origin !== 'http://localhost:3001') return;
  
      // event.data should contain your tokens or user info
      const { access_token, refresh_token, expiresAt, spotifyId, displayName } = event.data;
      console.log('Received tokens:', event.data);
  
      // Now you can update your frontend state (e.g., store tokens, update user context, etc.)
      // For example:
      // setAuthData({ access_token, refresh_token, expiresAt, spotifyId, displayName });
      
      // Optionally navigate to the dashboard
      navigate('/dashboard');
    });
  };
  
  
  
  return (
    <div className="page auth-page">
      <h1>Connect Your Music</h1>
      <div className="auth-form" style={{ width: '400px', maxWidth: '90%' }}>
        <div className="spotify-login-container">
          <p>Connect your favorite music service to create and share jams with the world.</p>
          
          {/* Spotify Button */}
          <button 
            className="spotify-auth-button"
            onClick={(handleLoginClick)}
            style={{
              background: '#1DB954', // Spotify green
              padding: '12px 24px',
              borderRadius: '25px',
              color: 'white',
              border: 'none',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              cursor: 'pointer',
              width: '100%',
              fontSize: '1rem',
              marginTop: '20px'
            }}
          >
            <span>Continue with Spotify</span>
          </button>
          
          {/* Apple Music Button */}
          <button 
            className="apple-auth-button"
            onClick={() => {
              console.log('Apple Music login clicked');
            }}
            style={{
              background: '#FA243C', // Apple Music red
              padding: '12px 24px',
              borderRadius: '25px',
              color: 'white',
              border: 'none',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              cursor: 'pointer',
              width: '100%',
              fontSize: '1rem',
              marginTop: '20px'
            }}
          >
            <span>Continue with Apple Music</span>
          </button>
          
          {/* Amazon Music Button */}
          <button 
            className="amazon-auth-button"
            onClick={() => {
              console.log('Amazon Music login clicked');
            }}
            style={{
              background: '#00A8E1', // Amazon Music blue
              padding: '12px 24px',
              borderRadius: '25px',
              color: 'white',
              border: 'none',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              cursor: 'pointer',
              width: '100%',
              fontSize: '1rem',
              marginTop: '20px'
            }}
          >
            <span>Continue with Amazon Music</span>
          </button>
        </div>
      </div>
      <button
        className="back-button"
        onClick={() => navigate('/')}
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px'
        }}
      >
        ← Back to Home
      </button>
    </div>
  );
};

// App content component that can use routing hooks - removed spotifyInput and setSpotifyInput
const AppContent = ({ dynamicPages, newPageName, setNewPageName, createNewPage }) => {
  const location = useLocation();
  
  // Reset the body height and background when navigating
  React.useEffect(() => {
    // Set body background to match app background to avoid black bar
    document.body.style.background = 'linear-gradient(135deg, #2196F3 0%, #0D47A1 100%)';
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    
    if (location.pathname !== '/' && !location.pathname.includes('login')) {
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
      ...(location.pathname !== '/' && !location.pathname.includes('login') ? { height: '100vh', overflow: 'hidden' } : {})
    }}>
      <header className="App-header" style={{ 
        minHeight: '100vh',
        margin: 0,
        padding: 0,
        width: '100%', 
        // Change this line to use the same blue gradient
        background: 'linear-gradient(135deg, #2196F3 0%, #0D47A1 100%)',
        // Rest of the styles stay the same
        paddingBottom: location.pathname === '/' ? 
          `${Math.max(100, dynamicPages.length * 120)}px` : '0',
        ...(location.pathname !== '/' && !location.pathname.includes('login') ? { height: '100vh', maxHeight: '100vh' } : {})
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
          
          {/* Generate routes for each dynamic page */}
          {dynamicPages.map(page => (
            <Route
              key={page.id}
              path={page.path}
              element={<DynamicPage title={page.title} spotifyId={page.spotifyId} />}
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
    const colors = [
      '#FF1E56',  // Vibrant pink/red
      '#00DDFF',  // Bright cyan
      '#FF9F1C',  // Vivid orange
      '#7B4CFF',  // Electric purple
      '#23F0C7',  // Bright teal
      '#FF6B6B',  // Coral pink
      '#32CD32',  // Lime green
      '#FF3864',  // Hot pink
      '#41EAD4',  // Turquoise
      '#FFDE22',  // Bright yellow
      '#B537F2',  // Violet
      '#3D9AF1',  // Bright blue
      '#00F5A0'   // Neon green
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // Constants for Jam component sizing and positioning
  const MIN_SIZE = 80;
  const MAX_SIZE = 200;
  const MIN_DISTANCE = 100; // Minimum distance between components

  // Function to create a new page - with scroll and highlight functionality
  const createNewPage = (e) => {
    e.preventDefault();
    if (newPageName.trim()) {
      const path = `/${newPageName.toLowerCase().replace(/\s+/g, '-')}`;
      // Use a default Spotify ID or one that you have for your user
      const spotifyId = '2WmJ5wp5wKBlIJE6FDAIBJ';
  
      // Generate random size between MIN_SIZE and MAX_SIZE
      const size = Math.floor(Math.random() * (MAX_SIZE - MIN_SIZE + 1)) + MIN_SIZE;
      
      // Determine fixed positioning bounds for X and Y
      const minX = 0;
      const maxX = 1000;
      let x = Math.floor(Math.random() * (maxX - minX + 1)) + minX;
      
      const minY = 120;
      let maxExistingY = dynamicPages.length > 0 
        ? Math.max(...dynamicPages.map(page => page.y + page.size))
        : minY;
      const maxY = maxExistingY + 200;
      let y = Math.floor(Math.random() * (maxY - minY + 1)) + minY;
      
      // Ensure new component maintains minimum distance from existing components
      let validPosition = false;
      let attempts = 0;
      const maxAttempts = 30;
      
      while (!validPosition && attempts < maxAttempts) {
        validPosition = true;
        for (const page of dynamicPages) {
          const distance = Math.sqrt(Math.pow(x - page.x, 2) + Math.pow(y - page.y, 2));
          if (distance < MIN_DISTANCE) {
            validPosition = false;
            x = Math.floor(Math.random() * (maxX - minX + 1)) + minX;
            y = Math.floor(Math.random() * (maxY - minY + 1)) + minY;
            break;
          }
        }
        attempts++;
      }
      
      const newPageId = Date.now();
      
      const newPage = {
        id: newPageId,
        title: newPageName,
        path: path,
        color: getRandomColor(),
        size: size,
        x: x,
        y: y,
        spotifyId: spotifyId, // Using default ID for now
        highlight: true
      };
      
      // Update the dynamicPages state (this will update your UI)
      setDynamicPages([...dynamicPages, newPage]);
      setNewPageName('');
      
      // Optionally update the body height to accommodate new components
      const pageHeight = Math.max(...dynamicPages.map(page => page.y + page.size), y + size);
      document.body.style.minHeight = `${pageHeight + 200}px`;
      
      // Scroll to the new component
      setTimeout(() => {
        window.scrollTo({
          top: y - 100,
          behavior: 'smooth'
        });
        setTimeout(() => {
          setDynamicPages(prev =>
            prev.map(page => page.id === newPageId ? { ...page, highlight: false } : page)
          );
        }, 2000);
      }, 100);
      
      // Send a POST request to the backend to create the bubble
      axios.post('http://localhost:3001/bubbles', { genreName: newPageName })
        .then(response => {
          console.log('Bubble created in backend:', response.data);
        })
        .catch(error => {
          console.error('Error creating bubble in backend:', error);
        });
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

  .create-jam-form input {
    background: rgba(255,255,255,0.3);
    border: none;
    border-radius: 8px;
    color: white;
    padding: 12px 15px;
    font-size: 1rem;
    width: 250px;
    transition: all 0.3s;
  }
  
  .create-jam-form input::placeholder {
    color: rgba(255, 255, 255, 0.9);
    font-weight: 500;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  }
  
  .spotify-container {
    margin: 30px auto;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 8px 24px rgba(0,0,0,0.2);
  }

  @keyframes pulseHighlight {
    0% { filter: brightness(1); }
    25% { filter: brightness(1.5); }
    50% { filter: brightness(1); }
    75% { filter: brightness(1.5); }
    100% { filter: brightness(1); }
  }
  
  .jam-highlight {
    box-shadow: 0 0 30px rgba(255,255,255,0.8), 0 8px 16px rgba(0,0,0,0.3) !important;
  }
`;
document.head.appendChild(style);

export default App;