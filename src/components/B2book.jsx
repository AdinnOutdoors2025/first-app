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
import { formatIndianCurrency } from './FORMATED_AMOUNT';
import NavbarWrapper from './NavbarWrapper.jsx';


function BookASite1() {
    const { productId } = useParams(); // Get productId from URL
    const location = useLocation();
    const { user, openLogin, closeLogin } = useLogin();
    //USE CONTEXT SECTION
    const { selectedSpot, setSelectedSpot } = useSpot();
    const [similarSpots, setSimilarSpots] = useState([]);
    const [originalSimilarSpots, setOriginalSimilarSpots] = useState([]);
    const [displayedSimilarSpots, setDisplayedSimilarSpots] = useState([]);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [additionalFiles, setAdditionalFiles] = useState([]);
    const [currentMainImage, setCurrentMainImage] = useState('');
    const [currentPreviewType, setCurrentPreviewType] = useState('image'); // 'image' or 'video'
    const [currentVideoUrl, setCurrentVideoUrl] = useState('');
    const [selectedFileIndex, setSelectedFileIndex] = useState(-1); // Track selected file index

    // NEW STATE FOR CALENDAR ERROR MESSAGE
    const [calendarErrorMessage, setCalendarErrorMessage] = useState('');

    const videoRef = useRef(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setIsLoading(true);

                // If coming from Deal of Day page with offer product
                if (location.state?.isOfferProduct && location.state?.selectedSpot) {
                    const offerSpot = location.state.selectedSpot;

                    // Create a merged product object with offer details
                    const mergedProduct = {
                        ...offerSpot,
                        // Use offer price for display but keep original price for comparison
                        displayPrice: offerSpot.price || offerSpot.offerPrice, // Use the offer price
                        originalPrice: offerSpot.originalPrice || offerSpot.price, // Original price for comparison
                        isOfferProduct: true
                    };

                    setCurrentProduct(mergedProduct);
                    fetchSimilarProducts(offerSpot.prodCode);
                    setAdditionalFiles(offerSpot.additionalFiles || []);
                    setCurrentMainImage(offerSpot.imageUrl || offerSpot.image);
                    setSelectedFileIndex(-1);
                    setSelectedSpot(mergedProduct);
                    setIsLoading(false);
                    return;
                }

                // If coming from BookASite page, use the context
                if (location.state?.selectedSpot) {
                    setCurrentProduct(location.state.selectedSpot);
                    fetchSimilarProducts(location.state.selectedSpot.prodCode);
                    setAdditionalFiles(location.state.selectedSpot.additionalFiles || []);
                    setCurrentMainImage(location.state.selectedSpot.imageUrl);
                    setSelectedFileIndex(-1);
                    setIsLoading(false);
                    return;
                }

                // If accessed via direct URL, fetch the product
                if (productId) {
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
                            displayPrice: data.price, // Regular price for regular products
                            originalPrice: data.price,
                            sizeHeight: data.height,
                            sizeWidth: data.width,
                            sizeSide: data.side,
                            productsquareFeet: data.productsquareFeet,

                            rating: data.rating,
                            imageUrl: data.image,
                            district: data.location.district,
                            state: data.location.state,
                            latitude: data.Latitude,
                            longitude: data.Longitude,
                            LocationLink: data.LocationLink,
                            additionalFiles: data.additionalFiles || [],
                            isOfferProduct: false
                        };
                        setCurrentProduct(mappedSpot);
                        setAdditionalFiles(data.additionalFiles || []);
                        setCurrentMainImage(data.image);
                        setSelectedSpot(mappedSpot);
                        setSelectedFileIndex(-1);
                        fetchSimilarProducts(data.prodCode);
                    } else {
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
            prodLighting: spot.lighting,
            productFrom: spot.from,
            productTo: spot.to,
            productFixedAmount: spot.fixedAmount,
            productFixedOffer: spot.fixedOffer,
            location: `${spot.location.district}, ${spot.location.state}`,
            category: spot.mediaType,
            price: spot.price,
            displayPrice: spot.price,
            originalPrice: spot.price,
            sizeHeight: spot.height,
            sizeWidth: spot.width,
            sizeSide: spot.side,
            productsquareFeet: spot.productsquareFeet,
            rating: spot.rating,
            imageUrl: spot.image,
            district: spot.location.district,
            state: spot.location.state,
            latitude: spot.Latitude,
            longitude: spot.Longitude,
            LocationLink: spot.LocationLink,
            additionalFiles: spot.additionalFiles || [],
            isOfferProduct: false
        };
        // Generate URL-friendly slug
        const productSlug = `${spot._id}-${slugify(spot.name, { lower: true, strict: true })}`;
        // Update URL without page reload
        navigate(`/Product/${productSlug}`, { replace: true });
        setCurrentProduct(mappedSpot);
        setAdditionalFiles(spot.additionalFiles || []);
        setCurrentMainImage(spot.image);
        setCurrentPreviewType('image');
        setCurrentVideoUrl('');
        setSelectedFileIndex(-1);
        setSelectedSpot(mappedSpot);


        // Reset calendar dates when switching products
        setSelectedDates({ start: null, end: null });
        setConfirmedDates({ start: null, end: null });
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

    const navigate = useNavigate();

    // Handle image change for thumbnails
    const handleImageChange = (file, index) => {
        if (file.type === 'video' || (file.url && file.url.match(/\.(mp4|mov|avi|mkv)$/i))) {
            setCurrentPreviewType('video');
            setCurrentVideoUrl(file.url);
            setSelectedFileIndex(index);
        }
        else {
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
            setSelectedFileIndex(-1);
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
    const [bookedDates, setBookedDates] = useState([]);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const today = new Date();
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isOtpMainOpen, setIsOtpMainOpen] = useState(false);

    // Add date validation for past dates
    const isPastDate = (date) => {
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);
        const normalizedDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
        return normalizedDate < today;
    };

    // Campaign Date Selection
    const [selectedDates, setSelectedDates] = useState({ start: null, end: null });
    const [confirmedDates, setConfirmedDates] = useState({});

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

        // Create date without time component
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
        setConfirmedDates({ start: null, end: null });
    };

    // // UPDATED DATE CLASS CALCULATION  
    const getDateSelectionClass = (date) => {
        if (!date || isNaN(date.getTime())) return "disabled";
        const normalizedDate = new Date(Date.UTC(
            date.getFullYear(),
            date.getMonth(),
            date.getDate()
        ));

        // Check if date is booked for this specific product
        const isBooked = bookedDates.some(d => {
            const bookedDate = new Date(d);
            return (
                bookedDate.getUTCFullYear() === normalizedDate.getUTCFullYear() &&
                bookedDate.getUTCMonth() === normalizedDate.getUTCMonth() &&
                bookedDate.getUTCDate() === normalizedDate.getUTCDate()
            );
        });

        if (isBooked) return "booked";
        if (isPastDate(normalizedDate)) return "past";

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
            if (currentProduct?.prodCode) {
                try {
                    const res = await fetch(`${baseUrl}/booked-dates/${currentProduct.prodCode}`);
                    const dates = await res.json();
                    setBookedDates(dates.map(d => new Date(d)));
                } catch (error) {
                    console.error("Error fetching booked dates:", error);
                    setBookedDates([]);
                }
            }
        };

        if (currentProduct) {
            fetchBookedDates();
        }
    }, [currentProduct, productsOrderData]);


    // MODIFIED: Updated toggleCalendar to accept error message
    const toggleCalendar = (errorMessage = '') => {
        setIsCalendarOpen(!isCalendarOpen);
        setCalendarErrorMessage(errorMessage);
    };

    const closeCalendar = () => {
        setIsCalendarOpen(false);
        setCalendarErrorMessage(''); // Clear error message when closing calendar
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

    // Calculate total price dynamically when start and end dates are selected
    // Use safe access to currentProduct properties
    const pricePerDay = currentProduct?.displayPrice || currentProduct?.price || 0;

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

    const confirmDates = () => {
        if (selectedDates.start && selectedDates.end && totalPrice > 0) {
            setConfirmedDates({ start: selectedDates.start, end: selectedDates.end });
            setCalendarErrorMessage(''); // Clear error message when dates are confirmed
            setIsCalendarOpen(false);
        } else {
            setCalendarErrorMessage("Please select & Confirm the Start and End dates to Proceed.");
        }
    };

    // MODIFIED: Updated handleAddToCart to show calendar with error message
    const handleAddToCart = async () => {
        if (!user) {
            openLogin();
            return;
        }
        if (!confirmedDates.start || !confirmedDates.end) {
            // Instead of alert, open calendar with error message
            setCalendarErrorMessage("Please select & Confirm the Start and End dates to Proceed.");
            setIsCalendarOpen(true);
            return;
        }

        // Use display price for offer products, regular price for others
        const actualPrice = currentProduct?.displayPrice || currentProduct?.price || 0;

        const cartItem = {
            userId: user._id,
            productId: currentProduct?.id,
            prodCode: currentProduct?.prodCode,
            image: currentProduct?.imageUrl,
            prodName: currentProduct?.prodName,
            title: currentProduct?.location,
            price: actualPrice, // Use the correct price (offer or regular)
            rating: currentProduct?.rating,
            district: currentProduct?.district,
            state: currentProduct?.state,
            dateRange: selectedDates.start
                ? `${selectedDates.start.toLocaleString("en-US", { month: "short" })} ${selectedDates.start.getDate()} - ${selectedDates.end
                    ? `${selectedDates.end.toLocaleString("en-US", { month: "short" })} ${selectedDates.end.getDate()}`
                    : "--"
                }`
                : "N/A",
            startDate: selectedDates.start?.toISOString(),
            endDate: selectedDates.end?.toISOString(),
            sizeWidth: currentProduct?.sizeWidth,

            sizeSide: currentProduct?.sizeSide,
            productsquareFeet: currentProduct?.productsquareFeet,

            sizeHeight: currentProduct?.sizeHeight,
            dimension: (currentProduct?.sizeHeight || 0) * (currentProduct?.sizeWidth || 0),
            adType: currentProduct?.category,
            totalAmount: totalPrice.toLocaleString(),
            totalDays: totalDays,
            SpotOutdoorType: currentProduct?.prodLighting,
            PrintingCost: currentProduct?.printingCost,
            MountingCost: currentProduct?.mountingCost,
            FromSpot: currentProduct?.productFrom,
            ToSpot: currentProduct?.productTo,
            SpotPay: currentProduct?.productFixedAmount,
            Offer: currentProduct?.productFixedOffer,
            latitude: currentProduct?.latitude,
            longitude: currentProduct?.longitude,
            LocationLink: currentProduct?.LocationLink,
            userEmail: user.email,
            userPhone: user.phone,
            userName: user.userName,
            isOfferProduct: currentProduct?.isOfferProduct || false,
            originalPrice: currentProduct?.originalPrice || actualPrice
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

    // MODIFIED: Updated handleReserveNow to show calendar with error message
    const handleReserveNow = () => {
        if (!user) {
            openLogin();
            return;
        }
        if (!confirmedDates.start || !confirmedDates.end) {
            // Instead of alert, open calendar with error message
            setCalendarErrorMessage("Please select & Confirm the Start and End dates to Proceed.");
            setIsCalendarOpen(true);
            return;
        }

        // Use display price for offer products, regular price for others
        const actualPrice = currentProduct?.displayPrice || currentProduct?.price || 0;

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

        const reserveItem = {
            id: currentProduct?.id,
            prodCode: currentProduct?.prodCode,
            image: currentProduct?.imageUrl,
            prodName: currentProduct?.prodName,
            title: currentProduct?.location,
            price: actualPrice, // Use the correct price (offer or regular)
            rating: currentProduct?.rating,
            district: currentProduct?.district,
            state: currentProduct?.state,
            dateRange: selectedDates.start
                ? `${selectedDates.start.toLocaleString("en-US", { month: "short" })} ${selectedDates.start.getDate()} - ${selectedDates.end
                    ? `${selectedDates.end.toLocaleString("en-US", { month: "short" })} ${selectedDates.end.getDate()}`
                    : "--"
                }`
                : "N/A",
            startDate: selectedDates.start,
            endDate: selectedDates.end,
            sizeWidth: currentProduct?.sizeWidth,

            sizeHeight: currentProduct?.sizeHeight,
            sizeSide: currentProduct?.sizeSide,
            productsquareFeet: currentProduct?.productsquareFeet,

            dimension: (currentProduct?.sizeHeight || 0) * (currentProduct?.sizeWidth || 0),
            adType: currentProduct?.category,
            totalAmount: totalPrice.toLocaleString(),
            totalDays: totalDays,
            SpotOutdoorType: currentProduct?.prodLighting,
            PrintingCost: currentProduct?.printingCost,
            MountingCost: currentProduct?.mountingCost,
            FromSpot: currentProduct?.productFrom,
            ToSpot: currentProduct?.productTo,
            SpotPay: currentProduct?.productFixedAmount,
            Offer: currentProduct?.productFixedOffer,
            latitude: currentProduct?.latitude,
            longitude: currentProduct?.longitude,
            LocationLink: currentProduct?.LocationLink,
            userId: user._id,
            userEmail: user.email,
            userPhone: user.phone,
            userName: user.userName,
            isOfferProduct: currentProduct?.isOfferProduct || false,
            originalPrice: currentProduct?.originalPrice || actualPrice
        };

        // Redirect to Cart Page
        navigate("/billing", { state: { reserveItem } });
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

    if (!currentProduct) {
        return (
            <MainLayout>
                <div className="container text-center py-5">
                    <h3>Product not found</h3>
                    <p>The product you are looking for does not exist.</p>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div>
                {/* <MainNavbar /> */}
                <NavbarWrapper />

                <div className={`calendar-wrapper login-wrapper otp-wrapper ${isCalendarOpen ? "calendar-open" : ""} ${isLoginOpen ? "login-open" : ""} ${isOtpMainOpen ? "otp-main-open" : ""} `}>
                    {/* Image with details section  */}
                    <div className="container-fluid mt-5  Book-section " id="similarProdDetailsShows">
                        <div className="row BookMain ">
                            <div className="col-md-6 col-lg-6 Book-content1">
                                <div className="row bookContentRow1">
                                    <div className='bookContentRow2' style={{ display: 'flex', }}>
                                        <div className='book-images-section'>
                                            {/* Current Images should be showed in first with onchange functionalities  */}
                                            <div
                                                className={`book-images ${isMainImageSelected() ? 'selected' : ''}`}
                                                onClick={() => handleMainImageClick()}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <img
                                                    src={currentProduct?.imageUrl}
                                                    className="img-fluid book-img11"
                                                    alt="Main product"
                                                />
                                            </div>

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
                                                                        e.target.currentTime = 0;
                                                                    }
                                                                }}
                                                                onSeeked={(e) => {
                                                                    e.target.pause();
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
                                                                }}
                                                            />
                                                        )}
                                                </div>
                                            ))}
                                        </div>
                                        <div className='book-mainImage'>
                                            {currentPreviewType === 'video' ? (
                                                <video className='book-mainImg1'
                                                    ref={videoRef}
                                                    key={currentVideoUrl}
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
                                    <p className='book-size'>
                                        Size: {currentProduct.sizeWidth} x {currentProduct.sizeHeight}
                                        {/* Show side only for Signal Post and Pole Kiosk */}
                                        {(currentProduct.category === 'Signal Post' || currentProduct.category === 'Pole Kiosk') &&
                                            ` x ${currentProduct.sizeSide}`
                                        }
                                        <span className='slash-bar'>|</span>
                                        {currentProduct.productsquareFeet} Sq.ft
                                        {/* Show "2-Sided" text for specific categories */}
                                        {(currentProduct.category === 'Signal Post' || currentProduct.category === 'Pole Kiosk') &&
                                            <span className='sided-text'> (2-Sided)</span>
                                        }
                                    </p>

                                    <span className="btn-type">{currentProduct.category}</span>
                                    <span className="badge book-type">{currentProduct.prodLighting}</span>
                                    <span className='star-main'>
                                        <span><img src='/images/rating_board.png' className='rate-board1'></img></span>
                                        <span><RatingStars rating={currentProduct.rating} /> </span>
                                    </span>
                                    {/* <span className='productLocationImg'>
                                        <a href={currentProduct.LocationLink} target='_blank' rel="noopener noreferrer"> <i className="fa-solid fa-location-dot" /></a>
                                    </span> */}
                                    <span className='productLocationImg'>
                                        <a href={currentProduct.LocationLink} target='_blank'> <img src="/images/mapiconaddin.png" alt="location icon" className="locationImgIcon" /><span className="viewlocation">View Location</span></a>
                                    </span>

                                    <div className="book-price my-3">Printing Cost<span className='cost-gap'>: ₹ {currentProduct.printingCost?.toLocaleString() || '0'}</span> <span className='slash-bar1'>|</span> Mounting Cost<span className='cost-gap'>: ₹ {currentProduct.mountingCost?.toLocaleString() || '0'}</span></div>
                                    <div className='book-spot mt-3'>{currentProduct.productFrom} <span><img src='/images/Location_arrow.png' className='location-arrow'></img>  </span> {currentProduct.productTo}</div>
                                    <div className='book-rate'>
                                        <div className='book-rateContent1'>
                                            {/* Show offer price and original price for offer products */}
                                            {currentProduct.isOfferProduct ? (
                                                <>
                                                    <span className='rate-perDay offer-price-highlight'>₹ {currentProduct.displayPrice?.toLocaleString() || '0'} <span className='rate-perDay1'>Per Day</span></span>
                                                    <span className='original-price-strikethrough'>₹ {currentProduct.originalPrice?.toLocaleString() || '0'}</span>
                                                </>
                                            ) : (
                                                <span className='rate-perDay'>₹ {currentProduct.price?.toLocaleString() || '0'} <span className='rate-perDay1'>/ Per Day</span></span>
                                            )}
                                            <br />
                                            <a href="#Terms" className='book-condition anchor'>Terms & Condition</a>
                                        </div>

                                        <div className='book-rateContent2'>
                                            <button className=" book-date" onClick={() => toggleCalendar()}>Select date
                                                <span><img src='/images/calender_icon.png' className='calender'></img></span>
                                            </button>
                                        </div>
                                    </div>
                                    {/* <span className="me-2 payOffer">Pay {currentProduct.productFixedAmount} and Get {currentProduct.productFixedOffer}% Off <span className='refund'>100% Refundable</span></span><br></br> */}
                                    <button className="me-4 btn-pay" onClick={handleReserveNow} >Book Now</button>
                                    <button className="btn-cart" onClick={handleAddToCart}>Add to Cart</button><br></br>
                                    <button className=" mt-3 mb-2 btn-enquire" onClick={toggleOtpMainPage}>For More Details</button><br></br>
                            
                                </div>

                            ) : (
                                <p>No spot selected. Please go back and select a spot.</p>
                            )}

                            {/* Calender section Selected dates  */}
                            {isCalendarOpen && (
                                <div className="calendar-overlay">
                                    <div className='calendar-scroll'>
                                        {/* ADDED: Error message display above calendar */}
                                        {/* {calendarErrorMessage && (
                                            <div className="calendar-error-message">
                                                <div className="error-icon">⚠️</div>
                                                <div className="error-text">{calendarErrorMessage}</div>
                                            </div>
                                        )} */}
                                        <Calendar
                                            toggleCalendar={toggleCalendar}
                                            closeCalendar={closeCalendar}
                                            selectedDates={selectedDates}
                                            setSelectedDates={setSelectedDates}
                                            generateMonth={generateMonth}
                                            handleDateClick={handleDateClick}
                                            resetDates={resetDates}
                                            getDateSelectionClass={getDateSelectionClass}
                                            goToNextMonth={goToNextMonth}
                                            goToPreviousMonth={goToPreviousMonth}
                                            bookedDates={bookedDates}
                                            currentMonth={currentMonth}
                                            setCurrentMonth={setCurrentMonth}
                                            selectedSpotPrice={pricePerDay}
                                            confirmedDates={confirmedDates}
                                            setConfirmedDates={setConfirmedDates}
                                            pricePerDay={pricePerDay}
                                            confirmDates={confirmDates}
                                            totalDays={totalDays}
                                            totalPrice={totalPrice}
                                            calendarErrorMessage={calendarErrorMessage}
                                            setCalendarErrorMessage={setCalendarErrorMessage}

                                        />
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
                                            productData={currentProduct}
                                        />
                                    </div>
                                )}
                        </div>
                    </div>
                    <div id='Terms'>
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
                            {/* <div>
                                <div className="container similar mt-5">
                                    <h2 className="NearbyHeading mb-4">Nearby Similar Products</h2>
                                    <div className="row similar-products">
                                        {displayedSimilarSpots.length > 0 ? (
                                            displayedSimilarSpots.map(
                                                (spot) => (
                                                    <div className="col-lg-3 col-md-3 col-sm-12 mb-4 " key={spot._id} >
                                                        <div className="card board1-book1" onClick={() => handleSimilarProductClick(spot)} style={{ cursor: 'pointer' }}>
                                                            <img src={spot.image} alt={spot.location} className="card-img-top-book1" />
                                                            <span className='board-category-book1'>{spot.mediaType}</span>
                                                            <div className="board-content-book1 ">
                                                                <div className='board-content-top-book1'>
                                                                    <span className="card-title board-loc-book1">{spot.name}</span>
                                                                    <span className="board-dim-book1'">{spot.height} x {spot.width}</span>
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
                                    </div>
                                </div>
                            </div> */}






                            {/* Nearby Similar  Products  */}
                            <div>
                                <div class="container similar mt-5">
                                    <h2 class="NearbyHeading mb-4">Nearby Similar Products</h2>
                                    <div class="row similar-products">

                                        {displayedSimilarSpots.length > 0 ? (
                                            displayedSimilarSpots.map(
                                                (spot) => (
                                                    <div className="col-lg-3 col-md-3 col-sm-12 mb-4 " key={spot._id} >
                                                        <div className="card board1-book1" onClick={() => handleSimilarProductClick(spot)} style={{ cursor: 'pointer' }}>
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
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <MainFooter />
        </MainLayout>
    )
}

export default BookASite1;