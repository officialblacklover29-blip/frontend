import React, { useContext } from 'react';
import { UserContext } from './context/UserContext'; // Path check karein
import AuthPage from './Login'; 
import Home from './Home';

function App() {
  const { user } = useContext(UserContext);
  const token = localStorage.getItem("token");

  return (
    <div className="App">
      {/* Agar user hai to Home, nahi to Login */}
      {user || token ? <Home /> : <AuthPage />}
    </div>
  );
}

export default App;