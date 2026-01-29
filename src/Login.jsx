import React, { useState, useEffect, useContext } from "react";
import Logo from "./components/Logo";
import { UserContext } from "./context/UserContext.jsx"; 

const AuthPage = () => {
  const { login } = useContext(UserContext);
  const [mode, setMode] = useState("login"); 
  const [loading, setLoading] = useState(false);
  const [leftRandomPositions, setLeftRandomPositions] = useState([]);
  const API_BASE = "https://colly-1-iw6c.onrender.com";

  const [formData, setFormData] = useState({
    full_name: "", surname: "", email: "", phone: "", 
    username: "", password: "", newPassword: "", otp: "", 
    dob: "", gender: ""
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // --- 📧 FLOW 1: SIGNUP & VERIFY ---
  // ✅ 1. Signup OTP Bhejne Wala Function (Updated for 'otps')
const handleSignupInit = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
    // 👇 Yahan 'otps' (s ke saath) confirm kar diya hai
    const res = await fetch(`${API_BASE}/send-signup-otps`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: formData.email })
    });

    if (res.ok) {
      alert("📧 Signup OTP sent! Check your Gmail.");
      setMode("verify_signup"); // Isse otp dalne wala box khulega
    } else {
      const data = await res.json();
      // Server error message yahan dikhega agar route galat hua
      alert(data.error || "Signup OTP failed (Check Backend logs)");
    }
  } catch (err) {
    alert("Server Connection Error: Check if backend is live.");
  } finally {
    setLoading(false);
  }
};

  // ✅ 2. OTP Verify aur Account Create karne wala function
const handleVerifySignup = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
    // Backend mein ye '/api/signup' hai as per your last code
    const res = await fetch(`${API_BASE}/api/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // Isme otp ke saath baki details bhi ja rahi hain
      body: JSON.stringify({ ...formData }) 
    });

    if (res.ok) {
      alert("🎉 Account Created Successfully!");
      setMode("login");
    } else {
      const data = await res.json();
      alert(data.error || "Invalid OTP ❌");
    }
  } catch (err) {
    alert("Server Error in verification.");
  } finally {
    setLoading(false);
  }
};

  // --- 🔑 FLOW 2: FORGOT & RESET ---
  const handleForgotInit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/forgot-password`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: formData.email })
      });
      const data = await res.json();
      if (res.ok) {
        alert("🔑 Reset OTP sent to Gmail!");
        setFormData({ ...formData, email: data.email || formData.email });
        setMode("reset_password");
      } else { alert("User not found"); }
    } catch (err) { alert("Server Error"); } finally { setLoading(false); }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/reset-password`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, otp: formData.otp, newPassword: formData.newPassword })
      });
      if (res.ok) {
        alert("✅ Password Changed!");
        setMode("login");
      } else { alert("Invalid Reset OTP ❌"); }
    } catch (err) { alert("Server Error"); } finally { setLoading(false); }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
        const res = await fetch(`${API_BASE}/api/login`, { 
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: formData.email, password: formData.password })
        });
        const data = await res.json();
        if (res.ok) { login(data.user, "colly_active_session"); }
        else { alert(data.error || "Login Failed"); }
    } catch (err) { alert("Server Error"); } finally { setLoading(false); }
  };

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
    "https://loremflickr.com/150/150/kathakali,dance?random=5", "https://loremflickr.com/150/150/shiva,statue?random=7",
    "https://loremflickr.com/150/150/indian,market?random=8", "https://loremflickr.com/150/150/masala,chai?random=10",
  ];

  useEffect(() => {
      const newPositions = [];
      for (let i = 0; i < 15; i++) {
          newPositions.push({ top: `${Math.random() * 90}%`, left: `${Math.random() * 90}%`, delay: `${Math.random() * 5}s` });
      }
      setLeftRandomPositions(newPositions);
  }, []);

  const theme = { primary: "#A18167" };
  const styles = {
    page: { height: "100vh", width: "100vw", display: "flex", fontFamily: "'Verdana', sans-serif", overflow: "hidden", position: "relative", backgroundColor: "#000" },
    topLeftIconContainer: { position: "absolute", top: "25px", left: "25px", zIndex: 110, width: "90px", height: "90px" },
    festivePopup: { position: "absolute", width: "80px", height: "80px", borderRadius: "50%", objectFit: "cover", pointerEvents: "none", boxShadow: "0 4px 15px rgba(0,0,0,0.3)", border: "3px solid #fff" },
    leftSide: { position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 1, display: "flex", justifyContent: "center", alignItems: "center" },
    masonryContainer: { display: "flex", gap: "20px", width: "120%", height: "120%", transform: "rotate(-5deg) translateY(-10%)", opacity: 0.6 },
    column: { display: "flex", flexDirection: "column", gap: "20px", width: "33%" },
    img: { width: "100%", borderRadius: "16px", display: "block", objectFit: "cover", height: "300px" },
    rightSide: { flex: "1", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "20px", position: "relative", zIndex: 10 },
    formCard: { backgroundColor: "rgba(255, 255, 255, 0.12)", backdropFilter: "blur(15px)", WebkitBackdropFilter: "blur(15px)", padding: "30px", borderRadius: "20px", boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)", width: "100%", maxWidth: "400px", textAlign: "center", border: "1px solid rgba(255, 255, 255, 0.2)" },
    title: { fontSize: "22px", fontWeight: "bold", marginBottom: "20px", color: "#fff", fontFamily: "'Playfair Display', serif" },
    input: { width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid rgba(255, 255, 255, 0.3)", backgroundColor: "rgba(255, 255, 255, 0.1)", fontSize: "14px", outline: "none", color: "#fff", marginTop: "12px", boxSizing: "border-box" },
    button: { width: "100%", padding: "12px", borderRadius: "8px", border: "none", backgroundColor: theme.primary, color: "#fff", fontSize: "17px", fontWeight: "bold", cursor: "pointer", marginTop: "20px" },
    row: { display: "flex", gap: "8px" },
    footer: { marginTop: "20px", fontSize: "14px", color: "rgba(255,255,255,0.8)" },
    link: { color: "#fff", fontWeight: "bold", cursor: "pointer", marginLeft: "5px", textDecoration: "underline" },
    forgotLink: { fontSize: "13px", color: "rgba(255,255,255,0.8)", textAlign: "center", display: "block", marginTop: "12px", cursor: "pointer" }
  };

  const renderForm = () => {
    if (mode === "verify_signup") {
      return (
        <form onSubmit={handleVerifySignup}>
          <p style={{color: "#fff", fontSize: "14px"}}>Verify Signup for {formData.email}</p>
          <input name="otp" placeholder="Enter Signup OTP" onChange={handleChange} style={styles.input} required />
          <button type="submit" style={styles.button}>{loading ? "Verifying..." : "Verify & Signup"}</button>
          <span style={styles.forgotLink} onClick={() => setMode("signup")}>Back</span>
        </form>
      );
    }
    if (mode === "reset_password") {
      return (
        <form onSubmit={handleResetPassword}>
          <p style={{color: "#fff", fontSize: "14px"}}>Reset Password for {formData.email}</p>
          <input name="otp" placeholder="Enter Reset OTP" onChange={handleChange} style={styles.input} required />
          <input name="newPassword" type="password" placeholder="New Password" onChange={handleChange} style={styles.input} required />
          <button type="submit" style={styles.button}>{loading ? "Updating..." : "Update Password"}</button>
          <span style={styles.forgotLink} onClick={() => setMode("login")}>Back</span>
        </form>
      );
    }
    if (mode === "signup") {
      return (
        <form onSubmit={handleSignupInit}>
          <div style={styles.row}>
            <input name="full_name" placeholder="First name" onChange={handleChange} style={styles.input} required />
            <input name="surname" placeholder="Surname" onChange={handleChange} style={styles.input} required />
          </div>
          <input name="email" placeholder="Email" onChange={handleChange} style={styles.input} required />
          <input name="username" placeholder="Username" onChange={handleChange} style={styles.input} required />
          <input name="password" type="password" placeholder="Password" onChange={handleChange} style={styles.input} required />
          <button type="submit" style={styles.button}>{loading ? "..." : "Get Signup OTP"}</button>
        </form>
      );
    }
    if (mode === "forgot") {
        return (
          <form onSubmit={handleForgotInit}>
            <input name="email" placeholder="Enter Email or Username" onChange={handleChange} style={styles.input} required />
            <button type="submit" style={styles.button}>{loading ? "..." : "Get Reset OTP"}</button>
            <span style={styles.forgotLink} onClick={() => setMode("login")}>Back</span>
          </form>
        );
    }
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
          @keyframes scrollUp { 0% { transform: translateY(0); } 100% { transform: translateY(-50%); } }
          @keyframes scrollDown { 0% { transform: translateY(-50%); } 100% { transform: translateY(0); } }
          @keyframes popUpDown { 0%, 100% { transform: scale(0); opacity: 0; } 20%, 80% { transform: scale(1); opacity: 1; } }
          body { margin: 0; overflow: hidden; }
      `}</style>
      
      <div style={styles.topLeftIconContainer}>
           <img src="/collylogo.png" alt="Logo" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
      </div>

      <div style={styles.leftSide}>
        {leftRandomPositions.map((pos, index) => (
            <img key={index} src={festivePopImages[index % festivePopImages.length]} style={{...styles.festivePopup, top: pos.top, left: pos.left, animation: `popUpDown 6s ease-in-out infinite ${pos.delay}`}} alt="" />
        ))}
        <div style={styles.masonryContainer}>
            <div style={{...styles.column, animation: "scrollUp 40s linear infinite"}}>{[...pinImages, ...pinImages].map((src, i) => <img key={i} src={src} style={styles.img} alt="" />)}</div>
            <div style={{...styles.column, animation: "scrollDown 50s linear infinite"}}>{[...pinImages, ...pinImages].reverse().map((src, i) => <img key={i} src={src} style={styles.img} alt="" />)}</div>
            <div style={{...styles.column, animation: "scrollUp 45s linear infinite"}}>{[...pinImages, ...pinImages].map((src, i) => <img key={i} src={src} style={styles.img} alt="" />)}</div>
        </div>
        <div style={{position: "absolute", top:0, left:0, width:"100%", height:"100%", background: "radial-gradient(circle, transparent 20%, rgba(0,0,0,0.8) 100%)"}}></div>
      </div>

      <div style={styles.rightSide}>
          <div style={{ marginBottom: '20px' }}><Logo /></div>
          <div style={styles.formCard}>
              <h1 style={styles.title}>{mode === "login" ? "Login to Colly" : (mode === "signup" ? "Create Account" : (mode === "forgot" ? "Find Account" : "OTP Verification"))}</h1>
              {renderForm()}
              {(mode === "login" || mode === "signup") && (
                <div style={styles.footer}>
                  {mode === "login" ? "New here?" : "Already a member?"}
                  <span onClick={() => setMode(mode === "login" ? "signup" : "login")} style={styles.link}>{mode === "login" ? "Sign Up" : "Log In"}</span>
                </div>
              )}
          </div>
      </div>
    </div>
  );
};

export default AuthPage;