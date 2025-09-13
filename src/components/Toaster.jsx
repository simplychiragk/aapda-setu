import React from 'react';
import { NotificationContext } from '../context/NotificationContext';

export default function Toaster() {
  const { toasts } = React.useContext(NotificationContext);
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[60] space-y-2">
      {toasts.map((t) => (
        <div key={t.id} className="px-4 py-2 bg-slate-900 text-white rounded-xl shadow-lg animate-[fadeIn_0.2s_ease-out]">
          {t.message}
        </div>
      ))}
    </div>
  );
}

