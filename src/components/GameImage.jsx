// Image component with fallback for game posters
"use client";

import React, { useState } from "react";

const GameImage = ({ src, alt, className, style, ...props }) => {
  const [imageError, setImageError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);

  const handleError = () => {
    if (!imageError) {
      setImageError(true);
      // Fallback to a simple colored placeholder
      const fallbackColors = ["4a90e2", "7ed321", "f5a623", "d0021b", "9013fe"];
      const randomColor = fallbackColors[Math.floor(Math.random() * fallbackColors.length)];
      setCurrentSrc(`https://via.placeholder.com/300x400/${randomColor}/ffffff?text=${encodeURIComponent(alt || 'Game')}`);
    }
  };

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      style={style}
      onError={handleError}
      {...props}
    />
  );
};

export default GameImage;
