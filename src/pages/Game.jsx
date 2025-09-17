// pages/Game.jsx
import React, { useState, useEffect } from "react";

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

  // ------------------
  // INTRO SCREEN
  // ------------------
  if (!gameStarted) {
    return (
      <div style={{ padding: 20, textAlign: "center" }}>
        <h1>🎮 Memory Match Game</h1>
        <p>
          Welcome to the <strong>Disaster Preparedness Memory Game</strong>!
        </p>
        <ul style={{ textAlign: "left", maxWidth: 400, margin: "20px auto", color: "#374151" }}>
          <li>👀 Flip two cards to reveal the icons.</li>
          <li>✅ Match all pairs to win.</li>
          <li>⚡ Icons represent emergency tools & services.</li>
          <li>🎯 Try to finish in the fewest moves!</li>
        </ul>
        <button
          onClick={() => setGameStarted(true)}
          style={{
            padding: "12px 20px",
            marginTop: 20,
            background: "#2563eb",
            color: "#fff",
            border: "none",
            borderRadius: 10,
            cursor: "pointer",
            fontWeight: 600,
            fontSize: 16,
          }}
        >
          Start Game 🚀
        </button>
      </div>
    );
  }

  // ------------------
  // MAIN GAME
  // ------------------
  return (
    <div style={{ padding: 20, textAlign: "center" }}>
      <h1>Memory Match Game 🎴</h1>
      <p>Match the emergency icons to win!</p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 80px)",
          gap: 12,
          justifyContent: "center",
          margin: "20px auto",
        }}
      >
        {cards.map((icon, index) => {
          const isFlipped = flipped.includes(index) || matched.includes(index);
          return (
            <div
              key={index}
              onClick={() => handleFlip(index)}
              style={{
                width: 80,
                height: 80,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 36,
                background: isFlipped ? "#2563eb" : "#e5e7eb",
                color: isFlipped ? "#fff" : "transparent",
                borderRadius: 12,
                cursor: "pointer",
                boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                transition: "0.3s",
              }}
            >
              {icon}
            </div>
          );
        })}
      </div>

      <p>Moves: {moves}</p>

      {matched.length === cards.length && (
        <div>
          <h2>🎉 You Won!</h2>
          <button
            onClick={restartGame}
            style={{
              padding: "10px 16px",
              marginTop: 12,
              background: "#2563eb",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Restart Game
          </button>
        </div>
      )}
    </div>
  );
}
