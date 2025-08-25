import React, { useState, useRef, useEffect } from 'react';
import '../components/b2book.css';
import '../components/B21book.css';
import BookASite11 from './B21book';
import Calendar from './B20CalenderMain';
import './B20CalenderMain.css';
import { useNavigate } from 'react-router-dom';
import LoginPageMain from './C1LoginMain';
import OtpMain from './D1OtpMain';
import MainNavbar from './A1NAVBAR.jsx';
import MainFooter from './A1FOOTER.jsx';
//IMPORTED use context spot
import { useSpot } from "./B0SpotContext";
import { MainLayout } from './MainLayout';
import { useLogin } from './LoginContext';
import { useParams, useLocation } from "react-router-dom";
//BASE URL OF http://localhost:3001 FILE IMPORT
import { baseUrl } from '../Adminpanel/BASE_URL';
import slugify from 'slugify';

function BookASite1() {
    const { productId } = useParams(); // Get productId from URL
    const location = useLocation();
    const { user, openLogin, closeLogin } = useLogin();
    //USE CONTEXT SECTION
    const { selectedSpot, setSelectedSpot } = useSpot();
    const [similarSpots, setSimilarSpots] = useState([]);
    //const { selectedSpot } = useSpot(); // Get the current product from context
    const [originalSimilarSpots, setOriginalSimilarSpots] = useState([]);
    const [displayedSimilarSpots, setDisplayedSimilarSpots] = useState([]);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    //ADDITIONAL FILES FETCHED FROM DATABASE

    const [additionalFiles, setAdditionalFiles] = useState([]);
    const [currentMainImage, setCurrentMainImage] = useState('');
    const [currentPreviewType, setCurrentPreviewType] = useState('image'); // 'image' or 'video'
    const [currentVideoUrl, setCurrentVideoUrl] = useState('');
    const [selectedFileIndex, setSelectedFileIndex] = useState(-1); // Track selected file index

    const videoRef = useRef(null);
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                // If coming from BookASite page, use the context
                if (location.state?.selectedSpot) {
                    setCurrentProduct(location.state?.selectedSpot);
                    fetchSimilarProducts(location.state?.selectedSpot.prodCode);
                    //ADDITIONAL FILES FETCHED FROM DATABASE
                    setAdditionalFiles(location.state?.selectedSpot.additionalFiles || []);
                    setCurrentMainImage(location.state?.selectedSpot.imageUrl);
                    setSelectedFileIndex(-1);
                    setIsLoading(false);
                    return;
                }
                // If accessed via direct URL, fetch the product
                if (productId) {


                    // Extract the actual ID from the URL (remove the slug part)
                    const actualId = productId.split('-')[0];
                    const response = await fetch(`${baseUrl}/products/${actualId}`);
                    const data = await response.json();


                    if (response.ok) {
                        const mappedSpot = {
                            id: data._id,
                            prodName: data.name,
                            printingCost: data.printingCost,
                            mountingCost: data.mountingCost,
                            prodCode: data.prodCode,
                            prodLighting: data.lighting,
                            productFrom: data.from,
                            productTo: data.to,
                            productFixedAmount: data.fixedAmount,
                            productFixedOffer: data.fixedOffer,
                            location: `${data.location.district}, ${data.location.state}`,
                            category: data.mediaType,
                            price: data.price,
                            sizeHeight: data.height,
                            sizeWidth: data.width,
                            rating: data.rating,
                            imageUrl: data.image,
                            district: data.location.district,
                            state: data.location.state,
                            latitude: data.Latitude,
                            longitude: data.Longitude,
                            LocationLink: data.LocationLink,
                            additionalFiles: data.additionalFiles || []
                        };
                        setCurrentProduct(mappedSpot);
                        setSelectedSpot(mappedSpot); // Update context as well
                        fetchSimilarProducts(data.prodCode);
                        //ADDITIONAL FILES FETCHED FROM DATABASE
                        setAdditionalFiles(data.additionalFiles || []);
                        setCurrentMainImage(data.image);
                        setSelectedFileIndex(-1); // Reset selected file index

                    }
                    else {
                        console.error("Product not found");
                    }
                    setIsLoading(false);
                }
            } catch (error) {
                console.error("Error fetching product:", error);
                setIsLoading(false);
            }
        };
        fetchProduct();
    }, [productId, location.state]);

    // Navbar js
    const fetchSimilarProducts = async (prodCode) => {
        try {
            const response = await fetch(
                `${baseUrl}/products/similar/${prodCode}`
            );
            const data = await response.json();
            if (response.ok) {
                setOriginalSimilarSpots(data);
                setDisplayedSimilarSpots(data);
            } else {
                console.log("No similar products found");
                setOriginalSimilarSpots([]);
                setDisplayedSimilarSpots([]);
            }
        } catch (error) {
            console.error("Error fetching similar products:", error);
            setOriginalSimilarSpots([]);
            setDisplayedSimilarSpots([]);
        }
    };

    const handleSimilarProductClick = (spot) => {
        const mappedSpot = {
            id: spot._id,
            prodName: spot.name,
            printingCost: spot.printingCost,
            mountingCost: spot.mountingCost,
            prodCode: spot.prodCode,
            prodLighting: spot.prodLighting,
            productFrom: spot.productFrom,
            productTo: spot.productTo,
            productFixedAmount: spot.productFixedAmount,
            productFixedOffer: spot.productFixedOffer,
            location: spot.location,
            category: spot.category,
            price: spot.price,
            sizeHeight: spot.sizeHeight,
            sizeWidth: spot.sizeWidth,
            rating: spot.rating,
            imageUrl: spot.image,
            district: spot.location.district,
            state: spot.location.state,
            latitude: spot.latitude,
            longitude: spot.longitude,
            LocationLink: spot.LocationLink,
            additionalFiles: spot.additionalFiles || []
        };
        // Generate URL-friendly slug
        const productSlug = `${spot._id}-${slugify(spot.name, { lower: true, strict: true })}`;
        // Update URL without page reload
        navigate(`/Product/${productSlug}`, { replace: true });
        setCurrentProduct(mappedSpot);
        setSelectedSpot(mappedSpot);
        //ADDITIONAL FILES FETCHED FROM DATABASE
        setAdditionalFiles(spot.additionalFiles || []);
        setCurrentMainImage(spot.image);
        setCurrentPreviewType('image');
        setCurrentVideoUrl('');
        setSelectedFileIndex(-1);
        // Don't fetch similar products again here - keep the original list
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    const [isMenuOpen, setMenuOpen] = useState(false);
    const toggleMenu = () => {
        setMenuOpen(!isMenuOpen);
    };
    //Nav_user toggle section
    const [isOpen, setIsOpen] = useState(false);
    const toggleNavOpen = () => {
        setIsOpen(!isOpen);
    };
    //If i click the orders, signup or login then go the login page
    const navigate = useNavigate();
    //Image change
    // const imgRef = useRef(null); // Reference to the image element
    // const handleImageChange = (image) => {
    //     // Switch statement to set image based on color
    //     switch (image) {
    //         case 'image1':
    //             imgRef.current.src = "/images/spot1.png";
    //             break;
    //         case 'image2':
    //             imgRef.current.src = "/images/spot2.png";
    //             break;
    //         case 'image3':
    //             imgRef.current.src = "/images/spot3.png";
    //             break;
    //         default:
    //             imgRef.current.src = "/images/spot1.png"; // Default image
    //     }
    // };


    // Handle image change for thumbnails

    const handleImageChange = (file, index) => {
        if (file.type === 'video' || (file.url && file.url.match(/\.(mp4|mov|avi|mkv)$/i))) {
            // For videos, we'll show a thumbnail or the first frame if available
            // You might want to implement a video player modal instead
            console.log("Video selected:", file.url);
            // For videos, set video mode
            setCurrentPreviewType('video');
            setCurrentVideoUrl(file.url);
            setSelectedFileIndex(index);

            // Optionally open a modal to play the video
        } else {
            // For images, update the main image
            setCurrentPreviewType('image');
            setCurrentMainImage(file.url);
            setCurrentVideoUrl('');
            setSelectedFileIndex(index);
        }
    };


    // Handle main product image click to reset to original
    const handleMainImageClick = () => {
        if (currentProduct && currentProduct.imageUrl) {
            setCurrentMainImage(currentProduct.imageUrl);
            setCurrentPreviewType('image');
            setCurrentVideoUrl('');
            setSelectedFileIndex(-1); // Reset to main image
        }
    };

    // Check if a file is currently selected
    const isFileSelected = (index) => {
        return selectedFileIndex === index;
    };

    // Check if main image is selected
    const isMainImageSelected = () => {
        return selectedFileIndex === -1;
    };

    //Start rating board
    const RatingStars = ({ rating }) => {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 !== 0;
        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
        return (
            <span className=' rate rating-star'>
                {[...Array(fullStars)].map((_, index) => (
                    <span key={index} className="fa-solid fa-star stars1"></span>
                ))}
                {halfStar && <span className="fa-solid fa-star-half-alt stars1"></span>}
                {[...Array(emptyStars)].map((_, index) => (
                    <span key={index} className="fa-solid fa-star empty-star1 stars1"></span>
                ))}
            </span>
        );
    };

    //CALENDER SECTION  
    // Replace hardcoded bookedDates with fetched data
    const [bookedDates, setBookedDates] = useState([]);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false); // State to toggle calendar
    // const [currentMonth, setCurrentMonth] = useState(new Date(2025, 2)); // Start with March 2025
    const today = new Date();
    const [currentMonth, setCurrentMonth] = useState(new Date()); // Start with March 2025


    // const [isCalendarOpen, setIsCalendarOpen] = useState(false); // State to toggle calendar
    const [isLoginOpen, setIsLoginOpen] = useState(false); // State to toggle Login
    const [isOtpMainOpen, setIsOtpMainOpen] = useState(false); // State to toggle Verify OTP page


    // Add date validation for past dates
    const isPastDate = (date) => {
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);
        const normalizedDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
        return normalizedDate < today;
    };
    // Campaign Date Selection
    const [selectedDates, setSelectedDates] = useState({ start: null, end: null });
    const [confirmedDates, setConfirmedDates] = useState({}); // To store confirmed dates
    console.log(selectedDates);
    console.log("NEW SELECTED START DATE", selectedDates.start);
    // console.log(" SELECTED START DATE" , selectedDates.start.toISOString());
    const formattedStartDate = selectedDates.start; // Stores full date in ISO format
    const formattedEndDate = selectedDates.end;
    console.log("NEW START DATE", formattedStartDate);
    console.log("NEW  END DATE", formattedEndDate);
    const generateMonth = (monthDate) => {
        const year = monthDate.getFullYear();
        const month = monthDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startDay = firstDay.getDay();
        const days = [];
        // Fill empty days
        for (let i = 0; i < startDay; i++) {
            days.push(null);
        }


        // Fill actual days
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            days.push(date);
        }
        // Fill remaining days
        while (days.length < 42) days.push(null);
        return days;
    };
    const handleDateClick = (date) => {
        if (!date || isNaN(date.getTime())) return;
        //Create date without time component
        const normalizedDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
        // Check if date is booked or in the past
        const isBooked = bookedDates.some(d =>
            d.getUTCFullYear() === normalizedDate.getUTCFullYear() &&
            d.getUTCMonth() === normalizedDate.getUTCMonth() &&
            d.getUTCDate() === normalizedDate.getUTCDate()
        );
        const isPast = isPastDate(normalizedDate);
        if (isBooked || isPast) return;
        if (bookedDates.some(d =>
            d.getUTCFullYear() === normalizedDate.getUTCFullYear() &&
            d.getUTCMonth() === normalizedDate.getUTCMonth() &&
            d.getUTCDate() === normalizedDate.getUTCDate()
        )) return;


        if (!selectedDates.start || selectedDates.end) {
            setSelectedDates({ start: normalizedDate, end: null });
        } else {
            if (normalizedDate < selectedDates.start) {
                setSelectedDates({ start: normalizedDate, end: selectedDates.start });
            } else {
                setSelectedDates({ start: selectedDates.start, end: normalizedDate });
            }
        }
    };
    const resetDates = () => {
        setSelectedDates({ start: null, end: null });
        setConfirmedDates({ start: null, end: null }); // Reset confirmed dates
    };
    // UPDATED DATE CLASS CALCULATION
    const getDateSelectionClass = (date) => {
        if (!date || isNaN(date.getTime())) return "disabled";
        const normalizedDate = new Date(Date.UTC(
            date.getFullYear(),
            date.getMonth(),
            date.getDate()
        ));
        // Check if date is booked
        const isBooked = bookedDates.some(d =>
            d.getUTCFullYear() === normalizedDate.getUTCFullYear() &&
            d.getUTCMonth() === normalizedDate.getUTCMonth() &&
            d.getUTCDate() === normalizedDate.getUTCDate()
        );

        if (isBooked) return "booked";
        if (isPastDate(normalizedDate)) return "past";
        const dateString = date.toISOString().split('T')[0];
        const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
        const startUTC = selectedDates.start ? new Date(Date.UTC(
            selectedDates.start.getFullYear(),
            selectedDates.start.getMonth(),
            selectedDates.start.getDate()
        )) : null;
        const endUTC = selectedDates.end ? new Date(Date.UTC(
            selectedDates.end.getFullYear(),
            selectedDates.end.getMonth(),
            selectedDates.end.getDate()
        )) : null;

        if (bookedDates.some(d =>
            d.getUTCFullYear() === utcDate.getUTCFullYear() &&
            d.getUTCMonth() === utcDate.getUTCMonth() &&
            d.getUTCDate() === utcDate.getUTCDate()
        )) return "booked";
        if (startUTC && utcDate.getTime() === startUTC.getTime()) return "selected-start";
        if (endUTC && utcDate.getTime() === endUTC.getTime()) return "selected-end";
        if (startUTC && endUTC && utcDate > startUTC && utcDate < endUTC) {
            return "selected-range";
        }
        return "";
    };

    const goToNextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
    };
    const goToPreviousMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
    };
    const [productsOrderData, setProductsOrderData] = useState([]);
    useEffect(() => {
        const fetchBookedDates = async () => {
            const res = await fetch(`${baseUrl}/booked-dates`);
            const dates = await res.json();
            setBookedDates(dates.map(d => new Date(d)));
        };
        fetchBookedDates();
    }, [productsOrderData]); // Refresh when orders change

    const toggleCalendar = () => {
        setIsCalendarOpen(!isCalendarOpen);
    };
    const closeCalendar = () => {
        setIsCalendarOpen(false);
    };
    //Toggle LoginPage
    const toggleLoginPage = () => {
        setIsLoginOpen(!isLoginOpen);
    };
    const closeLoginPage = () => {
        setIsLoginOpen(false);
    };
    //Toggle OtpMainPage
    const toggleOtpMainPage = () => {
        setIsOtpMainOpen(!isOtpMainOpen);
    };
    const closeOtpMainPage = () => {
        setIsOtpMainOpen(false);
    };
    // //USE CONTEXT SECTION
    // const { selectedSpot } = useSpot();
    if (isLoading) {
        return (
            <MainLayout>
                <div className="container text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </MainLayout>
        );
    }
    // ADD TO CART BUTTON
    const handleAddToCart = async () => {
        if (!user) {
            openLogin();
            alert("Please login to add items to cart");
            return;
        }
        if (!confirmedDates.start || !confirmedDates.end) {
            alert("Please Confirm start and end dates before proceeding.");
            return;
        }
        // Proceed with adding to cart
        console.log("Dates confirmed! Adding to cart...");
        const cartItem = {
            userId: user._id,
            productId: currentProduct.id,
            prodCode: currentProduct.prodCode,
            image: currentProduct.imageUrl,
            prodName: currentProduct.prodName,
            title: currentProduct.location,
            price: currentProduct.price,
            rating: currentProduct.rating,
            district: currentProduct.district,
            state: currentProduct.state,
            dateRange: selectedDates.start
                ? `${selectedDates.start.toLocaleString("en-US", { month: "short" })} ${selectedDates.start.getDate()} - ${selectedDates.end
                    ? `${selectedDates.end.toLocaleString("en-US", { month: "short" })} ${selectedDates.end.getDate()}`
                    : "--"
                }`
                : "N/A",
            startDate: selectedDates.start?.toISOString(),
            endDate: selectedDates.end?.toISOString(),
            sizeWidth: currentProduct.sizeWidth,
            sizeHeight: currentProduct.sizeHeight,
            dimension: currentProduct.sizeHeight * currentProduct.sizeWidth,
            adType: currentProduct.category,
            totalAmount: totalPrice.toLocaleString(),
            totalDays: totalDays,
            SpotOutdoorType: currentProduct.prodLighting,
            PrintingCost: currentProduct.printingCost,
            MountingCost: currentProduct.mountingCost,
            FromSpot: currentProduct.productFrom,
            ToSpot: currentProduct.productTo,
            SpotPay: currentProduct.productFixedAmount,
            Offer: currentProduct.productFixedOffer,
            latitude: currentProduct.latitude,
            longitude: currentProduct.longitude,
            LocationLink: currentProduct.LocationLink,
            userEmail: user.email,
            userPhone: user.phone,
            userName: user.userName,
        };

        try {
            const response = await fetch(`${baseUrl}/cart`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(cartItem)
            });
            if (!response.ok) {
                throw new Error('Failed to add to cart');
            }
            alert("Item added to cart successfully!");
            navigate("/cart");
        } catch (error) {
            console.error('Error adding to cart:', error);
            alert("Failed to add item to cart. Please try again.");
        }
    };
    // RESERVE NOW BUTTON
    const handleReserveNow = () => {
        if (!user) {
            openLogin();
            alert("Please login to reserve this spot");
            return;
        }
        if (!confirmedDates.start || !confirmedDates.end) {
            alert("Please select & Confirm the Start and End dates to Proceed.");
            return;
        }
        // Proceed with adding to cart
        console.log("Dates confirmed! Adding to Reserve...");
        // Create dates in UTC to avoid timezone issues
        const startDate = new Date(Date.UTC(
            confirmedDates.start.getFullYear(),
            confirmedDates.start.getMonth(),
            confirmedDates.start.getDate()
        ));
        const endDate = new Date(Date.UTC(
            confirmedDates.end.getFullYear(),
            confirmedDates.end.getMonth(),
            confirmedDates.end.getDate()
        ));


        // Calculate total days and price
        const timeDiff = endDate.getTime() - startDate.getTime();
        const reserveItem = {
            id: currentProduct.id,
            prodCode: currentProduct.prodCode,
            image: currentProduct.imageUrl,
            prodName: currentProduct.prodName,
            title: currentProduct.location,
            price: currentProduct.price,
            rating: currentProduct.rating,
            district: currentProduct.district,
            state: currentProduct.state,
            dateRange: selectedDates.start
                ? `${selectedDates.start.toLocaleString("en-US", { month: "short" })} ${selectedDates.start.getDate()} - ${selectedDates.end
                    ? `${selectedDates.end.toLocaleString("en-US", { month: "short" })} ${selectedDates.end.getDate()}`
                    : "--"
                }`
                : "N/A",
            startDate: selectedDates.start,
            endDate: selectedDates.end,
            sizeWidth: currentProduct.sizeWidth,
            sizeHeight: currentProduct.sizeHeight,
            dimension: currentProduct.sizeHeight * currentProduct.sizeWidth,
            adType: currentProduct.category,
            totalAmount: totalPrice.toLocaleString(),
            totalDays: totalDays,
            SpotOutdoorType: currentProduct.prodLighting,
            PrintingCost: currentProduct.printingCost,
            MountingCost: currentProduct.mountingCost,
            FromSpot: currentProduct.productFrom,
            ToSpot: currentProduct.productTo,
            SpotPay: currentProduct.productFixedAmount,
            Offer: currentProduct.productFixedOffer,
            latitude: currentProduct.latitude,
            longitude: currentProduct.longitude,
            LocationLink: currentProduct.LocationLink,


            // ... existing reserveItem properties
            userId: user._id, // Add user ID to the reservation
            userEmail: user.email,
            userPhone: user.phone,
            userName: user.userName
        };
        console.log("START DATE", reserveItem.startDate);
        // Redirect to Cart Page
        navigate("/billing", { state: { reserveItem } });
    };
    // Calculate total price dynamically when start and end dates are selected
    const pricePerDay = currentProduct?.price || 0; // Ensure pricePerDay is defined
    const getAvailableDaysInRange = (start, end) => {
        if (!start || !end || isNaN(start.getTime()) || isNaN(end.getTime())) {
            return [];
        }
        const days = [];
        const current = new Date(start);
        // Normalize to UTC midnight for accurate comparison
        const normalizeDate = (date) => {
            return Date.UTC(
                date.getFullYear(),
                date.getMonth(),
                date.getDate()
            );
        };


        // Create Set of booked dates in UTC
        const bookedUTCDates = new Set(
            bookedDates.map(d => normalizeDate(d))
        );
        while (current <= end) {
            // Check if current date is not booked
            const currentUTC = normalizeDate(current);
            if (!bookedUTCDates.has(currentUTC)) {
                days.push(new Date(current));
            }
            current.setDate(current.getDate() + 1);
        }


        return days;
    };
    const availableDays =
        selectedDates.start && selectedDates.end
            ? getAvailableDaysInRange(selectedDates.start, selectedDates.end)
            : [];
    const totalDays = availableDays.length;
    const totalPrice = totalDays * pricePerDay;
    console.log(totalPrice);
    console.log(totalDays);
    const confirmDates = () => {
        if (selectedDates.start && selectedDates.end && totalPrice > 0) {
            setConfirmedDates({ start: selectedDates.start, end: selectedDates.end });
            setIsCalendarOpen(false); // Close only if all conditions are met
        } else {
            alert("Please select & Confirm the Start and End dates to Proceed.");
        }
    };
    const RatingStarsSimilar = ({ rating }) => {
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
    return (
        <MainLayout>
            <div>
                {/* </div> */}
                <MainNavbar />
                {/* <div className={`calendar-wrapper ${isCalendarOpen ? "calendar-open" : ""}`}> */}
                <div className={`calendar-wrapper login-wrapper otp-wrapper ${isCalendarOpen ? "calendar-open" : ""} ${isLoginOpen ? "login-open" : ""} ${isOtpMainOpen ? "otp-main-open" : ""} `}>
                    {/* Image with details section  */}
                    <div className="container-fluid mt-5  Book-section " id="similarProdDetailsShows">
                        <div className="row BookMain ">
                            <div className="col-md-6 col-lg-6 Book-content1">
                                <div className="row bookContentRow1">
                                    <div className='bookContentRow2' style={{ display: 'flex', }}>
                                        <div className='book-images-section'>
                                            {/* <div className='book-images'>
                                                <img src="/images/spot1.png" className="img-fluid book-img11" alt="Small image1" onClick={() => handleImageChange('image1')} />
                                            </div>
                                            <div className='book-images'>
                                                <img src="/images/spot2.png" className="img-fluid book-img21 " alt="Small image 1" onClick={() => handleImageChange('image2')} />
                                            </div>
                                            <div className='book-images'>
                                                <img src="/images/spot3.png" className="img-fluid book-img31" alt="Small image 1" onClick={() => handleImageChange('image3')} />
                                            </div> */}
                                            {/* Additional files thumbnails */}
                                            {additionalFiles.map((file, index) => (
                                                <div
                                                    key={index}
                                                    className={`book-images ${isFileSelected(index) ? 'selected' : ''}`}
                                                    onClick={() => handleImageChange(file, index)} style={{ cursor: 'pointer' }}
                                                >
                                                    {file.type === 'video' || (file.url && file.url.match(/\.(mp4|mov|avi|mkv)$/i)) ? (

                                                        <div className="video-thumbnail-wrapper">
                                                            <video className='book-img11'
                                                                muted
                                                                preload="metadata"
                                                                onLoadedData={(e) => {
                                                                    // Seek to a middle frame for better thumbnail
                                                                    if (e.target.duration) {
                                                                        e.target.currentTime = e.target.duration / 2;
                                                                    }
                                                                }}
                                                            >
                                                                <source src={file.url} type="video/mp4" />
                                                            </video>
                                                            <div className="video-play-icon">▶</div>
                                                        </div>
                                                    )
                                                        : (
                                                            <img
                                                                src={file.url}
                                                                className="img-fluid book-img11"
                                                                alt={`Additional ${index + 1}`}
                                                                style={{
                                                                    width: '100%',
                                                                    height: '100%',
                                                                    objectFit: 'cover',
                                                                    //border: isFileSelected(index) ? '2px solid #007bff' : 'none'
                                                                    // border: currentPreviewType === 'image' && currentMainImage === file.url ? '2px solid #007bff' : 'none'
                                                                }}
                                                            />
                                                        )}
                                                </div>
                                            ))}
                                        </div>
                                        <div className='book-mainImage'>
                                            {/* <img src={currentProduct.imageUrl} ref={imgRef} className="img-fluid book-mainImg1" alt="Large image" /> */}
                                            {currentPreviewType === 'video' ? (
                                                <video className='book-mainImg1'
                                                    ref={videoRef}
                                                    key={currentVideoUrl} // Add key to force re-render
                                                    controls
                                                    autoPlay
                                                >
                                                    <source src={currentVideoUrl} type="video/mp4" />
                                                    Your browser does not support the video tag.
                                                </video>
                                            ) : (
                                                <img
                                                    src={currentMainImage || currentProduct?.imageUrl}
                                                    className="img-fluid book-mainImg1"
                                                    alt="Large image"
                                                    onClick={handleMainImageClick}
                                                />
                                            )}

                                        </div>
                                    </div>
                                </div>
                            </div>
                            {currentProduct ? (
                                <div className="col-md-6 col-lg-6 Book-content2"  >
                                    <p className='book-sideHeading'>{currentProduct.prodName}</p>
                                    <p className='book-size'>Size: {currentProduct.sizeWidth} x {currentProduct.sizeHeight}<span className='slash-bar'>|</span>{currentProduct.sizeHeight * currentProduct.sizeWidth} Sq.ft</p>
                                    <span className="btn-type">{currentProduct.category}</span>
                                    <span className="badge book-type">{currentProduct.prodLighting}</span>
                                    <span className='star-main'>
                                        <span><img src='/images/rating_board.png' className='rate-board1'></img></span>
                                        <span><RatingStars rating={currentProduct.rating} /> </span>
                                    </span>
                                    <span className='productLocationImg'>
                                        <a href={currentProduct.LocationLink} target='_blank'> <i class="fa-solid fa-location-dot" /></a>
                                    </span>
                                    <div className="book-price my-3">Printing Cost<span className='cost-gap'>: ₹ {currentProduct.printingCost.toLocaleString()}</span> <span className='slash-bar1'>|</span> Mounting Cost<span className='cost-gap'>: ₹ {currentProduct.mountingCost.toLocaleString()}</span></div>
                                    <div className='book-spot mt-3'>{currentProduct.productFrom} <span><img src='/images/Location_arrow.png' className='location-arrow'></img>  </span> {currentProduct.productTo}</div>
                                    <div className='book-rate'>
                                        <div className='book-rateContent1'>
                                            <span className='rate-perDay'>₹ {currentProduct.price.toLocaleString()} <span className='rate-perDay1'>Per Day</span></span><br></br>
                                            <a href="#Terms" className='book-condition anchor'>Terms & Condition</a>
                                        </div>


                                        <div className='book-rateContent2'>
                                            <button className=" book-date" onClick={toggleCalendar}>Select date
                                                <span><img src='/images/calender_icon.png' className='calender'></img></span>
                                            </button>


                                        </div>
                                    </div>
                                    <span className="me-2 payOffer">Pay {currentProduct.productFixedAmount} and Get {currentProduct.productFixedOffer}% Off <span className='refund'>100% Refundable</span></span><br></br>
                                    <button className="me-4 btn-pay" onClick={handleReserveNow} >Reserve Now</button>
                                    <button className="btn-cart" onClick={handleAddToCart}>Add to Cart</button><br></br>
                                    <button className=" mt-3 mb-2 btn-enquire" onClick={toggleOtpMainPage}>Enquire Now</button><br></br>
                                </div>


                            ) : (
                                <p>No spot selected. Please go back and select a spot.</p>
                            )}
                            {/* ))} */}

                            {/* Calender section Selected dates  */}
                            {isCalendarOpen && (
                                <div className="calendar-overlay">
                                    <div className='calendar-scroll'>
                                        <Calendar toggleCalendar={toggleCalendar} closeCalendar={closeCalendar} selectedDates={selectedDates} setSelectedDates={setSelectedDates} generateMonth={generateMonth} handleDateClick={handleDateClick} resetDates={resetDates} getDateSelectionClass={getDateSelectionClass} goToNextMonth={goToNextMonth} goToPreviousMonth={goToPreviousMonth} bookedDates={bookedDates} currentMonth={currentMonth} setCurrentMonth={setCurrentMonth} selectedSpotPrice={selectedSpot.price} confirmedDates={confirmedDates} setConfirmedDates={setConfirmedDates} pricePerDay={pricePerDay} confirmDates={confirmDates} totalDays={totalDays} totalPrice={totalPrice} />
                                    </div>
                                </div>
                            )}
                            {/* Login Page open  */}
                            {
                                isLoginOpen && (
                                    <div className="login-overlay">
                                        <LoginPageMain toggleLoginPage={toggleLoginPage} closeLoginPage={closeLoginPage} />
                                    </div>
                                )
                            }
                            {/* Login Page open  */}
                            {
                                isOtpMainOpen && (
                                    <div className="otp-overlay">
                                        <OtpMain
                                            toggleOtpMainPage={toggleOtpMainPage}
                                            closeOtpMainPage={closeOtpMainPage}
                                            productData={currentProduct} // Pass the current product details
                                        />
                                    </div>)}
                        </div>
                    </div>
                    <div id='Terms'>
                        {/* <BookASite11 /> */}
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
                                        {displayedSimilarSpots.length > 0 ? (
                                            displayedSimilarSpots.map(
                                                (spot) => (
                                                    <div className="col-lg-3 col-md-3 col-sm-12 mb-4 " key={spot._id} >
                                                        <div className="card board1-book1" >
                                                            <img src={spot.image} alt={spot.location} className="card-img-top-book1" />
                                                            <span className='board-category-book1'>{spot.category}</span>
                                                            <div className="board-content-book1 ">
                                                                <div className='board-content-top-book1'>
                                                                    <span className="card-title board-loc-book1">{spot.name}</span>
                                                                    <span className="board-dim-book1">{spot.dimensions}</span>
                                                                </div>
                                                                <div className='board-content-bottom-book1'>
                                                                    <span className="board-price-book1">₹{spot.price.toLocaleString()}</span>
                                                                    <img src='/images/rating_board.png' className='rate-board-book1'></img>
                                                                </div>
                                                                <RatingStarsSimilar rating={spot.rating} />
                                                                <button className="board-btn-book1"
                                                                    onClick={() => handleSimilarProductClick(spot)} >
                                                                    Book Now
                                                                </button>
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
                    </div>
                </div>
                <MainFooter />
            </div>
        </MainLayout>
    )
}
export default BookASite1;