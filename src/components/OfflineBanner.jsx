import React, { useEffect, useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';

export default function OfflineBanner() {
  const [offline, setOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const on = () => setOffline(false);
    const off = () => setOffline(true);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => {
      window.removeEventListener('online', on);
      window.removeEventListener('offline', off);
    };
  }, []);

  return (
    <AnimatePresence>
      {offline && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed top-0 left-0 right-0 z-[60]"
        >
          <div className="mx-auto max-w-4xl m-2 px-4 py-3 rounded-xl bg-yellow-100 dark:bg-yellow-900/30 text-yellow-900 dark:text-yellow-200 border border-yellow-300 dark:border-yellow-700 shadow-lg backdrop-blur-sm">
            <div className="flex items-center justify-center space-x-2">
              <span className="text-lg">⚠️</span>
              <span className="font-medium">You're offline</span>
              <span className="text-sm opacity-75">- Some data may be outdated</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}