// Dashboard.jsx
 import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function hexToRGBA(hex, alpha = 0.12) {
  const h = hex.replace("#", "");
  const bigint = parseInt(h, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default function Dashboard() {
  const [showProfile, setShowProfile] = useState(false);
  const [time, setTime] = useState(new Date());
  const [tip, setTip] = useState("");
  const [username, setUsername] = useState(localStorage.getItem("username") || "");
  const [showLoginPopup, setShowLoginPopup] = useState(!localStorage.getItem("username"));
  const [inputName, setInputName] = useState("");
  const [preparedness, setPreparedness] = useState(
    parseInt(localStorage.getItem("preparedness")) || 0
  );

  useEffect(() => {
    localStorage.setItem("preparedness", preparedness);
  }, [preparedness]);

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const tips = [
    "Keep a first aid kit ready at all times.",
    "Always have at least 2 emergency contacts saved.",
    "During an earthquake: Duck, Cover, and Hold On.",
    "Store enough food and water for 72 hours.",
    "Learn basic fire extinguisher use.",
    "Charge your phone during weather warnings.",
    "Know your nearest hospital and police station.",
    "Keep flashlights and batteries handy.",
    "Plan an emergency family meeting spot.",
    "Do not spread rumors during a disaster.",
  ];

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * tips.length);
    setTip(tips[randomIndex]);
  }, []);

  const formatTime = (date) => {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${hours}:${minutes < 10 ? "0" + minutes : minutes} ${ampm}`;
  };

  const cardData = [
    { to: "/alerts", icon: "🔔", title: "Real-Time Alerts", description: "Get immediate notifications about disasters in your area.", color: "#dc2626" },
    { to: "/videos", icon: "🎬", title: "Video Library", description: "Learn disaster preparedness with our curated educational videos.", color: "#2563eb" },
    { to: "/quizzes", icon: "❓", title: "Quizzes", description: "Test your knowledge and earn badges for disaster preparedness.", color: "#059669" },
    { to: "/drills", icon: "🧯", title: "Virtual Drills", description: "Practice emergency procedures through interactive simulations.", color: "#7c3aed" },
    { to: "/contacts", icon: "📞", title: "Emergency Contacts", description: "Quick access to emergency services and important contacts.", color: "#d97706" },
    { to: "/game", icon: "🎮", title: "Memory Game", description: "Sharpen your memory with our disaster icons game.", color: "#0ea5e9" },
    { to: "/profile", icon: "👤", title: "Profile", description: "View and update your personal information.", color: "#f43f5e" },
    { to: "/settings", icon: "⚙️", title: "Settings", description: "Manage your account and preferences.", color: "#6b7280" },
  ];

  const styles = {
    container: { minHeight: "100vh", background: "linear-gradient(to bottom, #f8fafc 0%, #e2e8f0 100%)", color: "#1e293b", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" },
    nav: { background: "rgba(255, 255, 255, 0.9)", WebkitBackdropFilter: "blur(6px)", backdropFilter: "blur(6px)", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", padding: "12px 24px", marginBottom: "24px", position: "relative" },
    profilePopup: { position: "absolute", top: "60px", right: "10px", background: "white", borderRadius: 12, padding: "16px", boxShadow: "0 6px 18px rgba(0,0,0,0.1)", width: 240, zIndex: 100 },
    loginPopupOverlay: { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200 },
    loginPopup: { background: "white", padding: "24px", borderRadius: 12, width: 300, textAlign: "center", boxShadow: "0 6px 18px rgba(0,0,0,0.15)" },
  };

  const buttonStyle = { padding: "8px 12px", borderRadius: 8, border: "none", cursor: "pointer", background: "#2563eb", color: "#fff", fontSize: 14, fontWeight: 500, textAlign: "center", textDecoration: "none" };

  const handleLogin = () => {
    if (inputName.trim() !== "") {
      localStorage.setItem("username", inputName);
      setUsername(inputName);
      setShowLoginPopup(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("username");
    setUsername("");
    setShowLoginPopup(true);
    setShowProfile(false);
  };

  return (
    <div style={styles.container}>
      {/* ✅ Login Popup */}
      {showLoginPopup && (
        <div style={styles.loginPopupOverlay}>
          <div style={styles.loginPopup}>
            <h2>Welcome 👋</h2>
            <p>Please enter your name:</p>
            <input
              type="text"
              value={inputName}
              onChange={(e) => setInputName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              placeholder="Enter your name"
              style={{ width: "100%", padding: "8px", borderRadius: 6, border: "1px solid #ccc", marginBottom: 12 }}
            />
            <button style={buttonStyle} onClick={handleLogin}>Continue</button>
          </div>
        </div>
      )}

      {/* ✅ NAV */}
      <nav style={styles.nav}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {/* ✅ Just Text Logo */}
          <div style={{ fontSize: 20, fontWeight: 700, color: "#2563eb" }}>Aapda Setu</div>

          <div style={{ fontWeight: 600, fontSize: 16, color: "#1e293b" }}>{formatTime(time)}</div>

          {/* ✅ Profile */}
          <div style={{ position: "relative" }}>
            {username ? (
              <div
                style={{ width: 40, height: 40, borderRadius: "50%", background: "#0ea5e9", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "bold", fontSize: 16, cursor: "pointer" }}
                onClick={() => setShowProfile((s) => !s)}
              >
                {username[0].toUpperCase()}
              </div>
            ) : (
              <img
                src="https://i.pravatar.cc/150?img=65"
                alt="User"
                style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover", cursor: "pointer" }}
                onClick={() => setShowProfile((s) => !s)}
              />
            )}

            {showProfile && (
              <div style={styles.profilePopup}>
                <div style={{ marginBottom: 8, fontSize: 14 }}><b>Name:</b> {username || "Guest"}</div>

                {/* ✅ Progress Bar inside profile */}
                <div style={{ marginBottom: 8 }}>
                  <b>Preparedness:</b> {preparedness}%
                  <div style={{ height: 6, borderRadius: 3, background: "#e2e8f0", marginTop: 4 }}>
                    <div style={{ width: `${preparedness}%`, background: "#16a34a", height: "100%", borderRadius: 3 }}></div>
                  </div>
                </div>

                <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
                  <Link to="/profile" style={buttonStyle}>View Profile</Link>
                  <Link to="/settings" style={buttonStyle}>Settings</Link>
                  <button onClick={handleLogout} style={{ ...buttonStyle, background: "#dc2626" }}>Logout</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* ✅ MAIN */}
      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px 40px" }}>
        {/* ✅ Welcome Section with preparedness line */}
        <section style={{ background: "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)", borderRadius: "12px", padding: "20px", marginBottom: "24px", textAlign: "center" }}>
          <h1 style={{ margin: 0, fontSize: 24 }}>Welcome back, {username || "User"}!</h1>
          <p style={{ marginTop: 8, color: "#475569" }}>Stay prepared and informed with the latest disaster management resources.</p>

          {/* ✅ Fun preparedness line */}
          <div style={{ marginTop: 14, fontSize: 16, fontWeight: 600, color: "#0f172a" }}>
            🎯 This is your preparedness level: <span style={{ color: "#16a34a" }}>{preparedness}%</span> — Keep it up!
          </div>

          <div style={{ marginTop: 12, fontSize: 15, fontWeight: 600, color: "#0f172a" }}>
            💡 Safety Tip: {tip}
          </div>
        </section>

        {/* ✅ Tools Grid */}
        <section>
          <h2 style={{ marginBottom: 12, color: "#0f172a" }}>Disaster Management Tools</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: "16px" }}>
            {cardData.map((card) => (
              <Link
                key={card.title}
                to={card.to}
                style={{
                  background: "white",
                  borderRadius: "12px",
                  padding: "16px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
                  border: "1px solid #e6eef6",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  textDecoration: "none",
                  color: "inherit"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-3px)";
                  e.currentTarget.style.boxShadow = "0 6px 16px rgba(0,0,0,0.08)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.04)";
                }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div style={{ width: 48, height: 48, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, marginRight: 10, background: hexToRGBA(card.color, 0.14) }}>{card.icon}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>{card.title}</div>
                    <div style={{ color: "#475569", marginTop: 4, fontSize: 13 }}>{card.description}</div>
                    <div style={{ marginTop: 6, color: card.color, fontWeight: 600, fontSize: 13 }}>Go to {card.title.split(" ")[0]} →</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
