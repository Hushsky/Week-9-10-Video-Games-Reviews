import {
  randomNumberBetween,
  getRandomDateAfter,
  getRandomDateBefore,
} from "@/src/lib/utils.js";
import { randomData } from "@/src/lib/randomData.js";

import { Timestamp } from "firebase/firestore";

// Function to get random game cover colors for placeholder images
function getRandomGameColor() {
  const colors = [
    "4a90e2", // Blue
    "7ed321", // Green  
    "f5a623", // Orange
    "d0021b", // Red
    "9013fe", // Purple
    "50e3c2", // Teal
    "b8e986", // Light Green
    "f8e71c", // Yellow
    "bd10e0", // Magenta
    "b4a7d6", // Lavender
  ];
  
  return colors[randomNumberBetween(0, colors.length - 1)];
}

// Function to generate game poster URL using multiple services
function generateGamePosterUrl(gameName, genre) {
  // Use different services for variety
  const services = [
    // Service 1: Placeholder with game name (most reliable)
    `https://via.placeholder.com/300x400/${getRandomGameColor()}/ffffff?text=${encodeURIComponent(gameName)}`,
    
    // Service 2: Placeholder with genre
    `https://via.placeholder.com/300x400/${getRandomGameColor()}/ffffff?text=${encodeURIComponent(genre)}`,
    
    // Service 3: Picsum with game-themed colors
    `https://picsum.photos/300/400?random=${gameName.length}`,
    
    // Service 4: Lorem Picsum with specific seed
    `https://picsum.photos/seed/${gameName.replace(/\s+/g, '')}/300/400`,
  ];
  
  return services[randomNumberBetween(0, services.length - 1)];
}

export async function generateFakeGamesAndReviews() {
  const gamesToAdd = 5;
  const data = [];

  for (let i = 0; i < gamesToAdd; i++) {
    const gameTimestamp = Timestamp.fromDate(getRandomDateBefore());

    const ratingsData = [];

    // Generate a random number of ratings/reviews for this game
    for (let j = 0; j < randomNumberBetween(0, 5); j++) {
      const ratingTimestamp = Timestamp.fromDate(
        getRandomDateAfter(gameTimestamp.toDate())
      );

      const ratingData = {
        rating:
          randomData.gameReviews[
            randomNumberBetween(0, randomData.gameReviews.length - 1)
          ].rating,
        text: randomData.gameReviews[
          randomNumberBetween(0, randomData.gameReviews.length - 1)
        ].text,
        userId: `User #${randomNumberBetween()}`,
        timestamp: ratingTimestamp,
      };

      ratingsData.push(ratingData);
    }

    const avgRating = ratingsData.length
      ? ratingsData.reduce(
          (accumulator, currentValue) => accumulator + currentValue.rating,
          0
        ) / ratingsData.length
      : 0;

    const gameName = randomData.gameNames[
      randomNumberBetween(0, randomData.gameNames.length - 1)
    ];
    
    const gameGenre = randomData.gameGenres[
      randomNumberBetween(0, randomData.gameGenres.length - 1)
    ];

    const gameData = {
      genre: gameGenre,
      name: gameName,
      avgRating,
      platform: randomData.gamePlatforms[
        randomNumberBetween(0, randomData.gamePlatforms.length - 1)
      ],
      numRatings: ratingsData.length,
      sumRating: ratingsData.reduce(
        (accumulator, currentValue) => accumulator + currentValue.rating,
        0
      ),
      price: randomNumberBetween(1, 4),
      photo: generateGamePosterUrl(gameName, gameGenre),
      timestamp: gameTimestamp,
    };

    data.push({
      gameData,
      ratingsData,
    });
  }
  return data;
}
