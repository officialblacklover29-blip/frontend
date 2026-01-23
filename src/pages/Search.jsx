import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';

// ✅ isDarkMode Prop added
const Search = ({ isDarkMode, query: propQuery }) => {
  const [searchParams] = useSearchParams();
  const urlQuery = searchParams.get('q');

  // Priority Logic
  const [query, setQuery] = useState(propQuery || urlQuery || '');
  const [userResults, setUserResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [followingIds, setFollowingIds] = useState([]);
  const [activeTab, setActiveTab] = useState("All");

  useEffect(() => {
    const finalQuery = propQuery || urlQuery;
    if (finalQuery) {
        setQuery(finalQuery);
        executeSearch(finalQuery);
    }
  }, [propQuery, urlQuery]);

  const executeSearch = async (val) => {
      if(!val) return;
      setLoading(true);
      try {
        const res = await axios.get(`https://backend-colly.onrender.com//api/user/${val}`);
        if (res.data) {
           setUserResults(Array.isArray(res.data) ? res.data : [res.data]);
        } else {
           setUserResults([]);
        }
      } catch (err) {
        setUserResults([]);
      }
      setLoading(false);
  };

  const handleSearch = (e) => {
    const val = e.target.value;
    setQuery(val);
    if (val.length > 1) executeSearch(val);
    else setUserResults([]);
  };

  const handleFollow = async (targetUserId) => {
    const currentUserId = localStorage.getItem('userId');
    try {
      const res = await axios.post('https://backend-colly.onrender.com//api/user/follow', { currentUserId, targetUserId });
      if (res.data.success) {
        if (res.data.isFollowing) setFollowingIds([...followingIds, targetUserId]);
        else setFollowingIds(followingIds.filter(id => id !== targetUserId));
      }
    } catch (err) { alert("Action failed!"); }
  };

  // --- 🎨 PREMIUM THEME (SYNCED WITH HOME) ---
  const theme = isDarkMode ? {
    primary: "#A18167",
    bg: "#0F0F10",
    card: "#1E1E20",
    textMain: "#EAEAEA",
    textLight: "#A0A0A0",
    border: "#2A2A2C",
    shadow: "0 4px 24px rgba(0,0,0,0.4)",
    inputBg: "#272729"
  } : {
    primary: "#A18167",
    bg: "#F5F3F0",
    card: "#FFFFFF",
    textMain: "#2D2D2D",
    textLight: "#606770",
    border: "#E4E6EB",
    shadow: "0 2px 12px rgba(0,0,0,0.08)",
    inputBg: "#EFEFED"
  };

  const exploreData = [
    { id: 1, title: "The Cosmos", category: "Space", img: "https://loremflickr.com/400/500/nebula,galaxy?random=1", info: "Nebula Exploration" },
    { id: 2, title: "Varanasi Ghats", category: "India", img: "https://loremflickr.com/400/400/varanasi,ganga?random=2", info: "Spiritual Capital" },
    { id: 3, title: "Tokyo Nights", category: "World", img: "https://loremflickr.com/400/600/tokyo,neon?random=3", info: "Cyberpunk Vibes" },
    { id: 4, title: "Deep Ocean", category: "Nature", img: "https://loremflickr.com/400/500/underwater,coral?random=4", info: "Hidden World" },
    { id: 5, title: "Ancient Pyramids", category: "History", img: "https://loremflickr.com/400/400/pyramid,egypt?random=5", info: "Lost Civilizations" },
    { id: 6, title: "Future Tech", category: "Tech", img: "https://loremflickr.com/400/300/robot,ai?random=6", info: "AI Revolution" },
    { id: 7, title: "Himalayan Peaks", category: "India", img: "https://loremflickr.com/400/500/himalaya,snow?random=7", info: "Roof of the World" },
    { id: 8, title: "Northern Lights", category: "Nature", img: "https://loremflickr.com/400/400/aurora,borealis?random=8", info: "Nature's Lightshow" },
    { id: 9, title: "Mars Mission", category: "Space", img: "https://loremflickr.com/400/400/mars,planet?random=9", info: "Red Planet" },
    { id: 10, title: "Rajasthani Art", category: "India", img: "https://loremflickr.com/400/500/rajasthan,culture?random=10", info: "Royal Heritage" },
    { id: 11, title: "New York City", category: "World", img: "https://loremflickr.com/400/600/nyc,street?random=11", info: "Concrete Jungle" },
    { id: 12, title: "Amazon Rainforest", category: "Nature", img: "https://loremflickr.com/400/400/jungle,forest?random=12", info: "Earth's Lungs" },
  ];

  const filteredExplore = exploreData.filter(item => activeTab === "All" || item.category === activeTab);
  const categories = ["All", "Space", "India", "World", "Nature", "Tech", "History"];

  const styles = {
    container: { padding: "30px 20px", maxWidth: "1100px", margin: "0 auto", fontFamily: "'Inter', sans-serif", color: theme.textMain },
    header: { textAlign: "center", marginBottom: "40px" },
    title: { fontSize: "36px", fontFamily: "'Playfair Display', serif", marginBottom: "10px", color: theme.primary, fontWeight: 'bold' },
    searchWrapper: { position: "relative", maxWidth: "600px", margin: "0 auto 40px auto" },
    input: { width: "100%", padding: "18px 25px", paddingLeft: "55px", borderRadius: "35px", border: `1px solid ${theme.border}`, backgroundColor: theme.inputBg, boxShadow: theme.shadow, fontSize: "17px", color: theme.textMain, outline: "none", transition: "0.3s" },
    searchIcon: { position: "absolute", left: "25px", top: "50%", transform: "translateY(-50%)", fontSize: "20px", color: theme.primary },
    tagsContainer: { display: "flex", justifyContent: "center", gap: "12px", flexWrap: "wrap", marginBottom: "40px" },
    tag: { padding: "10px 24px", borderRadius: "25px", cursor: "pointer", fontSize: "14px", fontWeight: "600", transition: "0.2s", border: `1px solid ${theme.primary}` },
    grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "25px" },
    card: { position: "relative", borderRadius: "20px", overflow: "hidden", cursor: "pointer", boxShadow: theme.shadow, transition: "transform 0.3s ease", backgroundColor: theme.card, border: `1px solid ${theme.border}` },
    img: { width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.5s" },
    overlay: { position: "absolute", bottom: 0, left: 0, width: "100%", background: "linear-gradient(to top, rgba(0,0,0,0.9), transparent)", padding: "25px 20px", color: "#fff", textAlign: "left" },
    userCard: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px 20px', borderRadius: '16px', background: theme.card, boxShadow: theme.shadow, marginBottom: '15px', maxWidth: '650px', margin: '15px auto', border: `1px solid ${theme.border}` },
    avatar: { width: '55px', height: '55px', borderRadius: '50%', objectFit: 'cover', background: theme.inputBg, border: `2px solid ${theme.primary}` },
    followBtn: { padding: '10px 28px', borderRadius: '25px', border: 'none', background: theme.primary, color: '#fff', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' },
    followingBtn: { padding: '10px 28px', borderRadius: '25px', border: `2px solid ${theme.primary}`, background: 'transparent', color: theme.primary, cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Explore the Universe 🌍✨</h1>
        <div style={styles.searchWrapper}>
          <span style={styles.searchIcon}>🔍</span>
          <input type="text" placeholder="Search people, places, or space..." value={query} onChange={handleSearch} style={styles.input} />
        </div>
      </div>

      {query.length > 1 ? (
        <div style={{marginTop: '30px'}}>
           {loading && <p style={{textAlign: 'center', color: theme.textLight, fontSize: '18px'}}>Scanning the galaxy...</p>}
           
           {userResults.map((user) => (
             <div key={user._id} style={styles.userCard}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
                 <img src={user.profilePic || 'https://loremflickr.com/200/200/person?random=1'} style={styles.avatar} alt="profile" />
                 <div style={{ textAlign: 'left' }}>
                   <p style={{ margin: 0, fontWeight: '700', fontSize: '16px', color: theme.textMain }}>{user.username}</p>
                   <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: theme.textLight }}>{user.full_name}</p>
                 </div>
               </div>
               <button onClick={() => handleFollow(user._id)} style={followingIds.includes(user._id) ? styles.followingBtn : styles.followBtn}>
                 {followingIds.includes(user._id) ? 'Following' : 'Follow'}
               </button>
             </div>
           ))}
           {!loading && userResults.length === 0 && <p style={{textAlign: 'center', color: theme.textLight, fontSize: '18px', marginTop: '30px'}}>No humans found with that name.</p>}
        </div>
      ) : (
        <>
          <div style={styles.tagsContainer}>
            {categories.map(cat => (
              <span key={cat} onClick={() => setActiveTab(cat)} style={{...styles.tag, backgroundColor: activeTab === cat ? theme.primary : "transparent", color: activeTab === cat ? "#fff" : theme.primary}}>
                {cat}
              </span>
            ))}
          </div>
          <div style={styles.grid}>
            {filteredExplore.map(item => (
              <div key={item.id} style={styles.card} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                <div style={{height: item.category === 'Space' ? '300px' : '250px'}}><img src={item.img} style={styles.img} alt={item.title} /></div>
                <div style={styles.overlay}>
                  <p style={{margin: 0, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px', opacity: 0.9, color: theme.primary, fontWeight: '700'}}>{item.category}</p>
                  <h3 style={{margin: '8px 0 0 0', fontSize: '18px', fontFamily: "'Playfair Display', serif", fontWeight: 'bold'}}>{item.title}</h3>
                  <p style={{margin: '8px 0 0 0', fontSize: '12px', opacity: 0.95}}>📍 {item.info}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Search;