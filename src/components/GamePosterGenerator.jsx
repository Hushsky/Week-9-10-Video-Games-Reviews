// Game Poster Generator Component
// This component can generate custom posters for games using Canvas API

"use client";

import { useEffect, useRef } from "react";

const GamePosterGenerator = ({ game, width = 300, height = 400 }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    
    // Set canvas size
    canvas.width = width;
    canvas.height = height;

    // Create gradient background based on genre
    const genreColors = {
      "Action": ["#ff6b6b", "#ee5a24"],
      "RPG": ["#4834d4", "#686de0"],
      "Strategy": ["#00d2d3", "#54a0ff"],
      "FPS": ["#ff9ff3", "#f368e0"],
      "Sports": ["#1dd1a1", "#55efc4"],
      "Racing": ["#feca57", "#ff9ff3"],
      "Puzzle": ["#ff6348", "#ff7675"],
      "Adventure": ["#6c5ce7", "#a29bfe"],
      "Platformer": ["#fd79a8", "#fdcb6e"],
      "Fighting": ["#e17055", "#d63031"],
      "Simulation": ["#00b894", "#00cec9"],
      "Horror": ["#2d3436", "#636e72"],
      "Indie": ["#fdcb6e", "#e17055"]
    };

    const colors = genreColors[game.genre] || ["#74b9ff", "#0984e3"];
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, colors[0]);
    gradient.addColorStop(1, colors[1]);

    // Fill background
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Add game title
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 24px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    
    // Wrap text if too long
    const words = game.name.split(" ");
    let line = "";
    let y = height * 0.3;
    const maxWidth = width - 40;
    
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + " ";
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      
      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line, width / 2, y);
        line = words[n] + " ";
        y += 30;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, width / 2, y);

    // Add genre badge
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
    ctx.fillRect(width - 120, 20, 100, 30);
    ctx.fillStyle = "#2d3436";
    ctx.font = "14px Arial";
    ctx.textAlign = "center";
    ctx.fillText(game.genre, width - 70, 40);

    // Add platform info
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    ctx.font = "16px Arial";
    ctx.textAlign = "center";
    ctx.fillText(game.platform, width / 2, height - 60);

    // Add price indicator
    const priceText = "$".repeat(game.price);
    ctx.fillStyle = "#fdcb6e";
    ctx.font = "bold 20px Arial";
    ctx.fillText(priceText, width / 2, height - 30);

    // Add rating stars
    const starY = height - 100;
    const starSpacing = 25;
    const starStartX = (width - (5 * starSpacing)) / 2;
    
    for (let i = 0; i < 5; i++) {
      ctx.fillStyle = i < Math.floor(game.avgRating) ? "#fdcb6e" : "#ddd";
      ctx.font = "20px Arial";
      ctx.fillText("★", starStartX + (i * starSpacing), starY);
    }

  }, [game, width, height]);

  return (
    <div className="game-poster">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{
          border: "2px solid #ddd",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
        }}
      />
    </div>
  );
};

export default GamePosterGenerator;
