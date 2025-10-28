// AI Game Poster Generator
// This utility can generate game posters using AI services

/* global Promise */

export const generateAIGamePoster = async (gameName, genre, platform) => {
  // Option 1: Using DALL-E API (requires OpenAI API key)
  const generateWithDALLE = async () => {
    const prompt = `Create a professional video game poster for "${gameName}", ${genre} genre, ${platform} platform. Style: modern gaming poster with bold typography, dynamic colors, and gaming elements. High quality, 16:9 aspect ratio.`;
    
    try {
      const response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: "dall-e-3",
          prompt: prompt,
          n: 1,
          size: "1024x1024",
          quality: "hd"
        })
      });
      
      const data = await response.json();
      return data.data[0].url;
    } catch (error) {
      console.error('Error generating poster with DALL-E:', error);
      return null;
    }
  };

  // Option 2: Using Stable Diffusion API (free alternatives)
  const generateWithStableDiffusion = async () => {
    const prompt = `video game poster, ${gameName}, ${genre} game, ${platform}, professional artwork, bold typography, gaming elements, high quality`;
    
    try {
      const response = await fetch('https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.STABILITY_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text_prompts: [{ text: prompt }],
          cfg_scale: 7,
          height: 1024,
          width: 1024,
          samples: 1,
          steps: 30,
        })
      });
      
      const data = await response.json();
      return data.artifacts[0].base64;
    } catch (error) {
      console.error('Error generating poster with Stable Diffusion:', error);
      return null;
    }
  };

  // Option 3: Using free AI services
  const generateWithFreeAI = async () => {
    // Using Hugging Face's free inference API
    const prompt = `A professional video game poster for ${gameName}, ${genre} genre, ${platform} platform, modern gaming design`;
    
    try {
      const response = await fetch('https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            num_inference_steps: 20,
            guidance_scale: 7.5
          }
        })
      });
      
      if (response.ok) {
        const blob = await response.blob();
        return URL.createObjectURL(blob);
      }
    } catch (error) {
      console.error('Error generating poster with Hugging Face:', error);
      return null;
    }
  };

  // Try different methods in order of preference
  try {
    // First try DALL-E if API key is available
    if (process.env.OPENAI_API_KEY) {
      const dalleResult = await generateWithDALLE();
      if (dalleResult) return dalleResult;
    }

    // Then try Stable Diffusion
    if (process.env.STABILITY_API_KEY) {
      const sdResult = await generateWithStableDiffusion();
      if (sdResult) return sdResult;
    }

    // Finally try free services
    const freeResult = await generateWithFreeAI();
    if (freeResult) return freeResult;

    // Fallback to placeholder
    return `https://via.placeholder.com/300x400/4a90e2/ffffff?text=${encodeURIComponent(gameName)}`;
    
  } catch (error) {
    console.error('Error generating AI poster:', error);
    return `https://via.placeholder.com/300x400/4a90e2/ffffff?text=${encodeURIComponent(gameName)}`;
  }
};

// Utility function to generate multiple posters for batch processing
export const generateBatchPosters = async (games) => {
  const posters = [];
  
  for (const game of games) {
    try {
      const posterUrl = await generateAIGamePoster(game.name, game.genre, game.platform);
      posters.push({
        gameId: game.id,
        posterUrl: posterUrl
      });
      
      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`Error generating poster for ${game.name}:`, error);
      posters.push({
        gameId: game.id,
        posterUrl: `https://via.placeholder.com/300x400/4a90e2/ffffff?text=${encodeURIComponent(game.name)}`
      });
    }
  }
  
  return posters;
};
