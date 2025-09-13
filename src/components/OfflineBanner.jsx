import React, { useEffect, useState } from 'react';

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

  if (!offline) return null;
  return (
    <div className="fixed top-0 left-0 right-0 z-[60]">
      <div className="mx-auto max-w-4xl m-2 px-4 py-2 rounded-xl bg-yellow-100 text-yellow-900 border border-yellow-300 shadow animate-[fadeIn_0.2s_ease-out]">
        ⚠️ Offline mode: Some data may be outdated.
      </div>
    </div>
  );
}

