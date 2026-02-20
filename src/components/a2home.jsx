

import React, { useEffect, useState ,useRef} from "react";
import { useNavigate } from "react-router-dom";
import "./a2home.css";
import "./b2book.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { baseUrl } from '../Adminpanel/BASE_URL';
import slugify from 'slugify';
import { formatIndianCurrency } from "./FORMATED_AMOUNT";
import '../components/PreLoad.css';


function AdinnHome2() {
    const navigate = useNavigate();
    const timeoutRef = useRef(false);
    

    // Function to render star ratings
    // const RatingStars = ({ rating }) => {
    //     const fullStars = Math.floor(rating);
    //     const halfStar = rating % 1 !== 0;
    //     const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    //     return (
    //         <div className="rates-home">
    //             {[...Array(fullStars)].map((_, index) => (
    //                 <span key={index} className="fa-solid fa-star stars-home"></span>
    //             ))}
    //             {halfStar && <span className="fa-solid fa-star-half-alt stars-home"></span>}
    //             {[...Array(emptyStars)].map((_, index) => (
    //                 <span key={index} className="fa-solid fa-star empty-star-home"></span>
    //             ))}
    //         </div>
    //     );
    // };
 const RatingStars1 = ({ rating }) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
      <div className="rate2-book">
  <span className="rating-text">4.3</span>
  <span className="fa-solid fa-star rating2-star"></span>
</div>

    );
  };

    const [primeSpotsData, setPrimeSpotsData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [primeCount, setPrimeCount] = useState(0);

    useEffect(() => {
        const fetchPrimeSpots = async () => {
            try {
                setIsLoading(true);
                setError(null);
                console.log('Fetching prime spots from:', `${baseUrl}/products/get-prime`);

                // Fetch only prime spots (isPrime = 1)
                const response = await fetch(`${baseUrl}/products/get-prime`);

                console.log('Response status:', response.status);

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('Server error response:', errorText);
                    throw new Error(`Failed to fetch prime spots: ${response.status} - ${errorText}`);
                }

                const result = await response.json();
                console.log('Prime spots result:', result);

                if (!result.success) {
                    console.error('API returned failure:', result);
                    throw new Error(result.message || 'Failed to fetch prime spots');
                }

                console.log('Fetched prime spots count:', result.count);
                console.log('Prime spots data:', result.data);

                setPrimeCount(result.count || 0);

                if (!result.data || result.data.length === 0) {
                    console.log('No prime spots found');
                    setPrimeSpotsData([]);
                    setIsLoading(false);
                    return;
                }

                // Map prime spots data - ensure all required fields are present
                const mappedPrimeSpots = result.data.map(prod => {
                    // Ensure required fields exist
                    const productData = {
                        id: prod._id || prod.id,
                        _id: prod._id,
                        name: prod.name || prod.prodName || 'Unnamed Product',
                        location: prod.location ?
                            `${prod.location.district || ''}, ${prod.location.state || ''}` :
                            `${prod.district || ''}, ${prod.state || ''}`,
                        price: prod.price || 0,
                        dimensions: `${prod.height || 0} x ${prod.width || 0}`,
                        height: prod.height || 0,
                        width: prod.width || 0,
                        rating: prod.rating || 0,
                        imageUrl: prod.image || prod.imageUrl || '',
                        image: prod.image || prod.imageUrl || '',
                        mediaType: prod.mediaType || prod.category || '',
                        category: prod.mediaType || prod.category || '',
                        prodName: prod.name || prod.prodName || 'Unnamed Product',
                        prodCode: prod.prodCode || '',
                        lighting: prod.lighting || '',
                        from: prod.from || '',
                        to: prod.to || '',
                        printingCost: prod.printingCost || 0,
                        mountingCost: prod.mountingCost || 0,
                        latitude: prod.Latitude || prod.latitude || '',
                        longitude: prod.Longitude || prod.longitude || '',
                        LocationLink: prod.LocationLink || prod.locationLink || '',
                        isPrime: prod.isPrime || 1,
                        district: prod.location?.district || prod.district || '',
                        state: prod.location?.state || prod.state || ''
                    };

                    console.log('Mapped product:', productData.name, productData.isPrime);
                    return productData;
                }).filter(prod => prod.isPrime === 1); // Double-check filter

                console.log('Final mapped prime spots:', mappedPrimeSpots);
                setPrimeSpotsData(mappedPrimeSpots);
                setIsLoading(false);

            } catch (err) {
                console.error("Failed to fetch prime spots", err);
                setError(err.message);

                // Try fallback: fetch all products and filter locally
                try {
                    console.log('Trying fallback fetch...');
                    const fallbackResponse = await fetch(`${baseUrl}/products`);
                    if (fallbackResponse.ok) {
                        const allProducts = await fallbackResponse.json();
                        console.log('Fallback fetched products:', allProducts.length);

                        const primeProducts = allProducts.filter(p =>
                            (p.isPrime === 1) && (p.visible !== false)
                        );

                        console.log('Fallback prime products found:', primeProducts.length);

                        const mappedPrimeSpots = primeProducts.map(prod => ({
                            id: prod._id,
                            _id: prod._id,
                            name: prod.name,
                            location: prod.location ?
                                `${prod.location.district || ''}, ${prod.location.state || ''}` :
                                `${prod.district || ''}, ${prod.state || ''}`,
                            price: prod.price,
                            dimensions: `${prod.height} x ${prod.width}`,
                            height: prod.height,
                            width: prod.width,
                            rating: prod.rating,
                            imageUrl: prod.image,
                            image: prod.image,
                            mediaType: prod.mediaType,
                            category: prod.mediaType,
                            prodName: prod.name,
                            prodCode: prod.prodCode,
                            lighting: prod.lighting,
                            from: prod.from,
                            to: prod.to,
                            printingCost: prod.printingCost,
                            mountingCost: prod.mountingCost,
                            latitude: prod.Latitude,
                            longitude: prod.Longitude,
                            LocationLink: prod.LocationLink,
                            isPrime: prod.isPrime || 1,
                            district: prod.location?.district,
                            state: prod.location?.state
                        }));

                        setPrimeSpotsData(mappedPrimeSpots);
                        setPrimeCount(mappedPrimeSpots.length);
                    }
                } catch (fallbackErr) {
                    console.error('Fallback also failed:', fallbackErr);
                } finally {
                    setIsLoading(false);
                }
            }
        };

        fetchPrimeSpots();
    }, []);
    // console.log('Visibile Prime Spots: ', primeCount);
    const handleBookNow = (spot) => {
        const spotData = {
            id: spot._id || spot.id,
            prodName: spot.name || spot.prodName,
            printingCost: spot.printingCost,
            mountingCost: spot.mountingCost,
            prodCode: spot.prodCode,
            prodLighting: spot.lighting,
            productFrom: spot.from,
            productTo: spot.to,
            location: `${spot.district || ''}, ${spot.state || ''}`,
            category: spot.mediaType || spot.category,
            price: spot.price,
            sizeHeight: spot.height,
            sizeWidth: spot.width,
            rating: spot.rating,
            imageUrl: spot.image || spot.imageUrl,
            district: spot.district,
            state: spot.state,
            latitude: spot.latitude,
            longitude: spot.longitude,
            LocationLink: spot.LocationLink,
            isPrime: spot.isPrime || 1
        };

        navigate(`/Product/${spotData.id}-${slugify(spotData.prodName)}`, {
            state: { selectedSpot: spotData }
        });
    };
    

// const handleSimilarProductClick = (spot) => {
//         const mappedSpot = {
//             id: spot._id,
//             prodName: spot.name,
//             printingCost: spot.printingCost,
//             mountingCost: spot.mountingCost,
//             prodCode: spot.prodCode,
//             prodLighting: spot.lighting,
//             productFrom: spot.from,
//             productTo: spot.to,
//             productFixedAmount: spot.fixedAmount,
//             productFixedOffer: spot.fixedOffer,
//             location: `${spot.location.district}, ${spot.location.state}`,
//             category: spot.mediaType,
//             price: spot.price,
//             displayPrice: spot.price,
//             originalPrice: spot.price,
//             sizeHeight: spot.height,
//             sizeWidth: spot.width,
//             sizeSide: spot.side,
//             productsquareFeet: spot.productsquareFeet,
//             rating: spot.rating,
//             imageUrl: spot.image,
//             district: spot.location.district,
//             state: spot.location.state,
//             latitude: spot.Latitude,
//             longitude: spot.Longitude,
//             LocationLink: spot.LocationLink,
//             additionalFiles: spot.additionalFiles || [],
//             isOfferProduct: false,
//         };
//         const productSlug = `${spot._id}-${slugify(spot.name, { lower: true, strict: true })}`;
//         navigate(`/Product/${productSlug}`, { replace: true });
//         setCurrentProduct(mappedSpot);
//         setAdditionalFiles(spot.additionalFiles || []);
//         setCurrentMainImage(spot.image);
//         setCurrentPreviewType("image");
//         setCurrentVideoUrl("");
//         setSelectedFileIndex(-1);
//         setSelectedSpot(mappedSpot);
//         setSelectedDates({ start: null, end: null });
//         setCampaignConfirmedDates({ start: null, end: null });
//         setIsSelectionConfirmed(false);
//         setBookingConfirmation(null);
//         setPendingBookingAfterLogin(null);
//         setShowLoginPrompt(false);
//         localStorage.removeItem('pendingBookingAfterLogin');

//         window.scrollTo({ top: 0, behavior: "smooth" });
//     };
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
        infinite: primeSpotsData.length > 1,
        speed: 500,
        slidesToShow: Math.min(3, primeSpotsData.length),
        slidesToScroll: 1,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
        centerMode: primeSpotsData.length > 1,
        centerPadding: "0px",
        autoplay: primeSpotsData.length > 1,
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
                    slidesToShow: Math.min(3, primeSpotsData.length),
                },
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    centerPadding: "40px",
                },
            },
            {
                breakpoint: 400,
                settings: {
                    slidesToShow: 1,
                    centerPadding: "20px",
                },
            },
        ],
    };
    
//  const RatingStarsSimilar = ({ rating }) => {
//         const fullStars = Math.floor(rating);
//         const halfStar = rating % 1 !== 0;
//         const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
//         return (
//             <div className="rate rate1-book1">
//                 {[...Array(fullStars)].map((_, index) => (
//                     <span key={index} className="fa-solid fa-star stars-book1"></span>
//                 ))}
//                 {halfStar && (
//                     <span className="fa-solid fa-star-half-alt stars-book1"></span>
//                 )}
//                 {[...Array(emptyStars)].map((_, index) => (
//                     <span
//                         key={index}
//                         className="fa-solid fa-star empty-star-book1"
//                     ></span>
//                 ))}
//             </div>
//         );
//     };
    
        if (isLoading) {
        if (!timeoutRef.current) {
            timeoutRef.current = true;
            setTimeout(() => {
            setIsLoading(false);
            }, 2000);
        }

        return (
            <div className="text-center py-5">
            {/* <img src="/images/outdoor-loader.svg" alt="Loading..." style={{ width: "400px", height: "400px"}}/> */}
                   {/* skelton loader */}
                     {/* Prime Advertising Skeleton Loader */}
                    <div className="prime-skeleton-wrapper">

                    {[1, 2, 3].map((_, index) => (
                        <div className="prime-skeleton-card" key={index}>

                        {/* Image */}
                        <div className="prime-skeleton-img"></div>

                        {/* Category */}
                        {/* <span className="prime-skeleton-category"></span> */}

                        {/* Content */}
                        <div className="prime-skeleton-content">

                            {/* Title */}
                            <div className="prime-skeleton-line title"></div>

                            {/* Price & Dimension */}
                            <div className="prime-skeleton-price">
                            <div className="prime-skeleton-line price"></div>
                            {/* <div className="prime-skeleton-line size"></div> */}
                            </div>

                            {/* Rating */}
                            <div className="prime-skeleton-rating"></div>

                            {/* Buttons */}
                            <div className="prime-skeleton-btn"></div>

                        </div>
                        </div>
                    ))}

                    </div>
                    {/* skelton loaders */}
            
            </div>
        );
        }

    return (
        <div id="primeSpotsSection" style={{ scrollMarginTop: '100px' }}>  
            <h1 className="heading">
                <span className="highlight">Prime Advertising</span> Spots
                {/* <span className="prime-count-badge">
                    ({primeCount} {primeCount === 1 ? 'Spot' : 'Spots'})
                </span>
                {primeCount > 0 && (
                    <span className="prime-badge-home">
                        <i className="fa-solid fa-crown"></i> Premium Selection
                    </span>
                )} */}
            </h1>

            {/* {error && (
                <div className="text-center py-3">
                    <div className="alert alert-warning">
                        <p>Note: {error}</p>
                        {primeSpotsData.length === 0 && (
                            <p>Showing available prime spots from fallback data.</p>
                        )}
                    </div>
                </div>
            )} */}

            {primeSpotsData.length === 0 ? (
              <div className="text-center py-5">
                {/* <img src="/images/outdoor-loader.svg" alt="Loading..."  style={{ width: "400px", height: "400px"}}/> */}
                     {/* skelton loader */}
                     {/* Prime Advertising Skeleton Loader */}
                    <div className="prime-skeleton-wrapper">

                    {[1, 2, 3].map((_, index) => (
                        <div className="prime-skeleton-card" key={index}>

                        {/* Image */}
                        <div className="prime-skeleton-img"></div>

                        {/* Category */}
                        {/* <span className="prime-skeleton-category"></span> */}

                        {/* Content */}
                        <div className="prime-skeleton-content">

                            {/* Title */}
                            <div className="prime-skeleton-line title"></div>

                            {/* Price & Dimension */}
                            <div className="prime-skeleton-price">
                            <div className="prime-skeleton-line price"></div>
                            {/* <div className="prime-skeleton-line size"></div> */}
                            </div>

                            {/* Rating */}
                            <div className="prime-skeleton-rating"></div>

                            {/* Button */}
                            <div className="prime-skeleton-btn"></div>

                        </div>
                        </div>
                    ))}

                    </div>
                    {/* skelton loaders */}
              
              </div>
            ) : (
                <div className="w-3/4 prime">
                    <Slider {...settings}>
                        {primeSpotsData.map((spot, index) => (
                            <div className={`billboard-card ${primeSpotsData.length > 1 && index === Math.floor(primeSpotsData.length / 2) ? 'scaleZoomInLeft' : ''}`} key={spot.id} onClick={() => handleBookNow(spot)}>
                                <img
                                    src={spot.imageUrl || spot.image}
                                    alt={spot.name || 'Prime Spot'}
                                    className="card-img-top1-home"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = '/images/placeholder-image.jpg';
                                    }}
                                />
                                <span className='board-category1-home'>{spot.category || spot.mediaType || 'Category'}</span>
                              
                               
                                    <div className="board-content-home">
                                    <div className="board-content-top-book">
                                        <span className="board-loc-book">{spot.prodName || spot.name}</span>  
                                    </div>
                                
                                    
                                    <div className="board-content-bottom-book">
                                                                <span className="board-price-book">
                                                                  {formatIndianCurrency(spot.price, true)}
                                                                  <span className="board-price-bookPerDay">
                                                                    {" "}
                                                                    / Per Day
                                                                  </span>
                                                                </span>
                                                          
                                                                <span className="board-dim-home">{spot.dimensions} Sq.ft</span>
                                                          
                                                              </div>
                                                              <RatingStars1 rating={spot.rating} />
                                                                            <div>
                                        <button className="board-btn-book-home" onClick={() => handleBookNow(spot)}>
                                            Book Now
                                        </button>
                                    </div>
                                </div>
                                
                            </div>
                        ))}
                    </Slider>
                </div>
            )}
        </div>
    );
}

export default AdinnHome2;