import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

//

const SEVERITY_COLORS = {
  High: "#dc2626",
  Medium: "#d97706", 
  Low: "#059669",
};

const STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh",
  "Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand",
  "Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur",
  "Meghalaya","Mizoram","Nagaland","Odisha","Punjab",
  "Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura",
  "Uttar Pradesh","Uttarakhand","West Bengal","Delhi","Chandigarh",
  "Jammu and Kashmir","Ladakh","Puducherry","Dadra and Nagar Haveli and Daman and Diu","Lakshadweep","Andaman and Nicobar Islands"
];

const SAMPLE_ALERTS = [
  { id: "s1", title: "Heatwave Warning", region: "Delhi", severity: "High", time: "Today, 3:15 PM", details: "Avoid going outside during afternoon. Stay hydrated.", icon: "☀️" },
];

export default function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [pushEnabled, setPushEnabled] = useState(false);
  const [selectedState, setSelectedState] = useState("All India");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchAlerts() {
      try {
        setLoading(true);
        const res = await fetch(
          "https://api.reliefweb.int/v2/disasters?appname=aapda-setu&limit=50&profile=lite&sort[]=date:desc&filter[field]=primary_country.name&filter[value]=India"
        );
        const json = await res.json();

        const mapped = (json.data || []).map((d) => {
          const f = d.fields || {};
          return {
            id: d.id,
            title: f.name || "Disaster Alert",
            region: f.primary_country?.name || "India",
            severity: f.status === "current" ? "High" : f.status === "ongoing" ? "Medium" : "Low",
            time: f.date?.created
              ? new Date(f.date.created).toLocaleString("en-IN", { hour: "numeric", minute: "numeric", hour12: true, day: "numeric", month: "short" })
              : "Unknown",
            details: f.primary_type ? f.primary_type.map((t) => t.name).join(", ") : "General update",
            icon: "⚠️",
          };
        });

        setAlerts(mapped.length ? mapped : SAMPLE_ALERTS);
      } catch (err) {
        console.error("Failed to fetch alerts:", err);
        setAlerts(SAMPLE_ALERTS);
      } finally {
        setLoading(false);
      }
    }

    fetchAlerts();
  }, []);

  const filtered = useMemo(() => {
    if (selectedState === "All India") return alerts;
    return alerts.filter((a) =>
      ((a.title || "") + (a.details || "") + (a.region || "")).toLowerCase().includes(selectedState.toLowerCase())
    );
  }, [alerts, selectedState]);

  const shareAlert = async (alert) => {
    const text = `${alert.title} (${alert.severity})\nRegion: ${alert.region}\n${alert.details}\nTime: ${alert.time}\n— via Aapda Setu`;
    try {
      if (navigator.share) await navigator.share({ title: alert.title, text });
      else {
        await navigator.clipboard.writeText(text);
        alert("Copied alert to clipboard!");
      }
    } catch {/* noop */}
  };

  const getSeverityIcon = (severity) => {
    switch(severity) {
      case 'High': return '🔴';
      case 'Medium': return '🟡';
      case 'Low': return '🟢';
      default: return '⚠️';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-500 to-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">🚨 Disaster Alerts</h1>
              <p className="text-red-100">Real-time disaster notifications for India</p>
            </div>
            <button
              onClick={() => navigate(-1)}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-xl font-semibold transition-all duration-200"
            >
              ← Back
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Controls */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Filter by State</label>
                <select 
                  value={selectedState} 
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white"
                >
                  <option>All India</option>
                  {STATES.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
            
            <button
              onClick={() => setPushEnabled(!pushEnabled)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                pushEnabled 
                  ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              {pushEnabled ? '🔔 Notifications On' : '🔕 Enable Notifications'}
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <span className="ml-4 text-gray-600">Loading alerts...</span>
          </div>
        )}

        {/* Alerts Grid */}
        {!loading && (
          <div className="space-y-6">
            {filtered.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl">📭</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No alerts found</h3>
                <p className="text-gray-600">No alerts available for {selectedState} at the moment.</p>
              </div>
            ) : (
              filtered.map((alert) => (
                <div 
                  key={alert.id} 
                  className="bg-white rounded-2xl shadow-lg border-l-4 hover:shadow-xl transition-all duration-300 overflow-hidden"
                  style={{ borderLeftColor: SEVERITY_COLORS[alert.severity] }}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold shadow-lg"
                          style={{ backgroundColor: SEVERITY_COLORS[alert.severity] }}
                        >
                          {alert.icon}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{alert.title}</h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-sm text-gray-500">📍 {alert.region}</span>
                            <span className="text-sm text-gray-400">•</span>
                            <span className="text-sm text-gray-500">🕒 {alert.time}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <span 
                          className="px-3 py-1 rounded-full text-sm font-semibold text-white shadow-sm"
                          style={{ backgroundColor: SEVERITY_COLORS[alert.severity] }}
                        >
                          {getSeverityIcon(alert.severity)} {alert.severity}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 mb-4 leading-relaxed">{alert.details}</p>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="text-sm text-gray-500">
                        Stay safe and follow official guidelines
                      </div>
                      <button
                        onClick={() => shareAlert(alert)}
                        className="bg-blue-50 hover:bg-blue-100 text-blue-600 px-4 py-2 rounded-xl font-semibold transition-all duration-200 flex items-center space-x-2"
                      >
                        <span>📤</span>
                        <span>Share</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}