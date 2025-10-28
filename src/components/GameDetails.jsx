// This component shows game metadata, and offers some actions to the user like uploading a new game image, and adding a review.

import React, { useState, useEffect } from "react";
import renderStars from "@/src/components/Stars.jsx";
import GamePosterGenerator from "@/src/components/GamePosterGenerator.jsx";
import { generateAIGamePoster } from "@/src/lib/gamePosterGenerator.js";

const GameDetails = ({
  game,
  userId,
  handleGameImage,
  setIsOpen,
  isOpen,
  children,
}) => {
  const [useGeneratedPoster, setUseGeneratedPoster] = useState(false);
  const [generatedPosterUrl, setGeneratedPosterUrl] = useState(null);

  // Generate AI poster when component mounts or game changes
  useEffect(() => {
    const generatePoster = async () => {
      try {
        const posterUrl = await generateAIGamePoster(game.name, game.genre, game.platform);
        setGeneratedPosterUrl(posterUrl);
      } catch (error) {
        console.error('Error generating poster:', error);
      }
    };

    generatePoster();
  }, [game.name, game.genre, game.platform]);

  return (
    <section className="img__section">
      {/* Show either uploaded image, generated poster, or canvas-generated poster */}
      {useGeneratedPoster ? (
        <div className="poster-container">
          {generatedPosterUrl ? (
            <img src={generatedPosterUrl} alt={game.name} />
          ) : (
            <GamePosterGenerator game={game} width={300} height={400} />
          )}
        </div>
      ) : (
        <img src={game.photo} alt={game.name} />
      )}

      <div className="actions">
        {userId && (
          <img
            alt="review"
            className="review"
            onClick={() => {
              setIsOpen(!isOpen);
            }}
            src="/review.svg"
          />
        )}
        <label
          onChange={(event) => handleGameImage(event.target)}
          htmlFor="upload-image"
          className="add"
        >
          <input
            name=""
            type="file"
            id="upload-image"
            className="file-input hidden w-full h-full"
          />

          <img className="add-image" src="/add.svg" alt="Add image" />
        </label>
        
        {/* Toggle between uploaded image and generated poster */}
        <button
          className="poster-toggle"
          onClick={() => setUseGeneratedPoster(!useGeneratedPoster)}
          title={useGeneratedPoster ? "Show uploaded image" : "Show generated poster"}
        >
          {useGeneratedPoster ? "📷" : "🎨"}
        </button>
      </div>

      <div className="details__container">
        <div className="details">
          <h2>{game.name}</h2>

          <div className="game__rating">
            <ul>{renderStars(game.avgRating)}</ul>

            <span>({game.numRatings})</span>
          </div>

          <p>
            {game.genre} | {game.platform}
          </p>
          <p>{"$".repeat(game.price)}</p>
          {children}
        </div>
      </div>
    </section>
  );
};

export default GameDetails;
