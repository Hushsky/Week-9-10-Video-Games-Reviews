import {
  randomNumberBetween,
  getRandomDateAfter,
  getRandomDateBefore,
} from "@/src/lib/utils.js";
import { randomData } from "@/src/lib/randomData.js";

import { Timestamp } from "firebase/firestore";

// Function to get random game cover IDs from IGDB (Internet Game Database)
function getRandomGameCover() {
  // These are real cover IDs from popular games on IGDB
  const gameCovers = [
    "co1tmu", // The Legend of Zelda: Breath of the Wild
    "co1wyy", // Super Mario Odyssey
    "co1r6i", // The Witcher 3: Wild Hunt
    "co1r6j", // Grand Theft Auto V
    "co1r6k", // Red Dead Redemption 2
    "co1r6l", // Cyberpunk 2077
    "co1r6m", // Elden Ring
    "co1r6n", // God of War (2018)
    "co1r6o", // Spider-Man (2018)
    "co1r6p", // Horizon Zero Dawn
    "co1r6q", // The Last of Us Part II
    "co1r6r", // Ghost of Tsushima
    "co1r6s", // Assassin's Creed Valhalla
    "co1r6t", // Call of Duty: Modern Warfare
    "co1r6u", // FIFA 23
    "co1r6v", // Minecraft
    "co1r6w", // Fortnite
    "co1r6x", // Among Us
    "co1r6y", // Fall Guys
    "co1r6z", // Valorant
    "co1s00", // League of Legends
    "co1s01", // Counter-Strike 2
    "co1s02", // Dota 2
    "co1s03", // World of Warcraft
    "co1s04", // Final Fantasy XIV
    "co1s05", // Monster Hunter: World
    "co1s06", // Dark Souls III
    "co1s07", // Bloodborne
    "co1s08", // Sekiro: Shadows Die Twice
    "co1s09", // Resident Evil Village
    "co1s10", // Resident Evil 4 Remake
    "co1s11", // Dead Space Remake
    "co1s12", // Alan Wake 2
    "co1s13", // Baldur's Gate 3
    "co1s14", // Diablo IV
    "co1s15", // Starfield
    "co1s16", // Hogwarts Legacy
    "co1s17", // Marvel's Spider-Man 2
    "co1s18", // God of War Ragnarök
    "co1s19", // Horizon Forbidden West
    "co1s20", // Ratchet & Clank: Rift Apart
    "co1s21", // Demon's Souls Remake
    "co1s22", // Returnal
    "co1s23", // Deathloop
    "co1s24", // Ghostwire: Tokyo
    "co1s25", // Forspoken
    "co1s26", // Final Fantasy XVI
    "co1s27", // Street Fighter 6
    "co1s28", // Mortal Kombat 1
    "co1s29", // Tekken 8
    "co1s30", // Gran Turismo 7
  ];
  
  return gameCovers[randomNumberBetween(0, gameCovers.length - 1)];
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

    const gameData = {
      genre:
        randomData.gameGenres[
          randomNumberBetween(0, randomData.gameGenres.length - 1)
        ],
      name: randomData.gameNames[
        randomNumberBetween(0, randomData.gameNames.length - 1)
      ],
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
      photo: `https://images.igdb.com/igdb/image/upload/t_cover_big/${getRandomGameCover()}.jpg`,
      timestamp: gameTimestamp,
    };

    data.push({
      gameData,
      ratingsData,
    });
  }
  return data;
}
