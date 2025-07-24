import React, { useState, useEffect } from "react";

function Draggg() {
  const [logoPosition, setLogoPosition] = useState(9); // Start at 9%
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false); // State to pause animation
  const [isDragging, setIsDragging] = useState(false); // State to track dragging
  const [dragStartX, setDragStartX] = useState(0); // X-coordinate during drag

  const dragItems = [
    { id: 1, name: "3D and cut-out", image: "./images/what1.png", content: ' Adinn eye-catching hoardings make you stand out from a wider audience. Our strategical placements make your brand dominate in high-traffic urban areas.' },
    { id: 2, name: "Dynamic Advertising", image: "./images/what2.png", content: "Content 2..." },
    { id: 3, name: "Geo Targeting", image: "./images/what3.png", content: "Content 3..." },
    { id: 4, name: "Traditional", image: "./images/what4.png", content: "Content 4..." },
    { id: 5, name: "Mobile Billboard", image: "./images/what5.png", content: "Content 5..." },
    { id: 6, name: "Wall Painting", image: "./images/what6.png", content: "Content 6..." },
    { id: 7, name: "Dynamic Lighting", image: "./images/what7.png", content: "Content 7..." },
  ];

  const [currentImage, setCurrentImage] = useState(dragItems[0].image);
  const [currentContent, setCurrentContent] = useState(dragItems[0].content);

  // Automatic movement
  useEffect(() => {
    if (isPaused || isDragging) return;

    const interval = setInterval(() => {
      setLogoPosition((prev) => {
        if (prev >= 92) return 9; // Reset to start
        return prev + 14; // Move forward
      });
    }, 1000); // Adjust speed as needed

    return () => clearInterval(interval);
  }, [isPaused, isDragging]);

  // Update content and active index based on position
  useEffect(() => {
    const index = Math.floor((logoPosition - 9) / 14);
    setActiveIndex(index < dragItems.length ? index : 0);
    setCurrentImage(dragItems[index < dragItems.length ? index : 0].image);
    setCurrentContent(dragItems[index < dragItems.length ? index : 0].content);
  }, [logoPosition]);

  // Handle drag start
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setIsPaused(true); // Pause auto movement
    setDragStartX(e.clientX);
  };

  // Handle drag movement
  const handleMouseMove = (e) => {
    if (!isDragging) return;

    const deltaX = e.clientX - dragStartX;
    const deltaPercentage = (deltaX / window.innerWidth) * 100;

    setLogoPosition((prev) => {
      const newPos = prev + deltaPercentage;
      // Ensure the position stays within bounds (9% to 92%)
      return Math.max(9, Math.min(92, newPos));
    });

    setDragStartX(e.clientX); // Update start position
  };

  // Handle drag end
  const handleMouseUp = () => {
    setIsDragging(false);
    setIsPaused(false); // Resume auto movement
  };

  return (
    <div
      onMouseMove={handleMouseMove} // Capture mouse move events
      onMouseUp={handleMouseUp} // End drag on mouse up
      onMouseLeave={() => setIsDragging(false)} // Handle case when mouse leaves window
    >
      <div className="what">
        <h1 className="heading what-head">
          What <span className="highlight">We</span> do?
        </h1>
        <div className="what-main container">
          <div className="whatWeDo-main container">
            <div className="what-main-content1">
              <p className="what-heading">
                We Ensure the best <span className="highlight">Support</span>
              </p>
              <p className="what-para">{currentContent}</p>
            </div>
            <div className="what-main-content2">
              <img src={currentImage} className="what-img1" alt="Dynamic Visual" />
            </div>
          </div>

          <div className="what-drag container-fluid">
            {dragItems.map((item, index) => (
              <div
                key={item.id}
                className={`drag-content ${index === activeIndex ? "active" : ""}`}
              >
                {item.name}
              </div>
            ))}
          </div>
          <div className="container">
            <p className="drag-line"></p>
            <img
              src="./images/A_logo.png"
              className="drag-img"
              alt="Logo"
              onMouseDown={handleMouseDown} // Start drag on mouse down
              onMouseUp={handleMouseUp} // End drag on mouse up
              onMouseEnter={() => setIsPaused(true)} // Pause on hover
              onMouseLeave={() => setIsPaused(false)} // Resume on hover out
              style={{
                position: "absolute",
                left: `calc(${logoPosition}% - 35px)`,
                top: "98.4%",
                transform:
                  activeIndex === Math.floor((logoPosition - 9) / 14)
                    ? "translateY(-30px) scale(1.4)"
                    : "none",
                transition: isDragging ? "none" : "all 0.5s ease-in-out",
                height: "40px",
                width: "40px",
                cursor: isDragging ? "grabbing" : "grab",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Draggg;
