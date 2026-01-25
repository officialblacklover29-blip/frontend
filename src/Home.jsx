import React, { useState, useEffect, useContext, useRef } from 'react'; 
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
  
  // --- STATES ---
  const [view, setView] = useState('feed'); 
  const [posts, setPosts] = useState([]); 
  const [likedPosts, setLikedPosts] = useState([]); 
  const [savedPosts, setSavedPosts] = useState([]); 
  const [postText, setPostText] = useState(""); 
  
  // Dev Notes
  const [devNotes, setDevNotes] = useState("");
  const [showNoteBox, setShowNoteBox] = useState(false);

  // Search & Theme
  const [searchText, setSearchText] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Premium Features
  const [activeChatUser, setActiveChatUser] = useState(null); 
  const [isChatOpen, setIsChatOpen] = useState(false); 
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]); 
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  
  const socket = useRef(); 

  // Editor
  const [editorFile, setEditorFile] = useState(null); 
  const [editorPreview, setEditorPreview] = useState(null);
  const [editFilters, setEditFilters] = useState({ brightness: 100, contrast: 100, saturation: 100, sepia: 0 });
  const [activeFilterTab, setActiveFilterTab] = useState('adjust');

  // --- 🎨 ROYAL THEME ---
  const theme = isDarkMode ? {
    bg: "#121212",            
    card: "#1E1E1E",          
    primary: "#A18167",       
    textMain: "#E4E6EB",      
    textLight: "#B0B3B8",     
    border: "#333333",        
    shadow: "0 4px 20px rgba(0,0,0,0.5)",
    inputBg: "#2C2C2C",
    goldGradient: "linear-gradient(135deg, #A18167 0%, #8B6F58 100%)"
  } : {
    bg: "#F9F7F2",            
    card: "#FFFFFF",          
    primary: "#A18167",       
    textMain: "#331b03",      
    textLight: "#8C8681",     
    border: "#E8E4DC",        
    shadow: "0 2px 10px rgba(161, 129, 103, 0.1)", // Softer shadow
    inputBg: "#F5F3EF",
    goldGradient: "linear-gradient(135deg, #A18167 0%, #Cebb9e 100%)"
  };

  const collyEmojis = ["🦁", "🏺", "🍂", "✨", "🧘", "🪔", "🤝", "🔱", "🚩", "🇮🇳"];

  useEffect(() => {
    fetchPosts();
    const localSaved = JSON.parse(localStorage.getItem('colly_saved')) || [];
    setSavedPosts(localSaved);
    const savedNotes = localStorage.getItem("colly_dev_notes");
    if (savedNotes) setDevNotes(savedNotes);

    // SOCKET LOGIC HERE
  }, [view]); 

  const handleNoteChange = (e) => {
    setDevNotes(e.target.value);
    localStorage.setItem("colly_dev_notes", e.target.value);
  };

  const fetchPosts = async () => {
    try {
      const currentUserId = localStorage.getItem('userId');
      if (!currentUserId) return;
      const response = await axios.get(`https://backend-colly.onrender.com/api/posts/${currentUserId}`);
      setPosts(response.data); 
    } catch (err) { console.error("Fetch Error:", err); }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
        setEditorFile(file);
        setEditorPreview(URL.createObjectURL(file));
        setView('create'); 
    }
  };

  const handleUpload = async () => {
    const currentUserId = localStorage.getItem('userId');
    if (!editorFile) return alert("Select a photo!");
    
    alert("Publishing... 🚀");
    const data = new FormData();
    data.append('photo', editorFile); 
    data.append('userId', currentUserId); 
    data.append('title', postText || "Colly Moment ✨"); 

    try {
      const res = await axios.post('https://backend-colly.onrender.com/api/upload', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.success) {
        setPosts([res.data.post, ...posts]);
        setEditorFile(null); 
        setPostText("");
        setView('feed'); 
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
    if (!commentText) return;
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
      alert("Removed ❌");
    } else {
      currentSaved.push(post);
      alert("Saved 🔖");
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

  const handleSendMessage = (e) => {
      e.preventDefault();
      if(!chatMessage.trim()) return;
      const newMsg = { sender: 'me', text: chatMessage, time: Date.now() };
      setChatHistory([...chatHistory, newMsg]); 
      setChatMessage("");
  };

  // --- 🔥 STYLES (UPDATED WITH SYMMETRY FIXES) ---
  const styles = {
    page: { backgroundColor: theme.bg, minHeight: "100vh", fontFamily: "'Verdana', sans-serif", color: theme.textMain },
    
    // Navbar
    navbar: { backgroundColor: theme.card, height: "65px", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 40px", position: "sticky", top: 0, zIndex: 100, boxShadow: theme.shadow, borderBottom: `1px solid ${theme.border}` },
    logoText: { fontSize: "26px", fontWeight: "bold", color: theme.primary, fontFamily: "'Playfair Display', serif", letterSpacing: "1px" },
    
    // ✅ FIX 5: PREMIUM INPUTS
    searchBar: { padding: '12px 20px', borderRadius: '14px', border: `1px solid ${theme.border}`, backgroundColor: theme.inputBg, width: '300px', outline: 'none', color: theme.textMain, fontSize: '14px', transition: '0.2s' },
    
    // Layout
    container: { display: "flex", justifyContent: "center", paddingTop: "30px", gap: "40px", maxWidth: "1280px", margin: "0 auto", paddingBottom: "50px" },
    
    // Sidebar (Responsive Fix)
    leftSidebar: { width: "260px", position: "sticky", top: "95px", height: "fit-content", display: window.innerWidth < 900 ? 'none' : 'block' },
    menuCard: { backgroundColor: theme.card, borderRadius: "16px", padding: "15px", boxShadow: theme.shadow },
    menuItem: { padding: "14px 18px", cursor: "pointer", borderRadius: "12px", display: "flex", alignItems: "center", gap: "15px", fontSize: "15px", fontWeight: "500", color: theme.textMain, transition: "0.2s" },
    activeItem: { backgroundColor: theme.bg, color: theme.primary, fontWeight: 'bold' },

    // Create Button
    createBtn: { width: '100%', padding: '14px', marginTop: '15px', borderRadius: '14px', border: 'none', background: theme.goldGradient, color: 'white', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', boxShadow: '0 4px 15px rgba(161, 129, 103, 0.4)' },

    // ✅ FIX 1: FEED WIDTH + CENTERING
    feed: { width: "100%", maxWidth: "620px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "28px" },
    
    // ✅ FIX 2: POST CARD SYMMETRY
    postCard: { backgroundColor: theme.card, borderRadius: "18px", boxShadow: theme.shadow, border: `1px solid ${theme.border}`, overflow: "hidden", display: "flex", flexDirection: "column" },
    
    // ✅ FIX 4: POST HEADER ALIGNMENT
    postHeader: { padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${theme.border}` },
    
    // ✅ FIX 3: IMAGE OVERFLOW FIX
    postImg: { width: "100%", maxHeight: "520px", objectFit: "cover", backgroundColor: "#000", display: 'block' },
    
    // ✅ FIX 6: ACTION ICONS
    postActions: { padding: "12px 16px", display: "flex", alignItems: "center", gap: "18px", borderTop: `1px solid ${theme.border}` },
    
    // Editor
    editorContainer: { backgroundColor: theme.card, borderRadius: "18px", padding: "20px", boxShadow: theme.shadow, border: `1px solid ${theme.primary}` },
    previewImg: { width: '100%', maxHeight: '500px', objectFit: 'contain', borderRadius: '12px', filter: `brightness(${editFilters.brightness}%) contrast(${editFilters.contrast}%) saturate(${editFilters.saturation}%) sepia(${editFilters.sepia}%)` },
    controlsArea: { marginTop: '20px', padding: '20px', backgroundColor: theme.bg, borderRadius: '14px' },

    // Right Sidebar
    rightSidebar: { width: "280px", position: "sticky", top: "95px", height: "fit-content", display: window.innerWidth < 1100 ? 'none' : 'block' },
    
    // Chat Popup
    chatWindow: { position: 'fixed', bottom: 0, right: '80px', width: '340px', height: '460px', backgroundColor: theme.card, borderRadius: '15px 15px 0 0', boxShadow: "0 -5px 30px rgba(0,0,0,0.2)", display: 'flex', flexDirection: 'column', zIndex: 9999, border: `1px solid ${theme.primary}`, overflow: 'hidden' },
    chatHeader: { padding: '12px 15px', background: theme.primary, color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' },
    msgBubble: { padding: '8px 14px', borderRadius: '18px', maxWidth: '75%', fontSize: '13px', lineHeight: '1.4', marginBottom: '8px' }
  };

  return (
    <div style={styles.page}>
      
      {/* 1. NAVBAR */}
      <div style={styles.navbar}>
        <div style={{display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer'}} onClick={() => setView('feed')}>
            <img src="/collylogo.png" alt="logo" style={{width: '35px', height: '35px'}} />
            <span style={styles.logoText}>COLLY</span>
        </div>
        
        <input 
            placeholder="Search Colly..." style={styles.searchBar} 
            value={searchText} onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') setView('search'); }}
        />

        <div style={{display: 'flex', gap: '20px', alignItems: 'center'}}>
            <button onClick={() => setIsDarkMode(!isDarkMode)} style={{background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer'}}>
              {isDarkMode ? '☀️' : '🌙'}
            </button>
            <button onClick={onLogout} style={{padding: '8px 20px', borderRadius: '14px', border: `1px solid ${theme.primary}`, background: 'transparent', color: theme.primary, cursor: 'pointer', fontWeight: 'bold'}}>Logout</button>
            <img 
                src={user?.profilePic || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} 
                style={{width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer', border: `2px solid ${theme.primary}`, objectFit: 'cover'}} 
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
                   <div key={item} onClick={() => setView(item)} 
                        style={view === item ? {...styles.menuItem, ...styles.activeItem} : styles.menuItem}>
                       <span>{item === 'feed' ? '🏠' : item === 'saved' ? '🔖' : item === 'messages' ? '💌' : '👤'}</span>
                       {item.charAt(0).toUpperCase() + item.slice(1)}
                   </div>
               ))}
               <label style={styles.createBtn}>
                   <input type="file" accept="image/*" onChange={handleFileSelect} style={{display:'none'}} />
                   <span>➕ Create Post</span>
               </label>
           </div>
        </div>

        {/* 3. CENTER CONTENT */}
        <div style={styles.feed}>
            
            {view === 'create' && editorFile ? (
                <div style={styles.editorContainer}>
                    <div style={{display:'flex', justifyContent:'space-between', marginBottom:'15px'}}>
                        <h3 style={{margin:0, color: theme.primary, fontFamily:"'Playfair Display', serif"}}>✨ Studio Editor</h3>
                        <button onClick={() => { setView('feed'); setEditorFile(null); }} style={{background:'transparent', border:'none', fontSize:'20px', cursor:'pointer', color: theme.textMain}}>✖</button>
                    </div>

                    <div style={{textAlign:'center', backgroundColor:'#000', borderRadius:'12px', padding:'10px'}}>
                        <img src={editorPreview} style={styles.previewImg} alt="Preview" />
                    </div>
                    
                    <input 
                       placeholder={`Caption for ${user?.username}...`}
                       style={{...styles.searchBar, width:'100%', marginTop:'15px'}}
                       value={postText} onChange={e => setPostText(e.target.value)}
                    />

                    <div style={styles.controlsArea}>
                       <div style={{display:'flex', gap:'15px', marginBottom:'20px', borderBottom:`1px solid ${theme.border}`, paddingBottom:'10px'}}>
                          <span onClick={()=>setActiveFilterTab('adjust')} style={{fontWeight:'bold', color: activeFilterTab==='adjust'?theme.primary: theme.textLight, cursor:'pointer'}}>Adjustments</span>
                          <span onClick={()=>setActiveFilterTab('filters')} style={{fontWeight:'bold', color: activeFilterTab==='filters'?theme.primary: theme.textLight, cursor:'pointer'}}>Filters</span>
                       </div>

                       {activeFilterTab === 'adjust' ? (
                           <div style={{display:'flex', flexDirection:'column', gap:'15px'}}>
                              <label style={{color: theme.textMain}}>Brightness</label>
                              <input type="range" min="50" max="150" value={editFilters.brightness} onChange={(e)=>setEditFilters({...editFilters, brightness: e.target.value})} style={{accentColor: theme.primary}} />
                              
                              <label style={{color: theme.textMain}}>Contrast</label>
                              <input type="range" min="50" max="150" value={editFilters.contrast} onChange={(e)=>setEditFilters({...editFilters, contrast: e.target.value})} style={{accentColor: theme.primary}} />
                           </div>
                       ) : (
                           <div style={{display:'flex', gap:'10px', overflowX:'auto'}}>
                              {['Original','Vintage','B&W','Warm', 'Sepia'].map(f => (
                                  <button key={f} onClick={()=>{
                                      if(f==='Vintage') setEditFilters({...editFilters, sepia:40, contrast: 110});
                                      if(f==='B&W') setEditFilters({...editFilters, saturation:0});
                                      if(f==='Warm') setEditFilters({...editFilters, sepia:20, brightness: 105});
                                      if(f==='Sepia') setEditFilters({...editFilters, sepia:100});
                                      if(f==='Original') setEditFilters({brightness:100, contrast:100, saturation:100, sepia:0});
                                  }} style={{padding:'8px 15px', border:`1px solid ${theme.primary}`, borderRadius:'20px', background: theme.bg, color: theme.textMain, cursor:'pointer'}}>{f}</button>
                              ))}
                           </div>
                       )}
                       
                       <button onClick={handleUpload} style={{...styles.createBtn, marginTop:'20px'}}>Publish Moment 🚀</button>
                    </div>
                </div>

            ) : view === 'profile' ? ( <Profile darkMode={isDarkMode} />
            ) : view === 'settings' ? ( <Settings onLogout={onLogout} darkMode={isDarkMode} />
            ) : view === 'messages' ? ( <Messages darkMode={isDarkMode} />
            ) : view === 'notifications' ? ( <Notifications />
            ) : view === 'search' ? ( <Search query={searchText} />
            ) : view === 'saved' ? (
                <div>
                    <h3 style={{color: theme.primary, padding: '10px'}}>My Collections 🔖</h3>
                    {savedPosts.length === 0 ? <p style={{padding:'10px'}}>Empty.</p> : savedPosts.map(p => (
                        <div key={p._id} style={{...styles.postCard, marginBottom: '15px', padding:'10px', display:'flex', gap:'15px'}}>
                             <img src={p.img} style={{width:'80px', height:'80px', borderRadius:'12px', objectFit:'cover'}} alt=""/>
                             <div><p style={{fontWeight:'bold'}}>{p.title}</p><button onClick={()=>handleSave(p)} style={{color:'red', background:'none', border:'none', cursor:'pointer'}}>Remove</button></div>
                        </div>
                    ))}
                </div>

            ) : (
                /* --- FEED VIEW --- */
                <>
                  {posts.map(post => (
                    <div key={post._id} style={styles.postCard}>
                        {/* Header */}
                        <div style={styles.postHeader}>
                            <div style={{display: "flex", alignItems: "center", gap: "12px"}}>
                                <img src={post.owner?.profilePic || "https://loremflickr.com/100/100/people?random=1"} style={{width:'44px', height:'44px', borderRadius:'50%', objectFit:'cover'}} alt="" />
                                <div>
                                    <h4 style={{margin: 0, fontSize: '15px', color: theme.textMain}}>{post.owner?.username || 'user'}</h4>
                                    <p style={{margin: 0, fontSize: '12px', color: theme.textLight}}>Varanasi, India</p>
                                </div>
                            </div>
                            <span onClick={() => handleDelete(post)} style={{cursor: 'pointer', fontSize: '20px', color: theme.textMain}}>⋮</span>
                        </div>
                        
                        {/* Image */}
                        <img src={post.img} style={styles.postImg} alt="Post" onDoubleClick={() => handleLike(post._id)} />
                        
                        {/* Actions */}
                        <div style={styles.postActions}>
                            <span onClick={() => handleLike(post._id)} style={{cursor:'pointer', fontSize:'24px', color: likedPosts.includes(post._id) ? '#e0245e' : theme.textMain}}>
                                {likedPosts.includes(post._id) ? '❤️' : '🤍'}
                            </span>
                            <span onClick={() => handleComment(post._id)} style={{cursor:'pointer', fontSize:'24px'}}>💬</span>
                            <span onClick={() => handleShare(post)} style={{cursor:'pointer', fontSize:'24px'}}>🚀</span>
                            <span onClick={() => handleSave(post)} style={{cursor:'pointer', fontSize:'24px', marginLeft: 'auto', color: savedPosts.find(p => p._id === post._id) ? theme.primary : theme.textMain}}>
                                {savedPosts.find(p => p._id === post._id) ? '🔖' : '💾'}
                            </span>
                        </div>

                        <div style={{padding: "0 16px 16px"}}>
                            <p style={{margin: '0 0 8px 0', fontSize: '14px', fontWeight: 'bold'}}>{post.likes || 0} likes</p>
                            <p style={{margin: 0, fontSize: '14px', lineHeight: '1.5'}}>
                                <strong style={{marginRight: '8px'}}>{post.owner?.username || 'user'}</strong> 
                                {post.title}
                            </p>
                        </div>
                    </div>
                  ))}
                </>
            )}
        </div>

        {/* 4. RIGHT SIDEBAR */}
        <div style={styles.rightSidebar}>
            <div style={styles.menuCard}>
                <p style={{fontSize: "13px", fontWeight: "bold", color: theme.textLight, marginBottom: "15px", textTransform: "uppercase"}}>Connections</p>
                {[1,2,3,4].map(i => (
                    <div key={i} onClick={() => { setIsChatOpen(true); setActiveChatUser({username: `Friend ${i}`, img: `https://loremflickr.com/100/100/people?random=${i}`}) }} 
                         style={{display: "flex", alignItems: "center", gap: "12px", marginBottom: "15px", cursor: "pointer"}}>
                        <div style={{position:'relative'}}>
                           <img src={`https://loremflickr.com/100/100/people?random=${i}`} style={{width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover'}} alt="" />
                           <div style={{width:'10px', height:'10px', background:'#31A24C', borderRadius:'50%', position:'absolute', bottom:0, right:0, border:'2px solid white'}}></div>
                        </div>
                        <p style={{margin: 0, fontSize: '14px', fontWeight: 'bold'}}>Friend {i}</p>
                    </div>
                ))}
            </div>
            
            <div style={{marginTop: '20px', fontSize: '11px', color: theme.textLight, textAlign: 'center'}}>
                © 2026 Colly • Incredible India 🇮🇳
            </div>
        </div>

      </div>
      
      {/* CHAT POPUP */}
      {isChatOpen && activeChatUser && (
          <div style={styles.chatWindow}>
              <div style={styles.chatHeader} onClick={() => setIsChatOpen(false)}>
                  <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                      <img src={activeChatUser.img} style={{width:'32px', height:'32px', borderRadius:'50%', border:'1px solid white'}} alt=""/>
                      <span style={{fontWeight:'bold', fontSize:'14px'}}>{activeChatUser.username}</span>
                  </div>
                  <span style={{fontSize:'12px'}}>▼</span>
              </div>
              
              <div style={{flex:1, padding:'15px', backgroundColor: theme.bg, overflowY:'auto'}}>
                  <div style={{textAlign:'center', fontSize:'11px', color: theme.textLight, marginBottom:'10px'}}>Today</div>
                  {chatHistory.map((msg, idx) => (
                      <div key={idx} style={{display:'flex', justifyContent: msg.sender==='me'?'flex-end':'flex-start'}}>
                          <div style={{
                              ...styles.msgBubble, 
                              background: msg.sender==='me' ? theme.primary : theme.card,
                              color: msg.sender==='me' ? 'white' : theme.textMain,
                              border: msg.sender!=='me' ? `1px solid ${theme.border}` : 'none'
                          }}>
                              {msg.text}
                          </div>
                      </div>
                  ))}
              </div>

              <form onSubmit={handleSendMessage} style={{padding:'10px', background: theme.card, borderTop:`1px solid ${theme.border}`, display:'flex', gap:'10px', alignItems:'center'}}>
                  <span onClick={()=>setShowEmojiPicker(!showEmojiPicker)} style={{cursor:'pointer', fontSize:'20px'}}>😊</span>
                  <input 
                     placeholder="Type a message..." 
                     style={{flex:1, border:'none', outline:'none', background:'transparent', color: theme.textMain}} 
                     value={chatMessage} 
                     onChange={e=>setChatMessage(e.target.value)} 
                  />
                  <button type="submit" style={{border:'none', background:'transparent', color:theme.primary, fontWeight:'bold', cursor:'pointer'}}>Send</button>
              </form>
              
              {showEmojiPicker && (
                  <div style={{background: theme.bg, padding:'8px', display:'flex', gap:'8px', overflowX:'auto', borderTop:`1px solid ${theme.border}`}}>
                      {collyEmojis.map(e=><span key={e} onClick={()=>setChatMessage(p=>p+e)} style={{fontSize:'22px', cursor:'pointer'}}>{e}</span>)}
                  </div>
              )}
          </div>
      )}

      {/* Dev Notes */}
      <div style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: 999 }}>
          <button onClick={() => setShowNoteBox(!showNoteBox)} style={{width: '50px', height: '50px', borderRadius: '50%', background: theme.primary, color: 'white', border: 'none', cursor: 'pointer', fontSize: '24px', boxShadow:theme.shadow}}>📝</button>
          {showNoteBox && (
              <textarea value={devNotes} onChange={handleNoteChange} style={{position:'absolute', bottom:'60px', right:'0', width:'250px', height:'200px', padding:'10px', borderRadius:'10px', background:theme.card, color:theme.textMain}} />
          )}
      </div>

    </div>
  );
};

export default Home;