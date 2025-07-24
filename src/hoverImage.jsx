import React, { useState } from "react";
import "./hoverImage.css"; // Import the CSS file

const ButtonWithHoverEffect = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="button-container">
      <button
        className="hover-button"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <span className={`text top ${isHovered ? "move-up" : ""}`}>Hover</span>
        <span className={`text bottom ${isHovered ? "move-down" : ""}`}>Me</span>

        {/* Image that appears outside on hover */}
        <img
          src="./images/adinn_logo.png" // Replace with your image URL
          alt="Icon"
          className={`hover-image ${isHovered ? "show-image" : ""}`}
        />
      </button>
    </div>
  );
};

export default ButtonWithHoverEffect;

