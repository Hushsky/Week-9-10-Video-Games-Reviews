// Import Firebase Storage functions for file upload and management
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

// Import the Firebase Storage instance from the client app configuration
import { storage } from "@/src/lib/firebase/clientApp";

// Import function to update game document with new image URL
import { updateGameImageReference } from "@/src/lib/firebase/firestore";

// Main function to handle game image upload and database update
export async function updateGameImage(gameId, image) {
    try {
      // Validate that game ID is provided
      if (!gameId) {
        throw new Error("No game ID has been provided.");
      }
  
      // Validate that image file is provided and has a name
      if (!image || !image.name) {
        throw new Error("A valid image has not been provided.");
      }
  
      // Upload the image to Firebase Storage and get the public URL
      const publicImageUrl = await uploadImage(gameId, image);
      
      // Update the game document in Firestore with the new image URL
      await updateGameImageReference(gameId, publicImageUrl);
  
      // Return the public URL for immediate use in the UI
      return publicImageUrl;
    } catch (error) {
      // Log the error for debugging purposes
      console.error("Error processing request:", error);
    }
  }
  
  // Helper function to upload image file to Firebase Storage
  async function uploadImage(gameId, image) {
    // Create a structured file path for organizing images by game
    // Format: images/{gameId}/{filename}
    const filePath = `images/${gameId}/${image.name}`;
    
    // Create a reference to the file location in Firebase Storage
    const newImageRef = ref(storage, filePath);
    
    // Upload the file to Firebase Storage
    // uploadBytesResumable allows for resumable uploads and progress tracking
    await uploadBytesResumable(newImageRef, image);
  
    // Get the public download URL for the uploaded file
    // This URL can be used to display the image in the application
    return await getDownloadURL(newImageRef);
  }