import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const ACCENT_START = "#FF6F00";
const ACCENT_END = "#FFA000";

const Profile = () => {
  // Single state object for all profile fields
  const [profile, setProfile] = useState({
    name: "",
    age: "",
    email: "",
    phone: "",
    address: "",
    bloodGroup: "",
    height: "",
    weight: "",
    emergencyContact1: "",
    emergencyContact2: "",
    emergencyContact3: ""
  });

  // Initialize state from localStorage on component mount
  useEffect(() => {
    const savedProfile = JSON.parse(localStorage.getItem("userProfile") || "{}");
    setProfile(prev => ({
      ...prev,
      ...savedProfile
    }));
  }, []);

  // Save to localStorage whenever profile changes
  useEffect(() => {
    localStorage.setItem("userProfile", JSON.stringify(profile));
  }, [profile]);

  // Calculate completion percentage
  const calculateCompletion = () => {
    const fields = Object.values(profile);
    const filledFields = fields.filter(value => value && value.trim() !== "").length;
    return Math.round((filledFields / fields.length) * 100);
  };

  const completionPercentage = calculateCompletion();

  // Handle input changes
  const handleChange = (field, value) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle save button click
  const handleSave = () => {
    toast.success("✅ Profile updated successfully!");
  };

  // Field icons mapping
  const fieldIcons = {
    name: "👤",
    age: "🎂",
    email: "✉️",
    phone: "📞",
    address: "🏠",
    bloodGroup: "🩸",
    height: "📏",
    weight: "⚖️",
    emergencyContact1: "🚨",
    emergencyContact2: "🚨",
    emergencyContact3: "🚨"
  };

  // Badges data
  const badges = [
    { name: "Profile Pioneer", earned: completionPercentage >= 50, description: "Complete 50% of your profile" },
    { name: "Guardian Elite", earned: completionPercentage >= 90, description: "Complete 90% of your profile" },
    { name: "Emergency Ready", earned: profile.emergencyContact1 && profile.emergencyContact2, description: "Add at least 2 emergency contacts" },
    { name: "Medical Pro", earned: profile.bloodGroup && profile.height && profile.weight, description: "Complete all medical details" }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
      {/* Header Section */}
      <div className="relative overflow-hidden">
        <div className="w-full">
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" style={{ background: '#0D47A1' }}>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <h1 className="text-4xl font-bold text-white mb-4">
                Complete Your Guardian Profile 🎯
              </h1>
              <p className="text-xl text-blue-100 mb-6">
                Unlock your full preparedness potential by completing your mission
              </p>

              {/* Progress Bar */}
              <div className="max-w-2xl mx-auto">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-blue-200">Profile Completion</span>
                  <span className="text-sm font-bold text-[#FF6F00]">{completionPercentage}%</span>
                </div>

                <div className="w-full bg-white/20 dark:bg-slate-800 rounded-full h-4">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${completionPercentage}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-4 rounded-full shadow-sm"
                    style={{
                      background: `linear-gradient(90deg, ${ACCENT_START}, ${ACCENT_END})`
                    }}
                  />
                </div>

                <p className="text-xs text-blue-200 mt-2">
                  {completionPercentage === 100 ? "🎉 Mission Complete! You're a Guardian Elite!"
                    : `${10 - Math.ceil(completionPercentage / 10)} sections remaining to complete your mission`}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Form Sections */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className={
                "rounded-2xl p-6 shadow-sm " +
                "bg-white border border-slate-200 backdrop-blur-xl " +
                "dark:bg-gray-800/50 dark:backdrop-blur-xl dark:border-slate-700"
              }
            >
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-[#FF6F00] to-[#FFA000] rounded-xl flex items-center justify-center mr-4">
                  <span className="text-xl">👤</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Personal Information</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Your basic identification details</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-slate-700 dark:text-slate-400">
                    <span className="mr-2">👤</span>
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    className={
                      "w-full px-4 py-3 rounded-xl outline-none transition-all text-slate-900 dark:text-white " +
                      "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                    }
                    placeholder="Enter your full name"
                  />
                </div>

                {/* Age */}
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-slate-700 dark:text-slate-400">
                    <span className="mr-2">🎂</span>
                    Age
                  </label>
                  <input
                    type="number"
                    value={profile.age}
                    onChange={(e) => handleChange("age", e.target.value)}
                    className={
                      "w-full px-4 py-3 rounded-xl outline-none transition-all text-slate-900 dark:text-white " +
                      "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                    }
                    placeholder="Your age"
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-slate-700 dark:text-slate-400">
                    <span className="mr-2">✉️</span>
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className={
                      "w-full px-4 py-3 rounded-xl outline-none transition-all text-slate-900 dark:text-white " +
                      "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                    }
                    placeholder="your.email@example.com"
                  />
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-slate-700 dark:text-slate-400">
                    <span className="mr-2">📞</span>
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    className={
                      "w-full px-4 py-3 rounded-xl outline-none transition-all text-slate-900 dark:text-white " +
                      "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                    }
                    placeholder="+1 (555) 000-0000"
                  />
                </div>

                {/* Address */}
                <div className="md:col-span-2 space-y-2">
                  <label className="flex items-center text-sm font-medium text-slate-700 dark:text-slate-400">
                    <span className="mr-2">🏠</span>
                    Home Address
                  </label>
                  <input
                    type="text"
                    value={profile.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                    className={
                      "w-full px-4 py-3 rounded-xl outline-none transition-all text-slate-900 dark:text-white " +
                      "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                    }
                    placeholder="Your complete residential address"
                  />
                </div>
              </div>
            </motion.div>

            {/* Medical Details Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className={
                "rounded-2xl p-6 shadow-sm " +
                "bg-white border border-slate-200 backdrop-blur-xl " +
                "dark:bg-gray-800/50 dark:backdrop-blur-xl dark:border-slate-700"
              }
            >
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-[#FF6F00] to-[#FFA000] rounded-xl flex items-center justify-center mr-4">
                  <span className="text-xl">🏥</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Medical Details</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Critical health information for emergencies</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Blood Group */}
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-slate-700 dark:text-slate-400">
                    <span className="mr-2">🩸</span>
                    Blood Group
                  </label>
                  <select
                    value={profile.bloodGroup}
                    onChange={(e) => handleChange("bloodGroup", e.target.value)}
                    className={
                      "w-full px-4 py-3 rounded-xl outline-none transition-all text-slate-900 dark:text-white " +
                      "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                    }
                  >
                    <option value="">Select Blood Type</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>

                {/* Height */}
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-slate-700 dark:text-slate-400">
                    <span className="mr-2">📏</span>
                    Height (cm)
                  </label>
                  <input
                    type="number"
                    value={profile.height}
                    onChange={(e) => handleChange("height", e.target.value)}
                    className={
                      "w-full px-4 py-3 rounded-xl outline-none transition-all text-slate-900 dark:text-white " +
                      "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                    }
                    placeholder="Height in cm"
                  />
                </div>

                {/* Weight */}
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-slate-700 dark:text-slate-400">
                    <span className="mr-2">⚖️</span>
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    value={profile.weight}
                    onChange={(e) => handleChange("weight", e.target.value)}
                    className={
                      "w-full px-4 py-3 rounded-xl outline-none transition-all text-slate-900 dark:text-white " +
                      "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                    }
                    placeholder="Weight in kg"
                  />
                </div>
              </div>
            </motion.div>

            {/* Emergency Contacts Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className={
                "rounded-2xl p-6 shadow-sm " +
                "bg-white border border-slate-200 backdrop-blur-xl " +
                "dark:bg-gray-800/50 dark:backdrop-blur-xl dark:border-slate-700"
              }
            >
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-[#FF6F00] to-[#FFA000] rounded-xl flex items-center justify-center mr-4">
                  <span className="text-xl">🚨</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Emergency Contacts</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Your safety network for critical situations</p>
                </div>
              </div>

              <div className="space-y-4">
                {[1, 2, 3].map((contactNum) => (
                  <div key={contactNum} className="space-y-2">
                    <label className="flex items-center text-sm font-medium text-slate-700 dark:text-slate-400">
                      <span className="mr-2">🚨</span>
                      Emergency Contact {contactNum}
                    </label>
                    <input
                      type="text"
                      value={profile[`emergencyContact${contactNum}`]}
                      onChange={(e) => handleChange(`emergencyContact${contactNum}`, e.target.value)}
                      className={
                        "w-full px-4 py-3 rounded-xl outline-none transition-all text-slate-900 dark:text-white " +
                        "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                      }
                      placeholder={`Name and phone of contact ${contactNum}`}
                    />
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Save Button */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSave}
              className={
                "w-full rounded-2xl py-4 font-bold text-lg text-black " +
                "bg-gradient-to-r from-[#FF6F00] to-[#FFA000] shadow-md"
              }
            >
              🚀 Complete Mission & Save Profile
            </motion.button>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Preparedness Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className={
                "rounded-2xl p-6 shadow-sm " +
                "bg-white border border-slate-200 backdrop-blur-xl " +
                "dark:bg-gray-800/50 dark:backdrop-blur-xl dark:border-slate-700"
              }
            >
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Your Guardian Status</h3>

              {/* Preparedness Score */}
              <div className="text-center mb-6">
                <div className="text-5xl font-bold text-[#FF6F00] mb-2">{completionPercentage}%</div>
                <div className="text-sm text-slate-500 dark:text-slate-400">Profile Completion</div>
                <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-3 mt-4 overflow-hidden">
                  <div
                    className="h-3 rounded-full transition-all duration-500"
                    style={{
                      width: `${completionPercentage}%`,
                      background: `linear-gradient(90deg, ${ACCENT_START}, ${ACCENT_END})`
                    }}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 dark:text-slate-400">Preparedness Level</span>
                  <span className={`font-semibold ${
                    completionPercentage >= 90 ? "text-emerald-400" :
                    completionPercentage >= 70 ? "text-blue-400" :
                    completionPercentage >= 50 ? "text-yellow-400" :
                    "text-red-400"
                  }`}>
                    {completionPercentage >= 90 ? "Guardian Elite" :
                     completionPercentage >= 70 ? "Safety Expert" :
                     completionPercentage >= 50 ? "Preparedness Pro" :
                     "Rookie Guardian"}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 dark:text-slate-400">Mission Progress</span>
                  <span className="text-[#FF6F00] font-semibold">
                    {Math.ceil(completionPercentage / 25)}/4 Chapters
                  </span>
                </div>
              </div>

              <div className="mt-6 p-4 rounded-xl border" style={{ borderColor: 'rgba(255,111,0,0.12)', background: 'rgba(255,111,0,0.04)' }}>
                <p className="text-sm text-slate-700 dark:text-slate-300 text-center">
                  {completionPercentage === 100 ?
                    "🎉 You've achieved maximum preparedness! You're a true Guardian!" :
                    `Complete your profile to unlock the "${completionPercentage >= 50 ? 'Guardian Elite' : 'Profile Pioneer'}" badge!`}
                </p>
              </div>
            </motion.div>

            {/* Badges Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className={
                "rounded-2xl p-6 shadow-sm " +
                "bg-white border border-slate-200 backdrop-blur-xl " +
                "dark:bg-gray-800/50 dark:backdrop-blur-xl dark:border-slate-700"
              }
            >
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Available Badges</h3>
              <div className="space-y-4">
                {badges.map((badge, index) => (
                  <div key={index} className={
                    "flex items-center p-3 rounded-xl border " +
                    (badge.earned ? "bg-white/50 border-[#FF6F00]/30 dark:bg-[#FF6F00]/10 dark:border-[#FF6F00]/30" : "bg-slate-50 border-slate-200 dark:bg-slate-700/30 dark:border-slate-600")
                  }>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${badge.earned ? 'bg-[#FF6F00]' : 'bg-slate-600'}`}>
                      <span className="text-lg">{badge.earned ? "🏆" : "🔒"}</span>
                    </div>
                    <div>
                      <div className={`font-semibold ${badge.earned ? 'text-[#FF6F00]' : 'text-slate-700 dark:text-slate-300'}`}>
                        {badge.name}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">{badge.description}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 text-center">
                <Link
                  to="/leaderboard"
                  className="inline-block px-4 py-2 rounded-lg text-sm font-medium border border-slate-200 bg-white dark:bg-slate-800 dark:border-slate-700 text-slate-900 dark:text-white"
                >
                  View Leaderboard →
                </Link>
              </div>
            </motion.div>

            {/* Quick Tips */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className={
                "rounded-2xl p-6 shadow-sm " +
                "bg-white border border-slate-200 backdrop-blur-xl " +
                "dark:bg-gray-800/50 dark:backdrop-blur-xl dark:border-slate-700"
              }
            >
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Mission Tips 💡</h3>
              <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-400">
                <li className="flex items-start">
                  <span className="text-[#FF6F00] mr-2">•</span>
                  Complete all sections to achieve "Guardian Elite" status
                </li>
                <li className="flex items-start">
                  <span className="text-[#FF6F00] mr-2">•</span>
                  Emergency contacts are crucial for your safety network
                </li>
                <li className="flex items-start">
                  <span className="text-[#FF6F00] mr-2">•</span>
                  Medical details help first responders in emergencies
                </li>
                <li className="flex items-start">
                  <span className="text-[#FF6F00] mr-2">•</span>
                  Your data is automatically saved as you type
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
