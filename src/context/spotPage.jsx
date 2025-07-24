import { useNavigate } from "react-router-dom";
import { useSpot } from "./spotContext"; // Ensure correct import

const SpotsPage = () => {
  const navigate = useNavigate();
  const { setSelectedSpot } = useSpot();

  const spots = [
    {
      id: 1,
      location: "Chennai, Tamil Nadu",
      category: "Bus shelter",
      price: 21000,
      dimensions: "24 x 30",
      rating: 4,
      imageUrl: "/images/spot1.png", // Ensure correct path
    },
    {
      id: 2,
      location: "Kanyakumari, Tamil Nadu",
      category: "Gantry",
      price: 20000,
      dimensions: "24 x 30",
      rating: 3,
      imageUrl: "/images/spot2.png", // Ensure correct path
    },
  ];

  const handleBookNow = (spot) => {
    setSelectedSpot(spot); // Store selected spot in context
    navigate("/bookCheck"); // Navigate to booking page
  };

  return (
    <div className="row">
      {spots.map((spot) => (
        <div className="col-lg-4 col-md-6 col-sm-12 mb-4" key={spot.id}>
          <div className="card board">
            <img src={spot.imageUrl} alt={spot.location} className="card-img-top" />
            <span className="board-category">{spot.category}</span>
            <div className="board-content">
              <span className="card-title board-loc">{spot.location}</span>
              <span className="board-dim">{spot.dimensions}</span>
              <span className="board-price">₹{spot.price.toLocaleString()}</span>
              <button className="board-btn" onClick={() => handleBookNow(spot)}>
                Book Now
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SpotsPage;
