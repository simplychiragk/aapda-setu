import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

/** Utils */
function hexToRGBA(hex, alpha = 0.14) {
  const h = hex.replace("#", "");
  const bigint = parseInt(h, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

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
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchAlerts() {
      try {
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
      }
    }

    fetchAlerts();
  }, []);

  // Filter alerts by state
  const filtered = useMemo(() => {
    if (selectedState === "All India") return alerts;
    return alerts.filter((a) =>
      ((a.title || "") + (a.details || "") + (a.region || "")).toLowerCase().includes(selectedState.toLowerCase())
    );
  }, [alerts, selectedState]);

  // Share alert
  const shareAlert = async (alert) => {
    const text = `${alert.title} (${alert.severity})\nRegion: ${alert.region}\n${alert.details}\nTime: ${alert.time}\n— via Aapda Setu`;
    try {
      if (navigator.share) await navigator.share({ title: alert.title, text });
      else {
        await navigator.clipboard.writeText(text);
        window.alert("Copied alert to clipboard!");
      }
    } catch {}
  };

  const styles = {
    container: { padding: 20 },
    header: { display: "flex", justifyContent: "space-between", marginBottom: 16 },
    card: { padding: 16, marginBottom: 12, borderRadius: 12, boxShadow: "0 2px 6px rgba(0,0,0,0.1)" },
    backBtn: { padding: "6px 12px", background: "#2563eb", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" },
    select: { padding: "6px 12px", borderRadius: 6, border: "1px solid #2563eb", cursor: "pointer", marginBottom: 20 },
    shareBtn: { padding: "6px 12px", background: "#059669", color: "#fff", border: "none", borderRadius: 6, marginTop: 10, cursor: "pointer" },
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>📢 Disaster Alerts (India)</h2>
        <button style={styles.backBtn} onClick={() => navigate(-1)}>⬅ Back</button>
      </div>

      {/* All India / State Dropdown */}
      <div style={{ marginBottom: 20 }}>
        <select style={styles.select} value={selectedState} onChange={(e) => setSelectedState(e.target.value)}>
          <option>All India</option>
          {STATES.map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>

      {/* Notifications Toggle */}
      <button
        style={{ ...styles.backBtn, background: pushEnabled ? "#059669" : "#6b7280", marginBottom: 20 }}
        onClick={() => setPushEnabled(!pushEnabled)}
      >
        {pushEnabled ? "Disable Notifications" : "Enable Notifications"}
      </button>

      {/* Alerts List */}
      {filtered.length === 0 ? (
        <p>No alerts available for {selectedState}.</p>
      ) : (
        filtered.map((a) => (
          <div key={a.id} style={{ ...styles.card, borderLeft: `6px solid ${SEVERITY_COLORS[a.severity]}`, background: hexToRGBA(SEVERITY_COLORS[a.severity], 0.08) }}>
            <h3>{a.icon} {a.title}</h3>
            <p><strong>{a.region}</strong> — {a.time}</p>
            <p>Severity: {a.severity}</p>
            <p>{a.details}</p>
            <button style={styles.shareBtn} onClick={() => shareAlert(a)}>📤 Share this alert</button>
          </div>
        ))
      )}
    </div>
  );
}
