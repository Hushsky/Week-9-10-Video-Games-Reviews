// This directive tells Next.js that this component should run on the client side
// Client components can use browser APIs, event handlers, and state
"use client";

// This component shows one individual game
// It receives data from src/app/game/[id]/page.jsx
// This is a container component that manages game data and review functionality

// Import React hooks and components for state management and lifecycle
import { React, useState, useEffect, Suspense } from "react";
// Import Next.js dynamic import for code splitting and lazy loading
import dynamic from "next/dynamic";
// Import Firestore function to get real-time game data
import { getGameSnapshotById } from "@/src/lib/firebase/firestore.js";
// Import custom hook to get current user information
import { useUser } from "@/src/lib/getUser";
// Import the GameDetails component that displays game information
import GameDetails from "@/src/components/GameDetails.jsx";
// Import function to upload game images to Firebase Storage
import { updateGameImage } from "@/src/lib/firebase/storage.js";

// Dynamically import ReviewDialog component for lazy loading
// This reduces the initial bundle size by loading the dialog only when needed
const ReviewDialog = dynamic(() => import("@/src/components/ReviewDialog.jsx"));

// Export the main Game component as default
export default function Game({
  id,                // String: unique identifier for the game
  initialGame, // Object: initial game data from server-side rendering
  initialUserId,     // String: user ID from server-side rendering (fallback)
  children,          // React children: any child components passed to this component
}) {
  // State to store the current game details
  // Initialized with data from server-side rendering for better performance
  const [gameDetails, setGameDetails] = useState(initialGame);
  
  // State to control whether the review dialog is open or closed
  const [isOpen, setIsOpen] = useState(false);

  // Get the current user ID, with fallback to initialUserId from server
  // The only reason this component needs to know the user ID is to associate a review with the user, and to know whether to show the review dialog
  const userId = useUser()?.uid || initialUserId;
  
  // State to store the current review being written
  const [review, setReview] = useState({
    rating: 0,    // Number: star rating (0-5)
    text: "",     // String: review text content
  });

  // Function to update review state when user types or selects rating
  const onChange = (value, name) => {
    // Use spread operator to update only the specific field that changed
    setReview({ ...review, [name]: value });
  };

  // Async function to handle game image upload
  async function handleGameImage(target) {
    // Get the first file from the file input (if any files were selected)
    const image = target.files ? target.files[0] : null;
    
    // If no image was selected, exit early
    if (!image) {
      return;
    }

    // Upload the image to Firebase Storage and get the download URL
    const imageURL = await updateGameImage(id, image);
    
    // Update the game details with the new image URL
    setGameDetails({ ...gameDetails, photo: imageURL });
  }

  // Function to close the review dialog and reset the review form
  const handleClose = () => {
    setIsOpen(false);                    // Hide the dialog
    setReview({ rating: 0, text: "" }); // Reset review form to empty state
  };

  // Effect hook to set up real-time listener for game data
  useEffect(() => {
    // getGameSnapshotById returns a cleanup function
    // This sets up a real-time listener that updates when game data changes
    return getGameSnapshotById(id, (data) => {
      // Update local state whenever Firestore data changes
      setGameDetails(data);
    });
  }, [id]); // Re-run when game ID changes

  // Return the JSX for the Game component
  return (
    // React Fragment to group multiple elements without adding extra DOM nodes
    <>
      {/* GameDetails component displays the main game information */}
      <GameDetails
        game={gameDetails}        // Pass current game data
        userId={userId}                      // Pass user ID for authentication
        handleGameImage={handleGameImage}  // Pass image upload handler
        setIsOpen={setIsOpen}                // Pass function to open review dialog
        isOpen={isOpen}                      // Pass current dialog state
      >
        {/* Render any child components passed to Game */}
        {children}
      </GameDetails>
      
      {/* Conditionally render ReviewDialog only if user is logged in */}
      {userId && (
        // Suspense component provides loading fallback for dynamically imported components
        <Suspense fallback={<p>Loading...</p>}>
          {/* ReviewDialog component for writing reviews */}
          <ReviewDialog
            isOpen={isOpen}           // Whether dialog is visible
            handleClose={handleClose} // Function to close dialog
            review={review}           // Current review data
            onChange={onChange}       // Function to update review data
            userId={userId}           // User ID for review submission
            id={id}                   // Game ID for review association
          />
        </Suspense>
      )}
    </>
  );
}
