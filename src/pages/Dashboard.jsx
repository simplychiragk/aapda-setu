import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

//

export default function Dashboard() {
  const [showProfile, setShowProfile] = useState(false);
  const [time, setTime] = useState(new Date());
  const [tip, setTip] = useState("");
  const [username, setUsername] = useState(localStorage.getItem("username") || "");
  const [showLoginPopup, setShowLoginPopup] = useState(!localStorage.getItem("username"));
  const [inputName, setInputName] = useState("");
  const [preparedness, setPreparedness] = useState(parseInt(localStorage.getItem("preparedness")) || 0); // eslint-disable-line no-unused-vars

  useEffect(() => {
    localStorage.setItem("preparedness", preparedness);
  }, [preparedness]);

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const tips = [
    "Keep a first aid kit ready at all times.",
    "Always have at least 2 emergency contacts saved.",
    "During an earthquake: Duck, Cover, and Hold On.",
    "Store enough food and water for 72 hours.",
    "Learn basic fire extinguisher use.",
    "Charge your phone during weather warnings.",
    "Know your nearest hospital and police station.",
    "Keep flashlights and batteries handy.",
    "Plan an emergency family meeting spot.",
    "Do not spread rumors during a disaster.",
  ];

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * tips.length);
    setTip(tips[randomIndex]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      title: "Real-Time Alerts", 
      description: "Get immediate notifications about disasters in your area.", 
      color: "#dc2626",
      gradient: "from-red-500 to-red-600"
    },
    { 
      to: "/videos", 
      icon: "🎬", 
      title: "Video Library", 
      description: "Learn disaster preparedness with our curated educational videos.", 
      color: "#2563eb",
      gradient: "from-blue-500 to-blue-600"
    },
    { 
      to: "/quizzes", 
      icon: "🧠", 
      title: "Knowledge Quiz", 
      description: "Test your knowledge and earn badges for disaster preparedness.", 
      color: "#059669",
      gradient: "from-emerald-500 to-emerald-600"
    },
    { 
      to: "/drills", 
      icon: "🧯", 
      title: "Virtual Drills", 
      description: "Practice emergency procedures through interactive simulations.", 
      color: "#7c3aed",
      gradient: "from-violet-500 to-violet-600"
    },
    { 
      to: "/contacts", 
      icon: "📞", 
      title: "Emergency Contacts", 
      description: "Quick access to emergency services and important contacts.", 
      color: "#d97706",
      gradient: "from-amber-500 to-amber-600"
    },
    { 
      to: "/game", 
      icon: "🎮", 
      title: "Memory Game", 
      description: "Sharpen your memory with our disaster icons game.", 
      color: "#0ea5e9",
      gradient: "from-sky-500 to-sky-600"
    },
  ];

  const handleLogin = () => {
    if (inputName.trim() !== "") {
      localStorage.setItem("username", inputName);
      setUsername(inputName);
      setShowLoginPopup(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("username");
    setUsername("");
    setShowLoginPopup(true);
    setShowProfile(false);
  };

  return (
    <div className="min-h-screen">
      {/* Login Popup */}
      {showLoginPopup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl transform animate-in fade-in duration-300">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">👋</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Aapda Setu</h2>
              <p className="text-gray-600">Please enter your name to get started</p>
            </div>
            <div className="space-y-4">
              <input
                type="text"
                value={inputName}
                onChange={(e) => setInputName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                placeholder="Enter your name"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
              <button 
                onClick={handleLogin}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Welcome back, <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{username || "User"}</span>!
              </h1>
              <p className="text-xl text-gray-600">Stay prepared and informed with the latest disaster management resources.</p>
            </div>
            
            {/* Time and Profile */}
            <div className="flex items-center space-x-6">
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">{formatTime(time)}</div>
                <div className="text-sm text-gray-500">Current Time</div>
              </div>
              
              <div className="relative">
                {username ? (
                  <div
                    className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-lg cursor-pointer shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                    onClick={() => setShowProfile((s) => !s)}
                  >
                    {username[0].toUpperCase()}
                  </div>
                ) : (
                  <img
                    src="https://i.pravatar.cc/150?img=65"
                    alt="User"
                    className="w-12 h-12 rounded-full object-cover cursor-pointer shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                    onClick={() => setShowProfile((s) => !s)}
                  />
                )}

                {showProfile && (
                  <div className="absolute right-0 top-16 bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 w-80 z-40 transform animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="text-center mb-4">
                      <div className="text-lg font-semibold text-gray-900">{username || "Guest"}</div>
                      <div className="text-sm text-gray-500">Disaster Preparedness Level</div>
                    </div>
                    
                    {/* Preparedness Progress */}
                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">Preparedness</span>
                        <span className="text-sm font-bold text-blue-600">{preparedness}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-indigo-500 h-3 rounded-full transition-all duration-500 ease-out"
                          style={{ width: `${preparedness}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Link 
                        to="/profile" 
                        className="block w-full text-center py-2 px-4 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-medium"
                      >
                        View Profile
                      </Link>
                      <Link 
                        to="/settings" 
                        className="block w-full text-center py-2 px-4 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors font-medium"
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
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Preparedness Level</p>
                  <p className="text-3xl font-bold text-blue-600">{preparedness}%</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">📊</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Drills Completed</p>
                  <p className="text-3xl font-bold text-emerald-600">{Math.floor(preparedness / 15)}</p>
                </div>
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">🧯</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Safety Score</p>
                  <p className="text-3xl font-bold text-violet-600">{preparedness > 70 ? 'Excellent' : preparedness > 40 ? 'Good' : 'Improving'}</p>
                </div>
                <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">🛡️</span>
                </div>
              </div>
            </div>
          </div>

          {/* Safety Tip */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6 mb-8">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">💡</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-amber-900 mb-2">Today's Safety Tip</h3>
                <p className="text-amber-800">{tip}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tools Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Disaster Management Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cardData.map((card) => (
            <Link
              key={card.title}
              to={card.to}
              className="group relative bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden"
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
              
              {/* Icon */}
              <div className={`w-16 h-16 bg-gradient-to-br ${card.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <span className="text-2xl text-white">{card.icon}</span>
              </div>
              
              {/* Content */}
              <div className="relative z-10">
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-gray-800 transition-colors">
                  {card.title}
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {card.description}
                </p>
                <div className="flex items-center text-blue-600 font-semibold group-hover:text-blue-700 transition-colors">
                  <span>Explore</span>
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}