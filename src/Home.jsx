import React, { useState, useEffect, useContext } from 'react'; 
import axios from 'axios'; 
import { UserContext } from './context/UserContext'; 

// Components Imports
import Logo from './components/Logo'; 
import Profile from './pages/Profile';
import Messages from './pages/Messages';
import Notifications from './pages/Notifications';
import Search from './pages/Search';
import Settings from './pages/Settings'; 

const Home = ({ onLogout }) => {
  const { user } = useContext(UserContext); 
  
  const [view, setView] = useState('feed'); 
  const [selectedFile, setSelectedFile] = useState(null);
  const [posts, setPosts] = useState([]); 
  const [likedPosts, setLikedPosts] = useState([]); 
  const [savedPosts, setSavedPosts] = useState([]); 
  const [postText, setPostText] = useState(""); 
  
  // Developer Notes States
  const [devNotes, setDevNotes] = useState("");
  const [showNoteBox, setShowNoteBox] = useState(false);

  // LocalStorage se purane notes load karne ke liye
  useEffect(() => {
    const savedNotes = localStorage.getItem("colly_dev_notes");
    if (savedNotes) setDevNotes(savedNotes);
  }, []);

  // Notes save karne ka function
  const handleNoteChange = (e) => {
    const value = e.target.value;
    setDevNotes(value);
    localStorage.setItem("colly_dev_notes", value);
  };

  // ✅ 1. Search State
  const [searchText, setSearchText] = useState("");

  // ✅ 2. Dark Mode State
  const [isDarkMode, setIsDarkMode] = useState(false);

  // --- 🎨 DYNAMIC THEME (Dark/Light) ---
  const theme = isDarkMode ? {
    primary: "#A18167",       
    bg: "#18191A",            
    card: "#242526",          
    textMain: "#E4E6EB",      
    textLight: "#B0B3B8",     
    border: "#393A3B",        
    shadow: "0 2px 8px rgba(0,0,0,0.3)",
    inputBg: "#3A3B3C"
  } : {
    primary: "#A18167",       
    bg: "#F2F0EA",            
    card: "#FFFFFF",          
    textMain: "#331b03",      
    textLight: "#606770",     
    border: "#e4e6eb",        
    shadow: "0 2px 8px rgba(0,0,0,0.05)",
    inputBg: "#F2F0EA"
  };

  useEffect(() => {
    fetchPosts();
    const localSaved = JSON.parse(localStorage.getItem('colly_saved')) || [];
    setSavedPosts(localSaved);
  }, [view]); 

  const fetchPosts = async () => {
    try {
      const currentUserId = localStorage.getItem('userId');
      if (!currentUserId) return;
      // ✅ FIX: Double slash removed (Corrected)
      const response = await axios.get(`https://backend-colly.onrender.com/api/posts/${currentUserId}`);
      setPosts(response.data); 
    } catch (err) { console.error("Fetch Error:", err); }
  };

  const handleUpload = async () => {
    const currentUserId = localStorage.getItem('userId');
    if (!selectedFile) return alert("Please select a photo first!");
    const data = new FormData();
    data.append('photo', selectedFile);
    data.append('userId', currentUserId); 
    data.append('title', postText || "Colly Moment"); 

    try {
      // ✅ FIX: Double slash removed (Corrected)
      const res = await axios.post('https://backend-colly.onrender.com/api/upload', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.success) {
        setPosts([res.data.post, ...posts]);
        setSelectedFile(null);
        setPostText("");
        alert("Moment Uploaded! 🔥");
        fetchPosts(); 
      }
    } catch (err) { alert("Upload failed!"); }
  };

  const handleLike = async (postId) => {
    try {
      // ✅ FIX: Double slash removed (Corrected)
      const res = await axios.put(`https://backend-colly.onrender.com/api/posts/${postId}/like`);
      setPosts(posts.map(p => p._id === postId ? { ...p, likes: res.data.likes } : p));
      if (!likedPosts.includes(postId)) setLikedPosts([...likedPosts, postId]);
    } catch (err) { console.error("Like failed"); }
  };

  const handleComment = async (postId) => {
    const commentText = prompt("Write your comment:");
    if (!commentText || commentText.trim() === "") return;
    try {
      // ✅ FIX: Double slash removed (Corrected)
      const res = await axios.post(`https://backend-colly.onrender.com/api/posts/${postId}/comment`, { text: commentText.trim() });
      setPosts(posts.map(p => p._id === postId ? res.data : p)); 
      alert("Comment posted!");
    } catch (err) { alert("Comment failed!"); }
  };

  const handleSave = (post) => {
    let currentSaved = JSON.parse(localStorage.getItem('colly_saved')) || [];
    const exists = currentSaved.find(p => p._id === post._id);
    if (exists) {
      currentSaved = currentSaved.filter(p => p._id !== post._id);
      alert("Removed from collections!");
    } else {
      currentSaved.push(post);
      alert("Saved to collections! 💾");
    }
    localStorage.setItem('colly_saved', JSON.stringify(currentSaved));
    setSavedPosts(currentSaved);
  };

  const handleDelete = async (post) => {
    if (window.confirm("Delete permanently?")) {
      try {
        // ✅ FIX: Double slash removed (Corrected)
        await axios.delete(`https://backend-colly.onrender.com/api/posts/${post._id}`);
        setPosts(posts.filter(p => p._id !== post._id)); 
        alert("Post Deleted! 🗑️");
      } catch (err) { alert("Delete failed!"); }
    }
  };

  const handleShare = (post) => {
    const link = `https://colly.vercel.app/post/${post._id}`;
    navigator.clipboard.writeText(link);
    alert("Link copied to clipboard! 🔗");
  };

  // --- STYLES OBJECT ---
  const styles = {
    page: { backgroundColor: theme.bg, minHeight: "100vh", fontFamily: "'Verdana', sans-serif", color: theme.textMain, transition: '0.3s' },
    navbar: { backgroundColor: theme.card, height: "60px", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 40px", position: "sticky", top: 0, zIndex: 100, boxShadow: theme.shadow, borderBottom: `1px solid ${theme.border}`, transition: '0.3s' },
    logoSection: { display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' },
    logoText: { fontSize: "24px", fontWeight: "bold", color: theme.primary, fontFamily: "'Playfair Display', serif", letterSpacing: "1px" },
    searchBar: { padding: '10px 20px', borderRadius: '25px', border: 'none', backgroundColor: theme.inputBg, width: '300px', outline: 'none', color: theme.textMain },
    container: { display: "flex", justifyContent: "center", paddingTop: "25px", gap: "30px", maxWidth: "1200px", margin: "0 auto", paddingBottom: "50px" },
    leftSidebar: { width: "250px", position: "sticky", top: "85px", height: "fit-content", display: window.innerWidth < 900 ? 'none' : 'block' },
    menuCard: { backgroundColor: theme.card, borderRadius: "12px", padding: "10px", boxShadow: theme.shadow },
    menuItem: { padding: "12px 15px", cursor: "pointer", borderRadius: "8px", display: "flex", alignItems: "center", gap: "10px", fontSize: "15px", fontWeight: "500", color: theme.textMain, transition: "0.2s" },
    feed: { width: "100%", maxWidth: "600px", display: "flex", flexDirection: "column", gap: "20px" },
    createBox: { backgroundColor: theme.card, borderRadius: "12px", padding: "20px", boxShadow: theme.shadow },
    createTop: { display: "flex", gap: "15px", marginBottom: "15px" },
    userAvatarSmall: { width: "40px", height: "40px", borderRadius: "50%", backgroundColor: "#eee", objectFit: "cover" },
    createInput: { flex: 1, padding: "12px", borderRadius: "20px", border: "none", backgroundColor: theme.inputBg, outline: "none", fontSize: "15px", color: theme.textMain },
    createActions: { display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: `1px solid ${theme.border}`, paddingTop: "15px" },
    uploadLabel: { cursor: "pointer", fontSize: "14px", color: theme.primary, fontWeight: "600", display: "flex", alignItems: "center", gap: "5px" },
    postBtn: { padding: "8px 24px", borderRadius: "20px", border: "none", backgroundColor: theme.primary, color: "#fff", fontWeight: "bold", cursor: "pointer" },
    postCard: { backgroundColor: theme.card, borderRadius: "12px", boxShadow: theme.shadow, overflow: "hidden" },
    postHeader: { padding: "15px", display: "flex", alignItems: "center", justifyContent: "space-between" },
    userInfo: { display: "flex", alignItems: "center", gap: "10px" },
    postImg: { width: "100%", height: "auto", display: "block", maxHeight: "600px", objectFit: "cover" },
    postActions: { padding: "12px 15px", display: "flex", gap: "20px", borderBottom: `1px solid ${theme.border}` },
    actionIcon: { cursor: "pointer", fontSize: "20px" },
    postContent: { padding: "15px" },
    rightSidebar: { width: "280px", position: "sticky", top: "85px", height: "fit-content", display: window.innerWidth < 1100 ? 'none' : 'block' },
    trendTitle: { fontSize: "14px", fontWeight: "bold", color: theme.textLight, marginBottom: "15px", textTransform: "uppercase", letterSpacing: "1px" },
    trendItem: { display: "flex", alignItems: "center", gap: "12px", marginBottom: "18px", cursor: "pointer" }
  };

  return (
    <div style={styles.page}>
      
      {/* 1. NAVBAR */}
      <div style={styles.navbar}>
        <div style={styles.logoSection} onClick={() => setView('feed')}>
            <img src="/collylogo.png" alt="logo" style={{width: '35px', height: '35px'}} />
            <span style={styles.logoText}>COLLY</span>
        </div>
        
        <input 
            placeholder="Search Colly..." 
            style={styles.searchBar} 
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={(e) => {
                if (e.key === 'Enter') setView('search');
            }}
            onClick={() => setView('search')} 
        />

        <div style={{display: 'flex', gap: '20px', alignItems: 'center'}}>
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              style={{
                background: theme.inputBg, 
                border: 'none', 
                borderRadius: '50%', 
                width: '40px', 
                height: '40px', 
                cursor: 'pointer', 
                fontSize: '20px',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
            >
              {isDarkMode ? '☀️' : '🌙'}
            </button>
            <button onClick={onLogout} style={{padding: '8px 16px', borderRadius: '20px', border: `1px solid ${theme.primary}`, background: 'transparent', color: theme.primary, cursor: 'pointer', fontWeight: 'bold'}}>Logout</button>
            <img 
                src={user?.profilePic || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} 
                style={{width: '35px', height: '35px', borderRadius: '50%', cursor: 'pointer', border: `2px solid ${theme.primary}`, objectFit: 'cover'}} 
                onClick={() => setView('profile')} 
                alt="profile" 
            />
        </div>
      </div>

      <div style={styles.container}>
        
        {/* 2. LEFT SIDEBAR */}
        <div style={styles.leftSidebar}>
           <div style={styles.menuCard}>
               {['feed', 'search', 'messages', 'notifications', 'saved', 'settings', 'profile'].map(item => (
                   <div key={item} onClick={() => setView(item)} style={{...styles.menuItem, backgroundColor: view === item ? theme.bg : 'transparent', color: view === item ? theme.primary : theme.textMain}}>
                       <span>{item === 'feed' ? '🏠' : item === 'search' ? '🔍' : item === 'settings' ? '⚙️' : '👤'}</span>
                       {item.charAt(0).toUpperCase() + item.slice(1)}
                   </div>
               ))}
           </div>
        </div>

        {/* 3. CENTER CONTENT */}
        <div style={styles.feed}>
            
            {/* Create Post Box - Sirf Feed mein dikhega */}
            {view === 'feed' && (
              <div style={styles.createBox}>
                  <div style={styles.createTop}>
                      <img 
                          src={user?.profilePic || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} 
                          style={styles.userAvatarSmall} 
                          alt="" 
                      />
                      <input 
                        placeholder={`What's on your mind, ${user?.username || 'User'}?`} 
                        style={styles.createInput} 
                        value={postText}
                        onChange={(e) => setPostText(e.target.value)}
                      />
                  </div>
                  <div style={styles.createActions}>
                      <label style={styles.uploadLabel}>
                          <input type="file" onChange={(e) => setSelectedFile(e.target.files[0])} style={{display: 'none'}} />
                          🖼️ Photo/Video
                      </label>
                      <button onClick={handleUpload} style={styles.postBtn}>Post</button>
                  </div>
              </div>
            )}

            {/* VIEWS SWITCHING */}
            {view === 'feed' ? (
                <>
                  {posts.map(post => (
                    <div key={post._id} style={styles.postCard}>
                        <div style={styles.postHeader}>
                            <div style={styles.userInfo}>
                                <img src={post.owner?.profilePic || "https://loremflickr.com/100/100/people?random=1"} style={styles.userAvatarSmall} alt="" />
                                <div>
                                    <h4 style={{margin: 0, fontSize: '14px', color: theme.textMain}}>@{post.owner?.username || 'user'}</h4>
                                    <p style={{margin: 0, fontSize: '11px', color: theme.textLight}}>Varanasi, India</p>
                                </div>
                            </div>
                            <span onClick={() => handleDelete(post)} style={{cursor: 'pointer', fontSize: '18px', color: theme.textMain}}>⋮</span>
                        </div>
                        <img src={post.img} style={styles.postImg} alt="Post" onDoubleClick={() => handleLike(post._id)} />
                        <div style={styles.postActions}>
                            <span onClick={() => handleLike(post._id)} style={{...styles.actionIcon, color: likedPosts.includes(post._id) ? '#e0245e' : theme.textMain}}>
                                {likedPosts.includes(post._id) ? '❤️' : '🤍'}
                            </span>
                            <span onClick={() => handleComment(post._id)} style={{...styles.actionIcon, color: theme.textMain}}>💬</span>
                            
                            {/* ✅ FIXED: Share Button ab chalega */}
                            <span onClick={() => handleShare(post)} style={{...styles.actionIcon, color: theme.textMain}}>🚀</span>
                            
                            <span onClick={() => handleSave(post)} style={{...styles.actionIcon, marginLeft: 'auto', color: savedPosts.find(p => p._id === post._id) ? theme.primary : theme.textMain}}>
                                {savedPosts.find(p => p._id === post._id) ? '🔖' : '💾'}
                            </span>
                        </div>
                        <div style={styles.postContent}>
                            <p style={{margin: '0 0 8px 0', fontSize: '14px', fontWeight: 'bold'}}>{post.likes || 0} likes</p>
                            <p style={{margin: 0, fontSize: '14px', lineHeight: '1.4'}}>
                                <strong style={{marginRight: '5px'}}>{post.owner?.username || 'user'}</strong> 
                                {post.title}
                            </p>
                        </div>
                    </div>
                  ))}
                </>
            ) : view === 'saved' ? ( 
                /* ✅ ADDED: Saved Page UI */
                <div>
                    <h3 style={{color: theme.textMain, padding: '10px'}}>My Collections 🔖</h3>
                    {savedPosts.length === 0 ? <p style={{color: theme.textLight, padding: '10px'}}>Nothing saved yet!</p> : (
                        savedPosts.map(post => (
                            <div key={post._id} style={{...styles.postCard, marginBottom: '20px'}}>
                                <img src={post.img} style={styles.postImg} alt="" />
                                <div style={{padding: '10px'}}>
                                    <p style={{color: theme.textMain, fontWeight: 'bold'}}>{post.title}</p>
                                    <button onClick={() => handleSave(post)} style={{border:'1px solid red', background:'transparent', color:'red', borderRadius:'5px', cursor:'pointer', padding: '5px 10px', marginTop: '5px'}}>Remove</button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            ) : view === 'profile' ? (
    <Profile darkMode={isDarkMode} />
            ) : view === 'messages' ? (
                <Messages darkMode={isDarkMode}/>
            ) : view === 'notifications' ? (
                <Notifications />
            ) : view === 'settings' ? (  
                <Settings onLogout={onLogout} darkMode={isDarkMode} />
            ) : (
                <Search query={searchText} />
            )}

        </div>

        {/* 4. RIGHT SIDEBAR */}
        <div style={styles.rightSidebar}>
            <div style={styles.menuCard}>
                <p style={styles.trendTitle}>Incredible India 🇮🇳</p>
                <div style={styles.trendItem}>
                    <img src="https://loremflickr.com/100/100/kumbh?random=1" style={{width: '45px', height: '45px', borderRadius: '8px', objectFit: 'cover'}} alt="" />
                    <div><p style={{margin: 0, fontSize: '13px', fontWeight: 'bold'}}>Maha Kumbh 2025</p></div>
                </div>
                <div style={styles.trendItem}>
                    <img src="https://loremflickr.com/100/100/isro?random=2" style={{width: '45px', height: '45px', borderRadius: '8px', objectFit: 'cover'}} alt="" />
                    <div><p style={{margin: 0, fontSize: '13px', fontWeight: 'bold'}}>ISRO Gaganyaan</p></div>
                </div>
            </div>
            <div style={{marginTop: '20px', fontSize: '11px', color: theme.textLight, textAlign: 'center'}}>
                © 2026 Colly from India with ❤️
            </div>
        </div>

      </div>
      
      {/* --- DEVELOPER NOTES FLOATING BUTTON --- */}
      <div style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: 9999, display: 'block' }}>
          <button 
              onClick={() => setShowNoteBox(!showNoteBox)}
              style={{
                  width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#ff4757', 
                  color: 'white', border: 'none', cursor: 'pointer', fontSize: '28px', 
                  boxShadow: '0 6px 16px rgba(255, 71, 87, 0.4)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', transition: '0.3s'
              }}
          >
              📝
          </button>

          {showNoteBox && (
              <div style={{
                  position: 'absolute', bottom: '75px', right: '0', width: '320px', 
                  backgroundColor: theme.card, borderRadius: '15px', padding: '20px', 
                  boxShadow: '0 10px 30px rgba(0,0,0,0.4)', border: `1px solid ${theme.border}`,
                  animation: 'fadeIn 0.3s ease-in-out'
              }}>
                  <h4 style={{ margin: '0 0 12px 0', fontSize: '15px', color: theme.primary, fontWeight: 'bold' }}>
                      🚀 Dev Logs / Tasks
                  </h4>
                  <textarea 
                      value={devNotes}
                      onChange={handleNoteChange}
                      placeholder="Likho kya fail ho raha hai..."
                      style={{
                          width: '100%', height: '250px', backgroundColor: theme.inputBg, 
                          color: theme.textMain, border: 'none', borderRadius: '10px', 
                          padding: '12px', fontSize: '14px', outline: 'none', resize: 'none', lineHeight: '1.5'
                      }}
                  />
                  <p style={{ fontSize: '11px', color: theme.textLight, marginTop: '8px', textAlign: 'right' }}>
                      Saved in LocalStorage ✅
                  </p>
              </div>
          )}
      </div> 
    </div>
  );
};

export default Home;