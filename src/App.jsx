import React, { useState, useEffect } from 'react';
import AuthPage from './Login'; 
import Home from './Home';
// ✅ ADDED THIS IMPORT
import { UserProvider } from './context/UserContext'; 

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("token")) setIsLoggedIn(true);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
  };

  return (
    // ✅ ADDED PROVIDER WRAPPER HERE
    <UserProvider>
      <div className="App">
        {!isLoggedIn ? (
          <AuthPage onLoginSuccess={() => setIsLoggedIn(true)} />
        ) : (
          <Home onLogout={handleLogout} />
        )}
      </div>
    </UserProvider>
  );
}

export default App;