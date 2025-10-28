// Test component to verify game images are working
"use client";

import React, { useState, useEffect } from "react";
import { generateFakeGamesAndReviews } from "@/src/lib/fakeGames.js";

const ImageTest = () => {
  const [testGames, setTestGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTestGames = async () => {
      try {
        const data = await generateFakeGamesAndReviews();
        setTestGames(data.map(item => item.gameData));
        setLoading(false);
      } catch (error) {
        console.error('Error loading test games:', error);
        setLoading(false);
      }
    };

    loadTestGames();
  }, []);

  if (loading) {
    return <div>Loading test games...</div>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>Game Image Test</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px" }}>
        {testGames.map((game, index) => (
          <div key={index} style={{ border: "1px solid #ccc", padding: "10px", borderRadius: "8px" }}>
            <img 
              src={game.photo} 
              alt={game.name}
              style={{ width: "100%", height: "200px", objectFit: "cover", borderRadius: "4px" }}
              onError={(e) => {
                console.log(`Image failed to load for ${game.name}:`, game.photo);
                e.target.src = `https://via.placeholder.com/200x200/ff0000/ffffff?text=ERROR`;
              }}
            />
            <h3>{game.name}</h3>
            <p>{game.genre} | {game.platform}</p>
            <p>Rating: {game.avgRating.toFixed(1)} ⭐</p>
            <p>Price: {"$".repeat(game.price)}</p>
            <p style={{ fontSize: "12px", color: "#666" }}>Image URL: {game.photo}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageTest;
