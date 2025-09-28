import React, { useState, useEffect } from 'react';

const Alerts = () => {
  const [view, setView] = useState('list');
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [severeAlertCount, setSevereAlertCount] = useState(3); // Example data

  // Mock data - replace with actual API calls
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

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Header Section */}
      <div className="bg-blue-900 rounded-xl p-6 mb-6 shadow-lg">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Alerts Command Center</h1>
            <p className="text-blue-200 mt-2">Real-time monitoring and alert management</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse mr-2"></div>
              <span className="text-green-400 font-semibold">Live Feed Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Controls */}
      <div className="glass-card p-4 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            {/* Search Bar */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search alerts..."
                className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 pl-10 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent w-full sm:w-64"
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
            <select className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent">
              <option>All India</option>
              <option>Northern Region</option>
              <option>Southern Region</option>
              <option>Eastern Region</option>
              <option>Western Region</option>
            </select>
          </div>

          {/* View Toggle */}
          <div className="flex bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setView('list')}
              className={`px-4 py-2 rounded-md transition-all ${
                view === 'list' 
                  ? 'bg-orange-500 text-white shadow-lg' 
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              List View
            </button>
            <button
              onClick={() => setView('map')}
              className={`px-4 py-2 rounded-md transition-all ${
                view === 'map' 
                  ? 'bg-orange-500 text-white shadow-lg' 
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Map View
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="glass-card p-6 text-center">
          <div className="text-3xl font-bold text-white mb-2">{stats.totalAlerts}</div>
          <div className="text-gray-300">Total Alerts</div>
        </div>

        <div className={`glass-card p-6 text-center ${
          stats.severeAlerts > 0 
            ? 'animate-pulse border border-red-500' 
            : ''
        }`}>
          <div className="text-3xl font-bold text-red-400 mb-2">{stats.severeAlerts}</div>
          <div className="text-gray-300">Severe Alerts</div>
        </div>

        <div className="glass-card p-6 text-center">
          <div className="text-3xl font-bold text-yellow-400 mb-2">{stats.activeWarnings}</div>
          <div className="text-gray-300">Active Warnings</div>
        </div>

        <div className="glass-card p-6 text-center">
          <div className="text-3xl font-bold text-green-400 mb-2">{stats.resolved}</div>
          <div className="text-gray-300">Resolved</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Alerts List */}
        <div className="lg:col-span-1 space-y-4">
          {alertsData.map(alert => (
            <div
              key={alert.id}
              onClick={() => setSelectedAlert(alert)}
              className={`glass-card p-4 cursor-pointer transition-all hover:border-gray-500 ${
                selectedAlert?.id === alert.id ? 'border-orange-500 border-2' : 'border-gray-700'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-white">{alert.title}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  severityColors[alert.severity] || 'bg-gray-600'
                }`}>
                  {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}
                </span>
              </div>
              <p className="text-gray-400 text-sm mb-2">{alert.location}</p>
              <p className="text-gray-500 text-xs">{alert.time}</p>
            </div>
          ))}
        </div>

        {/* Alert Detail / Map View */}
        <div className="lg:col-span-2">
          {view === 'list' ? (
            selectedAlert ? (
              <div className="glass-card p-6 h-full">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">{selectedAlert.title}</h2>
                    <div className="flex items-center space-x-4">
                      <span className="text-gray-400">{selectedAlert.location}</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        severityColors[selectedAlert.severity] || 'bg-gray-600'
                      }`}>
                        {selectedAlert.severity.charAt(0).toUpperCase() + selectedAlert.severity.slice(1)}
                      </span>
                    </div>
                  </div>
                  <span className="text-gray-500 text-sm">{selectedAlert.time}</span>
                </div>

                <div className="mb-6">
                  <p className="text-gray-300 mb-4">{selectedAlert.description}</p>
                  
                  <div>
                    <h4 className="text-white font-semibold mb-2">Affected Areas:</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedAlert.affectedAreas.map((area, index) => (
                        <span key={index} className="bg-gray-800 px-3 py-1 rounded-lg text-sm text-gray-300">
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button className="bg-orange-500 hover:bg-orange-600 px-6 py-2 rounded-lg font-semibold transition-colors">
                    Acknowledge
                  </button>
                  <button className="bg-gray-700 hover:bg-gray-600 px-6 py-2 rounded-lg font-semibold transition-colors">
                    Share Report
                  </button>
                </div>
              </div>
            ) : (
              <div className="glass-card p-6 h-full flex items-center justify-center">
                <div className="text-center">
                  <svg
                    className="w-16 h-16 text-gray-600 mx-auto mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <h3 className="text-xl font-semibold text-gray-400 mb-2">No Alert Selected</h3>
                  <p className="text-gray-600">Select an alert from the list to view details</p>
                </div>
              </div>
            )
          ) : (
            /* Map View */
            <div className="glass-card p-6 h-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">Alert Map Overview</h2>
                <div className="text-gray-400 text-sm">
                  {stats.severeAlerts} active severe alerts
                </div>
              </div>
              
              {/* Map Container - Replace with actual Map component */}
              <div className="bg-gray-800 rounded-lg h-96 flex items-center justify-center">
                <div className="text-center">
                  <svg
                    className="w-20 h-20 text-gray-600 mx-auto mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  <p className="text-gray-400">Map visualization would appear here</p>
                  <p className="text-gray-600 text-sm mt-2">Integrated with dark-themed map service</p>
                </div>
              </div>
              
              <div className="mt-4 flex justify-center space-x-6">
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

// Add these styles to your global CSS or Tailwind config
const styles = `
.glass-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
}

.bg-gray-900 {
  background-color: #212121;
}

.bg-blue-900 {
  background-color: #0D47A1;
}

.bg-orange-500 {
  background-color: #FF6F00;
}

.bg-red-500 {
  background-color: #D50000;
}

.text-gray-300 {
  color: #B0B0B0;
}

/* Custom animations */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
`;
