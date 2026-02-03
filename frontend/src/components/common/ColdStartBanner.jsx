import { useState, useEffect } from 'react';
import { Loader2, Server } from 'lucide-react';
import api from '../../utils/api.js';

/**
 * ColdStartBanner - Detects if backend is in cold start state and shows a message.
 * Only displays if the health check takes longer than COLD_START_THRESHOLD.
 */
const COLD_START_THRESHOLD = 3000; // 3 seconds

export default function ColdStartBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [isWaking, setIsWaking] = useState(true);

  useEffect(() => {
    const checkServerHealth = async () => {
      const startTime = Date.now();
      
      try {
        await api.get('/health');
        const elapsed = Date.now() - startTime;
        
        // Only show banner if it took more than threshold
        if (elapsed > COLD_START_THRESHOLD) {
          setShowBanner(true);
        }
      } catch (error) {
        // Server might be starting, show banner
        setShowBanner(true);
      } finally {
        setIsWaking(false);
      }
    };

    checkServerHealth();
  }, []);

  // Don't render anything if server responded quickly
  if (!showBanner) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 animate-fade-in">
      <div className="bg-[#1a1a1a] border border-[#A1FF62]/30 rounded-2xl p-4 shadow-2xl backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#A1FF62]/10 flex items-center justify-center flex-shrink-0">
            {isWaking ? (
              <Loader2 className="w-5 h-5 text-[#A1FF62] animate-spin" />
            ) : (
              <Server className="w-5 h-5 text-[#A1FF62]" />
            )}
          </div>
          <div className="flex-1">
            <p className="text-white text-sm font-medium">
              {isWaking ? 'Server is waking up...' : 'Server is ready!'}
            </p>
            <p className="text-gray-400 text-xs mt-0.5">
              {isWaking 
                ? 'Free tier servers sleep after 15min of inactivity. First request may be slow.'
                : 'All systems operational. You can proceed now.'
              }
            </p>
          </div>
          {!isWaking && (
            <button 
              onClick={() => setShowBanner(false)}
              className="text-gray-500 hover:text-white transition-colors p-1"
            >
              ✕
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
