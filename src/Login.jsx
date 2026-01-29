import React, { useState, useEffect, useContext } from "react";
import Logo from "./components/Logo";
import { UserContext } from "./context/UserContext.jsx"; 

const AuthPage = () => {
  const { setUser } = useContext(UserContext);
  
  // Modes: 'login', 'signup', 'forgot' (Send OTP), 'reset' (Verify & Change)
  const [mode, setMode] = useState("login"); 
  const [loading, setLoading] = useState(false);
  const [leftRandomPositions, setLeftRandomPositions] = useState([]);

  // Form Data
  const [formData, setFormData] = useState({
    full_name: "", surname: "", email: "", phone: "", 
    username: "", password: "", newPassword: "", otp: "", 
    dob: "", gender: ""
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // --- 🔥 API HANDLERS (Synced with your server.js) ---
// ✅ handleLogin ke andar ye paste karo:

const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
        // 1. Check karo hum bhej kya rahe hain?
        console.log("📤 Sending Data:", formData); 

        const res = await fetch("https://colly-1-iw6c.onrender.com/api/login", { 
            method: "POST", 
            headers: { "Content-Type": "application/json" },
            // 👇 Yahan 'formData' use karo, 'y' nahi (agar tumhara state formData hai)
            body: JSON.stringify({ 
                email: formData.email, 
                password: formData.password 
            })
        });

        // 2. Status check karo
        console.log("📡 Server Status:", res.status);

        // 3. Jadoo: Pehle Text me lo, taaki error na aaye agar HTML aaya to
        const rawText = await res.text();
        console.log("📄 ASLI JAWAB (Raw Response):", rawText);

        // 4. Ab koshish karo JSON banane ki
        let data;
        try {
            data = JSON.parse(rawText);
        } catch (jsonError) {
            throw new Error("Server ne JSON nahi bheja! Shayad HTML error page hai.");
        }
        
        // 5. Ab logic lagao
        if (res.ok) {
            console.log("✅ Login Success!");
            localStorage.setItem("userId", data.user._id);
            setUser(data.user);
        } else {
            alert(data.error || "Login Failed ❌");
        }

    } catch (err) { 
        console.error("🔥 ERROR:", err);
        alert("Check Console (F12) for details: " + err.message); 
    } finally { 
        setLoading(false); 
    }
};

  // ✅ 2. SIGNUP FUNCTION (Direct & Simple)
  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Pura form data bhej rahe hain
      const res = await fetch("https://colly-1-iw6c.onrender.com/api/signup", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          full_name: formData.full_name,
          surname: formData.surname,
          phone: formData.phone,
          dob: formData.dob,
          gender: formData.gender
        })
      });
      
      const data = await res.json();
      if (res.ok) {
        alert("✨ Account Created! Please Login.");
        setMode("login"); // Auto switch to login
      } else {
        alert(data.error || "Signup Failed");
      }
    } catch (err) { alert("Server Error."); }
    finally { setLoading(false); }
  };

  // 3. FORGOT PASS - STEP 1 (Send OTP)
  const handleForgotInit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Uses /forgot-password
      const res = await fetch("https://colly-1-iw6c.onrender.com/forgot-password", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: formData.email })
      });
      const data = await res.json();

      if (res.ok) {
        alert(`✅ OTP Sent to ${data.email || formData.email}`);
        setFormData({ ...formData, email: data.email || formData.email }); // Ensure correct email
        setMode("reset"); // Go to Reset Mode
      } else {
        alert(data.error || "User not found.");
      }
    } catch (err) { alert("Server Error."); }
    finally { setLoading(false); }
  };

  // 4. FORGOT PASS - STEP 2 (Verify & Reset)
  const handleResetFinal = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Uses /reset-password
      const res = await fetch("https://colly-1-iw6c.onrender.com/reset-password", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            email: formData.email, 
            otp: formData.otp, 
            newPassword: formData.newPassword 
        })
      });
      const data = await res.json();

      if (res.ok) {
        alert("🎉 Password Changed! Login with new password.");
        setMode("login");
      } else {
        alert(data.error || "Invalid OTP");
      }
    } catch (err) { alert("Server Error."); }
    finally { setLoading(false); }
  };

  // --- UI RESOURCES ---
  const pinImages = [
    "https://loremflickr.com/500/700/indian,festival?random=101", "https://loremflickr.com/500/700/party,friends?random=102",    
    "https://loremflickr.com/500/700/indian,street,food?random=103", "https://loremflickr.com/500/700/marvel,superhero?random=104", 
    "https://loremflickr.com/500/700/selfie,group?random=105", "https://loremflickr.com/500/700/india,travel?random=106",       
    "https://loremflickr.com/500/700/concert,crowd?random=107", "https://loremflickr.com/500/700/avengers,comics?random=108",    
    "https://loremflickr.com/500/700/wedding,indian?random=109",     
  ];

  const festivePopImages = [
    "https://loremflickr.com/150/150/taj,mahal?random=1", "https://loremflickr.com/150/150/holi,face?random=2",
    "https://loremflickr.com/150/150/diwali,diya?random=3", "https://loremflickr.com/150/150/indian,bride?random=4",
    "https://loremflickr.com/150/150/kathakali,dance?random=5", "https://loremflickr.com/150/150/indian,friends?random=6",
    "https://loremflickr.com/150/150/shiva,statue?random=7", "https://loremflickr.com/150/150/indian,market?random=8",
    "https://loremflickr.com/150/150/auto,rickshaw?random=9", "https://loremflickr.com/150/150/masala,chai?random=10",
    "https://loremflickr.com/150/150/hawa,mahal?random=11", "https://loremflickr.com/150/150/kerala,boat?random=12",
    "https://loremflickr.com/150/150/cricket,india?random=13", "https://loremflickr.com/150/150/saree,woman?random=14",
    "https://loremflickr.com/150/150/indian,turban?random=15", "https://loremflickr.com/150/150/ladoo,sweets?random=16",
    "https://loremflickr.com/150/150/rangoli,art?random=17", "https://loremflickr.com/150/150/yoga,india?random=18",
    "https://loremflickr.com/150/150/peacock,bird?random=19", "https://loremflickr.com/150/150/bengal,tiger?random=20",
    "https://loremflickr.com/150/150/lotus,temple?random=21", "https://loremflickr.com/150/150/varanasi,ghat?random=22",
    "https://loremflickr.com/150/150/india,gate?random=23", "https://loremflickr.com/150/150/golden,temple?random=24",
    "https://loremflickr.com/150/150/mehendi,hands?random=25", "https://loremflickr.com/150/150/spices,india?random=26",
    "https://loremflickr.com/150/150/truck,art,india?random=27", "https://loremflickr.com/150/150/himalaya,mountain?random=28",
    "https://loremflickr.com/150/150/ganesh,idol?random=29", "https://loremflickr.com/150/150/indian,flag?random=30"
  ];

  useEffect(() => {
      const newPositions = [];
      for (let i = 0; i < 15; i++) {
          newPositions.push({ top: `${Math.random() * 90}%`, left: `${Math.random() * 90}%`, delay: `${Math.random() * 5}s` });
      }
      setLeftRandomPositions(newPositions);
  }, []);

  const rightBorderPositions = [
    { top: '-40px', left: '10%', delay: '0s' }, { top: '-40px', left: '40%', delay: '2s' }, { top: '-40px', left: '70%', delay: '4s' },
    { bottom: '-40px', left: '20%', delay: '1s' }, { bottom: '-40px', left: '50%', delay: '3s' }, { bottom: '-40px', left: '80%', delay: '5s' },
    { top: '20%', left: '-40px', delay: '0.5s' }, { top: '50%', left: '-40px', delay: '2.5s' }, { top: '80%', left: '-40px', delay: '4.5s' },
    { top: '30%', right: '-40px', delay: '1.5s' }, { top: '60%', right: '-40px', delay: '3.5s' }, { top: '90%', right: '-40px', delay: '5.5s' },
  ];

  const theme = { primary: "#A18167", text: "#1c1e21", subText: "#606770", white: "#FFFFFF", border: "#ddd", linkText: "#331b03", warmBg: "#f0f2f5" };
  const styles = {
    page: { height: "100vh", width: "100vw", display: "flex", fontFamily: "'Verdana', sans-serif", overflow: "hidden", position: "relative" },
    topLeftIconContainer: { position: "absolute", top: "25px", left: "25px", zIndex: 110, width: "90px", height: "90px", cursor: "pointer" },
    festivePopup: { position: "absolute", width: "80px", height: "80px", borderRadius: "50%", objectFit: "cover", pointerEvents: "none", boxShadow: "0 4px 15px rgba(0,0,0,0.3)", border: "3px solid #fff" },
    leftSide: { flex: "1.2", backgroundColor: "#000", position: "relative", overflow: "hidden", display: "flex", justifyContent: "center", alignItems: "center" },
    masonryContainer: { display: "flex", gap: "20px", width: "120%", height: "120%", transform: "rotate(-5deg) translateY(-10%)" },
    column: { display: "flex", flexDirection: "column", gap: "20px", width: "33%" },
    img: { width: "100%", borderRadius: "16px", display: "block", objectFit: "cover", height: "300px" },
    heroTextContainer: { position: "absolute", zIndex: 20, textAlign: "center", color: "white", textShadow: "0 4px 20px rgba(0,0,0,0.5)", pointerEvents: "none" },
    heroTitle: { fontSize: "48px", fontWeight: "bold", marginBottom: "10px", fontFamily: "'Playfair Display', serif" },
    heroSub: { fontSize: "20px", opacity: 0.9 },
    rightSide: { flex: "0.8", backgroundColor: theme.warmBg, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "20px", position: "relative" },
    rightContentWrapper: { position: "relative", zIndex: 10, width: "100%", display: "flex", flexDirection: "column", alignItems: "center" },
    formCard: { backgroundColor: "rgba(255, 255, 255, 0.9)", backdropFilter: "blur(5px)", padding: "20px 25px", borderRadius: "12px", boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)", width: "100%", maxWidth: "380px", textAlign: "center" },
    title: { fontSize: "15px", fontWeight: "normal", margin: "0px 0 15px 0", color: theme.text },
    input: { width: "100%", padding: "10px 12px", borderRadius: "6px", border: `1px solid ${theme.border}`, backgroundColor: "#F5F6F7", fontSize: "14px", outline: "none", color: theme.text, marginTop: "8px", boxSizing: "border-box", fontFamily: "inherit" },
    row: { display: "flex", gap: "8px" }, 
    button: { width: "100%", padding: "10px", borderRadius: "6px", border: "none", backgroundColor: theme.primary, color: theme.white, fontSize: "17px", fontWeight: "bold", cursor: "pointer", marginTop: "15px", transition: "0.3s", fontFamily: "inherit", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" },
    disclaimer: { fontSize: "10px", color: "#777", marginTop: "10px", lineHeight: "1.3", textAlign: "left" },
    forgotLink: { fontSize: "13px", color: theme.linkText, textAlign: "center", display: "block", marginTop: "12px", cursor: "pointer", fontWeight: "500" },
    footer: { marginTop: "20px", fontSize: "13px", color: theme.subText },
    link: { color: theme.linkText, fontWeight: "bold", cursor: "pointer", marginLeft: "5px" }
  };

  // ✅ DYNAMIC FORM UI
  const renderForm = () => {
    // 1. FORGOT PASSWORD (OTP FLOW)
    if (mode === "forgot" || mode === "reset") {
      return (
        <form onSubmit={mode === "forgot" ? handleForgotInit : handleResetFinal}>
          {mode === "forgot" ? (
             <input name="email" placeholder="Enter Email or Username" onChange={handleChange} style={styles.input} required />
          ) : (
             <>
               <input name="otp" placeholder="Enter 4-digit OTP" maxLength="4" onChange={handleChange} style={{...styles.input, textAlign:'center', letterSpacing:'5px', fontSize:'18px'}} required />
               <input name="newPassword" type="password" placeholder="New Password" onChange={handleChange} style={styles.input} required />
             </>
          )}
          <button type="submit" style={styles.button}>{loading ? "Processing..." : (mode === "forgot" ? "Send OTP" : "Reset Password")}</button>
          <span style={styles.forgotLink} onClick={() => setMode("login")}>Back to Login</span>
        </form>
      );
    }

    // 2. SIGNUP (DIRECT FLOW)
    if (mode === "signup") {
      return (
        <form onSubmit={handleSignup}>
          <div style={styles.row}>
            <input name="full_name" placeholder="First name" onChange={handleChange} style={styles.input} required />
            <input name="surname" placeholder="Surname" onChange={handleChange} style={styles.input} required />
          </div>
          <div style={styles.row}>
              <div style={{ flex: 1.2 }}><input name="dob" type="date" onChange={handleChange} style={styles.input} required /></div>
              <div style={{ flex: 1 }}>
                 <select name="gender" onChange={handleChange} style={styles.input} required>
                     <option value="">Gender</option>
                     <option value="male">Male</option>
                     <option value="female">Female</option>
                 </select>
              </div>
          </div>
          <input name="email" placeholder="Email address" onChange={handleChange} style={styles.input} required />
          <input name="phone" placeholder="Mobile Number" onChange={handleChange} style={styles.input} required />
          <input name="username" placeholder="Username" onChange={handleChange} style={styles.input} required />
          <input name="password" type="password" placeholder="New Password" onChange={handleChange} style={styles.input} required />
          <p style={styles.disclaimer}>By clicking Sign Up, you agree to our Terms & Privacy Policy.</p>
          <button type="submit" style={styles.button}>{loading ? "Creating..." : "Sign Up"}</button>
        </form>
      );
    }

    // 3. LOGIN (STANDARD FLOW)
    return (
      <form onSubmit={handleLogin}>
        <input name="email" placeholder="Email or Username" onChange={handleChange} style={styles.input} required />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} style={styles.input} required />
        <button type="submit" style={styles.button}>{loading ? "Logging In..." : "Log In"}</button>
        <span style={styles.forgotLink} onClick={() => setMode("forgot")}>Forgotten password?</span>
      </form>
    );
  };

  return (
    <div style={styles.page}>
      <style>{`
          input:-webkit-autofill { -webkit-box-shadow: 0 0 0 30px #F5F6F7 inset !important; }
          @keyframes scrollUp { 0% { transform: translateY(0); } 100% { transform: translateY(-50%); } }
          @keyframes scrollDown { 0% { transform: translateY(-50%); } 100% { transform: translateY(0); } }
          @keyframes blinkIcon { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.8; transform: scale(0.95); } }
          @keyframes popUpDown { 0%, 100% { transform: scale(0) rotate(-15deg); opacity: 0; } 20%, 80% { transform: scale(1) rotate(0deg); opacity: 1; } }
          body { margin: 0; overflow: hidden; }
      `}</style>

      <div style={styles.topLeftIconContainer}>
           <img src="/collylogo.png" alt="Colly Icon" style={{ width: "100%", height: "100%", objectFit: "contain", animation: "blinkIcon 4s infinite ease-in-out" }} />
      </div>

      <div style={styles.leftSide}>
        {leftRandomPositions.map((pos, index) => (
            <img key={`left-${index}`} src={festivePopImages[index]} alt="" style={{...styles.festivePopup, top: pos.top, left: pos.left, zIndex: 5, animation: `popUpDown 6s ease-in-out infinite ${pos.delay}`}} />
        ))}
        <div style={styles.masonryContainer}>
            <div style={{...styles.column, animation: "scrollUp 40s linear infinite"}}>{[...pinImages, ...pinImages].map((src, i) => <img key={i} src={src} style={styles.img} alt="" />)}</div>
            <div style={{...styles.column, animation: "scrollDown 50s linear infinite"}}>{[...pinImages, ...pinImages].reverse().map((src, i) => <img key={i} src={src} style={styles.img} alt="" />)}</div>
            <div style={{...styles.column, animation: "scrollUp 45s linear infinite"}}>{[...pinImages, ...pinImages].map((src, i) => <img key={i} src={src} style={styles.img} alt="" />)}</div>
        </div>
        <div style={{position: "absolute", top:0, left:0, width:"100%", height:"100%", background: "linear-gradient(to right, rgba(0,0,0,0.8), transparent)"}}></div>
        <div style={styles.heroTextContainer}>
             <h1 style={styles.heroTitle}>Welcome to Colly</h1>
             <p style={styles.heroSub}>Connect with friends and the world around you on Colly.</p>
        </div>
      </div>

      <div style={styles.rightSide}>
        {rightBorderPositions.map((pos, index) => (
            <img key={`right-${index}`} src={festivePopImages[15 + index]} alt="" style={{...styles.festivePopup, ...pos, zIndex: 5, animation: `popUpDown 6s ease-in-out infinite ${pos.delay}`}} />
        ))}
        
        <div style={styles.rightContentWrapper}>
            <div style={{ marginBottom: '10px', textAlign: 'center' }}><Logo /></div>
            
            <div style={styles.formCard}>
              <h1 style={styles.title}>
                  {mode === "login" ? "Login to Colly" : (mode === "signup" ? "Create Account" : (mode === "forgot" ? "Find Account" : "Reset Password"))}
              </h1>

              {/* ✅ DYNAMIC FORM RENDER */}
              {renderForm()}

              {(mode === "login" || mode === "signup") && (
                <div style={styles.footer}>
                  {mode === "login" ? "New here?" : "Already a member?"}
                  <span onClick={() => setMode(mode === "login" ? "signup" : "login")} style={styles.link}>
                    {mode === "login" ? "Sign Up" : "Log In"}
                  </span>
                </div>
              )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;