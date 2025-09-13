// pages/Profile.jsx
import React, { useState, useEffect } from "react";

export default function Profile() {
  const [profile, setProfile] = useState({
    name: localStorage.getItem("username") || "Guest",
    age: localStorage.getItem("age") || "",
    height: localStorage.getItem("height") || "",
    weight: localStorage.getItem("weight") || "",
    email: localStorage.getItem("email") || "",
    phone: localStorage.getItem("phone") || "",
    address: localStorage.getItem("address") || "",
    bloodGroup: localStorage.getItem("bloodGroup") || "",
    emergencyContact: localStorage.getItem("emergencyContact") || "",
  });

  // Preparedness is read-only (from drills & quizzes)
  const [preparedness] = useState(parseInt(localStorage.getItem("preparedness")) || 0);

  // Save profile info (not preparedness)
  useEffect(() => {
    for (let key in profile) {
      localStorage.setItem(key, profile[key]);
    }
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div style={{ padding: 20, maxWidth: 900, margin: "0 auto", fontFamily: "Segoe UI, sans-serif" }}>
      <h1 style={{ textAlign: "center", color: "#1e40af", marginBottom: 20 }}>👤 My Profile</h1>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24 }}>
        {/* Profile Info Form */}
        <form
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 16,
            background: "white",
            padding: 20,
            borderRadius: 12,
            boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
          }}
        >
          <label>
            Name:
            <input type="text" name="name" value={profile.name} onChange={handleChange} />
          </label>
          <label>
            Age:
            <input type="number" name="age" value={profile.age} onChange={handleChange} />
          </label>
          <label>
            Height (cm):
            <input type="number" name="height" value={profile.height} onChange={handleChange} />
          </label>
          <label>
            Weight (kg):
            <input type="number" name="weight" value={profile.weight} onChange={handleChange} />
          </label>
          <label>
            Email:
            <input type="email" name="email" value={profile.email} onChange={handleChange} />
          </label>
          <label>
            Phone:
            <input type="tel" name="phone" value={profile.phone} onChange={handleChange} />
          </label>
          <label style={{ gridColumn: "1 / span 2" }}>
            Address:
            <textarea
              name="address"
              value={profile.address}
              onChange={handleChange}
              rows="2"
              style={{ width: "100%" }}
            />
          </label>
          <label>
            Blood Group:
            <input type="text" name="bloodGroup" value={profile.bloodGroup} onChange={handleChange} />
          </label>
          <label>
            Emergency Contact:
            <input type="tel" name="emergencyContact" value={profile.emergencyContact} onChange={handleChange} />
          </label>
        </form>

        {/* Preparedness Card */}
        <div
          style={{
            background: "linear-gradient(135deg,#dbeafe,#bfdbfe)",
            borderRadius: 12,
            padding: 20,
            textAlign: "center",
            boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
          }}
        >
          <h2 style={{ marginBottom: 10 }}>📊 Preparedness</h2>
          <div style={{ fontSize: 32, fontWeight: 700, color: preparedness > 70 ? "#16a34a" : "#f59e0b" }}>
            {preparedness}%
          </div>
          <div style={{ height: 12, borderRadius: 6, background: "#e2e8f0", marginTop: 8 }}>
            <div
              style={{
                width: `${preparedness}%`,
                background: preparedness > 70 ? "#16a34a" : "#facc15",
                height: "100%",
                borderRadius: 6,
              }}
            ></div>
          </div>
          <p style={{ marginTop: 10, color: "#334155", fontWeight: 500 }}>
            This score increases as you complete quizzes and drills.
          </p>

          {/* Badges */}
          <div style={{ marginTop: 16, textAlign: 'left' }}>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>🏅 Badges</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {(JSON.parse(localStorage.getItem('badges') || '[]')).length === 0 ? (
                <span style={{ color: '#64748b' }}>No badges yet. Take a quiz or complete drills!</span>
              ) : (
                (JSON.parse(localStorage.getItem('badges') || '[]')).map((b) => (
                  <span key={b} style={{ padding: '6px 10px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 999, fontWeight: 600 }}>{b}</span>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
