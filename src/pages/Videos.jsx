// Videos.jsx
import React from "react";

const VIDEOS = [
  {
    url: "https://www.youtube.com/watch?v=BLEPakj1YTY",
    title: "Earthquake Safety Tips - Red Cross",
  },
  {
    url: "https://www.youtube.com/watch?v=43M5mZuzHF8",
    title: "Flood Preparedness | FEMA",
  },
  {
    url: "https://www.youtube.com/watch?v=apwK7Y362qU",
    title: "Fire Safety & Evacuation Drills",
  },
  {
    url: "youtube.com/watch?si=5wY9MQDR4tgnLDCy&v=TqZ3M7xh8jM&feature=youtu.be",
    title: "Cyclone Safety Tips | Disaster Preparedness",
  },
];

// Helper to get YouTube video ID from URL
function getVideoId(url) {
  const match = url.match(/[?&]v=([^&]+)/);
  return match ? match[1] : null;
}

export default function Videos() {
  const styles = {
    container: { padding: 20, fontFamily: "Arial, sans-serif" },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
      gap: 20,
    },
    card: {
      border: "1px solid #ddd",
      borderRadius: 8,
      overflow: "hidden",
      boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
      cursor: "pointer",
      textAlign: "center",
      background: "#fff",
    },
    thumbnail: { width: "100%", display: "block" },
    title: { padding: "10px 8px", fontWeight: 600, fontSize: 16, color: "#333" },
  };

  return (
    <div style={styles.container}>
      <h1>Disaster Management Videos</h1>
      <div style={styles.grid}>
        {VIDEOS.map((video, idx) => {
          const id = getVideoId(video.url);
          const thumbnail = id
            ? `https://img.youtube.com/vi/${id}/hqdefault.jpg`
            : "";
          return (
            <div
              key={idx}
              style={styles.card}
              onClick={() => window.open(video.url, "_blank")}
            >
              <img src={thumbnail} alt={video.title} style={styles.thumbnail} />
              <div style={styles.title}>{video.title}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
