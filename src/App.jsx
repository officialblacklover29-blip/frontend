import React, { useContext } from 'react'; // ✅ useContext import karo
import { UserContext } from '../context/UserContext'; // ✅ Context import
import AuthPage from './Login'; 

function App() {
  const { user } = useContext(UserContext); // ✅ Seedha Context se user maango

  // Hum localStorage bhi check kar sakte hain taaki refresh par jhatka na lage
  const token = localStorage.getItem("token");

  return (
    <div className="App">
      {/* Agar Context me User hai YA Token hai, to Home dikhao */}
      {user || token ? (
         <Home />
      ) : (
         <AuthPage />
      )}
    </div>
  );
}

export default App;