import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';

const Messages = ({ darkMode }) => {
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const socket = useRef();
  const scrollRef = useRef();

  const userId = localStorage.getItem('userId'); // My ID

  // --- THEME ---
  const theme = {
    bg: darkMode ? "#121212" : "#F2F0EA",
    card: darkMode ? "#1E1E1E" : "#FFFFFF",
    text: darkMode ? "#FFFFFF" : "#331b03",
    textLight: darkMode ? "#B0B3B8" : "#606770",
    border: darkMode ? "#333" : "#e4e6eb",
    primary: "#A18167",
    myMsgBg: "#A18167",
    otherMsgBg: darkMode ? "#2C2C2C" : "#E4E6EB",
    inputBg: darkMode ? "#2C2C2C" : "#FFFFFF"
  };

  // ✅ 1. CONNECT SOCKET
  useEffect(() => {
    // Render Backend URL
    socket.current = io("https://backend-colly.onrender.com/");
    
    // Server ko batao main online hu
    socket.current.emit("join_user", userId);

    // Incoming Message Listener
    socket.current.on("receive_message", (data) => {
        // Agar main usi user se chat kar raha hu jo msg bhej raha hai
        if (currentChat && data.senderId === currentChat._id) {
            setMessages((prev) => [...prev, data]);
        } else {
            // Notification logic here later
            alert(`New message from someone!`); 
        }
    });
  }, [userId, currentChat]);

  // ✅ 2. FETCH INBOX (Users jinhone msg kiya)
  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await axios.get(`https://backend-colly.onrender.com//api/conversations/${userId}`);
        setConversations(res.data);
      } catch (err) { console.error(err); }
    };
    getConversations();
  }, [userId]);

  // ✅ 3. FETCH CHAT HISTORY
  useEffect(() => {
    if (currentChat) {
        const getMessages = async () => {
            try {
                const res = await axios.get(`https://backend-colly.onrender.com//api/messages/${userId}/${currentChat._id}`);
                setMessages(res.data);
            } catch (err) { console.error(err); }
        };
        getMessages();
    }
  }, [currentChat]);

  // ✅ 4. AUTO SCROLL TO BOTTOM
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ✅ 5. SEND MESSAGE FUNCTION
  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentChat) return;

    const messageData = {
        senderId: userId,
        receiverId: currentChat._id,
        text: newMessage,
        createdAt: new Date().toISOString() // Instant show ke liye
    };

    // 1. Socket se bhejo (Instant)
    socket.current.emit("send_message", messageData);

    // 2. Database me save karo
    try {
        await axios.post('https://backend-colly.onrender.com//api/messages/send', {
            senderId: userId,
            receiverId: currentChat._id,
            text: newMessage
        });
        setMessages([...messages, messageData]); // Apni screen par update
        setNewMessage("");
    } catch (err) { console.error("Send failed"); }
  };

  // --- STYLES ---
  const styles = {
    container: { display: 'flex', height: 'calc(100vh - 80px)', maxWidth: '1000px', margin: '20px auto', backgroundColor: theme.card, borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', border: `1px solid ${theme.border}` },
    sidebar: { width: '300px', borderRight: `1px solid ${theme.border}`, display: 'flex', flexDirection: 'column' },
    searchBox: { padding: '15px', borderBottom: `1px solid ${theme.border}` },
    searchInput: { width: '100%', padding: '10px', borderRadius: '20px', border: 'none', backgroundColor: theme.bg, color: theme.text, outline: 'none' },
    userList: { flex: 1, overflowY: 'auto' },
    userItem: { display: 'flex', alignItems: 'center', gap: '10px', padding: '15px', cursor: 'pointer', borderBottom: `1px solid ${theme.border}`, transition: '0.2s' },
    avatar: { width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' },
    chatArea: { flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: theme.bg },
    chatHeader: { padding: '15px', backgroundColor: theme.card, borderBottom: `1px solid ${theme.border}`, display: 'flex', alignItems: 'center', gap: '10px' },
    messagesBox: { flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' },
    myMsg: { alignSelf: 'flex-end', backgroundColor: theme.myMsgBg, color: '#fff', padding: '8px 15px', borderRadius: '15px 15px 0 15px', maxWidth: '70%', fontSize: '14px' },
    otherMsg: { alignSelf: 'flex-start', backgroundColor: theme.otherMsgBg, color: theme.text, padding: '8px 15px', borderRadius: '15px 15px 15px 0', maxWidth: '70%', fontSize: '14px' },
    inputArea: { padding: '15px', backgroundColor: theme.card, borderTop: `1px solid ${theme.border}`, display: 'flex', gap: '10px' },
    msgInput: { flex: 1, padding: '12px', borderRadius: '25px', border: `1px solid ${theme.border}`, backgroundColor: theme.inputBg, color: theme.text, outline: 'none' },
    sendBtn: { padding: '10px 20px', borderRadius: '25px', border: 'none', backgroundColor: theme.primary, color: '#fff', fontWeight: 'bold', cursor: 'pointer' },
    emptyState: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: theme.textLight, flexDirection: 'column' }
  };

  return (
    <div style={styles.container}>
        
        {/* LEFT SIDEBAR */}
        <div style={styles.sidebar}>
            <div style={styles.searchBox}>
                <input placeholder="Search..." style={styles.searchInput} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
            <div style={styles.userList}>
                {conversations.map(u => (
                    <div 
                        key={u._id} 
                        style={{...styles.userItem, backgroundColor: currentChat?._id === u._id ? (darkMode ? '#333' : '#f0f0f0') : 'transparent'}}
                        onClick={() => setCurrentChat(u)}
                    >
                        <img src={u.profilePic || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} style={styles.avatar} alt="" />
                        <div>
                            <h4 style={{margin: 0, color: theme.text, fontSize: '14px'}}>{u.username}</h4>
                            <p style={{margin: 0, fontSize: '11px', color: theme.textLight, overflow: 'hidden', whiteSpace: 'nowrap', width: '150px', textOverflow: 'ellipsis'}}>
                                {u.lastMsg || "Tap to chat"}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* RIGHT CHAT AREA */}
        {currentChat ? (
            <div style={styles.chatArea}>
                <div style={styles.chatHeader}>
                    <img src={currentChat.profilePic || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} style={styles.avatar} alt="" />
                    <h3 style={{margin: 0, color: theme.text, fontSize: '16px'}}>{currentChat.full_name || currentChat.username}</h3>
                </div>

                <div style={styles.messagesBox}>
                    {messages.map((msg, index) => (
                        <div key={index} ref={scrollRef} style={msg.senderId === userId ? styles.myMsg : styles.otherMsg}>
                            <p style={{margin: 0}}>{msg.text}</p>
                        </div>
                    ))}
                </div>

                <form style={styles.inputArea} onSubmit={handleSend}>
                    <input style={styles.msgInput} placeholder="Type a message..." value={newMessage} onChange={(e) => setNewMessage(e.target.value)} />
                    <button type="submit" style={styles.sendBtn}>🚀</button>
                </form>
            </div>
        ) : (
            <div style={styles.emptyState}>
                <h3>Your Messages 💬</h3>
                <p>Select a friend to start chatting</p>
            </div>
        )}
    </div>
  );
};

export default Messages;