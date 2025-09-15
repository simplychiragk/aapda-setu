/* eslint-env node */
import jwt from 'jsonwebtoken';
import cookie from 'cookie';

const JWT_SECRET = process.env.JWT_SECRET || 'demo-jwt-secret-key-change-in-production';

function requireStaff(req) {
  try {
    const cookies = cookie.parse(req.headers.cookie || '');
    const token = cookies.token;
    if (!token) return null;
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== 'staff') return null;
    return decoded;
  } catch { 
    return null; 
  }
}

// Generate realistic mock student data
function generateMockStudents() {
  const names = [
    'Aarav Sharma', 'Vivaan Patel', 'Aditya Kumar', 'Vihaan Singh', 'Arjun Gupta',
    'Sai Reddy', 'Reyansh Joshi', 'Ayaan Khan', 'Krishna Rao', 'Ishaan Verma',
    'Ananya Agarwal', 'Diya Mehta', 'Saanvi Nair', 'Aadhya Iyer', 'Kavya Desai',
    'Myra Shah', 'Pihu Bansal', 'Anika Malhotra', 'Riya Kapoor', 'Navya Sinha'
  ];

  return names.map((name, i) => {
    const quizScore = Math.floor(Math.random() * 40) + 60; // 60-100
    const videoCompletions = Math.floor(Math.random() * 15);
    const alertsAcknowledged = Math.floor(Math.random() * 8);
    const preparedness = Math.min(100, Math.round(quizScore * 0.7 + videoCompletions * 2 + alertsAcknowledged * 3));
    
    return {
      userId: `student${i + 1}`,
      name,
      email: `${name.toLowerCase().replace(' ', '.')}@school.edu.in`,
      latestQuizScore: quizScore,
      videoCompletionsCount: videoCompletions,
      alertsAcknowledged,
      preparednessPercent: preparedness,
      lastActive: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      joinedDate: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString()
    };
  });
}

// Generate engagement timeline data
function generateEngagementData() {
  const timeline = [];
  const today = new Date();
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    timeline.push({
      date: date.toISOString().split('T')[0],
      visits: Math.floor(Math.random() * 50) + 10,
      quizzes: Math.floor(Math.random() * 20) + 5,
      drills: Math.floor(Math.random() * 15) + 3
    });
  }
  
  return timeline;
}

// Generate page visit data
function generatePageVisits() {
  return [
    { page: '/dashboard', visits: Math.floor(Math.random() * 200) + 150 },
    { page: '/alerts', visits: Math.floor(Math.random() * 150) + 100 },
    { page: '/quizzes', visits: Math.floor(Math.random() * 120) + 80 },
    { page: '/drills', visits: Math.floor(Math.random() * 100) + 60 },
    { page: '/videos', visits: Math.floor(Math.random() * 90) + 50 },
    { page: '/contacts', visits: Math.floor(Math.random() * 70) + 30 }
  ];
}

export async function handler(req, res) {
  if (req.method !== 'GET') { 
    res.statusCode = 405; 
    res.end('Method Not Allowed'); 
    return; 
  }
  
  const auth = requireStaff(req);
  if (!auth) { 
    res.statusCode = 403; 
    res.end('Forbidden'); 
    return; 
  }

  // Simulate loading delay for realistic UX
  await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 700));

  try {
    const students = generateMockStudents();
    const engagementData = generateEngagementData();
    const pageVisits = generatePageVisits();
    
    // Add current user data if available
    const currentUserName = 'Current User'; // Could be extracted from auth token
    const currentUserPrep = 75; // Could be from localStorage via client
    
    const currentUser = {
      userId: 'current_user',
      name: currentUserName,
      email: 'current.user@school.edu.in',
      latestQuizScore: Math.floor(currentUserPrep * 0.9),
      videoCompletionsCount: Math.floor(Math.random() * 10),
      alertsAcknowledged: Math.floor(Math.random() * 5),
      preparednessPercent: currentUserPrep,
      lastActive: new Date().toISOString(),
      joinedDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    };

    const allStudents = [currentUser, ...students];

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ 
      students: allStudents,
      analytics: {
        engagementData,
        pageVisits,
        totalUsers: allStudents.length,
        activeToday: Math.floor(allStudents.length * 0.7),
        averagePreparedness: Math.round(
          allStudents.reduce((sum, s) => sum + s.preparednessPercent, 0) / allStudents.length
        )
      }
    }));
  } catch (error) {
    console.error('Error generating admin data:', error);
    res.statusCode = 500; 
    res.end('Server error');
  }
}

export default handler;