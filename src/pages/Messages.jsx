import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Messages = ({ darkMode }) => {
  // --- STATES ---
  const [selectedChat, setSelectedChat] = useState(null);
  const [inputText, setInputText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  
  const [contacts, setContacts] = useState([]);     // Search Results
  const [recentChats, setRecentChats] = useState([]); // Inbox (Recent)
  const [messages, setMessages] = useState([]);

  const currentUserId = localStorage.getItem('userId');

  // --- 🎨 COLLY THEME ---
  const theme = {
    primary: "#A18167", 
    primaryLight: "rgba(161, 129, 103, 0.2)",
    bg: darkMode ? "#121212" : "#F2F0EA",
    card: darkMode ? "#1E1E1E" : "#FFFFFF",
    textMain: darkMode ? "#ffffff" : "#331b03",
    textLight: "#606770",
    border: darkMode ? '#333' : '#e4e6eb',
    shadow: "0 4px 12px rgba(0,0,0,0.05)"
  };

  // ✅ 1. LOAD INBOX (Recent Chats + Unread Count)
  const fetchRecentChats = () => {
      axios.get(`https://colly-1-iw6c.onrender.com/api/conversations/${currentUserId}`)
           .then(res => setRecentChats(res.data))
           .catch(err => console.error(err));
  };

  useEffect(() => {
      if(currentUserId) fetchRecentChats();
  }, [currentUserId]);

  // ✅ 2. SEARCH USERS
  useEffect(() => {
    if (searchQuery.length > 1) {
        axios.get(`https://colly-1-iw6c.onrender.com/api/user/${searchQuery}`)
             .then(res => {
                const results = Array.isArray(res.data) ? res.data : [res.data];
                setContacts(results.filter(u => u._id !== currentUserId));
             })
             .catch(() => setContacts([]));
    } else {
        setContacts([]);
    }
  }, [searchQuery]);

  // ✅ 3. FETCH CHAT HISTORY (Mark as Read)
  useEffect(() => {
    if (selectedChat) {
        axios.get(`https://colly-1-iw6c.onrender.com/api/messages/${currentUserId}/${selectedChat._id}`)
             .then(res => {
                 const formatted = res.data.map(m => ({
                     id: m._id,
                     text: m.text,
                     sender: m.sender === currentUserId ? "me" : "them",
                     time: new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                 }));
                 setMessages(formatted);
                 // Refresh Inbox to remove unread badge locally
                 fetchRecentChats();
             })
             .catch(err => console.error(err));
    }
  }, [selectedChat]);

  // ✅ 4. SEND MESSAGE
  const handleSend = async () => {
    if (!inputText.trim() || !selectedChat) return;
    
    const newMsg = { id: Date.now(), text: inputText, sender: "me", time: "Just now" };
    setMessages([...messages, newMsg]); 
    const textToSend = inputText;
    setInputText("");

    try {
       await axios.post('https://colly-1-iw6c.onrender.com/api/messages/send', {
           senderId: currentUserId,
           receiverId: selectedChat._id,
           text: textToSend
       });
       fetchRecentChats(); // Update last msg in sidebar
    } catch (err) { alert("Message failed"); }
  };

  // --- STYLES ---
  const styles = {
    container: { maxWidth: "1000px", margin: "20px auto", height: "80vh", display: "flex", backgroundColor: theme.card, borderRadius: "16px", overflow: "hidden", boxShadow: theme.shadow, fontFamily: "'Verdana', sans-serif" },
    sidebar: { width: "35%", borderRight: `1px solid ${theme.border}`, display: "flex", flexDirection: "column" },
    searchBox: { padding: "20px", borderBottom: `1px solid ${theme.border}` },
    searchInput: { width: "100%", padding: "12px", borderRadius: "20px", border: "none", backgroundColor: theme.bg, outline: "none", color: theme.textMain },
    contactList: { flex: 1, overflowY: "auto" },
    contactItem: { display: "flex", alignItems: "center", gap: "15px", padding: "15px 20px", cursor: "pointer", transition: "0.2s", borderBottom: `1px solid ${theme.border}` },
    
    // 🔴 UNREAD BADGE STYLE
    unreadBadge: {
        backgroundColor: "#ff3b30", // Bright Red
        color: "#fff",
        borderRadius: "50%",
        width: "20px",
        height: "20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "11px",
        fontWeight: "bold",
        marginLeft: "auto" // Push to right
    },

    // Chat Window
    chatWindow: { width: "65%", display: "flex", flexDirection: "column", backgroundColor: "#fff", backgroundImage: 'url("https://www.transparenttextures.com/patterns/subtle-white-feathers.png")' },
    chatHeader: { padding: "15px 20px", borderBottom: `1px solid ${theme.border}`, display: "flex", alignItems: "center", gap: "15px", backgroundColor: theme.card },
    msgContainer: { flex: 1, padding: "20px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "10px" },
    bubble: { maxWidth: "70%", padding: "10px 16px", borderRadius: "18px", fontSize: "14px", lineHeight: "1.4", position: "relative" },
    sentBubble: { alignSelf: "flex-end", backgroundColor: theme.primary, color: "#fff", borderBottomRightRadius: "4px" },
    receivedBubble: { alignSelf: "flex-start", backgroundColor: theme.bg, color: theme.textMain, borderBottomLeftRadius: "4px" },
    inputArea: { padding: "20px", borderTop: `1px solid ${theme.border}`, display: "flex", gap: "10px", alignItems: "center", backgroundColor: theme.card },
    chatInput: { flex: 1, padding: "14px", borderRadius: "25px", border: `1px solid ${theme.border}`, outline: "none", fontSize: "14px" },
    sendBtn: { padding: "12px 20px", borderRadius: "25px", border: "none", backgroundColor: theme.primary, color: "#fff", cursor: "pointer", fontWeight: "bold" },
    emptyState: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: theme.textLight }
  };

  const displayList = searchQuery.length > 0 ? contacts : recentChats;

  return (
    <div style={styles.container}>
      
      {/* 1. LEFT SIDEBAR */}
      <div style={styles.sidebar}>
        <div style={styles.searchBox}>
          <input 
            placeholder="Search friends..." 
            style={styles.searchInput} 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div style={styles.contactList}>
          {displayList.map(contact => (
            <div 
              key={contact._id} 
              style={{...styles.contactItem, backgroundColor: selectedChat?._id === contact._id ? theme.primaryLight : "transparent"}}
              onClick={() => { setSelectedChat(contact); setSearchQuery(""); }}
            >
              <img src={contact.profilePic || "https://loremflickr.com/100/100/people"} style={{width:'50px', height:'50px', borderRadius:'50%', objectFit:'cover'}} alt="" />
              
              <div style={{flex: 1, overflow: 'hidden'}}>
                 <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <h4 style={{margin: 0, color: theme.textMain, fontSize: '15px'}}>{contact.username}</h4>
                    
                    {/* 🔥 UNREAD BADGE LOGIC HERE */}
                    {!searchQuery && contact.unreadCount > 0 ? (
                        <div style={styles.unreadBadge}>{contact.unreadCount}</div>
                    ) : (
                        !searchQuery && contact.time && (
                            <span style={{fontSize: '11px', color: theme.textLight}}>
                                {new Date(contact.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </span>
                        )
                    )}
                 </div>
                 
                 {/* Last Message Preview */}
                 {!searchQuery && (
                     <p style={{
                         margin: '5px 0 0 0', 
                         fontSize: '13px', 
                         fontWeight: contact.unreadCount > 0 ? 'bold' : 'normal', // Bold if unread
                         color: contact.unreadCount > 0 ? theme.textMain : theme.textLight, 
                         whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                     }}>
                        {contact.lastMsg || "Tap to chat"}
                     </p>
                 )}
                 {searchQuery && <p style={{margin: 0, fontSize: '12px', color: theme.textLight}}>{contact.full_name}</p>}
              </div>
            </div>
          ))}
          
          {displayList.length === 0 && (
              <div style={{padding: '30px', textAlign: 'center', color: theme.textLight, fontSize: '13px'}}>
                  {searchQuery ? "No users found" : "No recent chats."}
              </div>
          )}
        </div>
      </div>

      {/* 2. CHAT WINDOW */}
      {selectedChat ? (
        <div style={styles.chatWindow}>
          <div style={styles.chatHeader}>
            <img src={selectedChat.profilePic || "https://loremflickr.com/100/100/people"} style={{width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover'}} alt="" />
            <div>
                <h4 style={{margin: 0, color: theme.textMain}}>{selectedChat.username}</h4>
                <p style={{margin: 0, fontSize: '12px', color: theme.textLight}}>
                    {selectedChat.full_name}
                </p>
            </div>
          </div>

          <div style={styles.msgContainer}>
            {messages.map((msg, i) => (
              <div key={i} style={{...styles.bubble, ...(msg.sender === 'me' ? styles.sentBubble : styles.receivedBubble)}}>
                {msg.text}
                <div style={{fontSize: '10px', marginTop: '5px', opacity: 0.7, textAlign: 'right'}}>{msg.time}</div>
              </div>
            ))}
          </div>

          <div style={styles.inputArea}>
            <input 
                placeholder="Type a message..." 
                style={styles.chatInput} 
                value={inputText} 
                onChange={(e) => setInputText(e.target.value)} 
                onKeyPress={(e) => e.key === 'Enter' && handleSend()} 
            />
            <button onClick={handleSend} style={styles.sendBtn}>Send</button>
          </div>
        </div>
      ) : (
        <div style={styles.emptyState}>
           <div style={{fontSize: "60px", marginBottom: "20px"}}>💬</div>
           <h2 style={{color: theme.primary, marginBottom: '10px'}}>Your Messages</h2>
           <p>Pick a conversation from the left.</p>
        </div>
      )}

    </div>
  );
};

export default Messages;