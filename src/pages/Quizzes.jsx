import React, { useState, useEffect } from "react";
import { NotificationContext } from "../context/NotificationContext";
import { useNavigate } from "react-router-dom";

const ALL_QUESTIONS = [
  { question: "Emergency number for Police in India?", options: ["100", "101", "102", "108"], answer: "100" },
  { question: "Emergency number for Fire in India?", options: ["100", "101", "102", "108"], answer: "101" },
  { question: "Emergency number for Ambulance in India?", options: ["100", "101", "102", "108"], answer: "102" },
  { question: "Emergency number for Disaster Helpline in India?", options: ["108", "112", "1098", "100"], answer: "108" },
  { question: "What does 'Drop, Cover, Hold' mean?", options: ["Earthquake safety action", "Fire escape", "Flood warning", "Cyclone signal"], answer: "Earthquake safety action" },
  { question: "Best place to hide during earthquake?", options: ["Under strong desk", "Near window", "Balcony", "Elevator"], answer: "Under strong desk" },
  { question: "What should you do if clothes catch fire?", options: ["Run fast", "Jump in water", "Stop, Drop, Roll", "Shout only"], answer: "Stop, Drop, Roll" },
  { question: "During flood, what should you avoid?", options: ["Walking in moving water", "Boiled water", "Carrying torch", "Moving to higher ground"], answer: "Walking in moving water" },
  { question: "During lightning storm, what to avoid?", options: ["Open fields", "Tall trees", "Metal objects", "All of these"], answer: "All of these" },
  { question: "What is NDMA?", options: ["National Disaster Management Authority", "National Defence Medical Agency", "National Development Monitoring Act", "None"], answer: "National Disaster Management Authority" },
  { question: "What should you do first when you hear a fire alarm at school?", options: ["Line up and follow teacher", "Hide under desk", "Keep playing", "Run outside randomly"], answer: "Line up and follow teacher" },
  { question: "Where is a safe place during a tornado drill?", options: ["Hallway away from windows", "Playground", "Gym with windows", "Car"], answer: "Hallway away from windows" },
  { question: "During fire drill, how should you leave the building?", options: ["Quickly and quietly", "Running and shouting", "Slowly talking", "Skipping"], answer: "Quickly and quietly" },
  { question: "Who is the leader in your classroom during a drill?", options: ["Teacher", "Principal", "Class pet", "Tallest student"], answer: "Teacher" },
  { question: "What is an emergency kit for?", options: ["Supplies you might need", "Snacks only", "Toys", "Homework"], answer: "Supplies you might need" },
];

// Function to shuffle array randomly (Fisher-Yates algorithm)
function shuffleArray(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

// Function to prepare questions with randomized options
function prepareQuestions(questions) {
  return questions.map(q => {
    // Create an array of option indices to track original positions
    const optionIndices = q.options.map((_, index) => index);
    
    // Shuffle the option indices
    const shuffledIndices = shuffleArray(optionIndices);
    
    // Create new options array with shuffled order
    const shuffledOptions = shuffledIndices.map(i => q.options[i]);
    
    // Find the new position of the correct answer
    const originalAnswerIndex = q.options.indexOf(q.answer);
    const newAnswerIndex = shuffledIndices.indexOf(originalAnswerIndex);
    
    return {
      question: q.question,
      options: shuffledOptions,
      answer: shuffledOptions[newAnswerIndex],
      originalData: q // Keep original for debugging if needed
    };
  });
}

function pickRandomQuestions(all, count = 10) {
  const shuffled = [...all].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export default function Quizzes() {
  const navigate = useNavigate();
  const { addNotification } = React.useContext(NotificationContext);
  const [showStartPage, setShowStartPage] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showScore, setShowScore] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [quizStarted, setQuizStarted] = useState(false);

  useEffect(() => {
    if (!showStartPage && !showScore) {
      const randomQuestions = pickRandomQuestions(ALL_QUESTIONS, 10);
      const preparedQuestions = prepareQuestions(randomQuestions);
      setQuestions(preparedQuestions);
      setQuizStarted(true);
      setTimeLeft(30);
    }
  }, [showStartPage, showScore]);

  useEffect(() => {
    let timer;
    if (quizStarted && !showScore && timeLeft > 0 && !selected) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0 && !selected) {
      handleNext();
    }
    return () => clearTimeout(timer);
  }, [timeLeft, quizStarted, showScore, selected]);

  if (questions.length === 0 && !showStartPage) return <div>Loading...</div>;

  const current = questions[currentIdx];
  const percentage = ((score / questions.length) * 100).toFixed(0);
  const progress = ((currentIdx + 1) / questions.length) * 100;

  const handleOptionClick = (option) => {
    if (selected) return;
    setSelected(option);
    if (option === current.answer) setScore((s) => s + 1);
  };

  const handleNext = () => {
    setSelected(null);
    setTimeLeft(30);
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setShowScore(true);
      setQuizStarted(false);

      const percent = Math.round((score / questions.length) * 100);
      localStorage.setItem("lastQuizPercent", String(percent));
      let currentPrep = parseInt(localStorage.getItem("preparedness")) || 0;
      let bonus = Math.round((percent / 100) * 20);
      let updated = Math.min(currentPrep + bonus, 100);
      localStorage.setItem("preparedness", String(updated));

      // badge
      if (percent >= 80) {
        const badges = JSON.parse(localStorage.getItem("badges") || "[]");
        if (!badges.includes("Quiz Master")) {
          const next = [...badges, "Quiz Master"];
          localStorage.setItem("badges", JSON.stringify(next));
          addNotification("🎉 Earned badge: Quiz Master");
        }
      }
    }
  };

  const handleRestart = () => {
    setShowStartPage(true);
    setQuestions([]);
    setCurrentIdx(0);
    setScore(0);
    setSelected(null);
    setShowScore(false);
    setQuizStarted(false);
    setTimeLeft(30);
  };

  const getScoreMessage = () => {
    if (score >= 8) return { message: "🎉 Excellent! You're a disaster preparedness expert!", color: "text-emerald-600", bg: "bg-emerald-50", darkBg: "dark:bg-emerald-900/20", darkColor: "dark:text-emerald-400" };
    if (score >= 6) return { message: "👍 Great job! You have good knowledge of safety protocols.", color: "text-blue-600", bg: "bg-blue-50", darkBg: "dark:bg-blue-900/20", darkColor: "dark:text-blue-400" };
    if (score >= 4) return { message: "📚 Good effort! Keep learning to improve your preparedness.", color: "text-yellow-600", bg: "bg-yellow-50", darkBg: "dark:bg-yellow-900/20", darkColor: "dark:text-yellow-400" };
    return { message: "💪 Don't give up! Practice more to become disaster-ready.", color: "text-red-600", bg: "bg-red-50", darkBg: "dark:bg-red-900/20", darkColor: "dark:text-red-400" };
  };

  // Start Page
  if (showStartPage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-gray-900 dark:to-blue-900/30 transition-colors duration-200 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white p-8 text-center">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">🧠</span>
              </div>
              <h1 className="text-3xl font-bold mb-2">Safety Knowledge Quiz</h1>
              <p className="text-emerald-100">Test your disaster preparedness knowledge</p>
            </div>

            {/* Content */}
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl">
                  <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">10</div>
                  <div className="text-sm text-emerald-700 dark:text-emerald-300">Questions</div>
                </div>
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">30s</div>
                  <div className="text-sm text-blue-700 dark:text-blue-300">Per Question</div>
                </div>
                <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-2xl">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">+20%</div>
                  <div className="text-sm text-purple-700 dark:text-purple-300">Max Score Boost</div>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
                  <span className="w-6 h-6 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400 text-sm">✓</span>
                  <span>Multiple choice questions about disaster safety</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
                  <span className="w-6 h-6 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400 text-sm">✓</span>
                  <span>Timed questions to test quick thinking</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
                  <span className="w-6 h-6 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400 text-sm">✓</span>
                  <span>Boost your preparedness score based on performance</span>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => setShowStartPage(false)}
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-blue-500 text-white py-4 rounded-2xl font-bold text-lg hover:from-emerald-600 hover:to-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Start Quiz 🚀
                </button>
                <button
                  onClick={() => navigate(-1)}
                  className="px-6 py-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-2xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200"
                >
                  Back
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Quiz Page
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-gray-900 dark:to-blue-900/30 p-4 transition-colors duration-200">
      <div className="max-w-4xl mx-auto">
        {showScore ? (
          // Results Page
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white p-8 text-center">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">🎯</span>
              </div>
              <h1 className="text-3xl font-bold mb-2">Quiz Complete!</h1>
              <p className="text-emerald-100">Here are your results</p>
            </div>

            <div className="p-8">
              <div className="text-center mb-8">
                <div className="text-6xl font-bold text-gray-900 dark:text-white mb-2">{score}/{questions.length}</div>
                <div className="text-2xl font-semibold text-gray-600 dark:text-gray-400 mb-4">{percentage}% Correct</div>
                
                <div className={`inline-block px-6 py-3 rounded-2xl ${getScoreMessage().bg} ${getScoreMessage().darkBg} ${getScoreMessage().color} ${getScoreMessage().darkColor} font-semibold text-lg`}>
                  {getScoreMessage().message}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl p-6 text-center">
                  <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{score}</div>
                  <div className="text-emerald-700 dark:text-emerald-300">Correct Answers</div>
                </div>
                <div className="bg-red-50 dark:bg-red-900/20 rounded-2xl p-6 text-center">
                  <div className="text-3xl font-bold text-red-600 dark:text-red-400">{questions.length - score}</div>
                  <div className="text-red-700 dark:text-red-300">Incorrect Answers</div>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={handleRestart}
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-blue-500 text-white py-4 rounded-2xl font-bold hover:from-emerald-600 hover:to-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Try Again 🔄
                </button>
                <button
                  onClick={() => navigate("/")}
                  className="px-6 py-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-2xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200"
                >
                  Dashboard
                </button>
              </div>
            </div>
          </div>
        ) : (
          // Question Page
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
            {/* Progress Header */}
            <div className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="text-lg font-semibold">Question {currentIdx + 1} of {questions.length}</div>
                <div className="flex items-center space-x-4">
                  <div className="text-lg font-semibold">⏱️ {timeLeft}s</div>
                  <div className="text-lg font-semibold">Score: {score}</div>
                </div>
              </div>
              
              <div className="w-full bg-white/20 rounded-full h-2">
                <div 
                  className="bg-white h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>

            {/* Question Content */}
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 leading-relaxed">
                {current.question}
              </h2>

              <div className="space-y-4 mb-8">
                {current.options.map((option, i) => {
                  let buttonClass = "w-full p-4 text-left border-2 rounded-2xl font-semibold transition-all duration-200 ";
                  
                  if (selected) {
                    if (option === current.answer) {
                      buttonClass += "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400";
                    } else if (option === selected && selected !== current.answer) {
                      buttonClass += "border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400";
                    } else {
                      buttonClass += "border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400";
                    }
                  } else {
                    buttonClass += "border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:border-blue-300 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer";
                  }

                  return (
                    <button
                      key={i}
                      onClick={() => handleOptionClick(option)}
                      className={buttonClass}
                      disabled={selected}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full border-2 border-current flex items-center justify-center font-bold">
                          {String.fromCharCode(65 + i)}
                        </div>
                        <span>{option}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {selected && (
                <div className="text-center">
                  <button
                    onClick={handleNext}
                    className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white px-8 py-4 rounded-2xl font-bold hover:from-emerald-600 hover:to-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    {currentIdx === questions.length - 1 ? "Finish Quiz" : "Next Question"} →
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
