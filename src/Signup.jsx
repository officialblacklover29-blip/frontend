import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Logo from './components/Logo';

function Signup() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    full_name: '', email: '', phone: '', username: '', password: '', dob: '', emailOTP: '', phoneOTP: ''
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // --- STEP 1: SEND OTP ---
  const handleSendOTPs = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // ✅ FIX: Double slash removed
      await axios.post('https://backend-colly.onrender.com/send-signup-otps', { email: formData.email, phone: formData.phone });
      alert(`✅ OTPs Sent! Check Console.`);
      setStep(2);
    } catch (err) {
      alert('❌ ' + (err.response?.data?.error || 'Failed to send OTPs'));
    } finally { setLoading(false); }
  };

  // --- STEP 2: VERIFY ---
  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      // ✅ FIX: Double slash removed
      await axios.post('https://backend-colly.onrender.com/signup-verified', formData);
      alert('🎉 Account Created Successfully!');
      navigate('/');
    } catch (err) {
      alert('❌ ' + (err.response?.data?.error || 'Signup Failed'));
    }
  };

  return (
    <div style={styles.container}>
      
      {/* --- WHITE CARD --- */}
      <div style={styles.card}>
        
        {/* Logo */}
        <div style={{ marginBottom: '10px', transform: 'scale(1.0)' }}>
             <Logo />
        </div>

        {/* Taglines (Italic Serif) */}
        <h2 style={styles.tagline}>
          Unfold your visual story.<br />
          Connect through perspective.
        </h2>

        {/* --- STEP 1: DETAILS FORM --- */}
        {step === 1 && (
            <form onSubmit={handleSendOTPs} style={styles.form}>
                
                {/* To match backend, we need both inputs, styled exactly like the screenshot */}
                <input type="text" name="username" placeholder="Mobile Number or Email" style={{display:'none'}} /> {/* Dummy for browser auto-fill/layout consistency if needed, but we use specific fields below */}
                
                <input type="text" name="phone" placeholder="Mobile Number" onChange={handleChange} required style={styles.input} />
                <input type="email" name="email" placeholder="Email Address" onChange={handleChange} required style={styles.input} />
                <input type="text" name="full_name" placeholder="Full Name" onChange={handleChange} required style={styles.input} />
                <input type="text" name="username" placeholder="Username" onChange={handleChange} required style={styles.input} />
                <input type="password" name="password" placeholder="Password" onChange={handleChange} required style={styles.input} />
                
                {/* Date of Birth Section */}
                <div style={{width: '100%'}}>
                    <label style={styles.label}>Date of Birth</label>
                    <input type="date" name="dob" onChange={handleChange} required style={styles.input} />
                    <p style={styles.helperText}>We use this to personalize your experience.</p>
                </div>

                {/* Privacy Text */}
                <p style={styles.privacyText}>
                    Your privacy is part of our vision. We protect your data while connecting you to your community. <span style={styles.linkUnderline}>Learn More</span>
                </p>
                
                <p style={styles.termsText}>
                    By creating an account, you agree to our <span style={styles.linkUnderline}>Terms of Service</span> and acknowledge our <span style={styles.linkUnderline}>Privacy Guidelines</span>.
                </p>

                {/* Gold Button */}
                <button type="submit" style={styles.button} disabled={loading}>
                    {loading ? "Processing..." : "Sign Up"}
                </button>
            </form>
        )}

        {/* --- STEP 2: OTP VERIFICATION --- */}
        {step === 2 && (
            <form onSubmit={handleSignup} style={styles.form}>
                <p style={{fontSize:'14px', color:'#666', textAlign:'center', marginBottom: '20px'}}>
                    Please enter the OTPs sent to your <br/><b>{formData.email}</b> and <b>{formData.phone}</b>.
                </p>
                
                <input type="text" name="emailOTP" placeholder="Email OTP (4 digits)" onChange={handleChange} required style={styles.input} maxLength="4"/>
                <input type="text" name="phoneOTP" placeholder="Phone OTP (4 digits)" onChange={handleChange} required style={styles.input} maxLength="4"/>
                
                <button type="submit" style={styles.button}>Verify & Create Account</button>
                <button type="button" onClick={() => setStep(1)} style={styles.backLink}>Back to Edit</button>
            </form>
        )}

        {/* Footer */}
        <div style={styles.footer}>
          Have an account? <span onClick={() => navigate('/')} style={styles.loginLink}>Log in</span>
        </div>

      </div>
    </div>
  );
}

// --- ✨ Styles matching Screenshot 2026-01-18 023259.png ✨ ---
const theme = {
    bg: '#F9F8F6', // Light Beige/Cream background
    gold: '#C5A059', // The Gold button color
    textMain: '#1A1A1A',
    textGrey: '#666666',
    border: '#E0E0E0'
};

const styles = {
  container: {
    minHeight: '100vh',
    width: '100%',
    backgroundColor: theme.bg, // Matches the cream background
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
  },
  card: {
    backgroundColor: '#FFFFFF',
    width: '100%',
    maxWidth: '480px', // Slightly wider for that clean look
    borderRadius: '16px',
    padding: '40px 50px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  tagline: {
    fontFamily: '"Lora", serif', // Serif font for the tagline
    fontStyle: 'italic',
    fontSize: '20px',
    textAlign: 'center',
    color: theme.textMain,
    lineHeight: '1.4',
    marginTop: '5px',
    marginBottom: '30px',
    fontWeight: '500'
  },
  form: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '15px', // Spacing between inputs
  },
  input: {
    width: '100%',
    padding: '14px 16px',
    fontSize: '15px',
    color: '#333',
    backgroundColor: '#FFFFFF', // White input
    border: `1px solid ${theme.border}`, // Light grey border
    borderRadius: '6px', // Rounded corners
    outline: 'none',
  },
  label: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '8px',
    display: 'block',
    fontWeight: '500',
    marginTop: '5px'
  },
  helperText: {
    fontSize: '11px',
    color: '#999',
    marginTop: '6px',
    marginBottom: '5px',
  },
  privacyText: {
    fontSize: '12px',
    color: '#777',
    textAlign: 'center',
    lineHeight: '1.5',
    marginTop: '10px',
  },
  termsText: {
    fontSize: '12px',
    color: '#777',
    textAlign: 'center',
    lineHeight: '1.5',
    marginBottom: '15px',
  },
  linkUnderline: {
    textDecoration: 'underline',
    color: '#555',
    cursor: 'pointer',
    fontWeight: '500'
  },
  button: {
    width: '100%',
    padding: '14px',
    backgroundColor: '#C8A251', // Gold color from screenshot
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '10px',
    boxShadow: '0 2px 8px rgba(200, 162, 81, 0.3)',
  },
  backLink: {
    width: '100%',
    background: 'none',
    border: 'none',
    color: '#888',
    marginTop: '15px',
    cursor: 'pointer',
    textDecoration: 'underline',
  },
  footer: {
    marginTop: '30px',
    fontSize: '14px',
    color: '#666',
    borderTop: '1px solid #f0f0f0',
    width: '100%',
    textAlign: 'center',
    paddingTop: '20px',
  },
  loginLink: {
    color: '#C8A251', // Gold link color
    fontWeight: 'bold',
    cursor: 'pointer',
    marginLeft: '5px'
  }
};

export default Signup;