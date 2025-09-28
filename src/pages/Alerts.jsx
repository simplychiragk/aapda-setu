import React, { useState, useEffect } from 'react';

const Alerts = () => {
  const [view, setView] = useState('list');
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [severeAlertCount, setSevereAlertCount] = useState(3);

  // Mock data
  const alertsData = [
    {
      id: 1,
      title: 'Heavy Rainfall Warning',
      severity: 'severe',
      location: 'Mumbai, Maharashtra',
      time: '2 hours ago',
      description: 'Heavy to very heavy rainfall expected in the next 24 hours with potential flooding in low-lying areas.',
      affectedAreas: ['South Mumbai', 'Western Suburbs', 'Thane District']
    },
    {
      id: 2,
      title: 'Heat Wave Alert',
      severity: 'moderate',
      location: 'Rajasthan',
      time: '4 hours ago',
      description: 'Temperatures expected to reach 45°C in the next 48 hours. Stay hydrated and avoid outdoor activities.',
      affectedAreas: ['Jaipur', 'Jodhpur', 'Bikaner']
    },
    {
      id: 3,
      title: 'Cyclone Warning',
      severity: 'severe',
      location: 'Eastern Coast',
      time: '1 hour ago',
      description: 'Cyclone forming in Bay of Bengal, expected to make landfall in 72 hours.',
      affectedAreas: ['Odisha Coast', 'Andhra Coast', 'West Bengal']
    },
    {
      id: 4,
      title: 'Flood Alert',
      severity: 'moderate',
      location: 'Kerala',
      time: '3 hours ago',
      description: 'Heavy rainfall causing river levels to rise rapidly in multiple districts.',
      affectedAreas: ['Idukki', 'Ernakulam', 'Thrissur']
    }
  ];

  const stats = {
    totalAlerts: 24,
    severeAlerts: severeAlertCount,
    activeWarnings: 8,
    resolved: 16
  };

  const severityColors = {
    low: 'bg-green-500',
    moderate: 'bg-yellow-500',
    severe: 'bg-red-500'
  };

  const severityTextColors = {
    low: 'text-green-400',
    moderate: 'text-yellow-400',
    severe: 'text-red-400'
  };

  return (
    <div className="min-h-screen bg-[#212121] text-white p-6">
      {/* Header Card */}
      <div className="bg-[#0D47A1] rounded-2xl p-6 mb-6 shadow-lg border border-blue-700">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Alerts Command Center</h1>
            <p className="text-blue-200 mt-2">Real-time monitoring and alert management</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center bg-gray-800/50 backdrop-blur-xl rounded-lg px-4 py-2 border border-gray-700/50">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse mr-2"></div>
              <span className="text-green-400 font-semibold">Live Feed Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Controls Card */}
      <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-4 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            {/* Search Bar */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search alerts..."
                className="bg-gray-700/50 border border-gray-600/50 rounded-xl px-4 py-2 pl-10 text-white focus:outline-none focus:ring-2 focus:ring-[#FF6F00] focus:border-transparent w-full sm:w-64 backdrop-blur-sm"
              />
              <svg
                className="w-5 h-5 text-gray-400 absolute left-3 top-2.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Filter Dropdown */}
            <select className="bg-gray-700/50 border border-gray-600/50 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#FF6F00] focus:border-transparent backdrop-blur-sm">
              <option>All India</option>
              <option>Northern Region</option>
              <option>Southern Region</option>
              <option>Eastern Region</option>
              <option>Western Region</option>
            </select>
          </div>

          {/* View Toggle */}
          <div className="flex bg-gray-700/50 rounded-xl p-1 backdrop-blur-sm border border-gray-600/50">
            <button
              onClick={() => setView('list')}
              className={`px-4 py-2 rounded-lg transition-all ${
                view === 'list' 
                  ? 'bg-[#FF6F00] text-white shadow-lg' 
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              List View
            </button>
            <button
              onClick={() => setView('map')}
              className={`px-4 py-2 rounded-lg transition-all ${
                view === 'map' 
                  ? 'bg-[#FF6F00] text-white shadow-lg' 
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Map View
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Cards - Each in separate glass cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Total Alerts Card */}
        <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 text-center">
          <div className="text-3xl font-bold text-white mb-2">{stats.totalAlerts}</div>
          <div className="text-gray-300 text-sm">Total Alerts</div>
        </div>

        {/* Severe Alerts Card */}
        <div className={`bg-gray-800/50 backdrop-blur-xl border rounded-2xl p-6 text-center ${
          stats.severeAlerts > 0 
            ? 'border-[#D50000] animate-pulse' 
            : 'border-gray-700/50'
        }`}>
          <div className={`text-3xl font-bold mb-2 ${
            stats.severeAlerts > 0 ? 'text-[#D50000]' : 'text-white'
          }`}>
            {stats.severeAlerts}
          </div>
          <div className="text-gray-300 text-sm">Severe Alerts</div>
        </div>

        {/* Active Warnings Card */}
        <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 text-center">
          <div className="text-3xl font-bold text-yellow-400 mb-2">{stats.activeWarnings}</div>
          <div className="text-gray-300 text-sm">Active Warnings</div>
        </div>

        {/* Resolved Card */}
        <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 text-center">
          <div className="text-3xl font-bold text-green-400 mb-2">{stats.resolved}</div>
          <div className="text-gray-300 text-sm">Resolved</div>
        </div>
      </div>

      {/* Main Content Area - Two Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Alert List Card */}
        <div className="lg:col-span-1">
          <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-4 h-[600px] flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Active Alerts</h2>
              <span className="text-gray-400 text-sm">{alertsData.length} alerts</span>
            </div>
            
            {/* Scrollable Alert List */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-2">
              {alertsData.map(alert => (
                <div
                  key={alert.id}
                  onClick={() => setSelectedAlert(alert)}
                  className={`bg-gray-700/30 backdrop-blur-sm border rounded-xl p-4 cursor-pointer transition-all hover:border-gray-500 ${
                    selectedAlert?.id === alert.id 
                      ? 'border-[#FF6F00] border-2 bg-gray-700/50' 
                      : 'border-gray-600/50'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-white text-sm leading-tight">{alert.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      severityColors[alert.severity] || 'bg-gray-600'
                    }`}>
                      {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}
                    </span>
                  </div>
                  <p className="text-gray-400 text-xs mb-1">{alert.location}</p>
                  <p className="text-gray-500 text-xs">{alert.time}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Alert Detail Card */}
        <div className="lg:col-span-2">
          {view === 'list' ? (
            selectedAlert ? (
              <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 h-[600px] flex flex-col">
                {/* Alert Header */}
                <div className="flex justify-between items-start mb-6">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-white mb-3">{selectedAlert.title}</h2>
                    <div className="flex items-center space-x-4">
                      <span className="text-gray-400">{selectedAlert.location}</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        severityColors[selectedAlert.severity] || 'bg-gray-600'
                      }`}>
                        {selectedAlert.severity.charAt(0).toUpperCase() + selectedAlert.severity.slice(1)}
                      </span>
                    </div>
                  </div>
                  <span className="text-gray-500 text-sm bg-gray-700/50 px-3 py-1 rounded-lg">
                    {selectedAlert.time}
                  </span>
                </div>

                {/* Alert Content */}
                <div className="flex-1 overflow-y-auto">
                  <div className="mb-6">
                    <h3 className="text-white font-semibold mb-3 text-lg">Description</h3>
                    <p className="text-gray-300 leading-relaxed">{selectedAlert.description}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-white font-semibold mb-3 text-lg">Affected Areas</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedAlert.affectedAreas.map((area, index) => (
                        <span 
                          key={index} 
                          className="bg-gray-700/50 backdrop-blur-sm px-3 py-2 rounded-lg text-sm text-gray-300 border border-gray-600/50"
                        >
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4 pt-6 border-t border-gray-700/50">
                  <button className="bg-gradient-to-r from-[#FF6F00] to-orange-600 hover:from-orange-600 hover:to-[#FF6F00] px-6 py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-orange-500/25">
                    Acknowledge Alert
                  </button>
                  <button className="bg-gray-700/50 hover:bg-gray-600/50 px-6 py-3 rounded-xl font-semibold transition-all border border-gray-600/50 backdrop-blur-sm">
                    Share Report
                  </button>
                </div>
              </div>
            ) : (
              /* Placeholder Card when no alert selected */
              <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 h-[600px] flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gray-700/50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-gray-600/50">
                    <svg
                      className="w-10 h-10 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-400 mb-2">No Alert Selected</h3>
                  <p className="text-gray-500">Select an alert from the list to view details</p>
                </div>
              </div>
            )
          ) : (
            /* Map View Card */
            <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 h-[600px] flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Alert Map Overview</h2>
                <div className="text-gray-400 text-sm bg-gray-700/50 px-3 py-1 rounded-lg">
                  {stats.severeAlerts} active severe alerts
                </div>
              </div>
              
              {/* Map Container */}
              <div className="flex-1 bg-gray-700/30 backdrop-blur-sm rounded-xl border border-gray-600/50 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gray-600/50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-gray-500/50">
                    <svg
                      className="w-12 h-12 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                  </div>
                  <p className="text-gray-400 font-medium">Map Visualization</p>
                  <p className="text-gray-500 text-sm mt-2">Integrated with dark-themed map service</p>
                </div>
              </div>
              
              {/* Map Legend */}
              <div className="flex justify-center space-x-8 mt-6 pt-6 border-t border-gray-700/50">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                  <span className="text-gray-400 text-sm">Severe Alerts</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                  <span className="text-gray-400 text-sm">Moderate Alerts</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-gray-400 text-sm">Low Risk</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Alerts;
