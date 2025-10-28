// Debug component to test game image generation
"use client";

import React, { useState, useEffect } from "react";
import { generateFakeGamesAndReviews } from "@/src/lib/fakeGames.js";
import GameImage from "@/src/components/GameImage.jsx";

const GameImageDebug = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGames = async () => {
      try {
        console.log("Generating test games...");
        const data = await generateFakeGamesAndReviews();
        console.log("Generated games:", data);
        setGames(data.map(item => item.gameData));
        setLoading(false);
      } catch (error) {
        console.error("Error loading games:", error);
        setLoading(false);
      }
    };

    loadGames();
  }, []);

  if (loading) {
    return <div>Loading games...</div>;
  }

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <h1>Game Image Debug</h1>
      <p>Generated {games.length} games</p>
      
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", 
        gap: "20px",
        marginTop: "20px"
      }}>
        {games.map((game, index) => (
          <div key={index} style={{ 
            border: "2px solid #ddd", 
            padding: "15px", 
            borderRadius: "8px",
            backgroundColor: "#f9f9f9"
          }}>
            <h3 style={{ margin: "0 0 10px 0", fontSize: "16px" }}>{game.name}</h3>
            
            <div style={{ marginBottom: "10px" }}>
              <GameImage 
                src={game.photo} 
                alt={game.name}
                style={{ 
                  width: "100%", 
                  height: "200px", 
                  objectFit: "cover", 
                  borderRadius: "4px",
                  border: "1px solid #ccc"
                }}
              />
            </div>
            
            <div style={{ fontSize: "14px" }}>
              <p><strong>Genre:</strong> {game.genre}</p>
              <p><strong>Platform:</strong> {game.platform}</p>
              <p><strong>Rating:</strong> {game.avgRating.toFixed(1)} ⭐ ({game.numRatings} reviews)</p>
              <p><strong>Price:</strong> {"$".repeat(game.price)}</p>
            </div>
            
            <details style={{ marginTop: "10px" }}>
              <summary style={{ cursor: "pointer", fontSize: "12px" }}>Image URL</summary>
              <p style={{ fontSize: "10px", wordBreak: "break-all", margin: "5px 0 0 0" }}>
                {game.photo}
              </p>
            </details>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameImageDebug;
