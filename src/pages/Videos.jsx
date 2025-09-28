import React, { useState } from "react";
import { motion } from "framer-motion";

const VIDEOS = [
  {
    id: 1,
    url: "https://www.youtube.com/watch?v=BLEPakj1YTY",
    title: "Earthquake Safety Tips - Red Cross",
    description: "Learn essential earthquake safety measures and what to do during and after an earthquake. Master the 'Drop, Cover, and Hold On' technique that saves lives.",
    category: "Earthquake",
    duration: "5:32",
    difficulty: "Beginner",
    isWatched: true,
    reward: "+5% Preparedness",
    thumbnailUrl: "https://images.unsplash.com/photo-1506252374453-ef5237291d83?w=400&h=225&fit=crop"
  },
  {
    id: 2,
    url: "https://www.youtube.com/watch?v=43M5mZuzHF8",
    title: "Flood Preparedness | FEMA",
    description: "Comprehensive guide to flood preparedness, evacuation procedures, and safety measures. Learn how to create a flood emergency kit and evacuation plan.",
    category: "Flood",
    duration: "8:15",
    difficulty: "Intermediate",
    isWatched: false,
    reward: "+50 XP",
    thumbnailUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=225&fit=crop"
  },
  {
    id: 3,
    url: "https://www.youtube.com/watch?v=apwK7Y362qU",
    title: "Fire Safety & Evacuation Drills",
    description: "Master fire safety protocols, evacuation procedures, and emergency response techniques. Practice fire drills and learn to use fire extinguishers effectively.",
    category: "Fire",
    duration: "6:45",
    difficulty: "Beginner",
    isWatched: false,
    reward: "+3% Preparedness",
    thumbnailUrl: "https://images.unsplash.com/photo-1582053433976-0c6c837d2c6a?w=400&h=225&fit=crop"
  },
  {
    id: 4,
    url: "https://www.youtube.com/watch?v=TqZ3M7xh8jM",
    title: "Cyclone Safety Tips | Disaster Preparedness",
    description: "Essential cyclone preparedness strategies and safety measures for coastal areas. Learn evacuation routes and emergency shelter protocols.",
    category: "Cyclone",
    duration: "7:20",
    difficulty: "Intermediate",
    isWatched: true,
    reward: "+7% Preparedness",
    thumbnailUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=225&fit=crop"
  },
  {
    id: 5,
    url: "https://www.youtube.com/watch?v=example5",
    title: "First Aid Basics - Emergency Response",
    description: "Learn fundamental first aid techniques including CPR, wound care, and emergency response protocols for various disaster scenarios.",
    category: "First Aid",
    duration: "9:45",
    difficulty: "Beginner",
    isWatched: false,
    reward: "+75 XP",
    thumbnailUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=225&fit=crop"
  },
  {
    id: 6,
    url: "https://www.youtube.com/watch?v=example6",
    title: "Emergency Communication Protocols",
    description: "Master emergency communication systems, distress signals, and how to stay informed during critical disaster situations.",
    category: "Communication",
    duration: "4:30",
    difficulty: "Advanced",
    isWatched: false,
    reward: "+100 XP",
    thumbnailUrl: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=225&fit=crop"
  }
];

const CATEGORIES = ["All", "Earthquake", "Flood", "Fire", "Cyclone", "First Aid", "Communication"];

function getCategoryIcon(category) {
  const icons = {
    "Earthquake": "🏚️",
    "Flood": "🌊", 
    "Fire": "🔥",
    "Cyclone": "🌀",
    "First Aid": "🩹",
    "Communication": "📡",
    "All": "🎬"
  };
  return icons[category] || "📹";
}

function getDifficultyColor(difficulty) {
  const colors = {
    "Beginner": "bg-emerald-500/20 text-emerald-600 border-emerald-500/30 dark:text-emerald-400",
    "Intermediate": "bg-yellow-500/20 text-yellow-600 border-yellow-500/30 dark:text-yellow-400", 
    "Advanced": "bg-red-500/20 text-red-600 border-red-500/30 dark:text-red-400"
  };
  return colors[difficulty] || "bg-gray-500/20 text-gray-600 border-gray-500/30 dark:text-gray-400";
}

export default function VideoLibrary() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredVideos = VIDEOS.filter(video => {
    const matchesCategory = selectedCategory === "All" || video.category === selectedCategory;
    const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         video.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const totalWatched = VIDEOS.filter(video => video.isWatched).length;
  const completionRate = Math.round((totalWatched / VIDEOS.length) * 100);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#212121] transition-colors duration-200">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-blue-600 dark:bg-[#0D47A1]">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/80 to-blue-700/80 dark:from-[#0D47A1]/80 dark:to-[#1565C0]/80"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold text-white mb-4">🎬 Video Training Library</h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Level up your disaster preparedness skills through interactive video missions
            </p>
            
            {/* Progress Bar */}
            <div className="max-w-md mx-auto mt-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-blue-200">Training Progress</span>
                <span className="text-sm font-bold text-[#FF6F00]">{completionRate}%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-3 backdrop-blur-sm dark:bg-gray-700/50">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${completionRate}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="bg-gradient-to-r from-[#FF6F00] to-[#FFA000] h-3 rounded-full shadow-lg"
                ></motion.div>
              </div>
              <p className="text-xs text-blue-200 mt-2">
                {totalWatched} of {VIDEOS.length} missions completed
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/70 backdrop-blur-xl border border-slate-200 rounded-2xl p-6 mb-8 shadow-lg dark:bg-gray-800/50 dark:border-gray-700/50"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search training videos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/80 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#FF6F00] focus:border-transparent outline-none transition-all text-slate-800 placeholder-slate-500 dark:bg-gray-800/80 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((category) => (
                <motion.button
                  key={category}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-xl font-semibold transition-all duration-200 flex items-center space-x-2 border ${
                    selectedCategory === category
                      ? 'bg-[#FF6F00] text-white shadow-lg border-[#FF6F00]'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50 dark:bg-gray-700/50 dark:border-gray-600 dark:text-slate-300 dark:hover:bg-gray-600/50'
                  }`}
                >
                  <span>{getCategoryIcon(category)}</span>
                  <span>{category}</span>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/70 backdrop-blur-xl border border-slate-200 rounded-2xl p-6 shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer dark:bg-gray-800/50 dark:border-gray-700/50"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-[#B0B0B0]">Training Missions</p>
                <p className="text-3xl font-bold text-slate-800 dark:text-white">{VIDEOS.length}</p>
                <p className="text-xs text-slate-500 dark:text-[#B0B0B0] mt-1">Available videos</p>
              </div>
              <div className="w-12 h-12 bg-[#FF6F00]/20 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🎬</span>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/70 backdrop-blur-xl border border-slate-200 rounded-2xl p-6 shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer dark:bg-gray-800/50 dark:border-gray-700/50"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-[#B0B0B0]">Skill Categories</p>
                <p className="text-3xl font-bold text-slate-800 dark:text-white">{CATEGORIES.length - 1}</p>
                <p className="text-xs text-slate-500 dark:text-[#B0B0B0] mt-1">Different disaster types</p>
              </div>
              <div className="w-12 h-12 bg-[#FF6F00]/20 rounded-xl flex items-center justify-center">
                <span className="text-2xl">📚</span>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/70 backdrop-blur-xl border border-slate-200 rounded-2xl p-6 shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer dark:bg-gray-800/50 dark:border-gray-700/50"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-[#B0B0B0]">Active Results</p>
                <p className="text-3xl font-bold text-slate-800 dark:text-white">{filteredVideos.length}</p>
                <p className="text-xs text-slate-500 dark:text-[#B0B0B0] mt-1">Matching your criteria</p>
              </div>
              <div className="w-12 h-12 bg-[#FF6F00]/20 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🔍</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Videos Grid */}
        {filteredVideos.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <div className="w-24 h-24 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4 dark:bg-gray-700/50">
              <span className="text-4xl">🔍</span>
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2 dark:text-white">No training missions found</h3>
            <p className="text-slate-600 dark:text-[#B0B0B0]">Try adjusting your search or filter criteria.</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideos.map((video, idx) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + idx * 0.1 }}
                className="group relative bg-white/70 backdrop-blur-xl border border-slate-200 rounded-2xl shadow-lg hover:scale-105 transition-all duration-300 overflow-hidden cursor-pointer dark:bg-gray-800/50 dark:border-gray-700/50"
                onClick={() => window.open(video.url, "_blank")}
              >
                {/* Completed Badge */}
                {video.isWatched && (
                  <div className="absolute top-4 left-4 z-10 bg-emerald-500/20 text-emerald-600 px-3 py-1 rounded-full text-xs font-semibold border border-emerald-500/30 backdrop-blur-sm dark:text-emerald-400">
                    ✅ Completed
                  </div>
                )}

                {/* Reward Badge */}
                <div className="absolute top-4 right-4 z-10 bg-[#FF6F00]/20 text-[#FF6F00] px-3 py-1 rounded-full text-xs font-semibold border border-[#FF6F00]/30 backdrop-blur-sm">
                  {video.reward}
                </div>

                {/* Thumbnail */}
                <div className="relative overflow-hidden">
                  <img 
                    src={video.thumbnailUrl} 
                    alt={video.title} 
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent group-hover:bg-black/20 transition-colors duration-300 dark:from-gray-900/60"></div>
                  
                  {/* Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200 shadow-2xl">
                      <svg className="w-8 h-8 text-[#FF6F00] ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                  </div>
                  
                  {/* Duration */}
                  <div className="absolute bottom-3 right-3 bg-black/70 text-white px-2 py-1 rounded-lg text-sm font-medium backdrop-blur-sm">
                    {video.duration}
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getDifficultyColor(video.difficulty)}`}>
                      {video.difficulty}
                    </span>
                    <span className="text-sm text-slate-600 flex items-center space-x-1 dark:text-[#B0B0B0]">
                      <span>{getCategoryIcon(video.category)}</span>
                      <span>{video.category}</span>
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-[#FF6F00] transition-colors line-clamp-2 dark:text-white">
                    {video.title}
                  </h3>
                  
                  <p className="text-slate-600 text-sm leading-relaxed line-clamp-3 mb-4 dark:text-[#B0B0B0]">
                    {video.description}
                  </p>
                  
                  {/* CTA Button */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gradient-to-r from-[#FF6F00] to-[#FFA000] text-white py-3 px-4 rounded-xl font-semibold hover:from-[#FF8F00] hover:to-[#FFB300] transition-all duration-200 shadow-lg text-center flex items-center justify-center space-x-2"
                  >
                    <span>Start Mission</span>
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </motion.div>
                </div>

                {/* Glow Effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#FF6F00]/10 to-[#0D47A1]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Empty State for No Results */}
        {filteredVideos.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4 dark:bg-gray-700/50">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2 dark:text-white">No missions match your search</h3>
              <p className="text-slate-600 mb-4 dark:text-[#B0B0B0]">
                Try different keywords or browse all categories to find your next training mission.
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("All");
                }}
                className="bg-gradient-to-r from-[#FF6F00] to-[#FFA000] text-white px-6 py-2 rounded-xl font-semibold hover:from-[#FF8F00] hover:to-[#FFB300] transition-all duration-200"
              >
                Show All Missions
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
