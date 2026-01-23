import React from "react";

const Logo = () => {
  return (
    <div style={{ 
      display: "flex", 
      justifyContent: "center", 
      alignItems: "center",
      // ✅ कंटेनर की हाइट कम की ताकि एक्स्ट्रा स्पेस न ले
      height: "70px",   
      overflow: "hidden", 
      width: "100%" 
    }}>
      <img 
        src="/newlogo.png" 
        alt="Colly Logo" 
        style={{ 
          // ✅ लोगो की चौड़ाई सेट की (ताकि धुंधला न हो)
          width: "160px",   
          height: "auto",
          objectFit: "contain",
          // ✅ इमेज को थोड़ा ऊपर खींचकर उसका खाली स्पेस छिपाया
          marginTop: "-10px" 
        }} 
      />
    </div>
  );
};

export default Logo;