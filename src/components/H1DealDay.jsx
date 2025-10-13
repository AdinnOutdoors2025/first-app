








import React, { useState, useEffect } from 'react';
import './H1DealDay.css';
import { MainLayout } from './MainLayout';
import MainNavbar from './A1NAVBAR.jsx';
import MainFooter from './A1FOOTER.jsx';
import { useSpot } from "./B0SpotContext";
import { useNavigate } from "react-router-dom";
import slugify from 'slugify';
//BASE URL OF http://localhost:3001 FILE IMPORT 
import { baseUrl } from '../Adminpanel/BASE_URL';
import { Statistic } from 'antd';
const { Countdown } = Statistic;

function H1DealDay() {
    // Navbar js 
    const [isMenuOpen, setMenuOpen] = useState(false);
    const toggleMenu = () => {
        setMenuOpen(!isMenuOpen);
    };

    //Nav_user toggle section
    const [isOpen, setIsOpen] = useState(false);

    // State for products and offer products
    const [spots, setSpots] = useState([]);
    const [offerSpots, setOfferSpots] = useState([]);
    const [mediaTypes, setMediaTypes] = useState([]);
    const [stateDistricts, setStateDistricts] = useState({});
    const [isLoading, setIsLoading] = useState(true);


    // Fetch data from backend
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);

                // Fetch ALL products (including hidden ones for reference)
                const productsRes = await fetch(`${baseUrl}/products`);
                const productsData = await productsRes.json();

                // Separate visible products for regular spots
                const visibleProducts = productsData.filter(product => product.visible !== false);

                // Fetch offer products
                const offerRes = await fetch(`${baseUrl}/OfferedProduct/offerProduct`);
                const offerData = await offerRes.json();
                const visibleOfferProducts = offerData.filter(offer => offer.visible !== false);

                // Map regular products to spots structure (only visible ones)
                const mappedSpots = visibleProducts.map(product => ({
                    id: product._id,
                    prodName: product.name,
                    printingCost: product.printingCost,
                    mountingCost: product.mountingCost,
                    prodCode: product.prodCode,
                    prodLighting: product.lighting,
                    productFrom: product.from,
                    productTo: product.to,
                    productFixedAmount: product.fixedAmount,
                    productFixedOffer: product.fixedOffer,
                    location: `${product.location.district}, ${product.location.state}`,
                    category: product.mediaType,
                    price: product.price,
                    sizeHeight: product.height,
                    sizeWidth: product.width,
                    rating: product.rating,
                    imageUrl: product.image,
                    district: product.location.district,
                    state: product.location.state,
                    similarProduct: product.similarProducts,
                    latitude: product.Latitude,
                    longitude: product.Longitude,
                    LocationLink: product.LocationLink,
                    additionalFiles: product.additionalFiles,
                    isOfferProduct: false // Flag to identify regular products
                }));

                // Map offer products to spots structure (with offer details)
                // IMPORTANT: Use ALL products (including hidden ones) to find original product references
                const mappedOfferSpots = visibleOfferProducts.map(offer => {
                    // Find the corresponding product details from ALL products (including hidden)
                    const originalProduct = productsData.find(
                        product => product.prodCode === offer.originalProductId
                    );

                    // If original product not found, create a standalone offer product
                    if (!originalProduct) {
                        console.warn(`Original product not found for offer: ${offer._id}, creating standalone offer`);
                        return {
                            id: offer._id, // Use offer ID as fallback
                            prodName: offer.name || "Special Offer Product",
                            printingCost: offer.printingCost || 0,
                            mountingCost: offer.mountingCost || 0,
                            prodCode: offer.productCode || `OFFER-${offer._id}`,
                            prodLighting: offer.lighting || "Not Specified",
                            productFrom: offer.from || "Not Specified",
                            productTo: offer.to || "Not Specified",
                            productFixedAmount: offer.fixedAmount || 0,
                            productFixedOffer: offer.fixedOffer || 0,
                            location: `${offer.location?.district || "Unknown"}, ${offer.location?.state || "Unknown"}`,
                            category: offer.mediaType || "General",
                            // Price fields - Use offer prices
                            price: offer.offerPrice || 0,
                            displayPrice: offer.offerPrice || 0,
                            originalPrice: offer.originalPrice || offer.offerPrice || 0,
                            sizeHeight: offer.size?.height || 0,
                            sizeWidth: offer.size?.width || 0,
                            rating: offer.rating || 0,
                            imageUrl: offer.image || "/images/placeholder.jpg",
                            district: offer.location?.district || "Unknown",
                            state: offer.location?.state || "Unknown",
                            latitude: offer.Latitude || 0,
                            longitude: offer.Longitude || 0,
                            LocationLink: offer.LocationLink || "#",
                            additionalFiles: offer.additionalFiles || [],
                            isOfferProduct: true,
                            offerId: offer._id,
                            originalProductId: offer.originalProductId,
                            isStandaloneOffer: true // Flag to identify standalone offers
                        };
                    }

                    // Create a properly mapped spot object with original product data
                    const mappedSpot = {
                        // Use original product ID for navigation (even if hidden)
                        id: originalProduct._id,
                        prodName: offer.name || originalProduct.name,
                        printingCost: offer.printingCost || originalProduct.printingCost,
                        mountingCost: offer.mountingCost || originalProduct.mountingCost,
                        prodCode: originalProduct.prodCode,
                        prodLighting: offer.lighting || originalProduct.lighting,
                        productFrom: offer.from || originalProduct.from,
                        productTo: offer.to || originalProduct.to,
                        productFixedAmount: offer.fixedAmount || originalProduct.fixedAmount,
                        productFixedOffer: offer.fixedOffer || originalProduct.fixedOffer,
                        location: `${offer.location?.district || originalProduct.location.district}, ${offer.location?.state || originalProduct.location.state}`,
                        category: offer.mediaType || originalProduct.mediaType,
                        // Price fields - IMPORTANT: Use offerPrice for display, originalPrice for comparison
                        price: offer.offerPrice, // This will be used for display and calculations
                        displayPrice: offer.offerPrice, // Offer price for display
                        originalPrice: offer.originalPrice || originalProduct.price, // Original price for strikethrough
                        sizeHeight: offer.size?.height || originalProduct.height,
                        sizeWidth: offer.size?.width || originalProduct.width,
                        rating: offer.rating || originalProduct.rating,
                        imageUrl: offer.image || originalProduct.image,
                        district: offer.location?.district || originalProduct.location.district,
                        state: offer.location?.state || originalProduct.location.state,
                        latitude: originalProduct.Latitude,
                        longitude: originalProduct.Longitude,
                        LocationLink: originalProduct.LocationLink,
                        additionalFiles: originalProduct.additionalFiles || [],
                        isOfferProduct: true, // Flag to identify offer products
                        offerId: offer._id,
                        originalProductId: offer.originalProductId,
                        isStandaloneOffer: false // This offer has an original product
                    };

                    return mappedSpot;
                });

                setSpots(mappedSpots);
                setOfferSpots(mappedOfferSpots);

                // Fetch media types
                const mediaRes = await fetch(`${baseUrl}/mediatype`);
                const mediaData = await mediaRes.json();
                setMediaTypes(mediaData.map(m => m.type));

                // Fetch locations
                const locationsRes = await fetch(`${baseUrl}/category`);
                const locationsData = await locationsRes.json();

                // Convert to stateDistricts format
                const stateMap = locationsData.reduce((acc, curr) => {
                    acc[curr.state] = curr.districts;
                    return acc;
                }, {});

                setStateDistricts(stateMap);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    // Update outdoor mediums to use fetched media types
    const outdoorMediums = mediaTypes;

    //By for the first dropdown
    const [isOpen1, setIsOpen1] = useState(false);
    const [selected1, setSelected1] = useState("By");
    // State for the second dropdown
    const [isOpen2, setIsOpen2] = useState(false);
    const [selected2, setSelected2] = useState("State");
    // Functions for first dropdown
    const toggleDropdown1 = () => {
        setIsOpen1(!isOpen1);
    };
    const selectOption1 = (option) => {
        setSelected1(option);
        setSortOption(option); // Update sort state
        setIsOpen1(false); // Close dropdown after selection
    };
    const resetDropdown1 = (event) => {
        event.stopPropagation(); // Prevent closing the dropdown on icon click
        setSelected1("By"); // Reset selected value
    };

    const [checkedDistricts, setCheckedDistricts] = useState([]);
    const toggleDropdown2 = () => setIsOpen2(prev => !prev);
    // Reset Dropdown (Clears selection)
    const resetDropdown2 = (e) => {
        e.stopPropagation(); // Prevents dropdown from toggling
        setSelectedStates([]);
        setSelectedDistricts([]);
        setSelected2("State");
    };
    // SINGLE SELECTION DISTRICTS
    const selectOption2 = (state) => {
        setActiveLocationTab(state);
        setTempStates([state]);
        const filteredDistricts = tempDistricts.filter((district) =>
            stateDistricts[state]?.includes(district)
        );
        setTempDistricts(filteredDistricts);

        if (!selectedStates.includes(state)) {
            setSelectedStates((prev) => [...prev, state]);
        }

        if (selectedStates.includes(state)) {
            setSelectedStates([]);
            setSelectedDistricts([]);
        } else {
            setSelectedStates([state]);
            const updatedDistricts = selectedDistricts.filter((district) =>
                stateDistricts[state]?.includes(district)
            );
            setSelectedDistricts(updatedDistricts);
        }
    };
    //Start rating board
    // Function to render star ratings
    const RatingStars = ({ rating }) => {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 !== 0;
        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
        return (
            <div className="rate-book">
                {[...Array(fullStars)].map((_, index) => (
                    <span key={index} className="fa-solid fa-star stars-book"></span>
                ))}
                {halfStar && <span className="fa-solid fa-star-half-alt stars-book"></span>}
                {[...Array(emptyStars)].map((_, index) => (
                    <span key={index} className="fa-solid fa-star empty-star-book"></span>
                ))}
            </div>
        );
    };

    const [selectedOutdoorMedium, setSelectedOutdoorMedium] = useState([]);
    const [selectedStates, setSelectedStates] = useState([]); // Multiple states
    const [selectedDistricts, setSelectedDistricts] = useState([]); // Multiple districts
    const [sortOption, setSortOption] = useState("By");

    // Toggle outdoor medium checkboxes
    const handleOutdoorMediumChange = (event) => {
        const medium = event.target.value;
        setSelectedOutdoorMedium((prev) =>
            prev.includes(medium) ? prev.filter((m) => m !== medium) : [...prev, medium]
        );
    };

    //Toggle district change
    const handleDistrictChange = (district) => {
        setTempDistricts((prev) =>
            prev.includes(district)
                ? prev.filter((d) => d !== district)
                : [...prev, district]
        );
        setSelectedDistricts((prev) =>
            prev.includes(district) ? prev.filter((d) => d !== district) : [...prev, district]
        );
    };

    // Filter offer spots (only show offer products in deal of the day)
    let filteredSpots = offerSpots.filter((spot) => {
        const spotState = spot.state.toLowerCase();
        const spotDistrict = spot.district.toLowerCase();
        const spotCategory = spot.category?.toLowerCase() || "";

        const isStateMatch =
            selectedStates.length === 0 ||
            selectedStates.some((state) => spotState.includes(state.toLowerCase()));

        const isDistrictMatch =
            selectedDistricts.length === 0 ||
            selectedDistricts.some((district) => spotDistrict.includes(district.toLowerCase()));

        const isCategoryMatch =
            selectedOutdoorMedium.length === 0 ||
            selectedOutdoorMedium.some((medium) => spotCategory === medium.toLowerCase());

        return isStateMatch && isDistrictMatch && isCategoryMatch;
    });

    //  Sorting function
    // Ensure sorting happens after filtering
    if (sortOption === "Price: Low to High") {
        filteredSpots.sort((a, b) => a.price - b.price);
    } else if (sortOption === "Price: High to Low") {
        filteredSpots.sort((a, b) => b.price - a.price);
    } else if (sortOption === "Popularity: High to Low") {
        filteredSpots.sort((a, b) => b.rating - a.rating);
    } else if (sortOption === "Popularity: Low to High") {
        filteredSpots.sort((a, b) => a.rating - b.rating);
    }

    // PAGINATION 
    const [currentPage, setCurrentPage] = useState(1);
    const spotsPerPage = 9;
    const totalSpots = filteredSpots.length;
    const totalPages = Math.ceil(totalSpots / spotsPerPage);
    const indexOfLastSpot = currentPage * spotsPerPage;
    const indexOfFirstSpot = indexOfLastSpot - spotsPerPage;
    const currentSpots = filteredSpots.slice(indexOfFirstSpot, indexOfLastSpot);

    // Helper function to generate page numbers
    const getPaginationGroup = () => {
        let pages = [];
        const maxPagesToShow = 3; // Number of middle pages to show

        if (totalPages <= 6) {
            // If few pages, show all
            pages = Array.from({ length: totalPages }, (_, i) => i + 1);
        } else {
            if (currentPage <= maxPagesToShow + 1) {
                // If near start: Show first few + last 2
                pages = [...Array(maxPagesToShow + 1).keys()].map((i) => i + 1);
                pages.push("...", totalPages - 1, totalPages);
            } else if (currentPage >= totalPages - maxPagesToShow) {
                // If near end: Show first 2 + last few
                pages = [1, 2, "..."];
                pages.push(...Array.from({ length: maxPagesToShow + 1 }, (_, i) => totalPages - maxPagesToShow + i));
            } else {
                // Middle section: Show current, 1 before & after
                pages = [1, 2, "..."];
                pages.push(currentPage - 1, currentPage, currentPage + 1);
                pages.push("...", totalPages - 1, totalPages);
            }
        }
        return pages;
    };

    // NAVIGATE
    const navigate = useNavigate();
    const [isLoginOpen, setIsLoginOpen] = useState(false); // State to toggle Login 
    const { setSelectedSpot } = useSpot();

    const handleBookNow = (spot) => {
        if (spot.isOfferProduct) {
            // For offer products, navigate with complete product details
            const bookingData = {
                selectedSpot: {
                    ...spot, // Pass the complete spot object
                    price: spot.price, // Use offer price for calculations
                    displayPrice: spot.price, // Offer price for display
                    originalPrice: spot.originalPrice, // Original price for comparison
                    isOfferProduct: true,
                    isStandaloneOffer: spot.isStandaloneOffer || false
                },
                isOfferProduct: true,
                offerPrice: spot.price,
                originalPrice: spot.originalPrice,
                isStandaloneOffer: spot.isStandaloneOffer || false
            };

            // Generate URL using product ID and name
            const productSlug = `${spot.id}-${slugify(spot.prodName, { lower: true, strict: true })}`;
            navigate(`/Product/${productSlug}`, { state: bookingData });
        } else {
            // For regular products (shouldn't happen in Deal of Day, but keeping for safety)
            setSelectedSpot(spot);
            navigate(`/Product/${spot.id}-${slugify(spot.prodName)}`, {
                state: { selectedSpot: spot }
            });
        }
    };

    const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => {
            setIsSmallScreen(window.innerWidth < 768);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    //OUTDOOR MEDIUM FILTER SECTION
    const [tempOutdoorMedium, setTempOutdoorMedium] = useState([]);
    const [isFilterOpenMedium, setIsFilterOpenMedium] = useState(false); // State to toggle MediumFilter
    //Toggle LoginPage
    const toggleFilterSectionMedium = () => {
        setTempOutdoorMedium([...selectedOutdoorMedium]); // Sync current filter
        setIsFilterOpenMedium(true);
    };
    const closeFilterSectionMedium = () => {
        setIsFilterOpenMedium(false);
    };
    const handleMediumFilterDone = () => {
        setSelectedOutdoorMedium([...tempOutdoorMedium]); // Apply filters
        setIsFilterOpenMedium(false); // Close dropdown
    };

    const handleMediumFilterCancel = () => {
        setTempOutdoorMedium([...selectedOutdoorMedium]); // Revert changes
        setIsFilterOpenMedium(false); // Close dropdown
    };

    //SORTING FILTER SECTION
    const [tempSorting, setTempSorting] = useState(sortOption);
    const [activeSortTab, setActiveSortTab] = useState("Popularity");
    const [isFilterSorting, setIsFilterSorting] = useState(false); // State to toggle MediumFilter
    //Toggle LoginPage
    const toggleFilterSectionSorting = () => {
        setTempSorting(sortOption); // Sync current filter
        setIsFilterSorting(true);
    };
    const closeFilterSectionSorting = () => {
        setIsFilterSorting(false);
    };
    const handleSortingFilterDone = () => {
        setSortOption(tempSorting); // Apply filters
        setIsFilterSorting(false); // Close dropdown
    };

    const handleSortingFilterCancel = () => {
        setTempSorting(sortOption); // Revert changes
        setIsFilterSorting(false); // Close dropdown
    };

    //LOCATION FILTER SECTION
    const [tempLocation, setTempLocation] = useState(sortOption);
    const [activeLocationTab, setActiveLocationTab] = useState("Tamil Nadu");
    const [isFilterLocation, setIsFilterLocation] = useState(false); // State to toggle MediumFilter
    const [tempStates, setTempStates] = useState(["Tamil Nadu"]);
    const [tempDistricts, setTempDistricts] = useState([]);

    //Toggle LoginPage
    const toggleFilterSectionLocation = () => {
        setTempStates(selectedStates.length > 0 ? selectedStates : ["Tamil Nadu"]);
        setTempDistricts([...selectedDistricts]);
        setActiveLocationTab(selectedStates.length > 0 ? selectedStates[0] : "Tamil Nadu");
        setIsFilterLocation(true);
    };
    const closeFilterSectionLocation = () => {
        setIsFilterLocation(false);
    };
    const handleLocationFilterDone = () => {
        setSelectedStates([...tempStates]);
        setSelectedDistricts([...tempDistricts]);
        setSortOption([...tempLocation]);
        setIsFilterLocation(false);
    };

    const handleLocationFilterCancel = () => {
        setTempStates([...selectedStates]);
        setTempDistricts([...selectedDistricts]);
        setIsFilterLocation(false);
    };


    // TIMER STATE
    const [timer, setTimer] = useState({ hours: 0, minutes: 0, seconds: 0 });
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [timerEnded, setTimerEnded] = useState(false);
    const [lastUpdateTime, setLastUpdateTime] = useState(Date.now());

    // Fetch timer from backend
    const fetchTimer = async () => {
        try {
            const response = await fetch(`${baseUrl}/DealTimerRun/timer`);
            if (!response.ok) throw new Error('Failed to fetch timer');

            const timerData = await response.json();

            setTimer({
                hours: timerData.hours,
                minutes: timerData.minutes,
                seconds: timerData.seconds
            });
            setIsTimerRunning(timerData.isRunning);
                        setLastUpdateTime(Date.now());


            // Check if timer has ended
            if (timerData.totalSeconds <= 0 && !timerData.isRunning) {
                setTimerEnded(true);
            } else {
                setTimerEnded(false);
            }
        } catch (error) {
            console.error('Error fetching timer:', error);
            // setTimerEnded(true); // Show ended state if timer fetch fails
        }
    };




    // Real-time countdown on frontend when timer is running
    useEffect(() => {
        let interval;
        
        if (isTimerRunning && !timerEnded) {
            interval = setInterval(() => {
                setTimer(prevTimer => {
                    let { hours, minutes, seconds } = prevTimer;
                    
                    // Decrement seconds
                    seconds--;
                    
                    if (seconds < 0) {
                        seconds = 59;
                        minutes--;
                        
                        if (minutes < 0) {
                            minutes = 59;
                            hours--;
                            
                            if (hours < 0) {
                                // Timer ended
                                clearInterval(interval);
                                setIsTimerRunning(false);
                                setTimerEnded(true);
                                return { hours: 0, minutes: 0, seconds: 0 };
                            }
                        }
                    }
                    
                    return { hours, minutes, seconds };
                });
            }, 1000);
        }
        
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isTimerRunning, timerEnded]);


    //  // Poll for timer updates from backend (less frequent)
    // useEffect(() => {
    //     fetchTimer(); // Initial fetch

    //     const interval = setInterval(fetchTimer, 30000); // Update every 30 seconds
        
    //     return () => clearInterval(interval);
    // }, []);




    // Poll for timer updates
    useEffect(() => {
        fetchTimer(); // Initial fetch

        const interval = setInterval(() => {
            if (isTimerRunning) {
                fetchTimer();
            }
        }, 1000); // Update every second when running

        return () => clearInterval(interval);
    }, [isTimerRunning]);

    // Format time unit
    const formatTimeUnit = (unit) => {
        return unit < 10 ? `0${unit}` : unit.toString();
    };

    
    return (
        <MainLayout>
            <div>
                <MainNavbar />
                <div className='DealBannerMain'>

                    {/* DEAL OF THE DAY BANNER SECTION  */}
                    <div className='dealBannerContentMain'>
                        <div className='dealBannerContentLeft'></div>
                        <div className='dealBannerContentRight'>
                            <div className='dealBannerContentRight1'>Deal of the Day</div>
                            <div className='dealBannerContentRight2'>Don't Miss Out!</div>
                            <a href='#dealBannerShopBtn'> <button className='dealBannerShopBtn'>Shop Now</button> </a>
                        </div>
                    </div>

                </div>

                {/* DEAL OF THE DAY CONTENT  */}
                <div className='container dealAlertContentMain' id='dealBannerShopBtn'>
                    <div>
                        <div className='dealAlertContent'>Deals Of the Day</div>
                        <div className='dealAlertContent1'>Grab it before it's gone</div>
                    </div>
                    <div className='dealAlertMain'>
                        <div className='dealAlertTimer'>
                            {/* <div className="live-timer-display"> */}
                            <span className="timer-digit">{formatTimeUnit(timer.hours)}</span>
                            <span className="DealTimer-separator">:</span>
                            <span className="timer-digit">{formatTimeUnit(timer.minutes)}</span>
                            <span className="DealTimer-separator">:</span>
                            <span className="timer-digit">{formatTimeUnit(timer.seconds)}</span>
                            {/* </div> */}
                        </div>
                        <img
                            src='./images/dealTimer.png' className='deal-timer-image' alt="Deal Timer" />
                    </div>
                </div>

                {/* DEAL PRODUCT DETAILS */}
                {/* Side Bar section  */}
                {/* TIMER ENDED BACKGROUND IMAGE WITH CUSTOMIZED BACK BUTTON  */}
                {/* <div className='container-fluid' >
                            <div className='DealTimerEndBanner'>
                                <button className='DealTimerEndedBtn' onClick={() => navigate("/book")} >Back To Shop</button>
                            </div>
                        </div> */}
                {timerEnded ?
                    (
                        <div className='container-fluid TimerEndedMain ' onClick={() => navigate("/book")}   >
                            <img src='./images/DealTimerEndBannerFinal.png' ></img>
                        </div>
                    ) : (

                        <div className="container side-bar-main">
                            <div className="row side-bar-content">
                                {/* Left Sidebar */}
                                <div className=" col-12 col-md-3 sidebar-section ">
                                    {isSmallScreen ? (
                                        <div className='FilterSection-mobile d-flex'>
                                            {/* Outdoor Section */}
                                            <div className='outdoor1 position-relative' onClick={toggleFilterSectionMedium}>
                                                <div > <img src='./images/Filter_responsive_img1.svg' className='Filter_responsive_img1'></img>Medium</div>
                                            </div>
                                            {isFilterOpenMedium && (
                                                <div className="filter-Mediumdropdown">
                                                    <div className="filter-ResponsiveHeading">
                                                        Outdoor Medium<button className="close-xmarkFilter" onClick={closeFilterSectionMedium} >
                                                            <i className="fa-regular fa-circle-xmark"></i>
                                                        </button>
                                                    </div>
                                                    <div className='filter-MediumdropdownContent'>
                                                        <div className='filter-MediumdropdownContentLeft'>
                                                            <form>
                                                                <div className="form-group outdoor-filterResponsiveForm">
                                                                    {outdoorMediums.map((medium) => (
                                                                        <div className={`form-check d-flex ${selectedOutdoorMedium.includes(medium) ? "checked" : ""}`} key={medium}>
                                                                            <input
                                                                                type="checkbox"
                                                                                className="form-check-input"
                                                                                id={medium}
                                                                                value={medium}
                                                                                onChange={(e) => {
                                                                                    const value = e.target.value;
                                                                                    setTempOutdoorMedium((prev) =>
                                                                                        prev.includes(value) ? prev.filter((m) => m !== value) : [...prev, value]
                                                                                    );
                                                                                }}
                                                                                checked={tempOutdoorMedium.includes(medium)}
                                                                            />
                                                                            <label className="form-check-label" htmlFor={medium}>{medium}</label>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </form>
                                                        </div>
                                                        <div className='filter-MediumdropdownContentRight'>
                                                        </div>
                                                    </div>
                                                    <div className='filterMediumButtons'>
                                                        <button className='filterCancelButton' onClick={handleMediumFilterCancel}>Cancel</button>
                                                        <button className='filterDoneButton' onClick={handleMediumFilterDone}>Done</button>
                                                    </div>
                                                </div>
                                            )}


                                            {/* Sorting Dropdown */}
                                            <div className='sorting1 position-relative' onClick={toggleFilterSectionSorting}>
                                                <div> <img src='./images/Filter_responsive_img2.svg' className='Filter_responsive_img2'></img>Sort</div>
                                            </div>
                                            {isFilterSorting && (
                                                <div className="filter-Sortingdropdown">
                                                    <div className="filter-ResponsiveHeading">
                                                        Sort
                                                        <button className="close-xmarkFilter" onClick={closeFilterSectionSorting}>
                                                            <i className="fa-regular fa-circle-xmark"></i>
                                                        </button>
                                                    </div>

                                                    <div className="filter-SortingDropdownContent">
                                                        {/* LEFT TABS - Popularity / Price */}
                                                        <div className='filter-SortingDropdownContentLeft sortSideFilter'>
                                                            <div
                                                                className={`${activeSortTab === "Popularity" ? "active" : ""} filterSortingLeftTabs`}
                                                                onClick={() => setActiveSortTab("Popularity")}
                                                            >
                                                                Popularity
                                                            </div>
                                                            <div
                                                                className={`${activeSortTab === "Price" ? "active" : ""} filterSortingLeftTabs`}
                                                                onClick={() => setActiveSortTab("Price")}
                                                            >
                                                                Price
                                                            </div>
                                                        </div>

                                                        {/* RIGHT OPTIONS BASED ON SELECTED TAB */}
                                                        <div className='filter-SortingDropdownContentRight'>
                                                            <div className='sortLocationRightHeading'>{activeSortTab}</div>
                                                            {(activeSortTab === "Popularity"
                                                                ? ["Popularity: High to Low", "Popularity: Low to High"]
                                                                : ["Price: High to Low", "Price: Low to High"]
                                                            ).map((filter) => (
                                                                <div key={filter} className="filter-Sortoption-section d-flex">
                                                                    <form className='d-flex'>
                                                                        <input
                                                                            type="radio"
                                                                            id={filter}
                                                                            name={activeSortTab === "Popularity" ? "popularitySort" : "priceSort"}
                                                                            value={filter}
                                                                            className="Sortorder-radio-btn"
                                                                            checked={tempSorting === filter}
                                                                            onChange={() => setTempSorting(filter)}
                                                                        />
                                                                        <label className="filter-SortOptionName" htmlFor={filter}>
                                                                            {filter.split(": ")[1]}
                                                                        </label>
                                                                    </form>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div className="filterMediumButtons">
                                                        <button className='filterCancelButton' onClick={handleSortingFilterCancel}>Cancel</button>
                                                        <button className='filterDoneButton' onClick={handleSortingFilterDone}>Done</button>
                                                    </div>
                                                </div>
                                            )}
                                            {/* Location Filters */}
                                            <div className='location1' onClick={toggleFilterSectionLocation}>
                                                <div> <img src='./images/Filter_responsive_img3.svg' className='Filter_responsive_img3'></img>Location</div>
                                            </div>

                                            {isFilterLocation && (
                                                <div className="filter-Locationdropdown">
                                                    <div className="filter-ResponsiveHeading">
                                                        Location<button className="close-xmarkFilter" onClick={closeFilterSectionLocation} >
                                                            <i className="fa-regular fa-circle-xmark"></i>
                                                        </button>
                                                    </div>
                                                    <div className='filter-LocationDropdownContent'>
                                                        <div className='filter-LocationDropdownContentLeft'>
                                                            {Object.keys(stateDistricts).map((state) => (
                                                                <div className='stateSideFilter'>
                                                                    <div
                                                                        className={`${selectedStates.includes(state) ? "selected" : ""} ${activeLocationTab === state ? "active" : ""} filterOutdoorSortLeftTabs`}
                                                                        onClick={() => selectOption2(state)}
                                                                        key={state}   >
                                                                        {state}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                        <div className='filter-LocationDropdownContentRight' >
                                                            {tempStates.map((state) => (
                                                                <div key={state} className="mb-2">
                                                                    <div className='sortLocationRightHeading LocationRightHeading'>{state}</div>
                                                                    {stateDistricts[state]?.map((district) => (
                                                                        <div
                                                                            key={district}
                                                                            className={`form-check d-flex ${tempDistricts.includes(district) ? "checked" : ""
                                                                                }`}
                                                                        >
                                                                            <input
                                                                                type="checkbox"
                                                                                className="form-check-input"
                                                                                id={district}
                                                                                onChange={() => handleDistrictChange(district)}
                                                                                checked={tempDistricts.includes(district)}
                                                                            />
                                                                            <label className="form-check-label" htmlFor={district}>
                                                                                {district}
                                                                            </label>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div className="filterMediumButtons">
                                                        <button className='filterCancelButton' onClick={handleLocationFilterCancel}>Cancel</button>
                                                        <button className='filterDoneButton' onClick={handleLocationFilterDone}>Done</button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <>
                                            {/* Outdoor Section */}
                                            <div className='outdoor mb-4'>
                                                <h5 className='sidebar-heading'>Outdoor Medium</h5>
                                                <form>
                                                    <div className="form-group">
                                                        {outdoorMediums.map((medium) => (
                                                            <div className={`form-check d-flex ${selectedOutdoorMedium.includes(medium) ? "checked" : ""}`} key={medium}>
                                                                <input
                                                                    type="checkbox"
                                                                    className="form-check-input"
                                                                    id={medium}
                                                                    value={medium}
                                                                    onChange={handleOutdoorMediumChange} // Correct event handler
                                                                    checked={selectedOutdoorMedium.includes(medium)}
                                                                />
                                                                <label className="form-check-label" htmlFor={medium}>
                                                                    {medium}
                                                                </label>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </form>
                                            </div>

                                            {/* Sorting Dropdown */}
                                            <div className='sorting mb-4'>
                                                <h5 className='sidebar-heading'>Sort</h5>
                                                <div className="dropdown">
                                                    <div className={`select ${isOpen1 ? "select-clicked" : ""} ${selected1 !== "By" ? "selected-active-bg" : ""}`}
                                                        onClick={toggleDropdown1} onChange={(e) => setSortOption(e.target.value)}>
                                                        <span className={`selected ${selected1 !== "By" ? "selected-active" : ""}`}>
                                                            {selected1}
                                                        </span>
                                                        {selected1 === "By" ? (
                                                            <i className={`fa-solid fa-caret-down ${isOpen1 ? "caret-rotate" : ""}`}></i>
                                                        ) : (
                                                            <i className="fa-solid fa-circle-xmark" onClick={resetDropdown1} style={{ color: "black" }}></i>
                                                        )}
                                                    </div>
                                                    <ul className={`menu ${isOpen1 ? "menu-open" : ""}`}>
                                                        <li className={selected1 === "Price: Low to High" ? "active" : ""} onClick={() => selectOption1("Price: Low to High")}>
                                                            Price: Low to High
                                                        </li>
                                                        <li className={selected1 === "Price: High to Low" ? "active" : ""} onClick={() => selectOption1("Price: High to Low")}>
                                                            Price: High to Low
                                                        </li>
                                                        <li className={selected1 === "Popularity: High to Low" ? "active" : ""} onClick={() => selectOption1("Popularity: High to Low")}>
                                                            Popularity: High to Low
                                                        </li>
                                                        <li className={selected1 === "Popularity: Low to High" ? "active" : ""} onClick={() => selectOption1("Popularity: Low to High")}>
                                                            Popularity: Low to High
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>

                                            {/* Location Filters */}
                                            <div className='location'>
                                                <h5 className='sidebar-heading'>Location</h5>
                                                <form>
                                                    <div className="form-group">
                                                        <div className="dropdown">
                                                            <div
                                                                className={` form-control select ${isOpen2 ? "select-clicked" : ""} ${selectedStates.length > 0 ? "selected2-active-bg" : ""}`}
                                                                onClick={toggleDropdown2}>
                                                                <span className={`selected ${selectedStates.length > 0 ? "selected2-active" : ""}`}>
                                                                    {selectedStates.length > 0 ? selectedStates.join(", ") : "Select State"}
                                                                </span>
                                                                {/* Caret or Reset Icon */}
                                                                {selectedStates.length === 0 ? (
                                                                    <i className={`fa-solid fa-caret-down ${isOpen2 ? "caret-rotate" : ""}`}></i>
                                                                ) : (
                                                                    <i className="fa-solid fa-circle-xmark" onClick={resetDropdown2} style={{ color: "white" }}></i>
                                                                )}
                                                            </div>

                                                            {isOpen2 && (
                                                                <ul className={`menu ${isOpen2 ? "menu-open" : ""}`}>
                                                                    {Object.keys(stateDistricts).map((state) => (
                                                                        <li
                                                                            className={selectedStates.includes(state) ? "active" : ""}
                                                                            onClick={() => selectOption2(state)}
                                                                            key={state}>
                                                                            {state}
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            )}
                                                        </div>
                                                        {/* District selection */}

                                                        {/* SINGLE SELECTION DISTRICTS  */}
                                                        {selectedStates.map((state) => (
                                                            <div key={state} className="mb-2">
                                                                {stateDistricts[state]?.map((district) => (
                                                                    <div
                                                                        className={`form-check d-flex ${selectedDistricts.includes(district) ? "checked" : ""}`}
                                                                        key={district}
                                                                    >
                                                                        <input
                                                                            type="checkbox"
                                                                            className="form-check-input"
                                                                            id={district}
                                                                            onChange={() => handleDistrictChange(district)}
                                                                            checked={selectedDistricts.includes(district)}
                                                                        />
                                                                        <label className="form-check-label" htmlFor={district}>
                                                                            {district}
                                                                        </label>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </form>
                                            </div>
                                        </>
                                    )}
                                </div>

                                {/* Right Content Area */}
                                <div className=" col-12 col-md-9 py-3 px-0 side-right-main">
                                    <div className="row side-right-content">
                                        {/* Show loading animation while data is being fetched */}
                                        {isLoading ? (
                                            <div className="col-12 text-center loading-container">
                                                <img src='./images/BookLoading.svg' alt="Loading..." className="Book-loading-gif" />
                                            </div>
                                        ) :
                                         currentSpots.length > 0 ? (
                                            currentSpots.map((spot) => (
                                                <div className="col-lg-4 col-md-6 col-sm-12 mb-4 card-board-contents" key={spot.id} >
                                                    <div className="card board-book" onClick={() => handleBookNow(spot)} >
                                                        <img src={spot.imageUrl} alt={spot.location} className="card-img-top-book" />
                                                        <span className='board-category-book'>{spot.category}</span>
                                                        <span className='board-location-book'>{spot.location}</span>

                                                        <div className="board-content-book ">
                                                            <div className='board-content-top-book'>
                                                                <span className="board-loc-book">{spot.prodName}</span>
                                                                <span className="board-dim-book">{spot.sizeHeight} x {spot.sizeWidth}</span>
                                                            </div>
                                                            <div className='board-content-bottom-book'>
                                                                {/* Show offer price and original price for offer products */}
                                                                {spot.isOfferProduct && spot.originalPrice ? (
                                                                    <>
                                                                        <span className="board-price-book offer-price-highlight">
                                                                            ₹{spot.price.toLocaleString()}
                                                                        </span>
                                                                        <span className='board-price-book originalPrice'>
                                                                            ₹{spot.originalPrice.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                                                                        </span>
                                                                    </>
                                                                ) : (
                                                                    <span className="board-price-book">
                                                                        ₹{spot.price.toLocaleString()}
                                                                    </span>
                                                                )}
                                                                <img src='./images/rating_board.png' className='rate-board-book'></img>
                                                            </div>
                                                            <RatingStars rating={spot.rating} />
                                                            <button className="board-btn-book" onClick={() => handleBookNow(spot)} >Book Now</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="col-12 text-center">
                                                <h5 className='NoItems'>No offer products found</h5>
                                            </div>
                                        )}

                                        {/* Pagination Component */}
                                        {!isLoading && filteredSpots.length > spotsPerPage && (
                                            <div className="col-12 text-center">
                                                <div className="pagination d-flex justify-content-center">
                                                    <button className="prev-button" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
                                                        <i className="fa-solid fa-arrow-left"></i>
                                                    </button>
                                                    {getPaginationGroup().map((page, index) =>
                                                        page === "..." ? (
                                                            <span key={index} className="dots">...</span>
                                                        ) : (
                                                            <button
                                                                key={index}
                                                                className={`page-number ${currentPage === page ? 'active' : ''}`}
                                                                onClick={() => setCurrentPage(page)}
                                                            >
                                                                {page}
                                                            </button>
                                                        )
                                                    )}
                                                    <button className="next-button" onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>
                                                        <i className="fa-solid fa-arrow-right"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

            </div>
            <MainFooter />
            {/* </div> */}
        </MainLayout>
    )
}
export default H1DealDay;





