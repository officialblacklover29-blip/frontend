import React, { useState, useEffect, useContext } from 'react'; 
import axios from 'axios'; 
import { UserContext } from './context/UserContext'; 

// Components Imports (Inhe waise hi rahne diya)
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

  // Search & Dark Mode
  const [searchText, setSearchText] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);

  // --- 🎨 NEW ADDICTIVE THEME ---
  const theme = isDarkMode ? {
    bg: "#0f0f10",            // Deep Black
    glass: "rgba(30, 30, 30, 0.70)", // Dark Glass
    card: "#18181b",
    textMain: "#ffffff",
    textLight: "#a1a1aa",
    primary: "#f43f5e",       // Rose Red (Addictive Color)
    border: "rgba(255,255,255,0.1)",
    shadow: "0 10px 40px -10px rgba(0,0,0,0.5)"
  } : {
    bg: "#f0f2f5",            // Soft Grey (FB/Twitter vibe)
    glass: "rgba(255, 255, 255, 0.85)", // Light Glass
    card: "#ffffff",
    textMain: "#18181b",
    textLight: "#71717a",
    primary: "#E1306C",       // Insta-like Pink/Red
    border: "rgba(0,0,0,0.05)",
    shadow: "0 8px 30px rgba(0,0,0,0.08)"
  };

  useEffect(() => {
    const savedNotes = localStorage.getItem("colly_dev_notes");
    if (savedNotes) setDevNotes(savedNotes);
  }, []);

  const handleNoteChange = (e) => {
    const value = e.target.value;
    setDevNotes(value);
    localStorage.setItem("colly_dev_notes", value);
  };

  useEffect(() => {
    fetchPosts();
    const localSaved = JSON.parse(localStorage.getItem('colly_saved')) || [];
    setSavedPosts(localSaved);
  }, [view]); 

  // --- BACKEND LOGIC (UNTOUCHED) ---
  const fetchPosts = async () => {
    try {
      const currentUserId = localStorage.getItem('userId');
      if (!currentUserId) return;
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
      const res = await axios.post('https://backend-colly.onrender.com/api/upload', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.success) {
        setPosts([res.data.post, ...posts]);
        setSelectedFile(null);
        setPostText("");
        // alert("Moment Uploaded! 🔥"); // Alert hata diya for smooth UX
        fetchPosts(); 
      }
    } catch (err) { alert("Upload failed!"); }
  };

  const handleLike = async (postId) => {
    try {
      const res = await axios.put(`https://backend-colly.onrender.com/api/posts/${postId}/like`);
      setPosts(posts.map(p => p._id === postId ? { ...p, likes: res.data.likes } : p));
      if (!likedPosts.includes(postId)) setLikedPosts([...likedPosts, postId]);
    } catch (err) { console.error("Like failed"); }
  };

  const handleComment = async (postId) => {
    const commentText = prompt("Write your comment:");
    if (!commentText || commentText.trim() === "") return;
    try {
      const res = await axios.post(`https://backend-colly.onrender.com/api/posts/${postId}/comment`, { text: commentText.trim() });
      setPosts(posts.map(p => p._id === postId ? res.data : p)); 
    } catch (err) { alert("Comment failed!"); }
  };

  const handleSave = (post) => {
    let currentSaved = JSON.parse(localStorage.getItem('colly_saved')) || [];
    const exists = currentSaved.find(p => p._id === post._id);
    if (exists) {
      currentSaved = currentSaved.filter(p => p._id !== post._id);
    } else {
      currentSaved.push(post);
    }
    localStorage.setItem('colly_saved', JSON.stringify(currentSaved));
    setSavedPosts(currentSaved);
  };

  const handleDelete = async (post) => {
    if (window.confirm("Delete permanently?")) {
      try {
        await axios.delete(`https://backend-colly.onrender.com/api/posts/${post._id}`);
        setPosts(posts.filter(p => p._id !== post._id)); 
      } catch (err) { alert("Delete failed!"); }
    }
  };

  const handleShare = (post) => {
    const link = `https://colly.vercel.app/post/${post._id}`;
    navigator.clipboard.writeText(link);
    alert("Link copied! 🔗");
  };

  // --- 🔥 NEW STYLES ---
  const styles = {
    page: { backgroundColor: theme.bg, minHeight: "100vh", fontFamily: "'Inter', sans-serif", color: theme.textMain, transition: '0.3s' },
    
    // Navbar
    navbar: { 
        backgroundColor: theme.glass, backdropFilter: "blur(12px)", height: "65px", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 30px", 
        position: "sticky", top: 0, zIndex: 1000, borderBottom: `1px solid ${theme.border}` 
    },
    logoText: { fontSize: "26px", fontWeight: "800", background: `linear-gradient(45deg, ${theme.primary}, #FF8C00)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", cursor: 'pointer', letterSpacing: '-1px' },
    searchBar: { padding: '10px 20px', borderRadius: '30px', border: 'none', backgroundColor: isDarkMode ? '#27272a' : '#f0f2f5', width: '350px', outline: 'none', color: theme.textMain, fontSize: '14px', transition: '0.2s' },
    
    // Layout
    container: { display: "flex", justifyContent: "center", paddingTop: "20px", gap: "30px", maxWidth: "1250px", margin: "0 auto" },
    
    // Sidebar (Glassy & Sticky)
    leftSidebar: { width: "260px", position: "sticky", top: "90px", height: "fit-content", display: window.innerWidth < 900 ? 'none' : 'block' },
    menuCard: { backgroundColor: theme.card, borderRadius: "16px", padding: "15px", boxShadow: theme.shadow, border: `1px solid ${theme.border}` },
    menuItem: { padding: "14px 18px", cursor: "pointer", borderRadius: "12px", display: "flex", alignItems: "center", gap: "15px", fontSize: "16px", fontWeight: "600", color: theme.textLight, transition: "all 0.2s ease", marginBottom: '5px' },
    menuItemActive: { backgroundColor: theme.primary, color: '#fff', transform: 'scale(1.02)', boxShadow: '0 4px 15px rgba(225, 48, 108, 0.3)' },

    // Feed Area
    feed: { width: "100%", maxWidth: "620px", display: "flex", flexDirection: "column", gap: "25px", paddingBottom: "100px" },
    
    // Stories Bar (NEW!)
    storiesContainer: { display: 'flex', gap: '15px', padding: '15px 0', overflowX: 'auto', scrollbarWidth: 'none' },
    storyCircle: { width: '65px', height: '65px', borderRadius: '50%', padding: '3px', background: `linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)`, cursor: 'pointer', transition: 'transform 0.2s' },
    storyImg: { width: '100%', height: '100%', borderRadius: '50%', border: `3px solid ${theme.card}`, objectFit: 'cover' },

    // Create Post (Minimalist)
    createBox: { backgroundColor: theme.card, borderRadius: "16px", padding: "20px", boxShadow: theme.shadow, border: `1px solid ${theme.border}` },
    createInput: { width: '100%', padding: "15px", borderRadius: "12px", border: "none", backgroundColor: isDarkMode ? '#27272a' : '#f0f2f5', outline: "none", fontSize: "16px", color: theme.textMain, marginBottom: '15px' },
    postBtn: { padding: "10px 25px", borderRadius: "25px", border: "none", backgroundColor: theme.primary, color: "#fff", fontWeight: "bold", cursor: "pointer", boxShadow: '0 4px 12px rgba(225, 48, 108, 0.4)', transition: '0.2s' },

    // Post Card (Immersive)
    postCard: { backgroundColor: theme.card, borderRadius: "20px", boxShadow: theme.shadow, border: `1px solid ${theme.border}`, overflow: "hidden", position: 'relative' },
    postHeader: { padding: "15px", display: "flex", alignItems: "center", justifyContent: "space-between" },
    postImg: { width: "100%", display: "block", maxHeight: "650px", objectFit: "cover" },
    actionRow: { padding: "12px 15px", display: "flex", gap: "25px" },
    iconBtn: { cursor: "pointer", fontSize: "24px", transition: "transform 0.1s", color: theme.textMain },
    
    // Right Sidebar
    rightSidebar: { width: "300px", position: "sticky", top: "90px", height: "fit-content", display: window.innerWidth < 1100 ? 'none' : 'block' },
    trendCard: { backgroundColor: theme.card, borderRadius: "16px", padding: "20px", boxShadow: theme.shadow, border: `1px solid ${theme.border}` },
  };

  return (
    <div style={styles.page}>
      
      {/* 1. GLASS NAVBAR */}
      <div style={styles.navbar}>
        <div style={{display: 'flex', alignItems: 'center', gap: '10px'}} onClick={() => setView('feed')}>
           <img src="/collylogo.png" alt="logo" style={{width: '32px', height: '32px'}} />
           <span style={styles.logoText}>Colly.</span>
        </div>
        
        <input 
            placeholder="Search for inspiration..." 
            style={styles.searchBar} 
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && setView('search')}
        />

        <div style={{display: 'flex', gap: '20px', alignItems: 'center'}}>
            <button onClick={() => setIsDarkMode(!isDarkMode)} style={{background:'none', border:'none', fontSize:'22px', cursor:'pointer'}}>{isDarkMode ? '🌙' : '☀️'}</button>
            <img src={user?.profilePic || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} style={{width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer', objectFit: 'cover', border: `2px solid ${theme.primary}`}} onClick={() => setView('profile')} alt="profile" />
        </div>
      </div>

      <div style={styles.container}>
        
        {/* 2. MODERN LEFT SIDEBAR */}
        <div style={styles.leftSidebar}>
           <div style={styles.menuCard}>
               {[
                 {id: 'feed', icon: '🏠', label: 'Home'},
                 {id: 'search', icon: '🔍', label: 'Explore'},
                 {id: 'messages', icon: '⚡', label: 'Messages'},
                 {id: 'notifications', icon: '❤️', label: 'Activity'},
                 {id: 'saved', icon: '🔖', label: 'Saved'},
                 {id: 'settings', icon: '⚙️', label: 'Settings'},
                 {id: 'profile', icon: '👤', label: 'Profile'}
               ].map(item => (
                   <div 
                      key={item.id} 
                      onClick={() => setView(item.id)} 
                      style={view === item.id ? {...styles.menuItem, ...styles.menuItemActive} : styles.menuItem}
                      onMouseEnter={(e) => {
                          if(view !== item.id) e.currentTarget.style.backgroundColor = isDarkMode ? '#27272a' : '#f0f2f5';
                      }}
                      onMouseLeave={(e) => {
                          if(view !== item.id) e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                   >
                       <span style={{fontSize: '20px'}}>{item.icon}</span>
                       {item.label}
                   </div>
               ))}
               <div style={{...styles.menuItem, marginTop: '10px', color: '#ef4444'}} onClick={onLogout}>
                  <span style={{fontSize: '20px'}}>🚪</span> Logout
               </div>
           </div>
        </div>

        {/* 3. CENTER FEED (The Addiction Zone) */}
        <div style={styles.feed}>
            
            {view === 'feed' && (
              <>
                {/* STORIES SECTION (Fake Data for Visuals) */}
                <div style={styles.storiesContainer}>
                   <div style={{display:'flex', flexDirection:'column', alignItems:'center', gap:'5px'}}>
                      <div style={{...styles.storyCircle, background: 'none', border: `2px dashed ${theme.primary}`, padding: '2px'}}>
                        <img src={user?.profilePic} style={{...styles.storyImg, border: 'none'}} alt="" />
                      </div>
                      <span style={{fontSize:'11px', fontWeight:'600'}}>You</span>
                   </div>
                   {[1,2,3,4,5].map(i => (
                     <div key={i} style={{display:'flex', flexDirection:'column', alignItems:'center', gap:'5px'}}>
                        <div style={styles.storyCircle}>
                          <img src={`https://loremflickr.com/100/100/person?random=${i}`} style={styles.storyImg} alt="" />
                        </div>
                        <span style={{fontSize:'11px', color: theme.textLight}}>User {i}</span>
                     </div>
                   ))}
                </div>

                {/* CREATE POST */}
                <div style={styles.createBox}>
                    <div style={{display:'flex', gap:'15px'}}>
                       <img src={user?.profilePic} style={{width:'45px', height:'45px', borderRadius:'50%', objectFit:'cover'}} alt=""/>
                       <input 
                         placeholder="What's sparking joy today?" 
                         style={styles.createInput} 
                         value={postText}
                         onChange={(e) => setPostText(e.target.value)}
                       />
                    </div>
                    <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", paddingLeft: '60px'}}>
                        <label style={{cursor: "pointer", color: theme.primary, fontWeight: "600", display:'flex', alignItems:'center', gap:'8px'}}>
                            <input type="file" onChange={(e) => setSelectedFile(e.target.files[0])} style={{display: 'none'}} />
                            📷 Photo/Video
                        </label>
                        <button onClick={handleUpload} style={styles.postBtn}>Post</button>
                    </div>
                </div>

                {/* POSTS FEED */}
                {posts.map(post => (
                  <div key={post._id} style={styles.postCard}>
                      <div style={styles.postHeader}>
                          <div style={{display: "flex", alignItems: "center", gap: "12px"}}>
                              <img src={post.owner?.profilePic || "https://loremflickr.com/100/100/people?random=1"} style={{width:'42px', height:'42px', borderRadius:'50%', objectFit:'cover'}} alt="" />
                              <div>
                                  <h4 style={{margin: 0, fontSize: '15px', color: theme.textMain}}>{post.owner?.username || 'user'}</h4>
                                  <p style={{margin: 0, fontSize: '12px', color: theme.textLight}}>Just now • India</p>
                              </div>
                          </div>
                          <span onClick={() => handleDelete(post)} style={{cursor: 'pointer', color: theme.textLight}}>•••</span>
                      </div>
                      
                      <img src={post.img} style={styles.postImg} alt="Post" onDoubleClick={() => handleLike(post._id)} />
                      
                      <div style={styles.actionRow}>
                          <span onClick={() => handleLike(post._id)} style={{...styles.iconBtn, color: likedPosts.includes(post._id) ? '#E1306C' : theme.textMain}}>
                              {likedPosts.includes(post._id) ? '❤️' : '🤍'}
                          </span>
                          <span onClick={() => handleComment(post._id)} style={styles.iconBtn}>💬</span>
                          <span onClick={() => handleShare(post)} style={styles.iconBtn}>🚀</span>
                          <span onClick={() => handleSave(post)} style={{...styles.iconBtn, marginLeft: 'auto', color: savedPosts.find(p => p._id === post._id) ? theme.primary : theme.textMain}}>
                              {savedPosts.find(p => p._id === post._id) ? '🔖' : '💾'}
                          </span>
                      </div>
                      
                      <div style={{padding: "0 15px 15px"}}>
                          <p style={{margin: '0 0 8px 0', fontSize: '14px', fontWeight: 'bold'}}>{post.likes || 0} likes</p>
                          <p style={{margin: 0, fontSize: '14px', lineHeight: '1.5'}}>
                              <strong style={{marginRight: '8px'}}>{post.owner?.username}</strong> 
                              {post.title}
                          </p>
                      </div>
                  </div>
                ))}
              </>
            )}

            {/* RENDER OTHER VIEWS (Profile, Settings etc) INSIDE FEED AREA FOR MOBILE OR CENTER LAYOUT */}
            {view === 'saved' && (
                <div>
                   <h2 style={{margin:'20px 0'}}>Your Collection</h2>
                   {savedPosts.length === 0 ? <p>Nothing saved yet.</p> : savedPosts.map(post => (
                       <div key={post._id} style={{...styles.postCard, marginBottom:'20px'}}>
                           <img src={post.img} style={{width:'100%', height:'200px', objectFit:'cover'}} alt=""/>
                           <div style={{padding:'15px'}}>{post.title}</div>
                       </div>
                   ))}
                </div>
            )}

            {view === 'profile' && <Profile darkMode={isDarkMode} />}
            {view === 'settings' && <Settings onLogout={onLogout} darkMode={isDarkMode} />}
            {view === 'messages' && <Messages darkMode={isDarkMode}/>}
            {view === 'notifications' && <Notifications />}
            {view === 'search' && <Search query={searchText} />}

        </div>

        {/* 4. RIGHT SIDEBAR (Trending) */}
        <div style={styles.rightSidebar}>
            <div style={styles.trendCard}>
                <h4 style={{margin:'0 0 15px 0', color: theme.textLight, fontSize:'13px', letterSpacing:'1px'}}>TRENDING IN INDIA</h4>
                {[
                  {title: '#MahaKumbh2025', posts: '2.5M Posts', img: 'https://loremflickr.com/100/100/kumbh'},
                  {title: '#IndianCricket', posts: '1.2M Posts', img: 'https://loremflickr.com/100/100/cricket'},
                  {title: '#TechIndia', posts: '890K Posts', img: 'https://loremflickr.com/100/100/bangalore'}
                ].map((trend, i) => (
                   <div key={i} style={{display:'flex', alignItems:'center', gap:'12px', marginBottom:'20px', cursor:'pointer'}}>
                       <img src={trend.img} style={{width:'45px', height:'45px', borderRadius:'10px', objectFit:'cover'}} alt=""/>
                       <div>
                           <div style={{fontWeight:'bold', fontSize:'14px'}}>{trend.title}</div>
                           <div style={{fontSize:'12px', color: theme.textLight}}>{trend.posts}</div>
                       </div>
                   </div>
                ))}
                <div style={{color: theme.primary, fontSize:'13px', cursor:'pointer', fontWeight:'bold'}}>Show more</div>
            </div>
            
            <div style={{marginTop: '20px', textAlign:'center', fontSize:'12px', color: theme.textLight}}>
                © 2026 Colly • Made with ❤️ in India
            </div>
        </div>

      </div>

      {/* DEVELOPER NOTE BUTTON (Same as before) */}
      <div style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: 9999 }}>
          <button onClick={() => setShowNoteBox(!showNoteBox)} style={{width: '50px', height: '50px', borderRadius: '50%', background: '#222', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '20px'}}>📝</button>
          {showNoteBox && (
              <textarea value={devNotes} onChange={handleNoteChange} style={{position:'absolute', bottom:'60px', right:'0', width:'250px', height:'200px', padding:'10px'}} />
          )}
      </div>

    </div>
  );
};

export default Home;