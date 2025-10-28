// Simple Game Poster Generator Component
// This component generates basic game posters using CSS and HTML

"use client";

import React from "react";

const SimpleGamePoster = ({ game, width = 300, height = 400 }) => {
  // Genre-based color schemes
  const genreStyles = {
    "Action": { bg: "linear-gradient(135deg, #ff6b6b, #ee5a24)", text: "#fff" },
    "RPG": { bg: "linear-gradient(135deg, #4834d4, #686de0)", text: "#fff" },
    "Strategy": { bg: "linear-gradient(135deg, #00d2d3, #54a0ff)", text: "#fff" },
    "FPS": { bg: "linear-gradient(135deg, #ff9ff3, #f368e0)", text: "#fff" },
    "Sports": { bg: "linear-gradient(135deg, #1dd1a1, #55efc4)", text: "#000" },
    "Racing": { bg: "linear-gradient(135deg, #feca57, #ff9ff3)", text: "#000" },
    "Puzzle": { bg: "linear-gradient(135deg, #ff6348, #ff7675)", text: "#fff" },
    "Adventure": { bg: "linear-gradient(135deg, #6c5ce7, #a29bfe)", text: "#fff" },
    "Platformer": { bg: "linear-gradient(135deg, #fd79a8, #fdcb6e)", text: "#000" },
    "Fighting": { bg: "linear-gradient(135deg, #e17055, #d63031)", text: "#fff" },
    "Simulation": { bg: "linear-gradient(135deg, #00b894, #00cec9)", text: "#000" },
    "Horror": { bg: "linear-gradient(135deg, #2d3436, #636e72)", text: "#fff" },
    "Indie": { bg: "linear-gradient(135deg, #fdcb6e, #e17055)", text: "#000" }
  };

  const style = genreStyles[game.genre] || genreStyles["Action"];

  return (
    <div 
      className="simple-game-poster"
      style={{
        width: `${width}px`,
        height: `${height}px`,
        background: style.bg,
        borderRadius: "12px",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
        position: "relative",
        overflow: "hidden"
      }}
    >
      {/* Background pattern */}
      <div 
        style={{
          position: "absolute",
          top: "-50%",
          left: "-50%",
          width: "200%",
          height: "200%",
          background: "radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
          animation: "float 20s infinite linear",
          pointerEvents: "none"
        }}
      />
      
      {/* Genre badge */}
      <div 
        style={{
          background: "rgba(255,255,255,0.2)",
          padding: "8px 16px",
          borderRadius: "20px",
          fontSize: "12px",
          fontWeight: "bold",
          textTransform: "uppercase",
          letterSpacing: "1px",
          alignSelf: "flex-start"
        }}
      >
        {game.genre}
      </div>

      {/* Game title */}
      <div style={{ textAlign: "center", flex: 1, display: "flex", alignItems: "center" }}>
        <h2 
          style={{
            color: style.text,
            fontSize: "24px",
            fontWeight: "bold",
            margin: 0,
            textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
            lineHeight: "1.2"
          }}
        >
          {game.name}
        </h2>
      </div>

      {/* Platform and rating */}
      <div style={{ width: "100%", textAlign: "center" }}>
        <div 
          style={{
            color: style.text,
            fontSize: "14px",
            marginBottom: "10px",
            fontWeight: "500"
          }}
        >
          {game.platform}
        </div>
        
        {/* Rating stars */}
        <div style={{ marginBottom: "10px" }}>
          {[...Array(5)].map((_, i) => (
            <span 
              key={i}
              style={{
                color: i < Math.floor(game.avgRating) ? "#ffd700" : "rgba(255,255,255,0.3)",
                fontSize: "16px",
                margin: "0 2px"
              }}
            >
              ★
            </span>
          ))}
        </div>

        {/* Price indicator */}
        <div 
          style={{
            color: style.text,
            fontSize: "18px",
            fontWeight: "bold"
          }}
        >
          {"$".repeat(game.price)}
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0% { transform: translate(-50%, -50%) rotate(0deg); }
          100% { transform: translate(-50%, -50%) rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default SimpleGamePoster;
