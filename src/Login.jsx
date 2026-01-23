import React, { useState, useEffect } from "react";
import Logo from "./components/Logo";

const AuthPage = (props) => {
  const [mode, setMode] = useState("login");
  const [leftRandomPositions, setLeftRandomPositions] = useState([]);

  const [formData, setFormData] = useState({
    full_name: "", middle_name: "", surname: "", email: "", phone: "", username: "", password: "", otp: "", newPassword: "", dob: "", gender: ""
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // --- API Functions ---
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // ✅ FIX: Double slash removed
      const res = await fetch("https://backend-colly.onrender.com/login", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: formData.email, password: formData.password })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", data.user.username);
        localStorage.setItem("userId", data.user._id);
        props.onLoginSuccess();
      } else alert(data.error);
    } catch { alert("Connection failed."); }
  };

  const handleSignupStart = async (e) => {
    e.preventDefault();
    try {
      // ✅ FIX: Double slash removed
      const res = await fetch("https://backend-colly.onrender.com/send-signup-otps", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, phone: formData.phone })
      });
      if (res.ok) { alert("✨ OTP Sent to your inbox"); setMode("otp"); }
      else alert("Error sending OTP"); // Removed 'data' variable issue here too
    } catch { alert("Server error."); }
  };

  const handleFinalAction = async (e) => {
    e.preventDefault();
    const url = mode === "otp" ? "signup-verified" : "reset-password";
    const body = mode === "otp"
      ? { ...formData, emailOTP: formData.otp, phoneOTP: formData.otp, full_name: `${formData.full_name} ${formData.middle_name} ${formData.surname}` }
      : { identifier: formData.email, otp: formData.otp, newPassword: formData.newPassword };

    try {
      // ✅ FIX: Double slash removed
      const res = await fetch(`https://backend-colly.onrender.com/${url}`, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body)
      });
      if (res.ok) { alert("Welcome to Colly ✨"); setMode("login"); }
      else alert("Action Failed");
    } catch { alert("Server error."); }
  };

  const handleForgotStart = async (e) => {
    e.preventDefault();
    try {
      // ✅ FIX: Double slash removed
      const res = await fetch("https://backend-colly.onrender.com/forgot-password-otp", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: formData.email })
      });
      const data = await res.json();
      if (res.ok) { alert("✅ OTP Sent!"); setFormData({ ...formData, email: data.email }); setMode("reset"); } 
      else alert(data.error);
    } catch { alert("Backend error."); }
  };

  // --- BACKGROUND MASONRY IMAGES ---
  const pinImages = [
    "https://loremflickr.com/500/700/indian,festival?random=101", 
    "https://loremflickr.com/500/700/party,friends?random=102",   
    "https://loremflickr.com/500/700/indian,street,food?random=103", 
    "https://loremflickr.com/500/700/marvel,superhero?random=104", 
    "https://loremflickr.com/500/700/selfie,group?random=105",     
    "https://loremflickr.com/500/700/india,travel?random=106",      
    "https://loremflickr.com/500/700/concert,crowd?random=107",     
    "https://loremflickr.com/500/700/avengers,comics?random=108",   
    "https://loremflickr.com/500/700/wedding,indian?random=109",    
  ];

  // --- 🇮🇳 HUGE LIST OF UNIQUE INDIAN IMAGES (30+) ---
  const festivePopImages = [
    "https://loremflickr.com/150/150/taj,mahal?random=1",
    "https://loremflickr.com/150/150/holi,face?random=2",
    "https://loremflickr.com/150/150/diwali,diya?random=3",
    "https://loremflickr.com/150/150/indian,bride?random=4",
    "https://loremflickr.com/150/150/kathakali,dance?random=5",
    "https://loremflickr.com/150/150/indian,friends?random=6",
    "https://loremflickr.com/150/150/shiva,statue?random=7",
    "https://loremflickr.com/150/150/indian,market?random=8",
    "https://loremflickr.com/150/150/auto,rickshaw?random=9",
    "https://loremflickr.com/150/150/masala,chai?random=10",
    "https://loremflickr.com/150/150/hawa,mahal?random=11",
    "https://loremflickr.com/150/150/kerala,boat?random=12",
    "https://loremflickr.com/150/150/cricket,india?random=13",
    "https://loremflickr.com/150/150/saree,woman?random=14",
    "https://loremflickr.com/150/150/indian,turban?random=15",
    "https://loremflickr.com/150/150/ladoo,sweets?random=16",
    "https://loremflickr.com/150/150/rangoli,art?random=17",
    "https://loremflickr.com/150/150/yoga,india?random=18",
    "https://loremflickr.com/150/150/peacock,bird?random=19",
    "https://loremflickr.com/150/150/bengal,tiger?random=20",
    "https://loremflickr.com/150/150/lotus,temple?random=21",
    "https://loremflickr.com/150/150/varanasi,ghat?random=22",
    "https://loremflickr.com/150/150/india,gate?random=23",
    "https://loremflickr.com/150/150/golden,temple?random=24",
    "https://loremflickr.com/150/150/mehendi,hands?random=25",
    "https://loremflickr.com/150/150/spices,india?random=26",
    "https://loremflickr.com/150/150/truck,art,india?random=27",
    "https://loremflickr.com/150/150/himalaya,mountain?random=28",
    "https://loremflickr.com/150/150/ganesh,idol?random=29",
    "https://loremflickr.com/150/150/indian,flag?random=30"
  ];

  // ✅ 1. LEFT SIDE: 15 Random Positions
  useEffect(() => {
      const numPopups = 15; 
      const newPositions = [];
      for (let i = 0; i < numPopups; i++) {
          newPositions.push({
              top: `${Math.random() * 90}%`,
              left: `${Math.random() * 90}%`,
              delay: `${Math.random() * 5}s`
          });
      }
      setLeftRandomPositions(newPositions);
  }, []);

  // ✅ 2. RIGHT SIDE: 12 Fixed Border Positions
  const rightBorderPositions = [
    // Top
    { top: '-40px', left: '10%', delay: '0s' }, { top: '-40px', left: '40%', delay: '2s' }, { top: '-40px', left: '70%', delay: '4s' },
    // Bottom
    { bottom: '-40px', left: '20%', delay: '1s' }, { bottom: '-40px', left: '50%', delay: '3s' }, { bottom: '-40px', left: '80%', delay: '5s' },
    // Left (of right side)
    { top: '20%', left: '-40px', delay: '0.5s' }, { top: '50%', left: '-40px', delay: '2.5s' }, { top: '80%', left: '-40px', delay: '4.5s' },
    // Right (of right side)
    { top: '30%', right: '-40px', delay: '1.5s' }, { top: '60%', right: '-40px', delay: '3.5s' }, { top: '90%', right: '-40px', delay: '5.5s' },
  ];


  // --- 🎨 STYLES ---
  const theme = {
    primary: "#A18167", 
    text: "#1c1e21", 
    subText: "#606770", 
    white: "#FFFFFF", 
    border: "#ddd",
    linkText: "#331b03",
    warmBg: "#f0f2f5" 
  };

  const blobBaseStyle = {
      position: "absolute", borderRadius: "50%", filter: "blur(50px)", zIndex: 0, opacity: 0.8, pointerEvents: "none"
  };

  const styles = {
    page: { 
      height: "100vh", width: "100vw", display: "flex", fontFamily: "'Verdana', sans-serif", overflow: "hidden", position: "relative"
    },

    topLeftIconContainer: {
        position: "absolute", top: "25px", left: "25px", zIndex: 110, width: "90px", height: "90px", cursor: "pointer"
    },

    festivePopup: {
        position: "absolute", width: "80px", height: "80px", borderRadius: "50%", objectFit: "cover", pointerEvents: "none",
        boxShadow: "0 4px 15px rgba(0,0,0,0.3)", border: "3px solid #fff",
    },
    
    // Left Side
    leftSide: {
      flex: "1.2", backgroundColor: "#000", position: "relative", overflow: "hidden", display: "flex", justifyContent: "center", alignItems: "center"
    },
    masonryContainer: {
      display: "flex", gap: "20px", width: "120%", height: "120%", transform: "rotate(-5deg) translateY(-10%)", 
    },
    column: { display: "flex", flexDirection: "column", gap: "20px", width: "33%" },
    img: { width: "100%", borderRadius: "16px", display: "block", objectFit: "cover", height: "300px" },
    heroTextContainer: {
      position: "absolute", zIndex: 20, textAlign: "center", color: "white", textShadow: "0 4px 20px rgba(0,0,0,0.5)", pointerEvents: "none" 
    },
    heroTitle: { fontSize: "48px", fontWeight: "bold", marginBottom: "10px", fontFamily: "'Playfair Display', serif" },
    heroSub: { fontSize: "20px", opacity: 0.9 },

    // Right Side
    rightSide: {
      flex: "0.8", backgroundColor: theme.warmBg, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",
      padding: "20px", position: "relative", 
    },
    
    blob1: { ...blobBaseStyle, top: "-15%", right: "-15%", width: "450px", height: "450px", backgroundColor: "rgba(161, 129, 103, 0.5)", animation: "floatBlob1 15s infinite alternate ease-in-out" },
    blob2: { ...blobBaseStyle, bottom: "-15%", left: "-15%", width: "500px", height: "500px", backgroundColor: "rgba(161, 129, 103, 0.4)", animation: "floatBlob2 18s infinite alternate-reverse ease-in-out" },

    rightContentWrapper: { position: "relative", zIndex: 10, width: "100%", display: "flex", flexDirection: "column", alignItems: "center" },

    formCard: { 
      backgroundColor: "rgba(255, 255, 255, 0.9)", backdropFilter: "blur(5px)",
      padding: "20px 25px", borderRadius: "12px", boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)", 
      width: "100%", maxWidth: "380px", textAlign: "center", 
    },
    
    title: { fontSize: "15px", fontWeight: "normal", margin: "0px 0 15px 0", color: theme.text },
    input: { width: "100%", padding: "10px 12px", borderRadius: "6px", border: `1px solid ${theme.border}`, backgroundColor: "#F5F6F7", fontSize: "14px", outline: "none", color: theme.text, marginTop: "8px", boxSizing: "border-box", fontFamily: "inherit" },
    row: { display: "flex", gap: "8px" }, 
    button: { width: "100%", padding: "10px", borderRadius: "6px", border: "none", backgroundColor: theme.primary, color: theme.white, fontSize: "17px", fontWeight: "bold", cursor: "pointer", marginTop: "15px", transition: "0.3s", fontFamily: "inherit", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" },
    disclaimer: { fontSize: "10px", color: "#777", marginTop: "10px", lineHeight: "1.3", textAlign: "left" },
    forgotLink: { fontSize: "13px", color: theme.linkText, textAlign: "center", display: "block", marginTop: "12px", cursor: "pointer", fontWeight: "500" },
    footer: { marginTop: "20px", fontSize: "13px", color: theme.subText },
    link: { color: theme.linkText, fontWeight: "bold", cursor: "pointer", marginLeft: "5px" }
  };

  return (
    <div style={styles.page}>
      <style>
        {`
          input:-webkit-autofill, input:-webkit-autofill:hover, input:-webkit-autofill:focus, input:-webkit-autofill:active {
            -webkit-box-shadow: 0 0 0 30px #F5F6F7 inset !important;
            -webkit-text-fill-color: #1c1e21 !important;
          }
          @keyframes scrollUp { 0% { transform: translateY(0); } 100% { transform: translateY(-50%); } }
          @keyframes scrollDown { 0% { transform: translateY(-50%); } 100% { transform: translateY(0); } }
          @keyframes blinkIcon { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.8; transform: scale(0.95); } }
          @keyframes floatBlob1 { from { transform: translate(0, 0) scale(1); } to { transform: translate(-50px, 30px) scale(1.1); } }
          @keyframes floatBlob2 { from { transform: translate(0, 0) scale(1); } to { transform: translate(40px, -40px) scale(0.9); } }
          @keyframes popUpDown { 0%, 100% { transform: scale(0) rotate(-15deg); opacity: 0; } 20%, 80% { transform: scale(1) rotate(0deg); opacity: 1; } }
          body { margin: 0; overflow: hidden; }
        `}
      </style>

      <div style={styles.topLeftIconContainer}>
           <img src="/collylogo.png" alt="Colly Icon" style={{ width: "100%", height: "100%", objectFit: "contain", animation: "blinkIcon 4s infinite ease-in-out" }} />
      </div>

      {/* ✅ LEFT SIDE */}
      <div style={styles.leftSide}>
        {/* Random Popups (Using images 0 to 14 from the big list) */}
        {leftRandomPositions.map((pos, index) => (
            <img 
                key={`left-${index}`}
                src={festivePopImages[index]} // Unique image per index
                alt="Incredible India"
                style={{
                    ...styles.festivePopup,
                    top: pos.top, left: pos.left,
                    zIndex: 5, 
                    animation: `popUpDown 6s ease-in-out infinite ${pos.delay}`
                }}
            />
        ))}

        <div style={styles.masonryContainer}>
            <div style={{...styles.column, animation: "scrollUp 40s linear infinite"}}>
               {[...pinImages, ...pinImages].map((src, i) => <img key={i} src={src} style={styles.img} alt="" />)}
            </div>
            <div style={{...styles.column, animation: "scrollDown 50s linear infinite"}}>
               {[...pinImages, ...pinImages].reverse().map((src, i) => <img key={i} src={src} style={styles.img} alt="" />)}
            </div>
            <div style={{...styles.column, animation: "scrollUp 45s linear infinite"}}>
               {[...pinImages, ...pinImages].map((src, i) => <img key={i} src={src} style={styles.img} alt="" />)}
            </div>
        </div>
        <div style={{position: "absolute", top:0, left:0, width:"100%", height:"100%", background: "linear-gradient(to right, rgba(0,0,0,0.8), transparent)"}}></div>
        <div style={styles.heroTextContainer}>
             <h1 style={styles.heroTitle}>Welcome to Colly</h1>
             <p style={styles.heroSub}>Connect with friends and the world around you on Colly.</p>
        </div>
      </div>

      {/* ✅ RIGHT SIDE */}
      <div style={styles.rightSide}>
        
        {/* Border Popups (Using images 15 to 26 from the big list) */}
        {rightBorderPositions.map((pos, index) => (
            <img 
                key={`right-${index}`}
                src={festivePopImages[15 + index]} // Unique image per index (Continuing from 15)
                alt="Incredible India"
                style={{
                    ...styles.festivePopup,
                    ...pos,
                    zIndex: 5, 
                    animation: `popUpDown 6s ease-in-out infinite ${pos.delay}`
                }}
            />
        ))}

        <div style={styles.blob1}></div>
        <div style={styles.blob2}></div>

        <div style={styles.rightContentWrapper}>
            <div style={{ marginBottom: '10px', textAlign: 'center' }}>
                 <Logo />
            </div>

            <div style={styles.formCard}>
              <h1 style={styles.title}>
                {mode === "login" ? "Login to your colly account" : (mode === "signup" ? "Create Account" : "Secure Access")}
              </h1>

              <form onSubmit={mode === "login" ? handleLogin : (mode === "signup" ? handleSignupStart : (mode === "forgot" ? handleForgotStart : handleFinalAction))}>
                {mode === "signup" && (
                  <>
                    <div style={styles.row}>
                      <input name="full_name" placeholder="First name" onChange={handleChange} style={styles.input} required />
                      <input name="middle_name" placeholder="Middle" onChange={handleChange} style={styles.input} />
                      <input name="surname" placeholder="Surname" onChange={handleChange} style={styles.input} required />
                    </div>
                    <div style={styles.row}>
                        <div style={{ flex: 1.2 }}>
                           <input name="dob" type="date" onChange={handleChange} style={styles.input} required />
                        </div>
                        <div style={{ flex: 1 }}>
                           <select name="gender" onChange={handleChange} style={styles.input} required>
                               <option value="">Gender</option>
                               <option value="male">Male</option>
                               <option value="female">Female</option>
                               <option value="custom">Custom</option>
                           </select>
                        </div>
                    </div>
                  </>
                )}

                {(mode === "login" || mode === "forgot" || mode === "signup") && (
                   <input name="email" placeholder={mode === "signup" ? "Mobile number or email address" : "Email or Phone"} onChange={handleChange} style={styles.input} required />
                )}

                {(mode === "signup") && (
                   <>
                     <input name="phone" placeholder="Re-enter mobile number" onChange={handleChange} style={styles.input} required />
                     <input name="username" placeholder="Username" onChange={handleChange} style={styles.input} required />
                   </>
                )}
                
                {(mode === "login" || mode === "signup") && (
                  <input name="password" type="password" placeholder={mode === "signup" ? "New password" : "Password"} onChange={handleChange} style={styles.input} required />
                )}

                {(mode === "otp" || mode === "reset") && (
                  <>
                    <input name="otp" placeholder="Enter OTP" onChange={handleChange} style={{...styles.input, textAlign: 'center', letterSpacing: '4px', fontWeight: 'bold'}} required maxLength="4" />
                    {mode === "reset" && <input name="newPassword" type="password" placeholder="New Password" onChange={handleChange} style={styles.input} required />}
                  </>
                )}

                {mode === "signup" && (
                   <>
                     <p style={styles.disclaimer}>
                       People who use our service may have uploaded your contact information to Colly. <span style={{color: theme.linkText, cursor: 'pointer'}}>Learn more</span>.
                     </p>
                     <p style={styles.disclaimer}>
                       By clicking Sign Up, you agree to our <span style={{color: theme.linkText}}>Terms</span>, <span style={{color: theme.linkText}}>Privacy Policy</span>.
                     </p>
                   </>
                )}

                <button type="submit" style={styles.button}>
                  {mode === "login" ? "Log In" : (mode === "signup" ? "Sign Up" : "Confirm")}
                </button>
                
                {mode === "login" && <span style={styles.forgotLink} onClick={() => setMode("forgot")}>Forgotten password?</span>}

              </form>

              <div style={styles.footer}>
                {mode === "login" ? "New here?" : "Already a member?"}
                <span onClick={() => setMode(mode === "login" ? "signup" : "login")} style={styles.link}>
                  {mode === "login" ? "Sign Up" : "Log In"}
                </span>
              </div>
            </div>

            {mode === "login" && (
                <div style={{ marginTop: "25px", fontSize: "13px", color: "#666" }}>
                    <strong>Create a Page</strong> for a celebrity, brand or business.
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;