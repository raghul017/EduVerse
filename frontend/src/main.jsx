import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './styles.css';
import './styles/animations.css';
import SmoothScroll from './components/ui/SmoothScroll.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <SmoothScroll>
        <App />
      </SmoothScroll>
    </BrowserRouter>
  </React.StrictMode>
);

// Register Service Worker for PWA (deferred to not block initial load)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Delay SW registration to prioritize initial render
    setTimeout(() => {
      navigator.serviceWorker.register('/sw.js')
        .then((reg) => console.log('SW registered:', reg.scope))
        .catch((err) => console.log('SW registration failed:', err));
    }, 3000); // Wait 3 seconds after load
  });
}
