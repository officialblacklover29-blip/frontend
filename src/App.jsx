import React, { useContext } from 'react';
import { UserContext } from './context/UserContext';
import AuthPage from './Login'; 
import Home from './Home';

function App() {
  const { user, logout } = useContext(UserContext); // ✅ logout nikal lo
  const token = localStorage.getItem("token");

  return (
    <div className="App">
      {/* Agar user hai to Home dikhao aur logout function pass karo */}
      {user || token ? (
        <Home onLogout={logout} /> // ✅ onLogout prop pass karna zaroori hai
      ) : (
        <AuthPage />
      )}
    </div>
  );
}

export default App;