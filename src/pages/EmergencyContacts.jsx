import React, { useEffect, useMemo, useState } from "react";

// EmergencyContacts.jsx
// Refactored: "National Emergency Directory" — serious, professional, theme-aware, glassmorphism

const CONTACTS = [
  { name: "Police", number: "100", color: "#D50000", icon: "🚓", description: "For crimes, accidents, and immediate law-and-order assistance" },
  { name: "Ambulance", number: "102", color: "#0EA5E9", icon: "🚑", description: "Medical emergencies and urgent medical transport" },
  { name: "Fire Brigade", number: "101", color: "#F97316", icon: "🚒", description: "Fire, rescue and related emergencies" },
  { name: "Disaster Helpline", number: "1078", color: "#059669", icon: "🆘", description: "Natural disasters and large-scale coordination" },
  { name: "Women Helpline", number: "1091", color: "#7C3AED", icon: "👩", description: "Women safety and immediate support" },
  { name: "Child Helpline", number: "1098", color: "#D97706", icon: "👶", description: "Child protection and welfare" },
  { name: "Tourist Helpline", number: "1363", color: "#0284C7", icon: "🧳", description: "Assistance for travellers and tourists" },
  { name: "Railway Helpline", number: "139", color: "#7C3AED", icon: "🚂", description: "Railway emergencies and assistance" }
];

const ACCENT_ORANGE = "#FF6F00"; // primary call-to-action color
const ALERT_RED = "#D50000"; // emergency banner color

export default function EmergencyContacts() {
  const [username, setUsername] = useState(() => localStorage.getItem("username") || "Guest");
  const [query, setQuery] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("username");
    if (stored) setUsername(stored);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return CONTACTS;
    return CONTACTS.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.number.includes(q) ||
      c.description.toLowerCase().includes(q)
    );
  }, [query]);

  const handleCall = (num) => {
    // use tel: link — mobile devices will prompt call
    window.location.href = `tel:${num}`;
  };

  const handleShare = async (contact) => {
    const text = `${contact.name} — ${contact.number}\n${contact.description}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: `${contact.name} (Emergency)`, text });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        alert("Contact copied to clipboard");
      } else {
        alert(text);
      }
    } catch (e) {
      console.error("share failed", e);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#212121] text-slate-900 dark:text-white py-6">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <header className="rounded-2xl overflow-hidden mb-6">
          <div className="w-full px-6 py-8" style={{ background: '#0D47A1' }}>
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-2xl md:text-3xl font-extrabold text-white">National Emergency Directory</h1>
              <p className="text-white/90 mt-2">Quick access to verified emergency numbers — stay calm, call fast.</p>
            </div>
          </div>
        </header>

        {/* Search + username */}
        <div className="mb-6">
          <div className={
            "rounded-2xl p-4 flex flex-col md:flex-row items-center gap-4 " +
            "bg-white/70 border border-slate-200 backdrop-blur-xl dark:bg-gray-800/50 dark:backdrop-blur-xl dark:border dark:border-slate-700"
          }>
            <div className="flex-1 w-full">
              <label htmlFor="ec-search" className="sr-only">Search emergency contacts</label>
              <div className="relative">
                <input
                  id="ec-search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by service, number or description..."
                  className="w-full rounded-xl py-3 pl-12 pr-4 text-sm outline-none bg-transparent text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  aria-label="Search emergency contacts"
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M11 19a8 8 0 100-16 8 8 0 000 16z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-sm text-slate-600 dark:text-slate-400">Signed in as</div>
              <div className="px-3 py-2 rounded-lg bg-slate-100 dark:bg-[rgba(255,255,255,0.03)] text-sm font-semibold">{username}</div>
            </div>
          </div>
        </div>

        {/* Emergency Banner (glass + alert red border/glow) */}
        <section className="mb-6">
          <div className="relative">
            <div className={
              "rounded-2xl p-5 " +
              "bg-white/80 border border-red-100 backdrop-blur-xl dark:bg-gray-800/50 dark:backdrop-blur-xl dark:border-slate-700"
            } style={{ boxShadow: '0 8px 30px rgba(213,0,0,0.08)' }}>
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                <div className="flex-shrink-0 w-14 h-14 rounded-lg flex items-center justify-center" style={{ background: 'rgba(213,0,0,0.06)', border: `2px solid ${ALERT_RED}` }}>
                  <span className="text-2xl">⚠️</span>
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-bold dark:text-white">In Case of Emergency</h2>
                  <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">Stay calm. Call the appropriate number. Clearly communicate your location, the number of people involved, and the nature of the emergency.</p>
                </div>
                <div className="flex-shrink-0">
                  <div className="text-xs text-slate-500 dark:text-slate-400 mb-2">Quick tip</div>
                  <div className="px-3 py-2 rounded-lg font-semibold text-sm" style={{ background: ALERT_RED, color: '#fff' }}>If life is in danger, call now</div>
                </div>
              </div>
            </div>
            {/* red glow ring - dark mode stronger */}
            <div aria-hidden className="pointer-events-none absolute inset-0 rounded-2xl" style={{ boxShadow: '0 8px 40px -20px rgba(213,0,0,0.35)' }} />
          </div>
        </section>

        {/* Contacts grid — uniform glass cards */}
        <section>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((c) => (
              <article
                key={c.number}
                className={
                  "rounded-2xl p-4 flex flex-col justify-between h-full " +
                  "bg-white/70 border border-slate-200 backdrop-blur-xl dark:bg-gray-800/50 dark:backdrop-blur-xl dark:border dark:border-slate-700"
                }
                role="region"
                aria-label={`${c.name} contact`}
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-md flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.03)' }}>
                        {/* colored icon circle (icon retains color) */}
                        <div style={{ width: 40, height: 40, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent' }}>
                          <span style={{ fontSize: 20 }}>{c.icon}</span>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-base font-semibold dark:text-white">{c.name}</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{c.description}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-3xl font-extrabold leading-none dark:text-white">{c.number}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Emergency number</div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-3">
                  <button
                    onClick={() => handleCall(c.number)}
                    className="flex-1 inline-flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm"
                    style={{
                      background: `linear-gradient(90deg, ${ACCENT_ORANGE}, #FFA64D)`,
                      color: '#000'
                    }}
                    aria-label={`Call ${c.name} at ${c.number}`}
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                      <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>Call Now</span>
                  </button>

                  <button
                    onClick={() => handleShare(c)}
                    className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-sm text-slate-700 dark:text-slate-300 bg-white/60 dark:bg-[rgba(255,255,255,0.03)]"
                    aria-label={`Share ${c.name} contact`}
                  >
                    Share
                  </button>
                </div>
              </article>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="mt-8 rounded-2xl p-6 bg-white/70 border border-slate-200 backdrop-blur-xl dark:bg-gray-800/50 dark:backdrop-blur-xl dark:border dark:border-slate-700 text-center">
              <p className="text-sm text-slate-600 dark:text-slate-400">No matching contacts. Try searching for service name or number.</p>
            </div>
          )}
        </section>

        {/* Footer notes */}
        <footer className="mt-8">
          <div className={
            "rounded-2xl p-4 bg-white/70 border border-slate-200 backdrop-blur-xl dark:bg-gray-800/50 dark:backdrop-blur-xl dark:border dark:border-slate-700"
          }>
            <h4 className="text-sm font-semibold dark:text-white">Important — Safety tips</h4>
            <ul className="mt-2 text-sm text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Save local emergency numbers in your contacts for quick access.</li>
              <li>• Remain calm and provide exact location details to the operator.</li>
              <li>• If you cannot speak, leave the line open so responders can trace the call.</li>
            </ul>
          </div>
        </footer>
      </div>
    </div>
  );
}
