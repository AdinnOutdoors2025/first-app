/// all issue are fixed 90%
// B2BOOK.JSX
// Corrected login flow and calendar behavior, Booked dates with proper message handling -CORRECTED ENQUIRE NOW 
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
import slugify from "slugify";
// DATE OPEN WINDOW
import { DATE_CONFIG } from "../Adminpanel/BASE_URL.js";
// DATE OPEN WINDOW

const TODAY = new Date();
TODAY.setUTCHours(0, 0, 0, 0);

function BookASite1() {
    const { productId } = useParams();
    const location = useLocation();
    const { user, openLogin, closeLogin } = useLogin();
    const { selectedSpot, setSelectedSpot } = useSpot();

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

    // DATE OPEN WINDOW
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

    // Date Selection State
    const [selectedDates, setSelectedDates] = useState({ start: null, end: null });
    const [campaignConfirmedDates, setCampaignConfirmedDates] = useState({});

    //Window management state
    const [isWindowExpanded, setIsWindowExpanded] = useState(false);
    const [currentWindowStart, setCurrentWindowStart] = useState(null);
    const [currentWindowEnd, setCurrentWindowEnd] = useState(null);
    const [isSelectionConfirmed, setIsSelectionConfirmed] = useState(false);

    // Booking flow states
    const [isProcessingBooking, setIsProcessingBooking] = useState(false);
    const [bookingConfirmation, setBookingConfirmation] = useState(null);

    //Login flow state - simplified
    const [pendingBookingAfterLogin, setPendingBookingAfterLogin] = useState(null);

    //Track if all initial days are booked
    const [allInitialDaysBooked, setAllInitialDaysBooked] = useState(false);
    const [nextBookingOpenDate, setNextBookingOpenDate] = useState(null);
    const [lastBookedDate, setLastBookedDate] = useState(null);

    // To track if we should show login message
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);


    // For enquire now
    const [showEnquireNow, setShowEnquireNow] = useState(false);
    const [enquireNowContext, setEnquireNowContext] = useState(null); // 'booked_dates' or null

    // Effect to check if all initial days are booked
    useEffect(() => {
        if (confirmedDates.length > 0) {
            checkAllInitialDaysBooked();
        }
    }, [confirmedDates]);


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

    const checkAllInitialDaysBooked = () => {
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);

        let allBooked = true;
        let lastBooked = null;

        // Check each day in the initial window
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

        // If all initial days are booked, find the actual last booked date
        if (allBooked) {
            findLastBookedDate(today);
        } else {
            setLastBookedDate(null);
            setNextBookingOpenDate(null);
            setShowEnquireNow(false);
        }
    };

    // Function to find the last booked date
    const findLastBookedDate = (startFrom) => {
        let currentDate = new Date(startFrom);
        let lastBooked = new Date(startFrom);

        // Start from today and keep checking forward
        for (let i = 0; i < 365; i++) {
            if (isDateBooked(currentDate)) {
                lastBooked = new Date(currentDate);
                currentDate.setDate(currentDate.getDate() + 1);
            } else {
                break;
            }
        }

        setLastBookedDate(lastBooked);

        // Calculate next booking open date
        if (lastBooked) {
            const nextAvailableDate = new Date(lastBooked);
            nextAvailableDate.setDate(lastBooked.getDate() + 1);

            const bookingOpenDate = new Date(nextAvailableDate);
            bookingOpenDate.setDate(nextAvailableDate.getDate() - (INITIAL_SELECTION_DAYS - 1));

            // Ensure bookingOpenDate is not in the past
            const today = new Date();
            today.setUTCHours(0, 0, 0, 0);
            if (bookingOpenDate < today) {
                bookingOpenDate.setDate(today.getDate());
            }

            setNextBookingOpenDate(bookingOpenDate);
        }
    };

    // Handle Enquire Now button click
    const handleEnquireNow = () => {
        setEnquireNowContext('booked_dates');

        // Close calendar first
        closeCalendar();

        // Open OTP popup after a small delay
        setTimeout(() => {
            setIsOtpMainOpen(true);
        }, 300);
    };



    // Effect to handle pending booking after login
    useEffect(() => {
        if (isCalendarOpen && currentProduct) {
            // Check if we have pending booking after login
            if (pendingBookingAfterLogin) {
                console.log('Processing pending booking after login:', pendingBookingAfterLogin);

                // Set the dates from pending booking
                setSelectedDates({
                    start: pendingBookingAfterLogin.startDate,
                    end: pendingBookingAfterLogin.endDate
                });

                // Expand window to show dates
                expandDateWindow(pendingBookingAfterLogin.startDate);

                // Clear pending booking
                setPendingBookingAfterLogin(null);

                console.log('Restored dates after login:', {
                    start: pendingBookingAfterLogin.startDate.toISOString().split('T')[0],
                    end: pendingBookingAfterLogin.endDate.toISOString().split('T')[0]
                });
            }
            else if (campaignConfirmedDates.start && campaignConfirmedDates.end) {
                setCurrentWindowStart(campaignConfirmedDates.start);
                setCurrentWindowEnd(campaignConfirmedDates.end);
                setIsWindowExpanded(false);
                setIsSelectionConfirmed(true);

                // Also set selected dates to confirmed dates
                setSelectedDates({
                    start: campaignConfirmedDates.start,
                    end: campaignConfirmedDates.end
                });

                setCalendarErrorMessage(
                    // `Confirmed dates: ${campaignConfirmedDates.start.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} - ${campaignConfirmedDates.end.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`
                );

                console.log('Restoring confirmed dates:', {
                    start: campaignConfirmedDates.start.toISOString().split('T')[0],
                    end: campaignConfirmedDates.end.toISOString().split('T')[0]
                });
            } else if (selectedDates.start && selectedDates.end) {
                // We have selected dates but not confirmed yet
                expandDateWindow(selectedDates.start);
            } else {
                // No selection yet, initialize fresh
                initializeDateWindow();
            }
        }
    }, [isCalendarOpen, currentProduct]);

    const lastConfirmedDate = React.useMemo(() => {
    if (!confirmedDates || confirmedDates.length === 0) return null;

    return confirmedDates.reduce((latest, curr) => {
        return curr > latest ? curr : latest;
    }, confirmedDates[0]);
}, [confirmedDates]);

const getBookingOpenDate = (rangeStartDate) => {
    const openDate = new Date(rangeStartDate);
    openDate.setDate(openDate.getDate() - (INITIAL_SELECTION_DAYS - 1));

    openDate.setUTCHours(0, 0, 0, 0);
    return openDate;
};


const getDynamicFutureLimit = () => {
    if (!lastConfirmedDate) return null;

    const todayUTC = new Date(Date.UTC(
        new Date().getUTCFullYear(),
        new Date().getUTCMonth(),
        new Date().getUTCDate()
    ));

    const diffDays = Math.max(
        1,
        Math.ceil((todayUTC - lastConfirmedDate) / (1000 * 60 * 60 * 24))
    );

    const limit = new Date(lastConfirmedDate);
    limit.setUTCDate(limit.getUTCDate() + diffDays);

    return limit;
};



    // Handle user login state changes
    useEffect(() => {
        if (user && currentProduct) {
            console.log('User logged in, checking for pending booking');
            // Check if we have dates in localStorage from before login
            const pendingBooking = localStorage.getItem('pendingBookingAfterLogin');
            if (pendingBooking) {
                try {
                    const bookingData = JSON.parse(pendingBooking);

                    // Check if it's for current product
                    if (bookingData.productId === currentProduct?.id ||
                        bookingData.prodCode === currentProduct?.prodCode) {

                        const startDate = new Date(bookingData.startDate);
                        const endDate = new Date(bookingData.endDate);

                        // Store in state to be processed when calendar opens
                        setPendingBookingAfterLogin({
                            startDate,
                            endDate,
                            productId: bookingData.productId,
                            prodCode: bookingData.prodCode
                        });

                        // Open calendar automatically
                        setTimeout(() => {
                            setIsCalendarOpen(true);
                        }, 500);

                        // Clear localStorage
                        localStorage.removeItem('pendingBookingAfterLogin');
                    }
                } catch (error) {
                    console.error('Error processing pending booking after login:', error);
                    localStorage.removeItem('pendingBookingAfterLogin');
                }
            }
        }
    }, [user, currentProduct]);

    const initializeDateWindow = () => {
        // Only initialize if we don't have confirmed dates
        if (campaignConfirmedDates.start && campaignConfirmedDates.end) {
            return;
        }

        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);

        let windowStart = new Date(today);
        let windowEnd = new Date(today);

        if (allInitialDaysBooked && lastBookedDate) {
            // Show only up to last booked date
            windowEnd = new Date(lastBookedDate);
        } else {
            // Normal initial window
            windowEnd.setDate(today.getDate() + INITIAL_SELECTION_DAYS - 1);
        }

        setCurrentWindowStart(windowStart);
        setCurrentWindowEnd(windowEnd);
        setIsWindowExpanded(false);
        setIsSelectionConfirmed(false);

        // Set current month to show the window start
        setCurrentMonth(new Date(windowStart));
    };

    const isDateWithinCurrentWindow = (date) => {
        if (!date || isNaN(date.getTime())) return false;

        // If no window set, allow all dates
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

        // When all initial days are booked, show only up to lastBookedDate
        if (allInitialDaysBooked && lastBookedDate) {
            const lastBookedUTC = new Date(
                Date.UTC(
                    lastBookedDate.getFullYear(),
                    lastBookedDate.getMonth(),
                    lastBookedDate.getDate(),
                ),
            );

            // Show dates from today to last booked date
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

            // Check if today is on or after the booking open date
            if (todayUTC >= nextBookingOpenUTC) {
                // Booking is open, show normal window
                windowStart = new Date(today);
                expandedEnd = new Date(today);
                expandedEnd.setDate(today.getDate() + AVAILABLE_WINDOW_DAYS - 1);
            } else {
                // Booking not open yet, show only up to last booked date
                windowStart = new Date(today);
                expandedEnd = new Date(lastBookedDate);
            }
        } else {
            // Normal expansion
            windowStart = new Date(today);
            expandedEnd = new Date(today);
            expandedEnd.setDate(today.getDate() + AVAILABLE_WINDOW_DAYS - 1);
        }

        setCurrentWindowStart(windowStart);
        setCurrentWindowEnd(expandedEnd);
        setIsWindowExpanded(true);
    };

    const isBookingAllowedToday = (rangeStartDate) => {
    const bookingOpenDate = getBookingOpenDate(rangeStartDate);
    const todayUTC = new Date();
    todayUTC.setUTCHours(0, 0, 0, 0);

    return todayUTC >= bookingOpenDate;
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

    // Function to properly clear everything
    const resetDates = () => {
        setSelectedDates({ start: null, end: null });
        setCampaignConfirmedDates({ start: null, end: null });
        setCalendarErrorMessage("");
        setShowQueueInfo(false);
        setIsSelectionConfirmed(false);
        resetToInitialWindow();
        setBookingConfirmation(null);
        setPendingBookingAfterLogin(null);
        setShowLoginPrompt(false);
        localStorage.removeItem('pendingBookingAfterLogin');
    };

    const autoSelectMinimumDays = (startDate) => {
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);

        // Calculate end date (6 days after start date = total 7 days)
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + (MIN_BOOKING_DAYS - 1));

        // Check if end date is within available window (3650 days from today)
        const maxWindowEnd = new Date(today);
        maxWindowEnd.setDate(today.getDate() + AVAILABLE_WINDOW_DAYS - 1);

        if (endDate > maxWindowEnd) {
            // If end date exceeds window, find alternative range
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

        // Check for conflicts
        const conflictBlocks = getConflictBlocks(startDate, endDate);
        const availableDays = getAvailableDaysInRange(startDate, endDate).length;

      if (availableDays >= MIN_BOOKING_DAYS) {

    if (!isBookingAllowedToday(startDate)) {
        const bookingOpenDate = getBookingOpenDate(startDate);

        setCalendarErrorMessage(
            `Next available dates: ` +
            `${startDate.toLocaleDateString("en-IN", { day: "numeric", month: "short" })} - ` +
            `${endDate.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}. ` +
            `⏳ Booking opens on ${bookingOpenDate.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}`
        );

        // 🚫 STOP auto-selection
        return;
    }

    // ✅ Booking window open
    setSelectedDates({ start: startDate, end: endDate });
    return;
}
 else {
            // Try to find alternative range
            const range = findNextAvailableRange(startDate);
           if (range) {
    const bookingOpenDate = getBookingOpenDate(range.start);
    const todayUTC = new Date();
    todayUTC.setUTCHours(0, 0, 0, 0);

    if (todayUTC < bookingOpenDate) {
        // ⛔ Booking not open yet → message only
        setCalendarErrorMessage(
            `Next available dates: ` +
            `${range.start.toLocaleDateString("en-IN", { day: "numeric", month: "short" })} - ` +
            `${range.end.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}. ` +
            `⏳ Booking opens on ${bookingOpenDate.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}`
        );

        // 🚫 Do NOT auto select
        return;
    }

    // ✅ Booking window open → allow auto selection
    setSelectedDates({ start: range.start, end: range.end });
    setCalendarErrorMessage(
        `✅ Found available ${range.days} days: ` +
        `${range.start.toLocaleDateString("en-IN", { day: "numeric", month: "short" })} - ` +
        `${range.end.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}`
    );
}
 else {
                setCalendarErrorMessage(
                    `Cannot find ${MIN_BOOKING_DAYS} continuous available days starting from ${startDate.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}.`,
                );
            }
        }
    };

    // Find next available range starting from a date
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

    const handleOutsideWindowClick = (date) => {
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);

        if (!isWindowExpanded) {
            const windowEnd = new Date(today);
            windowEnd.setDate(today.getDate() + INITIAL_SELECTION_DAYS - 1);

            setCalendarErrorMessage(
                `Date outside initial selection window\n` +
                `Selected: ${date.toLocaleDateString("en-IN", {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                })}\n` +
                `Available window: ${today.toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                })} - ${windowEnd.toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                })}\n` +
                `Click a date within the green window to begin selection`,
            );
        } else {
            const windowEnd = new Date(today);
            windowEnd.setDate(today.getDate() + AVAILABLE_WINDOW_DAYS - 1);

            setCalendarErrorMessage(
                `Date outside available window\n` +
                `Selected: ${date.toLocaleDateString("en-IN", {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                })}\n` +
                `Available window: ${today.toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                })} - ${windowEnd.toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                })}\n` +
                `${AVAILABLE_WINDOW_DAYS} days available from today`,
            );
        }

        // Clear message after 5 seconds
        setTimeout(() => {
            setCalendarErrorMessage("");
        }, 5000);
    };

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
                console.log("No product code provided for similar products");
                setOriginalSimilarSpots([]);
                setDisplayedSimilarSpots([]);
                return;
            }

            const encodedCode = encodeURIComponent(cleanedCode);
            const response = await fetch(
                `${baseUrl}/products/similar/${encodedCode}`,
            );

            if (response.ok) {
                const data = await response.json();
                console.log(`Found ${data.length} similar products for ${cleanedCode}`);
                setOriginalSimilarSpots(data);
                setDisplayedSimilarSpots(data);
            } else if (response.status === 404) {
                console.log("No similar products found");
                setOriginalSimilarSpots([]);
                setDisplayedSimilarSpots([]);
            } else {
                console.log("Error fetching similar products");
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
        setCurrentProduct(mappedSpot);
        setAdditionalFiles(spot.additionalFiles || []);
        setCurrentMainImage(spot.image);
        setCurrentPreviewType("image");
        setCurrentVideoUrl("");
        setSelectedFileIndex(-1);
        setSelectedSpot(mappedSpot);
        setSelectedDates({ start: null, end: null });
        setCampaignConfirmedDates({ start: null, end: null });
        setIsSelectionConfirmed(false);
        setBookingConfirmation(null);
        setPendingBookingAfterLogin(null);
        setShowLoginPrompt(false);
        localStorage.removeItem('pendingBookingAfterLogin');

        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const [isMenuOpen, setMenuOpen] = useState(false);
    const toggleMenu = () => {
        setMenuOpen(!isMenuOpen);
    };

    const [isOpen, setIsOpen] = useState(false);
    const toggleNavOpen = () => {
        setIsOpen(!isOpen);
    };

    const navigate = useNavigate();

    const handleImageChange = (file, index) => {
        if (
            file.type === "video" ||
            (file.url && file.url.match(/\.(mp4|mov|avi|mkv)$/i))
        ) {
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

    const isFileSelected = (index) => {
        return selectedFileIndex === index;
    };

    const isMainImageSelected = () => {
        return selectedFileIndex === -1;
    };

    const RatingStars = ({ rating }) => {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 !== 0;
        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
        return (
            <span className=" rate rating-star">
                {[...Array(fullStars)].map((_, index) => (
                    <span key={index} className="fa-solid fa-star stars1"></span>
                ))}
                {halfStar && <span className="fa-solid fa-star-half-alt stars1"></span>}
                {[...Array(emptyStars)].map((_, index) => (
                    <span
                        key={index}
                        className="fa-solid fa-star empty-star1 stars1"
                    ></span>
                ))}
            </span>
        );
    };

    const fetchDates = async () => {
        if (currentProduct?.prodCode) {
            try {
                const res = await fetch(
                    `${baseUrl}/booked-dates/${currentProduct.prodCode}`,
                );
                const data = await res.json();

                if (res.ok) {
                    let confirmedDatesArray = [];
                    let pendingDatesArray = [];

                    if (data.confirmed && Array.isArray(data.confirmed)) {
                        if (typeof data.confirmed[0] === "string") {
                            confirmedDatesArray = data.confirmed;
                        } else {
                            confirmedDatesArray = data.confirmed.map(
                                (item) => item.date || item,
                            );
                        }
                    }

                    if (data.pending && Array.isArray(data.pending)) {
                        pendingDatesArray = data.pending.map((item) => ({
                            ...item,
                            date: item.date || item,
                        }));
                    }

                    const validConfirmedDates = confirmedDatesArray
                        .filter((d) => {
                            try {
                                const date = new Date(d);
                                return !isNaN(date.getTime());
                            } catch {
                                return false;
                            }
                        })
                        .map((d) => {
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
                        .filter((p) => {
                            const dateStr = p.date;
                            try {
                                const date = new Date(dateStr);
                                return !isNaN(date.getTime());
                            } catch {
                                return false;
                            }
                        })
                        .map((p) => {
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

                    // After setting dates, check initial window status
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

    // To check initial window status
    const checkInitialWindowStatus = (confirmedDatesArray) => {
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);

        let allBooked = true;
        let lastBookedDate = null;

        // Check initial window (next 7 days)
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

    //Check if date is booked in array
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

            // Safety break
            const daysChecked = (nextDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
            if (daysChecked > 365) break;
        }

        setLastBookedDate(lastBooked);

        // Calculate next booking open date
        const nextAvailableDate = new Date(lastBooked);
        nextAvailableDate.setDate(lastBooked.getDate() + 1);

        const bookingOpenDate = new Date(nextAvailableDate);
        bookingOpenDate.setDate(nextAvailableDate.getDate() - (INITIAL_SELECTION_DAYS - 1));

        // Ensure not in past
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);
        if (bookingOpenDate < today) {
            bookingOpenDate.setDate(today.getDate());
        }

        setNextBookingOpenDate(bookingOpenDate);
    };

    const fetchQueuePosition = async (prodCode) => {
        try {
            const response = await fetch(
                `${baseUrl}/pending-reservations/${prodCode}`,
            );
            if (response.ok) {
                const data = await response.json();
                if (data.success && data.reservations) {
                    const userReservation = data.reservations.find(
                        (r) => r.userId === user._id,
                    );
                    if (userReservation) {
                        const position =
                            data.reservations.findIndex(
                                (r) => r.orderId === userReservation.orderId,
                            ) + 1;
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

    // Check if date is confirmed booked (red)
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

    // Check if date is pending (orange)
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

    const fetchDateSuggestions = async (startDate) => {
        try {
            const response = await fetch(
                `${baseUrl}/date-suggestions/${currentProduct.prodCode}?requiredDays=${MIN_BOOKING_DAYS}&startFrom=${startDate.toISOString()}`,
            );
            const data = await response.json();

            if (data.success) {
                setDateSuggestions(data.suggestions || []);
                return data.suggestions;
            }
            return [];
        } catch (error) {
            console.error("Error fetching date suggestions:", error);
            return [];
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

    const findRangeWith7AvailableDays = (startDate) => {
        let availableDays = 0;
        let current = new Date(startDate);
        let endDate = new Date(startDate);
        const maxWindowEnd = currentWindowEnd || new Date();

        while (current <= maxWindowEnd && availableDays < MIN_BOOKING_DAYS) {
            if (!isDateBooked(current) && !isPastDate(current)) {
                availableDays++;
                if (availableDays === MIN_BOOKING_DAYS) {
                    endDate = new Date(current);
                    break;
                }
            } else {
                availableDays = 0;
                startDate = new Date(current);
                startDate.setDate(startDate.getDate() + 1);
                current = new Date(startDate);
                endDate = new Date(startDate);
                continue;
            }
            current.setDate(current.getDate() + 1);
        }

        return availableDays === MIN_BOOKING_DAYS
            ? { start: startDate, end: endDate }
            : null;
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

        // Check for conflict blocks
        const conflictBlocks = getConflictBlocks(start, end);
        const bookedCount = conflictBlocks.reduce(
            (total, block) => total + block.days,
            0,
        );

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
        if (!date || isNaN(date.getTime())) {
            console.warn("Invalid date clicked:", date);
            return;
        }

        try {
            const normalizedDate = new Date(
                Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
            );

            // Check if date is in the past
            if (isPastDate(normalizedDate)) {
                setCalendarErrorMessage("Cannot select past dates.");
                return;
            }

            // Check if date is confirmed booked (red - blocked)
            if (isDateBooked(normalizedDate)) {
                // Check if all initial days are booked
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

            // Handle date selection
            if (!selectedDates.start) {
                // First click - set start date, expand window, and auto-select minimum days
                setSelectedDates({ start: normalizedDate, end: null });
                expandDateWindow(normalizedDate);
                autoSelectMinimumDays(normalizedDate);
                // Clear any error messages when user starts selecting dates
                setCalendarErrorMessage("");
                return;
            }

            if (selectedDates.start && !selectedDates.end) {
                // This shouldn't happen as we auto-select end date, but handle just in case
                autoSelectMinimumDays(selectedDates.start);
                return;
            }

            if (selectedDates.start && selectedDates.end) {
                // Adjusting existing selection
                if (normalizedDate < selectedDates.start) {
                    // Clicked date is before start - set as new start and auto-select
                    setSelectedDates({ start: normalizedDate, end: null });
                    expandDateWindow(normalizedDate);
                    autoSelectMinimumDays(normalizedDate);
                } else {
                    // Clicked date is after start - adjust end date
                    const daysSelected = calculateDaysDifference(
                        selectedDates.start,
                        normalizedDate,
                    );

                    if (daysSelected < MIN_BOOKING_DAYS) {
                        // Auto-extend to minimum days
                        const newEndDate = new Date(selectedDates.start);
                        newEndDate.setDate(
                            selectedDates.start.getDate() + MIN_BOOKING_DAYS - 1,
                        );

                        // Check if new end date is available
                        if (!isDateBooked(newEndDate)) {
                            setSelectedDates({ start: selectedDates.start, end: newEndDate });
                            setCalendarErrorMessage(
                                `Minimum ${MIN_BOOKING_DAYS} days required. Auto-extended to ${newEndDate.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}`,
                            );
                        } else {
                            // Find next available range
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
                        // Valid selection - check for conflicts in new range
                        const conflictBlocks = getConflictBlocks(
                            selectedDates.start,
                            normalizedDate,
                        );
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

    // Generate month for calendar
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
            setCampaignConfirmedDates({ start: null, end: null });
            setIsSelectionConfirmed(false);
            setBookingConfirmation(null);
            setPendingBookingAfterLogin(null);
            setShowLoginPrompt(false);
            localStorage.removeItem('pendingBookingAfterLogin');
        }
    }, [currentProduct, selectedSpot]);

    // Check date conflicts in real-time
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
    // To clear login prompt when user logs in
    useEffect(() => {
        if (user) {
            // Clear any login prompts when user logs in
            setShowLoginPrompt(false);

            // If calendar is open, clear any login-related error messages
            if (isCalendarOpen && calendarErrorMessage === "Please login to proceed with booking.") {
                setCalendarErrorMessage("");
            }

            console.log('User logged in, clearing login prompts');
        }
    }, [user]);

    const handleMainBookButton = async () => {
        console.log('handleMainBookButton called - User:', !!user);

        // If calendar is not open, open it first for date selection
        if (!isCalendarOpen) {
            console.log('Opening calendar for date selection');
            toggleCalendar("");
            return;
        }

        // Now we know calendar is open, check if user has selected dates
        const hasSelectedDates = selectedDates.start && selectedDates.end;
        const hasConfirmedDates = campaignConfirmedDates.start && campaignConfirmedDates.end;

        // If calendar is open but no dates selected
        if (isCalendarOpen && !hasSelectedDates && !hasConfirmedDates) {
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
            return;
        }

        // Check if user is logged in - ONLY WHEN CLICKING RESERVE & BOOK
        if (!user) {
            console.log('User not logged in, showing login prompt');

            // Determine which dates to save
            let datesToSave = null;

            if (hasConfirmedDates) {
                datesToSave = campaignConfirmedDates;
            } else if (hasSelectedDates) {
                datesToSave = selectedDates;
            }

            if (datesToSave && datesToSave.start && datesToSave.end) {
                // Save dates to localStorage
                localStorage.setItem('pendingBookingAfterLogin', JSON.stringify({
                    productId: currentProduct?.id,
                    prodCode: currentProduct?.prodCode,
                    startDate: datesToSave.start.toISOString(),
                    endDate: datesToSave.end.toISOString(),
                    returnUrl: window.location.pathname,
                    timestamp: new Date().toISOString()
                }));

                console.log('Saved dates to localStorage for later login');
            }

            // Show login prompt in calendar (only if calendar is open)
            if (isCalendarOpen) {
                setShowLoginPrompt(true);
                setCalendarErrorMessage("Please login to proceed with booking.");

                // Close calendar and open login after 2 seconds
                setTimeout(() => {
                    setShowLoginPrompt(false);
                    setIsCalendarOpen(false);
                    setCalendarErrorMessage("");
                    openLogin();
                }, 2000);
            } else {
                // If calendar is not open, just open login
                openLogin();
            }
            return;
        }
        if (hasConfirmedDates) {
            // Proceed directly to booking with confirmed dates
            await proceedToBooking(campaignConfirmedDates.start, campaignConfirmedDates.end);
            return;
        }

        // Check if we have selected dates
        if (hasSelectedDates) {
            const validation = validateMinimumDays(selectedDates.start, selectedDates.end);

            if (!validation.valid) {
                setCalendarErrorMessage(validation.message);
                setIsCalendarOpen(true);
                return;
            }

            // Confirm dates first
            const conflictBlocks = getConflictBlocks(selectedDates.start, selectedDates.end);

            if (conflictBlocks.length >= 2) {
                setCalendarErrorMessage(
                    `Selected range has ${conflictBlocks.length} separate booked periods.\n` +
                    `Please select a continuous available period.`
                );
                setIsCalendarOpen(true);
                return;
            }

            const pendingCount = getPendingDaysInRange(selectedDates.start, selectedDates.end);

            setCampaignConfirmedDates({
                start: new Date(selectedDates.start),
                end: new Date(selectedDates.end)
            });

            setIsSelectionConfirmed(true);
            setCurrentWindowStart(new Date(selectedDates.start));
            setCurrentWindowEnd(new Date(selectedDates.end));
            setIsWindowExpanded(false);

            setBookingConfirmation({
                start: selectedDates.start,
                end: selectedDates.end,
                totalDays: validation.days,
                availableDays: validation.availableDays,
                totalPrice: totalPrice,
                pendingCount: pendingCount
            });

            // Proceed to booking
            await proceedToBooking(selectedDates.start, selectedDates.end);
            return;
        }

        console.log('No dates selected, showing error in calendar');
        setCalendarErrorMessage("Please select start and end dates before proceeding.");
        if (!isCalendarOpen) {
            toggleCalendar();
        }
    };

    const proceedToBooking = async (startDate, endDate) => {
        if (!user) {
            console.error('proceedToBooking called without user logged in');
            return;
        }

        setIsProcessingBooking(true);

        // Final real-time conflict check
        const finalConflictCheck = await checkDateConflictsInRealTime(startDate, endDate);

        if (finalConflictCheck.hasConflicts) {
            setCalendarErrorMessage(
                `Sorry! Selected dates are no longer available.\n` +
                `${finalConflictCheck.confirmedConflictCount} date(s) have been booked.\n` +
                `Please select new dates.`
            );
            setIsCalendarOpen(true);
            setIsProcessingBooking(false);
            return;
        }

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

        // Show warning for pending dates
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

        // Clear any pending booking from localStorage
        localStorage.removeItem('pendingBookingAfterLogin');

        // Redirect to billing
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

        setIsProcessingBooking(false);
    };

    const confirmDates = () => {
        if (!selectedDates.start || !selectedDates.end) {
            setCalendarErrorMessage("Please select start and end dates.");
            return;
        }

        const validation = validateMinimumDays(
            selectedDates.start,
            selectedDates.end,
        );

        if (!validation.valid) {
            setCalendarErrorMessage(validation.message);
            return;
        }

        // Get conflict blocks
        const conflictBlocks = getConflictBlocks(
            selectedDates.start,
            selectedDates.end,
        );

        if (conflictBlocks.length >= 2) {
            setCalendarErrorMessage(
                `Selected range has ${conflictBlocks.length} separate booked periods.\n` +
                `Please select a continuous available period.`,
            );
            return;
        }

        const pendingCount = getPendingDaysInRange(
            selectedDates.start,
            selectedDates.end,
        );
        let message = `Dates confirmed!\n`;
        message += `📅 ${validation.days} calendar days selected\n`;
        message += `${validation.availableDays} available days for booking\n`;

        if (conflictBlocks.length > 0) {
            const conflictBlock = conflictBlocks[0];
            message += `${conflictBlock.days} booked day(s) excluded from pricing.\n`;
        }

        if (pendingCount > 0) {
            message += `⏳ ${pendingCount} date${pendingCount > 1 ? "s" : ""} in queue.\n`;
        }

        message += `💰 Price calculated for ${validation.availableDays} available days.`;

        setCalendarErrorMessage(message);

        // IMPORTANT: Store the confirmed dates
        setCampaignConfirmedDates({
            start: new Date(selectedDates.start),
            end: new Date(selectedDates.end),
        });

        // Set selection confirmed state
        setIsSelectionConfirmed(true);

        // Set window to show only selected range
        setCurrentWindowStart(new Date(selectedDates.start));
        setCurrentWindowEnd(new Date(selectedDates.end));
        setIsWindowExpanded(false);

        setTimeout(() => {
            setCalendarErrorMessage("");
            setIsCalendarOpen(false);
        }, 3000);
    };

    const getDateSelectionClass_old = (date) => {
        if (!date || isNaN(date.getTime())) {
            return "disabled";
        }

        try {
            const normalizedDate = new Date(
                Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
            );

            // Check if date is past
            if (isPastDate(normalizedDate)) {
                return "past";
            }

            // Check if date is outside current window
            if (!isDateWithinCurrentWindow(normalizedDate)) {
                return "outside-window";
            }

            // When all initial days are booked, hide dates after lastBookedDate
            if (allInitialDaysBooked && lastBookedDate) {
                const lastBookedUTC = new Date(
                    Date.UTC(
                        lastBookedDate.getFullYear(),
                        lastBookedDate.getMonth(),
                        lastBookedDate.getDate(),
                    ),
                );

                if (normalizedDate > lastBookedUTC) {
                    return "hidden";
                }
            }

            // Check booking status
            if (isDateBooked(normalizedDate)) return "booked";
            if (isDatePending(normalizedDate)) return "pending";

            // Check if in selected range
            if (selectedDates.start && selectedDates.end) {
                const utcDate = new Date(
                    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
                );

                const startUTC = new Date(
                    Date.UTC(
                        selectedDates.start.getFullYear(),
                        selectedDates.start.getMonth(),
                        selectedDates.start.getDate(),
                    ),
                );

                const endUTC = new Date(
                    Date.UTC(
                        selectedDates.end.getFullYear(),
                        selectedDates.end.getMonth(),
                        selectedDates.end.getDate(),
                    ),
                );

                if (utcDate.getTime() === startUTC.getTime()) return "selected-start";
                if (utcDate.getTime() === endUTC.getTime()) return "selected-end";
                if (utcDate > startUTC && utcDate < endUTC) {
                    return "selected-range";
                }
            }

            return "available";
        } catch (error) {
            console.warn("Error in getDateSelectionClass:", error);
            return "disabled";
        }
    };
    
const getDateSelectionClass = (date) => {
    if (!date || isNaN(date.getTime())) return "disabled";

    const normalizedDate = new Date(
        Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
    );

    // 1️⃣ Past dates
    if (isPastDate(normalizedDate)) {
        return "past";
    }

    // 2️⃣ ADMIN APPROVED (RED) — always visible, no limits
    if (isDateBooked(normalizedDate)) {
        return "booked";
    }

    // 3️⃣ PENDING (ORANGE)
    if (isDatePending(normalizedDate)) {
        // handled later for hiding
    }

    // 4️⃣ Outside initial booking window (only affects available/pending)
    if (!isDateWithinCurrentWindow(normalizedDate)) {
        return "outside-window";
    }

    // 5️⃣ Dynamic hiding AFTER last confirmed date
  
    // 6️⃣ Selected range
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

    // 7️⃣ Pending (visible until hidden logic applies)
    if (isDatePending(normalizedDate)) {
        return "pending";
    }

    // 8️⃣ Default available
    return "available";
};

////

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
        setCurrentMonth(
            new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1),
        );
    };

    const goToPreviousMonth = () => {
        setCurrentMonth(
            new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1),
        );
    };

    const [productsOrderData, setProductsOrderData] = useState([]);

    const toggleCalendar = async (errorMessage = "") => {
        if (currentProduct) {
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
            if (errorMessage && errorMessage !== "Please login to proceed with booking.") {
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

    // Login/Otp toggles
    const toggleLoginPage = () => {
        if (isLoginOpen) {
            closeLogin();
        } else {
            openLogin();
        }
    };

    const closeLoginPage = () => {
        setIsLoginOpen(false);
    };

    const toggleOtpMainPage = () => {
        setIsOtpMainOpen(!isOtpMainOpen);
    };

    const closeOtpMainPage = () => {
        setIsOtpMainOpen(false);
    };

    // Price calculations
    const pricePerDay =
        currentProduct?.displayPrice || currentProduct?.price || 0;
    const startDate = selectedDates.start || campaignConfirmedDates.start;
    const endDate = selectedDates.end || campaignConfirmedDates.end;
    const availableDaysInRange =
        startDate && endDate ? getAvailableDaysInRange(startDate, endDate) : [];
    const totalDays = availableDaysInRange.length;
    const totalPrice = totalDays * pricePerDay;

    const handleAddToCart = async () => {
        if (!user) {
            // Check if we have any dates selected
            const hasConfirmedDates = campaignConfirmedDates.start && campaignConfirmedDates.end;
            const hasSelectedDates = selectedDates.start && selectedDates.end;
            const hasDates = hasConfirmedDates || hasSelectedDates;

            if (hasDates) {
                let datesToSave = null;

                if (hasConfirmedDates) {
                    datesToSave = campaignConfirmedDates;
                } else if (hasSelectedDates) {
                    datesToSave = selectedDates;
                }

                // Save dates to localStorage
                localStorage.setItem('pendingBookingAfterLogin', JSON.stringify({
                    productId: currentProduct?.id,
                    prodCode: currentProduct?.prodCode,
                    startDate: datesToSave.start.toISOString(),
                    endDate: datesToSave.end.toISOString(),
                    returnUrl: window.location.pathname,
                    timestamp: new Date().toISOString(),
                    action: 'addToCart'
                }));

                // Show login message if calendar is open
                if (isCalendarOpen) {
                    setShowLoginPrompt(true);
                    setCalendarErrorMessage("Please login to add to cart.");

                    // Close calendar and open login after 2 seconds
                    setTimeout(() => {
                        setIsCalendarOpen(false);
                        setShowLoginPrompt(false);
                        openLogin();
                    }, 2000);
                } else {
                    // Just open login if calendar is not open
                    openLogin();
                }
            } else {
                // No dates selected, show error or open calendar
                if (!isCalendarOpen) {
                    toggleCalendar("Please select start and end dates first to add to cart.");
                } else {
                    setCalendarErrorMessage("Please select start and end dates first to add to cart.");
                }
            }
            return;
        }

        // User is logged in from here on

        // Check if we have confirmed dates from previous session
        if (campaignConfirmedDates.start && campaignConfirmedDates.end) {
            // Validate confirmed dates
            const validation = validateMinimumDays(campaignConfirmedDates.start, campaignConfirmedDates.end);

            if (!validation.valid) {
                setCalendarErrorMessage(validation.message);
                setIsCalendarOpen(true);
                return;
            }

            // Check for multiple conflict blocks in confirmed dates
            const conflictBlocks = getConflictBlocks(campaignConfirmedDates.start, campaignConfirmedDates.end);
            if (conflictBlocks.length >= 2) {
                setCalendarErrorMessage(
                    `Confirmed range has ${conflictBlocks.length} separate booked periods.\n` +
                    `Please select a new date range.`
                );
                setIsCalendarOpen(true);
                return;
            }

            // Calculate price for confirmed dates
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
                startDate: campaignConfirmedDates.start?.toISOString(),
                endDate: campaignConfirmedDates.end?.toISOString(),
                sizeWidth: currentProduct?.sizeWidth,
                sizeSide: currentProduct?.sizeSide,
                productsquareFeet: currentProduct?.productsquareFeet,
                sizeHeight: currentProduct?.sizeHeight,
                dimension: (currentProduct?.sizeHeight || 0) * (currentProduct?.sizeWidth || 0),
                adType: currentProduct?.category,
                totalAmount: confirmedTotalPrice.toLocaleString(),
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
                // Queue info
                queueInfo: {
                    hasPendingDates: confirmedPendingCount > 0,
                    pendingCount: confirmedPendingCount,
                    enteredQueueAt: new Date().toISOString()
                }
            };

            try {
                const response = await fetch(`${baseUrl}/cart`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(cartItem)
                });

                const responseData = await response.json();

                if (response.ok) {
                    alert("Item added to cart successfully!");
                    navigate("/cart");
                } else {
                    throw new Error(responseData.message || 'Failed to add to cart');
                }
            } catch (error) {
                console.error('Error adding to cart:', error);
                alert(`Failed to add item to cart: ${error.message}`);
            }
            return;
        }

        // If no confirmed dates, check if we have selected dates
        if (selectedDates.start && selectedDates.end) {
            const validation = validateMinimumDays(selectedDates.start, selectedDates.end);

            if (!validation.valid) {
                setCalendarErrorMessage(validation.message);
                setIsCalendarOpen(true);
                return;
            }

            const pendingCount = getPendingDaysInRange(selectedDates.start, selectedDates.end);
            const conflictBlocks = getConflictBlocks(selectedDates.start, selectedDates.end);

            if (conflictBlocks.length >= 2) {
                setCalendarErrorMessage(
                    `Selected range has ${conflictBlocks.length} separate booked periods.\n` +
                    `Please select a continuous available period.`
                );
                setIsCalendarOpen(true);
                return;
            }

            // Show appropriate message based on queue status
            if (pendingCount > 0) {
                setCalendarErrorMessage(
                    `${pendingCount} date${pendingCount > 1 ? 's' : ''} in queue.\n` +
                    `Please confirm dates first.`
                );
            } else {
                setCalendarErrorMessage(
                    `${validation.days} days selected with ${validation.availableDays} available days.\n` +
                    `Please confirm dates first.`
                );
            }

            setIsCalendarOpen(true);
            return;
        }

        // No dates selected at all
        if (!isCalendarOpen) {
            toggleCalendar("Please select start and end dates first to add to cart.");
        } else {
            setCalendarErrorMessage("Please select start and end dates first to add to cart.");
        }
    };

    const handleReserveNow = async () => {
        if (!user) {
            openLogin();
            return;
        }

        // Check if we have confirmed dates from previous session
        if (campaignConfirmedDates.start && campaignConfirmedDates.end) {
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

            // Show queue warning if there are pending dates
            if (pendingCount > 0) {
                const confirmBooking = window.confirm(
                    `Warning: ${pendingCount} date${pendingCount > 1 ? "s" : ""} in your selection are in queue.\n\n` +
                    `You'll be added to the queue for these dates.\n` +
                    `If pending orders get cancelled, your booking will be confirmed.\n\n` +
                    `Do you want to proceed to billing?`,
                );

                if (!confirmBooking) {
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
        if (selectedDates.start && selectedDates.end) {
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

        // No dates selected at all
        setCalendarErrorMessage(
            `Please select & confirm dates (minimum ${MIN_BOOKING_DAYS} available days) to proceed.\n` +
            `Click a date to auto-select ${MIN_BOOKING_DAYS} days.`,
        );
        setIsCalendarOpen(true);
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
                {halfStar && (
                    <span className="fa-solid fa-star-half-alt stars-book1"></span>
                )}
                {[...Array(emptyStars)].map((_, index) => (
                    <span
                        key={index}
                        className="fa-solid fa-star empty-star-book1"
                    ></span>
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
                <MainNavbar />
                <div
                    className={`calendar-wrapper login-wrapper otp-wrapper ${isCalendarOpen ? "calendar-open" : ""} ${isLoginOpen ? "login-open" : ""} ${isOtpMainOpen ? "otp-main-open" : ""} `}
                >
                    {/* Image with details section */}
                    <div
                        className="container-fluid mt-5 Book-section"
                        id="similarProdDetailsShows"
                    >
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
                                                        (file.url &&
                                                            file.url.match(/\.(mp4|mov|avi|mkv)$/i)) ? (
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
                    className=" mt-3 mb-2 btn-enquire"
                    onClick={toggleOtpMainPage}
                  >
                   <img
                        src="/images/add-to-cart-icon 1.svg"
                        className="location-arrow"
                        alt="arrow"
                      ></img>Add to cart
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
                            ₹{" "}
                            {currentProduct.displayPrice?.toLocaleString() ||
                              "0"}
                            <span className="rate-perDay1"> / Per Day</span>
                          </span>

                          {/* ⭐ Rating */}
                          <div className="rate1-book">
                            <span className="rating1-text">4.3</span>
                            <span className="fa-solid fa-star rating1-star"></span>
                          </div>
                        </div>

                        <span className="original-price-strikethrough">
                          ₹{" "}
                          {currentProduct.originalPrice?.toLocaleString() ||
                            "0"}
                        </span>
                      </>
                    ) : (
                      <div className="price-rating-row">
                        <span className="rate-perDay">
                          ₹ {currentProduct.price?.toLocaleString() || "0"}
                          <span className="rate-perDay1"> / Per Day</span>
                        </span>

                        {/* ⭐ Rating */}
                        <div className="rate1-book">
                          <span className="rating1-text">4.3</span>
                          <span className="fa-solid fa-star rating1-star"></span>
                        </div>
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
                                    {/* <p className="book-size">
                                        Size: {currentProduct.sizeWidth} x{" "}
                                        {currentProduct.sizeHeight}
                                        {(currentProduct.category === "Signal Post" ||
                                            currentProduct.category === "Pole Kiosk") &&
                                            ` x ${currentProduct.sizeSide}`}
                                        <span className="slash-bar">|</span>
                                        {currentProduct.productsquareFeet} Sq.ft
                                        {(currentProduct.category === "Signal Post" ||
                                            currentProduct.category === "Pole Kiosk") && (
                                                <span className="sided-text"> (2-Sided)</span>
                                            )}
                                    </p> */}
 {/* <div className="bookingdetialslist1">
                                    <span className="btn-type">{currentProduct.category}</span>
                                    <span className="badge book-type">
                                        {currentProduct.prodLighting}
                                    </span>
                                     </div> */}
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
                                    {/* <span className="star-main">
                                        <span>
                                            <img
                                                src="/images/rating_board.png"
                                                className="rate-board1"
                                            ></img>
                                        </span>
                                        <span>
                                            <RatingStars rating={currentProduct.rating} />{" "}
                                        </span>
                                    </span>
                                    <span className="productLocationImg">
                                        <a
                                            href={currentProduct.LocationLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <img
                                                src="/images/mapiconaddin.png"
                                                alt="location icon"
                                                className="locationImgIcon"
                                            />
                                            <span className="viewlocation">View Location</span>
                                        </a>
                                    </span> */}

                                    {/* <div className="book-price my-3">
                                        Printing Cost
                                        <span className="cost-gap">
                                            : ₹ {currentProduct.printingCost?.toLocaleString() || "0"}
                                        </span>
                                        <span className="slash-bar1">|</span>
                                        Mounting Cost
                                        <span className="cost-gap">
                                            : ₹ {currentProduct.mountingCost?.toLocaleString() || "0"}
                                        </span>
                                    </div>
                                    <div className="book-spot mt-3">
                                        {currentProduct.productFrom}
                                        <span>
                                            <img
                                                src="/images/Location_arrow.png"
                                                className="location-arrow"
                                                alt="arrow"
                                            ></img>
                                        </span>
                                        {currentProduct.productTo}
                                    </div> */}
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
                                    {/* <div className="book-rate">
                                        <div className="book-rateContent1">
                                            {currentProduct.isOfferProduct ? (
                                                <>
                                                    <span className="rate-perDay offer-price-highlight">
                                                        ₹{" "}
                                                        {currentProduct.displayPrice?.toLocaleString() ||
                                                            "0"}
                                                        <span className="rate-perDay1">Per Day</span>
                                                    </span>
                                                    <span className="original-price-strikethrough">
                                                        ₹{" "}
                                                        {currentProduct.originalPrice?.toLocaleString() ||
                                                            "0"}
                                                    </span>
                                                </>
                                            ) : (
                                                <span className="rate-perDay">
                                                    ₹ {currentProduct.price?.toLocaleString() || "0"}
                                                    <span className="rate-perDay1">/ Per Day</span>
                                                </span>
                                            )}
                                            <br />
                                            <a href="#Terms" className="book-condition anchor">
                                                Terms & Condition
                                            </a>
                                        </div>

                                        <div className="book-rateContent2">
                                            <button
                                                className=" book-date"
                                                onClick={handleMainBookButton}
                                                disabled={isProcessingBooking}
                                            >
                                                {isProcessingBooking ? 'Processing...' : 'Book Now'}
                                                <span>
                                                    <img
                                                        src="/images/calender_icon.png"
                                                        className="calender"
                                                        alt="calendar"
                                                    ></img>
                                                </span>
                                            </button>
                                        </div>
                                    </div> */}
                                      <div className="book-rateContent2">
  <button
    className="book-date-range"
    onClick={handleMainBookButton}
    disabled={isProcessingBooking}
  >
    <div className="date-box">
      <span className="date-number">12</span>
      <span className="date-text">Jan - 2026</span>
    </div>

    <span className="date-separator">–</span>

    <div className="date-box">
      <span className="date-number">30</span>
      <span className="date-text">Jan - 2026</span>
    </div>
     </button>
     </div>
                                    {/* <button
                                        className=" mt-3 mb-2 btn-enquire"
                                        // onClick={toggleOtpMainPage}
                                        onClick={handleEnquireNow}

                                    >
                                        Enquire Now
                                    </button> */}
                                     <button
                    className=" mt-3 mb-2 btn-enquire1"
                    onClick={handleMainBookButton}
                        disabled={isProcessingBooking}
                  >
                    {isProcessingBooking ? "Processing..." : "Book Now"}
                        {/* <span>
                          <img
                            src="/images/calender_icon.png"
                            className="calender"
                            alt="calendar"
                          ></img>
                        </span> */}
                      </button>
                      <button
                    className=" mt-3 mb-2 btn-enquire2"
                    onClick={toggleOtpMainPage}
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
                                            confirmDates={handleMainBookButton} // This is the Reserve & Book button
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
                                            // showLoginPrompt={showLoginPrompt}
                                            allInitialDaysBooked={allInitialDaysBooked}
                                            nextBookingOpenDate={nextBookingOpenDate}
                                            showEnquireNow={showEnquireNow}
                                            handleEnquireNow={handleEnquireNow}
                                            showLoginPrompt={showLoginPrompt && !user}
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
                                    <li>
                                        Sites are subject to availability at the time of
                                        confirmation.
                                    </li>
                                    <li>
                                        The campaign should commence within 7 business days from the
                                        date of confirmation. Failure to adhere to this timeline
                                        will result in the release of sites without further notice
                                        or billing from the confirmation date.
                                    </li>
                                    <li>
                                        Requests for campaign extensions must be communicated via
                                        email at least 10 days before the end date of the current
                                        campaign. Extensions requested with shorter notice are
                                        subject to site availability.
                                    </li>
                                    <li>
                                        We are not liable for damages to flex caused by natural
                                        calamities. Reprinting costs are to be borne by you, with
                                        flex remounting provided free of charge.
                                    </li>
                                    <li>100% payment is required in advance.</li>
                                    <li>
                                        Purchase orders must be issued in the name of Adinn
                                        Advertising Services, Ltd and provided before the campaign
                                        commences.
                                    </li>
                                    <li>An 18% GST is applicable to all transactions.</li>
                                </ul>
                            </div>

                            {/* Nearby Similar Products */}
                            <div>
                                <div className="container similar mt-5">
                                    <h2 className="NearbyHeading mb-4">
                                        Nearby Similar Products
                                    </h2>
                                    <div className="row similar-products">
                                        {displayedSimilarSpots.length > 0 ? (
                                            displayedSimilarSpots.map((spot) => (
                                                <div
                                                    className="col-lg-3 col-md-3 col-sm-12 mb-4"
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
                                                                <span className="card-title board-loc-book1">
                                                                    {spot.name}
                                                                </span>
                                                                <span className="board-dim-book1">
                                                                    {spot.dimensions}
                                                                </span>
                                                            </div>
                                                            <div className="board-content-bottom-book1">
                                                                <span className="board-price-book1">
                                                                    ₹{spot.price.toLocaleString()}
                                                                </span>
                                                                <img
                                                                    src="/images/rating_board.png"
                                                                    className="rate-board-book1"
                                                                    alt="rating"
                                                                ></img>
                                                            </div>
                                                            <RatingStarsSimilar rating={spot.rating} />
                                                            <button
                                                                className="board-btn-book1"
                                                                onClick={() => handleSimilarProductClick(spot)}
                                                            >
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
    );
}

export default BookASite1;
