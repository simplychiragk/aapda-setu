// Alerts.theme-aware.jsx
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
      case "severe": return "bg-red-600 text-white";      // high
      case "moderate": return "bg-yellow-400 text-black";            // moderate
      case "minor": return "bg-green-600 text-white";               // minor
      default: return "bg-slate-200 text-slate-800";
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
    <div className="min-h-screen bg-slate-50 dark:bg-[#121212] text-slate-900 dark:text-white">
      {/* keyframes & small theme-aware helpers (kept minimal) */}
      <style>{`
        @keyframes pulse-red {
          0% { transform: scale(1); opacity: 1; box-shadow: 0 0 0 0 rgba(213,0,0,0.9); }
          70% { transform: scale(1.4); opacity: 0.6; box-shadow: 0 0 20px 6px rgba(213,0,0,0.08); }
          100% { transform: scale(1); opacity: 1; box-shadow: 0 0 0 0 rgba(213,0,0,0.0); }
        }
        @keyframes severe-glow {
          0% { box-shadow: 0 0 0 0 rgba(213,0,0,0.0); }
          50% { box-shadow: 0 8px 40px -8px rgba(213,0,0,0.45); }
          100% { box-shadow: 0 0 0 0 rgba(213,0,0,0.0); }
        }
      `}</style>

      {/* Header */}
      <header className="py-6" style={{ background: '#0D47A1' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <span style={{ fontSize: 20 }}>🛡️</span>
            </div>
            <div>
              <h1 className="text-white text-lg font-extrabold">Guardian — Command Center</h1>
              <div className="flex items-center gap-3 text-sm mt-1">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-600 animate-[pulse-red_1.8s_infinite] shadow-[0_0_0_4px_rgba(213,0,0,0.12)]" aria-hidden />
                  <span className="text-white text-xs">Live Feed Active</span>
                </div>
                <span className="text-white/80 text-xs">
                  Last updated: {alertService.lastFetch ? new Date(alertService.lastFetch).toLocaleString() : "just now"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-white/80 text-sm">Environment</div>
            <div className="px-3 py-2 rounded-xl bg-white/10 text-white/90 border border-white/6 text-sm font-semibold">Production</div>
          </div>
        </div>
      </header>

      {/* Page content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Controls */}
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="rounded-2xl p-5 mb-8 shadow-sm border border-slate-200 bg-white/70 dark:bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.02))] dark:border-[rgba(255,255,255,0.06)] backdrop-blur-xl">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
            {/* left controls (search + state) */}
            <div className="flex-1 flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full">
              <div className="relative flex-1">
                <input
                  aria-label="Search alerts"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by title, area, description..."
                  className="w-full rounded-xl py-3 pl-12 pr-4 text-sm outline-none placeholder:text-slate-400"
                  style={{
                    background: 'transparent'
                  }}
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M11 19a8 8 0 100-16 8 8 0 000 16z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
              </div>

              <div className="min-w-[200px]">
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="w-full py-3 px-4 rounded-xl text-sm outline-none bg-white/80 dark:bg-transparent border border-slate-200 dark:border-[rgba(255,255,255,0.04)]"
                >
                  {STATES.map(s => <option key={s} value={s} className="text-sm">{s}</option>)}
                </select>
              </div>
            </div>

            {/* right controls (view toggle + quick stats) */}
            <div className="flex items-center gap-3">
              <nav className="inline-flex bg-slate-100 dark:bg-[rgba(255,255,255,0.03)] rounded-full p-[4px] border border-slate-200 dark:border-[rgba(255,255,255,0.05)]" role="tablist" aria-label="View toggle">
                <button
                  className={`px-4 py-2 rounded-full font-semibold text-sm ${viewMode === 'list' ? 'bg-orange-400 text-black shadow-md' : 'text-slate-600 dark:text-slate-300'}`}
                  onClick={() => setViewMode("list")}
                >
                  List
                </button>
                <button
                  className={`px-4 py-2 rounded-full font-semibold text-sm ${viewMode === 'map' ? 'bg-orange-400 text-black shadow-md' : 'text-slate-600 dark:text-slate-300'}`}
                  onClick={() => setViewMode("map")}
                >
                  Map
                </button>
              </nav>

              <div className="px-3 py-2 rounded-xl bg-white/80 dark:bg-[rgba(255,255,255,0.02)] border border-slate-200 dark:border-[rgba(255,255,255,0.04)] flex items-center gap-3 text-sm">
                <div className="text-slate-500 dark:text-slate-400">Auto-refresh</div>
                <div className="text-sm font-extrabold">10m</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stat cards */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Alerts */}
          <div className="rounded-2xl p-5 shadow-sm border border-slate-200 bg-white/70 dark:bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.02))] dark:border-[rgba(255,255,255,0.06)]">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm text-slate-500 dark:text-slate-400">Total Alerts</div>
                <div className="text-2xl font-extrabold">{alerts.length}</div>
              </div>
              <div className="rounded-lg p-3 bg-white/50 dark:bg-[rgba(255,255,255,0.02)]">
                <span className="text-xl">🚨</span>
              </div>
            </div>
            <div className="mt-2 text-sm text-slate-500 dark:text-slate-400">Across monitored regions</div>
          </div>

          {/* Severe Alerts (with conditional glow) */}
          <div className={`rounded-2xl p-5 shadow-sm border ${severeCount > 0 ? 'border-red-300' : 'border-slate-200'} bg-white/70 dark:bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.02))] dark:border-[rgba(255,255,255,0.06)]`} style={{ animation: severeCount > 0 ? 'severe-glow 2.6s infinite' : undefined }}>
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm text-slate-500 dark:text-slate-400">Severe Alerts</div>
                <div className={`text-2xl font-extrabold ${severeCount > 0 ? 'text-red-600' : ''}`}>{severeCount}</div>
              </div>
              <div className="rounded-lg p-3 bg-red-50 dark:bg-[rgba(213,0,0,0.08)]">
                <span className="text-xl">🔴</span>
              </div>
            </div>
            <div className="mt-2 text-sm text-slate-500 dark:text-slate-400">Immediate attention required {severeCount > 0 ? '— action recommended' : ''}</div>
          </div>

          {/* Active States */}
          <div className="rounded-2xl p-5 shadow-sm border border-slate-200 bg-white/70 dark:bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.02))] dark:border-[rgba(255,255,255,0.06)]">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm text-slate-500 dark:text-slate-400">Active States</div>
                <div className="text-2xl font-extrabold">{new Set(alerts.map(a => (a.area || "").split(",")[0])).size}</div>
              </div>
              <div className="rounded-lg p-3 bg-white/50 dark:bg-[rgba(255,255,255,0.02)]">
                <span className="text-xl">🗺️</span>
              </div>
            </div>
            <div className="mt-2 text-sm text-slate-500 dark:text-slate-400">Geographic spread</div>
          </div>

          {/* Filtered */}
          <div className="rounded-2xl p-5 shadow-sm border border-slate-200 bg-white/70 dark:bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.02))] dark:border-[rgba(255,255,255,0.06)]">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm text-slate-500 dark:text-slate-400">Filtered Results</div>
                <div className="text-2xl font-extrabold">{filtered.length}</div>
              </div>
              <div className="rounded-lg p-3 bg-white/50 dark:bg-[rgba(255,255,255,0.02)]">
                <span className="text-xl">🔎</span>
              </div>
            </div>
            <div className="mt-2 text-sm text-slate-500 dark:text-slate-400">Matches for your filters</div>
          </div>
        </motion.div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: list of alerts */}
          <div className="lg:col-span-2">
            {loading ? (
              <ListSkeleton items={6} />
            ) : filtered.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-2xl p-12 text-center shadow-sm border border-slate-200 bg-white/70 dark:bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.02))] dark:border-[rgba(255,255,255,0.06)]">
                <div className="text-5xl mb-3">✅</div>
                <h3 className="text-lg font-extrabold">No alerts found</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">{searchTerm || selectedState !== "All India" ? "Try adjusting your search or state filter." : "System clear — no active alerts"}</p>
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
                      className="rounded-2xl p-5 cursor-pointer hover:-translate-y-0.5 transition-transform shadow-sm border border-slate-200 bg-white/70 dark:bg-[rgba(255,255,255,0.03)] dark:border-[rgba(255,255,255,0.04)]"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-4">
                          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${severityColor(alert.severity)}`}>
                            <span className="text-xl">{categoryEmoji(alert.category)}</span>
                          </div>
                          <div className="min-w-0">
                            <h3 className="line-clamp-2 font-extrabold text-base">{alert.title}</h3>
                            <div className="flex gap-3 mt-2 text-sm text-slate-500 dark:text-slate-400">
                              <div className="flex items-center gap-2">
                                <span>📍</span>
                                <span className="max-w-[220px] truncate">{alert.area}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span>⏱</span>
                                <span>{getTimeAgo(alert.effective)}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2 items-end">
                          <div className={`px-3 py-1 rounded-full font-bold text-sm ${severityColor(alert.severity)}`}>{alert.severity}</div>
                          <div className="flex gap-2">
                            <button
                              onClick={(e) => { e.stopPropagation(); shareAlert(alert); }}
                              className="px-3 py-2 rounded-lg border border-slate-200 dark:border-[rgba(255,255,255,0.04)] bg-white/60 dark:bg-[rgba(255,255,255,0.02)] text-sm"
                            >
                              Share
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); setSelectedAlert(alert); }}
                              className="px-3 py-2 rounded-lg font-extrabold text-sm bg-orange-400 text-black"
                            >
                              Open
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                        {alert.description?.length > 320 ? `${alert.description.slice(0, 320)}...` : alert.description}
                      </div>

                      <div className="mt-3 flex justify-between text-sm text-slate-500 dark:text-slate-400">
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
              <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} className="rounded-2xl p-4 sticky top-6 shadow-sm border border-slate-200 bg-white/70 dark:bg-[rgba(255,255,255,0.03)] dark:border-[rgba(255,255,255,0.04)]">
                <h3 className="text-base font-extrabold">Map — Dark</h3>
                <div style={{ height: 420 }} className="mt-3">
                  {/* Pass a prop indicating dark style to your map component; implement dark style within AlertMap */}
                  <AlertMap alerts={filtered} selectedAlert={selectedAlert} onAlertClick={setSelectedAlert} mapStyle="dark" />
                </div>
                <div className="mt-3 text-sm text-slate-500 dark:text-slate-400">Map uses the dark basemap for seamless visual integration.</div>
              </motion.div>
            ) : selectedAlert ? (
              <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} className="rounded-2xl p-6 sticky top-6 shadow-sm border border-slate-200 bg-white/70 dark:bg-[rgba(255,255,255,0.03)] dark:border-[rgba(255,255,255,0.04)]">
                <div className="flex justify-between items-center">
                  <h3 className="text-base font-extrabold">Alert Details</h3>
                  <button onClick={() => setSelectedAlert(null)} className="text-slate-500 dark:text-slate-300 bg-transparent border-none text-xl">✕</button>
                </div>

                <div className="mt-3">
                  <h4 className="font-extrabold text-sm">{selectedAlert.title}</h4>
                  <div className="mt-2 text-sm text-slate-500 dark:text-slate-400">{selectedAlert.description}</div>

                  <div className="grid grid-cols-2 gap-3 mt-3 text-sm">
                    <div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">Severity</div>
                      <div className={`mt-1 inline-block px-3 py-1 rounded-full font-bold text-sm ${severityColor(selectedAlert.severity)}`}>{selectedAlert.severity}</div>
                    </div>

                    <div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">Category</div>
                      <div className="mt-1">{selectedAlert.category || "—"}</div>
                    </div>

                    <div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">Urgency</div>
                      <div className="mt-1">{selectedAlert.urgency || "—"}</div>
                    </div>

                    <div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">Certainty</div>
                      <div className="mt-1">{selectedAlert.certainty || "—"}</div>
                    </div>
                  </div>

                  <div className="mt-3">
                    <div className="text-xs text-slate-500 dark:text-slate-400">Affected Area</div>
                    <div className="mt-1">{selectedAlert.area}</div>
                  </div>

                  <div className="mt-3">
                    <div className="text-xs text-slate-500 dark:text-slate-400">Valid Until</div>
                    <div className="mt-1">{selectedAlert.expires ? new Date(selectedAlert.expires).toLocaleString() : "—"}</div>
                  </div>

                  <button
                    onClick={() => shareAlert(selectedAlert)}
                    className="mt-4 w-full py-3 rounded-xl font-extrabold bg-orange-400 text-black"
                  >
                    Share Alert
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} className="rounded-2xl p-8 sticky top-6 text-center shadow-sm border border-slate-200 bg-white/70 dark:bg-[rgba(255,255,255,0.03)] dark:border-[rgba(255,255,255,0.04)]">
                <div className="text-4xl mb-2">🛰️</div>
                <h3 className="text-lg font-extrabold">Select an alert</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Click any alert on the left or switch to map to explore geolocations.</p>
              </motion.div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Alerts;
