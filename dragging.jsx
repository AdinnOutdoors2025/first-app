
import React, { useState } from "react";

function SimpleDrag() {
  const [logoPosition, setLogoPosition] = useState({ x: 100, y: 100 }); // Initial position of the logo

  const handleDragStart = (event) => {
    const offsetX = event.clientX - logoPosition.x;
    const offsetY = event.clientY - logoPosition.y;

    event.dataTransfer.setData(
      "application/drag-offset",
      JSON.stringify({ offsetX, offsetY })
    );
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const rawData = event.dataTransfer.getData("application/drag-offset");

    if (!rawData) {
      console.error("No data found in the drag event!");
      return;
    }

    let data;
    try {
      data = JSON.parse(rawData);
    } catch (error) {
      console.error("Error parsing JSON:", error);
      return;
    }

    const x = event.clientX - data.offsetX;
    const y = event.clientY - data.offsetY;
    setLogoPosition({ x, y });
  };

  const handleDragOver = (event) => {
    event.preventDefault(); // Necessary for the drop event to work
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      style={{
        height: "100vh",
        width: "100vw",
        background: "#f4f4f4",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <img
        src="./images/A_logo.png" // Replace this with your logo's URL
        alt="Draggable Logo"
        draggable="true"
        onDragStart={handleDragStart}
        style={{
          position: "absolute",
          left: `${logoPosition.x}px`,
          top: `${logoPosition.y}px`,
          cursor: "grab",
        }}
      />
    </div>
  );
}

export default SimpleDrag;
