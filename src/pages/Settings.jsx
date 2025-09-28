import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ThemeContext } from "../context/ThemeContext";

export default function Settings() {
  const { theme, setTheme, fontSize, setFontSize, darkModeEnabled } = React.useContext(ThemeContext);
  const [assistantEnabled, setAssistantEnabled] = useState(true);
  const [assistantModel, setAssistantModel] = useState('default');
  const [assistantMemory, setAssistantMemory] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('guardianSettings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      if (settings.assistantEnabled !== undefined) setAssistantEnabled(settings.assistantEnabled);
      if (settings.assistantModel) setAssistantModel(settings.assistantModel);
      if (settings.assistantMemory !== undefined) setAssistantMemory(settings.assistantMemory);
    }
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    const settings = {
      assistantEnabled,
      assistantModel,
      assistantMemory
    };
    localStorage.setItem('guardianSettings', JSON.stringify(settings));
  }, [assistantEnabled, assistantModel, assistantMemory]);

  const persist = async () => {
    try {
      setSaving(true);
      setStatus("");
      const settings = { theme, fontSize, assistantEnabled, assistantModel, assistantMemory };
      await fetch('/api/user/settings', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        credentials: 'include', 
        body: JSON.stringify({ settings }) 
      });
      setStatus("✅ Settings saved successfully!");
    } catch {
      setStatus("❌ Failed to save settings");
    } finally { 
      setSaving(false); 
    }
  };

  // Custom Toggle Switch Component
  const ToggleSwitch = ({ enabled, setEnabled, label }) => (
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium text-[#B0B0B0]">{label}</span>
      <button
        type="button"
        className={`${
          enabled ? 'bg-[#FF6F00]' : 'bg-gray-600'
        } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#FF6F00] focus:ring-offset-2 focus:ring-offset-gray-800`}
        onClick={() => setEnabled(!enabled)}
      >
        <span
          className={`${
            enabled ? 'translate-x-5' : 'translate-x-0'
          } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
        />
      </button>
    </div>
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#212121' }}>
      {/* Header Section */}
      <div className="relative overflow-hidden" style={{ backgroundColor: '#0D47A1' }}>
        <div className="absolute inset-0 bg-gradient-to-r from-[#0D47A1]/80 to-[#1565C0]/80"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold text-white mb-4">Application Settings ⚙️</h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Customize your Guardian experience and optimize your disaster preparedness journey
            </p>
          </motion.div>
        </div>
      </div>

      {/* Settings Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Appearance Settings Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 shadow-2xl"
          >
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-[#FF6F00] to-[#FFA000] rounded-xl flex items-center justify-center mr-4">
                <span className="text-xl">🎨</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Appearance Settings</h2>
                <p className="text-[#B0B0B0]">Customize the look and feel of your application</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Theme Selection */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[#B0B0B0]">
                  <span className="mr-2">🌓</span>
                  Theme Preference
                </label>
                <div className="relative">
                  <select 
                    value={theme} 
                    onChange={(e) => setTheme(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800/80 border border-gray-600 rounded-xl focus:ring-2 focus:ring-[#FF6F00] focus:border-transparent outline-none transition-all text-white appearance-none cursor-pointer"
                  >
                    <option value="light" className="bg-gray-800 text-white">Light Mode</option>
                    <option value="dark" className="bg-gray-800 text-white">Dark Mode</option>
                    <option value="system" className="bg-gray-800 text-white">System Default</option>
                  </select>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#B0B0B0] pointer-events-none">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Font Size Selection */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[#B0B0B0]">
                  <span className="mr-2">🔤</span>
                  Font Size
                </label>
                <div className="relative">
                  <select 
                    value={fontSize} 
                    onChange={(e) => setFontSize(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800/80 border border-gray-600 rounded-xl focus:ring-2 focus:ring-[#FF6F00] focus:border-transparent outline-none transition-all text-white appearance-none cursor-pointer"
                  >
                    <option value="small" className="bg-gray-800 text-white">Small</option>
                    <option value="normal" className="bg-gray-800 text-white">Normal</option>
                    <option value="large" className="bg-gray-800 text-white">Large</option>
                  </select>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#B0B0B0] pointer-events-none">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Current Status */}
              <div className="md:col-span-2">
                <div className="p-4 bg-gray-700/30 rounded-xl border border-gray-600/50">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-[#B0B0B0]">Current Status</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      darkModeEnabled 
                        ? 'bg-[#FF6F00]/20 text-[#FF6F00] border border-[#FF6F00]/30' 
                        : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    }`}>
                      {darkModeEnabled ? 'Dark Mode Active' : 'Light Mode Active'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Assistant Settings Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 shadow-2xl"
          >
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-[#FF6F00] to-[#FFA000] rounded-xl flex items-center justify-center mr-4">
                <span className="text-xl">🤖</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">AI Assistant Settings</h2>
                <p className="text-[#B0B0B0]">Configure your personal safety assistant preferences</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Assistant Toggles */}
              <div className="space-y-6">
                <ToggleSwitch
                  enabled={assistantEnabled}
                  setEnabled={setAssistantEnabled}
                  label="Enable AI Assistant"
                />
                <ToggleSwitch
                  enabled={assistantMemory}
                  setEnabled={setAssistantMemory}
                  label="Use Conversation Memory"
                />
              </div>

              {/* Assistant Model Selection */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[#B0B0B0]">
                  <span className="mr-2">🧠</span>
                  Assistant Model
                </label>
                <div className="relative">
                  <select 
                    value={assistantModel} 
                    onChange={(e) => setAssistantModel(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800/80 border border-gray-600 rounded-xl focus:ring-2 focus:ring-[#FF6F00] focus:border-transparent outline-none transition-all text-white appearance-none cursor-pointer"
                  >
                    <option value="default" className="bg-gray-800 text-white">Default Model</option>
                    <option value="long" className="bg-gray-800 text-white">Long-context Model</option>
                  </select>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#B0B0B0] pointer-events-none">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                <p className="text-xs text-[#B0B0B0] mt-2">
                  {assistantModel === 'default' 
                    ? 'Balanced performance for most safety queries' 
                    : 'Enhanced memory for complex disaster scenarios'}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Save Button Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 shadow-2xl"
          >
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white mb-1">Save Your Preferences</h3>
                <p className="text-sm text-[#B0B0B0]">
                  Apply your settings to enhance your Guardian experience
                </p>
                {status && (
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`text-sm mt-2 ${
                      status.includes('✅') ? 'text-emerald-400' : 'text-red-400'
                    }`}
                  >
                    {status}
                  </motion.p>
                )}
              </div>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={persist}
                disabled={saving}
                className="w-full sm:w-auto bg-gradient-to-r from-[#FF6F00] to-[#FFA000] text-white py-3 px-8 rounded-xl font-semibold hover:from-[#FF8F00] hover:to-[#FFB300] transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <span>💾</span>
                    <span>Save Settings</span>
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>

          {/* Quick Tips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 shadow-2xl"
          >
            <h3 className="text-lg font-bold text-white mb-4">Settings Tips 💡</h3>
            <ul className="space-y-3 text-sm text-[#B0B0B0]">
              <li className="flex items-start">
                <span className="text-[#FF6F00] mr-2">•</span>
                Enable AI Assistant for real-time safety guidance during emergencies
              </li>
              <li className="flex items-start">
                <span className="text-[#FF6F00] mr-2">•</span>
                Use conversation memory for personalized assistance across sessions
              </li>
              <li className="flex items-start">
                <span className="text-[#FF6F00] mr-2">•</span>
                Dark mode reduces eye strain during nighttime emergency situations
              </li>
              <li className="flex items-start">
                <span className="text-[#FF6F00] mr-2">•</span>
                Larger font sizes improve readability in high-stress scenarios
              </li>
            </ul>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
