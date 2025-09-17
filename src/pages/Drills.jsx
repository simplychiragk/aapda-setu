import React, { useState } from "react";
import { NotificationContext } from "../context/NotificationContext";

/** Utils */
function hexToRGBA(hex, alpha = 0.14) {
  const h = hex.replace("#", "");
  const bigint = parseInt(h, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/** Data: disasters -> multiple drills per disaster */
const DRILLS = [
  {
    id: "earthquake",
    title: "Earthquake",
    icon: "🏚",
    color: "#dc2626",
    drills: [
      {
        id: "eq-evac",
        title: "Evacuation Drill",
        description: "Practice safe exit, assembly points and crowd control.",
        steps: [
          "Duck, cover, and hold until shaking stops.",
          "Check immediate surroundings for hazards (glass, heavy furniture).",
          "Evacuate calmly using the planned route.",
          "Gather at the family assembly point and check everyone.",
        ],
      },
      {
        id: "eq-firstaid",
        title: "First Aid Drill",
        description: "Basic triage and first-aid for common quake injuries.",
        steps: [
          "Check yourself and others for major injuries.",
          "Stop heavy bleeding with direct pressure and bandages.",
          "Immobilize seriously injured limbs; do not move if spinal injury suspected.",
          "Call emergency services if needed and monitor vitals.",
        ],
      },
    ],
  },
  {
    id: "flood",
    title: "Flood",
    icon: "🌊",
    color: "#2563eb",
    drills: [
      {
        id: "flood-evac",
        title: "Evacuation Drill",
        description: "Move to higher ground and practice safe exit routes.",
        steps: [
          "Move valuables and documents to higher ground.",
          "Turn off electricity if water reaches electrical outlets.",
          "Follow evacuation routes to relief shelters.",
          "Do not drive through moving flood water; wait for clearance.",
        ],
      },
      {
        id: "flood-safety",
        title: "Family Safety Drill",
        description: "Family roles & emergency communication during floods.",
        steps: [
          "Assign roles: who grabs the go-bag, who checks pets, who calls relatives.",
          "Practice sending a short emergency SMS with location.",
          "Identify nearest safe shelter on a map and a secondary route.",
          "Rehearse moving elderly/children safely to higher floors.",
        ],
      },
    ],
  },
  {
    id: "fire",
    title: "Fire",
    icon: "🔥",
    color: "#d97706",
    drills: [
      {
        id: "fire-escape",
        title: "Escape Route Drill",
        description: "Identify exits and practice getting out quickly.",
        steps: [
          "Identify at least two exit routes from each room.",
          "Practice staying low under smoke and covering the nose.",
          "Exit quickly and avoid elevators.",
          "Gather at the outdoor assembly point and call services.",
        ],
      },
      {
        id: "fire-extinct",
        title: "Extinguisher Drill",
        description: "Safe use of fire extinguisher (PASS) and assessment.",
        steps: [
          "Check if it's safe to fight the fire (small, no people trapped).",
          "Use PASS: Pull, Aim, Squeeze, Sweep.",
          "If extinguisher fails or fire grows, evacuate immediately.",
          "Report the fire and help ensure everyone is accounted for.",
        ],
      },
    ],
  },
  {
    id: "cyclone",
    title: "Cyclone",
    icon: "🌀",
    color: "#7c3aed",
    drills: [
      {
        id: "cyclone-secure",
        title: "Secure Home Drill",
        description: "How to secure loose items and prepare sheltering.",
        steps: [
          "Secure loose objects on balconies and yards.",
          "Close and fasten all windows and doors; shutter if available.",
          "Move to an interior room away from windows.",
          "Keep emergency supplies and radio ready for official updates.",
        ],
      },
      {
        id: "cyclone-evac",
        title: "Evacuation Drill",
        description: "When and how to move to a community shelter safely.",
        steps: [
          "Monitor official advisories and decide early to evacuate if told.",
          "Pack the go-bag quickly (meds, docs, water, torch).",
          "Follow the designated evacuation route to the shelter.",
          "Register with shelter staff and follow instructions.",
        ],
      },
    ],
  },
  {
    id: "heatwave",
    title: "Heatwave",
    icon: "☀",
    color: "#f97316",
    drills: [
      {
        id: "heat-hydration",
        title: "Hydration Drill",
        description: "Practice hydration and shaded rest routines.",
        steps: [
          "Ensure you and family drink small amounts frequently.",
          "Stay in shade or cool rooms during peak hours.",
          "Apply cool compresses and remove excess clothing.",
          "Check on elderly and infants every hour.",
        ],
      },
      {
        id: "heat-prep",
        title: "Preparation Drill",
        description: "Home prep to reduce heat exposure and illness risk.",
        steps: [
          "Plan indoor activities and avoid strenuous outdoor work.",
          "Ensure fans/AC are functional, and have backup water.",
          "Wear light, breathable clothing and hats when outside.",
          "Know signs of heatstroke and when to seek help.",
        ],
      },
    ],
  },
];

export default function Drills() {
  const { addNotification } = React.useContext(NotificationContext);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedDrill, setSelectedDrill] = useState(null);
  const [started, setStarted] = useState(false);
  const [stepIdx, setStepIdx] = useState(0);
  const [completed, setCompleted] = useState(false);

  const category = DRILLS.find((c) => c.id === selectedCategory) || null;
  const drill = category?.drills.find((d) => d.id === selectedDrill) || null;
  const totalSteps = drill ? drill.steps.length : 0;
  const percent = drill ? Math.round(((stepIdx + 1) / totalSteps) * 100) : 0;

  const resetToCategory = () => {
    setSelectedDrill(null);
    setStarted(false);
    setStepIdx(0);
    setCompleted(false);
  };
  const resetAll = () => {
    setSelectedCategory(null);
    setSelectedDrill(null);
    setStarted(false);
    setStepIdx(0);
    setCompleted(false);
  };

  const styles = {
    container: {
      minHeight: "100vh",
      background: "linear-gradient(to bottom, #f8fafc 0%, #e2e8f0 100%)",
      color: "#1e293b",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    nav: {
      background: "rgba(255, 255, 255, 0.9)",
      WebkitBackdropFilter: "blur(6px)",
      backdropFilter: "blur(6px)",
      boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
      padding: "12px 24px",
      marginBottom: "24px",
    },
    welcomeSection: {
      background: "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)",
      borderRadius: "12px",
      padding: "28px",
      marginBottom: "28px",
      textAlign: "center",
      boxShadow: "0 8px 20px rgba(0,0,0,0.04)",
    },
    cardGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
      gap: 18,
    },
    tile: {
      background: "white",
      borderRadius: "12px",
      padding: "18px",
      boxShadow: "0 6px 18px rgba(0,0,0,0.04)",
      border: "1px solid #e6eef6",
      textAlign: "center",
      cursor: "pointer",
      transition: "transform 0.18s ease, box-shadow 0.18s ease",
    },
    iconBox: (color) => ({
      width: 64,
      height: 64,
      borderRadius: 16,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 28,
      margin: "0 auto 12px",
      background: hexToRGBA(color, 0.16),
      color,
    }),
    card: {
      background: "#fff",
      borderRadius: 12,
      padding: 18,
      border: "1px solid #e6eef6",
      boxShadow: "0 6px 18px rgba(0,0,0,0.04)",
    },
    progressOuter: {
      height: 12,
      background: "#e2e8f0",
      borderRadius: 999,
      overflow: "hidden",
      marginTop: 18,
      marginBottom: 12,
    },
    progressInner: (p) => ({
      height: "100%",
      width: `${p}%`,
      background: "#2563eb",
      transition: "width 300ms ease",
    }),
    button: {
      primary: {
        padding: "10px 16px",
        borderRadius: 10,
        border: "1px solid #2563eb",
        background: "#2563eb",
        color: "#fff",
        fontWeight: 600,
        cursor: "pointer",
      },
      secondary: {
        padding: "10px 16px",
        borderRadius: 10,
        border: "1px solid #e2e8f0",
        background: "#ffffff",
        color: "#0f172a",
        fontWeight: 600,
        cursor: "pointer",
      },
    },
    smallMuted: { fontSize: 13, color: "#6b7280" },
  };

  const startDrill = () => {
    setStarted(true);
    setStepIdx(0);
    setCompleted(false);
  };

  const completeStep = () => {
    if (!drill) return;
    if (stepIdx < drill.steps.length - 1) {
      setStepIdx((s) => s + 1);
    } else {
      setStepIdx(drill.steps.length - 1);
      setCompleted(true);
      setStarted(false);

      // ✅ Save completion to report
      const report = JSON.parse(localStorage.getItem("drillReports")) || [];
      report.push({
        drillId: drill.id,
        drillTitle: drill.title,
        category: category.title,
        date: new Date().toLocaleString(),
      });
      localStorage.setItem("drillReports", JSON.stringify(report));

      // ✅ Update Preparedness Score (+15 per drill, cap 100)
      let current = parseInt(localStorage.getItem("preparedness")) || 0;
      let updated = Math.min(current + 15, 100);
      localStorage.setItem("preparedness", updated);

      // ✅ Badges: Safety Pro when all drills in category done at least once
      const done = JSON.parse(localStorage.getItem("drillsDoneById") || "{}");
      done[drill.id] = true;
      localStorage.setItem("drillsDoneById", JSON.stringify(done));
      const allIds = DRILLS.flatMap((c) => c.drills.map((d) => d.id));
      const allDone = allIds.every((id) => done[id]);
      if (allDone) {
        const badges = JSON.parse(localStorage.getItem("badges") || "[]");
        if (!badges.includes("Safety Pro")) {
          localStorage.setItem("badges", JSON.stringify([...badges, "Safety Pro"]));
          addNotification("🏅 Earned badge: Safety Pro");
        }
      }

      window.setTimeout(() => {
        window.alert(`✅ ${drill.title} completed! Great job!`);
      }, 50);
    }
  };

  const previousStep = () => {
    setStepIdx((s) => Math.max(0, s - 1));
    setCompleted(false);
    setStarted(true);
  };

  const enterDrillIntro = (drillId) => {
    setSelectedDrill(drillId);
    setStarted(false);
    setStepIdx(0);
    setCompleted(false);
  };

  return (
    <div style={styles.container}>
      {/* NAV */}
      <nav style={styles.nav}>
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ fontSize: 20, color: "#1e40af", fontWeight: 700 }}>
            Aapda Setu
          </div>
          <div>
            <img
              src="https://i.pravatar.cc/150?img=12"
              alt="User"
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
          </div>
        </div>
      </nav>

      {/* MAIN */}
      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px 40px" }}>
        {/* Welcome */}
        <section style={styles.welcomeSection}>
          <h1 style={{ margin: 0, fontSize: 28, color: "#0f172a" }}>
            Virtual Drills
          </h1>
          <p
            style={{
              color: "#475569",
              marginTop: 8,
              maxWidth: 760,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            Choose a disaster type, pick a drill, then start practicing step-by-step.
          </p>
        </section>

        {/* Level 1: disaster categories */}
        {!selectedCategory && (
          <section style={styles.cardGrid}>
            {DRILLS.map((c) => (
              <div
                key={c.id}
                style={styles.tile}
                onClick={() => {
                  setSelectedCategory(c.id);
                  setSelectedDrill(null);
                  setStarted(false);
                  setStepIdx(0);
                  setCompleted(false);
                }}
              >
                <div style={styles.iconBox(c.color)}>{c.icon}</div>
                <div style={{ fontWeight: 700, fontSize: 16, color: "#0f172a" }}>
                  {c.title}
                </div>
                <div style={{ marginTop: 8, color: "#64748b", fontSize: 13 }}>
                  {c.drills.length} drills
                </div>
              </div>
            ))}
          </section>
        )}

        {/* Level 2: drills inside selected category */}
        {selectedCategory && !selectedDrill && (
          <section style={styles.cardGrid}>
            {category.drills.map((d) => (
              <div
                key={d.id}
                style={styles.tile}
                onClick={() => enterDrillIntro(d.id)}
              >
                <div style={styles.iconBox(category.color)}>{category.icon}</div>
                <div style={{ fontWeight: 700, fontSize: 16, color: "#0f172a" }}>
                  {d.title}
                </div>
                <div style={{ marginTop: 8, color: "#64748b", fontSize: 13 }}>
                  {d.description}
                </div>
              </div>
            ))}
            <button style={styles.button.secondary} onClick={resetAll}>
              ← Back to Categories
            </button>
          </section>
        )}

        {/* Level 3: inside a drill */}
        {drill && (
          <section style={styles.card}>
            <h2 style={{ marginTop: 0, color: "#0f172a" }}>{drill.title}</h2>
            <p style={styles.smallMuted}>{drill.description}</p>

            {!started && !completed && (
              <div style={{ display: "flex", gap: 12 }}>
                <button style={styles.button.secondary} onClick={resetToCategory}>
                  ← Back to Drills
                </button>
                <button style={styles.button.primary} onClick={startDrill}>
                  ▶ Start Drill
                </button>
              </div>
            )}

            {started && !completed && (
              <>
                <p style={{ marginTop: 14 }}>{drill.steps[stepIdx]}</p>
                <div style={styles.progressOuter}>
                  <div style={styles.progressInner(percent)} />
                </div>
                <p style={styles.smallMuted}>{percent}% complete</p>

                <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
                  <button style={styles.button.secondary} onClick={resetToCategory}>
                    ← Back to Drills
                  </button>
                  {stepIdx > 0 && (
                    <button style={styles.button.secondary} onClick={previousStep}>
                      ← Previous
                    </button>
                  )}
                  <button style={styles.button.primary} onClick={completeStep}>
                    {stepIdx < drill.steps.length - 1 ? "Next →" : "Finish ✔"}
                  </button>
                </div>
              </>
            )}

            {completed && (
              <>
                <p>✅ {drill.title} completed! Great job!</p>
                <button style={styles.button.secondary} onClick={resetToCategory}>
                  ← Back to Drills
                </button>
              </>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
