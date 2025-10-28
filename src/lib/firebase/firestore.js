// Import function to generate fake game and review data for testing/development
import { generateFakeGamesAndReviews } from "@/src/lib/fakeGames.js";

// Import Firebase Firestore functions for database operations
import {
  collection,    // Reference to a collection in Firestore
  onSnapshot,    // Real-time listener for document changes
  query,         // Create a query to filter/order documents
  getDocs,       // Get all documents from a query (one-time read)
  doc,           // Reference to a specific document
  getDoc,        // Get a single document (one-time read)
  updateDoc,     // Update an existing document
  orderBy,       // Order query results by a field
  Timestamp,     // Firestore timestamp type for dates
  runTransaction, // Execute multiple operations atomically
  where,         // Filter query results by field values
  addDoc,        // Add a new document to a collection
  getFirestore,  // Get Firestore instance
} from "firebase/firestore";

// Import the Firestore database instance from the client app configuration
import { db } from "@/src/lib/firebase/clientApp";

// Function to update a game's photo URL in the database
export async function updateGameImageReference(
  gameId,      // String: unique identifier for the game
  publicImageUrl     // String: the public URL of the uploaded image
) {
  // Create a reference to the specific game document
  const gameRef = doc(collection(db, "games"), gameId);
  
  // Check if the document reference exists before updating
  if (gameRef) {
    // Update the game document with the new photo URL
    await updateDoc(gameRef, { photo: publicImageUrl });
  }
}

// Helper function to update game rating statistics within a transaction
// This ensures data consistency when adding new reviews
const updateWithRating = async (
  transaction,        // Firestore transaction object
  docRef,            // Reference to the game document
  newRatingDocument,  // Reference to the new rating document
  review             // Object: the review data to add
) => {
  // Get the current game data within the transaction
  const game = await transaction.get(docRef);
  const data = game.data();
  
  // Calculate new rating statistics
  const newNumRatings = data?.numRatings ? data.numRatings + 1 : 1;  // Increment total ratings count
  const newSumRating = (data?.sumRating || 0) + Number(review.rating);  // Add new rating to sum
  const newAverage = newSumRating / newNumRatings;  // Calculate new average rating

  // Update the game document with new rating statistics
  transaction.update(docRef, {
    numRatings: newNumRatings,  // Total number of ratings
    sumRating: newSumRating,    // Sum of all ratings
    avgRating: newAverage,      // Average rating (sum / count)
  });

  // Add the new rating document to the subcollection
  transaction.set(newRatingDocument, {
    ...review,  // Spread all review properties (rating, text, userId, etc.)
    timestamp: Timestamp.fromDate(new Date()),  // Add current timestamp
  });
};

// Function to add a new review to a game using atomic transactions
export async function addReviewToGame(db, gameId, review) {
  // Validate that game ID is provided
  if (!gameId) {
    throw new Error("No game ID has been provided.");
  }

  // Validate that review data is provided
  if (!review) {
    throw new Error("A valid review has not been provided.");
  }

  try {
    // Create reference to the game document
    const docRef = doc(collection(db, "games"), gameId);
    
    // Create reference to a new rating document in the subcollection
    const newRatingDocument = doc(
      collection(db, `games/${gameId}/ratings`)
    );

    // Execute the transaction to update both game stats and add the review
    await runTransaction(db, transaction =>
      updateWithRating(transaction, docRef, newRatingDocument, review)
    );
  } catch (error) {
    // Log error details for debugging
    console.error(
      "There was an error adding the rating to the game",
      error
    );
    // Re-throw the error so calling code can handle it
    throw error;
  }
}

// Helper function to apply filters and sorting to game queries
function applyQueryFilters(q, { genre, platform, price, sort }) {
  // Filter by game genre (e.g., "Action", "RPG", etc.)
  if (genre) {
    q = query(q, where("genre", "==", genre));
  }
  
  // Filter by platform
  if (platform) {
    q = query(q, where("platform", "==", platform));
  }
  
  // Filter by price range (price is an array of $ symbols, length determines price level)
  if (price) {
    q = query(q, where("price", "==", price.length));
  }
  
  // Sort by average rating (default) or number of reviews
  if (sort === "Rating" || !sort) {
    q = query(q, orderBy("avgRating", "desc"));  // Highest rated first
  } else if (sort === "Review") {
    q = query(q, orderBy("numRatings", "desc"));  // Most reviewed first
  }
  
  return q;
}

// Function to get all games with optional filtering (one-time read)
export async function getGames(db = db, filters = {}) {
  // Start with a query for all games
  let q = query(collection(db, "games"));

  // Apply filters and sorting to the query
  q = applyQueryFilters(q, filters);
  
  // Execute the query and get all matching documents
  const results = await getDocs(q);
  
  // Transform the results into a plain JavaScript array
  return results.docs.map((doc) => {
    return {
      id: doc.id,                    // Document ID
      ...doc.data(),                // All document data
      // Convert Firestore timestamp to JavaScript Date object
      // Only plain objects can be passed to Client Components from Server Components
      timestamp: doc.data().timestamp.toDate(),
    };
  });
}

// Function to get games with real-time updates (listener)
export function getGamesSnapshot(cb, filters = {}) {
  // Validate that callback is a function
  if (typeof cb !== "function") {
    console.error("Error: The callback parameter is not a function");
    return;
  }

  // Start with a query for all games
  let q = query(collection(db, "games"));
  
  // Apply filters and sorting
  q = applyQueryFilters(q, filters);

  // Set up real-time listener that triggers callback when data changes
  return onSnapshot(q, (querySnapshot) => {
    // Transform the results into a plain JavaScript array
    const results = querySnapshot.docs.map((doc) => {
      return {
        id: doc.id,                    // Document ID
        ...doc.data(),                // All document data
        // Convert Firestore timestamp to JavaScript Date object
        // Only plain objects can be passed to Client Components from Server Components
        timestamp: doc.data().timestamp.toDate(),
      };
    });

    // Call the provided callback with the transformed results
    cb(results);
  });
}

// Function to get a single game by ID (one-time read)
export async function getGameById(db, gameId) {
  // Validate that game ID is provided
  if (!gameId) {
    console.error("Error: Invalid ID received: ", gameId);
    return;
  }
  
  // Create reference to the specific game document
  const docRef = doc(db, "games", gameId);
  
  // Get the document data
  const docSnap = await getDoc(docRef);
  
  // Return the document data with converted timestamp
  return {
    ...docSnap.data(),  // All document data
    timestamp: docSnap.data().timestamp.toDate(),  // Convert timestamp to Date
  };
}

// Function to get a single game with real-time updates (listener)
// Note: This function is currently incomplete (just returns)
export function getGameSnapshotById(gameId, cb) {
  return;
}

// Function to get all reviews for a specific game (one-time read)
export async function getReviewsByGameId(db, gameId) {
  // Validate that game ID is provided
  if (!gameId) {
    console.error("Error: Invalid gameId received: ", gameId);
    return;
  }

  // Create query for the ratings subcollection, ordered by timestamp (newest first)
  const q = query(
    collection(db, "games", gameId, "ratings"),
    orderBy("timestamp", "desc")
  );

  // Execute the query and get all matching documents
  const results = await getDocs(q);
  
  // Transform the results into a plain JavaScript array
  return results.docs.map((doc) => {
    return {
      id: doc.id,                    // Document ID
      ...doc.data(),                // All document data
      // Convert Firestore timestamp to JavaScript Date object
      // Only plain objects can be passed to Client Components from Server Components
      timestamp: doc.data().timestamp.toDate(),
    };
  });
}

// Function to get reviews for a game with real-time updates (listener)
export function getReviewsSnapshotByGameId(gameId, cb) {
  // Validate that game ID is provided
  if (!gameId) {
    console.error("Error: Invalid gameId received: ", gameId);
    return;
  }

  // Create query for the ratings subcollection, ordered by timestamp (newest first)
  const q = query(
    collection(db, "games", gameId, "ratings"),
    orderBy("timestamp", "desc")
  );
  
  // Set up real-time listener that triggers callback when data changes
  return onSnapshot(q, (querySnapshot) => {
    // Transform the results into a plain JavaScript array
    const results = querySnapshot.docs.map((doc) => {
      return {
        id: doc.id,                    // Document ID
        ...doc.data(),                // All document data
        // Convert Firestore timestamp to JavaScript Date object
        // Only plain objects can be passed to Client Components from Server Components
        timestamp: doc.data().timestamp.toDate(),
      };
    });
    
    // Call the provided callback with the transformed results
    cb(results);
  });
}

// Function to populate the database with fake data for testing/development
export async function addFakeGamesAndReviews() {
  // Generate fake game and review data
  const data = await generateFakeGamesAndReviews();
  
  // Loop through each game and its reviews
  for (const { gameData, ratingsData } of data) {
    try {
      // Add the game document to the games collection
      const docRef = await addDoc(
        collection(db, "games"),
        gameData
      );

      // Add each review to the game's ratings subcollection
      for (const ratingData of ratingsData) {
        await addDoc(
          collection(db, "games", docRef.id, "ratings"),
          ratingData
        );
      }
    } catch (e) {
      // Log errors but continue processing other games
      console.error("There was an error adding the document");
      console.error("Error adding document: ", e);
    }
  }
}
