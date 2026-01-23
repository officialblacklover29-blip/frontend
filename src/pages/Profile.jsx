import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Profile = ({ darkMode }) => {
  // --- STATES ---
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("posts");
  
  const [user, setUser] = useState({
    full_name: 'Loading...',
    username: '',
    bio: '',
    profilePic: '',
    posts: 0, fans: 0, circle: 0
  });

  const [myPosts, setMyPosts] = useState([]); // ✅ NEW: State for User's Posts
  const [formData, setFormData] = useState({ username: '', full_name: '', bio: '', file: null });

  // --- 🎨 COLLY THEME FIXED (Dark Mode Font Fix) ---
  const theme = {
    primary: "#A18167", 
    bg: darkMode ? "#121212" : "#F2F0EA",
    card: darkMode ? "#1E1E1E" : "#FFFFFF",
    // ✅ FIX: Text color ab White hoga Dark Mode mein
    textMain: darkMode ? "#FFFFFF" : "#331b03", 
    textLight: "#606770",
    border: darkMode ? '#333' : '#e4e6eb',
    shadow: "0 4px 20px rgba(0,0,0,0.05)"
  };

  // --- LOGIC: FETCH DATA & POSTS ---
  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    const storedUserId = localStorage.getItem('userId'); // ✅ UserId chahiye posts ke liye

    if (!storedUsername) return;

    // 1. Fetch User Info
    axios.get(`https://colly-1-iw6c.onrender.com/api/user/${storedUsername}`)
      .then(res => {
        setUser(res.data);
        setFormData({ 
          username: res.data.username || '', 
          full_name: res.data.full_name || '', 
          bio: res.data.bio || '', 
          file: null 
        });
      })
      .catch(err => console.error("Profile Fetch Error:", err));

    // 2. ✅ Fetch User's Own Posts
    if (storedUserId) {
      axios.get(`https://colly-1-iw6c.onrender.com/api/posts/${storedUserId}`)
        .then(res => {
            // Filter posts specific to this user if API returns all feed
            // Assuming API returns user-specific posts or we filter manually:
            const userPosts = res.data.filter(post => post.owner._id === storedUserId || post.owner === storedUserId);
            setMyPosts(userPosts);
        })
        .catch(err => console.error("My Posts Fetch Error:", err));
    }

  }, []);

  // --- LOGIC: UPDATE PROFILE ---
  const handleUpdate = async () => {
    const oldUsername = localStorage.getItem('username');
    if (!oldUsername) return alert("Session error!");

    const data = new FormData();
    data.append('currentUsername', oldUsername);
    data.append('newUsername', formData.username);
    data.append('full_name', formData.full_name);
    data.append('bio', formData.bio);

    if (formData.file) {
      data.append('profilePic', formData.file);
    }

    try {
      const res = await axios.put('https://colly-1-iw6c.onrender.com/api/user/profile', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.success) {
        localStorage.setItem('username', res.data.user.username);
        setUser(res.data.user);
        setIsEditing(false);
        alert("Profile Updated Successfully! ✨");
      }
    } catch (err) {
      alert(err.response?.data?.error || "Update failed!");
    }
  };

  // --- HIGHLIGHTS (Static) ---
  const highlights = [
    { id: 1, title: "Travel ✈️", img: "https://loremflickr.com/100/100/himalaya" },
    { id: 2, title: "Food 🥘", img: "https://loremflickr.com/100/100/indian,food" },
    { id: 3, title: "Friends 👯‍♂️", img: "https://loremflickr.com/100/100/friends" },
    { id: 4, title: "Vibe ✨", img: "https://loremflickr.com/100/100/concert" },
  ];

  // --- STYLES ---
  const styles = {
    container: { maxWidth: "900px", margin: "0 auto", padding: "30px 20px", fontFamily: "'Verdana', sans-serif", color: theme.textMain },
    
    // Header
    header: { display: "flex", flexDirection: "row", gap: "40px", alignItems: "start", marginBottom: "40px", paddingBottom: "30px", borderBottom: `1px solid ${theme.border}` },
    profilePicContainer: { flex: "0 0 150px", display: "flex", justifyContent: "center" },
    profilePic: { width: "150px", height: "150px", borderRadius: "50%", objectFit: "cover", border: `4px solid ${theme.primary}`, padding: "4px" },
    
    // Info Section
    infoSection: { flex: 1, marginTop: "10px" },
    topRow: { display: "flex", alignItems: "center", gap: "20px", marginBottom: "20px", flexWrap: "wrap" },
    username: { fontSize: "28px", fontWeight: "300", margin: 0, fontFamily: "'Playfair Display', serif", color: theme.textMain },
    
    // Buttons
    editBtn: { padding: "8px 20px", borderRadius: "8px", border: `1px solid ${theme.border}`, backgroundColor: "transparent", color: theme.textMain, fontWeight: "600", cursor: "pointer", fontSize: "14px", transition: "0.2s" },
    saveBtn: { padding: "8px 20px", borderRadius: "8px", border: "none", backgroundColor: theme.primary, color: "#fff", fontWeight: "bold", cursor: "pointer", fontSize: "14px" },
    cancelBtn: { padding: "8px 20px", borderRadius: "8px", border: "none", backgroundColor: theme.bg, color: theme.textLight, fontWeight: "bold", cursor: "pointer", fontSize: "14px" },

    // Stats
    statsRow: { display: "flex", gap: "40px", marginBottom: "20px", fontSize: "16px", color: theme.textMain },
    statNumber: { fontWeight: "bold", fontSize: "18px", color: theme.textMain },

    // Bio
    bioSection: { fontSize: "15px", lineHeight: "1.6", maxWidth: "500px", color: theme.textMain },
    fullName: { fontWeight: "bold", display: "block", marginBottom: "4px", fontSize: "16px", color: theme.textMain },

    // Inputs (Edit Mode)
    input: { width: "100%", padding: "10px 15px", margin: "8px 0", borderRadius: "10px", border: `1px solid ${theme.border}`, backgroundColor: theme.bg, fontSize: "14px", outline: "none", color: theme.textMain },
    
    // Highlights
    highlightsContainer: { display: "flex", gap: "30px", marginBottom: "50px", overflowX: "auto", paddingBottom: "10px" },
    highlightItem: { display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", cursor: "pointer" },
    highlightCircle: { width: "75px", height: "75px", borderRadius: "50%", border: `2px solid ${theme.border}`, padding: "3px", objectFit: "cover" },
    highlightTitle: { fontSize: "12px", fontWeight: "600", color: theme.textMain },

    // Tabs
    tabs: { display: "flex", justifyContent: "center", gap: "60px", borderTop: `1px solid ${theme.border}`, marginBottom: "20px" },
    tabItem: { padding: "18px 0", cursor: "pointer", fontSize: "12px", fontWeight: "600", letterSpacing: "1px", textTransform: "uppercase", color: theme.textLight, borderTop: "1px solid transparent", transition: "0.2s" },
    activeTab: { borderTop: `1px solid ${theme.textMain}`, color: theme.textMain },

    // Grid
    grid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "15px" },
    gridItem: { position: "relative", paddingBottom: "100%", backgroundColor: theme.card, cursor: "pointer", overflow: "hidden", borderRadius: "4px" },
    postImg: { position: "absolute", width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.3s" },
    
    emptyState: { textAlign: "center", padding: "60px 0", color: theme.textLight }
  };

  return (
    <div style={styles.container}>
      
      {/* 1. PROFILE HEADER */}
      <div style={styles.header}>
         <div style={styles.profilePicContainer}>
             <img 
               src={user.profilePic || "https://loremflickr.com/200/200/abstract"} 
               style={styles.profilePic} 
               alt="profile" 
             />
         </div>
         
         <div style={styles.infoSection}>
             {/* -- VIEW MODE -- */}
             {!isEditing ? (
               <>
                 <div style={styles.topRow}>
                     <h2 style={styles.username}>{user.username}</h2>
                     <button onClick={() => setIsEditing(true)} style={styles.editBtn}>Edit Profile</button>
                     <span style={{fontSize: "20px", cursor: "pointer"}}>⚙️</span>
                 </div>

                 <div style={styles.statsRow}>
                     {/* ✅ Updated Post Count from Real Data */}
                     <span><span style={styles.statNumber}>{myPosts.length}</span> posts</span>
                     <span><span style={styles.statNumber}>{user.fans || 0}</span> followers</span>
                     <span><span style={styles.statNumber}>{user.circle || 0}</span> following</span>
                 </div>

                 <div style={styles.bioSection}>
                     <span style={styles.fullName}>{user.full_name}</span>
                     {user.bio || "No bio yet."} <br />
                     <a href="#" style={{color: theme.primary, textDecoration: 'none', fontWeight: 'bold', fontSize: '14px'}}>www.colly.in</a>
                 </div>
               </>
             ) : (
               /* -- EDIT MODE -- */
               <div style={{maxWidth: '400px'}}>
                 <h3 style={{marginBottom: '15px', fontFamily: "'Playfair Display', serif", color: theme.textMain}}>Edit Profile</h3>
                 <input style={styles.input} type="text" value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})} placeholder="Username" />
                 <input style={styles.input} type="text" value={formData.full_name} onChange={(e) => setFormData({...formData, full_name: e.target.value})} placeholder="Full Name" />
                 <textarea style={{...styles.input, height: '80px', resize: 'none', fontFamily: 'inherit'}} value={formData.bio} onChange={(e) => setFormData({...formData, bio: e.target.value})} placeholder="Bio" />
                 
                 <div style={{marginTop: '10px', marginBottom: '20px'}}>
                    <span style={{fontSize: '12px', color: theme.textLight, display: 'block', marginBottom: '5px'}}>Change Profile Photo</span>
                    <input type="file" onChange={(e) => setFormData({...formData, file: e.target.files[0]})} style={{fontSize: '13px', color: theme.textMain}} />
                 </div>

                 <div style={{display: 'flex', gap: '10px'}}>
                    <button onClick={handleUpdate} style={styles.saveBtn}>Save Changes</button>
                    <button onClick={() => setIsEditing(false)} style={styles.cancelBtn}>Cancel</button>
                 </div>
               </div>
             )}
         </div>
      </div>

      {/* 2. HIGHLIGHTS (Incredible India Vibe) */}
      {!isEditing && (
        <div style={styles.highlightsContainer}>
          {highlights.map(h => (
              <div key={h.id} style={styles.highlightItem}>
                  <img src={h.img} style={styles.highlightCircle} alt={h.title} />
                  <span style={styles.highlightTitle}>{h.title}</span>
              </div>
          ))}
          <div style={styles.highlightItem}>
               <div style={{...styles.highlightCircle, border: `2px dashed ${theme.textLight}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', color: theme.textLight}}>+</div>
               <span style={styles.highlightTitle}>New</span>
          </div>
        </div>
      )}

      {/* 3. TABS NAVIGATION */}
      <div style={styles.tabs}>
         <span style={activeTab === 'posts' ? {...styles.tabItem, ...styles.activeTab} : styles.tabItem} onClick={() => setActiveTab('posts')}>
           📸 POSTS
         </span>
         <span style={activeTab === 'saved' ? {...styles.tabItem, ...styles.activeTab} : styles.tabItem} onClick={() => setActiveTab('saved')}>
           🔖 SAVED
         </span>
         <span style={activeTab === 'tagged' ? {...styles.tabItem, ...styles.activeTab} : styles.tabItem} onClick={() => setActiveTab('tagged')}>
           🏷️ TAGGED
         </span>
      </div>

      {/* 4. POSTS GRID (User's Real Posts) */}
      {activeTab === 'posts' && (
          <div style={styles.grid}>
             {/* ✅ Render Real Posts */}
             {myPosts.map(post => (
                 <div 
                   key={post._id} 
                   style={styles.gridItem}
                   onMouseEnter={(e) => e.currentTarget.firstChild.style.transform = 'scale(1.1)'}
                   onMouseLeave={(e) => e.currentTarget.firstChild.style.transform = 'scale(1)'}
                 >
                     <img src={post.img} style={styles.postImg} alt="post" />
                 </div>
             ))}
             {myPosts.length === 0 && (
                <div style={{gridColumn: "1 / -1", ...styles.emptyState}}>
                    <h3>No posts yet 📸</h3>
                    <p>Go to Home feed and upload your first photo!</p>
                </div>
             )}
          </div>
      )}

      {activeTab === 'saved' && (
          <div style={styles.emptyState}>
              <h3>Save your favorite memories 💾</h3>
              <p>Only you can see what you've saved.</p>
          </div>
      )}

      {activeTab === 'tagged' && (
          <div style={styles.emptyState}>
              <h3>Photos of you 🤳</h3>
              <p>When people tag you in photos, they'll appear here.</p>
          </div>
      )}

    </div>
  );
};

export default Profile;