// This component shows game metadata, and offers some actions to the user like uploading a new game image, and adding a review.

import React, { useState } from "react";
import renderStars from "@/src/components/Stars.jsx";
import SimpleGamePoster from "@/src/components/SimpleGamePoster.jsx";
import GameImage from "@/src/components/GameImage.jsx";

const GameDetails = ({
  game,
  userId,
  handleGameImage,
  setIsOpen,
  isOpen,
  children,
}) => {
  const [showPoster, setShowPoster] = useState(false);

  return (
    <section className="img__section">
      {/* Show either uploaded image or generated poster */}
      {showPoster ? (
        <SimpleGamePoster game={game} width={300} height={400} />
      ) : (
        <GameImage src={game.photo} alt={game.name} />
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
          onClick={() => setShowPoster(!showPoster)}
          title={showPoster ? "Show uploaded image" : "Show generated poster"}
        >
          {showPoster ? "📷" : "🎨"}
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
