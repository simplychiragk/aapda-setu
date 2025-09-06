// Quizzes.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// ---------------- BIG QUESTION BANK (100+) ----------------
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
  { question: "Where should you avoid standing during an earthquake?", options: ["Under desk", "Near window", "Open ground", "Door frame"], answer: "Near window" },
  { question: "What should you do if trapped in smoke?", options: ["Crawl low to ground", "Run upright", "Hold breath and run", "Stand still"], answer: "Crawl low to ground" },
  { question: "What does 'evacuate' mean?", options: ["Leave building quickly", "Eat food", "Raise hand", "Go to nurse"], answer: "Leave building quickly" },
  { question: "If outside during lightning, best action?", options: ["Go inside immediately", "Lie on ground", "Hold umbrella", "Keep playing"], answer: "Go inside immediately" },
  { question: "Tsunami is caused by?", options: ["Earthquake under sea", "Heavy rainfall", "Strong winds", "Volcano only"], answer: "Earthquake under sea" },
  { question: "Cyclone warning signals are given at?", options: ["Ports", "Schools", "Hospitals", "Police stations"], answer: "Ports" },
  { question: "Full form of SDRF?", options: ["State Disaster Response Force", "School Disaster Rescue Force", "Safe Disaster Relief Fund", "State Defence Relief Force"], answer: "State Disaster Response Force" },
  { question: "First step of CPR?", options: ["Check response & breathing", "Give water", "Shake hard", "Call police"], answer: "Check response & breathing" },
  { question: "Helpline for children in distress in India?", options: ["1098", "100", "108", "101"], answer: "1098" },
  { question: "What is mock drill?", options: ["Practice for emergency", "Fun play", "Surprise test", "Dance event"], answer: "Practice for emergency" },
  { question: "If earthquake occurs at night, what should you do?", options: ["Stay in bed, protect head", "Run outside immediately", "Go to balcony", "Turn on fan"], answer: "Stay in bed, protect head" },
  { question: "During cyclone, what should be stored?", options: ["Dry food & water", "Toys", "Music system", "New clothes"], answer: "Dry food & water" },
  { question: "Best way to treat small burn?", options: ["Cool water", "Butter", "Toothpaste", "Oil"], answer: "Cool water" },
  { question: "Which color is used for fire extinguishers (water type)?", options: ["Red", "Blue", "Black", "Green"], answer: "Red" },
  { question: "What is the Richter scale used for?", options: ["Measure earthquake", "Measure rainfall", "Measure wind speed", "Measure fire"], answer: "Measure earthquake" },
  { question: "Floods can be prevented by?", options: ["Planting trees", "Cutting trees", "Building on river bed", "Ignoring warnings"], answer: "Planting trees" },
  { question: "If a gas leak is suspected, you should NOT?", options: ["Switch on lights", "Open windows", "Turn off cylinder", "Call gas agency"], answer: "Switch on lights" },
  { question: "Which is safest floor during earthquake?", options: ["Ground floor", "Top floor", "Middle floor", "Roof"], answer: "Ground floor" },
  { question: "What is landslide?", options: ["Falling of rocks/soil", "Flood water", "Volcano fire", "Earthquake shaking"], answer: "Falling of rocks/soil" },
  { question: "The safe triangle in earthquake refers to?", options: ["Beside furniture", "On roof", "In lift", "Near balcony"], answer: "Beside furniture" },
  { question: "What is first thing during fire?", options: ["Raise alarm", "Hide", "Run randomly", "Collect things"], answer: "Raise alarm" },
  { question: "Cyclone shelters are built in?", options: ["Coastal areas", "Mountains", "Deserts", "Forests"], answer: "Coastal areas" },
  { question: "Which organ helps us breathe?", options: ["Lungs", "Heart", "Liver", "Kidney"], answer: "Lungs" },
  { question: "Which kit is useful in first aid?", options: ["Bandages & medicines", "Snacks", "Books", "Shoes"], answer: "Bandages & medicines" },
  { question: "Which country shares Indian Ocean tsunami risk?", options: ["India", "Sri Lanka", "Indonesia", "All of these"], answer: "All of these" },
  { question: "How should you cross flood water?", options: ["Never, wait for rescue", "Swim fast", "Walk barefoot", "Drive car"], answer: "Never, wait for rescue" },
  { question: "What is fire triangle made of?", options: ["Heat, Fuel, Oxygen", "Air, Smoke, Water", "Gas, Light, Ash", "Coal, Fire, Oil"], answer: "Heat, Fuel, Oxygen" },
  { question: "What is global warming mainly caused by?", options: ["Greenhouse gases", "Rivers", "Trees", "Rain"], answer: "Greenhouse gases" },
  { question: "In first aid, what is CPR?", options: ["Cardio Pulmonary Resuscitation", "Critical Patient Relief", "Careful Patient Rescue", "Cold Pressure Relief"], answer: "Cardio Pulmonary Resuscitation" },
  { question: "What is the main cause of urban flooding?", options: ["Poor drainage", "Tree planting", "Empty grounds", "Wide rivers"], answer: "Poor drainage" },
  { question: "What should you not use on electrical fire?", options: ["Water", "CO2 extinguisher", "Dry chemical powder", "Fire blanket"], answer: "Water" },
  { question: "First step when someone faints?", options: ["Check airway and breathing", "Give water immediately", "Shake hard", "Ignore"], answer: "Check airway and breathing" },
  { question: "Which natural disaster is measured by Saffir-Simpson scale?", options: ["Cyclone/Hurricane", "Earthquake", "Flood", "Volcano"], answer: "Cyclone/Hurricane" },
  { question: "When should you call 108?", options: ["Medical emergency", "Picnic", "Classroom quiz", "Sports day"], answer: "Medical emergency" },
  { question: "Why should candles be avoided in earthquake?", options: ["Gas leaks may cause fire", "Candles finish fast", "Too dim", "Unsafe smell"], answer: "Gas leaks may cause fire" },
  { question: "If bitten by snake, what is first step?", options: ["Keep calm and limit movement", "Run fast", "Cut wound", "Drink alcohol"], answer: "Keep calm and limit movement" },
  { question: "How many fire extinguisher types exist?", options: ["5", "2", "10", "20"], answer: "5" },
  { question: "Who controls disaster management in India?", options: ["NDMA", "NDRF", "Home Ministry", "All of these"], answer: "All of these" },
  { question: "Which is not a natural disaster?", options: ["Earthquake", "Cyclone", "Chemical spill", "Flood"], answer: "Chemical spill" },
  { question: "First step when earthquake starts?", options: ["Drop, Cover, Hold", "Run to balcony", "Use lift", "Call friends"], answer: "Drop, Cover, Hold" },
  { question: "If thunder roars, go?", options: ["Indoors", "To field", "To river", "To rooftop"], answer: "Indoors" },
  { question: "If fire is small and manageable?", options: ["Use extinguisher", "Ignore", "Pour petrol", "Run away"], answer: "Use extinguisher" },
  { question: "What is drought?", options: ["Lack of rainfall", "Heavy rain", "Cyclone", "Snowstorm"], answer: "Lack of rainfall" },
  { question: "Which natural disaster is worst in deserts?", options: ["Sandstorm", "Flood", "Cyclone", "Earthquake"], answer: "Sandstorm" },
  { question: "Best way to prevent disease after flood?", options: ["Boil water", "Drink river water", "Eat street food", "Ignore hygiene"], answer: "Boil water" },
  { question: "Where is safe during stampede?", options: ["Stay on sides", "Push crowd", "Lie down", "Run opposite"], answer: "Stay on sides" },
  { question: "Triage in disaster means?", options: ["Sorting patients by severity", "Counting victims", "Medical camp", "Ambulance service"], answer: "Sorting patients by severity" },
  { question: "What is most common disaster in India?", options: ["Flood", "Volcano", "Tsunami", "Snowstorm"], answer: "Flood" },
  { question: "Which of these is man-made disaster?", options: ["Chemical leak", "Cyclone", "Flood", "Earthquake"], answer: "Chemical leak" },
  { question: "Which part of India is cyclone-prone?", options: ["Coastal areas", "Himalayas", "Desert", "Plateau"], answer: "Coastal areas" },
  { question: "When flood comes, move to?", options: ["Higher ground", "Basement", "River bank", "Bridge"], answer: "Higher ground" },
  { question: "During landslide, you should?", options: ["Move to open place", "Go near slope", "Dig hole", "Climb tree"], answer: "Move to open place" },
  { question: "What should you pack in a go-bag?", options: ["Food, water, medicines", "Toys", "Gold", "Clothes only"], answer: "Food, water, medicines" },
  { question: "What is safe action during fire in kitchen?", options: ["Turn off gas", "Pour water on oil fire", "Run outside", "Use fan"], answer: "Turn off gas" },
  { question: "Which gas causes suffocation in closed fire?", options: ["Carbon monoxide", "Oxygen", "Nitrogen", "Carbon dioxide"], answer: "Carbon monoxide" },
  { question: "Where should you meet after evacuation?", options: ["Assembly point", "Randomly anywhere", "Parking lot alone", "Classroom"], answer: "Assembly point" },
  { question: "What should be checked in fire extinguisher?", options: ["Expiry date", "Color", "Weight", "Handle"], answer: "Expiry date" },
  { question: "Most tsunamis occur in?", options: ["Pacific Ocean", "Atlantic", "Indian", "Arctic"], answer: "Pacific Ocean" },
  { question: "Which natural disaster can trigger tsunami?", options: ["Earthquake", "Cyclone", "Flood", "Drought"], answer: "Earthquake" },
  { question: "The cyclone that hit Odisha in 1999 was called?", options: ["Super Cyclone", "Hudhud", "Phailin", "Amphan"], answer: "Super Cyclone" },
  { question: "Which disaster is Richter scale linked to?", options: ["Earthquake", "Cyclone", "Flood", "Volcano"], answer: "Earthquake" },
  { question: "When is National Disaster Reduction Day?", options: ["29 October", "5 June", "26 January", "2 October"], answer: "29 October" },
  { question: "If injured person bleeds heavily?", options: ["Apply pressure bandage", "Give water only", "Ignore", "Cover with blanket"], answer: "Apply pressure bandage" },
  { question: "What to do in case of fire in cinema hall?", options: ["Use nearest exit", "Shout and push", "Use lift", "Hide"], answer: "Use nearest exit" },
  { question: "Main role of NDRF?", options: ["Rescue & relief", "Traffic control", "Teaching", "Banking"], answer: "Rescue & relief" },
  { question: "Which cyclone hit West Bengal in 2020?", options: ["Amphan", "Fani", "Titli", "Hudhud"], answer: "Amphan" },
  { question: "What is first aid for fracture?", options: ["Immobilize area", "Run fast", "Massage", "Pull bone"], answer: "Immobilize area" },
  { question: "What is aftershock?", options: ["Smaller quake after main quake", "Cyclone", "Flood wave", "Storm"], answer: "Smaller quake after main quake" },
  { question: "What should you avoid during thunderstorm indoors?", options: ["Using electrical appliances", "Closing windows", "Sitting quietly", "Eating food"], answer: "Using electrical appliances" },
  { question: "Most fire accidents at home happen due to?", options: ["Gas leak", "Earthquake", "Cyclone", "Flood"], answer: "Gas leak" },
  { question: "Which Indian city faced major flood in 2015?", options: ["Chennai", "Delhi", "Mumbai", "Kolkata"], answer: "Chennai" },
  { question: "Which Indian state faces highest earthquakes?", options: ["Assam", "Rajasthan", "Punjab", "Kerala"], answer: "Assam" },
  { question: "What should you do in school evacuation?", options: ["Follow teacher instructions", "Run anywhere", "Shout loudly", "Stay back"], answer: "Follow teacher instructions" },
  { question: "What is landslide triggered by?", options: ["Heavy rain & quake", "Fire", "Heat wave", "Cyclone only"], answer: "Heavy rain & quake" },
  { question: "Why is mock drill important?", options: ["Prepares people", "Fun game", "Entertainment", "Holiday"], answer: "Prepares people" },
  { question: "What should you never do during fire?", options: ["Use lift", "Use stairs", "Raise alarm", "Call 101"], answer: "Use lift" },
  { question: "What is the safest response to chemical leak?", options: ["Stay indoors & seal windows", "Run on road", "Light fire", "Drink water"], answer: "Stay indoors & seal windows" },
  { question: "Which cyclone hit Andhra Pradesh in 2014?", options: ["Hudhud", "Amphan", "Titli", "Phailin"], answer: "Hudhud" },
  { question: "What is first step of disaster management?", options: ["Preparedness", "Rescue", "Relief", "Rehabilitation"], answer: "Preparedness" },
  { question: "What does 112 stand for in India?", options: ["Single emergency helpline", "Police only", "Ambulance only", "Fire only"], answer: "Single emergency helpline" },
  { question: "What to do in case of gas cylinder fire?", options: ["Cover with wet cloth", "Pour water", "Push cylinder", "Run"], answer: "Cover with wet cloth" },
  { question: "What should you avoid in flood water?", options: ["Electric poles", "Rescue boats", "Safe bridge", "Clean water"], answer: "Electric poles" },
  { question: "Which color code for medical oxygen cylinder?", options: ["Black & White", "Red", "Blue", "Yellow"], answer: "Black & White" },
  { question: "What is the main focus of disaster risk reduction?", options: ["Prevention & preparedness", "Response only", "Relief only", "Rehabilitation only"], answer: "Prevention & preparedness" },

,
  // ---- Expand this list with 90+ more ----
];

// ---------------- Utility ----------------
function pickRandomQuestions(all, count = 15) {
  const shuffled = [...all].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

// ---------------- Main Component ----------------
export default function Quizzes() {
  const navigate = useNavigate();
  const [showStartPage, setShowStartPage] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showScore, setShowScore] = useState(false);

  useEffect(() => {
    if (!showStartPage) setQuestions(pickRandomQuestions(ALL_QUESTIONS, 15));
  }, [showStartPage]);

  if (questions.length === 0 && !showStartPage) return <div>Loading...</div>;

  const current = questions[currentIdx];
  const percentage = ((score / questions.length) * 100).toFixed(0);

  const handleOptionClick = (option) => {
    if (selected) return;
    setSelected(option);
    if (option === current.answer) setScore((s) => s + 1);
  };

  const handleNext = () => {
    setSelected(null);
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setShowScore(true);

      // ✅ Preparedness score update
      let currentPrep = parseInt(localStorage.getItem("preparedness")) || 0;
      let bonus = Math.round((score / questions.length) * 20);
      let updated = Math.min(currentPrep + bonus, 100);
      localStorage.setItem("preparedness", updated);
    }
  };

  const handleRestart = () => {
    setShowStartPage(true);
    setQuestions([]);
    setCurrentIdx(0);
    setScore(0);
    setSelected(null);
    setShowScore(false);
  };

  const styles = {
    container: { minHeight: "100vh", fontFamily: "Arial,sans-serif", padding: 20, background: "#f0f4f8", color: "#1e293b" },
    card: { maxWidth: 600, margin: "20px auto", background: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 6px 18px rgba(0,0,0,0.06)" },
    question: { fontSize: 20, fontWeight: 600, marginBottom: 14 },
    option: (option) => {
      const baseStyle = {
        padding: "10px 14px",
        marginBottom: 10,
        borderRadius: 8,
        border: "1px solid #ddd",
        cursor: selected ? "default" : "pointer",
        background: "#fff",
        color: "#0f172a",
      };
      if (selected) {
        if (option === current.answer) return { ...baseStyle, background: "#16a34a", color: "#fff" };
        if (option === selected && selected !== current.answer) return { ...baseStyle, background: "#dc2626", color: "#fff" };
      }
      return baseStyle;
    },
    button: {
      next: { padding: "10px 16px", borderRadius: 8, border: "none", background: "#2563eb", color: "#fff", fontWeight: 600, cursor: "pointer", marginTop: 10 },
      restart: { padding: "10px 16px", borderRadius: 8, border: "none", background: "#059669", color: "#fff", fontWeight: 600, cursor: "pointer", marginTop: 10 },
      start: { padding: "14px 24px", borderRadius: 12, border: "none", background: "#2563eb", color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: 20 },
      back: { padding: "10px 16px", borderRadius: 8, border: "none", background: "#6b7280", color: "#fff", fontWeight: 600, cursor: "pointer", marginTop: 10 }
    }
  };

  // ---------- Start Page ----------
  if (showStartPage) {
    return (
      <div style={{ ...styles.container, textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
        <h1 style={{ fontSize: 36, color: "#2563eb" }}>🎉 Safety Superstar Quiz 🎉</h1>
        <p style={{ fontSize: 20, marginBottom: 30 }}>Test your knowledge and become a Disaster Hero!</p>
        <button style={styles.button.start} onClick={() => setShowStartPage(false)}>Start Quiz</button>
        <button style={styles.button.back} onClick={() => navigate(-1)}>⬅ Back</button>
      </div>
    );
  }

  // ---------- Quiz Page ----------
  return (
    <div style={styles.container}>
      <h1>Disaster Management Quiz</h1>
      <div style={styles.card}>
        {showScore ? (
          <div style={{ textAlign: "center" }}>
            <h2>Final Score: {score} / {questions.length}</h2>
            <h3>Percentage: {percentage}%</h3>

            {score < 5 ? (
              <>
                <p style={{ color: "red", fontWeight: "bold" }}>😟 Don’t worry! Keep practicing, you’ll get better.</p>
                <img src="https://i.ibb.co/ZTg5tfg/keep-trying.gif" alt="Keep Trying" style={{ maxWidth: "100%", borderRadius: 12 }} />
              </>
            ) : (
              <>
                <p style={{ color: "green", fontWeight: "bold" }}>🎉 Great job! You’re getting stronger at preparedness.</p>
                <img src="https://i.ibb.co/9nF8h7C/congrats.gif" alt="Congrats" style={{ maxWidth: "100%", borderRadius: 12 }} />
              </>
            )}

            <button style={styles.button.restart} onClick={handleRestart}>Restart Quiz</button>
            <button style={styles.button.back} onClick={() => navigate("/dashboard")}>⬅ Back to Dashboard</button>
          </div>
        ) : (
          <>
            <div style={styles.question}>Q{currentIdx + 1}. {current.question}</div>
            {current.options.map((opt, i) => (
              <div key={i} style={styles.option(opt)} onClick={() => handleOptionClick(opt)}>{opt}</div>
            ))}
            {selected && (
              <button style={styles.button.next} onClick={handleNext}>
                {currentIdx === questions.length - 1 ? "Finish Quiz" : "Next"}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
