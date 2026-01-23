import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom' // 1. यह इम्पोर्ट ज़रूरी है

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 2. App को इस "सड़क" (Router) के अंदर होना चाहिए */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)