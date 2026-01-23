import React, { useContext, useState } from 'react'; 
import { Link, useNavigate } from 'react-router-dom'; 
import { UserContext } from '../context/UserContext'; 

const Navbar = () => {
  const { user } = useContext(UserContext); // ✅ Get Real User
  const [query, setQuery] = useState("");   
  const navigate = useNavigate();

  const handleSearch = (e) => {
    if (e.key === 'Enter' && query.trim()) {
       navigate(`/search?q=${query}`);
    }
  };

  return (
    <nav style={styles.nav}>
      
      <div style={{flex: 1, maxWidth: '400px', marginRight: '20px'}}>
        <input 
          type="text" 
          placeholder="Search..." 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleSearch}
          style={styles.searchInput}
        />
      </div>

      <div style={styles.links}>
        <Link to="/" style={styles.link}>Home</Link>
        <Link to="/search" style={styles.link}>Search</Link>
        <Link to="/notifications" style={styles.link}>Notifications</Link>
        <Link to="/messages" style={styles.link}>Messages</Link>
        
        {/* ✅ REAL PROFILE PIC HERE TOO */}
        <Link to="/profile" style={styles.link}>
           <img 
             src={user?.profilePic || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} 
             alt="Profile" 
             style={styles.profilePic} 
           />
        </Link>
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    padding: '10px 20px', 
    borderBottom: '1px solid #eee',
    marginBottom: '20px',
    display: 'flex',
    justifyContent: 'space-between', 
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  links: {
    display: 'flex',
    gap: '30px',
    alignItems: 'center'
  },
  link: {
    textDecoration: 'none',
    color: '#666',
    fontWeight: '500',
    fontSize: '15px',
    transition: '0.3s',
    display: 'flex', 
    alignItems: 'center'
  },
  searchInput: {
    width: '100%',
    padding: '8px 15px',
    borderRadius: '20px',
    border: '1px solid #ddd',
    outline: 'none',
    backgroundColor: '#F2F0EA'
  },
  profilePic: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '1px solid #ccc'
  }
};

export default Navbar;