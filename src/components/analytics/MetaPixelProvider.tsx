import { useEffect } from 'react';

export const MetaPixelProvider = ({ pixelId }: { pixelId: string }) => {
  // INJECT SCRIPT (runs once)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    if (!pixelId || window.fbq) return;
    
    // Initialize stub
    window.fbq = function() {
      window.fbq.queue?.push(arguments);
    };
    if (!window._fbq) window._fbq = window.fbq;
    window.fbq.push = window.fbq;
    window.fbq.loaded = true;
    window.fbq.version = '2.0';
    window.fbq.queue = [];
    
    // Inject script
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://connect.facebook.net/en_US/fbevents.js';
    document.head.appendChild(script);
    
    // Init pixel
    script.onload = () => {
      window.fbq('init', pixelId);
      window.fbq('track', 'PageView');
    };
  }, [pixelId]);
  
  return null;
};
