import { useSpot } from "./spotContext"; // Ensure correct import
import { useNavigate } from "react-router-dom";

const BookPage = () => {
  const { selectedSpot } = useSpot();
  const navigate = useNavigate();

  if (!selectedSpot) {
    return (
      <div className="container">
        <h5>No spot selected. Please go back and select a spot.</h5>
        <button onClick={() => navigate(-1)}>⬅ Go Back</button>
      </div>
    );
  }

  return (
    <div className="container">
      <button onClick={() => navigate(-1)}>⬅ Go Back</button>
      <div className="col-md-6 col-lg-6 Book-content2">
        <p className="book-sideHeading">
          {selectedSpot.category} - {selectedSpot.location}
        </p>
        <p className="book-size">Size: {selectedSpot.dimensions}</p>
        <span className="board-price">₹{selectedSpot.price.toLocaleString()}</span>
        <button className="board-btn">Proceed to Payment</button>
      </div>
    </div>
  );
};

export default BookPage;
