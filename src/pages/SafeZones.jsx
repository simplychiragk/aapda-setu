import React, { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import toast from 'react-hot-toast';

// Safe zone data for major Indian cities
const SAFE_ZONES = [
  {
    id: 1,
    name: "Rajiv Gandhi Indoor Stadium",
    type: "Relief Shelter",
    city: "Delhi",
    address: "Indira Gandhi Indoor Stadium Complex, New Delhi",
    coordinates: [28.6139, 77.2090],
    capacity: 5000,
    facilities: ["Medical Aid", "Food Distribution", "Water Supply", "Sanitation"],
    contact: "+91-11-2334-5678",
    status: "Active"
  },
  {
    id: 2,
    name: "Bandra Kurla Complex Emergency Center",
    type: "Emergency Shelter",
    city: "Mumbai",
    address: "Bandra Kurla Complex, Mumbai",
    coordinates: [19.0596, 72.8656],
    capacity: 3000,
    facilities: ["Medical Aid", "Food Distribution", "Communication Center"],
    contact: "+91-22-2659-1234",
    status: "Active"
  },
  {
    id: 3,
    name: "Kanteerava Stadium Relief Center",
    type: "Relief Shelter",
    city: "Bangalore",
    address: "Kanteerava Stadium, Bangalore",
    coordinates: [12.9716, 77.5946],
    capacity: 4000,
    facilities: ["Medical Aid", "Food Distribution", "Water Supply", "Child Care"],
    contact: "+91-80-2222-3333",
    status: "Active"
  },
  {
    id: 4,
    name: "Marina Beach Emergency Point",
    type: "Evacuation Point",
    city: "Chennai",
    address: "Marina Beach, Chennai",
    coordinates: [13.0827, 80.2707],
    capacity: 2000,
    facilities: ["First Aid", "Communication Center", "Transportation Hub"],
    contact: "+91-44-2841-5678",
    status: "Active"
  },
  {
    id: 5,
    name: "Nehru Stadium Relief Center",
    type: "Relief Shelter",
    city: "Kolkata",
    address: "Salt Lake Stadium, Kolkata",
    coordinates: [22.5726, 88.3639],
    capacity: 6000,
    facilities: ["Medical Aid", "Food Distribution", "Water Supply", "Sanitation", "Security"],
    contact: "+91-33-2357-8901",
    status: "Active"
  }
];

const createSafeZoneIcon = (type) => {
  const color = type === 'Relief Shelter' ? '#10b981' : type === 'Emergency Shelter' ? '#3b82f6' : '#f59e0b';
  return L.divIcon({
    className: 'custom-safe-zone-marker',
    html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; font-size: 12px;">🛡️</div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

const SafeZones = () => {
  const [selectedZone, setSelectedZone] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState("All Cities");
  const [isLocating, setIsLocating] = useState(false);

  const cities = ["All Cities", ...new Set(SAFE_ZONES.map(zone => zone.city))];

  const filteredZones = SAFE_ZONES.filter(zone => {
    const matchesSearch = zone.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         zone.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         zone.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCity = selectedCity === "All Cities" || zone.city === selectedCity;
    return matchesSearch && matchesCity;
  });

  const getCurrentLocation = () => {
    setIsLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
          toast.success("Location detected successfully!");
          setIsLocating(false);
        },
        (error) => {
          console.error("Geolocation error:", error);
          toast.error("Unable to detect location. Please enable location services.");
          setIsLocating(false);
        }
      );
    } else {
      toast.error("Geolocation is not supported by this browser.");
      setIsLocating(false);
    }
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const getDirections = (zone) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${zone.coordinates[0]},${zone.coordinates[1]}&travelmode=driving`;
    window.open(url, '_blank');
  };

  const shareLocation = async (zone) => {
    const text = `🛡️ Safe Zone: ${zone.name}\n📍 ${zone.address}\n📞 ${zone.contact}\n\nCapacity: ${zone.capacity} people\nFacilities: ${zone.facilities.join(', ')}\n\n- via Aapda Setu`;
    try {
      if (navigator.share) {
        await navigator.share({ title: zone.name, text });
      } else {
        await navigator.clipboard.writeText(text);
        toast.success("Safe zone details copied to clipboard!");
      }
    } catch (error) {
      console.error("Share failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-emerald-50 to-teal-100 dark:from-dark-800 dark:via-dark-700 dark:to-dark-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mr-4">
                <span className="text-3xl">🛡️</span>
              </div>
              <div>
                <h1 className="text-4xl font-bold mb-2">Safe Zone Locator</h1>
                <p className="text-emerald-100 text-xl">Find nearby relief shelters and emergency centers</p>
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
                  placeholder="Search safe zones..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all bg-white/80 dark:bg-dark-700/80"
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

              {/* City Filter */}
              <div className="min-w-0">
                <select 
                  value={selectedCity} 
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all bg-white/80 dark:bg-dark-700/80 min-w-[150px]"
                >
                  {cities.map((city) => <option key={city} value={city}>{city}</option>)}
                </select>
              </div>
            </div>
            
            {/* Location Button */}
            <button
              onClick={getCurrentLocation}
              disabled={isLocating}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLocating ? (
                <>
                  <div className="spinner"></div>
                  <span>Locating...</span>
                </>
              ) : (
                <>
                  <span>📍</span>
                  <span>Find Nearby</span>
                </>
              )}
            </button>
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
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Safe Zones</p>
                <p className="text-3xl font-bold text-emerald-600">{SAFE_ZONES.length}</p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🛡️</span>
              </div>
            </div>
          </div>
          
          <div className="glass dark:glass-dark rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Capacity</p>
                <p className="text-3xl font-bold text-blue-600">{SAFE_ZONES.reduce((sum, zone) => sum + zone.capacity, 0).toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                <span className="text-2xl">👥</span>
              </div>
            </div>
          </div>
          
          <div className="glass dark:glass-dark rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Cities Covered</p>
                <p className="text-3xl font-bold text-purple-600">{cities.length - 1}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🏙️</span>
              </div>
            </div>
          </div>

          <div className="glass dark:glass-dark rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Status</p>
                <p className="text-3xl font-bold text-green-600">100%</p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Safe Zones List */}
          <div className="lg:col-span-2 space-y-4">
            {filteredZones.map((zone, index) => {
              const distance = userLocation ? calculateDistance(
                userLocation[0], userLocation[1],
                zone.coordinates[0], zone.coordinates[1]
              ) : null;

              return (
                <motion.div
                  key={zone.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="glass dark:glass-dark rounded-2xl shadow-lg hover-lift overflow-hidden cursor-pointer"
                  onClick={() => setSelectedZone(zone)}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3 flex-1">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold shadow-lg ${
                          zone.type === 'Relief Shelter' ? 'bg-emerald-500' :
                          zone.type === 'Emergency Shelter' ? 'bg-blue-500' : 'bg-orange-500'
                        }`}>
                          🛡️
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{zone.name}</h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                            <span className="flex items-center">
                              <span className="mr-1">📍</span>
                              {zone.city}
                            </span>
                            <span className="flex items-center">
                              <span className="mr-1">👥</span>
                              {zone.capacity.toLocaleString()} capacity
                            </span>
                            {distance && (
                              <span className="flex items-center">
                                <span className="mr-1">📏</span>
                                {distance.toFixed(1)} km away
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold text-white ${
                          zone.type === 'Relief Shelter' ? 'bg-emerald-500' :
                          zone.type === 'Emergency Shelter' ? 'bg-blue-500' : 'bg-orange-500'
                        }`}>
                          {zone.type}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 dark:text-gray-300 mb-4">{zone.address}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {zone.facilities.map((facility, idx) => (
                        <span key={idx} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-xs">
                          {facility}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-medium">Contact:</span> {zone.contact}
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            getDirections(zone);
                          }}
                          className="bg-blue-50 hover:bg-blue-100 text-blue-600 px-3 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center space-x-1 text-sm"
                        >
                          <span>🗺️</span>
                          <span>Directions</span>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            shareLocation(zone);
                          }}
                          className="bg-emerald-50 hover:bg-emerald-100 text-emerald-600 px-3 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center space-x-1 text-sm"
                        >
                          <span>📤</span>
                          <span>Share</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Map */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass dark:glass-dark rounded-2xl p-4 shadow-lg sticky top-8"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Safe Zone Locations</h3>
              <div className="h-96 rounded-xl overflow-hidden">
                <MapContainer
                  center={[20.5937, 78.9629]} // Center of India
                  zoom={5}
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  
                  {/* User location */}
                  {userLocation && (
                    <Marker position={userLocation}>
                      <Popup>
                        <div className="text-center">
                          <strong>Your Location</strong>
                        </div>
                      </Popup>
                    </Marker>
                  )}
                  
                  {/* Safe zones */}
                  {filteredZones.map((zone) => (
                    <Marker
                      key={zone.id}
                      position={zone.coordinates}
                      icon={createSafeZoneIcon(zone.type)}
                    >
                      <Popup>
                        <div className="p-2 max-w-xs">
                          <h3 className="font-bold text-sm mb-2">{zone.name}</h3>
                          <p className="text-xs text-gray-600 mb-2">{zone.address}</p>
                          <div className="flex items-center justify-between text-xs">
                            <span className={`px-2 py-1 rounded-full text-white ${
                              zone.type === 'Relief Shelter' ? 'bg-emerald-500' :
                              zone.type === 'Emergency Shelter' ? 'bg-blue-500' : 'bg-orange-500'
                            }`}>
                              {zone.type}
                            </span>
                            <span className="text-gray-500">{zone.capacity} capacity</span>
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SafeZones;