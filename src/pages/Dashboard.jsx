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

  const cardData = [
    { 
      to: "/alerts", 
      icon: "🚨", 
      title: "Live Alerts", 
      description: "Real-time disaster warnings with interactive map visualization", 
      gradient: "from-red-500 to-red-600",
      count: alerts.length
    },
    { 
      to: "/videos", 
      icon: "🎬", 
      title: "Video Library", 
      description: "Curated educational content for disaster preparedness", 
      gradient: "from-blue-500 to-blue-600",
      count: "50+"
    },
    { 
      to: "/quizzes", 
      icon: "🧠", 
      title: "Knowledge Hub", 
      description: "Interactive quizzes with real-time scoring and achievements", 
      gradient: "from-emerald-500 to-emerald-600",
      count: "New"
    },
    { 
      to: "/drills", 
      icon: "🧯", 
      title: "Virtual Drills", 
      description: "Step-by-step emergency procedure simulations", 
      gradient: "from-violet-500 to-violet-600",
      count: "15+"
    },
    { 
      to: "/contacts", 
      icon: "📞", 
      title: "Emergency Contacts", 
      description: "One-tap access to critical emergency services", 
      gradient: "from-orange-500 to-orange-600",
      count: "24/7"
    },
    { 
      to: "/safe-zones", 
      icon: "🛡️", 
      title: "Safe Zones", 
      description: "Locate nearby relief shelters and safe areas", 
      gradient: "from-teal-500 to-teal-600",
      count: "Live"
    },
    { 
      to: "/forum", 
      icon: "💬", 
      title: "Community Forum", 
      description: "Connect with your community during emergencies", 
      gradient: "from-purple-500 to-purple-600",
      count: "Active"
    },
    { 
      to: "/emergency-kit", 
      icon: "🎒", 
      title: "Emergency Kit", 
      description: "Personalized survival kit checklist and tracker", 
      gradient: "from-indigo-500 to-indigo-600",
      count: "Smart"
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
    if (preparedness >= 90) return { level: "Expert", color: "text-emerald-600", bg: "bg-emerald-100" };
    if (preparedness >= 70) return { level: "Advanced", color: "text-blue-600", bg: "bg-blue-100" };
    if (preparedness >= 50) return { level: "Intermediate", color: "text-yellow-600", bg: "bg-yellow-100" };
    if (preparedness >= 25) return { level: "Beginner", color: "text-orange-600", bg: "bg-orange-100" };
    return { level: "Starter", color: "text-red-600", bg: "bg-red-100" };
  };

  const prepLevel = getPreparednessLevel();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 dark:from-dark-800 dark:via-dark-700 dark:to-dark-900">
      <SafetyBeacon isVisible={showBeacon} userLocation={localStorage.getItem("userLocation") || "Delhi"} />
      
      {/* Login Popup */}
      {showLoginPopup && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass dark:glass-dark rounded-3xl p-8 w-full max-w-md shadow-2xl"
          >
            <div className="text-center mb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="w-20 h-20 bg-gradient-to-r from-primary-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <span className="text-3xl">🛡️</span>
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Welcome to Aapda Setu</h2>
              <p className="text-gray-600 dark:text-gray-300">Your personal disaster preparedness companion</p>
            </div>
            <div className="space-y-4">
              <input
                type="text"
                value={inputName}
                onChange={(e) => setInputName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                placeholder="Enter your name"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all bg-white/80 dark:bg-dark-700/80"
              />
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleLogin}
                className="w-full bg-gradient-to-r from-primary-500 to-orange-500 text-white py-3 rounded-xl font-semibold hover:from-primary-600 hover:to-orange-600 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Get Started 🚀
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Header Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/10 to-orange-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between mb-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Welcome back, <span className="bg-gradient-to-r from-primary-600 to-orange-600 bg-clip-text text-transparent">{username || "User"}</span>! 
                {streakCount > 1 && <span className="text-2xl ml-2">🔥</span>}
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300">Stay prepared, stay safe, save lives.</p>
              {streakCount > 1 && (
                <p className="text-sm text-primary-600 font-semibold mt-1">
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
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{formatTime(time)}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Current Time</div>
              </motion.div>
              
              <div className="relative">
                {username ? (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-14 h-14 bg-gradient-to-r from-primary-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xl cursor-pointer shadow-lg hover:shadow-xl transition-all duration-200"
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
                    className="absolute right-0 top-16 glass dark:glass-dark rounded-2xl shadow-2xl p-6 w-80 z-40"
                  >
                    <div className="text-center mb-4">
                      <div className="text-lg font-semibold text-gray-900 dark:text-white">{username || "Guest"}</div>
                      <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${prepLevel.bg} ${prepLevel.color} mt-2`}>
                        {prepLevel.level} Level
                      </div>
                    </div>
                    
                    {/* Preparedness Progress */}
                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Preparedness</span>
                        <span className="text-sm font-bold text-primary-600">{preparedness}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${preparedness}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className="bg-gradient-to-r from-primary-500 to-orange-500 h-3 rounded-full"
                        ></motion.div>
                      </div>
                    </div>

                    {/* Recent Achievements */}
                    {achievements.length > 0 && (
                      <div className="mb-4">
                        <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Recent Achievements</div>
                        <div className="flex flex-wrap gap-1">
                          {achievements.slice(-3).map((achievement, index) => (
                            <span key={index} className="text-xs bg-primary-100 text-primary-800 px-2 py-1 rounded-full">
                              🏆 {achievement}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Link 
                        to="/profile" 
                        className="block w-full text-center py-2 px-4 bg-primary-50 text-primary-600 rounded-lg hover:bg-primary-100 transition-colors font-medium"
                      >
                        View Profile
                      </Link>
                      <Link 
                        to="/settings" 
                        className="block w-full text-center py-2 px-4 bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors font-medium"
                      >
                        Settings
                      </Link>
                      <button 
                        onClick={handleLogout} 
                        className="w-full py-2 px-4 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium"
                      >
                        Logout
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass dark:glass-dark rounded-2xl p-6 shadow-lg hover-lift"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Preparedness Level</p>
                  <p className="text-3xl font-bold text-primary-600">{preparedness}%</p>
                  <p className="text-xs text-gray-500 mt-1">{prepLevel.level}</p>
                </div>
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">📊</span>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass dark:glass-dark rounded-2xl p-6 shadow-lg hover-lift"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Alerts</p>
                  <p className="text-3xl font-bold text-red-600">{alerts.length}</p>
                  <p className="text-xs text-gray-500 mt-1">Live monitoring</p>
                </div>
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">🚨</span>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass dark:glass-dark rounded-2xl p-6 shadow-lg hover-lift"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Daily Streak</p>
                  <p className="text-3xl font-bold text-orange-600">{streakCount}</p>
                  <p className="text-xs text-gray-500 mt-1">Days active</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">🔥</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glass dark:glass-dark rounded-2xl p-6 shadow-lg hover-lift"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Achievements</p>
                  <p className="text-3xl font-bold text-violet-600">{achievements.length}</p>
                  <p className="text-xs text-gray-500 mt-1">Unlocked</p>
                </div>
                <div className="w-12 h-12 bg-violet-100 dark:bg-violet-900/30 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">🏆</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Safety Tip */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-6 mb-8"
          >
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">💡</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-amber-900 dark:text-amber-100 mb-2">Today's Safety Tip</h3>
                <p className="text-amber-800 dark:text-amber-200">{tip}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Tools Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-3xl font-bold text-gray-900 dark:text-white mb-8"
        >
          Disaster Management Tools
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cardData.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
            >
              <Link
                to={card.to}
                className="group relative glass dark:glass-dark rounded-2xl p-6 shadow-lg hover-lift overflow-hidden block"
              >
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                
                {/* Count Badge */}
                {card.count && (
                  <div className="absolute top-4 right-4 bg-primary-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {card.count}
                  </div>
                )}
                
                {/* Icon */}
                <div className={`w-16 h-16 bg-gradient-to-br ${card.gradient} rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <span className="text-2xl text-white">{card.icon}</span>
                </div>
                
                {/* Content */}
                <div className="relative z-10">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-primary-600 transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed text-sm">
                    {card.description}
                  </p>
                  <div className="flex items-center text-primary-600 font-semibold group-hover:text-primary-700 transition-colors">
                    <span>Explore</span>
                    <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
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
