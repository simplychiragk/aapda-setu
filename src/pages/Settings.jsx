// pages/Settings.jsx
import React, { useState } from "react";

export default function Settings() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  const styles = {
    container: {
      minHeight: "100vh",
      background: "linear-gradient(to bottom, #f8fafc, #e2e8f0)",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      color: "#0f172a",
      padding: "40px 20px",
      display: "flex",
      justifyContent: "center",
    },
    card: {
      background: "#fff",
      borderRadius: 16,
      padding: 28,
      width: "100%",
      maxWidth: 500,
      boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
      border: "1px solid #e5e7eb",
    },
    heading: {
      margin: 0,
      fontSize: 24,
      fontWeight: 700,
      color: "#1e40af",
      textAlign: "center",
    },
    option: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "14px 0",
      borderBottom: "1px solid #f1f5f9",
      fontSize: 16,
      fontWeight: 500,
    },
    toggle: (enabled) => ({
      width: 46,
      height: 26,
      borderRadius: 999,
      background: enabled ? "#2563eb" : "#cbd5e1",
      position: "relative",
      cursor: "pointer",
      transition: "background 0.25s ease",
    }),
    knob: (enabled) => ({
      width: 20,
      height: 20,
      borderRadius: "50%",
      background: "#fff",
      position: "absolute",
      top: 3,
      left: enabled ? 22 : 3,
      transition: "left 0.25s ease",
      boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
    }),
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.heading}>⚙ Settings</h1>

        {/* Dark Mode */}
        <div style={styles.option}>
          <span>Dark Mode</span>
          <div
            style={styles.toggle(darkMode)}
            onClick={() => setDarkMode(!darkMode)}
          >
            <div style={styles.knob(darkMode)} />
          </div>
        </div>

        {/* Notifications */}
        <div style={styles.option}>
          <span>Notifications</span>
          <div
            style={styles.toggle(notifications)}
            onClick={() => setNotifications(!notifications)}
          >
            <div style={styles.knob(notifications)} />
          </div>
        </div>
      </div>
    </div>
  );
}
