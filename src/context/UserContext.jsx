import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // App start hone par User Data load karo
  useEffect(() => {
    const fetchUser = async () => {
      const username = localStorage.getItem('username');
      if (username) {
        try {
          const res = await axios.get(`https://colly-1-iw6c.onrender.com/api/user/${username}`);
          setUser(res.data);
        } catch (err) {
          console.error("User fetch failed", err);
        }
      }
    };
    fetchUser();
  }, []);

  const login = (userData, token) => {
  if (token) localStorage.setItem('token', token); // Sirf tabhi save karein jab token ho
  localStorage.setItem('userId', userData._id);
  localStorage.setItem('username', userData.username);
  setUser(userData);
};

  const logout = () => {
    localStorage.clear(); // Saara data saaf karo
    setUser(null);        // State ko null karo
    // window.location.href wali line hata do!
  };

  // ✅ Real-time Update (Photo change hone par turant dikhe)
  const updateUser = (newData) => {
    setUser((prev) => ({ ...prev, ...newData }));
  };

  return (
    <UserContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};