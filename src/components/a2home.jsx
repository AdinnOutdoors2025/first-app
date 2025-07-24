import React from "react";
import { useNavigate } from "react-router-dom";

import "./a2home.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

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

    const spots = [
        {
            id: 1,
            location: "Adayar L B Road towards Thiruvanmiyur",
            price: 120000,
            dimensions: "24 x 30",
            rating: 4.5,
            imageUrl: "./images/spot1.png",
        },
        {
            id: 2,
            location: "Adayar L B Road towards Thiruvanmiyur",
            price: 500000,
            dimensions: "24 x 30",
            rating: 4.5,
            imageUrl: "./images/spot2.png",
        },
        {
            id: 3,
            location: "Adayar L B Road towards Thiruvanmiyur",
            price: 120000,
            dimensions: "24 x 30",
            rating: 4.5,
            imageUrl: "./images/spot3.png",
        },
        {
            id: 4,
            location: "Adayar L B Road towards Thiruvanmiyur",
            price: 120000,
            dimensions: "24 x 30",
            rating: 4.5,
            imageUrl: "./images/spot1.png",
        },
        {
            id: 5,
            location: "Adayar L B Road towards Thiruvanmiyur",
            price: 120000,
            dimensions: "24 x 30",
            rating: 4.5,
            imageUrl: "./images/spot2.png",
        },
        {
            id: 6,
            location: "Adayar L B Road towards Thiruvanmiyur",
            price: 120000,
            dimensions: "24 x 30",
            rating: 4.5,
            imageUrl: "./images/spot3.png",
        },
    ];

    // Custom Next Arrow
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
        autoplaySpeed: 1000,
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
            //  {
            //     breakpoint: 2000,
            //     settings: {
            //         slidesToShow: 3,
            //         centerPadding: "30px", // Minimal gap between slides

            //     },
            // },
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

        // Slide transition interval in milliseconds
    };



    return (
        <div>
            <h1 className="heading"><span className="highlight">Prime Advertising</span> Spots</h1>
            <div className="w-3/4 prime ">
                <Slider {...settings}>
                    {spots.map((spot, index) => (
                        <div className={`billboard-card ${index === 1 ? 'scaleZoomInLeft' : ''}`} key={spot.id} onClick={() => navigate("/book")}>
                            {/* <div className="card  boards" > */}
                                <img src={spot.imageUrl} alt={spot.location} className="card-img-top1-home" />
                                <span className='board-category1-home'>{spot.category}</span>
                                <div className="board-content-home ">
                                    <div className="board-content-home-top" style={{  }}>
                                        <span className=" board-loc-home">{spot.location}</span>
                                        <span className="board-dim-home">{spot.dimensions}</span>
                                    </div>
                                    <div className="board-content-home-bottom" style={{  }}>
                                        <span className="board-price-home">₹{spot.price.toLocaleString()}</span>
                                        <img src='./images/rating_board.png' className='rate-board-home'></img>
                                    </div>
                                    <div >
                                    <RatingStars rating={spot.rating} />
                                    <button className="board-btn1-home" onClick={() => navigate("/book")}>Book Now</button>
                                    </div>
                                </div>
                            {/* </div> */}
                        </div>
                    ))}
                </Slider>

            </div>
        </div>
    );
}
export default AdinnHome2;







