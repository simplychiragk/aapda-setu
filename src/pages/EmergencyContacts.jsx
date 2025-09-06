// EmergencyContacts.js
import React, { useState, useEffect } from "react";

export default function EmergencyContacts() {
  const [username, setUsername] = useState(localStorage.getItem("username") || "Guest");

  useEffect(() => {
    const storedName = localStorage.getItem("username");
    if (storedName) {
      setUsername(storedName);
    }
  }, []);

  const contacts = [
    { name: "Police", number: "100", color: "#dc2626" },
    { name: "Ambulance", number: "102", color: "#2563eb" },
    { name: "Fire Brigade", number: "101", color: "#f97316" },
    { name: "Disaster Helpline", number: "1078", color: "#059669" },
    { name: "Women Helpline", number: "1091", color: "#7c3aed" },
    { name: "Child Helpline", number: "1098", color: "#d97706" },
  ];

  const styles = {
    container: {
      minHeight: "100vh",
      background: "linear-gradient(to bottom, #f8fafc, #e2e8f0)",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      padding: "40px 20px",
    },
    heading: {
      textAlign: "center",
      fontSize: 28,
      fontWeight: 700,
      marginBottom: 12,
      color: "#0f172a",
    },
    subHeading: {
      textAlign: "center",
      fontSize: 18,
      fontWeight: 500,
      marginBottom: 24,
      color: "#475569",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
      gap: "18px",
      maxWidth: 1000,
      margin: "0 auto",
    },
    card: {
      background: "white",
      borderRadius: 12,
      padding: "20px",
      boxShadow: "0 6px 18px rgba(0,0,0,0.05)",
      textAlign: "center",
      transition: "transform 0.2s ease, box-shadow 0.2s ease",
    },
    button: {
      marginTop: 12,
      display: "inline-block",
      padding: "10px 16px",
      borderRadius: 8,
      fontWeight: 600,
      textDecoration: "none",
      color: "white",
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>🚨 Emergency Contacts</h1>
      <h2 style={styles.subHeading}>Hello, {username}! Stay safe 🙏</h2>

      <div style={styles.grid}>
        {contacts.map((c) => (
          <div
            key={c.name}
            style={styles.card}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-6px)";
              e.currentTarget.style.boxShadow = "0 14px 28px rgba(0,0,0,0.08)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 6px 18px rgba(0,0,0,0.05)";
            }}
          >
            <h2 style={{ fontSize: 20, color: "#0f172a" }}>{c.name}</h2>
            <p style={{ fontSize: 18, fontWeight: 600, color: "#475569" }}>
              {c.number}
            </p>
            <a
              href={`tel:${c.number}`}
              style={{ ...styles.button, background: c.color }}
            >
              Call Now
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
