import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Notifications = ({ darkMode }) => {
  const [notifications, setNotifications] = useState([]);
  const currentUserId = localStorage.getItem('userId');

  // --- 🎨 COLLY THEME ---
  const theme = {
    primary: "#A18167", 
    primaryLight: "rgba(161, 129, 103, 0.1)",
    bg: darkMode ? "#121212" : "#F2F0EA",
    card: darkMode ? "#1E1E1E" : "#FFFFFF",
    textMain: darkMode ? "#ffffff" : "#331b03",
    textLight: "#606770",
    border: darkMode ? '#333' : '#e4e6eb',
    shadow: "0 4px 12px rgba(0,0,0,0.05)"
  };

  // ✅ FETCH REAL NOTIFICATIONS
  useEffect(() => {
    if (!currentUserId) return;
    
    axios.get(`https://backend-colly.onrender.com//api/notifications/${currentUserId}`)
        .then(res => {
            // Transform DB data to UI format
            const formatted = res.data.map(n => ({
                id: n._id,
                type: n.type,
                user: n.sender?.username || "Colly User",
                img: n.sender?.profilePic || "https://loremflickr.com/100/100/people",
                text: n.text,
                time: new Date(n.createdAt).toLocaleDateString(), // Can use moment.js for "2 min ago"
                postImg: n.postId?.img || null,
                isNew: !n.isRead
            }));
            setNotifications(formatted);
        })
        .catch(err => console.error("Notif Fetch Error", err));
  }, [currentUserId]);

  // Handle Follow Back (Simulated for UI)
  const handleFollowBack = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, isFollowing: true } : n
    ));
    // Optional: Call follow API here
  };

  const clearAll = () => setNotifications([]);

  // --- STYLES ---
  const styles = {
    container: { maxWidth: "600px", margin: "0 auto", padding: "20px", fontFamily: "'Verdana', sans-serif", color: theme.textMain },
    header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" },
    title: { fontSize: "24px", fontFamily: "'Playfair Display', serif", color: theme.primary, margin: 0 },
    clearBtn: { fontSize: "12px", color: theme.textLight, cursor: "pointer", fontWeight: "600" },
    sectionTitle: { fontSize: "14px", fontWeight: "bold", color: theme.textMain, margin: "20px 0 10px 0" },
    card: { display: "flex", alignItems: "center", gap: "15px", padding: "15px", borderRadius: "12px", marginBottom: "10px", backgroundColor: theme.card, boxShadow: theme.shadow, transition: "0.2s", cursor: "pointer" },
    newCard: { borderLeft: `4px solid ${theme.primary}`, backgroundColor: theme.primaryLight },
    avatarContainer: { position: "relative" },
    avatar: { width: "45px", height: "45px", borderRadius: "50%", objectFit: "cover", border: `1px solid ${theme.border}` },
    iconBadge: { position: "absolute", bottom: "-2px", right: "-2px", width: "18px", height: "18px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", color: "#fff", border: "2px solid #fff" },
    content: { flex: 1 },
    text: { fontSize: "14px", margin: 0, lineHeight: "1.4" },
    time: { fontSize: "11px", color: theme.textLight, marginTop: "4px" },
    postThumb: { width: "40px", height: "40px", borderRadius: "6px", objectFit: "cover" },
    followBtn: { padding: "6px 16px", borderRadius: "20px", border: "none", backgroundColor: theme.primary, color: "#fff", fontSize: "12px", fontWeight: "bold", cursor: "pointer" },
    followingBtn: { padding: "6px 16px", borderRadius: "20px", border: `1px solid ${theme.border}`, backgroundColor: "transparent", color: theme.textLight, fontSize: "12px", fontWeight: "bold", cursor: "pointer" },
    emptyState: { textAlign: "center", padding: "50px 0", color: theme.textLight }
  };

  const getIcon = (type) => {
      switch(type) {
          case 'like': return { icon: '❤️', color: '#e0245e' };
          case 'comment': return { icon: '💬', color: '#17bf63' };
          case 'follow': return { icon: '👤', color: theme.primary };
          default: return { icon: '🔔', color: '#888' };
      }
  };

  // Sub-component
  const NotificationItem = ({ notif }) => {
    const { icon, color } = getIcon(notif.type);
    return (
        <div style={{...styles.card, ...(notif.isNew ? styles.newCard : {})}}>
            <div style={styles.avatarContainer}>
                <img src={notif.img} style={styles.avatar} alt="user" />
                <div style={{...styles.iconBadge, backgroundColor: color}}>{icon}</div>
            </div>
            <div style={styles.content}>
                <p style={styles.text}>
                    <strong style={{color: theme.textMain, marginRight: '4px'}}>{notif.user}</strong>
                    {notif.text}
                </p>
                <div style={styles.time}>{notif.time}</div>
            </div>
            <div>
                {notif.type === 'follow' && (
                    <button onClick={(e) => { e.stopPropagation(); handleFollowBack(notif.id); }} style={notif.isFollowing ? styles.followingBtn : styles.followBtn}>
                        {notif.isFollowing ? 'Following' : 'Follow Back'}
                    </button>
                )}
                {notif.postImg && <img src={notif.postImg} style={styles.postThumb} alt="post" />}
            </div>
        </div>
    );
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
          <h2 style={styles.title}>Activity</h2>
          {notifications.length > 0 && <span onClick={clearAll} style={styles.clearBtn}>Clear All</span>}
      </div>

      {notifications.length === 0 ? (
          <div style={styles.emptyState}>
              <div style={{fontSize: '40px', marginBottom: '10px'}}>🔕</div>
              <p>No new notifications.</p>
          </div>
      ) : (
          <div>
            {notifications.map(n => (
               <NotificationItem key={n.id} notif={n} />
            ))}
          </div>
      )}
    </div>
  );
};

export default Notifications;