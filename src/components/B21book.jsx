import React,{useState, useEffect} from 'react'
import '../components/B21book.css';
import { useNavigate, useLocation } from "react-router-dom";
import { useSpot } from './B0SpotContext';
//BASE URL OF http://localhost:3001 FILE IMPORT 
import { baseUrl } from '../Adminpanel/BASE_URL';

function BookASite11() {   
    //Start rating board
    // Function to render star ratings
    const [similarSpots, setSimilarSpots] = useState([]);
    const { selectedSpot } = useSpot(); // Get the current product from context

    useEffect(() => {
        if (selectedSpot?.prodCode) {
            const fetchSimilarProducts = async () => {
                try {
                    const response = await fetch(
                        `${baseUrl}/products/similar/${selectedSpot.prodCode}`
                    );
                    const data = await response.json();
                    if (response.ok) {
                        setSimilarSpots(data);
                    } else {
                        console.log("No similar products found");
                        setSimilarSpots([]);
                    }
                } catch (error) {
                    console.error("Error fetching similar products:", error);
                    setSimilarSpots([]);
                }
            };
            fetchSimilarProducts();
        }
    }, [selectedSpot]);

    const RatingStars = ({ rating }) => {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 !== 0;
        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
        return (
            <div className="rate rate1-book1">
                {[...Array(fullStars)].map((_, index) => (
                    <span key={index} className="fa-solid fa-star stars-book1"></span>
                ))}
                {halfStar && <span className="fa-solid fa-star-half-alt stars-book1"></span>}
                {[...Array(emptyStars)].map((_, index) => (
                    <span key={index} className="fa-solid fa-star empty-star-book1"></span>
                ))}
            </div>
        );
    };

    // NAVIGATE 
    const navigate = useNavigate();
    return (
        <div>

            {/* BANNER SECTION WITH BACKGROUND IMAGE  */}
            <div className="container banner-main">
                <h1 className='Banner-heading'>Terms and Conditions</h1>
                <ul className='banner-content'>
                    <li> Sites are subject to availability at the time of confirmation.  </li>
                    <li>The campaign should commence within 7 business days from the date of confirmation. Failure to adhere to this timeline will result in the release of sites without further notice or billing from the confirmation date.</li>
                    <li>Requests for campaign extensions must be communicated via email at least 10 days before the end date of the current campaign. Extensions requested with shorter notice are subject to site availability.</li>
                    <li>We are not liable for damages to flex caused by natural calamities. Reprinting costs are to be borne by you, with flex remounting provided free of charge.</li>
                    <li>100% payment is required in advance. </li>
                    <li>Purchase orders must be issued in the name of Adinn Advertising Services, Ltd and provided before the campaign commences. </li>
                    <li>An 18% GST is applicable to all transactions.  </li>
                </ul>
            </div>

            {/* Nearby Similar  Products  */}
            <div>


                <div class="container similar mt-5">
                    <h2 class="NearbyHeading mb-4">Nearby Similar Products</h2>
                    <div class="row similar-products">
                        
                            {similarSpots.length > 0 ? (
                            similarSpots.map(
                                (spot) => (
                                    <div className="col-lg-3 col-md-3 col-sm-12 mb-4 " key={spot._id} >
                                        <div className="card board1-book1" >
                                            <img src={spot.image} alt={spot.location} className="card-img-top-book1" />
                                            <span className='board-category-book1'>{spot.category}</span>
                                            <div  className="board-content-book1 ">
                                                <div className='board-content-top-book1' style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', height: '50px' }}>
                                                    <span className="card-title board-loc-book1">{spot.location}</span>
                                                    <span className="board-dim-book1">{spot.dimensions}</span>
                                                </div>
                                                <div className='board-content-bottom-book1' style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', height: '50px' }}>
                                                    <span className="board-price-book1">₹{spot.price.toLocaleString()}</span>
                                                    <img src='./images/rating_board.png' className='rate-board-book1'></img>
                                                </div>
                                                <RatingStars rating={spot.rating} />
                                                <button className="board-btn-book1" onClick={() => navigate("/book1#similarProdDetailsShows")}>Book Now</button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                        <p className="text-center">No similar products found.</p>
                    )}
                        {/* <!-- Repeat the above block for each product -->  */}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BookASite11;
