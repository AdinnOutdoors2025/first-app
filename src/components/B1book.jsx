import React, { useState, createContext, useContext, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import '../components/b1book.css';
import LoginPageMain from './C1LoginMain';
import { useSpot } from "./B0SpotContext";
import MainNavbar from './A1NAVBAR.jsx';
import MainFooter from './A1FOOTER.jsx';
import { MainLayout } from './MainLayout';
import slugify from 'slugify';
//BASE URL OF http://localhost:3001 FILE IMPORT
import { baseUrl } from '../Adminpanel/BASE_URL';


export default function BookASite() {
  // Navbar js
  const [isMenuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };
  //Nav_user toggle section
  const [isOpen, setIsOpen] = useState(false);
  //FETCHED CONTENT AND DETAILS FROM THE DATABASE
  const [spots, setSpots] = useState([]);
  const [mediaTypes, setMediaTypes] = useState([]);
  const [stateDistricts, setStateDistricts] = useState({});
  // Fetch data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch products
        const productsRes = await fetch(`${baseUrl}/products`);
        const productsData = await productsRes.json();
        // Filter out products where visible is false
        const visibleProducts = productsData.filter(product => product.visible !== false);
        // Map only visible  products to spots structure
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
          similarProduct: product.similarProducts[{}],
          latitude: product.Latitude,
          longitude: product.Longitude,
          prodLocationLink: product.LocationLink
        }));
        setSpots(mappedSpots);
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

  // const [selectedDistricts, setSelectedDistricts] = useState([]);
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
  // const [selectedState, setSelectedState] = useState("State");
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
  // Convert to lowercase and compare to make filtering case-insensitive
  let filteredSpots = spots.filter((spot) => {
    // const spotLocation = spot.location.toLowerCase();
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
  // NAVIGATE    //If i click the orders, signup or login then go the login page
  const navigate = useNavigate();
  const [isLoginOpen, setIsLoginOpen] = useState(false); // State to toggle Login
  const { setSelectedSpot } = useSpot();
  const handleBookNow = (spot) => {
    setSelectedSpot(spot); // Store selected spot in context
    // navigate(`/Product/${spot.prodName}`); // Navigate to booking page
    navigate(`/Product/${spot.id}-${slugify(spot.prodName)}`); // Navigate to booking page
  };
  //FILTER SMALL SCREENS
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
    // setIsFilterOpenMedium(!isFilterOpenMedium);
    setTempOutdoorMedium([...selectedOutdoorMedium]); // Sync current filter
    setIsFilterOpenMedium(true);
  };
  const closeFilterSectionMedium = () => {
    setIsFilterOpenMedium(false);
  };
  // const [tempOutdoorMedium, setTempOutdoorMedium] = useState([...selectedOutdoorMedium]);
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
    // setIsFilterSorting(!isFilterSorting);
    setTempSorting(sortOption); // Sync current filter
    setIsFilterSorting(true);
  };
  const closeFilterSectionSorting = () => {
    setIsFilterSorting(false);
  };
  // const [tempOutdoorMedium, setTempOutdoorMedium] = useState([...sortOption);
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
  // const [tempOutdoorMedium, setTempOutdoorMedium] = useState([...sortOption);
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
  return (
    <MainLayout>
      <div>
        {/* Navbar section  */}
        <MainNavbar />
        {/* Side Bar section  */}
        <div className="container side-bar-main">
          <div className="row side-bar-content">
            {/* Left Sidebar */}
            <div className=" col-12 col-md-3 sidebar-section p-3 ">
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
                            onClick={() => setActiveSortTab("Popularity")}>
                            Popularity
                          </div>
                          <div
                            className={`${activeSortTab === "Price" ? "active" : ""} filterSortingLeftTabs`}
                            onClick={() => setActiveSortTab("Price")}>
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
                                    }`}>
                                  <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id={district}
                                    onChange={() => handleDistrictChange(district)}
                                    checked={tempDistricts.includes(district)}/>
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
                {currentSpots.length > 0 ? (
                  currentSpots.map((spot) => (
                    <div className="col-lg-4 col-md-6 col-sm-12 mb-4 card-board-contents" key={spot.id} >
                      <div className="card board-book" onClick={() => handleBookNow(spot)} >
                        <img src={spot.imageUrl} alt={spot.location} className="card-img-top-book" />
                        <span className='board-category-book'>{spot.category}</span>
                        <span className='board-location-book'>{spot.location}</span>
                        <div className="board-content-book ">
                          <div className='board-content-top-book'>
                            <span className="board-loc-book">{spot.prodName}</span>
                            <span className="board-dim-book"> {spot.sizeWidth} x {spot.sizeHeight} </span>
                          </div>
                          <div className='board-content-bottom-book'>
                            <span className="board-price-book">₹{spot.price.toLocaleString()}</span>
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
                    <h5 className='NoItems'>No results found</h5>
                  </div>
                )}
                {/* Pagination Component */}
                {filteredSpots.length > spotsPerPage && (
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
        <MainFooter />
      </div>
    </MainLayout>
  )
};