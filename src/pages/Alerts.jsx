import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AlertMap from "../components/AlertMap";
import { ListSkeleton } from "../components/SkeletonLoader";
import alertService from "../services/alertService";
import toast from "react-hot-toast";

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
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchAlerts = async () => {
      setLoading(true);
      try {
        const fetchedAlerts = await alertService.fetchAlerts();
        setAlerts(fetchedAlerts);
      } catch (error) {
        console.error("Failed to fetch alerts:", error);
        toast.error("Failed to load alerts. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
    
    // Set up auto-refresh every 10 minutes
    const interval = setInterval(fetchAlerts, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const filtered = useMemo(() => {
    let result = alerts;
    
    if (selectedState !== "All India") {
      result = result.filter((alert) =>
        alert.area.toLowerCase().includes(selectedState.toLowerCase())
      );
    }
    
    if (searchTerm) {
      result = result.filter((alert) =>
        alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.area.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return result.sort((a, b) => {
      const severityOrder = { 'Severe': 3, 'Moderate': 2, 'Minor': 1 };
      return (severityOrder[b.severity] || 0) - (severityOrder[a.severity] || 0);
    });
  }, [alerts, selectedState, searchTerm]);

  const shareAlert = async (alert) => {
    const text = `🚨 ${alert.title}\n\nSeverity: ${alert.severity}\nArea: ${alert.area}\n\n${alert.description}\n\nStay safe! - via Aapda Setu`;
    try {
      if (navigator.share) {
        await navigator.share({ title: alert.title, text });
      } else {
        await navigator.clipboard.writeText(text);
        toast.success("Alert copied to clipboard!");
      }
    } catch (error) {
      console.error("Share failed:", error);
    }
  };

  const getSeverityIcon = (severity) => {
    switch(severity) {
      case 'Severe': return '🔴';
      case 'Moderate': return '🟡';
      case 'Minor': return '🟢';
      default: return '⚠️';
    }
  };

  const getCategoryIcon = (category) => {
    switch(category?.toLowerCase()) {
      case 'cyclone': return '🌀';
      case 'flood': return '🌊';
      case 'earthquake': return '🏚️';
      case 'heatwave': return '☀️';
      case 'fire': return '🔥';
      default: return '⚠️';
    }
  };

  const getTimeAgo = (dateString) => {
    const now = new Date();
    const alertTime = new Date(dateString);
    const diffInMinutes = Math.floor((now - alertTime) / (1000 * 60));
    
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-red-50 to-orange-100 dark:from-dark-800 dark:via-dark-700 dark:to-dark-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-500 to-red-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mr-4">
                <span className="text-3xl">🚨</span>
              </div>
              <div>
                <h1 className="text-4xl font-bold mb-2">Live Disaster Alerts</h1>
                <p className="text-red-100 text-xl">Real-time monitoring across India</p>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-4 text-sm">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                <span>Live Feed Active</span>
              </div>
              <div className="flex items-center">
                <span>Last Updated: {alertService.lastFetch ? new Date(alertService.lastFetch).toLocaleTimeString() : 'Just now'}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass dark:glass-dark rounded-2xl shadow-lg p-6 mb-8"
        >
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 flex-1">
              {/* Search */}
              <div className="relative flex-1 min-w-0">
                <input
                  type="text"
                  placeholder="Search alerts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all bg-white/80 dark:bg-dark-700/80"
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

              {/* State Filter */}
              <div className="min-w-0">
                <select 
                  value={selectedState} 
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all bg-white/80 dark:bg-dark-700/80 min-w-[200px]"
                >
                  {STATES.map((state) => <option key={state} value={state}>{state}</option>)}
                </select>
              </div>
            </div>
            
            {/* View Toggle */}
            <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 rounded-xl p-1">
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  viewMode === 'list' 
                    ? 'bg-white dark:bg-dark-600 text-primary-600 shadow-sm' 
                    : 'text-gray-600 dark:text-gray-300 hover:text-primary-600'
                }`}
              >
                📋 List
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  viewMode === 'map' 
                    ? 'bg-white dark:bg-dark-600 text-primary-600 shadow-sm' 
                    : 'text-gray-600 dark:text-gray-300 hover:text-primary-600'
                }`}
              >
                🗺️ Map
              </button>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <div className="glass dark:glass-dark rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Alerts</p>
                <p className="text-3xl font-bold text-primary-600">{alerts.length}</p>
              </div>
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🚨</span>
              </div>
            </div>
          </div>
          
          <div className="glass dark:glass-dark rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Severe Alerts</p>
                <p className="text-3xl font-bold text-red-600">{alerts.filter(a => a.severity === 'Severe').length}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🔴</span>
              </div>
            </div>
          </div>
          
          <div className="glass dark:glass-dark rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active States</p>
                <p className="text-3xl font-bold text-orange-600">{new Set(alerts.map(a => a.area.split(',')[0])).size}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🗺️</span>
              </div>
            </div>
          </div>

          <div className="glass dark:glass-dark rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Filtered Results</p>
                <p className="text-3xl font-bold text-emerald-600">{filtered.length}</p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🔍</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Alerts List */}
          <div className="lg:col-span-2">
            {loading ? (
              <ListSkeleton items={5} />
            ) : filtered.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl">📭</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No alerts found</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {searchTerm || selectedState !== "All India" 
                    ? "Try adjusting your search or filter criteria." 
                    : "All clear! No active alerts at the moment."}
                </p>
              </motion.div>
            ) : (
              <div className="space-y-4">
                <AnimatePresence>
                  {filtered.map((alert, index) => (
                    <motion.div
                      key={alert.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.1 }}
                      className={`glass dark:glass-dark rounded-2xl shadow-lg hover-lift overflow-hidden cursor-pointer ${alertService.getSeverityClass(alert.severity)}`}
                      onClick={() => setSelectedAlert(alert)}
                    >
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3 flex-1">
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold shadow-lg"
                                 style={{ backgroundColor: alertService.getSeverityColor(alert.severity) }}>
                              {getCategoryIcon(alert.category)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1 line-clamp-2">{alert.title}</h3>
                              <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                                <span className="flex items-center">
                                  <span className="mr-1">📍</span>
                                  {alert.area}
                                </span>
                                <span className="flex items-center">
                                  <span className="mr-1">🕒</span>
                                  {getTimeAgo(alert.effective)}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2 ml-4">
                            <span 
                              className="px-3 py-1 rounded-full text-sm font-semibold text-white shadow-sm flex items-center"
                              style={{ backgroundColor: alertService.getSeverityColor(alert.severity) }}
                            >
                              {getSeverityIcon(alert.severity)} {alert.severity}
                            </span>
                          </div>
                        </div>
                        
                        <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed line-clamp-3">{alert.description}</p>
                        
                        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            <span className="font-medium">Expires:</span> {new Date(alert.expires).toLocaleString()}
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              shareAlert(alert);
                            }}
                            className="bg-primary-50 hover:bg-primary-100 text-primary-600 px-4 py-2 rounded-xl font-semibold transition-all duration-200 flex items-center space-x-2"
                          >
                            <span>📤</span>
                            <span>Share</span>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Map or Alert Detail */}
          <div className="lg:col-span-1">
            {viewMode === 'map' ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass dark:glass-dark rounded-2xl p-4 shadow-lg sticky top-8"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Alert Locations</h3>
                <AlertMap 
                  alerts={filtered} 
                  selectedAlert={selectedAlert}
                  onAlertClick={setSelectedAlert}
                />
              </motion.div>
            ) : selectedAlert ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass dark:glass-dark rounded-2xl p-6 shadow-lg sticky top-8"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Alert Details</h3>
                  <button
                    onClick={() => setSelectedAlert(null)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{selectedAlert.title}</h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">{selectedAlert.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">Severity:</span>
                      <div className={`mt-1 px-2 py-1 rounded text-white text-xs font-semibold inline-block`}
                           style={{ backgroundColor: alertService.getSeverityColor(selectedAlert.severity) }}>
                        {selectedAlert.severity}
                      </div>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">Category:</span>
                      <p className="text-gray-600 dark:text-gray-400 mt-1">{selectedAlert.category}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">Urgency:</span>
                      <p className="text-gray-600 dark:text-gray-400 mt-1">{selectedAlert.urgency}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">Certainty:</span>
                      <p className="text-gray-600 dark:text-gray-400 mt-1">{selectedAlert.certainty}</p>
                    </div>
                  </div>
                  
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">Affected Area:</span>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">{selectedAlert.area}</p>
                  </div>
                  
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">Valid Until:</span>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">{new Date(selectedAlert.expires).toLocaleString()}</p>
                  </div>
                  
                  <button
                    onClick={() => shareAlert(selectedAlert)}
                    className="w-full bg-primary-500 hover:bg-primary-600 text-white py-3 rounded-xl font-semibold transition-colors"
                  >
                    Share Alert 📤
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass dark:glass-dark rounded-2xl p-6 shadow-lg sticky top-8 text-center"
              >
                <div className="text-6xl mb-4">🗺️</div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Select an Alert</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Click on any alert to view detailed information, or switch to map view to see alert locations.
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Alerts;
