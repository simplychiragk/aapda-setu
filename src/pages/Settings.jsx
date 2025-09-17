// pages/Settings.jsx
import React, { useEffect, useState } from "react";
import { ThemeContext } from "../context/ThemeContext";

export default function Settings() {
  const { theme, setTheme, fontSize, setFontSize, darkModeEnabled } = React.useContext(ThemeContext);
  const [assistantEnabled, setAssistantEnabled] = useState(true);
  const [assistantModel, setAssistantModel] = useState('default');
  const [assistantMemory, setAssistantMemory] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/user/settings', { credentials: 'include' });
        if (!res.ok) return;
        const data = await res.json();
        const s = data.settings || {};
        if (s.theme) setTheme(s.theme);
        if (s.fontSize) setFontSize(s.fontSize);
        if (typeof s.assistantEnabled === 'boolean') setAssistantEnabled(s.assistantEnabled);
        if (typeof s.assistantMemory === 'boolean') setAssistantMemory(s.assistantMemory);
        if (s.assistantModel) setAssistantModel(s.assistantModel);
      } catch {/* ignore */}
    })();
  }, [setTheme, setFontSize]);

  const persist = async () => {
    try {
      setSaving(true);
      setStatus("");
      const settings = { theme, fontSize, assistantEnabled, assistantModel, assistantMemory };
      await fetch('/api/user/settings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ settings }) });
      setStatus("Saved");
    } catch {
      setStatus("Failed to save");
    } finally { setSaving(false); }
  };

  return (
    <div className="min-h-[70vh] p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <div className="font-semibold text-lg mb-4">Appearance</div>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-slate-600 mb-2">Theme</label>
              <select value={theme} onChange={(e) => setTheme(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-slate-600 mb-2">Font size</label>
              <select value={fontSize} onChange={(e) => setFontSize(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                <option value="small">Small</option>
                <option value="normal">Normal</option>
                <option value="large">Large</option>
              </select>
            </div>
            <div className="flex items-end">
              <div className="text-slate-600 text-sm">Dark mode is {darkModeEnabled ? 'On' : 'Off'}</div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <div className="font-semibold text-lg mb-4">Assistant</div>
          <div className="grid sm:grid-cols-3 gap-4">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={assistantEnabled} onChange={(e) => setAssistantEnabled(e.target.checked)} />
              Enable assistant
            </label>
            <div>
              <label className="block text-sm text-slate-600 mb-2">Model</label>
              <select value={assistantModel} onChange={(e) => setAssistantModel(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                <option value="default">Default</option>
                <option value="long">Long-context</option>
              </select>
            </div>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={assistantMemory} onChange={(e) => setAssistantMemory(e.target.checked)} />
              Use assistant memory
            </label>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={persist} disabled={saving} className="px-4 py-2 rounded-xl bg-blue-600 text-white disabled:opacity-60">{saving ? 'Saving…' : 'Save Settings'}</button>
          {status && <div className="text-sm text-slate-600">{status}</div>}
        </div>
      </div>
    </div>
  );
}
