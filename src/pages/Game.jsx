// pages/Game.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const ICONS = ["🚑", "🔥", "🚓", "🏥", "📞", "⚡"];

function shuffleArray(array) {
  return array
    .concat(array) // duplicate for pairs
    .sort(() => Math.random() - 0.5);
}

export default function Game() {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [bestScore, setBestScore] = useState(null);

  useEffect(() => {
    // Load best score from localStorage
    const savedBest = localStorage.getItem("memoryMatchBestScore");
    if (savedBest) {
      setBestScore(parseInt(savedBest));
    }
  }, []);

  useEffect(() => {
    if (gameStarted) {
      setCards(shuffleArray(ICONS));
    }
  }, [gameStarted]);

  const handleFlip = (index) => {
    if (flipped.length === 2 || flipped.includes(index) || matched.includes(index)) {
      return;
    }

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      const [first, second] = newFlipped;
      if (cards[first] === cards[second]) {
        setMatched((m) => [...m, first, second]);
      }
      setTimeout(() => setFlipped([]), 800);
    }
  };

  const restartGame = () => {
    setCards(shuffleArray(ICONS));
    setFlipped([]);
    setMatched([]);
    setMoves(0);
  };

  // Update best score when game is won
  useEffect(() => {
    if (matched.length === cards.length && cards.length > 0) {
      if (!bestScore || moves < bestScore) {
        const newBest = moves;
        setBestScore(newBest);
        localStorage.setItem("memoryMatchBestScore", newBest.toString());
      }
    }
  }, [matched, cards.length, moves, bestScore]);

  // ------------------
  // ENHANCED INTRO SCREEN
  // ------------------
  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-[#212121] relative overflow-hidden">
        {/* Animated Grid Background */}
        <div className="absolute inset-0 bg-[length:50px_50px] bg-[linear-gradient(rgba(255,111,0,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,111,0,0.1)_1px,transparent_1px)] animate-[gridMove_20s_linear_infinite]"></div>
        
        {/* Floating Particles */}
        <div className="absolute inset-0">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-[#FF6F00] rounded-full"
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                scale: 0
              }}
              animate={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                scale: [0, 1, 0]
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2
              }}
            />
          ))}
        </div>

        <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
          {/* Glassmorphism Mission Briefing Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="bg-gray-800/40 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 shadow-2xl w-full max-w-2xl relative overflow-hidden"
          >
            {/* HUD Corner Brackets */}
            <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-[#FF6F00]"></div>
            <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-[#FF6F00]"></div>
            <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-[#FF6F00]"></div>
            <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-[#FF6F00]"></div>

            {/* Header */}
            <div className="text-center mb-8">
              <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-5xl font-bold text-white mb-4"
              >
                <span className="bg-gradient-to-r from-[#FF6F00] to-[#FF8C00] bg-clip-text text-transparent">
                  Disaster Hero
                </span>
                <br />
                <span className="text-white">Memory Match</span>
              </motion.h1>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="w-24 h-1 bg-gradient-to-r from-[#FF6F00] to-[#FF8C00] mx-auto rounded-full"
              ></motion.div>
            </div>

            {/* Mission Briefing Content */}
            <div className="space-y-8">
              {/* Objective Header */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="text-center"
              >
                <h2 className="text-2xl font-bold text-white mb-2">Your Objective</h2>
                <p className="text-gray-300">
                  Match all emergency service pairs in the fewest moves to become a true Disaster Hero!
                </p>
              </motion.div>

              {/* Instructions Grid */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
              >
                {/* Step 1 */}
                <div className="text-center group">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="w-20 h-20 bg-gradient-to-br from-[#FF6F00] to-[#FF8C00] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300"
                  >
                    <span className="text-3xl">🔄</span>
                  </motion.div>
                  <h3 className="text-lg font-semibold text-white mb-2">1. Flip Cards</h3>
                  <p className="text-gray-400 text-sm">Click cards to reveal emergency service icons</p>
                </div>

                {/* Step 2 */}
                <div className="text-center group">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="w-20 h-20 bg-gradient-to-br from-[#FF6F00] to-[#FF8C00] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300"
                  >
                    <span className="text-3xl">✅</span>
                  </motion.div>
                  <h3 className="text-lg font-semibold text-white mb-2">2. Match Pairs</h3>
                  <p className="text-gray-400 text-sm">Find matching pairs of emergency services</p>
                </div>

                {/* Step 3 */}
                <div className="text-center group">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="w-20 h-20 bg-gradient-to-br from-[#FF6F00] to-[#FF8C00] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300"
                  >
                    <span className="text-3xl">⚡</span>
                  </motion.div>
                  <h3 className="text-lg font-semibold text-white mb-2">3. Finish Fast</h3>
                  <p className="text-gray-400 text-sm">Complete with minimum moves for high score</p>
                </div>
              </motion.div>

              {/* Personal Best */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="text-center p-4 bg-gray-700/30 rounded-2xl border border-gray-600/30 backdrop-blur-sm"
              >
                <h3 className="text-lg font-semibold text-white mb-2">🏆 Personal Best</h3>
                <p className="text-2xl font-bold text-[#FF6F00]">
                  {bestScore ? `${bestScore} moves` : "No record yet"}
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  {bestScore ? "Can you beat your record?" : "Be the first to set a record!"}
                </p>
              </motion.div>

              {/* Start Mission Button */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="text-center"
              >
                <motion.button
                  onClick={() => setGameStarted(true)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  animate={{
                    scale: [1, 1.05, 1],
                    boxShadow: [
                      "0 0 20px rgba(255, 111, 0, 0.3)",
                      "0 0 40px rgba(255, 111, 0, 0.6)",
                      "0 0 20px rgba(255, 111, 0, 0.3)"
                    ]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="w-full max-w-md bg-gradient-to-r from-[#FF6F00] to-[#FF8C00] text-white py-4 px-8 rounded-2xl font-bold text-xl shadow-2xl relative overflow-hidden group"
                >
                  {/* Button Shine Effect */}
                  <div className="absolute inset-0 -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                  
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    Start Mission 🚀
                  </span>
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Custom CSS for grid animation */}
        <style jsx>{`
          @keyframes gridMove {
            0% {
              background-position: 0% 0%;
            }
            100% {
              background-position: 50px 50px;
            }
          }
        `}</style>
      </div>
    );
  }

  // ------------------
  // ENHANCED MAIN GAME
  // ------------------
  return (
    <div className="min-h-screen bg-[#212121] relative overflow-hidden p-6">
      {/* Animated Grid Background */}
      <div className="absolute inset-0 bg-[length:50px_50px] bg-[linear-gradient(rgba(255,111,0,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,111,0,0.1)_1px,transparent_1px)] animate-[gridMove_20s_linear_infinite]"></div>

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Game Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">
            <span className="bg-gradient-to-r from-[#FF6F00] to-[#FF8C00] bg-clip-text text-transparent">
              Disaster Hero
            </span>
          </h1>
          <p className="text-gray-300">Match the emergency service icons!</p>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center items-center gap-8 mb-8"
        >
          <div className="text-center bg-gray-800/40 backdrop-blur-xl rounded-2xl p-4 border border-gray-700/50 min-w-[120px]">
            <div className="text-sm text-gray-400">Moves</div>
            <div className="text-2xl font-bold text-[#FF6F00]">{moves}</div>
          </div>
          
          <div className="text-center bg-gray-800/40 backdrop-blur-xl rounded-2xl p-4 border border-gray-700/50 min-w-[120px]">
            <div className="text-sm text-gray-400">Best</div>
            <div className="text-2xl font-bold text-[#FF6F00]">
              {bestScore || "-"}
            </div>
          </div>
        </motion.div>

        {/* Game Board */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-4 gap-4 justify-center mb-8 max-w-md mx-auto"
        >
          {cards.map((icon, index) => {
            const isFlipped = flipped.includes(index) || matched.includes(index);
            return (
              <motion.div
                key={index}
                onClick={() => handleFlip(index)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`
                  w-20 h-20 md:w-24 md:h-24 flex items-center justify-center text-3xl 
                  rounded-2xl cursor-pointer shadow-2xl transition-all duration-300
                  ${isFlipped 
                    ? 'bg-gradient-to-br from-[#FF6F00] to-[#FF8C00] text-white' 
                    : 'bg-gray-700/40 backdrop-blur-xl border border-gray-600/50 text-transparent hover:border-[#FF6F00]/50'
                  }
                `}
                style={{
                  backdropFilter: 'blur(10px)'
                }}
              >
                {icon}
              </motion.div>
            );
          })}
        </motion.div>

        {/* Win Message */}
        {matched.length === cards.length && cards.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center bg-gray-800/40 backdrop-blur-xl rounded-3xl p-8 border border-[#FF6F00]/30 shadow-2xl max-w-md mx-auto"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.5 }}
              className="text-4xl mb-4"
            >
              🎉
            </motion.div>
            <h2 className="text-2xl font-bold text-white mb-2">Mission Complete!</h2>
            <p className="text-gray-300 mb-2">You matched all pairs in {moves} moves!</p>
            
            {/* New Best Score Celebration */}
            {(!bestScore || moves < bestScore) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-[#FF6F00] font-bold text-lg mb-4"
              >
                🏆 New Personal Best! 🏆
              </motion.div>
            )}
            
            <motion.button
              onClick={restartGame}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-[#FF6F00] to-[#FF8C00] text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Play Again 🔄
            </motion.button>
          </motion.div>
        )}

        {/* Restart Button (shown during game) */}
        {matched.length !== cards.length && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center"
          >
            <motion.button
              onClick={restartGame}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gray-700/40 backdrop-blur-xl border border-gray-600/50 text-white py-2 px-6 rounded-xl font-semibold hover:border-[#FF6F00]/50 transition-all duration-300"
            >
              Restart Game
            </motion.button>
          </motion.div>
        )}
      </div>

      {/* Custom CSS for grid animation */}
      <style jsx>{`
        @keyframes gridMove {
          0% {
            background-position: 0% 0%;
          }
          100% {
            background-position: 50px 50px;
          }
        }
      `}</style>
    </div>
  );
}
