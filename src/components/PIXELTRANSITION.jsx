import PixelTransition from '../components/SPLASH_TEXT.jsx';

<PixelTransition
  firstContent={
    <img
      src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Cat03.jpg/1200px-Cat03.jpg"
      alt="default pixel transition content, a cat!"
      style={{ width: "100%", height: "100%", objectFit: "cover", border:'5px solid black' }}
    />
  }
  secondContent={
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "grid",
        placeItems: "center",
        backgroundColor: "#111"
      }}
    >
      <p style={{ fontWeight: 900, fontSize: "3rem", color: "blue" }}>HII !</p>
    </div>
  }
  gridSize={12}
  pixelColor='#ffffff'
  animationStepDuration={0.4}
  className="custom-pixel-card"
/>