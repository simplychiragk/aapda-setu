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
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900 transition-colors duration-200">
      {/* NAV */}
      <nav className="bg-white/90 backdrop-blur-sm shadow-sm py-3 mb-6 dark:bg-gray-800/90">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="text-xl font-bold text-blue-700 dark:text-blue-400">
            Aapda Setu
          </div>
          <div>
            <img
              src="https://i.pravatar.cc/150?img=12"
              alt="User"
              className="w-10 h-10 rounded-full object-cover"
            />
          </div>
        </div>
      </nav>

      {/* MAIN */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        {/* Welcome */}
        <section className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 mb-7 text-center dark:from-blue-900/30 dark:to-blue-800/30">
          <h1 className="text-3xl font-bold text-slate-800 mb-2 dark:text-white">
            Virtual Drills
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto dark:text-slate-300">
            Choose a disaster type, pick a drill, then start practicing step-by-step.
          </p>
        </section>

        {/* Level 1: disaster categories */}
        {!selectedCategory && (
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
            {DRILLS.map((c) => (
              <div
                key={c.id}
                className="bg-white/70 backdrop-blur-xl border border-slate-200 rounded-xl p-5 text-center cursor-pointer shadow-sm hover:scale-105 transition-all duration-200 dark:bg-gray-800/50 dark:border-gray-700/50"
                onClick={() => {
                  setSelectedCategory(c.id);
                  setSelectedDrill(null);
                  setStarted(false);
                  setStepIdx(0);
                  setCompleted(false);
                }}
              >
                <div 
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-3"
                  style={{
                    background: hexToRGBA(c.color, 0.16),
                    color: c.color
                  }}
                >
                  {c.icon}
                </div>
                <div className="font-bold text-slate-800 dark:text-white">
                  {c.title}
                </div>
                <div className="text-slate-500 text-sm mt-2 dark:text-slate-400">
                  {c.drills.length} drills
                </div>
              </div>
            ))}
          </section>
        )}

        {/* Level 2: drills inside selected category */}
        {selectedCategory && !selectedDrill && (
          <section className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {category.drills.map((d) => (
              <div
                key={d.id}
                className="bg-white/70 backdrop-blur-xl border border-slate-200 rounded-xl p-5 text-center cursor-pointer shadow-sm hover:scale-105 transition-all duration-200 dark:bg-gray-800/50 dark:border-gray-700/50"
                onClick={() => enterDrillIntro(d.id)}
              >
                <div 
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-3"
                  style={{
                    background: hexToRGBA(category.color, 0.16),
                    color: category.color
                  }}
                >
                  {category.icon}
                </div>
                <div className="font-bold text-slate-800 dark:text-white">
                  {d.title}
                </div>
                <div className="text-slate-500 text-sm mt-2 dark:text-slate-400">
                  {d.description}
                </div>
              </div>
            ))}
            <div className="sm:col-span-2">
              <button 
                className="px-4 py-2.5 border border-slate-300 rounded-lg bg-white text-slate-700 font-medium hover:bg-slate-50 transition-colors dark:bg-gray-700 dark:border-gray-600 dark:text-slate-300 dark:hover:bg-gray-600"
                onClick={resetAll}
              >
                ← Back to Categories
              </button>
            </div>
          </section>
        )}

        {/* Level 3: inside a drill */}
        {drill && (
          <section className="bg-white/70 backdrop-blur-xl border border-slate-200 rounded-xl p-6 shadow-sm dark:bg-gray-800/50 dark:border-gray-700/50">
            <h2 className="text-2xl font-bold text-slate-800 mb-2 dark:text-white">
              {drill.title}
            </h2>
            <p className="text-slate-600 text-sm mb-6 dark:text-slate-400">
              {drill.description}
            </p>

            {!started && !completed && (
              <div className="flex flex-wrap gap-3">
                <button 
                  className="px-4 py-2.5 border border-slate-300 rounded-lg bg-white text-slate-700 font-medium hover:bg-slate-50 transition-colors dark:bg-gray-700 dark:border-gray-600 dark:text-slate-300 dark:hover:bg-gray-600"
                  onClick={resetToCategory}
                >
                  ← Back to Drills
                </button>
                <button 
                  className="px-4 py-2.5 border border-blue-600 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
                  onClick={startDrill}
                >
                  ▶ Start Drill
                </button>
              </div>
            )}

            {started && !completed && (
              <>
                <div className="bg-slate-100 rounded-lg p-4 mb-4 dark:bg-gray-700">
                  <p className="text-slate-800 text-lg dark:text-white">
                    {drill.steps[stepIdx]}
                  </p>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-slate-200 rounded-full h-3 mb-2 dark:bg-gray-700">
                  <div 
                    className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${percent}%` }}
                  ></div>
                </div>
                <p className="text-slate-500 text-sm mb-6 dark:text-slate-400">
                  {percent}% complete
                </p>

                <div className="flex flex-wrap gap-3">
                  <button 
                    className="px-4 py-2.5 border border-slate-300 rounded-lg bg-white text-slate-700 font-medium hover:bg-slate-50 transition-colors dark:bg-gray-700 dark:border-gray-600 dark:text-slate-300 dark:hover:bg-gray-600"
                    onClick={resetToCategory}
                  >
                    ← Back to Drills
                  </button>
                  {stepIdx > 0 && (
                    <button 
                      className="px-4 py-2.5 border border-slate-300 rounded-lg bg-white text-slate-700 font-medium hover:bg-slate-50 transition-colors dark:bg-gray-700 dark:border-gray-600 dark:text-slate-300 dark:hover:bg-gray-600"
                      onClick={previousStep}
                    >
                      ← Previous
                    </button>
                  )}
                  <button 
                    className="px-4 py-2.5 border border-blue-600 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
                    onClick={completeStep}
                  >
                    {stepIdx < drill.steps.length - 1 ? "Next →" : "Finish ✔"}
                  </button>
                </div>
              </>
            )}

            {completed && (
              <>
                <div className="bg-green-100 border border-green-200 rounded-lg p-4 mb-4 dark:bg-green-900/30 dark:border-green-800">
                  <p className="text-green-800 font-medium dark:text-green-300">
                    ✅ {drill.title} completed! Great job!
                  </p>
                </div>
                <button 
                  className="px-4 py-2.5 border border-slate-300 rounded-lg bg-white text-slate-700 font-medium hover:bg-slate-50 transition-colors dark:bg-gray-700 dark:border-gray-600 dark:text-slate-300 dark:hover:bg-gray-600"
                  onClick={resetToCategory}
                >
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
