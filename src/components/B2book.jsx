// B2BOOK.JSX - Corrected version with proper date locking mechanism
import React, { useState, useRef, useEffect } from "react";
import "../components/b2book.css";
import "../components/B21book.css";
import BookASite11 from "./B21book";
import Calendar from "./B20CalenderMain";
import "./B20CalenderMain.css";
import { useNavigate } from "react-router-dom";
import LoginPageMain from "./C1LoginMain";
import OtpMain from "./D1OtpMain";
import MainNavbar from "./A1NAVBAR.jsx";
import MainFooter from "./A1FOOTER.jsx";
import { useSpot } from "./B0SpotContext";
import { MainLayout } from "./MainLayout";
import { useLogin } from "./LoginContext";
import { useParams, useLocation } from "react-router-dom";
import { baseUrl } from "../Adminpanel/BASE_URL";
import { formatIndianCurrency } from "./FORMATED_AMOUNT";
import slugify from "slugify";
import PreLoader from "../components/PreLoad.jsx";
import { DATE_CONFIG } from "../Adminpanel/BASE_URL.js";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';
import { toast } from 'react-toastify';

const TODAY = new Date();
TODAY.setUTCHours(0, 0, 0, 0);

function BookASite1() {
    const { productId } = useParams();
    const location = useLocation();
    const { user, openLogin, closeLogin } = useLogin();
    const { selectedSpot, setSelectedSpot } = useSpot();
    const navigate = useNavigate();

    // State variables
    const [similarSpots, setSimilarSpots] = useState([]);
    const [originalSimilarSpots, setOriginalSimilarSpots] = useState([]);
    const [displayedSimilarSpots, setDisplayedSimilarSpots] = useState([]);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [additionalFiles, setAdditionalFiles] = useState([]);
    const [currentMainImage, setCurrentMainImage] = useState("");
    const [currentPreviewType, setCurrentPreviewType] = useState("image");
    const [currentVideoUrl, setCurrentVideoUrl] = useState("");
    const [selectedFileIndex, setSelectedFileIndex] = useState(-1);
    const [calendarErrorMessage, setCalendarErrorMessage] = useState("");
    const [dateSuggestions, setDateSuggestions] = useState([]);

    // Date configuration
    const INITIAL_SELECTION_DAYS = DATE_CONFIG.INITIAL_SELECTION_DAYS;
    const MIN_BOOKING_DAYS = DATE_CONFIG.MIN_BOOKING_DAYS;
    const AVAILABLE_WINDOW_DAYS = DATE_CONFIG.AVAILABLE_WINDOW_DAYS;
    const SHOW_ONLY_AVAILABLE_WINDOW = DATE_CONFIG.SHOW_ONLY_AVAILABLE_WINDOW;

    // Queue system states
    const [confirmedDates, setConfirmedDates] = useState([]);
    const [pendingDates, setPendingDates] = useState([]);
    const [queuePosition, setQueuePosition] = useState(null);
    const [showQueueInfo, setShowQueueInfo] = useState(false);

    const videoRef = useRef(null);

    // Calendar states
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const today = new Date();
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isOtpMainOpen, setIsOtpMainOpen] = useState(false);

    // Date Selection State - PRODUCT SPECIFIC
    const [selectedDates, setSelectedDates] = useState({ start: null, end: null });
    const [campaignConfirmedDates, setCampaignConfirmedDates] = useState({});

    // NEW: Date Lock State - prevents modifications after confirmation
    const [areDatesLocked, setAreDatesLocked] = useState(false);

    // Track current product ID for date persistence
    const [currentProductId, setCurrentProductId] = useState(null);

    // Track if add to cart is in progress to prevent double submission
    const [isAddingToCart, setIsAddingToCart] = useState(false);

    // Track if dates have been used for cart/booking to prevent reuse
    const [datesUsedForAction, setDatesUsedForAction] = useState(false);

    // Window management state
    const [isWindowExpanded, setIsWindowExpanded] = useState(false);
    const [currentWindowStart, setCurrentWindowStart] = useState(null);
    const [currentWindowEnd, setCurrentWindowEnd] = useState(null);
    const [isSelectionConfirmed, setIsSelectionConfirmed] = useState(false);

    // Booking flow states
    const [isProcessingBooking, setIsProcessingBooking] = useState(false);
    const [bookingConfirmation, setBookingConfirmation] = useState(null);

    // Login flow state
    const [pendingBookingAfterLogin, setPendingBookingAfterLogin] = useState(null);
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);
    const [showEnquireNow, setShowEnquireNow] = useState(false);
    const [enquireNowContext, setEnquireNowContext] = useState(null);

    // Track if all initial days are booked
    const [allInitialDaysBooked, setAllInitialDaysBooked] = useState(false);
    const [nextBookingOpenDate, setNextBookingOpenDate] = useState(null);
    const [lastBookedDate, setLastBookedDate] = useState(null);
    const [windowWidth, setWindowWidth] = useState(0);

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Effect to show Enquire Now button when all days are booked
    useEffect(() => {
        if (allInitialDaysBooked && nextBookingOpenDate && isCalendarOpen) {
            const formattedDate = nextBookingOpenDate.toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric"
            });
            setCalendarErrorMessage(`Slots are booked. Booking opens from ${formattedDate}. Enquire Now`);
            setShowEnquireNow(true);
        }
    }, [allInitialDaysBooked, nextBookingOpenDate, isCalendarOpen]);

    // Effect to check if all initial days are booked
    useEffect(() => {
        if (confirmedDates.length > 0) {
            checkAllInitialDaysBooked();
        }
    }, [confirmedDates]);

    const checkAllInitialDaysBooked = () => {
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);

        let allBooked = true;
        let lastBooked = null;

        for (let i = 0; i < INITIAL_SELECTION_DAYS; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);

            const isBooked = isDateBooked(date);

            if (!isBooked) {
                allBooked = false;
                break;
            } else {
                lastBooked = new Date(date);
            }
        }

        setAllInitialDaysBooked(allBooked);

        if (allBooked) {
            findLastBookedDate(today);
        } else {
            setLastBookedDate(null);
            setNextBookingOpenDate(null);
            setShowEnquireNow(false);
        }
    };

    const findLastBookedDate = (startFrom) => {
        let currentDate = new Date(startFrom);
        let lastBooked = new Date(startFrom);

        for (let i = 0; i < 365; i++) {
            if (isDateBooked(currentDate)) {
                lastBooked = new Date(currentDate);
                currentDate.setDate(currentDate.getDate() + 1);
            } else {
                break;
            }
        }

        setLastBookedDate(lastBooked);

        if (lastBooked) {
            const nextAvailableDate = new Date(lastBooked);
            nextAvailableDate.setDate(lastBooked.getDate() + 1);

            const bookingOpenDate = new Date(nextAvailableDate);
            bookingOpenDate.setDate(nextAvailableDate.getDate() - (INITIAL_SELECTION_DAYS - 1));

            const today = new Date();
            today.setUTCHours(0, 0, 0, 0);
            if (bookingOpenDate < today) {
                bookingOpenDate.setDate(today.getDate());
            }

            setNextBookingOpenDate(bookingOpenDate);
        }
    };

    const handleEnquireNow = () => {
        setEnquireNowContext('booked_dates');
        closeCalendar();
        setTimeout(() => {
            setIsOtpMainOpen(true);
        }, 300);
    };

    // Effect to handle pending booking after login
    useEffect(() => {
        if (isCalendarOpen && currentProduct) {
            if (pendingBookingAfterLogin && pendingBookingAfterLogin.productId === currentProduct.id) {
                console.log('Processing pending booking after login:', pendingBookingAfterLogin);

                // Unlock dates for new selection
                setAreDatesLocked(false);
                setSelectedDates({
                    start: pendingBookingAfterLogin.startDate,
                    end: pendingBookingAfterLogin.endDate
                });

                expandDateWindow(pendingBookingAfterLogin.startDate);
                setPendingBookingAfterLogin(null);
            }
            else if (campaignConfirmedDates.start && campaignConfirmedDates.end) {
                setCurrentWindowStart(campaignConfirmedDates.start);
                setCurrentWindowEnd(campaignConfirmedDates.end);
                setIsWindowExpanded(false);
                setIsSelectionConfirmed(true);
                setAreDatesLocked(true);

                setSelectedDates({
                    start: campaignConfirmedDates.start,
                    end: campaignConfirmedDates.end
                });
            } else if (selectedDates.start && selectedDates.end && !areDatesLocked) {
                expandDateWindow(selectedDates.start);
            } else {
                initializeDateWindow();
            }
        }
    }, [isCalendarOpen, currentProduct]);

    // Handle user login state changes for pending bookings
    useEffect(() => {
        if (user && currentProduct) {
            console.log('User logged in, checking for pending booking');
            const pendingBooking = localStorage.getItem(`pendingBookingAfterLogin_${currentProduct.id}`);
            if (pendingBooking) {
                try {
                    const bookingData = JSON.parse(pendingBooking);
                    if (bookingData.productId === currentProduct?.id ||
                        bookingData.prodCode === currentProduct?.prodCode) {

                        const startDate = new Date(bookingData.startDate);
                        const endDate = new Date(bookingData.endDate);

                        setPendingBookingAfterLogin({
                            startDate,
                            endDate,
                            productId: bookingData.productId,
                            prodCode: bookingData.prodCode
                        });

                        setTimeout(() => {
                            setIsCalendarOpen(true);
                        }, 500);

                        localStorage.removeItem(`pendingBookingAfterLogin_${currentProduct.id}`);
                    }
                } catch (error) {
                    console.error('Error processing pending booking after login:', error);
                    localStorage.removeItem(`pendingBookingAfterLogin_${currentProduct.id}`);
                }
            }
        }
    }, [user, currentProduct]);

    const initializeDateWindow = () => {
        if (campaignConfirmedDates.start && campaignConfirmedDates.end) {
            return;
        }

        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);

        let windowStart = new Date(today);
        let windowEnd = new Date(today);

        if (allInitialDaysBooked && lastBookedDate) {
            windowEnd = new Date(lastBookedDate);
        } else {
            windowEnd.setDate(today.getDate() + INITIAL_SELECTION_DAYS - 1);
        }

        setCurrentWindowStart(windowStart);
        setCurrentWindowEnd(windowEnd);
        setIsWindowExpanded(false);
        setIsSelectionConfirmed(false);
        setCurrentMonth(new Date(windowStart));
    };

    const isDateWithinCurrentWindow = (date) => {
        if (!date || isNaN(date.getTime())) return false;
        if (!currentWindowStart || !currentWindowEnd) return true;

        const normalizedDate = new Date(
            Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
        );

        const normalizedStart = new Date(
            Date.UTC(
                currentWindowStart.getFullYear(),
                currentWindowStart.getMonth(),
                currentWindowStart.getDate(),
            ),
        );

        const normalizedEnd = new Date(
            Date.UTC(
                currentWindowEnd.getFullYear(),
                currentWindowEnd.getMonth(),
                currentWindowEnd.getDate(),
            ),
        );

        if (allInitialDaysBooked && lastBookedDate) {
            const lastBookedUTC = new Date(
                Date.UTC(
                    lastBookedDate.getFullYear(),
                    lastBookedDate.getMonth(),
                    lastBookedDate.getDate(),
                ),
            );
            return normalizedDate >= normalizedStart && normalizedDate <= lastBookedUTC;
        }

        return normalizedDate >= normalizedStart && normalizedDate <= normalizedEnd;
    };

    const expandDateWindow = (startDate) => {
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);

        let windowStart;
        let expandedEnd;

        if (allInitialDaysBooked && lastBookedDate && nextBookingOpenDate) {
            const todayUTC = new Date(
                Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())
            );

            const nextBookingOpenUTC = new Date(
                Date.UTC(
                    nextBookingOpenDate.getFullYear(),
                    nextBookingOpenDate.getMonth(),
                    nextBookingOpenDate.getDate()
                )
            );

            if (todayUTC >= nextBookingOpenUTC) {
                windowStart = new Date(today);
                expandedEnd = new Date(today);
                expandedEnd.setDate(today.getDate() + AVAILABLE_WINDOW_DAYS - 1);
            } else {
                windowStart = new Date(today);
                expandedEnd = new Date(lastBookedDate);
            }
        } else {
            windowStart = new Date(today);
            expandedEnd = new Date(today);
            expandedEnd.setDate(today.getDate() + AVAILABLE_WINDOW_DAYS - 1);
        }

        setCurrentWindowStart(windowStart);
        setCurrentWindowEnd(expandedEnd);
        setIsWindowExpanded(true);
    };

    const resetToInitialWindow = () => {
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);

        let windowStart;
        let windowEnd;

        if (allInitialDaysBooked && nextBookingOpenDate) {
            windowStart = new Date(nextBookingOpenDate);
            windowEnd = new Date(nextBookingOpenDate);
            windowEnd.setDate(nextBookingOpenDate.getDate() + INITIAL_SELECTION_DAYS - 1);
        } else {
            windowStart = new Date(today);
            windowEnd = new Date(today);
            windowEnd.setDate(today.getDate() + INITIAL_SELECTION_DAYS - 1);
        }

        setCurrentWindowStart(windowStart);
        setCurrentWindowEnd(windowEnd);
        setIsWindowExpanded(false);
        setIsSelectionConfirmed(false);
        setCurrentMonth(new Date(windowStart));
    };

    // // RESET DATES FUNCTION - Now properly unlocks dates
    // const resetDates = () => {
    //     // Unlock dates for new selection
    //     setAreDatesLocked(false);
    //     setSelectedDates({ start: null, end: null });
    //     setCampaignConfirmedDates({ start: null, end: null });
    //     setCalendarErrorMessage("");
    //     setShowQueueInfo(false);
    //     setIsSelectionConfirmed(false);
    //     resetToInitialWindow();
    //     setBookingConfirmation(null);
    //     setPendingBookingAfterLogin(null);
    //     setShowLoginPrompt(false);
    //     setDatesUsedForAction(false);

    //     // Clear localStorage for current product
    //     if (currentProduct?.id) {
    //         localStorage.removeItem(`pendingBookingAfterLogin_${currentProduct.id}`);
    //     }

    //     // Also clear any pending booking from general storage
    //     localStorage.removeItem('pendingBookingAfterLogin');

    //     // Force a re-render of calendar state
    //     if (isCalendarOpen) {
    //         // Refresh dates if calendar is open
    //         fetchDates();
    //     }
    // };

    // Updated resetDates function - Properly resets and refreshes date statuses
const resetDates = async () => {
  // Unlock dates for new selection
  setAreDatesLocked(false);
  setSelectedDates({ start: null, end: null });
  setCampaignConfirmedDates({ start: null, end: null });
  setCalendarErrorMessage("");
  setShowQueueInfo(false);
  setIsSelectionConfirmed(false);
  resetToInitialWindow();
  setBookingConfirmation(null);
  setPendingBookingAfterLogin(null);
  setShowLoginPrompt(false);
  setDatesUsedForAction(false);

  // Clear localStorage for current product
  if (currentProduct?.id) {
    localStorage.removeItem(`pendingBookingAfterLogin_${currentProduct.id}`);
  }

  // Clear any pending booking from general storage
  localStorage.removeItem('pendingBookingAfterLogin');

  // Force a fresh fetch of dates if calendar is open
  if (isCalendarOpen) {
    await fetchDates();
    // Force a re-render of calendar
    setCurrentMonth(new Date(currentMonth));
  }
};



    const autoSelectMinimumDays = (startDate) => {
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);

        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + (MIN_BOOKING_DAYS - 1));

        const maxWindowEnd = new Date(today);
        maxWindowEnd.setDate(today.getDate() + AVAILABLE_WINDOW_DAYS - 1);

        if (endDate > maxWindowEnd) {
            const range = findNextAvailableRange(startDate);
            if (range) {
                setSelectedDates({ start: range.start, end: range.end });
                setCalendarErrorMessage(
                    `Auto-selected ${range.days} days: ${range.start.toLocaleDateString("en-IN", { day: "numeric", month: "short" })} - ${range.end.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}`,
                );
            } else {
                setCalendarErrorMessage(
                    `Cannot find ${MIN_BOOKING_DAYS} continuous available days starting from ${startDate.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}.`,
                );
            }
            return;
        }

        const availableDays = getAvailableDaysInRange(startDate, endDate).length;

        if (availableDays >= MIN_BOOKING_DAYS) {
            if (!isBookingAllowedToday(startDate)) {
                const bookingOpenDate = getBookingOpenDate(startDate);
                setCalendarErrorMessage(
                    `Next available dates: ` +
                    `${startDate.toLocaleDateString("en-IN", { day: "numeric", month: "short" })} - ` +
                    `${endDate.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}. ` +
                    `⏳ Booking opens on ${bookingOpenDate.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}. Enquire Now`
                );
                setShowEnquireNow(true);
                return;
            }

            setSelectedDates({ start: startDate, end: endDate });
            return;
        } else {
            const range = findNextAvailableRange(startDate);
            if (range) {
                const bookingOpenDate = getBookingOpenDate(range.start);
                const todayUTC = new Date();
                todayUTC.setUTCHours(0, 0, 0, 0);

                if (todayUTC < bookingOpenDate) {
                    setCalendarErrorMessage(
                        `Next available dates: ` +
                        `${range.start.toLocaleDateString("en-IN", { day: "numeric", month: "short" })} - ` +
                        `${range.end.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}. ` +
                        `⏳ Booking opens on ${bookingOpenDate.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}. Enquire Now`
                    );
                    setShowEnquireNow(true);
                    return;
                }

                setSelectedDates({ start: range.start, end: range.end });
                setCalendarErrorMessage(
                    `✅ Found available ${range.days} days: ` +
                    `${range.start.toLocaleDateString("en-IN", { day: "numeric", month: "short" })} - ` +
                    `${range.end.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}`
                );
            } else {
                setCalendarErrorMessage(
                    `Cannot find ${MIN_BOOKING_DAYS} continuous available days starting from ${startDate.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}.`,
                );
            }
        }
    };

    const findNextAvailableRange = (startDate) => {
        let current = new Date(startDate);
        let consecutiveDays = 0;
        let rangeStart = null;
        const maxWindowEnd = new Date(currentWindowEnd || new Date());

        while (current <= maxWindowEnd && consecutiveDays < MIN_BOOKING_DAYS) {
            if (!isDateBooked(current) && !isPastDate(current)) {
                if (consecutiveDays === 0) {
                    rangeStart = new Date(current);
                }
                consecutiveDays++;
            } else {
                consecutiveDays = 0;
                rangeStart = null;
            }
            current.setDate(current.getDate() + 1);
        }

        if (consecutiveDays >= MIN_BOOKING_DAYS && rangeStart) {
            const endDate = new Date(rangeStart);
            endDate.setDate(rangeStart.getDate() + consecutiveDays - 1);
            return {
                start: rangeStart,
                end: endDate,
                days: consecutiveDays,
            };
        }
        return null;
    };

    // Fetch product data
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setIsLoading(true);

                if (location.state?.isOfferProduct && location.state?.selectedSpot) {
                    const offerSpot = location.state.selectedSpot;
                    const mergedProduct = {
                        ...offerSpot,
                        displayPrice: offerSpot.price || offerSpot.offerPrice,
                        originalPrice: offerSpot.originalPrice || offerSpot.price,
                        isOfferProduct: true,
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

                if (location.state?.selectedSpot) {
                    setCurrentProduct(location.state.selectedSpot);
                    fetchSimilarProducts(location.state.selectedSpot.prodCode);
                    setAdditionalFiles(location.state.selectedSpot.additionalFiles || []);
                    setCurrentMainImage(location.state.selectedSpot.imageUrl);
                    setSelectedFileIndex(-1);
                    setIsLoading(false);
                    return;
                }

                if (productId) {
                    const actualId = productId.split("-")[0];
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
                            displayPrice: data.price,
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
                            isOfferProduct: false,
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
            const cleanedCode = prodCode ? prodCode.replace(/^#/, "").trim() : "";
            if (!cleanedCode) {
                setOriginalSimilarSpots([]);
                setDisplayedSimilarSpots([]);
                return;
            }

            const encodedCode = encodeURIComponent(cleanedCode);
            const response = await fetch(`${baseUrl}/products/similar/${encodedCode}`);

            if (response.ok) {
                const data = await response.json();
                setOriginalSimilarSpots(data);
                setDisplayedSimilarSpots(data);
            } else {
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
            isOfferProduct: false,
        };
        const productSlug = `${spot._id}-${slugify(spot.name, { lower: true, strict: true })}`;
        navigate(`/Product/${productSlug}`, { replace: true });

        // Reset ALL date states when switching products
        setCurrentProduct(mappedSpot);
        setAdditionalFiles(spot.additionalFiles || []);
        setCurrentMainImage(spot.image);
        setCurrentPreviewType("image");
        setCurrentVideoUrl("");
        setSelectedFileIndex(-1);
        setSelectedSpot(mappedSpot);

        // Reset date states and unlock dates
        setAreDatesLocked(false);
        setSelectedDates({ start: null, end: null });
        setCampaignConfirmedDates({ start: null, end: null });
        setIsSelectionConfirmed(false);
        setBookingConfirmation(null);
        setPendingBookingAfterLogin(null);
        setShowLoginPrompt(false);
        setCalendarErrorMessage("");
        setDatesUsedForAction(false);

        // Clear localStorage for the new product
        if (mappedSpot.id) {
            localStorage.removeItem(`pendingBookingAfterLogin_${mappedSpot.id}`);
        }

        // Clear general pending booking
        localStorage.removeItem('pendingBookingAfterLogin');

        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const [isMenuOpen, setMenuOpen] = useState(false);
    const toggleMenu = () => setMenuOpen(!isMenuOpen);
    const [isOpen, setIsOpen] = useState(false);
    const toggleNavOpen = () => setIsOpen(!isOpen);

    const handleImageChange = (file, index) => {
        if (file.type === "video" || (file.url && file.url.match(/\.(mp4|mov|avi|mkv)$/i))) {
            setCurrentPreviewType("video");
            setCurrentVideoUrl(file.url);
            setSelectedFileIndex(index);
        } else {
            setCurrentPreviewType("image");
            setCurrentMainImage(file.url);
            setCurrentVideoUrl("");
            setSelectedFileIndex(index);
        }
    };

    const handleMainImageClick = () => {
        if (currentProduct && currentProduct.imageUrl) {
            setCurrentMainImage(currentProduct.imageUrl);
            setCurrentPreviewType("image");
            setCurrentVideoUrl("");
            setSelectedFileIndex(-1);
        }
    };

    const isFileSelected = (index) => selectedFileIndex === index;
    const isMainImageSelected = () => selectedFileIndex === -1;

    const fetchDates = async () => {
        if (currentProduct?.prodCode) {
            try {
                const res = await fetch(`${baseUrl}/booked-dates/${currentProduct.prodCode}`);
                const data = await res.json();

                if (res.ok) {
                    let confirmedDatesArray = [];
                    let pendingDatesArray = [];

                    if (data.confirmed && Array.isArray(data.confirmed)) {
                        if (typeof data.confirmed[0] === "string") {
                            confirmedDatesArray = data.confirmed;
                        } else {
                            confirmedDatesArray = data.confirmed.map(item => item.date || item);
                        }
                    }

                    if (data.pending && Array.isArray(data.pending)) {
                        pendingDatesArray = data.pending.map(item => ({
                            ...item,
                            date: item.date || item,
                        }));
                    }

                    const validConfirmedDates = confirmedDatesArray
                        .filter(d => {
                            try {
                                const date = new Date(d);
                                return !isNaN(date.getTime());
                            } catch {
                                return false;
                            }
                        })
                        .map(d => {
                            const date = new Date(d);
                            return new Date(
                                Date.UTC(
                                    date.getUTCFullYear(),
                                    date.getUTCMonth(),
                                    date.getUTCDate(),
                                ),
                            );
                        });

                    const validPendingDates = pendingDatesArray
                        .filter(p => {
                            const dateStr = p.date;
                            try {
                                const date = new Date(dateStr);
                                return !isNaN(date.getTime());
                            } catch {
                                return false;
                            }
                        })
                        .map(p => {
                            const date = new Date(p.date);
                            return {
                                ...p,
                                date: new Date(
                                    Date.UTC(
                                        date.getUTCFullYear(),
                                        date.getUTCMonth(),
                                        date.getUTCDate(),
                                    ),
                                ),
                            };
                        });

                    setConfirmedDates(validConfirmedDates);
                    setPendingDates(validPendingDates);

                    setTimeout(() => {
                        checkInitialWindowStatus(validConfirmedDates);
                    }, 100);

                    if (user) {
                        fetchQueuePosition(currentProduct.prodCode);
                    }
                } else {
                    setConfirmedDates([]);
                    setPendingDates([]);
                }
            } catch (error) {
                console.error("Error fetching dates:", error);
                setConfirmedDates([]);
                setPendingDates([]);
            }
        }
    };

    const checkInitialWindowStatus = (confirmedDatesArray) => {
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);

        let allBooked = true;
        let lastBookedDate = null;

        for (let i = 0; i < INITIAL_SELECTION_DAYS; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);

            const isBooked = isDateBookedInArray(date, confirmedDatesArray);

            if (!isBooked) {
                allBooked = false;
                break;
            } else {
                lastBookedDate = new Date(date);
            }
        }

        setAllInitialDaysBooked(allBooked);

        if (allBooked && lastBookedDate) {
            findLastBookedDateInSequence(lastBookedDate, confirmedDatesArray);
        } else {
            setLastBookedDate(null);
            setNextBookingOpenDate(null);
        }
    };

    const isDateBookedInArray = (date, bookedArray) => {
        if (!date || isNaN(date.getTime())) return false;

        const normalizedDate = new Date(
            Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
        );
        const dateString = normalizedDate.toISOString().split("T")[0];

        return bookedArray.some((d) => {
            if (!d || isNaN(new Date(d).getTime())) return false;
            const bookedDate = new Date(d);
            const bookedDateString = new Date(
                Date.UTC(
                    bookedDate.getUTCFullYear(),
                    bookedDate.getUTCMonth(),
                    bookedDate.getUTCDate(),
                ),
            )
                .toISOString()
                .split("T")[0];
            return dateString === bookedDateString;
        });
    };

    const findLastBookedDateInSequence = (startDate, bookedArray) => {
        let currentDate = new Date(startDate);
        let lastBooked = new Date(startDate);

        while (true) {
            const nextDate = new Date(currentDate);
            nextDate.setDate(currentDate.getDate() + 1);

            if (isDateBookedInArray(nextDate, bookedArray)) {
                lastBooked = new Date(nextDate);
                currentDate = new Date(nextDate);
            } else {
                break;
            }

            const daysChecked = (nextDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
            if (daysChecked > 365) break;
        }

        setLastBookedDate(lastBooked);

        const nextAvailableDate = new Date(lastBooked);
        nextAvailableDate.setDate(lastBooked.getDate() + 1);

        const bookingOpenDate = new Date(nextAvailableDate);
        bookingOpenDate.setDate(nextAvailableDate.getDate() - (INITIAL_SELECTION_DAYS - 1));

        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);
        if (bookingOpenDate < today) {
            bookingOpenDate.setDate(today.getDate());
        }

        setNextBookingOpenDate(bookingOpenDate);
    };

    const fetchQueuePosition = async (prodCode) => {
        try {
            const response = await fetch(`${baseUrl}/pending-reservations/${prodCode}`);
            if (response.ok) {
                const data = await response.json();
                if (data.success && data.reservations) {
                    const userReservation = data.reservations.find(r => r.userId === user._id);
                    if (userReservation) {
                        const position = data.reservations.findIndex(r => r.orderId === userReservation.orderId) + 1;
                        setQueuePosition(position);
                    }
                }
            }
        } catch (error) {
            console.error("Error fetching queue position:", error);
        }
    };

    const isPastDate = (date) => {
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);
        const normalizedDate = new Date(
            Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
        );
        return normalizedDate < today;
    };

    const isDateBooked = (date) => {
        if (!date || isNaN(date.getTime())) return false;

        try {
            const normalizedDate = new Date(
                Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
            );
            const dateString = normalizedDate.toISOString().split("T")[0];

            return confirmedDates.some((d) => {
                if (!d || isNaN(new Date(d).getTime())) return false;
                const bookedDate = new Date(d);
                const bookedDateString = new Date(
                    Date.UTC(
                        bookedDate.getUTCFullYear(),
                        bookedDate.getUTCMonth(),
                        bookedDate.getUTCDate(),
                    ),
                )
                    .toISOString()
                    .split("T")[0];
                return dateString === bookedDateString;
            });
        } catch (error) {
            console.warn("Error in isDateBooked:", error);
            return false;
        }
    };

    const isDatePending = (date) => {
        if (!date || isNaN(date.getTime())) return false;

        try {
            const normalizedDate = new Date(
                Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
            );
            const dateString = normalizedDate.toISOString().split("T")[0];

            return pendingDates.some((p) => {
                if (!p || !p.date || isNaN(new Date(p.date).getTime())) return false;
                const pendingDate = new Date(p.date);
                const pendingDateString = new Date(
                    Date.UTC(
                        pendingDate.getUTCFullYear(),
                        pendingDate.getUTCMonth(),
                        pendingDate.getUTCDate(),
                    ),
                )
                    .toISOString()
                    .split("T")[0];
                return dateString === pendingDateString;
            });
        } catch (error) {
            console.warn("Error in isDatePending:", error);
            return false;
        }
    };

    const getConflictBlocks = (start, end) => {
        if (!start || !end || isNaN(start.getTime()) || isNaN(end.getTime())) {
            return [];
        }

        const blocks = [];
        let current = new Date(start);
        const normalizedEnd = new Date(end);

        while (current <= normalizedEnd) {
            if (isDateBooked(current)) {
                const blockStart = new Date(current);
                let blockEnd = new Date(current);

                while (current <= normalizedEnd && isDateBooked(current)) {
                    blockEnd = new Date(current);
                    current.setDate(current.getDate() + 1);
                }

                blocks.push({
                    start: blockStart,
                    end: blockEnd,
                    days: Math.ceil((blockEnd - blockStart) / (1000 * 60 * 60 * 24)) + 1,
                });
            } else {
                current.setDate(current.getDate() + 1);
            }
        }

        return blocks;
    };

    const validateMinimumDays = (start, end) => {
        if (!start || !end) {
            return {
                valid: false,
                days: 0,
                availableDays: 0,
                message: "Please select both start and end dates.",
            };
        }

        const days = calculateDaysDifference(start, end);
        const availableDays = getAvailableDaysInRange(start, end).length;

        if (availableDays < MIN_BOOKING_DAYS) {
            return {
                valid: false,
                days: days,
                availableDays: availableDays,
                message: `Minimum ${MIN_BOOKING_DAYS} available days required. Selected range has ${days} calendar days with only ${availableDays} available days.`,
            };
        }

        const conflictBlocks = getConflictBlocks(start, end);
        const bookedCount = conflictBlocks.reduce((total, block) => total + block.days, 0);

        return {
            valid: true,
            days: days,
            availableDays: availableDays,
            bookedCount: bookedCount,
            conflictBlocks: conflictBlocks.length,
            message: `${days} days selected with ${availableDays} available days${bookedCount > 0 ? ` (${bookedCount} booked days excluded)` : ""}.`,
        };
    };

    const handleDateClick = async (date) => {
        // Prevent date selection if dates are locked
        if (areDatesLocked) {
            setCalendarErrorMessage("Dates are confirmed and locked. Please reset dates if you want to modify them.");
            return;
        }

        if (!date || isNaN(date.getTime())) {
            console.warn("Invalid date clicked:", date);
            return;
        }

        try {
            const normalizedDate = new Date(
                Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
            );

            if (isPastDate(normalizedDate)) {
                setCalendarErrorMessage("Cannot select past dates.");
                return;
            }

            if (isDateBooked(normalizedDate)) {
                if (allInitialDaysBooked && nextBookingOpenDate) {
                    const formattedDate = nextBookingOpenDate.toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric"
                    });
                    setCalendarErrorMessage(`Slots are booked. Booking opens from ${formattedDate}`);
                } else {
                    setCalendarErrorMessage('Slots are booked.');
                }
                return;
            }

            if (!selectedDates.start) {
                setSelectedDates({ start: normalizedDate, end: null });
                expandDateWindow(normalizedDate);
                autoSelectMinimumDays(normalizedDate);
                setCalendarErrorMessage("");
                return;
            }

            if (selectedDates.start && !selectedDates.end) {
                autoSelectMinimumDays(selectedDates.start);
                return;
            }

            if (selectedDates.start && selectedDates.end) {
                if (normalizedDate < selectedDates.start) {
                    setSelectedDates({ start: normalizedDate, end: null });
                    expandDateWindow(normalizedDate);
                    autoSelectMinimumDays(normalizedDate);
                } else {
                    const daysSelected = calculateDaysDifference(
                        selectedDates.start,
                        normalizedDate,
                    );

                    if (daysSelected < MIN_BOOKING_DAYS) {
                        const newEndDate = new Date(selectedDates.start);
                        newEndDate.setDate(selectedDates.start.getDate() + MIN_BOOKING_DAYS - 1);

                        if (!isDateBooked(newEndDate)) {
                            setSelectedDates({ start: selectedDates.start, end: newEndDate });
                            setCalendarErrorMessage(
                                 `Minimum ${MIN_BOOKING_DAYS} days required. Auto-extended to ${newEndDate.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}`,
                            );
                        } else {
                            const range = findNextAvailableRange(selectedDates.start);
                            if (range) {
                                setSelectedDates({ start: range.start, end: range.end });
                                setCalendarErrorMessage(
                                    `Minimum ${MIN_BOOKING_DAYS} days required. Found available range: ${range.start.toLocaleDateString("en-IN", { day: "numeric", month: "short" })} - ${range.end.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}`,
                                );
                            } else {
                                setCalendarErrorMessage(
                                    `Cannot extend to ${MIN_BOOKING_DAYS} days as there are conflicts. Please select a different start date.`,
                                );
                            }
                        }
                    } else {
                        const conflictBlocks = getConflictBlocks(selectedDates.start, normalizedDate);
                        if (conflictBlocks.length > 0) {
                            setCalendarErrorMessage(
                                `Selected range has ${conflictBlocks.length} conflict block(s).`,
                            );
                        }
                        setSelectedDates({
                            start: selectedDates.start,
                            end: normalizedDate,
                        });
                    }
                }
                return;
            }
        } catch (error) {
            console.error("Error in handleDateClick:", error);
            setCalendarErrorMessage(
                "An error occurred while selecting the date. Please try again.",
            );
        }
    };

    const calculateDaysDifference = (start, end) => {
        if (!start || !end) return 0;
        const timeDiff = Math.abs(end.getTime() - start.getTime());
        return Math.ceil(timeDiff / (1000 * 60 * 60 * 24)) + 1;
    };

    const getAvailableDaysInRange = (start, end) => {
        if (!start || !end || isNaN(start.getTime()) || isNaN(end.getTime())) {
            return [];
        }
        const days = [];
        const current = new Date(start);
        const normalizedEnd = new Date(end);
        while (current <= normalizedEnd) {
            if (!isDateBooked(current) && !isPastDate(current)) {
                days.push(new Date(current));
            }
            current.setDate(current.getDate() + 1);
        }
        return days;
    };

    const getPendingDaysInRange = (start, end) => {
        if (!start || !end || isNaN(start.getTime()) || isNaN(end.getTime())) {
            return 0;
        }
        let count = 0;
        const current = new Date(start);
        const normalizedEnd = new Date(end);
        while (current <= normalizedEnd) {
            if (isDatePending(current)) {
                count++;
            }
            current.setDate(current.getDate() + 1);
        }
        return count;
    };

    const generateMonth = (monthDate) => {
        const year = monthDate.getFullYear();
        const month = monthDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startDay = firstDay.getDay();
        const days = [];
        for (let i = 0; i < startDay; i++) {
            days.push(null);
        }
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            days.push(date);
        }
        while (days.length < 42) days.push(null);
        return days;
    };

    useEffect(() => {
        if (currentProduct && currentProduct.id !== selectedSpot?.id) {
            // Reset all date states when product changes
            setAreDatesLocked(false);
            setCampaignConfirmedDates({ start: null, end: null });
            setSelectedDates({ start: null, end: null });
            setIsSelectionConfirmed(false);
            setBookingConfirmation(null);
            setPendingBookingAfterLogin(null);
            setShowLoginPrompt(false);
            setCalendarErrorMessage("");
            setDatesUsedForAction(false);

            if (currentProduct?.id) {
                localStorage.removeItem(`pendingBookingAfterLogin_${currentProduct.id}`);
            }
        }
    }, [currentProduct, selectedSpot]);

    const checkDateConflictsInRealTime = async (startDate, endDate) => {
        try {
            if (!currentProduct?.prodCode) return { hasConflicts: false };

            const response = await fetch(
                `${baseUrl}/check-date-conflicts/${currentProduct.prodCode}?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`
            );

            if (response.ok) {
                const data = await response.json();
                return data;
            }
            return { hasConflicts: false };
        } catch (error) {
            console.error('Error checking date conflicts:', error);
            return { hasConflicts: false };
        }
    };

    useEffect(() => {
        if (user) {
            setShowLoginPrompt(false);
            if (isCalendarOpen && calendarErrorMessage === "Please log in to continue with your booking") {
                setCalendarErrorMessage("");
            }
        }
    }, [user]);

    const getBookingOpenDate = (rangeStartDate) => {
        const openDate = new Date(rangeStartDate);
        openDate.setDate(openDate.getDate() - (INITIAL_SELECTION_DAYS - 1));
        openDate.setUTCHours(0, 0, 0, 0);
        return openDate;
    };

    const isBookingAllowedToday = (rangeStartDate) => {
        const bookingOpenDate = getBookingOpenDate(rangeStartDate);
        const todayUTC = new Date();
        todayUTC.setUTCHours(0, 0, 0, 0);
        return todayUTC >= bookingOpenDate;
    };

// // Updated confirmDates function with proper error handling
// const confirmDates = async () => {
//   if (!selectedDates.start || !selectedDates.end) {
//     setCalendarErrorMessage("Please select start and end dates.");
//     return;
//   }

//   // Set loading state for calendar button
//   setIsProcessingBooking(true);

//   try {
//     // Validate pricePerDay exists
//     const pricePerDayValue = currentProduct?.displayPrice || currentProduct?.price || 0;
    
//     if (pricePerDayValue === 0) {
//       console.warn("Price per day is 0, check product data:", currentProduct);
//     }

//     // Use single API for conflict checking
//     const response = await fetch(`${baseUrl}/check-date-conflicts`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         prodCode: currentProduct?.prodCode,
//         startDate: selectedDates.start.toISOString(),
//         endDate: selectedDates.end.toISOString(),
//         productId: currentProduct?.id,
//         productName: currentProduct?.prodName
//       })
//     });
    
//     // Check if response is OK
//     if (!response.ok) {
//       const errorText = await response.text();
//       console.error("API Error Response:", errorText);
//       throw new Error(`Server responded with status ${response.status}: ${errorText}`);
//     }
    
//     const availabilityCheck = await response.json();

//     if (!availabilityCheck.success) {
//       setCalendarErrorMessage(availabilityCheck.message || "Failed to check date availability. Please try again.");
//       setIsProcessingBooking(false);
//       return;
//     }

//     if (!availabilityCheck.isAvailable && availabilityCheck.hasConflicts) {
//       // Dates are booked - show error
//       setCalendarErrorMessage(
//         `Sorry! ${availabilityCheck.confirmedConflictCount} date(s) in your selection are already booked.\n` +
//         `Please select new dates.`
//       );
//       setIsProcessingBooking(false);
//       return;
//     }

//     const validation = validateMinimumDays(selectedDates.start, selectedDates.end);

//     if (!validation.valid) {
//       setCalendarErrorMessage(validation.message);
//       setIsProcessingBooking(false);
//       return;
//     }

//     const conflictBlocks = getConflictBlocks(selectedDates.start, selectedDates.end);

//     if (conflictBlocks.length >= 2) {
//       setCalendarErrorMessage(
//         `Selected range has ${conflictBlocks.length} separate booked periods.\n` +
//         `Please select a continuous available period.`
//       );
//       setIsProcessingBooking(false);
//       return;
//     }

//     // Reset dates used flag when confirming new dates
//     setDatesUsedForAction(false);

//     // Store confirmed dates and LOCK them
//     setCampaignConfirmedDates({
//       start: new Date(selectedDates.start),
//       end: new Date(selectedDates.end),
//     });

//     // Lock dates to prevent further modifications
//     setAreDatesLocked(true);
//     setIsSelectionConfirmed(true);
//     setCurrentWindowStart(new Date(selectedDates.start));
//     setCurrentWindowEnd(new Date(selectedDates.end));
//     setIsWindowExpanded(false);

//     const pendingCount = getPendingDaysInRange(selectedDates.start, selectedDates.end);
//     const availableDaysInRange = getAvailableDaysInRange(selectedDates.start, selectedDates.end);
//     const totalDays = availableDaysInRange.length;
//     const totalPrice = totalDays * pricePerDayValue;

//     setBookingConfirmation({
//       start: selectedDates.start,
//       end: selectedDates.end,
//       totalDays: validation.days,
//       availableDays: validation.availableDays,
//       totalPrice: totalPrice,
//       pendingCount: pendingCount
//     });

//     // Show success message with queue info if applicable
//     if (pendingCount > 0) {
//       toast.info(`${pendingCount} date(s) in your selection are in queue. You'll be added to the waitlist.`);
//     } else {
//       toast.success("Dates confirmed successfully!");
//     }

//     // Close calendar after 2 seconds
//     setTimeout(() => {
//       setCalendarErrorMessage("");
//       setIsCalendarOpen(false);
//       setIsProcessingBooking(false);
//     }, 2000);
    
//   } catch (error) {
//     console.error("Error in confirmDates:", error);
//     setCalendarErrorMessage(`An error occurred: ${error.message || "Please try again."}`);
//     setIsProcessingBooking(false);
//   }
// };

// Updated confirmDates function - Shows selected border for pending dates
const confirmDates = async () => {
  if (!selectedDates.start || !selectedDates.end) {
    setCalendarErrorMessage("Please select start and end dates.");
    return;
  }

  // Set loading state for calendar button
  setIsProcessingBooking(true);

  try {
    // Refresh the latest date statuses from server
    await fetchDates();
    await new Promise(resolve => setTimeout(resolve, 100));

    const validation = validateMinimumDays(selectedDates.start, selectedDates.end);

    if (!validation.valid) {
      setCalendarErrorMessage(validation.message);
      setIsProcessingBooking(false);
      return;
    }

    // Check for booked dates in range
    let hasBookedDatesInRange = false;
    let bookedDatesList = [];
    let pendingDatesList = [];
    
    const currentDate = new Date(selectedDates.start);
    const endDateCheck = new Date(selectedDates.end);
    
    while (currentDate <= endDateCheck) {
      if (isDateBooked(currentDate)) {
        hasBookedDatesInRange = true;
        bookedDatesList.push(new Date(currentDate));
      }
      if (isDatePending(currentDate)) {
        pendingDatesList.push(new Date(currentDate));
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // If there are booked dates, show error
    if (hasBookedDatesInRange) {
      const bookedDatesStr = bookedDatesList.map(d => 
        d.toLocaleDateString("en-IN", { day: "numeric", month: "short" })
      ).join(", ");
      setCalendarErrorMessage(
        `Cannot confirm: The following date(s) are already booked: ${bookedDatesStr}. Please select different dates.`
      );
      setIsProcessingBooking(false);
      return;
    }

    const conflictBlocks = getConflictBlocks(selectedDates.start, selectedDates.end);

    if (conflictBlocks.length >= 2) {
      setCalendarErrorMessage(
        `Selected range has ${conflictBlocks.length} separate booked periods.\n` +
        `Please select a continuous available period.`
      );
      setIsProcessingBooking(false);
      return;
    }

    // Reset dates used flag when confirming new dates
    setDatesUsedForAction(false);

    // Store confirmed dates and LOCK them
    setCampaignConfirmedDates({
      start: new Date(selectedDates.start),
      end: new Date(selectedDates.end),
    });

    // Lock dates to prevent further modifications
    setAreDatesLocked(true);
    setIsSelectionConfirmed(true);
    setCurrentWindowStart(new Date(selectedDates.start));
    setCurrentWindowEnd(new Date(selectedDates.end));
    setIsWindowExpanded(false);

    const pendingCount = pendingDatesList.length;
    const availableDaysInRange = getAvailableDaysInRange(selectedDates.start, selectedDates.end);
    const totalDays = availableDaysInRange.length;
    const totalPrice = totalDays * pricePerDay;

    setBookingConfirmation({
      start: selectedDates.start,
      end: selectedDates.end,
      totalDays: validation.days,
      availableDays: validation.availableDays,
      totalPrice: totalPrice,
      pendingCount: pendingCount
    });

    // Show success message
    if (pendingCount > 0) {
      toast.info(`${pendingCount} date(s) in your selection are in queue. You'll be added to the waitlist.`);
    } else {
      toast.success("Dates confirmed successfully!");
    }

    // Close calendar after 2 seconds
    setTimeout(() => {
      setCalendarErrorMessage("");
      setIsCalendarOpen(false);
      setIsProcessingBooking(false);
    }, 2000);
    
  } catch (error) {
    console.error("Error in confirmDates:", error);
    setCalendarErrorMessage(`An error occurred: ${error.message || "Please try again."}`);
    setIsProcessingBooking(false);
  }
};

// Add this function to your BookASite1 component - Date availability check
const checkDateAvailability = async (startDate, endDate, prodCode, excludeOrderId = null) => {
  try {
    const params = new URLSearchParams({
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString()
    });
    if (excludeOrderId) {
      params.append('excludeOrderId', excludeOrderId);
    }
    
    const response = await fetch(`${baseUrl}/check-single-date-availability/${prodCode}?${params.toString()}`);
    const data = await response.json();
    
    return data;
  } 
  catch (error) {
    console.error("Error checking date availability:", error);
    return {
      success: false,
      isAvailable: false,
      message: "Failed to check date availability"
    };
  }
};

    // // BOOK NOW FUNCTION - Called after dates are confirmed
    // const proceedToBooking = async (startDate, endDate) => {
    //     if (!user) {
    //         console.error('proceedToBooking called without user logged in');
    //         return;
    //     }

    //     if (!startDate || !endDate) {
    //         toast.error("Please select and confirm dates first");
    //         setIsCalendarOpen(true);
    //         return;
    //     }

    //     setIsProcessingBooking(true);

    //     const finalConflictCheck = await checkDateConflictsInRealTime(startDate, endDate);

    //     if (finalConflictCheck.hasConflicts) {
    //         setCalendarErrorMessage(
    //             `Sorry! Selected dates are no longer available.\n` +
    //             `${finalConflictCheck.confirmedConflictCount} date(s) have been booked.\n` +
    //             `Please select new dates.`
    //         );
    //         setIsCalendarOpen(true);
    //         setIsProcessingBooking(false);
    //         return;
    //     }

    //     const validation = validateMinimumDays(startDate, endDate);

    //     if (!validation.valid) {
    //         setCalendarErrorMessage(validation.message);
    //         setIsCalendarOpen(true);
    //         setIsProcessingBooking(false);
    //         return;
    //     }

    //     const conflictBlocks = getConflictBlocks(startDate, endDate);

    //     if (conflictBlocks.length >= 2) {
    //         setCalendarErrorMessage(
    //             `Selected range has ${conflictBlocks.length} separate booked periods.\n` +
    //             `Please select a continuous available period.`
    //         );
    //         setIsCalendarOpen(true);
    //         setIsProcessingBooking(false);
    //         return;
    //     }

    //     const pendingCount = getPendingDaysInRange(startDate, endDate);
    //     const availableDaysInRange = getAvailableDaysInRange(startDate, endDate);
    //     const totalDays = availableDaysInRange.length;
    //     const totalPrice = totalDays * pricePerDay;
    //     const actualPrice = currentProduct?.displayPrice || currentProduct?.price || 0;

    //     if (pendingCount > 0) {
    //         const confirmBooking = window.confirm(
    //             `Warning: ${pendingCount} date${pendingCount > 1 ? 's' : ''} in your selection are in queue.\n\n` +
    //             `You'll be added to the queue for these dates.\n` +
    //             `If pending orders get cancelled, your booking will be confirmed.\n\n` +
    //             `Do you want to proceed to billing?`
    //         );

    //         if (!confirmBooking) {
    //             setIsProcessingBooking(false);
    //             return;
    //         }
    //     }

    //     const reserveItem = {
    //         id: currentProduct?.id,
    //         prodCode: currentProduct?.prodCode,
    //         image: currentProduct?.imageUrl,
    //         prodName: currentProduct?.prodName,
    //         title: currentProduct?.location,
    //         price: actualPrice,
    //         rating: currentProduct?.rating,
    //         district: currentProduct?.district,
    //         state: currentProduct?.state,
    //         dateRange: startDate
    //             ? `${startDate.toLocaleString("en-IN", { month: "short" })} ${startDate.getDate()} - ${endDate
    //                 ? `${endDate.toLocaleString("en-IN", { month: "short" })} ${endDate.getDate()}`
    //                 : "--"
    //             }`
    //             : "N/A",
    //         startDate: startDate,
    //         endDate: endDate,
    //         sizeWidth: currentProduct?.sizeWidth,
    //         sizeHeight: currentProduct?.sizeHeight,
    //         sizeSide: currentProduct?.sizeSide,
    //         productsquareFeet: currentProduct?.productsquareFeet,
    //         dimension: (currentProduct?.sizeHeight || 0) * (currentProduct?.sizeWidth || 0),
    //         adType: currentProduct?.category,
    //         totalAmount: totalPrice,
    //         totalDays: totalDays,
    //         SpotOutdoorType: currentProduct?.prodLighting,
    //         PrintingCost: currentProduct?.printingCost,
    //         MountingCost: currentProduct?.mountingCost,
    //         FromSpot: currentProduct?.productFrom,
    //         ToSpot: currentProduct?.productTo,
    //         SpotPay: currentProduct?.productFixedAmount,
    //         Offer: currentProduct?.productFixedOffer,
    //         latitude: currentProduct?.latitude,
    //         longitude: currentProduct?.longitude,
    //         LocationLink: currentProduct?.LocationLink,
    //         userId: user._id,
    //         userEmail: user.email,
    //         userPhone: user.phone,
    //         userName: user.userName,
    //         isOfferProduct: currentProduct?.isOfferProduct || false,
    //         originalPrice: currentProduct?.originalPrice || actualPrice,
    //         queueStatus: pendingCount > 0 ? 'pending' : 'direct',
    //         pendingDatesCount: pendingCount
    //     };

    //     console.log('Proceeding to billing with:', {
    //         productId: reserveItem.id,
    //         prodCode: reserveItem.prodCode,
    //         dateRange: reserveItem.dateRange,
    //         totalDays: reserveItem.totalDays,
    //         totalAmount: reserveItem.totalAmount
    //     });

    //     // Clear product-specific localStorage
    //     if (currentProduct?.id) {
    //         localStorage.removeItem(`pendingBookingAfterLogin_${currentProduct.id}`);
    //     }
    //     localStorage.removeItem('pendingBookingAfterLogin');

    //     // Mark dates as used to prevent reuse
    //     setDatesUsedForAction(true);

    //     navigate("/billing", {
    //         state: {
    //             reserveItem,
    //             queueInfo: {
    //                 hasQueue: pendingCount > 0,
    //                 queueMessage: pendingCount > 0 ?
    //                     `Your booking includes ${pendingCount} date${pendingCount > 1 ? 's' : ''} that are in queue. You'll be added to the waitlist.` :
    //                     'All dates are available for immediate confirmation.'
    //             }
    //         }
    //     });

    //     setIsProcessingBooking(false);
    // };


//     // Updated proceedToBooking function with availability check
// const proceedToBooking = async (startDate, endDate) => {
//   if (!user) {
//     console.error('proceedToBooking called without user logged in');
//     return;
//   }

//   if (!startDate || !endDate) {
//     toast.error("Please select and confirm dates first");
//     setIsCalendarOpen(true);
//     return;
//   }

//   setIsProcessingBooking(true);

//   try {
//     // Check date availability before proceeding
//     const availabilityCheck = await checkDateAvailability(
//       startDate, 
//       endDate, 
//       currentProduct?.prodCode
//     );

//     if (!availabilityCheck.success) {
//       toast.error("Failed to check date availability. Please try again.");
//       setIsProcessingBooking(false);
//       return;
//     }

//     if (!availabilityCheck.isAvailable) {
//       // Dates are not available - show alert
//       if (availabilityCheck.hasConflicts) {
//         toast.error(
//           `Sorry! ${availabilityCheck.confirmedConflictCount} date(s) in your selection are already booked. Please select new dates.`
//         );
//       } else if (availabilityCheck.hasQueueDates) {
//         // This shouldn't happen for direct booking, but handle anyway
//         toast.warning(
//           `${availabilityCheck.pendingConflictCount} date(s) in your selection are in queue. You'll be added to the waitlist.`
//         );
//       }
//       setIsCalendarOpen(true);
//       setIsProcessingBooking(false);
//       return;
//     }

//     // Dates are available - proceed with booking
//     const validation = validateMinimumDays(startDate, endDate);

//     if (!validation.valid) {
//       setCalendarErrorMessage(validation.message);
//       setIsCalendarOpen(true);
//       setIsProcessingBooking(false);
//       return;
//     }

//     const conflictBlocks = getConflictBlocks(startDate, endDate);

//     if (conflictBlocks.length >= 2) {
//       setCalendarErrorMessage(
//         `Selected range has ${conflictBlocks.length} separate booked periods.\n` +
//         `Please select a continuous available period.`
//       );
//       setIsCalendarOpen(true);
//       setIsProcessingBooking(false);
//       return;
//     }

//     const pendingCount = getPendingDaysInRange(startDate, endDate);
//     const availableDaysInRange = getAvailableDaysInRange(startDate, endDate);
//     const totalDays = availableDaysInRange.length;
//     const totalPrice = totalDays * pricePerDay;
//     const actualPrice = currentProduct?.displayPrice || currentProduct?.price || 0;

//     // // Show queue warning if there are pending dates
//     // if (pendingCount > 0) {
//     //   const confirmBooking = window.confirm(
//     //     `Warning: ${pendingCount} date${pendingCount > 1 ? 's' : ''} in your selection are in queue.\n\n` +
//     //     `You'll be added to the queue for these dates.\n` +
//     //     `If pending orders get cancelled, your booking will be confirmed.\n\n` +
//     //     `Do you want to proceed to billing?`
//     //   );

//     //   if (!confirmBooking) {
//     //     setIsProcessingBooking(false);
//     //     return;
//     //   }
//     // }

//     const reserveItem = {
//       id: currentProduct?.id,
//       prodCode: currentProduct?.prodCode,
//       image: currentProduct?.imageUrl,
//       prodName: currentProduct?.prodName,
//       title: currentProduct?.location,
//       price: actualPrice,
//       rating: currentProduct?.rating,
//       district: currentProduct?.district,
//       state: currentProduct?.state,
//       dateRange: startDate
//         ? `${startDate.toLocaleString("en-IN", { month: "short" })} ${startDate.getDate()} - ${endDate
//             ? `${endDate.toLocaleString("en-IN", { month: "short" })} ${endDate.getDate()}`
//             : "--"
//           }`
//         : "N/A",
//       startDate: startDate,
//       endDate: endDate,
//       sizeWidth: currentProduct?.sizeWidth,
//       sizeHeight: currentProduct?.sizeHeight,
//       sizeSide: currentProduct?.sizeSide,
//       productsquareFeet: currentProduct?.productsquareFeet,
//       dimension: (currentProduct?.sizeHeight || 0) * (currentProduct?.sizeWidth || 0),
//       adType: currentProduct?.category,
//       totalAmount: totalPrice,
//       totalDays: totalDays,
//       SpotOutdoorType: currentProduct?.prodLighting,
//       PrintingCost: currentProduct?.printingCost,
//       MountingCost: currentProduct?.mountingCost,
//       FromSpot: currentProduct?.productFrom,
//       ToSpot: currentProduct?.productTo,
//       SpotPay: currentProduct?.productFixedAmount,
//       Offer: currentProduct?.productFixedOffer,
//       latitude: currentProduct?.latitude,
//       longitude: currentProduct?.longitude,
//       LocationLink: currentProduct?.LocationLink,
//       userId: user._id,
//       userEmail: user.email,
//       userPhone: user.phone,
//       userName: user.userName,
//       isOfferProduct: currentProduct?.isOfferProduct || false,
//       originalPrice: currentProduct?.originalPrice || actualPrice,
//       queueStatus: pendingCount > 0 ? 'pending' : 'direct',
//       pendingDatesCount: pendingCount
//     };

//     console.log('Proceeding to billing with:', {
//       productId: reserveItem.id,
//       prodCode: reserveItem.prodCode,
//       dateRange: reserveItem.dateRange,
//       totalDays: reserveItem.totalDays,
//       totalAmount: reserveItem.totalAmount
//     });

//     // Clear product-specific localStorage
//     if (currentProduct?.id) {
//       localStorage.removeItem(`pendingBookingAfterLogin_${currentProduct.id}`);
//     }
//     localStorage.removeItem('pendingBookingAfterLogin');

//     // Mark dates as used to prevent reuse
//     setDatesUsedForAction(true);

//     navigate("/billing", {
//       state: {
//         reserveItem,
//         queueInfo: {
//           hasQueue: pendingCount > 0,
//           queueMessage: pendingCount > 0 ?
//             `Your booking includes ${pendingCount} date${pendingCount > 1 ? 's' : ''} that are in queue. You'll be added to the waitlist.` :
//             'All dates are available for immediate confirmation.'
//         }
//       }
//     });
//   } catch (error) {
//     console.error("Error in proceedToBooking:", error);
//     toast.error("An error occurred. Please try again.");
//   } finally {
//     setIsProcessingBooking(false);
//   }
// };


// Updated proceedToBooking function with single API conflict check
const proceedToBooking = async (startDate, endDate) => {
  if (!user) {
    console.error('proceedToBooking called without user logged in');
    return;
  }

  if (!startDate || !endDate) {
    toast.error("Please select and confirm dates first");
    setIsCalendarOpen(true);
    return;
  }

  setIsProcessingBooking(true);

  try {
    // Use single API for conflict checking
    const response = await fetch(`${baseUrl}/check-date-conflicts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prodCode: currentProduct?.prodCode,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        productId: currentProduct?.id,
        productName: currentProduct?.prodName
      })
    });
    
    const availabilityCheck = await response.json();

    if (!availabilityCheck.success) {
      toast.error("Failed to check date availability. Please try again.");
      setIsProcessingBooking(false);
      return;
    }

    if (!availabilityCheck.isAvailable) {
      // Dates are not available - show alert
      if (availabilityCheck.hasConflicts) {
        toast.error(
          `Sorry! ${availabilityCheck.confirmedConflictCount} date(s) in your selection are already booked. Please select new dates.`
        );
      } else if (availabilityCheck.hasQueueDates) {
        toast.warning(
          `${availabilityCheck.pendingConflictCount} date(s) in your selection are in queue. You'll be added to the waitlist.`
        );
      }
      setIsCalendarOpen(true);
      setIsProcessingBooking(false);
      return;
    }

    // Dates are available - proceed with booking
    const validation = validateMinimumDays(startDate, endDate);

    if (!validation.valid) {
      setCalendarErrorMessage(validation.message);
      setIsCalendarOpen(true);
      setIsProcessingBooking(false);
      return;
    }

    const conflictBlocks = getConflictBlocks(startDate, endDate);

    if (conflictBlocks.length >= 2) {
      setCalendarErrorMessage(
        `Selected range has ${conflictBlocks.length} separate booked periods.\n` +
        `Please select a continuous available period.`
      );
      setIsCalendarOpen(true);
      setIsProcessingBooking(false);
      return;
    }

    const pendingCount = getPendingDaysInRange(startDate, endDate);
    const availableDaysInRange = getAvailableDaysInRange(startDate, endDate);
    const totalDays = availableDaysInRange.length;
    const totalPrice = totalDays * pricePerDay;
    const actualPrice = currentProduct?.displayPrice || currentProduct?.price || 0;

    // Show queue warning if there are pending dates
    if (pendingCount > 0) {
      const confirmBooking = window.confirm(
        `Warning: ${pendingCount} date${pendingCount > 1 ? 's' : ''} in your selection are in queue.\n\n` +
        `You'll be added to the queue for these dates.\n` +
        `If pending orders get cancelled, your booking will be confirmed.\n\n` +
        `Do you want to proceed to billing?`
      );

      if (!confirmBooking) {
        setIsProcessingBooking(false);
        return;
      }
    }

    const reserveItem = {
      id: currentProduct?.id,
      prodCode: currentProduct?.prodCode,
      image: currentProduct?.imageUrl,
      prodName: currentProduct?.prodName,
      title: currentProduct?.location,
      price: actualPrice,
      rating: currentProduct?.rating,
      district: currentProduct?.district,
      state: currentProduct?.state,
      dateRange: startDate
        ? `${startDate.toLocaleString("en-IN", { month: "short" })} ${startDate.getDate()} - ${endDate
            ? `${endDate.toLocaleString("en-IN", { month: "short" })} ${endDate.getDate()}`
            : "--"
          }`
        : "N/A",
      startDate: startDate,
      endDate: endDate,
      sizeWidth: currentProduct?.sizeWidth,
      sizeHeight: currentProduct?.sizeHeight,
      sizeSide: currentProduct?.sizeSide,
      productsquareFeet: currentProduct?.productsquareFeet,
      dimension: (currentProduct?.sizeHeight || 0) * (currentProduct?.sizeWidth || 0),
      adType: currentProduct?.category,
      totalAmount: totalPrice,
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
      originalPrice: currentProduct?.originalPrice || actualPrice,
      queueStatus: pendingCount > 0 ? 'pending' : 'direct',
      pendingDatesCount: pendingCount
    };

    console.log('Proceeding to billing with:', {
      productId: reserveItem.id,
      prodCode: reserveItem.prodCode,
      dateRange: reserveItem.dateRange,
      totalDays: reserveItem.totalDays,
      totalAmount: reserveItem.totalAmount
    });

    // Clear product-specific localStorage
    if (currentProduct?.id) {
      localStorage.removeItem(`pendingBookingAfterLogin_${currentProduct.id}`);
    }
    localStorage.removeItem('pendingBookingAfterLogin');

    // Mark dates as used to prevent reuse
    setDatesUsedForAction(true);

    navigate("/billing", {
      state: {
        reserveItem,
        queueInfo: {
          hasQueue: pendingCount > 0,
          queueMessage: pendingCount > 0 ?
            `Your booking includes ${pendingCount} date${pendingCount > 1 ? 's' : ''} that are in queue. You'll be added to the waitlist.` :
            'All dates are available for immediate confirmation.'
        }
      }
    });
  } catch (error) {
    console.error("Error in proceedToBooking:", error);
    toast.error("An error occurred. Please try again.");
  } finally {
    setIsProcessingBooking(false);
  }
};



    // // ADD TO CART HANDLER - Fixed to prevent double addition
    // const handleAddToCart = async () => {
    //     // Prevent double submission
    //     if (isAddingToCart) {
    //         console.log('Add to cart already in progress');
    //         return;
    //     }

    //     // Check if dates have already been used for cart/booking
    //     if (datesUsedForAction) {
    //         toast.warning("These dates have already been used. Please select new dates.");
    //         resetDates();
    //         return;
    //     }

    //     // Check if dates are confirmed and locked
    //     const hasConfirmedDates = campaignConfirmedDates.start && campaignConfirmedDates.end && areDatesLocked;

    //     if (!hasConfirmedDates) {
    //         // No dates confirmed, open calendar for selection
    //         if (!isCalendarOpen) {
    //             await fetchDates();
    //             toggleCalendar();
    //         } else {
    //             setCalendarErrorMessage("Please confirm your selected dates first by clicking 'Reserve & Book'");
    //         }
    //         return;
    //     }

    //     // Check if user is logged in
    //     if (!user) {
    //         console.log('User not logged in for add to cart');
    //         if (currentProduct?.id) {
    //             localStorage.setItem(`pendingBookingAfterLogin_${currentProduct.id}`, JSON.stringify({
    //                 productId: currentProduct?.id,
    //                 prodCode: currentProduct?.prodCode,
    //                 startDate: campaignConfirmedDates.start.toISOString(),
    //                 endDate: campaignConfirmedDates.end.toISOString(),
    //                 returnUrl: window.location.pathname,
    //                 timestamp: new Date().toISOString(),
    //                 action: 'addToCart'
    //             }));
    //         }

    //         if (isCalendarOpen) {
    //             setShowLoginPrompt(true);
    //             setCalendarErrorMessage("Please log in to continue with your booking");
    //             setTimeout(() => {
    //                 setShowLoginPrompt(false);
    //                 setIsCalendarOpen(false);
    //                 setCalendarErrorMessage("");
    //                 openLogin();
    //             }, 2000);
    //         } else {
    //             openLogin();
    //         }
    //         return;
    //     }

    //     // Set adding to cart flag
    //     setIsAddingToCart(true);

    //     try {
    //         // Validate confirmed dates
    //         const validation = validateMinimumDays(campaignConfirmedDates.start, campaignConfirmedDates.end);

    //         if (!validation.valid) {
    //             setCalendarErrorMessage(validation.message);
    //             setIsCalendarOpen(true);
    //             setIsAddingToCart(false);
    //             return;
    //         }

    //         const conflictBlocks = getConflictBlocks(campaignConfirmedDates.start, campaignConfirmedDates.end);
    //         if (conflictBlocks.length >= 2) {
    //             setCalendarErrorMessage(
    //                 `Selected range has ${conflictBlocks.length} separate booked periods.\n` +
    //                 `Please select a new date range.`
    //             );
    //             setIsCalendarOpen(true);
    //             setIsAddingToCart(false);
    //             return;
    //         }

    //         const confirmedAvailableDays = getAvailableDaysInRange(campaignConfirmedDates.start, campaignConfirmedDates.end);
    //         const confirmedTotalDays = confirmedAvailableDays.length;
    //         const confirmedTotalPrice = confirmedTotalDays * pricePerDay;
    //         const confirmedPendingCount = getPendingDaysInRange(campaignConfirmedDates.start, campaignConfirmedDates.end);
    //         const actualPrice = currentProduct?.displayPrice || currentProduct?.price || 0;

    //         const cartItem = {
    //             userId: user._id,
    //             productId: currentProduct?.id,
    //             prodCode: currentProduct?.prodCode,
    //             image: currentProduct?.imageUrl,
    //             prodName: currentProduct?.prodName,
    //             title: currentProduct?.location,
    //             price: actualPrice,
    //             rating: currentProduct?.rating,
    //             district: currentProduct?.district,
    //             state: currentProduct?.state,
    //             dateRange: campaignConfirmedDates.start
    //                 ? `${campaignConfirmedDates.start.toLocaleString("en-IN", { month: "short" })} ${campaignConfirmedDates.start.getDate()} - ${campaignConfirmedDates.end
    //                     ? `${campaignConfirmedDates.end.toLocaleString("en-IN", { month: "short" })} ${campaignConfirmedDates.end.getDate()}`
    //                     : "--"
    //                 }`
    //                 : "N/A",
    //             startDate: campaignConfirmedDates.start,
    //             endDate: campaignConfirmedDates.end,
    //             sizeWidth: currentProduct?.sizeWidth,
    //             sizeHeight: currentProduct?.sizeHeight,
    //             sizeSide: currentProduct?.sizeSide,
    //             productsquareFeet: currentProduct?.productsquareFeet,
    //             dimension: (currentProduct?.sizeHeight || 0) * (currentProduct?.sizeWidth || 0),
    //             adType: currentProduct?.category,
    //             totalAmount: confirmedTotalPrice,
    //             totalDays: confirmedTotalDays,
    //             SpotOutdoorType: currentProduct?.prodLighting,
    //             PrintingCost: currentProduct?.printingCost,
    //             MountingCost: currentProduct?.mountingCost,
    //             FromSpot: currentProduct?.productFrom,
    //             ToSpot: currentProduct?.productTo,
    //             SpotPay: currentProduct?.productFixedAmount,
    //             Offer: currentProduct?.productFixedOffer,
    //             latitude: currentProduct?.latitude,
    //             longitude: currentProduct?.longitude,
    //             LocationLink: currentProduct?.LocationLink,
    //             userEmail: user.email,
    //             userPhone: user.phone,
    //             userName: user.userName,
    //             isOfferProduct: currentProduct?.isOfferProduct || false,
    //             originalPrice: currentProduct?.originalPrice || actualPrice,
    //             queueInfo: {
    //                 hasPendingDates: confirmedPendingCount > 0,
    //                 pendingCount: confirmedPendingCount,
    //                 enteredQueueAt: new Date().toISOString()
    //             }
    //         };

    //         const response = await fetch(`${baseUrl}/cart`, {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify(cartItem)
    //         });

    //         const responseData = await response.json();

    //         if (response.ok) {
    //             toast.success("Item added to cart successfully!");
    //             // Mark dates as used to prevent reuse
    //             setDatesUsedForAction(true);
    //             // Clear confirmed dates after adding to cart and unlock
    //             setAreDatesLocked(false);
    //             setCampaignConfirmedDates({ start: null, end: null });
    //             setSelectedDates({ start: null, end: null });
    //             navigate("/cart");
    //         } else {
    //             throw new Error(responseData.message || 'Failed to add to cart');
    //         }
    //     } 
        
    //     catch (error) {
    //         console.error('Error adding to cart:', error);
    //         toast.error(`Failed to add item to cart: ${error.message}`);
    //     } finally {
    //         setIsAddingToCart(false);
    //     }
    // };



//     // Updated handleAddToCart function with availability check
// const handleAddToCart = async () => {
//   // Prevent double submission
//   if (isAddingToCart) {
//     console.log('Add to cart already in progress');
//     return;
//   }

//   // Check if dates have already been used for cart/booking
//   if (datesUsedForAction) {
//     toast.warning("These dates have already been used. Please select new dates.");
//     resetDates();
//     return;
//   }

//   // Check if dates are confirmed and locked
//   const hasConfirmedDates = campaignConfirmedDates.start && campaignConfirmedDates.end && areDatesLocked;

//   if (!hasConfirmedDates) {
//     // No dates confirmed, open calendar for selection
//     if (!isCalendarOpen) {
//       await fetchDates();
//       toggleCalendar();
//     } else {
//       setCalendarErrorMessage("Please confirm your selected dates first by clicking 'Confirm Date'");
//     }
//     return;
//   }

//   // Check if user is logged in
//   if (!user) {
//     console.log('User not logged in for add to cart');
//     if (currentProduct?.id) {
//       localStorage.setItem(`pendingBookingAfterLogin_${currentProduct.id}`, JSON.stringify({
//         productId: currentProduct?.id,
//         prodCode: currentProduct?.prodCode,
//         startDate: campaignConfirmedDates.start.toISOString(),
//         endDate: campaignConfirmedDates.end.toISOString(),
//         returnUrl: window.location.pathname,
//         timestamp: new Date().toISOString(),
//         action: 'addToCart'
//       }));
//     }

//     if (isCalendarOpen) {
//       setShowLoginPrompt(true);
//       setCalendarErrorMessage("Please log in to continue with your booking");
//       setTimeout(() => {
//         setShowLoginPrompt(false);
//         setIsCalendarOpen(false);
//         setCalendarErrorMessage("");
//         openLogin();
//       }, 2000);
//     } else {
//       openLogin();
//     }
//     return;
//   }

//   // Set adding to cart flag
//   setIsAddingToCart(true);

//   try {
//     // Check date availability before adding to cart
//     const availabilityCheck = await checkDateAvailability(
//       campaignConfirmedDates.start,
//       campaignConfirmedDates.end,
//       currentProduct?.prodCode
//     );

//     if (!availabilityCheck.success) {
//       toast.error("Failed to check date availability. Please try again.");
//       setIsAddingToCart(false);
//       return;
//     }

//     if (!availabilityCheck.isAvailable) {
//       // Dates are not available
//       if (availabilityCheck.hasConflicts) {
//         toast.error(
//           `Sorry! ${availabilityCheck.confirmedConflictCount} date(s) in your selection are already booked. Please select new dates.`
//         );
//       } else if (availabilityCheck.hasQueueDates) {
//         // Show queue warning for cart as well
//         const confirmQueue = window.confirm(
//           `Warning: ${availabilityCheck.pendingConflictCount} date(s) in your selection are in queue.\n\n` +
//           `If you add to cart, you'll be placed in the waitlist for these dates.\n` +
//           `Do you want to continue?`
//         );
        
//         if (!confirmQueue) {
//           setIsAddingToCart(false);
//           return;
//         }
//       }
      
//       // If dates are not available (confirmed conflicts), don't proceed
//       if (availabilityCheck.hasConflicts) {
//         setIsCalendarOpen(true);
//         setIsAddingToCart(false);
//         return;
//       }
//     }

//     // Validate confirmed dates
//     const validation = validateMinimumDays(campaignConfirmedDates.start, campaignConfirmedDates.end);

//     if (!validation.valid) {
//       setCalendarErrorMessage(validation.message);
//       setIsCalendarOpen(true);
//       setIsAddingToCart(false);
//       return;
//     }

//     const conflictBlocks = getConflictBlocks(campaignConfirmedDates.start, campaignConfirmedDates.end);
//     if (conflictBlocks.length >= 2) {
//       setCalendarErrorMessage(
//         `Selected range has ${conflictBlocks.length} separate booked periods.\n` +
//         `Please select a new date range.`
//       );
//       setIsCalendarOpen(true);
//       setIsAddingToCart(false);
//       return;
//     }

//     const confirmedAvailableDays = getAvailableDaysInRange(campaignConfirmedDates.start, campaignConfirmedDates.end);
//     const confirmedTotalDays = confirmedAvailableDays.length;
//     const confirmedTotalPrice = confirmedTotalDays * pricePerDay;
//     const confirmedPendingCount = getPendingDaysInRange(campaignConfirmedDates.start, campaignConfirmedDates.end);
//     const actualPrice = currentProduct?.displayPrice || currentProduct?.price || 0;

//     const cartItem = {
//       userId: user._id,
//       productId: currentProduct?.id,
//       prodCode: currentProduct?.prodCode,
//       image: currentProduct?.imageUrl,
//       prodName: currentProduct?.prodName,
//       title: currentProduct?.location,
//       price: actualPrice,
//       rating: currentProduct?.rating,
//       district: currentProduct?.district,
//       state: currentProduct?.state,
//       dateRange: campaignConfirmedDates.start
//         ? `${campaignConfirmedDates.start.toLocaleString("en-IN", { month: "short" })} ${campaignConfirmedDates.start.getDate()} - ${campaignConfirmedDates.end
//             ? `${campaignConfirmedDates.end.toLocaleString("en-IN", { month: "short" })} ${campaignConfirmedDates.end.getDate()}`
//             : "--"
//           }`
//         : "N/A",
//       startDate: campaignConfirmedDates.start,
//       endDate: campaignConfirmedDates.end,
//       sizeWidth: currentProduct?.sizeWidth,
//       sizeHeight: currentProduct?.sizeHeight,
//       sizeSide: currentProduct?.sizeSide,
//       productsquareFeet: currentProduct?.productsquareFeet,
//       dimension: (currentProduct?.sizeHeight || 0) * (currentProduct?.sizeWidth || 0),
//       adType: currentProduct?.category,
//       totalAmount: confirmedTotalPrice,
//       totalDays: confirmedTotalDays,
//       SpotOutdoorType: currentProduct?.prodLighting,
//       PrintingCost: currentProduct?.printingCost,
//       MountingCost: currentProduct?.mountingCost,
//       FromSpot: currentProduct?.productFrom,
//       ToSpot: currentProduct?.productTo,
//       SpotPay: currentProduct?.productFixedAmount,
//       Offer: currentProduct?.productFixedOffer,
//       latitude: currentProduct?.latitude,
//       longitude: currentProduct?.longitude,
//       LocationLink: currentProduct?.LocationLink,
//       userEmail: user.email,
//       userPhone: user.phone,
//       userName: user.userName,
//       isOfferProduct: currentProduct?.isOfferProduct || false,
//       originalPrice: currentProduct?.originalPrice || actualPrice,
//       queueInfo: {
//         hasPendingDates: confirmedPendingCount > 0,
//         pendingCount: confirmedPendingCount,
//         enteredQueueAt: new Date().toISOString()
//       }
//     };

//     const response = await fetch(`${baseUrl}/cart`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(cartItem)
//     });

//     const responseData = await response.json();

//     if (response.ok) {
//       toast.success(confirmedPendingCount > 0 
//         ? "Item added to cart with queue status!" 
//         : "Item added to cart successfully!");
//       // Mark dates as used to prevent reuse
//       setDatesUsedForAction(true);
//       // Clear confirmed dates after adding to cart and unlock
//       setAreDatesLocked(false);
//       setCampaignConfirmedDates({ start: null, end: null });
//       setSelectedDates({ start: null, end: null });
//       navigate("/cart");
//     } else {
//       throw new Error(responseData.message || 'Failed to add to cart');
//     }
//   } catch (error) {
//     console.error('Error adding to cart:', error);
//     toast.error(`Failed to add item to cart: ${error.message}`);
//   } finally {
//     setIsAddingToCart(false);
//   }
// };







// Updated handleAddToCart function with single API check
const handleAddToCart = async () => {
  // Prevent double submission
  if (isAddingToCart) {
    console.log('Add to cart already in progress');
    return;
  }

  // Check if dates have already been used for cart/booking
  if (datesUsedForAction) {
    toast.warning("These dates have already been used. Please select new dates.");
    resetDates();
    return;
  }

  // Check if dates are confirmed and locked
  const hasConfirmedDates = campaignConfirmedDates.start && campaignConfirmedDates.end && areDatesLocked;

  if (!hasConfirmedDates) {
    // No dates confirmed, open calendar for selection
    if (!isCalendarOpen) {
      await fetchDates();
      toggleCalendar();
    } else {
      setCalendarErrorMessage("Please confirm your selected dates first by clicking 'Confirm Date'");
    }
    return;
  }

  // Check if user is logged in
  if (!user) {
    console.log('User not logged in for add to cart');
    if (currentProduct?.id) {
      localStorage.setItem(`pendingBookingAfterLogin_${currentProduct.id}`, JSON.stringify({
        productId: currentProduct?.id,
        prodCode: currentProduct?.prodCode,
        startDate: campaignConfirmedDates.start.toISOString(),
        endDate: campaignConfirmedDates.end.toISOString(),
        returnUrl: window.location.pathname,
        timestamp: new Date().toISOString(),
        action: 'addToCart'
      }));
    }

    if (isCalendarOpen) {
      setShowLoginPrompt(true);
      setCalendarErrorMessage("Please log in to continue with your booking");
      setTimeout(() => {
        setShowLoginPrompt(false);
        setIsCalendarOpen(false);
        setCalendarErrorMessage("");
        openLogin();
      }, 2000);
    } else {
      openLogin();
    }
    return;
  }

  // Set adding to cart flag
  setIsAddingToCart(true);

  try {
    // Use single API for conflict checking
    const response = await fetch(`${baseUrl}/check-date-conflicts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prodCode: currentProduct?.prodCode,
        startDate: campaignConfirmedDates.start.toISOString(),
        endDate: campaignConfirmedDates.end.toISOString(),
        productId: currentProduct?.id,
        productName: currentProduct?.prodName
      })
    });
    
    const availabilityCheck = await response.json();

    if (!availabilityCheck.success) {
      toast.error("Failed to check date availability. Please try again.");
      setIsAddingToCart(false);
      return;
    }

    if (!availabilityCheck.isAvailable) {
      // Dates are not available
      if (availabilityCheck.hasConflicts) {
        toast.error(
          `Sorry! ${availabilityCheck.confirmedConflictCount} date(s) in your selection are already booked. Please select new dates.`
        );
        setIsCalendarOpen(true);
        setIsAddingToCart(false);
        return;
      } else if (availabilityCheck.hasQueueDates) {
        // Show queue warning for cart as well
        const confirmQueue = window.confirm(
          `Warning: ${availabilityCheck.pendingConflictCount} date(s) in your selection are in queue.\n\n` +
          `If you add to cart, you'll be placed in the waitlist for these dates.\n` +
          `Do you want to continue?`
        );
        
        if (!confirmQueue) {
          setIsAddingToCart(false);
          return;
        }
      }
    }

    // Validate confirmed dates
    const validation = validateMinimumDays(campaignConfirmedDates.start, campaignConfirmedDates.end);

    if (!validation.valid) {
      setCalendarErrorMessage(validation.message);
      setIsCalendarOpen(true);
      setIsAddingToCart(false);
      return;
    }

    const conflictBlocks = getConflictBlocks(campaignConfirmedDates.start, campaignConfirmedDates.end);
    if (conflictBlocks.length >= 2) {
      setCalendarErrorMessage(
        `Selected range has ${conflictBlocks.length} separate booked periods.\n` +
        `Please select a new date range.`
      );
      setIsCalendarOpen(true);
      setIsAddingToCart(false);
      return;
    }

    const confirmedAvailableDays = getAvailableDaysInRange(campaignConfirmedDates.start, campaignConfirmedDates.end);
    const confirmedTotalDays = confirmedAvailableDays.length;
    const confirmedTotalPrice = confirmedTotalDays * pricePerDay;
    const confirmedPendingCount = getPendingDaysInRange(campaignConfirmedDates.start, campaignConfirmedDates.end);
    const actualPrice = currentProduct?.displayPrice || currentProduct?.price || 0;

    const cartItem = {
      userId: user._id,
      productId: currentProduct?.id,
      prodCode: currentProduct?.prodCode,
      image: currentProduct?.imageUrl,
      prodName: currentProduct?.prodName,
      title: currentProduct?.location,
      price: actualPrice,
      rating: currentProduct?.rating,
      district: currentProduct?.district,
      state: currentProduct?.state,
      dateRange: campaignConfirmedDates.start
        ? `${campaignConfirmedDates.start.toLocaleString("en-IN", { month: "short" })} ${campaignConfirmedDates.start.getDate()} - ${campaignConfirmedDates.end
            ? `${campaignConfirmedDates.end.toLocaleString("en-IN", { month: "short" })} ${campaignConfirmedDates.end.getDate()}`
            : "--"
          }`
        : "N/A",
      startDate: campaignConfirmedDates.start,
      endDate: campaignConfirmedDates.end,
      sizeWidth: currentProduct?.sizeWidth,
      sizeHeight: currentProduct?.sizeHeight,
      sizeSide: currentProduct?.sizeSide,
      productsquareFeet: currentProduct?.productsquareFeet,
      dimension: (currentProduct?.sizeHeight || 0) * (currentProduct?.sizeWidth || 0),
      adType: currentProduct?.category,
      totalAmount: confirmedTotalPrice,
      totalDays: confirmedTotalDays,
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
      originalPrice: currentProduct?.originalPrice || actualPrice,
      queueInfo: {
        hasPendingDates: confirmedPendingCount > 0,
        pendingCount: confirmedPendingCount,
        enteredQueueAt: new Date().toISOString()
      }
    };

    const cartResponse = await fetch(`${baseUrl}/cart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cartItem)
    });

    const cartResponseData = await cartResponse.json();

    if (cartResponse.ok) {
      toast.success(confirmedPendingCount > 0 
        ? "Item added to cart with queue status!" 
        : "Item added to cart successfully!");
      // Mark dates as used to prevent reuse
      setDatesUsedForAction(true);
      // Clear confirmed dates after adding to cart and unlock
      setAreDatesLocked(false);
      setCampaignConfirmedDates({ start: null, end: null });
      setSelectedDates({ start: null, end: null });
      navigate("/cart");
    } else {
      throw new Error(cartResponseData.message || 'Failed to add to cart');
    }
  } catch (error) {
    console.error('Error adding to cart:', error);
    toast.error(`Failed to add item to cart: ${error.message}`);
  } finally {
    setIsAddingToCart(false);
  }
};
    // MAIN BOOK BUTTON HANDLER - Opens calendar for date selection
    const handleMainBookButton = async () => {
        console.log('handleMainBookButton called - User:', !!user);

        // If calendar is not open, open it for date selection
        if (!isCalendarOpen) {
            console.log('Opening calendar for date selection');
            await fetchDates();
            toggleCalendar("");
            return;
        }

        // Check if dates are confirmed and locked
        const hasConfirmedDates = campaignConfirmedDates.start && campaignConfirmedDates.end && areDatesLocked;

        if (hasConfirmedDates) {
            // Check if user is logged in
            if (!user) {
                console.log('User not logged in, showing login prompt');
                if (currentProduct?.id) {
                    localStorage.setItem(`pendingBookingAfterLogin_${currentProduct.id}`, JSON.stringify({
                        productId: currentProduct?.id,
                        prodCode: currentProduct?.prodCode,
                        startDate: campaignConfirmedDates.start.toISOString(),
                        endDate: campaignConfirmedDates.end.toISOString(),
                        returnUrl: window.location.pathname,
                        timestamp: new Date().toISOString()
                    }));
                }

                if (isCalendarOpen) {
                    setShowLoginPrompt(true);
                    setCalendarErrorMessage("Please log in to continue with your booking");
                    setTimeout(() => {
                        setShowLoginPrompt(false);
                        setIsCalendarOpen(false);
                        setCalendarErrorMessage("");
                        openLogin();
                    }, 2000);
                } else {
                    openLogin();
                }
                return;
            }

            // User is logged in and dates are confirmed - proceed to billing
            await proceedToBooking(campaignConfirmedDates.start, campaignConfirmedDates.end);
            return;
        }

        // Check if we have selected dates (not confirmed yet)
        const hasSelectedDates = selectedDates.start && selectedDates.end;

        if (hasSelectedDates) {
            // Show message that dates need to be confirmed first
            setCalendarErrorMessage(
                "Please click 'Reserve & Book' in the calendar to confirm your dates before proceeding."
            );
            return;
        }

        // No dates selected at all
        if (allInitialDaysBooked && nextBookingOpenDate) {
            const formattedDate = nextBookingOpenDate.toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric"
            });
            setCalendarErrorMessage(`Slots are booked. Booking opens from ${formattedDate}`);
        } else {
            setCalendarErrorMessage("Please select start and end dates before proceeding.");
        }
    };

    const handleReserveNow = async () => {
        // Check if dates are confirmed and locked
        const hasConfirmedDates = campaignConfirmedDates.start && campaignConfirmedDates.end && areDatesLocked;

        if (!hasConfirmedDates) {
            // No dates confirmed, open calendar for selection
            if (!isCalendarOpen) {
                await fetchDates();
                toggleCalendar();
            } else {
                // setCalendarErrorMessage(" ");
            }
            return;
        }
        if (!user) {
            openLogin();
            return;
        }

        // Check if we have confirmed dates from previous session
        if (campaignConfirmedDates.start && campaignConfirmedDates.end && areDatesLocked) {
            // Validate confirmed dates
            const validation = validateMinimumDays(
                campaignConfirmedDates.start,
                campaignConfirmedDates.end,
            );
            if (!validation.valid) {
                setCalendarErrorMessage(validation.message);
                setIsCalendarOpen(true);
                return;
            }

            // Check for multiple conflict blocks
            const conflictBlocks = getConflictBlocks(
                campaignConfirmedDates.start,
                campaignConfirmedDates.end,
            );
            if (conflictBlocks.length >= 2) {
                setCalendarErrorMessage(
                    `Confirmed range has ${conflictBlocks.length} separate booked periods.\n` +
                    `Please select a new date range.`,
                );
                setIsCalendarOpen(true);
                return;
            }

            const actualPrice =
                currentProduct?.displayPrice || currentProduct?.price || 0;
            const pendingCount = getPendingDaysInRange(
                campaignConfirmedDates.start,
                campaignConfirmedDates.end,
            );
            const availableDaysInRange = getAvailableDaysInRange(
                campaignConfirmedDates.start,
                campaignConfirmedDates.end,
            );
            const totalDays = availableDaysInRange.length;
            const totalPrice = totalDays * pricePerDay;

            // // Show queue warning if there are pending dates
            // if (pendingCount > 0) {
            //     const confirmBooking = window.confirm(
            //         `Warning: ${pendingCount} date${pendingCount > 1 ? "s" : ""} in your selection are in queue.\n\n` +
            //         `You'll be added to the queue for these dates.\n` +
            //         `If pending orders get cancelled, your booking will be confirmed.\n\n` +
            //         `Do you want to proceed to billing?`,
            //     );

            //     if (!confirmBooking) {
            //         return;
            //     }
            // }

            const reserveItem = {
                id: currentProduct?.id,
                prodCode: currentProduct?.prodCode,
                image: currentProduct?.imageUrl,
                prodName: currentProduct?.prodName,
                title: currentProduct?.location,
                price: actualPrice,
                rating: currentProduct?.rating,
                district: currentProduct?.district,
                state: currentProduct?.state,
                dateRange: campaignConfirmedDates.start
                    ? `${campaignConfirmedDates.start.toLocaleString("en-IN", { month: "short" })} ${campaignConfirmedDates.start.getDate()} - ${campaignConfirmedDates.end
                        ? `${campaignConfirmedDates.end.toLocaleString("en-IN", { month: "short" })} ${campaignConfirmedDates.end.getDate()}`
                        : "--"
                    }`
                    : "N/A",
                startDate: campaignConfirmedDates.start,
                endDate: campaignConfirmedDates.end,
                sizeWidth: currentProduct?.sizeWidth,
                sizeHeight: currentProduct?.sizeHeight,
                sizeSide: currentProduct?.sizeSide,
                productsquareFeet: currentProduct?.productsquareFeet,
                dimension:
                    (currentProduct?.sizeHeight || 0) * (currentProduct?.sizeWidth || 0),
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
                originalPrice: currentProduct?.originalPrice || actualPrice,
                // Queue info
                queueStatus: pendingCount > 0 ? "pending" : "direct",
                pendingDatesCount: pendingCount,
            };

            // Mark dates as used
            setDatesUsedForAction(true);

            // Redirect to billing
            navigate("/billing", {
                state: {
                    reserveItem,
                    queueInfo: {
                        hasQueue: pendingCount > 0,
                        queueMessage:
                            pendingCount > 0
                                ? `Your booking includes ${pendingCount} date${pendingCount > 1 ? "s" : ""} that are in queue. You'll be added to the waitlist.`
                                : "All dates are available for immediate confirmation.",
                    },
                },
            });
            return;
        }

        // If no confirmed dates, check if we have selected dates
        if (selectedDates.start && selectedDates.end && !areDatesLocked) {
            const validation = validateMinimumDays(
                selectedDates.start,
                selectedDates.end,
            );
            if (!validation.valid) {
                setCalendarErrorMessage(validation.message);
                setIsCalendarOpen(true);
                return;
            }

            const pendingCount = getPendingDaysInRange(
                selectedDates.start,
                selectedDates.end,
            );
            const conflictBlocks = getConflictBlocks(
                selectedDates.start,
                selectedDates.end,
            );

            if (conflictBlocks.length >= 2) {
                setCalendarErrorMessage(
                    `Selected range has ${conflictBlocks.length} separate booked periods.\n` +
                    `Please select a continuous available period.`,
                );
                setIsCalendarOpen(true);
                return;
            }

            // Show appropriate message
            if (pendingCount > 0) {
                setCalendarErrorMessage(
                    `${pendingCount} date${pendingCount > 1 ? "s" : ""} in queue.\n` +
                    `Please confirm dates to join the queue.`,
                );
            } else {
                setCalendarErrorMessage(
                    "Please confirm your selected dates to proceed.",
                );
            }

            setIsCalendarOpen(true);
            return;
        }

        setIsCalendarOpen(true);
    };

    // // Get date selection class for calendar
    // const getDateSelectionClass = (date) => {
    //     if (!date || isNaN(date.getTime())) return "disabled";

    //     // If dates are locked, prevent selection by returning a special class
    //     if (areDatesLocked) {
    //         return "locked-date";
    //     }

    //     const normalizedDate = new Date(
    //         Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
    //     );

    //     if (isPastDate(normalizedDate)) {
    //         return "past";
    //     }

    //     if (isDateBooked(normalizedDate)) {
    //         return "booked";
    //     }

    //     if (!isDateWithinCurrentWindow(normalizedDate)) {
    //         return "outside-window";
    //     }

    //     if (selectedDates.start && selectedDates.end) {
    //         const startUTC = new Date(Date.UTC(
    //             selectedDates.start.getFullYear(),
    //             selectedDates.start.getMonth(),
    //             selectedDates.start.getDate()
    //         ));

    //         const endUTC = new Date(Date.UTC(
    //             selectedDates.end.getFullYear(),
    //             selectedDates.end.getMonth(),
    //             selectedDates.end.getDate()
    //         ));

    //         if (+normalizedDate === +startUTC) return "selected-start";
    //         if (+normalizedDate === +endUTC) return "selected-end";
    //         if (normalizedDate > startUTC && normalizedDate < endUTC) {
    //             return "selected-range";
    //         }
    //     }

    //     if (isDatePending(normalizedDate)) {
    //         return "pending";
    //     }

    //     return "available";
    // };



//     // Updated getDateSelectionClass - Ensures booked/pending dates show correctly even when locked
// const getDateSelectionClass = (date) => {
//   if (!date || isNaN(date.getTime())) return "disabled";

//   const normalizedDate = new Date(
//     Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
//   );

//   // PAST DATES - Check first (highest priority)
//   if (isPastDate(normalizedDate)) {
//     return "past";
//   }

//   // BOOKED DATES - Check before locked dates
//   if (isDateBooked(normalizedDate)) {
//     return "booked";
//   }

//   // PENDING DATES - Check before locked dates
//   if (isDatePending(normalizedDate)) {
//     return "pending";
//   }

//   // If dates are locked, only allow the confirmed range to be shown as selected
//   if (areDatesLocked) {
//     // Still show the confirmed range as selected
//     if (campaignConfirmedDates.start && campaignConfirmedDates.end) {
//       const startUTC = new Date(Date.UTC(
//         campaignConfirmedDates.start.getFullYear(),
//         campaignConfirmedDates.start.getMonth(),
//         campaignConfirmedDates.start.getDate()
//       ));
//       const endUTC = new Date(Date.UTC(
//         campaignConfirmedDates.end.getFullYear(),
//         campaignConfirmedDates.end.getMonth(),
//         campaignConfirmedDates.end.getDate()
//       ));

//       if (+normalizedDate === +startUTC) return "selected-start";
//       if (+normalizedDate === +endUTC) return "selected-end";
//       if (normalizedDate > startUTC && normalizedDate < endUTC) {
//         return "selected-range";
//       }
//     }
//     // For dates outside confirmed range when locked, return disabled/locked class
//     return "locked-date";
//   }

//   // Check window restrictions
//   if (!isDateWithinCurrentWindow(normalizedDate)) {
//     return "outside-window";
//   }

//   // Selected dates styling (only for available dates)
//   if (selectedDates.start && selectedDates.end) {
//     const startUTC = new Date(Date.UTC(
//       selectedDates.start.getFullYear(),
//       selectedDates.start.getMonth(),
//       selectedDates.start.getDate()
//     ));
//     const endUTC = new Date(Date.UTC(
//       selectedDates.end.getFullYear(),
//       selectedDates.end.getMonth(),
//       selectedDates.end.getDate()
//     ));

//     if (+normalizedDate === +startUTC) return "selected-start";
//     if (+normalizedDate === +endUTC) return "selected-end";
//     if (normalizedDate > startUTC && normalizedDate < endUTC) {
//       return "selected-range";
//     }
//   }

//   return "available";
// };


// Updated getDateSelectionClass - Shows selected border for pending dates
const getDateSelectionClass = (date) => {
  if (!date || isNaN(date.getTime())) return "disabled";

  const normalizedDate = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  );

  // PAST DATES - Check first (highest priority)
  if (isPastDate(normalizedDate)) {
    return "past";
  }

  // FIRST: Check if date is in SELECTED range (even if pending or booked)
  // This ensures selected dates get green border regardless of status
  if (selectedDates.start && selectedDates.end) {
    const startUTC = new Date(Date.UTC(
      selectedDates.start.getFullYear(),
      selectedDates.start.getMonth(),
      selectedDates.start.getDate()
    ));
    const endUTC = new Date(Date.UTC(
      selectedDates.end.getFullYear(),
      selectedDates.end.getMonth(),
      selectedDates.end.getDate()
    ));

    if (+normalizedDate === +startUTC) return "selected-start";
    if (+normalizedDate === +endUTC) return "selected-end";
    if (normalizedDate > startUTC && normalizedDate < endUTC) {
      return "selected-range";
    }
  }

  // CHECK CONFIRMED DATES (after selection check)
  if (campaignConfirmedDates.start && campaignConfirmedDates.end && areDatesLocked) {
    const startUTC = new Date(Date.UTC(
      campaignConfirmedDates.start.getFullYear(),
      campaignConfirmedDates.start.getMonth(),
      campaignConfirmedDates.start.getDate()
    ));
    const endUTC = new Date(Date.UTC(
      campaignConfirmedDates.end.getFullYear(),
      campaignConfirmedDates.end.getMonth(),
      campaignConfirmedDates.end.getDate()
    ));

    if (+normalizedDate === +startUTC) return "selected-start";
    if (+normalizedDate === +endUTC) return "selected-end";
    if (normalizedDate > startUTC && normalizedDate < endUTC) {
      return "selected-range";
    }
  }

  // BOOKED DATES - After selection check
  if (isDateBooked(normalizedDate)) {
    return "booked";
  }

  // PENDING DATES - After selection check
  if (isDatePending(normalizedDate)) {
    return "pending";
  }

  // If dates are locked, return locked class
  if (areDatesLocked) {
    return "locked-date";
  }

  // Check window restrictions
  if (!isDateWithinCurrentWindow(normalizedDate)) {
    return "outside-window";
  }

  return "available";
};




    useEffect(() => {
        if (isCalendarOpen && allInitialDaysBooked && nextBookingOpenDate) {
            const formattedDate = nextBookingOpenDate.toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric"
            });
            setCalendarErrorMessage(`Slots are booked. Booking opens from ${formattedDate}`);
        }
    }, [isCalendarOpen, allInitialDaysBooked, nextBookingOpenDate]);

    const goToNextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
    };

    const goToPreviousMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
    };

    const toggleCalendar = async (errorMessage = "") => {
        if (currentProduct && !confirmedDates.length) {
            await fetchDates();
            await new Promise(resolve => setTimeout(resolve, 200));
        }

        const newIsCalendarOpen = !isCalendarOpen;
        setIsCalendarOpen(newIsCalendarOpen);

        if (newIsCalendarOpen) {
            setShowLoginPrompt(false);
            setCalendarErrorMessage("");

            if (allInitialDaysBooked && nextBookingOpenDate && user) {
                const formattedDate = nextBookingOpenDate.toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric"
                });
                setCalendarErrorMessage(`Slots are booked. Booking opens from ${formattedDate}`);
            }
            if (errorMessage && errorMessage !== "Please log in to continue with your booking") {
                setCalendarErrorMessage(errorMessage);
            }
        } else {
            setCalendarErrorMessage("");
            setShowQueueInfo(false);
            setShowLoginPrompt(false);
        }
    };

    const closeCalendar = () => {
        setIsCalendarOpen(false);
        setCalendarErrorMessage("");
        setShowQueueInfo(false);
        setShowLoginPrompt(false);
    };

    const toggleLoginPage = () => {
        if (isLoginOpen) {
            closeLogin();
        } else {
            openLogin();
        }
    };

    const closeLoginPage = () => setIsLoginOpen(false);
    const toggleOtpMainPage = () => setIsOtpMainOpen(!isOtpMainOpen);
    const closeOtpMainPage = () => setIsOtpMainOpen(false);

    const pricePerDay = currentProduct?.displayPrice || currentProduct?.price || 0;
    const startDate = selectedDates.start || campaignConfirmedDates.start;
    const endDate = selectedDates.end || campaignConfirmedDates.end;
    const availableDaysInRange = startDate && endDate ? getAvailableDaysInRange(startDate, endDate) : [];
    const totalDays = availableDaysInRange.length;
    const totalPrice = totalDays * pricePerDay;

    const formatDate = (date) => {
        if (!date) return null;
        const d = new Date(date);
        return {
            day: d.getDate(),
            monthYear: d.toLocaleString("en-US", { month: "short", year: "numeric" }),
        }
    };

    const RatingStarsSimilar = ({ rating }) => {
        const formattedRating = Number.isInteger(rating) ? rating.toFixed(1) : rating.toString();
        return (
            <div className="rate rate1-book1-similar">
                <span className="rating-text">{formattedRating}</span>
                <span className="fa-solid fa-star rating2-star"></span>
            </div>
        );
    };

    const RatingStar = ({ rating }) => {
        const formattedRating = Number.isInteger(rating) ? rating.toFixed(1) : rating.toString();
        return (
            <div className="rate1-book">
                <span className="rating-text">{formattedRating}</span>
                <span className="fa-solid fa-star rating2-star"></span>
            </div>
        );
    };

    if (isLoading) {
        return (
            <MainLayout>
                <PreLoader load={isLoading} />
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

    const NextArrow = (props) => {
        const { onClick } = props;
        return (
            <div className="custom-arrow1-similar next-arrow1-similar" onClick={onClick}>
                ❯
            </div>
        );
    };

    const PrevArrow = (props) => {
        const { onClick } = props;
        return (
            <div className="custom-arrow1-similar prev-arrow1-similar" onClick={onClick}>
                ❮
            </div>
        );
    };

    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
        slidesToShow: 3,
        slidesToScroll: 1,
        centerPadding: "0px",
        autoplaySpeed: 2000,
        beforeChange: (current, next) => {
            const elements = document.querySelectorAll(".slick-slide1-similar");
            elements.forEach((el, index) => {
                if (index === next) {
                    el.classList.add("slick-center1");
                } else {
                    el.classList.remove("slick-center1");
                }
            });
        },
        responsive: [
            { breakpoint: 1024, settings: { slidesToShow: 3, slidesToScroll: 1, centerPadding: "40px" } },
            { breakpoint: 992, settings: { slidesToShow: 3, slidesToScroll: 1, centerPadding: "0px", centerMode: false } },
            { breakpoint: 768, settings: { slidesToShow: 2, slidesToScroll: 1 } },
            { breakpoint: 600, settings: { slidesToShow: 1, slidesToScroll: 1 } },
        ]
    };

    const hasConfirmedDates = campaignConfirmedDates.start && campaignConfirmedDates.end && areDatesLocked;
    const hasSelectedDates = selectedDates.start && selectedDates.end;

    return (
        <MainLayout>
            <div>
                <MainNavbar />
                <div
                    className={`calendar-wrapper login-wrapper otp-wrapper ${isCalendarOpen ? "calendar-open" : ""} ${isLoginOpen ? "login-open" : ""} ${isOtpMainOpen ? "otp-main-open" : ""}`}
                >
                    <div className="container-fluid mt-5 Book-section" id="similarProdDetailsShows">
                        <div className="row BookMain">
                            <div className="col-md-6 col-lg-6 Book-content1">
                                <div className="row bookContentRow1">
                                    <div className="bookContentRow2" style={{ display: "flex" }}>
                                        <div className="book-images-section">
                                            <div
                                                className={`book-images ${isMainImageSelected() ? "selected" : ""}`}
                                                onClick={() => handleMainImageClick()}
                                                style={{ cursor: "pointer" }}
                                            >
                                                <img
                                                    src={currentProduct?.imageUrl}
                                                    className="img-fluid book-img11"
                                                    alt="Main product"
                                                />
                                            </div>

                                            {additionalFiles.map((file, index) => (
                                                <div
                                                    key={index}
                                                    className={`book-images ${isFileSelected(index) ? "selected" : ""}`}
                                                    onClick={() => handleImageChange(file, index)}
                                                    style={{ cursor: "pointer" }}
                                                >
                                                    {file.type === "video" ||
                                                        (file.url && file.url.match(/\.(mp4|mov|avi|mkv)$/i)) ? (
                                                        <div className="video-thumbnail-wrapper">
                                                            <video
                                                                className="book-img11"
                                                                muted
                                                                preload="metadata"
                                                                onLoadedData={(e) => {
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
                                                    ) : (
                                                        <img
                                                            src={file.url}
                                                            className="img-fluid book-img11"
                                                            alt={`Additional ${index + 1}`}
                                                            style={{
                                                                width: "100%",
                                                                height: "100%",
                                                                objectFit: "cover",
                                                            }}
                                                        />
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                        <div className="book-mainImage">
                                            {currentPreviewType === "video" ? (
                                                <video
                                                    className="book-mainImg1"
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
                                            <button
                                                className=" btn-enquire btn-addtocart"
                                                onClick={handleAddToCart}
                                                disabled={isAddingToCart}
                                            >
                                                <img
                                                    src="/images/add-to-cart-icon 1.svg"
                                                    className="location-arrow"
                                                    alt="arrow"
                                                ></img>
                                                {isAddingToCart ? "Adding..." : "Add to cart"}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {currentProduct ? (
                                <div className="col-md-6 col-lg-6 Book-content2">
                                    <p className="book-sideHeading">{currentProduct.prodName}</p>
                                    <div className="book-rateContent1">
                                        {currentProduct.isOfferProduct ? (
                                            <>
                                                <div className="price-rating-row">
                                                    <span className="rate-perDay offer-price-highlight">
                                                        ₹ {currentProduct.displayPrice?.toLocaleString() || "0"}
                                                        <span className="rate-perDay1"> / Per Day</span>
                                                    </span>
                                                    <RatingStar rating={currentProduct.rating} />
                                                </div>
                                                <span className="original-price-strikethrough">
                                                    ₹ {currentProduct.originalPrice?.toLocaleString() || "0"}
                                                </span>
                                            </>
                                        ) : (
                                            <div className="price-rating-row">
                                                <span className="rate-perDay">
                                                    ₹ {currentProduct.price?.toLocaleString() || "0"}
                                                    <span className="rate-perDay1"> / Per Day</span>
                                                </span>
                                                <RatingStar rating={currentProduct.rating} />
                                            </div>
                                        )}
                                        <br />
                                        <a href="#Terms" className="book-condition anchor">
                                            Terms & Condition
                                        </a>
                                    </div>
                                    <div className="bookingdetailslocation">
                                        <div className="book-spot bookinglocation ">
                                            {currentProduct.productFrom}
                                            <span>
                                                <img
                                                    src="/images/maproutebook.svg"
                                                    className="location-arrow"
                                                    alt="arrow"
                                                ></img>
                                            </span>
                                            {currentProduct.productTo}
                                        </div>
                                        <div className="maplocation1">
                                            <span className="productLocationImg">
                                                <a
                                                    href={currentProduct.LocationLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    <img
                                                        src="/images/viewmap1.svg"
                                                        alt="location icon"
                                                        className="locationImgIcon"
                                                    />
                                                    <span className="viewlocation">View Location</span>
                                                </a>
                                            </span>
                                        </div>
                                    </div>
                                    <div className="bookingdetialslist1">
                                        <span className="btn-type">{currentProduct.category}</span>
                                        <img
                                            src="/images/bookinglightingicon.svg"
                                            alt="icon"
                                            className="book-type-icon"
                                        />
                                        <span className="badge book-type">
                                            {currentProduct.prodLighting}
                                        </span>
                                    </div>
                                    <div className="bookingdetialslist1">
                                        <p className="book-size">
                                            <span className="book-size-label">Size</span>
                                            <span className="book-size-colon">:</span>
                                            <span className="book-size-value">
                                                {currentProduct.sizeWidth}
                                                <span className="size-separator"> x </span>
                                                {currentProduct.sizeHeight}
                                                {(currentProduct.category === "Signal Post" ||
                                                    currentProduct.category === "Pole Kiosk") &&
                                                    ` x ${currentProduct.sizeSide}`}
                                                <span className="slash-bar"> | </span>
                                                {currentProduct.productsquareFeet} Sq.ft
                                                {(currentProduct.category === "Signal Post" ||
                                                    currentProduct.category === "Pole Kiosk") && (
                                                        <span className="sided-text"> (2-Sided)</span>
                                                    )}
                                            </span>
                                        </p>
                                    </div>
                                    <div className="book-price my-3">
                                        <span className="price-label">Printing</span>
                                        <span className="price-colon">:</span>
                                        <span className="price-value">
                                            ₹ {currentProduct.printingCost?.toLocaleString() || "0"}
                                        </span>
                                    </div>
                                    <div className="book-price my-3">
                                        <span className="price-label">Mounting</span>
                                        <span className="price-colon1">:</span>
                                        <span className="price-value">
                                            ₹ {currentProduct.mountingCost?.toLocaleString() || "0"}
                                        </span>
                                    </div>

                                    <div className="book-rateContent2">
                                        <button
                                            className="book-date-range"
                                            onClick={handleMainBookButton}
                                            disabled={isProcessingBooking}
                                        >
                                            {campaignConfirmedDates.start && campaignConfirmedDates.end && areDatesLocked ? (
                                                <>
                                                    <div className="date-box">
                                                        <span className="date-number">
                                                            {formatDate(campaignConfirmedDates.start).day}
                                                        </span>
                                                        <span className="date-text">
                                                            {formatDate(campaignConfirmedDates.start).monthYear}
                                                        </span>
                                                    </div>
                                                    <span className="date-separator">–</span>
                                                    <div className="date-box">
                                                        <span className="date-number">
                                                            {formatDate(campaignConfirmedDates.end).day}
                                                        </span>
                                                        <span className="date-text">
                                                            {formatDate(campaignConfirmedDates.end).monthYear}
                                                        </span>
                                                    </div>
                                                </>
                                            ) : selectedDates.start && selectedDates.end && !areDatesLocked ? (
                                                <>
                                                    <div className="date-box">
                                                        <span className="date-number">
                                                            {formatDate(selectedDates.start).day}
                                                        </span>
                                                        <span className="date-text">
                                                            {formatDate(selectedDates.start).monthYear}
                                                        </span>
                                                    </div>
                                                    <span className="date-separator">–</span>
                                                    <div className="date-box">
                                                        <span className="date-number">
                                                            {formatDate(selectedDates.end).day}
                                                        </span>
                                                        <span className="date-text">
                                                            {formatDate(selectedDates.end).monthYear}
                                                        </span>
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    {/* <span>Select Dates</span> */}

                                                </>
                                            )}
                                        </button>
                                    </div>
                                    <button
                                        className=" mt-3 mb-2 btn-enquire1"
                                        onClick={handleReserveNow}
                                        disabled={isProcessingBooking}
                                    >
                                        {isProcessingBooking ? "Processing..." : "Book Now"}
                                    </button>
                                    <button
                                        className=" mt-3 mb-2 btn-enquire2"
                                        onClick={handleEnquireNow}
                                    >
                                        Request Call
                                    </button>
                                    <br />
                                </div>
                            ) : (
                                <p>No spot selected. Please go back and select a spot.</p>
                            )}

                            {/* Calendar overlay */}
                            {isCalendarOpen && (
                                <div className="calendar-overlay">
                                    <div className="calendar-scroll">
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
                                            confirmedDates={confirmedDates}
                                            pendingDates={pendingDates}
                                            currentMonth={currentMonth}
                                            setCurrentMonth={setCurrentMonth}
                                            pricePerDay={pricePerDay}
                                            confirmDates={confirmDates}
                                            totalDays={totalDays}
                                            totalPrice={totalPrice}
                                            calendarErrorMessage={calendarErrorMessage}
                                            setCalendarErrorMessage={setCalendarErrorMessage}
                                            isDateBooked={isDateBooked}
                                            isDatePending={isDatePending}
                                            hasBookedDatesInRange={(start, end) => {
                                                if (!start || !end) return false;
                                                const current = new Date(start);
                                                const normalizedEnd = new Date(end);
                                                while (current <= normalizedEnd) {
                                                    if (isDateBooked(current)) {
                                                        return true;
                                                    }
                                                    current.setDate(current.getDate() + 1);
                                                }
                                                return false;
                                            }}
                                            calculateDaysDifference={calculateDaysDifference}
                                            getAvailableDaysInRange={getAvailableDaysInRange}
                                            showQueueInfo={showQueueInfo}
                                            queuePosition={queuePosition}
                                            isWindowExpanded={isWindowExpanded}
                                            currentWindowStart={currentWindowStart}
                                            currentWindowEnd={currentWindowEnd}
                                            isSelectionConfirmed={isSelectionConfirmed}
                                            INITIAL_SELECTION_DAYS={INITIAL_SELECTION_DAYS}
                                            AVAILABLE_WINDOW_DAYS={AVAILABLE_WINDOW_DAYS}
                                            MIN_BOOKING_DAYS={MIN_BOOKING_DAYS}
                                            isProcessingBooking={isProcessingBooking}
                                            allInitialDaysBooked={allInitialDaysBooked}
                                            nextBookingOpenDate={nextBookingOpenDate}
                                            showEnquireNow={showEnquireNow}
                                            handleEnquireNow={handleEnquireNow}
                                            showLoginPrompt={showLoginPrompt && !user}
                                            hasConfirmedDates={hasConfirmedDates}
                                            areDatesLocked={areDatesLocked}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Login overlay */}
                            {isLoginOpen && (
                                <div className="login-overlay">
                                    <LoginPageMain
                                        toggleLoginPage={toggleLoginPage}
                                        closeLoginPage={closeLoginPage}
                                    />
                                </div>
                            )}

                            {/* OTP overlay */}
                            {isOtpMainOpen && (
                                <div className="otp-overlay">
                                    <OtpMain
                                        toggleOtpMainPage={toggleOtpMainPage}
                                        closeOtpMainPage={closeOtpMainPage}
                                        productData={currentProduct}
                                        user={user}
                                        skipPhoneVerification={enquireNowContext === 'booked_dates' && user ? true : false}
                                        enquiryContext={enquireNowContext}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Terms and Conditions */}
                    <div id="Terms">
                        <div>
                            <div className="container banner-main">
                                <h1 className="Banner-heading">Terms and Conditions</h1>
                                <ul className="banner-content">
                                    <li>Sites are subject to availability at the time of confirmation.</li>
                                    <li>The campaign should commence within 7 business days from the date of confirmation. Failure to adhere to this timeline will result in the release of sites without further notice or billing from the confirmation date.</li>
                                    <li>Requests for campaign extensions must be communicated via email at least 10 days before the end date of the current campaign. Extensions requested with shorter notice are subject to site availability.</li>
                                    <li>We are not liable for damages to flex caused by natural calamities. Reprinting costs are to be borne by you, with flex remounting provided free of charge.</li>
                                    <li>100% payment is required in advance.</li>
                                    <li>Purchase orders must be issued in the name of Adinn Advertising Services, Ltd and provided before the campaign commences.</li>
                                    <li>An 18% GST is applicable to all transactions.</li>
                                </ul>
                            </div>

                            {/* Nearby Similar Products */}
                            {displayedSimilarSpots.length > 0 && (
                                <div>
                                    <div className="container similar mt-5">
                                        <h2 className="NearbyHeading mb-4">
                                            Nearby Similar Products
                                        </h2>

                                        {(displayedSimilarSpots.length > 3 || (windowWidth <= 768 && displayedSimilarSpots.length > 1)) ? (
                                            <div className="similar-products-carousel">
                                                <Slider {...settings}>
                                                    {displayedSimilarSpots.map((spot) => (
                                                        <div
                                                            className="similar-slide-wrapper"
                                                            key={spot._id}
                                                        >
                                                            <div
                                                                className="card board1-book1"
                                                                onClick={() => handleSimilarProductClick(spot)}
                                                                style={{ cursor: "pointer" }}
                                                            >
                                                                <img
                                                                    src={spot.image}
                                                                    alt={spot.location}
                                                                    className="card-img-top-book1"
                                                                />
                                                                <span className="board-category-book1">
                                                                    {spot.category}
                                                                </span>
                                                                <div className="board-content-book1">
                                                                    <div className="board-content-top-book1">
                                                                        <span className="card-title board-loc-book1-similar">
                                                                            {spot.name}
                                                                        </span>
                                                                    </div>
                                                                    <div className="board-content-bottom-book1">
                                                                        <span className="board-price-book">
                                                                            {formatIndianCurrency(spot.price, true)}
                                                                            <span className="board-price-bookPerDay">
                                                                                {" "}
                                                                                / Per Day
                                                                            </span>
                                                                        </span>
                                                                        <span className="board-dim-book1">
                                                                            {spot.dimensions} Sq.ft
                                                                        </span>
                                                                    </div>
                                                                    <RatingStarsSimilar rating={spot.rating} />
                                                                    <button
                                                                        className="board-btn-book-similar"
                                                                        onClick={() => handleSimilarProductClick(spot)}
                                                                    >
                                                                        Book Now
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </Slider>
                                            </div>
                                        ) : (
                                            <div
                                                className="similar-products-grid"
                                                style={{
                                                    display: 'flex',
                                                    flexWrap: 'wrap',
                                                    justifyContent: displayedSimilarSpots.length === 1 ? 'center' :
                                                        displayedSimilarSpots.length === 2 ? 'space-around' : 'space-between',
                                                    gap: '20px'
                                                }}
                                            >
                                                {displayedSimilarSpots.map((spot) => (
                                                    <div
                                                        key={spot._id}
                                                        style={{
                                                            flex: displayedSimilarSpots.length === 1 ? '0 0 auto' :
                                                                displayedSimilarSpots.length === 2 ? '0 0 calc(50% - 10px)' :
                                                                    '0 0 calc(33.333% - 14px)',
                                                            display: 'flex',
                                                            justifyContent: 'center'
                                                        }}
                                                    >
                                                        <div
                                                            className="card board1-book1"
                                                            onClick={() => handleSimilarProductClick(spot)}
                                                            style={{ cursor: "pointer" }}
                                                        >
                                                            <img
                                                                src={spot.image}
                                                                alt={spot.location}
                                                                className="card-img-top-book1"
                                                            />
                                                            <span className="board-category-book1">
                                                                {spot.category}
                                                            </span>
                                                            <div className="board-content-book1">
                                                                <div className="board-content-top-book1">
                                                                    <span className="card-title board-loc-book1-similar">
                                                                        {spot.name}
                                                                    </span>
                                                                </div>
                                                                <div className="board-content-bottom-book1">
                                                                    <span className="board-price-book">
                                                                        {formatIndianCurrency(spot.price, true)}
                                                                        <span className="board-price-bookPerDay">
                                                                            {" "}
                                                                            / Per Day
                                                                        </span>
                                                                    </span>
                                                                    <span className="board-dim-book1">
                                                                        {spot.dimensions} Sq.ft
                                                                    </span>
                                                                </div>
                                                                <RatingStarsSimilar rating={spot.rating} />
                                                                <button
                                                                    className="board-btn-book-similar"
                                                                    onClick={() => handleSimilarProductClick(spot)}
                                                                >
                                                                    Book Now
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <MainFooter />
        </MainLayout>
    );
}

export default BookASite1;
