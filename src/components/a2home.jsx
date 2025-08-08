import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./a2home.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { baseUrl } from '../Adminpanel/BASE_URL';
import slugify from 'slugify';


function AdinnHome2() {
    // NAVIGATE
    const navigate = useNavigate();


    //Start rating board
    // Function to render star ratings
    const RatingStars = ({ rating }) => {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 !== 0;
        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
        return (
            <div className="rates-home">
                {[...Array(fullStars)].map((_, index) => (
                    <span key={index} className="fa-solid fa-star stars-home"></span>
                ))}
                {halfStar && <span className="fa-solid fa-star-half-alt stars-home"></span>}
                {[...Array(emptyStars)].map((_, index) => (
                    <span key={index} className="fa-solid fa-star empty-star-home"></span>
                ))}
            </div>
        );
    };
    const [primeSpotsData, setPrimeSpotsData] = useState([]);
    const [isLoading, setIsLoading] = useState(null);


    useEffect(
        () => {
            const fetchPrimeSpots = async () => {
                try {
                    const response = await fetch(`${baseUrl}/products`);
                    const data = await response.json();
                    const visibleProducts = data.filter(
                        visibleProd => visibleProd.visible !== false
                    ).slice(0, 10);


                    const mappedPrimeSpots = visibleProducts.map(prod => ({
                        id: prod._id,
                        location: `${prod.location.district}, ${prod.location.state}`,
                        price: prod.price,
                        dimensions: `${prod.height} x ${prod.width}`,
                        height: prod.height, // Add this
                        width: prod.width, // Add this
                        rating: prod.rating,
                        imageUrl: prod.image,
                        category: prod.mediaType,
                        prodName: prod.name,
                        prodCode: prod.prodCode,
                        lighting: prod.lighting,
                        from: prod.from,
                        to: prod.to,
                        printingCost: prod.printingCost,
                        mountingCost: prod.mountingCost,
                        latitude : prod.Latitude,
                        longitude : prod.Longitude,
                        LocationLink : prod.LocationLink
                        
                    }));
                    setPrimeSpotsData(mappedPrimeSpots);
                    setIsLoading(false);
                }
                catch (err) {
                    console.log("Failed to fetch prime spots", err);
                    setIsLoading(false);
                }
            };
            fetchPrimeSpots();
        }, []
    );
    //SLICK ANIMATIONS EFFECT
    // Custom Next Arrow
    const handleBookNow = (spot) => {
        // Prepare all required data for the booking page
        const spotData = {
            id: spot._id || spot.id, // Handle both cases
            prodName: spot.name || spot.prodName,
            printingCost: spot.printingCost,
            mountingCost: spot.mountingCost,
            prodCode: spot.prodCode,
            prodLighting: spot.lighting,
            productFrom: spot.from,
            productTo: spot.to,
            location: `${spot.location?.district || spot.district}, ${spot.location?.state || spot.state}`,
            category: spot.mediaType || spot.category,
            price: spot.price,
            sizeHeight: spot.height,
            sizeWidth: spot.width,
            rating: spot.rating,
            imageUrl: spot.image || spot.imageUrl,
            district: spot.location?.district || spot.district,
            state: spot.location?.state || spot.state,
            latitude : spot.latitude,
            longitude:spot.longitude,
            LocationLink:spot.LocationLink
        };


        // Navigate to booking page with state
        navigate(`/Product/${spotData.id}-${slugify(spotData.prodName)}`, {
            state: { selectedSpot: spotData }
        });
    };




    const NextArrow = (props) => {
        const { onClick } = props;
        return (
            <div className="custom-arrow next-arrow" onClick={onClick}>
                ❯
            </div>
        );
    };


    // Custom Previous Arrow
    const PrevArrow = (props) => {
        const { onClick } = props;
        return (
            <div className="custom-arrow prev-arrow" onClick={onClick}>
                ❮
            </div>
        );
    };


    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
        centerMode: true, // Centered view
        centerPadding: "0px", // Minimal gap between slides
        autoplay: true, // Enables automatic sliding //remove this line if you  want autoplay
        autoplaySpeed: 2000,
        beforeChange: (current, next) => {
            const elements = document.querySelectorAll(".slick-slide");
            elements.forEach((el, index) => {
                if (index === next) {
                    el.classList.add("slick-center");
                } else {
                    el.classList.remove("slick-center");
                }
            });
        },
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                },
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    centerPadding: "40px", // Minimal gap between slides


                },
            },
            {
                breakpoint: 400,
                settings: {
                    slidesToShow: 1,
                    centerPadding: "20px", // Minimal gap between slides


                },
            },
        ],
    };


    if (isLoading) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }


    return (
        <div>
            <h1 className="heading"><span className="highlight">Prime Advertising </span> Spots</h1>
            <div className="w-3/4 prime ">
                <Slider {...settings}>
                    {primeSpotsData.map((spot, index) => (
                        <div className={`billboard-card ${index === 1 ? 'scaleZoomInLeft' : ''}`} key={spot.id} >
                            <img src={spot.imageUrl} alt={spot.location} className="card-img-top1-home" />
                            <span className='board-category1-home'>{spot.category}</span>
                            <div className="board-content-home ">
                                <div className="board-content-home-top" style={{}}>
                                    <span className=" board-loc-home">{spot.prodName}</span>
                                    <span className="board-dim-home">{spot.dimensions}</span>
                                </div>
                                <div className="board-content-home-bottom" style={{}}>
                                    <span className="board-price-home">₹{spot.price.toLocaleString()}</span>
                                    <img src='./images/rating_board.png' className='rate-board-home'></img>
                                </div>
                                <div >
                                    <RatingStars rating={spot.rating} />
                                    <button className="board-btn1-home"
                                        onClick={() => handleBookNow(spot)} >Book Now</button>
                                </div>
                            </div>
                        </div>
                    ))}

                </Slider>


            </div>
        </div>
    );
}
export default AdinnHome2;