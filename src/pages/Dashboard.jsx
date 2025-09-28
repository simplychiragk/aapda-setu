import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import SafetyBeacon from "../components/SafetyBeacon";
import alertService from "../services/alertService";
import toast from "react-hot-toast";

const Dashboard = () => {
  const [showProfile, setShowProfile] = useState(false);
  const [time, setTime] = useState(new Date());
  const [tip, setTip] = useState("");
  const [username, setUsername] = useState(localStorage.getItem("username") || "");
  const [showLoginPopup, setShowLoginPopup] = useState(!localStorage.getItem("username"));
  const [inputName, setInputName] = useState("");
  const [preparedness, setPreparedness] = useState(parseInt(localStorage.getItem("preparedness")) || 0);
  const [alerts, setAlerts] = useState([]);
  const [showBeacon, setShowBeacon] = useState(false);
  const [achievements, setAchievements] = useState([]);
  const [streakCount, setStreakCount] = useState(0);

  useEffect(() => {
    localStorage.setItem("preparedness", preparedness);
  }, [preparedness]);

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Load achievements and check for new ones
    const loadedAchievements = JSON.parse(localStorage.getItem("achievements") || "[]");
    setAchievements(loadedAchievements);
    
    // Check daily streak
    const lastVisit = localStorage.getItem("lastDashboardVisit");
    const today = new Date().toDateString();
    const currentStreak = parseInt(localStorage.getItem("dailyStreak") || "0");
    
    if (lastVisit !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (lastVisit === yesterday.toDateString()) {
        // Consecutive day
        const newStreak = currentStreak + 1;
        setStreakCount(newStreak);
        localStorage.setItem("dailyStreak", newStreak.toString());
        
        if (newStreak >= 7 && !loadedAchievements.includes("Daily Warrior")) {
          const newAchievements = [...loadedAchievements, "Daily Warrior"];
          setAchievements(newAchievements);
          localStorage.setItem("achievements", JSON.stringify(newAchievements));
          toast.success("🏆 Achievement Unlocked: Daily Warrior!", { duration: 4000 });
        }
      } else if (lastVisit) {
        // Streak broken
        setStreakCount(1);
        localStorage.setItem("dailyStreak", "1");
      } else {
        // First visit
        setStreakCount(1);
        localStorage.setItem("dailyStreak", "1");
      }
      
      localStorage.setItem("lastDashboardVisit", today);
    } else {
      setStreakCount(currentStreak);
    }
  }, []);

  const tips = [
    "🏠 Keep a first aid kit ready at all times - check expiry dates monthly",
    "📞 Always have at least 3 emergency contacts saved and updated",
    "🏚️ During an earthquake: Duck, Cover, and Hold On - practice this monthly",
    "🥫 Store enough food and water for 72 hours per family member",
    "🧯 Learn basic fire extinguisher use - remember PASS technique",
    "🔋 Charge your phone during weather warnings and keep power banks ready",
    "🏥 Know your nearest hospital, police station, and fire station locations",
    "🔦 Keep flashlights, batteries, and emergency radio in accessible places",
    "👨‍👩‍👧‍👦 Plan an emergency family meeting spot outside your neighborhood",
    "📢 Do not spread rumors during a disaster - verify information from official sources",
    "🎒 Prepare a go-bag with essentials for each family member",
    "💊 Keep a 7-day supply of essential medications in your emergency kit"
  ];

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * tips.length);
    setTip(tips[randomIndex]);
  }, []);

  useEffect(() => {
    // Fetch alerts and check for severe ones
    const fetchAlerts = async () => {
      const fetchedAlerts = await alertService.fetchAlerts();
      setAlerts(fetchedAlerts);
      
      // Check if there's a severe alert in user's area
      const userLocation = localStorage.getItem("userLocation") || "Delhi";
      const severeAlert = fetchedAlerts.find(alert => 
        alert.severity === 'Severe' && 
        alert.area.toLowerCase().includes(userLocation.toLowerCase())
      );
      
      if (severeAlert) {
        setShowBeacon(true);
      }
    };
    
    fetchAlerts();
  }, []);

  const formatTime = (date) => {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${hours}:${minutes < 10 ? "0" + minutes : minutes} ${ampm}`;
  };

  // Mission data for "Your Missions" section
  const missionData = [
    { 
      to: "/alerts", 
      icon: "🚨", 
      title: "Monitor Emergency Alerts", 
      description: "Stay updated with real-time disaster warnings", 
      progress: 85,
      isActive: alerts.length > 0,
      buttonText: "Check Alerts"
    },
    { 
      to: "/videos", 
      icon: "🎬", 
      title: "Complete Safety Training", 
      description: "Watch educational content to boost preparedness", 
      progress: 60,
      isActive: false,
      buttonText: "Start Mission"
    },
    { 
      to: "/quizzes", 
      icon: "🧠", 
      title: "Test Your Knowledge", 
      description: "Take interactive quizzes to earn achievement points", 
      progress: 40,
      isActive: false,
      buttonText: "Continue"
    },
    { 
      to: "/drills", 
      icon: "🧯", 
      title: "Practice Emergency Drills", 
      description: "Master life-saving procedures through simulation", 
      progress: 20,
      isActive: false,
      buttonText: "Start Mission"
    },
    { 
      to: "/contacts", 
      icon: "📞", 
      title: "Update Emergency Contacts", 
      description: "Ensure your emergency network is ready", 
      progress: 90,
      isActive: false,
      buttonText: "Continue"
    },
    { 
      to: "/safe-zones", 
      icon: "🛡️", 
      title: "Map Safe Zones", 
      description: "Identify nearest shelters and evacuation routes", 
      progress: 75,
      isActive: false,
      buttonText: "Explore"
    },
    { 
      to: "/emergency-kit", 
      icon: "🎒", 
      title: "Build Your Go-Bag", 
      description: "Create the ultimate survival kit checklist", 
      progress: 30,
      isActive: false,
      buttonText: "Start Mission"
    },
    { 
      to: "/game", 
      icon: "🎮", 
      title: "Play Disaster Hero", 
      description: "Learn through gamified emergency scenarios", 
      progress: 10,
      isActive: false,
      buttonText: "Play Now"
    }
  ];

  const handleLogin = () => {
    if (inputName.trim() !== "") {
      localStorage.setItem("username", inputName);
      setUsername(inputName);
      setShowLoginPopup(false);
      toast.success(`Welcome to Aapda Setu, ${inputName}! 🎉`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("username");
    setUsername("");
    setShowLoginPopup(true);
    setShowProfile(false);
    toast.success("Logged out successfully");
  };

  const getPreparednessLevel = () => {
    if (preparedness >= 90) return { level: "Guardian Elite", color: "text-emerald-400", ring: "ring-emerald-400" };
    if (preparedness >= 70) return { level: "Safety Expert", color: "text-blue-400", ring: "ring-blue-400" };
    if (preparedness >= 50) return { level: "Preparedness Pro", color: "text-yellow-400", ring: "ring-yellow-400" };
    if (preparedness >= 25) return { level: "Safety Scout", color: "text-orange-400", ring: "ring-orange-400" };
    return { level: "Rookie Guardian", color: "text-red-400", ring: "ring-red-400" };
  };

  const prepLevel = getPreparednessLevel();

  // Preparedness Shield Component
  const PreparednessShield = () => {
    const radius = 45;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (preparedness / 100) * circumference;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 shadow-2xl hover:scale-105 transition-all duration-300 group"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#FF6F00]/10 to-[#0D47A1]/10 rounded-3xl"></div>
        <div className="relative z-10 text-center">
          <h3 className="text-lg font-semibold text-[#B0B0B0] mb-4">Preparedness Shield</h3>
          
          {/* Radial Progress */}
          <div className="relative mx-auto w-32 h-32 mb-4">
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                stroke="#374151"
                strokeWidth="4"
                fill="none"
                className="opacity-30"
              />
              {/* Progress circle */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                stroke="#FF6F00"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                className="drop-shadow-lg transition-all duration-1000 ease-out"
                style={{
                  filter: 'drop-shadow(0 0 6px #FF6F00)'
                }}
              />
            </svg>
            
            {/* Center content */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">{preparedness}%</div>
                <div className={`text-xs font-medium ${prepLevel.color}`}>{prepLevel.level}</div>
              </div>
            </div>
          </div>
          
          {/* Shield Icon */}
          <div className="text-4xl mb-2 group-hover:scale-110 transition-transform duration-300">🛡️</div>
          <p className="text-sm text-[#B0B0B0]">Your safety rating</p>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#212121' }}>
      <SafetyBeacon isVisible={showBeacon} userLocation={localStorage.getItem("userLocation") || "Delhi"} />
      
      {/* Login Popup */}
      {showLoginPopup && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 w-full max-w-md shadow-2xl"
          >
            <div className="text-center mb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="w-20 h-20 bg-gradient-to-r from-[#0D47A1] to-[#FF6F00] rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <span className="text-3xl">🛡️</span>
              </motion.div>
              <h2 className="text-3xl font-bold text-white mb-2">Welcome to Aapda Setu</h2>
              <p className="text-[#B0B0B0]">Your personal disaster preparedness companion</p>
            </div>
            <div className="space-y-4">
              <input
                type="text"
                value={inputName}
                onChange={(e) => setInputName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                placeholder="Enter your name"
                className="w-full px-4 py-3 border border-gray-600 rounded-xl focus:ring-2 focus:ring-[#FF6F00] focus:border-transparent outline-none transition-all bg-gray-800/80 text-white placeholder-gray-400"
              />
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleLogin}
                className="w-full bg-gradient-to-r from-[#FF6F00] to-[#FF8F00] text-white py-3 rounded-xl font-semibold hover:from-[#FF8F00] hover:to-[#FFA000] transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Get Started 🚀
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Header Section */}
      <div className="relative overflow-hidden" style={{ backgroundColor: '#0D47A1' }}>
        <div className="absolute inset-0 bg-gradient-to-r from-[#0D47A1]/80 to-[#1565C0]/80"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between mb-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h1 className="text-4xl font-bold text-white mb-2">
                Welcome back, <span className="bg-gradient-to-r from-[#FF6F00] to-[#FFA000] bg-clip-text text-transparent">{username || "Guardian"}</span>! 
                {streakCount > 1 && <span className="text-2xl ml-2">🔥</span>}
              </h1>
              <p className="text-xl text-blue-100">Stay prepared, stay safe, save lives.</p>
              {streakCount > 1 && (
                <p className="text-sm text-[#FF6F00] font-semibold mt-1">
                  🔥 {streakCount} day streak! Keep it up!
                </p>
              )}
            </motion.div>
            
            {/* Time and Profile */}
            <div className="flex items-center space-x-6">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-right"
              >
                <div className="text-2xl font-bold text-white">{formatTime(time)}</div>
                <div className="text-sm text-blue-200">Current Time</div>
              </motion.div>
              
              <div className="relative">
                {username ? (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-14 h-14 bg-gradient-to-r from-[#FF6F00] to-[#FFA000] rounded-full flex items-center justify-center text-white font-bold text-xl cursor-pointer shadow-lg hover:shadow-xl transition-all duration-200"
                    onClick={() => setShowProfile((s) => !s)}
                  >
                    {username[0].toUpperCase()}
                  </motion.div>
                ) : (
                  <img
                    src="https://i.pravatar.cc/150?img=65"
                    alt="User"
                    className="w-14 h-14 rounded-full object-cover cursor-pointer shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                    onClick={() => setShowProfile((s) => !s)}
                  />
                )}

                {showProfile && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className="absolute right-0 top-16 bg-gradient-to-br from-gray-800/95 to-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl p-6 w-80 z-40"
                  >
                    <div className="text-center mb-4">
                      <div className="text-lg font-semibold text-white">{username || "Guest"}</div>
                      <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold bg-gray-700 ${prepLevel.color} mt-2`}>
                        {prepLevel.level}
                      </div>
                    </div>
                    
                    {/* Preparedness Progress */}
                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-[#B0B0B0]">Preparedness</span>
                        <span className="text-sm font-bold text-[#FF6F00]">{preparedness}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-3">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${preparedness}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className="bg-gradient-to-r from-[#FF6F00] to-[#FFA000] h-3 rounded-full"
                        ></motion.div>
                      </div>
                    </div>

                    {/* Recent Achievements */}
                    {achievements.length > 0 && (
                      <div className="mb-4">
                        <div className="text-sm font-medium text-[#B0B0B0] mb-2">Recent Achievements</div>
                        <div className="flex flex-wrap gap-1">
                          {achievements.slice(-3).map((achievement, index) => (
                            <span key={index} className="text-xs bg-[#FF6F00]/20 text-[#FF6F00] px-2 py-1 rounded-full">
                              🏆 {achievement}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Link 
                        to="/profile" 
                        className="block w-full text-center py-2 px-4 bg-[#FF6F00]/20 text-[#FF6F00] rounded-lg hover:bg-[#FF6F00]/30 transition-colors font-medium"
                      >
                        View Profile
                      </Link>
                      <Link 
                        to="/settings" 
                        className="block w-full text-center py-2 px-4 bg-gray-700 text-[#B0B0B0] rounded-lg hover:bg-gray-600 transition-colors font-medium"
                      >
                        Settings
                      </Link>
                      <button 
                        onClick={handleLogout} 
                        className="w-full py-2 px-4 bg-[#D50000]/20 text-[#D50000] rounded-lg hover:bg-[#D50000]/30 transition-colors font-medium"
                      >
                        Logout
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>

          {/* Top Row Information Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Preparedness Shield - Larger central widget */}
            <div className="lg:col-span-2">
              <PreparednessShield />
            </div>
            
            {/* Active Alerts Card */}
            <Link to="/alerts" className="block">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#B0B0B0]">Active Alerts</p>
                    <p className={`text-3xl font-bold ${alerts.length > 0 ? 'text-[#D50000]' : 'text-white'}`}>
                      {alerts.length}
                    </p>
                    <p className="text-xs text-[#B0B0B0] mt-1">Live monitoring</p>
                  </div>
                  <div className={`w-12 h-12 ${alerts.length > 0 ? 'bg-[#D50000]/20' : 'bg-gray-700'} rounded-xl flex items-center justify-center`}>
                    <span className="text-2xl">🚨</span>
                  </div>
                </div>
              </motion.div>
            </Link>
            
            {/* Daily Streak Card */}
            <Link to="/profile" className="block">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#B0B0B0]">Daily Streak</p>
                    <p className="text-3xl font-bold text-[#FF6F00]">{streakCount}</p>
                    <p className="text-xs text-[#B0B0B0] mt-1">Days active</p>
                  </div>
                  <div className="w-12 h-12 bg-[#FF6F00]/20 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">🔥</span>
                  </div>
                </div>
              </motion.div>
            </Link>

            {/* Achievements Card */}
            <Link to="/leaderboard" className="block">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#B0B0B0]">Achievements</p>
                    <p className="text-3xl font-bold text-[#FF6F00]">{achievements.length}</p>
                    <p className="text-xs text-[#B0B0B0] mt-1">Unlocked</p>
                  </div>
                  <div className="w-12 h-12 bg-[#FF6F00]/20 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">🏆</span>
                  </div>
                </div>
              </motion.div>
            </Link>
          </div>

          {/* Today's Safety Snap */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-r from-[#FFAB00]/20 to-[#FFC107]/20 border-2 border-[#FFAB00]/30 backdrop-blur-xl rounded-2xl p-6 mb-8 hover:scale-105 transition-all duration-300 cursor-pointer"
            onClick={() => window.location.href = '/videos'}
          >
            <div className="flex items-center space-x-4">
              {/* Video Thumbnail with Play Button */}
              <div className="relative w-24 h-16 bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl overflow-hidden flex-shrink-0">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 bg-[#FFAB00] rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">▶</span>
                  </div>
                </div>
                <div className="absolute bottom-1 right-1 text-xs text-white bg-black/50 px-1 rounded">2:34</div>
              </div>
              
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-[#FFAB00] mb-2">Today's Safety Snap 📸</h3>
                <p className="text-white text-sm leading-relaxed">{tip}</p>
                <p className="text-[#FFAB00] text-xs mt-2 font-medium">Tap to watch full video →</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Your Missions Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 pt-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-3xl font-bold text-white mb-8"
        >
          Your Missions 🎯
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {missionData.map((mission, index) => (
            <motion.div
              key={mission.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
            >
              <Link
                to={mission.to}
                className="group relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 shadow-lg hover:scale-105 transition-all duration-300 overflow-hidden block"
              >
                {/* Background Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br from-[#FF6F00]/5 to-[#0D47A1]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                
                {/* Active Indicator */}
                {mission.isActive && (
                  <div className="absolute top-4 right-4 w-3 h-3 bg-[#D50000] rounded-full animate-pulse"></div>
                )}
                
                {/* Icon */}
                <div className="w-16 h-16 bg-gradient-to-br from-[#FF6F00] to-[#FFA000] rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">{mission.icon}</span>
                </div>
                
                {/* Content */}
                <div className="relative z-10">
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#FF6F00] transition-colors">
                    {mission.title}
                  </h3>
                  <p className="text-[#B0B0B0] mb-4 leading-relaxed text-sm">
                    {mission.description}
                  </p>
                  
                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-[#B0B0B0]">Progress</span>
                      <span className="text-xs text-[#FF6F00] font-semibold">{mission.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-[#FF6F00] to-[#FFA000] h-2 rounded-full transition-all duration-300"
                        style={{ width: `${mission.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  {/* CTA Button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full bg-gradient-to-r from-[#FF6F00] to-[#FFA000] text-white py-2 px-4 rounded-lg font-semibold hover:from-[#FF8F00] hover:to-[#FFB300] transition-all duration-200 shadow-lg text-sm"
                  >
                    {mission.buttonText}
                  </motion.button>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;