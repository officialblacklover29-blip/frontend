import React, { useState, useEffect, useContext } from 'react'; 
import axios from 'axios';
import { UserContext } from '../context/UserContext'; 

const Settings = ({ darkMode, onLogout }) => {
  const { updateUser } = useContext(UserContext);
  const [activeTab, setActiveTab] = useState("editProfile");
  
  // --- STATES ---
  const [isPrivate, setIsPrivate] = useState(false);
  const [twoFactor, setTwoFactor] = useState(false);
  const [activityStatus, setActivityStatus] = useState(true);
  const [dataSaver, setDataSaver] = useState(false);
  const [appDarkMode, setAppDarkMode] = useState(darkMode);

  const [profileData, setProfileData] = useState({
    name: "", username: "", bio: "", website: "", email: "", phone: "", profilePic: ""
  });

  const [selectedFile, setSelectedFile] = useState(null);

  // ✅ 1. DATA FETCHING
  useEffect(() => {
    const fetchUserData = async () => {
        const username = localStorage.getItem('username');
        if (!username) return;
        try {
            const res = await axios.get(`https://backend-colly.onrender.com//api/user/${username}`);
            const user = res.data;
            setIsPrivate(user.isPrivate || false);
            setActivityStatus(user.activityStatus !== false); 
            setTwoFactor(user.twoFactorEnabled || false);
            setAppDarkMode(user.darkMode || false);
            setProfileData({
                name: user.full_name || "", username: user.username || "", bio: user.bio || "",
                email: user.email || "", website: "www.colly.in", phone: user.phone || "",
                profilePic: user.profilePic 
            });
            updateUser(user); 
        } catch (err) { console.error("Error fetching settings:", err); }
    };
    fetchUserData();
  }, []);

  // ✅ 2. SETTINGS UPDATE LOGIC
  const updateSettings = async (key, value) => {
    if (key === 'isPrivate') setIsPrivate(value);
    if (key === 'activityStatus') setActivityStatus(value);
    if (key === 'twoFactorEnabled') setTwoFactor(value);
    if (key === 'darkMode') setAppDarkMode(value);

    const userId = localStorage.getItem('userId');
    try {
        await axios.put('https://backend-colly.onrender.com//api/user/settings', { userId, [key]: value });
    } catch (err) { console.error("Save Failed"); }
  };

  // ✅ 3. PROFILE UPDATE LOGIC
  const handleSaveProfile = async () => {
      const currentUsername = localStorage.getItem('username');
      const formData = new FormData();
      formData.append('currentUsername', currentUsername);
      formData.append('full_name', profileData.name);
      formData.append('bio', profileData.bio);
      if (selectedFile) formData.append('profilePic', selectedFile);
      
      try {
          const res = await axios.put('https://backend-colly.onrender.com//api/user/profile', formData, {
              headers: { 'Content-Type': 'multipart/form-data' }
          });
          if(res.data.success) {
              alert("Profile Saved Successfully! ✅");
              updateUser(res.data.user);
              setProfileData(prev => ({...prev, profilePic: res.data.user.profilePic}));
          }
      } catch (err) { alert("Failed to save profile."); }
  };

  // --- 🎨 PREMIUM THEME ---
  const theme = {
    primary: "#A18167", 
    bg: darkMode ? "#121212" : "#F2F0EA",
    card: darkMode ? "#1E1E1E" : "#FFFFFF",
    textMain: darkMode ? "#ffffff" : "#331b03",
    textLight: "#606770",
    border: darkMode ? '#333' : '#e4e6eb',
    shadow: "0 4px 20px rgba(0,0,0,0.05)",
    danger: "#e0245e"
  };

  const menuItems = [
    { id: "editProfile", label: "Edit Profile", icon: "👤" },
    { id: "privacy", label: "Privacy & Safety", icon: "🔒" },
    { id: "security", label: "Password & Security", icon: "🛡️" },
    { id: "notifications", label: "Notifications", icon: "🔔" },
    { id: "display", label: "Display & Accessibility", icon: "👁️" },
    { id: "help", label: "Help & Support", icon: "❓" },
  ];

  // --- 🛠️ SYMMETRICAL STYLES ---
  const styles = {
    container: { maxWidth: "1150px", margin: "20px auto", minHeight: "85vh", display: "flex", backgroundColor: theme.card, borderRadius: "16px", boxShadow: theme.shadow, fontFamily: "'Verdana', sans-serif", overflow: "hidden" },
    sidebar: { width: "280px", borderRight: `1px solid ${theme.border}`, backgroundColor: darkMode ? "#181818" : "#fafafa", padding: "30px 0" },
    menuTitle: { padding: "0 25px", fontSize: "12px", fontWeight: "bold", color: theme.textLight, textTransform: "uppercase", marginBottom: "15px" },
    menuItem: { padding: "16px 25px", cursor: "pointer", display: "flex", alignItems: "center", gap: "12px", fontSize: "14px", fontWeight: "500", color: theme.textMain, transition: "0.2s", borderLeft: "4px solid transparent" },
    activeMenu: { backgroundColor: darkMode ? "#252525" : "#fff", color: theme.primary, borderLeft: `4px solid ${theme.primary}`, fontWeight: "bold" },
    content: { flex: 1, padding: "50px 70px", overflowY: "auto" },
    sectionTitle: { fontSize: "26px", fontFamily: "'Playfair Display', serif", marginBottom: "20px", color: theme.primary },
    sectionSub: { fontSize: "14px", color: theme.textLight, marginBottom: "40px", paddingBottom: "20px", borderBottom: `1px solid ${theme.border}` },
    formGroup: { marginBottom: "25px" },
    label: { display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "10px", color: theme.textMain },
    input: { width: "100%", padding: "14px 18px", borderRadius: "10px", border: `1px solid ${theme.border}`, backgroundColor: theme.bg, color: theme.textMain, outline: "none", fontSize: "15px" },
    textarea: { width: "100%", padding: "14px 18px", borderRadius: "10px", border: `1px solid ${theme.border}`, backgroundColor: theme.bg, color: theme.textMain, outline: "none", fontSize: "15px", resize: "vertical", height: "100px" },
    row: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 0", borderBottom: `1px solid ${theme.border}` },
    rowText: { fontSize: "16px", fontWeight: "500" },
    rowSub: { fontSize: "13px", color: theme.textLight, marginTop: "4px" },
    toggle: (active) => ({ width: "44px", height: "22px", borderRadius: "22px", backgroundColor: active ? theme.primary : "#ccc", position: "relative", cursor: "pointer", transition: "0.3s" }),
    toggleDot: (active) => ({ width: "18px", height: "18px", borderRadius: "50%", backgroundColor: "#fff", position: "absolute", top: "2px", left: active ? "24px" : "2px", transition: "0.3s" }),
    btnPrimary: { padding: "14px 40px", borderRadius: "30px", border: "none", backgroundColor: theme.primary, color: "#fff", fontWeight: "bold", cursor: "pointer", marginTop: "20px", fontSize: "15px" },
    btnDanger: { padding: "12px 25px", borderRadius: "8px", border: `1px solid ${theme.danger}`, backgroundColor: "transparent", color: theme.danger, fontWeight: "bold", cursor: "pointer" }
  };

  const ToggleSwitch = ({ state, settingKey }) => (
    <div style={styles.toggle(state)} onClick={() => updateSettings(settingKey, !state)}>
      <div style={styles.toggleDot(state)}></div>
    </div>
  );

  return (
    <div style={styles.container}>
      <div style={styles.sidebar}>
        <div style={styles.menuTitle}>Meta Center</div>
        {menuItems.map(item => (
          <div key={item.id} style={activeTab === item.id ? {...styles.menuItem, ...styles.activeMenu} : styles.menuItem} onClick={() => setActiveTab(item.id)}>
            <span style={{fontSize: "18px"}}>{item.icon}</span> {item.label}
          </div>
        ))}
        <div style={{...styles.menuTitle, marginTop: "30px"}}>System</div>
        <div style={{...styles.menuItem, color: theme.danger}} onClick={onLogout}><span>🚪</span> Log Out</div>
      </div>

      <div style={styles.content}>
        
        {/* --- 1. EDIT PROFILE --- */}
        {activeTab === "editProfile" && (
          <div style={{maxWidth: "800px"}}>
            <h2 style={styles.sectionTitle}>Edit Profile</h2>
            <p style={styles.sectionSub}>Update your personal information and how you appear to others.</p>
            <div style={{display: 'flex', gap: '25px', alignItems: 'center', marginBottom: '40px', padding: '20px', backgroundColor: darkMode ? '#252525' : '#f9f9f9', borderRadius: '15px'}}>
               <img src={profileData.profilePic || "https://loremflickr.com/200/200/boy"} style={{width:'90px', height:'90px', borderRadius:'50%', border: `3px solid ${theme.primary}`, objectFit: 'cover'}} alt="" />
               <div>
                 <h4 style={{margin: "0 0 5px 0", color: theme.textMain, fontSize: "18px"}}>@{profileData.username}</h4>
                 <label style={{fontSize: '14px', color: theme.primary, cursor: 'pointer', fontWeight: 'bold', display: 'block'}}>
                    Change Profile Photo
                    <input type="file" onChange={(e) => setSelectedFile(e.target.files[0])} style={{display: 'none'}} />
                 </label>
                 {selectedFile && <span style={{fontSize: '12px', color: 'green', marginTop: '5px', display: 'block'}}>✨ New Image Selected</span>}
               </div>
            </div>
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '25px'}}>
                <div style={styles.formGroup}><label style={styles.label}>Full Name</label><input style={styles.input} value={profileData.name} onChange={(e) => setProfileData({...profileData, name: e.target.value})} /></div>
                <div style={styles.formGroup}><label style={styles.label}>Username</label><input value={profileData.username} disabled style={{...styles.input, opacity: 0.6}} /></div>
            </div>
            <div style={styles.formGroup}><label style={styles.label}>Bio</label><textarea style={styles.textarea} value={profileData.bio} onChange={(e) => setProfileData({...profileData, bio: e.target.value})} /></div>
            <div style={styles.formGroup}><label style={styles.label}>Website</label><input style={styles.input} value={profileData.website} onChange={(e) => setProfileData({...profileData, website: e.target.value})} /></div>
            <button style={styles.btnPrimary} onClick={handleSaveProfile}>Save Changes</button>
          </div>
        )}

        {/* --- 2. PRIVACY --- */}
        {activeTab === "privacy" && (
          <div style={{maxWidth: "800px"}}>
            <h2 style={styles.sectionTitle}>Privacy & Safety</h2>
            <p style={styles.sectionSub}>Manage who can see your content and interactions.</p>
            <div style={styles.row}><div><div style={styles.rowText}>Private Account</div><div style={styles.rowSub}>Only approved followers can see your moments.</div></div><ToggleSwitch state={isPrivate} settingKey="isPrivate" /></div>
            <div style={styles.row}><div><div style={styles.rowText}>Activity Status</div><div style={styles.rowSub}>Show when you were last active on Colly.</div></div><ToggleSwitch state={activityStatus} settingKey="activityStatus" /></div>
          </div>
        )}

        {/* --- 3. SECURITY --- */}
        {activeTab === "security" && (
          <div style={{maxWidth: "800px"}}>
            <h2 style={styles.sectionTitle}>Security</h2>
            <p style={styles.sectionSub}>Protect your account with extra layers of security.</p>
            <div style={styles.row}><div><div style={styles.rowText}>Two-Factor Authentication</div><div style={styles.rowSub}>Secure your login with an email verification code.</div></div><ToggleSwitch state={twoFactor} settingKey="twoFactorEnabled" /></div>
            <div style={{marginTop: "30px"}}>
                <h4 style={{marginBottom: "20px", color: theme.textMain}}>Update Password</h4>
                <div style={styles.formGroup}><input type="password" style={styles.input} placeholder="Current Password" /></div>
                <div style={styles.formGroup}><input type="password" style={styles.input} placeholder="New Password" /></div>
                <button style={{...styles.btnPrimary, fontSize: "14px", padding: "12px 30px"}}>Update Password</button>
            </div>
          </div>
        )}

        {/* --- 4. NOTIFICATIONS --- */}
        {activeTab === "notifications" && (
          <div style={{maxWidth: "800px"}}>
            <h2 style={styles.sectionTitle}>Notifications</h2>
            <p style={styles.sectionSub}>Choose what updates you want to receive.</p>
            {["Likes", "Comments", "New Followers", "Direct Messages"].map(n => (
                <div key={n} style={styles.row}><div style={styles.rowText}>{n}</div><ToggleSwitch state={true} /></div>
            ))}
          </div>
        )}

        {/* --- 5. DISPLAY --- */}
        {activeTab === "display" && (
          <div style={{maxWidth: "800px"}}>
            <h2 style={styles.sectionTitle}>Display</h2>
            <p style={styles.sectionSub}>Customize how Colly looks on your device.</p>
            <div style={styles.row}><div><div style={styles.rowText}>Dark Mode</div><div style={styles.rowSub}>Switch between light and dark themes.</div></div><ToggleSwitch state={appDarkMode} settingKey="darkMode" /></div>
            <div style={styles.row}><div><div style={styles.rowText}>Data Saver</div><div style={styles.rowSub}>Lower image quality to save cellular data.</div></div><div style={styles.toggle(dataSaver)} onClick={() => setDataSaver(!dataSaver)}><div style={styles.toggleDot(dataSaver)}></div></div></div>
          </div>
        )}

        {/* --- 6. HELP --- */}
        {activeTab === "help" && (
          <div style={{maxWidth: "800px"}}>
            <h2 style={styles.sectionTitle}>Help & Support</h2>
            <p style={styles.sectionSub}>Need help? We're here for you.</p>
            {["Report a Problem", "Help Center", "Privacy Policy", "Terms of Service"].map(h => (
                <div key={h} style={{padding: "18px 0", borderBottom: `1px solid ${theme.border}`, display: "flex", justifyContent: "space-between", cursor: "pointer"}}>
                    <span style={{color: theme.textMain}}>{h}</span><span style={{color: theme.textLight}}>›</span>
                </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default Settings;