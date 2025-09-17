/**
 * AI Assistant API - Hardcoded responses for demo
 * Provides contextual responses based on user queries and quick actions
 */

const responses = {
  alerts: [
    "There are 3 severe weather alerts in your area. Stay safe and follow evacuation protocols! 🚨",
    "No new alerts in your region. All clear for now! ✅",
    "Cyclone warning issued for coastal areas. Check the alerts page for details. 🌀",
    "Heavy rainfall expected in your area. Avoid waterlogged roads. 🌧️"
  ],
  quizzes: [
    "You scored 85% on your last quiz! Great job on disaster preparedness! 🎯",
    "Take a new quiz to boost your preparedness score. Knowledge saves lives! 📚",
    "Your quiz streak is 3 days! Keep learning about safety protocols. 🔥",
    "Quiz Master badge unlocked! You're becoming a safety expert! 🏅"
  ],
  drills: [
    "Next drill: Earthquake safety steps. Practice 'Drop, Cover, Hold' technique. 🏚️",
    "You've completed 4 drills this week. Excellent preparation! 💪",
    "Fire evacuation drill available. Learn the PASS technique for extinguishers. 🔥",
    "Flood safety drill recommended. Know your evacuation routes! 🌊"
  ],
  profile: [
    "Your preparedness score is 78%. You're on the right track! 📊",
    "Badge earned: Safety Champion 🏅 Keep up the great work!",
    "Daily streak: 5 days! Consistency builds preparedness. 🔥",
    "Profile completion: 90%. Add emergency contacts for full score. 👤"
  ],
  weather: [
    "Current weather: 28°C, partly cloudy. Good conditions for outdoor drills. ☁️",
    "Rain expected tomorrow. Perfect time for indoor safety training! 🌧️",
    "Clear skies ahead. Great weather for emergency kit preparation. ☀️"
  ],
  emergency: [
    "In case of emergency, call 112 for immediate assistance. Stay calm! 📞",
    "Remember: Drop, Cover, Hold for earthquakes. Your safety comes first! 🏚️",
    "Keep your emergency kit updated. Check expiry dates monthly. 🎒",
    "Share your location with family during emergencies. Communication is key! 📱"
  ]
};

/**
 * Gets a random response from a category
 * @param {string} category - Response category
 * @returns {string} Random response
 */
const getRandomResponse = (category) => {
  const categoryResponses = responses[category] || [];
  if (categoryResponses.length === 0) {
    return "I don't have information about that topic right now. 🤔";
  }
  return categoryResponses[Math.floor(Math.random() * categoryResponses.length)];
};

/**
 * Finds the appropriate category for a user message
 * @param {string} message - User message
 * @returns {string|null} Category name or null
 */
const findCategory = (message) => {
  if (!message || typeof message !== 'string') return null;
  
  const msg = message.toLowerCase();
  
  if (msg.includes('alert') || msg.includes('warning') || msg.includes('disaster')) return 'alerts';
  if (msg.includes('quiz') || msg.includes('test') || msg.includes('score')) return 'quizzes';
  if (msg.includes('drill') || msg.includes('practice') || msg.includes('exercise')) return 'drills';
  if (msg.includes('profile') || msg.includes('badge') || msg.includes('achievement')) return 'profile';
  if (msg.includes('weather') || msg.includes('temperature') || msg.includes('rain')) return 'weather';
  if (msg.includes('emergency') || msg.includes('help') || msg.includes('safety')) return 'emergency';
  
  return null;
};

/**
 * Handles assistant API requests
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export async function handler(req, res) {
  if (req.method !== 'POST') { 
    res.statusCode = 405; 
    res.end('Method Not Allowed'); 
    return; 
  }

  let body = '';
  await new Promise((resolve) => { 
    req.on('data', (c) => body += c); 
    req.on('end', resolve); 
  });

  let parsed;
  try { 
    parsed = JSON.parse(body || '{}'); 
  } catch (error) { 
    console.error('JSON parse error:', error);
    res.statusCode = 400;
    res.end(JSON.stringify({ message: "Invalid request format" }));
    return;
  }

  const { messages = [], quickAction } = parsed;
  
  // Add realistic delay for better UX
  const delay = 800 + Math.random() * 1200;
  await new Promise(resolve => setTimeout(resolve, delay));

  try {
    let response;
    
    if (quickAction) {
      // Handle quick action buttons
      response = getRandomResponse(quickAction) || "I'm here to help with your safety questions! 🛡️";
    } else {
      // Handle typed messages
      const lastMessage = messages[messages.length - 1]?.content || '';
      const category = findCategory(lastMessage);
      
      if (category) {
        response = getRandomResponse(category);
      } else {
        response = "I'm still learning! Try asking about alerts, quizzes, drills, profile, weather, or emergency tips. You can also use the quick action buttons below! 🤖";
      }
    }

    // Ensure response is not empty
    if (!response) {
      response = "I'm having trouble understanding that. Could you try rephrasing your question? 🤔";
    }

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ message: response }));
  } catch (error) {
    console.error('Assistant error:', error);
    res.statusCode = 500; 
    res.end(JSON.stringify({ 
      message: "I'm having trouble right now. Please try again in a moment! 🤖" 
    }));
  }
}

export default handler;