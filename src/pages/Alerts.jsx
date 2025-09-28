// Alerts.jsx
import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AlertMap from "../components/AlertMap";
import { ListSkeleton } from "../components/SkeletonLoader";
import alertService from "../services/alertService";
import toast from "react-hot-toast";

/* STATES list kept as-is */
const STATES = [
  "All India", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi", "Chandigarh",
  "Jammu and Kashmir", "Ladakh", "Puducherry", "Dadra and Nagar Haveli and Daman and Diu", "Lakshadweep", "Andaman and Nicobar Islands"
];

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [selectedState, setSelectedState] = useState("All India");
  const [loading, setLoading] = useState(true);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [viewMode, setViewMode] = useState("list"); // 'list' | 'map'
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    let mounted = true;
    const fetchAlerts = async () => {
      setLoading(true);
      try {
        const fetched = await alertService.fetchAlerts();
        if (!mounted) return;
        setAlerts(fetched || []);
      } catch (err) {
        console.error("Failed to fetch alerts:", err);
        toast.error("Failed to load alerts.");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 10 * 60 * 1000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  const filtered = useMemo(() => {
    let res = alerts || [];
    if (selectedState !== "All India") {
      res = res.filter(a =>
        String(a.area || "").toLowerCase().includes(selectedState.toLowerCase())
      );
    }
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      res = res.filter(a =>
        String(a.title || "").toLowerCase().includes(q) ||
        String(a.description || "").toLowerCase().includes(q) ||
        String(a.area || "").toLowerCase().includes(q)
      );
    }
    const severityOrder = { Severe: 3, Moderate: 2, Minor: 1 };
    return res.sort((a, b) => (severityOrder[b.severity] || 0) - (severityOrder[a.severity] || 0));
  }, [alerts, selectedState, searchTerm]);

  const severeCount = useMemo(() => alerts.filter(a => a.severity === "Severe").length, [alerts]);

  const shareAlert = async (alert) => {
    const text = `🚨 ${alert.title}\nSeverity: ${alert.severity}\nArea: ${alert.area}\n\n${alert.description}\n\n— via Guardian`;
    try {
      if (navigator.share) {
        await navigator.share({ title: alert.title, text });
      } else {
        await navigator.clipboard.writeText(text);
        toast.success("Alert copied to clipboard");
      }
    } catch (e) {
      console.error(e);
      toast.error("Could not share alert");
    }
  };

  /* helpers */
  const getTimeAgo = (dateString) => {
    if (!dateString) return "N/A";
    const now = new Date();
    const then = new Date(dateString);
    const diffMin = Math.floor((now - then) / 60000);
    if (diffMin < 1) return "just now";
    if (diffMin < 60) return `${diffMin}m`;
    if (diffMin < 1440) return `${Math.floor(diffMin / 60)}h`;
    return `${Math.floor(diffMin / 1440)}d`;
  };

  const severityColor = (sev) => {
    switch ((sev || "").toLowerCase()) {
      case "severe": return "var(--alert-red)";      // #D50000
      case "moderate": return "#FFB300";            // yellow-ish (moderate)
      case "minor": return "#4CAF50";               // green
      default: return "rgba(255,255,255,0.08)";
    }
  };

  const categoryEmoji = (c) => {
    switch ((c || "").toLowerCase()) {
      case "cyclone": return "🌀";
      case "flood": return "🌊";
      case "earthquake": return "🏚️";
      case "heatwave": return "☀️";
      case "fire": return "🔥";
      default: return "⚠️";
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--bg-charcoal)", color: "var(--primary-text)" }}>
      {/* Inline style block for immediate visuals (can be moved to global CSS) */}
      <style>{`
        :root{
          --bg-charcoal: #212121;
          --header-blue: #0D47A1;
          --accent-orange: #FF6F00;
          --alert-red: #D50000;
          --primary-text: #FFFFFF;
          --secondary-text: #B0B0B0;
          --glass-bg: rgba(255,255,255,0.04);
          --glass-border: rgba(255,255,255,0.06);
        }

        /* glassmorphism base */
        .glass-cc {
          background: linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.02));
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border: 1px solid var(--glass-border);
        }

        /* pulsating live dot */
        @keyframes pulse-red {
          0% { transform: scale(1); opacity: 1; box-shadow: 0 0 0 0 rgba(213,0,0,0.9); }
          70% { transform: scale(1.4); opacity: 0.6; box-shadow: 0 0 20px 6px rgba(213,0,0,0.08); }
          100% { transform: scale(1); opacity: 1; box-shadow: 0 0 0 0 rgba(213,0,0,0.0); }
        }

        .live-dot {
          width: 10px;
          height: 10px;
          border-radius: 999px;
          background: var(--alert-red);
          box-shadow: 0 0 0 4px rgba(213,0,0,0.12);
          animation: pulse-red 1.8s infinite ease-in-out;
        }

        /* pulsating red glow for severe stats */
        @keyframes severe-glow {
          0% { box-shadow: 0 0 0 0 rgba(213,0,0,0.0); border-color: rgba(213,0,0,0.15); }
          50% { box-shadow: 0 8px 40px -8px rgba(213,0,0,0.45); border-color: rgba(213,0,0,0.35); }
          100% { box-shadow: 0 0 0 0 rgba(213,0,0,0.0); border-color: rgba(213,0,0,0.15); }
        }
        .severe-glow {
          animation: severe-glow 2.6s infinite;
        }

        /* segmented control */
        .segmented {
          background: rgba(255,255,255,0.03);
          border-radius: 9999px;
          display: inline-flex;
          padding: 4px;
          border: 1px solid rgba(255,255,255,0.05);
        }
        .segmented button {
          padding: 8px 14px;
          border-radius: 9999px;
          font-weight: 600;
          color: var(--secondary-text);
          background: transparent;
          border: none;
        }
        .segmented button.active {
          background: var(--accent-orange);
          color: #0b0b0b;
          box-shadow: 0 6px 18px rgba(255,111,0,0.14);
        }

        /* lightweight responsive helpers */
        .sticky-sidebar { position: sticky; top: 24px; }
        .truncate-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
      `}</style>

      {/* Header */}
      <header style={{ background: "linear-gradient(90deg,var(--header-blue), rgba(13,71,161,0.85))" }} className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center glass-cc" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
              <span style={{ fontSize: 20 }}>🛡️</span>
            </div>
            <div>
              <h1 style={{ color: "var(--primary-text)", fontSize: 22, fontWeight: 700 }}>Guardian — Command Center</h1>
              <div className="flex items-center gap-3 text-sm mt-1">
                <div className="flex items-center gap-2">
                  <div className="live-dot" aria-hidden />
                  <span style={{ color: "var(--primary-text)", fontSize: 13 }}>Live Feed Active</span>
                </div>
                <span style={{ color: "var(--secondary-text)", fontSize: 13 }}>
                  Last updated: {alertService.lastFetch ? new Date(alertService.lastFetch).toLocaleString() : "just now"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div style={{ color: "var(--secondary-text)", fontSize: 13 }}>Environment</div>
            <div className="glass-cc px-3 py-2 rounded-xl" style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M12 2v20" stroke="white" strokeOpacity="0.6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M5 7h14" stroke="white" strokeOpacity="0.6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span style={{ color: "var(--primary-text)", fontSize: 13, fontWeight: 600 }}>Production</span>
            </div>
          </div>
        </div>
      </header>

      {/* Page content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Controls */}
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="glass-cc rounded-2xl p-5 mb-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
            {/* left controls (search + state) */}
            <div className="flex-1 flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full">
              <div className="relative flex-1">
                <input
                  aria-label="Search alerts"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by title, area, description..."
                  className="w-full rounded-xl py-3 pl-12 pr-4 text-sm outline-none"
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.04)",
                    color: "var(--primary-text)"
                  }}
                />
                <div style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--secondary-text)" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M11 19a8 8 0 100-16 8 8 0 000 16z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
              </div>

              <div style={{ minWidth: 200 }}>
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="w-full py-3 px-4 rounded-xl text-sm"
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.04)",
                    color: "var(--primary-text)"
                  }}
                >
                  {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            {/* right controls (view toggle + quick stats) */}
            <div className="flex items-center gap-3">
              <nav className="segmented" role="tablist" aria-label="View toggle">
                <button
                  className={viewMode === "list" ? "active" : ""}
                  onClick={() => setViewMode("list")}
                >
                  List
                </button>
                <button
                  className={viewMode === "map" ? "active" : ""}
                  onClick={() => setViewMode("map")}
                >
                  Map
                </button>
              </nav>

              <div className="glass-cc px-3 py-2 rounded-xl" style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <div style={{ fontSize: 12, color: "var(--secondary-text)" }}>Auto-refresh</div>
                <div style={{ fontSize: 13, fontWeight: 700 }}>10m</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stat cards */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Alerts */}
          <div className="glass-cc rounded-2xl p-5">
            <div className="flex items-start justify-between">
              <div>
                <div style={{ fontSize: 13, color: "var(--secondary-text)" }}>Total Alerts</div>
                <div style={{ fontSize: 22, fontWeight: 800 }}>{alerts.length}</div>
              </div>
              <div className="rounded-lg p-3" style={{ background: "rgba(255,255,255,0.02)" }}>
                <span style={{ fontSize: 20 }}>🚨</span>
              </div>
            </div>
            <div style={{ marginTop: 10, fontSize: 12, color: "var(--secondary-text)" }}>
              Across monitored regions
            </div>
          </div>

          {/* Severe Alerts (with conditional glow) */}
          <div className={`glass-cc rounded-2xl p-5 ${severeCount > 0 ? "severe-glow" : ""}`} style={{ border: severeCount > 0 ? "1px solid rgba(213,0,0,0.16)" : undefined }}>
            <div className="flex items-start justify-between">
              <div>
                <div style={{ fontSize: 13, color: "var(--secondary-text)" }}>Severe Alerts</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: severeCount > 0 ? "var(--alert-red)" : "var(--primary-text)" }}>{severeCount}</div>
              </div>
              <div className="rounded-lg p-3" style={{ background: "rgba(213,0,0,0.08)" }}>
                <span style={{ fontSize: 20 }}>🔴</span>
              </div>
            </div>
            <div style={{ marginTop: 10, fontSize: 12, color: "var(--secondary-text)" }}>
              Immediate attention required {severeCount > 0 ? "— action recommended" : ""}
            </div>
          </div>

          {/* Active States */}
          <div className="glass-cc rounded-2xl p-5">
            <div className="flex items-start justify-between">
              <div>
                <div style={{ fontSize: 13, color: "var(--secondary-text)" }}>Active States</div>
                <div style={{ fontSize: 22, fontWeight: 800 }}>{new Set(alerts.map(a => (a.area || "").split(",")[0])).size}</div>
              </div>
              <div className="rounded-lg p-3" style={{ background: "rgba(255,111,0,0.06)" }}>
                <span style={{ fontSize: 20 }}>🗺️</span>
              </div>
            </div>
            <div style={{ marginTop: 10, fontSize: 12, color: "var(--secondary-text)" }}>
              Geographic spread
            </div>
          </div>

          {/* Filtered */}
          <div className="glass-cc rounded-2xl p-5">
            <div className="flex items-start justify-between">
              <div>
                <div style={{ fontSize: 13, color: "var(--secondary-text)" }}>Filtered Results</div>
                <div style={{ fontSize: 22, fontWeight: 800 }}>{filtered.length}</div>
              </div>
              <div className="rounded-lg p-3" style={{ background: "rgba(255,255,255,0.02)" }}>
                <span style={{ fontSize: 20 }}>🔎</span>
              </div>
            </div>
            <div style={{ marginTop: 10, fontSize: 12, color: "var(--secondary-text)" }}>
              Matches for your filters
            </div>
          </div>
        </motion.div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: list of alerts */}
          <div className="lg:col-span-2">
            {loading ? (
              <ListSkeleton items={6} />
            ) : filtered.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-cc rounded-2xl p-12 text-center">
                <div style={{ fontSize: 42, marginBottom: 12 }}>✅</div>
                <h3 style={{ fontSize: 18, fontWeight: 700 }}>No alerts found</h3>
                <p style={{ color: "var(--secondary-text)", marginTop: 8 }}>
                  {searchTerm || selectedState !== "All India" ? "Try adjusting your search or state filter." : "System clear — no active alerts"}
                </p>
              </motion.div>
            ) : (
              <div className="space-y-4">
                <AnimatePresence>
                  {filtered.map((alert, idx) => (
                    <motion.div
                      key={alert.id || `${idx}-${alert.title}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ delay: idx * 0.03 }}
                      onClick={() => setSelectedAlert(alert)}
                      className="glass-cc rounded-2xl p-5 cursor-pointer hover:translate-y-[-2px] transition-transform"
                      style={{ border: "1px solid rgba(255,255,255,0.04)" }}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ background: severityColor(alert.severity), color: "#fff", fontWeight: 700 }}>
                            {categoryEmoji(alert.category)}
                          </div>
                          <div className="min-w-0">
                            <h3 className="truncate-2" style={{ fontSize: 16, fontWeight: 700 }}>{alert.title}</h3>
                            <div style={{ display: "flex", gap: 12, marginTop: 6, color: "var(--secondary-text)", fontSize: 13 }}>
                              <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                                <span>📍</span>
                                <span style={{ maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis" }}>{alert.area}</span>
                              </div>
                              <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                                <span>⏱</span>
                                <span>{getTimeAgo(alert.effective)}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end" }}>
                          <div style={{
                            padding: "6px 10px",
                            borderRadius: 999,
                            fontWeight: 700,
                            fontSize: 12,
                            color: "#fff",
                            background: severityColor(alert.severity)
                          }}>
                            {alert.severity}
                          </div>
                          <div style={{ display: "flex", gap: 8 }}>
                            <button
                              onClick={(e) => { e.stopPropagation(); shareAlert(alert); }}
                              className="glass-cc px-3 py-2 rounded-lg"
                              style={{ fontSize: 13, border: "1px solid rgba(255,255,255,0.04)" }}
                            >
                              Share
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); setSelectedAlert(alert); }}
                              className="px-3 py-2 rounded-lg"
                              style={{ background: "var(--accent-orange)", color: "#0b0b0b", fontWeight: 700 }}
                            >
                              Open
                            </button>
                          </div>
                        </div>
                      </div>

                      <div style={{ marginTop: 12, color: "var(--secondary-text)", fontSize: 13, lineHeight: 1.4 }}>
                        {alert.description?.length > 320 ? `${alert.description.slice(0, 320)}...` : alert.description}
                      </div>

                      <div style={{ marginTop: 12, display: "flex", justifyContent: "space-between", color: "var(--secondary-text)", fontSize: 12 }}>
                        <div>Expires: {alert.expires ? new Date(alert.expires).toLocaleString() : "N/A"}</div>
                        <div>Certainty: {alert.certainty || "—"}</div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Right: Map OR Alert details */}
          <div className="lg:col-span-1">
            {viewMode === "map" ? (
              <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} className="glass-cc rounded-2xl p-4 sticky-sidebar">
                <h3 style={{ fontSize: 16, fontWeight: 800 }}>Map — Dark</h3>
                <div style={{ height: 420, marginTop: 12 }}>
                  {/* Pass a prop indicating dark style to your map component; implement dark style within AlertMap */}
                  <AlertMap alerts={filtered} selectedAlert={selectedAlert} onAlertClick={setSelectedAlert} mapStyle="dark" />
                </div>
                <div style={{ marginTop: 12, color: "var(--secondary-text)", fontSize: 13 }}>
                  Map uses the dark basemap for seamless visual integration.
                </div>
              </motion.div>
            ) : selectedAlert ? (
              <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} className="glass-cc rounded-2xl p-6 sticky-sidebar">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h3 style={{ fontSize: 16, fontWeight: 800 }}>Alert Details</h3>
                  <button onClick={() => setSelectedAlert(null)} style={{ color: "var(--secondary-text)", background: "transparent", border: "none", fontSize: 18 }}>✕</button>
                </div>

                <div style={{ marginTop: 12 }}>
                  <h4 style={{ fontSize: 15, fontWeight: 800 }}>{selectedAlert.title}</h4>
                  <div style={{ marginTop: 8, color: "var(--secondary-text)" }}>{selectedAlert.description}</div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 12 }}>
                    <div>
                      <div style={{ fontSize: 12, color: "var(--secondary-text)" }}>Severity</div>
                      <div style={{
                        marginTop: 6,
                        display: "inline-block",
                        padding: "6px 10px",
                        borderRadius: 999,
                        fontWeight: 800,
                        color: "#fff",
                        background: severityColor(selectedAlert.severity)
                      }}>{selectedAlert.severity}</div>
                    </div>

                    <div>
                      <div style={{ fontSize: 12, color: "var(--secondary-text)" }}>Category</div>
                      <div style={{ marginTop: 6 }}>{selectedAlert.category || "—"}</div>
                    </div>

                    <div>
                      <div style={{ fontSize: 12, color: "var(--secondary-text)" }}>Urgency</div>
                      <div style={{ marginTop: 6 }}>{selectedAlert.urgency || "—"}</div>
                    </div>

                    <div>
                      <div style={{ fontSize: 12, color: "var(--secondary-text)" }}>Certainty</div>
                      <div style={{ marginTop: 6 }}>{selectedAlert.certainty || "—"}</div>
                    </div>
                  </div>

                  <div style={{ marginTop: 12 }}>
                    <div style={{ fontSize: 12, color: "var(--secondary-text)" }}>Affected Area</div>
                    <div style={{ marginTop: 6 }}>{selectedAlert.area}</div>
                  </div>

                  <div style={{ marginTop: 12 }}>
                    <div style={{ fontSize: 12, color: "var(--secondary-text)" }}>Valid Until</div>
                    <div style={{ marginTop: 6 }}>{selectedAlert.expires ? new Date(selectedAlert.expires).toLocaleString() : "—"}</div>
                  </div>

                  <button
                    onClick={() => shareAlert(selectedAlert)}
                    style={{ marginTop: 14, width: "100%", padding: "12px 16px", borderRadius: 12, background: "var(--accent-orange)", color: "#0b0b0b", fontWeight: 800 }}
                  >
                    Share Alert
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} className="glass-cc rounded-2xl p-8 sticky-sidebar text-center">
                <div style={{ fontSize: 36, marginBottom: 8 }}>🛰️</div>
                <h3 style={{ fontSize: 18, fontWeight: 800 }}>Select an alert</h3>
                <p style={{ color: "var(--secondary-text)", marginTop: 8 }}>Click any alert on the left or switch to map to explore geolocations.</p>
              </motion.div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Alerts;
