import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import SafetyBeacon from "../components/SafetyBeacon";
import alertService from "../services/alertService";
import toast from "react-hot-toast";
import useLogout from "../hooks/useLogout";

// Separate Preparedness Shield Component
const PreparednessShield = ({ preparedness, prepLevel }) => {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (preparedness / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8 }}
      className="relative bg-white/70 backdrop-blur-xl border border-slate-200 rounded-3xl p-8 shadow-lg hover:scale-105 transition-all duration-300 group dark:bg-gray-800/50 dark:border-gray-700/50"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#FF6F00]/10 to-[#0D47A1]/10 rounded-3xl dark:from-[#FF6F00]/10 dark:to-[#0D47A1]/10"></div>
      <div className="relative z-10 text-center">
        <h3 className="text-lg font-semibold text-slate-600 mb-4 dark:text-[#B0B0B0]">Preparedness Shield</h3>
        
        {/* Radial Progress */}
        <div className="relative mx-auto w-32 h-32 mb-4">
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              stroke="#CBD5E1"
              strokeWidth="4"
              fill="none"
              className="opacity-60 dark:opacity-30 dark:stroke-gray-600"
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
              strokeDasharray={circumference}
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
              <div className="text-3xl font-bold text-slate-800 mb-1 dark:text-white">{preparedness}%</div>
              <div className={`text-xs font-medium ${prepLevel.color}`}>{prepLevel.level}</div>
            </div>
          </div>
        </div>
        
        {/* Shield Icon */}
        <div className="text-4xl mb-2 group-hover:scale-110 transition-transform duration-300">🛡️</div>
        <p className="text-sm text-slate-500 dark:text-[#B0B0B0]">Your safety rating</p>
      </div>
    </motion.div>
  );
};

// Enhanced Mission Card Component
const MissionCard = ({ mission, index }) => {
  const getMissionGradient = (title) => {
    const gradients = {
      "Monitor Emergency Alerts": "from-red-500/10 to-orange-500/10",
      "Complete Safety Training": "from-blue-500/10 to-cyan-500/10", 
      "Test Your Knowledge": "from-purple-500/10 to-pink-500/10",
      "Practice Emergency Drills": "from-orange-500/10 to-red-500/10",
      "Update Emergency Contacts": "from-green-500/10 to-emerald-500/10",
      "Map Safe Zones": "from-teal-500/10 to-blue-500/10",
      "Build Your Go-Bag": "from-amber-500/10 to-yellow-500/10",
      "Play Disaster Hero": "from-indigo-500/10 to-purple-500/10"
    };
    return gradients[title] || "from-[#FF6F00]/10 to-[#0D47A1]/10";
  };

  const getButtonVariant = (progress) => {
    if (progress === 100) {
      return "from-green-500 to-emerald-600";
    } else if (progress < 20) {
      return "from-[#FF6F00] to-[#D50000]";
    }
    return "from-[#FF6F00] to-[#FF8C00]";
  };

  const getGlowColor = (progress) => {
    if (progress === 100) {
      return "#10B981";
    } else if (progress < 20) {
      return "#D50000";
    } else if (progress < 50) {
      return "#FF6F00";
    }
    return "#FF8C00";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        delay: 0.7 + index * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }}
      whileHover={{ 
        y: -8,
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
      className="group"
    >
      <Link to={mission.to}>
        {/* Glassmorphism Card Container */}
        <div className="relative bg-gray-800/40 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 shadow-2xl overflow-hidden h-full transition-all duration-300 group-hover:border-[#FF6F00]/30 group-hover:shadow-[0_8px_32px_rgba(255,111,0,0.15)]">
          
          {/* Dynamic Background Gradient */}
          <div className={`absolute inset-0 bg-gradient-to-br ${getMissionGradient(mission.title)} opacity-60 group-hover:opacity-80 transition-opacity duration-300`} />
          
          {/* Subtle Pattern Overlay */}
          <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.8)_1px,transparent_0)] bg-[length:16px_16px]" />
          
          {/* Active Indicator */}
          {mission.isActive && (
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute top-4 right-4 w-3 h-3 bg-[#D50000] rounded-full ring-2 ring-[#D50000]/40"
            />
          )}
          
          <div className="relative z-10 h-full flex flex-col">
            {/* Icon with Pulsating Glow */}
            <div className="flex justify-center mb-4">
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  filter: [
                    `drop-shadow(0 0 10px ${getGlowColor(mission.progress)}40)`,
                    `drop-shadow(0 0 20px ${getGlowColor(mission.progress)}60)`,
                    `drop-shadow(0 0 10px ${getGlowColor(mission.progress)}40)`
                  ]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="w-20 h-20 bg-gradient-to-br from-gray-700 to-gray-800 rounded-2xl flex items-center justify-center shadow-2xl border border-gray-600/50"
              >
                <span className="text-3xl">{mission.icon}</span>
              </motion.div>
            </div>
            
            {/* Content */}
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-3 text-center group-hover:text-[#FF6F00] transition-colors duration-300">
                {mission.title}
              </h3>
              <p className="text-gray-300 mb-6 leading-relaxed text-center text-sm">
                {mission.description}
              </p>
              
              {/* Enhanced Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-medium text-gray-400">Progress</span>
                  <span className="text-sm font-bold text-[#FF6F00]">{mission.progress}%</span>
                </div>
                
                {/* Main Progress Bar */}
                <div className="w-full bg-gray-700/80 rounded-full h-3 backdrop-blur-sm">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${mission.progress}%` }}
                    transition={{ 
                      delay: 1 + index * 0.1, 
                      duration: 1, 
                      ease: "easeOut" 
                    }}
                    className={`relative h-3 rounded-full bg-gradient-to-r from-[#FF6F00] to-[#FF8C00] shadow-lg ${
                      mission.progress === 100 ? 'from-green-500 to-emerald-400' : ''
                    }`}
                    style={{
                      background: mission.progress === 100 
                        ? 'linear-gradient(to right, #10B981, #34D399)'
                        : mission.progress < 20
                        ? 'linear-gradient(to right, #D50000, #FF6F00)'
                        : 'linear-gradient(to right, #FF6F00, #FF8C00)'
                    }}
                  >
                    {/* Animated Stripe Effect */}
                    {mission.progress > 0 && mission.progress < 100 && (
                      <motion.div
                        animate={{ x: [-30, 30] }}
                        transition={{ 
                          duration: 1.5, 
                          repeat: Infinity, 
                          ease: "linear" 
                        }}
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
                      />
                    )}
                    
                    {/* Progress Glow */}
                    <div 
                      className="absolute inset-0 rounded-full blur-sm opacity-60"
                      style={{
                        backgroundColor: getGlowColor(mission.progress)
                      }}
                    />
                  </motion.div>
                </div>
              </div>
            </div>
            
            {/* Enhanced Action Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`w-full bg-gradient-to-r ${getButtonVariant(mission.progress)} text-white py-3 px-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group/btn`}
            >
              {/* Button Shine Effect */}
              <div className="absolute inset-0 -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              
              <span className="relative z-10 flex items-center justify-center gap-2">
                {mission.progress === 100 ? (
                  <>
                    <span>🎉</span>
                    View Summary
                  </>
                ) : mission.progress < 20 ? (
                  <>
                    <span>🚨</span>
                    {mission.buttonText}
                  </>
                ) : (
                  mission.buttonText
                )}
              </span>
            </motion.button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

const Dashboard = () => {
  const handleLogout = useLogout();
  const [showProfile, setShowProfile] = useState(false);
  const [time, setTime] = useState(new Date());
  const [tip, setTip] = useState("");
  const [username, setUsername] = useState(localStorage.getItem("username") || "");
  const [showLoginPopup, setShowLoginPopup] = useState(!localStorage.getItem("username"));
  const [inputName, setInputName] = useState("");
  const [preparedness, setPreparedness] = useState(() => {
    const saved = localStorage.getItem("preparedness");
    return saved ? parseInt(saved) : 0;
  });
  const [alerts, setAlerts] = useState([]);
  const [showBeacon, setShowBeacon] = useState(false);
  const [achievements, setAchievements] = useState([]);
  const [streakCount, setStreakCount] = useState(0);

  // Use useRef to prevent unnecessary re-renders
  const preparednessRef = React.useRef(preparedness);

  useEffect(() => {
    localStorage.setItem("preparedness", preparedness);
    preparednessRef.current = preparedness;
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

  const getPreparednessLevel = () => {
    if (preparedness >= 90) return { level: "Guardian Elite", color: "text-emerald-600 dark:text-emerald-400", ring: "ring-emerald-400" };
    if (preparedness >= 70) return { level: "Safety Expert", color: "text-blue-600 dark:text-blue-400", ring: "ring-blue-400" };
    if (preparedness >= 50) return { level: "Preparedness Pro", color: "text-yellow-600 dark:text-yellow-400", ring: "ring-yellow-400" };
    if (preparedness >= 25) return { level: "Safety Scout", color: "text-orange-600 dark:text-orange-400", ring: "ring-orange-400" };
    return { level: "Rookie Guardian", color: "text-red-600 dark:text-red-400", ring: "ring-red-400" };
  };

  const prepLevel = getPreparednessLevel();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#212121] transition-colors duration-200">
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
            className="bg-white/90 backdrop-blur-xl border border-slate-200 rounded-3xl p-8 w-full max-w-md shadow-2xl dark:bg-gray-800/90 dark:border-gray-700/50"
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
              <h2 className="text-3xl font-bold text-slate-800 mb-2 dark:text-white">Welcome to Aapda Setu</h2>
              <p className="text-slate-600 dark:text-[#B0B0B0]">Your personal disaster preparedness companion</p>
            </div>
            <div className="space-y-4">
              <input
                type="text"
                value={inputName}
                onChange={(e) => setInputName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                placeholder="Enter your name"
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#FF6F00] focus:border-transparent outline-none transition-all bg-white/80 text-slate-800 placeholder-slate-400 dark:bg-gray-800/80 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
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
      <div className="relative overflow-hidden bg-blue-600 dark:bg-[#0D47A1] transition-colors duration-200">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/80 to-blue-700/80 dark:from-[#0D47A1]/80 dark:to-[#1565C0]/80"></div>
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
                    className="absolute right-0 top-16 bg-white/95 backdrop-blur-xl border border-slate-200 rounded-2xl shadow-2xl p-6 w-80 z-40 dark:bg-gray-800/95 dark:border-gray-700/50"
                  >
                    <div className="text-center mb-4">
                      <div className="text-lg font-semibold text-slate-800 dark:text-white">{username || "Guest"}</div>
                      <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold bg-slate-100 ${prepLevel.color} mt-2 dark:bg-gray-700`}>
                        {prepLevel.level}
                      </div>
                    </div>
                    
                    {/* Preparedness Progress */}
                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-slate-600 dark:text-[#B0B0B0]">Preparedness</span>
                        <span className="text-sm font-bold text-[#FF6F00]">{preparedness}%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-3 dark:bg-gray-700">
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
                        <div className="text-sm font-medium text-slate-600 dark:text-[#B0B0B0] mb-2">Recent Achievements</div>
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
                        className="block w-full text-center py-2 px-4 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-medium dark:bg-gray-700 dark:text-[#B0B0B0] dark:hover:bg-gray-600"
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
              <PreparednessShield preparedness={preparedness} prepLevel={prepLevel} />
            </div>
            
            {/* Active Alerts Card */}
            <Link to="/alerts" className="block">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/70 backdrop-blur-xl border border-slate-200 rounded-2xl p-6 shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer dark:bg-gray-800/50 dark:border-gray-700/50"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-[#B0B0B0]">Active Alerts</p>
                    <p className={`text-3xl font-bold ${alerts.length > 0 ? 'text-[#D50000]' : 'text-slate-800 dark:text-white'}`}>
                      {alerts.length}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-[#B0B0B0] mt-1">Live monitoring</p>
                  </div>
                  <div className={`w-12 h-12 ${alerts.length > 0 ? 'bg-[#D50000]/20' : 'bg-slate-100 dark:bg-gray-700'} rounded-xl flex items-center justify-center`}>
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
                className="bg-white/70 backdrop-blur-xl border border-slate-200 rounded-2xl p-6 shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer dark:bg-gray-800/50 dark:border-gray-700/50"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-[#B0B0B0]">Daily Streak</p>
                    <p className="text-3xl font-bold text-[#FF6F00]">{streakCount}</p>
                    <p className="text-xs text-slate-500 dark:text-[#B0B0B0] mt-1">Days active</p>
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
                className="bg-white/70 backdrop-blur-xl border border-slate-200 rounded-2xl p-6 shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer dark:bg-gray-800/50 dark:border-gray-700/50"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-[#B0B0B0]">Achievements</p>
                    <p className="text-3xl font-bold text-[#FF6F00]">{achievements.length}</p>
                    <p className="text-xs text-slate-500 dark:text-[#B0B0B0] mt-1">Unlocked</p>
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
              <div className="relative w-24 h-16 bg-gradient-to-br from-slate-300 to-slate-400 rounded-xl overflow-hidden flex-shrink-0 dark:from-gray-700 dark:to-gray-800">
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
                <p className="text-slate-800 text-sm leading-relaxed dark:text-white">{tip}</p>
                <p className="text-[#FFAB00] text-xs mt-2 font-medium">Tap to watch full video →</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Enhanced Your Missions Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 pt-8">
        {/* Section Header with Enhanced Styling */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="relative mb-12"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#FF6F00]/10 to-transparent rounded-2xl blur-xl opacity-50" />
          <div className="relative">
            <h2 className="text-4xl font-bold text-white mb-4 text-center">
              Your Missions <span className="text-[#FF6F00]">🎯</span>
            </h2>
            <p className="text-gray-400 text-center max-w-2xl mx-auto">
              Complete these missions to enhance your disaster preparedness and become a true Guardian
            </p>
          </div>
        </motion.div>

        {/* Mission Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {missionData.map((mission, index) => (
            <MissionCard 
              key={mission.title} 
              mission={mission} 
              index={index} 
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
