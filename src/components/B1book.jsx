import React, { useState, createContext, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";

import "../components/b1book.css";
import LoginPageMain from "./C1LoginMain";
import { useSpot } from "./B0SpotContext";
import MainNavbar from "./A1NAVBAR.jsx";
import MainFooter from "./A1FOOTER.jsx";
import { MainLayout } from "./MainLayout";
import slugify from "slugify";
//BASE URL OF http://localhost:3001 FILE IMPORT
import { baseUrl } from "../Adminpanel/BASE_URL";
//DEAL OF THE DAY PAGE SCROLL ANIMATION
import DealScrollAnim from "./H2DealScroll.jsx";
import { formatIndianCurrency } from "./FORMATED_AMOUNT";
// HELMET FOR TITLE DESCTIPTION IN ALL PAGE 
import { Helmet } from "react-helmet-async";


export default function BookASite() {

  const [searchParams, setSearchParams] = useSearchParams();

  const pageFromUrl = Number(searchParams.get("page")) || 1;
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

  //LOADING STATES
  const [isLoading, setIsLoading] = useState(true);

  // PAGINATION STATES - USING SERVER-SIDE PAGINATION
  // const [currentPage, setCurrentPage] = useState(0); // Start from 0
  const [currentPage, setCurrentPage] = useState(pageFromUrl - 1); // Start from 0
  const [totalPages, setTotalPages] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const limit = 9; // Fixed at 9 products per page

  // FILTER STATES
  const [selectedOutdoorMedium, setSelectedOutdoorMedium] = useState([]);
  const [selectedStates, setSelectedStates] = useState([]);
  const [selectedDistricts, setSelectedDistricts] = useState([]);
  const [sortOption, setSortOption] = useState("By");

  //By for the first dropdown
  const [isOpen1, setIsOpen1] = useState(false);
  const [selected1, setSelected1] = useState("By");

  // State for the second dropdown
  const [isOpen2, setIsOpen2] = useState(false);
  const [selected2, setSelected2] = useState("State");

  // Fetch data with pagination and filters
  const fetchPaginatedData = async (page = 0) => {
    try {
      setIsLoading(true);

      // Build query parameters
      const params = new URLSearchParams({
        page: page,
        limit: limit,
        visibleOnly: "true", // Only fetch visible products
      });

      // Add state filters
      if (selectedStates.length > 0) {
        selectedStates.forEach((state) => params.append("states", state));
      }

      // Add district filters
      if (selectedDistricts.length > 0) {
        selectedDistricts.forEach((district) =>
          params.append("districts", district),
        );
      }

      // Add category filters
      if (selectedOutdoorMedium.length > 0) {
        selectedOutdoorMedium.forEach((category) =>
          params.append("categories", category),
        );
      }

      // Add sort parameter
      let sortParam = "";
      switch (sortOption) {
        case "Price: Low to High":
          sortParam = "price_asc";
          break;
        case "Price: High to Low":
          sortParam = "price_desc";
          break;
        case "Popularity: High to Low":
          sortParam = "rating_desc";
          break;
        case "Popularity: Low to High":
          sortParam = "rating_asc";
          break;
        default:
          sortParam = "";
      }

      if (sortParam) {
        params.append("sortBy", sortParam);
      }

      console.log("Fetching with params:", params.toString());

      // Fetch products with filters
      const productsRes = await fetch(
        `${baseUrl}/products_paginated?${params.toString()}`,
      );
      //  const productsRes = await fetch(
      //   `/api/products_paginated?${params.toString()}`,
      // );

      if (!productsRes.ok) {
        throw new Error(`HTTP error! status: ${productsRes.status}`);
      }

      const productsData = await productsRes.json();

      console.log("Fetched data:", {
        page: productsData.current_page,
        total: productsData.total_products,
        pages: productsData.total_pages,
        items: productsData.data.length,
      });

      // Set spots directly from transformed data
      setSpots(productsData.data);
      setTotalPages(productsData.total_pages);
      setTotalProducts(productsData.total_products);

      // Only fetch media types and stateDistricts once
      if (mediaTypes.length === 0) {
        const mediaRes = await fetch(`${baseUrl}/mediatype`);
        const mediaData = await mediaRes.json();
        setMediaTypes(mediaData.map((m) => m.type.trim()));
      }

      if (Object.keys(stateDistricts).length === 0) {
        const locationsRes = await fetch(`${baseUrl}/category`);
        const locationsData = await locationsRes.json();
        const stateMap = locationsData.reduce((acc, curr) => {
          const cleanedDistricts = curr.districts.map((district) =>
            district.replace(/[\u200B-\u200D\uFEFF]/g, "").trim(),
          );
          acc[curr.state] = cleanedDistricts;
          return acc;
        }, {});
        setStateDistricts(stateMap);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      // Fallback: show empty state
      setSpots([]);
      setTotalPages(0);
      setTotalProducts(0);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch and fetch when filters/page changes
  useEffect(() => {
    fetchPaginatedData(currentPage);
  }, [
    currentPage,
    selectedStates,
    selectedDistricts,
    selectedOutdoorMedium,
    sortOption,
  ]);

  // Functions for first dropdown
  const toggleDropdown1 = () => {
    setIsOpen1(!isOpen1);
  };

  const selectOption1 = (option) => {
    setSelected1(option);
    setSortOption(option);
    setCurrentPage(0);
    // setIsOpen1(false);
  };

  const resetDropdown1 = (event) => {
    event.stopPropagation();
    setSelected1("By");
    setSortOption("By");
    setCurrentPage(0);
  };

  const [checkedDistricts, setCheckedDistricts] = useState([]);
  const toggleDropdown2 = () => setIsOpen2((prev) => !prev);

  // Reset Dropdown (Clears selection)
  const resetDropdown2 = (e) => {
    e.stopPropagation();
    setSelectedStates([]);
    setSelectedDistricts([]);
    setSelected2("State");
    setCurrentPage(0);
  };

  // SINGLE SELECTION DISTRICTS
  const selectOption2 = (state) => {
    setActiveLocationTab(state);
    setTempStates([state]);
    const filteredDistricts = tempDistricts.filter((district) =>
      stateDistricts[state]?.includes(district),
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
        stateDistricts[state]?.includes(district),
      );
      setSelectedDistricts(updatedDistricts);
    }

    setIsOpen2(false);
    setCurrentPage(0); // Reset to first page when location changes
  };

  //Start rating board
  const RatingStars = ({ rating }) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
 // Format the rating number
  const formattedRating = Number.isInteger(rating) ? rating.toFixed(1) : rating.toString();

    return (
      <div className="rate-book">
        <span className="rating-text">{formattedRating}</span>
        <span className="rating-star-wrapper">
          <span className="fa-solid fa-star rating-star"></span>
        </span>
      </div>

    );
  };

  // Toggle outdoor medium checkboxes
  const handleOutdoorMediumChange = (event) => {
    const medium = event.target.value;
    setSelectedOutdoorMedium((prev) =>
      prev.includes(medium)
        ? prev.filter((m) => m !== medium)
        : [...prev, medium],
    );
    setCurrentPage(0); // Reset to first page when filter changes
  };

  //Toggle district change
  const handleDistrictChange = (district) => {
    setSelectedDistricts((prev) =>
      prev.includes(district)
        ? prev.filter((d) => d !== district)
        : [...prev, district],
    );
    setCurrentPage(0); // Reset to first page when filter changes
  };

  // Update outdoor mediums to use fetched media types
  const outdoorMediums = mediaTypes;

  // Display current spots (already filtered and sorted from server)
  const currentSpots = spots;

  // Helper function to generate page numbers

  const getPaginationGroup = () => {
    let pages = [];
    const maxPagesToShow = 3;

    if (totalPages <= 6) {
      pages = Array.from({ length: totalPages }, (_, i) => i);
    } else {
      // 🔹 Case 1: Near the start (NO dots here)
      if (currentPage <= maxPagesToShow) {
        pages = Array.from({ length: maxPagesToShow + 4 }, (_, i) => i);

        // Only show dots if there is a real gap
        if (pages[pages.length - 1] < totalPages - 2) {
          pages.push("...", totalPages - 2, totalPages - 1);
        }
      }

      // 🔹 Case 2: Near the end
      else if (currentPage >= totalPages - maxPagesToShow - 1) {
        pages = [0, 1, "..."];
        pages.push(
          ...Array.from(
            { length: maxPagesToShow + 2 },
            (_, i) => totalPages - maxPagesToShow - 2 + i,
          ),
        );
      }

      // 🔹 Case 3: Middle
      else {
        pages = [0, 1];
        pages.push(currentPage - 1, currentPage, currentPage + 1);
        pages.push("...", totalPages - 2, totalPages - 1);
      }
    }

    return [...new Set(pages)]; // remove duplicates safely
  };

  // NAVIGATE
  const navigate = useNavigate();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const { setSelectedSpot } = useSpot();

  const handleBookNow = (spot) => {
    setSelectedSpot(spot);
    navigate(`/Product/${spot.id}-${slugify(spot.prodName)}`);
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
  const [isFilterOpenMedium, setIsFilterOpenMedium] = useState(false);

  const toggleFilterSectionMedium = () => {
    setTempOutdoorMedium([...selectedOutdoorMedium]);
    setIsFilterOpenMedium(true);
  };

  const closeFilterSectionMedium = () => {
    setIsFilterOpenMedium(false);
  };

  const handleMediumFilterDone = () => {
    setSelectedOutdoorMedium([...tempOutdoorMedium]);
    setCurrentPage(0); // Reset to first page
    setIsFilterOpenMedium(false);
  };

  const handleMediumFilterCancel = () => {
    setTempOutdoorMedium([...selectedOutdoorMedium]);
    setIsFilterOpenMedium(false);
  };

  //SORTING FILTER SECTION
  const [tempSorting, setTempSorting] = useState(sortOption);
  const [activeSortTab, setActiveSortTab] = useState("Popularity");
  const [isFilterSorting, setIsFilterSorting] = useState(false);

  const toggleFilterSectionSorting = () => {
    setTempSorting(sortOption);
    setIsFilterSorting(true);
  };

  const closeFilterSectionSorting = () => {
    setIsFilterSorting(false);
  };

  const handleSortingFilterDone = () => {
    setSortOption(tempSorting);
    setCurrentPage(0); // Reset to first page
    setIsFilterSorting(false);
  };

  const handleSortingFilterCancel = () => {
    setTempSorting(sortOption);
    setIsFilterSorting(false);
  };

  //LOCATION FILTER SECTION
  const [tempLocation, setTempLocation] = useState(sortOption);
  const [activeLocationTab, setActiveLocationTab] = useState("Tamil Nadu");
  const [isFilterLocation, setIsFilterLocation] = useState(false);
  const [tempStates, setTempStates] = useState(["Tamil Nadu"]);
  const [tempDistricts, setTempDistricts] = useState([]);

  const toggleFilterSectionLocation = () => {
    setTempStates(selectedStates.length > 0 ? selectedStates : ["Tamil Nadu"]);
    setTempDistricts([...selectedDistricts]);
    setActiveLocationTab(
      selectedStates.length > 0 ? selectedStates[0] : "Tamil Nadu",
    );
    setIsFilterLocation(true);
  };

  const closeFilterSectionLocation = () => {
    setIsFilterLocation(false);
  };

  // const handleLocationFilterDone = () => {
  //   setSelectedStates([...tempStates]);
  //   setSelectedDistricts([...tempDistricts]);
  //   setCurrentPage(0); // Reset to first page
  //   setIsFilterLocation(false);
  // };

  // const handleLocationFilterCancel = () => {
  //   setTempStates([...selectedStates]);
  //   setTempDistricts([...selectedDistricts]);
  //   setIsFilterLocation(false);
  // };

  const handleLocationFilterDone = () => {
  setSelectedStates([...tempStates]);
  setSelectedDistricts([...tempDistricts]);
  setCurrentPage(0); // Reset to first page
  setIsFilterLocation(false);
};

const handleLocationFilterCancel = () => {
  // Reset temp states to match selected states
  setTempStates(selectedStates.length > 0 ? [...selectedStates] : ["Tamil Nadu"]);
  setTempDistricts([...selectedDistricts]);
  setActiveLocationTab(
    selectedStates.length > 0 ? selectedStates[0] : "Tamil Nadu"
  );
  setIsFilterLocation(false);
};

  // Handle page change
  const handlePageChange = (pageIndex) => {
    if (pageIndex < 0 || pageIndex >= totalPages) return;

    setCurrentPage(pageIndex);

    if (pageIndex === 0) {
      setSearchParams({}); // keep /book clean
    } else {
      setSearchParams({ page: pageIndex + 1 });
    }
  };

  useEffect(() => {
    const page = Number(searchParams.get("page")) || 1;
    setCurrentPage(page - 1);
  }, [searchParams]);



  return (
    <>
    <Helmet>
      <title>Book a Site | Adinn Outdoors</title>
      <meta
        name="description"
        content="Book premium outdoor advertising sites with Adinn Outdoors."
      />
    </Helmet>
    <MainLayout>
      <div className="bookMainDeal">
        {/* <DealScrollAnim /> */}
        <MainNavbar />

        <div className="container side-bar-main">
          <div className="row side-bar-content">
            {/* Left Sidebar */}
            <div className=" col-12 col-md-3 sidebar-section p-3 ">
              {isSmallScreen ? (
                <div className="FilterSection-mobile d-flex">
                  {/* Sorting Dropdown for mobile */}
                  <div
                    className="sorting1 position-relative"
                    onClick={toggleFilterSectionSorting}
                  >
                    <div>
                      {" "}
                      <img
                        src="./images/Filter_responsive_img2.svg"
                        className="Filter_responsive_img2"
                      ></img>
                      Sort
                    </div>
                  </div>

                  {isFilterSorting && (
                    <div className="filter-Sortingdropdown">
                      <div className="filter-ResponsiveHeading">
                        Sort
                        <button
                          className="close-xmarkFilter"
                          onClick={closeFilterSectionSorting}
                        >
                          <i className="fa-regular fa-circle-xmark"></i>
                        </button>
                      </div>

                      <div className="filter-SortingDropdownContent">
                        <div className="filter-SortingDropdownContentLeft sortSideFilter">
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

                        <div className="filter-SortingDropdownContentRight">
                          <div className="sortLocationRightHeading">
                            {activeSortTab}
                          </div>
                          {(activeSortTab === "Popularity"
                            ? [
                              "Popularity: High to Low",
                              "Popularity: Low to High",
                            ]
                            : ["Price: High to Low", "Price: Low to High"]
                          ).map((filter) => (
                            <div
                              key={filter}
                              className="filter-Sortoption-section d-flex"
                            >
                              <form className="d-flex">
                                <input
                                  type="radio"
                                  id={filter}
                                  name={
                                    activeSortTab === "Popularity"
                                      ? "popularitySort"
                                      : "priceSort"
                                  }
                                  value={filter}
                                  className="Sortorder-radio-btn"
                                  checked={tempSorting === filter}
                                  onChange={() => setTempSorting(filter)}
                                />
                                <label
                                  className="filter-SortOptionName"
                                  htmlFor={filter}
                                >
                                  {filter.split(": ")[1]}
                                </label>
                              </form>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="filterMediumButtons">
                        <button
                          className="filterCancelButton"
                          onClick={handleSortingFilterCancel}
                        >
                          Cancel
                        </button>
                        <button
                          className="filterDoneButton"
                          onClick={handleSortingFilterDone}
                        >
                          Done
                        </button>
                      </div>
                    </div>
                  )}

                 {/* Location Filters for mobile */}
<div className="location1" onClick={toggleFilterSectionLocation}>
  <div>
    <img
      src="./images/Filter_responsive_img3.svg"
      className="Filter_responsive_img3"
    ></img>
    Location
  </div>
</div>

{isFilterLocation && (
  <div className="filter-Locationdropdown">
    <div className="filter-ResponsiveHeading">
      Location
      <button
        className="close-xmarkFilter"
        onClick={closeFilterSectionLocation}
      >
        <i className="fa-regular fa-circle-xmark"></i>
      </button>
    </div>

    <div className="filter-LocationDropdownContent">
      <div className="filter-LocationDropdownContentLeft">
        {Object.keys(stateDistricts).map((state) => (
          <div className="stateSideFilter" key={state}>
            <div
              className={`${tempStates.includes(state) ? "selected" : ""} ${
                activeLocationTab === state ? "active" : ""
              } filterOutdoorSortLeftTabs`}
              onClick={() => {
                setActiveLocationTab(state);
                setTempStates([state]);
                // Reset tempDistricts when changing state
                setTempDistricts([]);
              }}
            >
              {state}
            </div>
          </div>
        ))}
      </div>

      <div className="filter-LocationDropdownContentRight">
        {tempStates.map((state) => (
          <div key={state} className="mb-2">
            <div className="sortLocationRightHeading LocationRightHeading">
              {state}
            </div>
            {stateDistricts[state]?.map((district) => (
              <div
                key={district}
                className={`form-check d-flex ${
                  tempDistricts.includes(district) ? "checked" : ""
                }`}
              >
                <input
                  type="checkbox"
                  className="form-check-input"
                  id={`mobile-${district}`} // Make ID unique
                  onChange={() => {
                    // Update tempDistricts instead of selectedDistricts
                    setTempDistricts((prev) =>
                      prev.includes(district)
                        ? prev.filter((d) => d !== district)
                        : [...prev, district]
                    );
                  }}
                  checked={tempDistricts.includes(district)}
                />
                <label
                  className="form-check-label"
                  htmlFor={`mobile-${district}`}
                >
                  {district}
                </label>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>

    <div className="filterMediumButtons">
      <button
        className="filterCancelButton"
        onClick={handleLocationFilterCancel}
      >
        Cancel
      </button>
      <button
        className="filterDoneButton"
        onClick={handleLocationFilterDone}
      >
        Done
      </button>
    </div>
  </div>
)}
                </div>
              ) : (
                <>
                  {/* Sorting Dropdown for desktop */}
                  <div className="sorting mb-4">
                    <h5 className="sidebar-heading">Sort</h5>
                    <div className="dropdown">
                      <div
                        className={`select ${isOpen1 ? "select-clicked" : ""} ${selected1 !== "By" ? "selected-active-bg" : ""}`}
                        onClick={toggleDropdown1}
                      >
                        <span
                          className={`selected ${selected1 !== "By" ? "selected-active" : ""}`}
                        >
                          {selected1}
                        </span>
                        {selected1 === "By" ? (
                          <i
                            className={`fa-solid fa-caret-down ${isOpen1 ? "caret-rotate" : ""}`}
                          ></i>
                        ) : (
                          <i
                            className="fa-solid fa-circle-xmark"
                            onClick={resetDropdown1}
                            style={{ color: "black" }}
                          ></i>
                        )}
                      </div>

                      {/* <ul className={`menu ${isOpen1 ? "menu-open" : ""}`}>
                        <li
                          className={
                            selected1 === "Price: Low to High" ? "active" : ""
                          }
                          onClick={() => selectOption1("Price: Low to High")}
                        >
                          Price: Low to High
                        </li>
                        <li
                          className={
                            selected1 === "Price: High to Low" ? "active" : ""
                          }
                          onClick={() => selectOption1("Price: High to Low")}
                        >
                          Price: High to Low
                        </li>
                        <li
                          className={
                            selected1 === "Popularity: High to Low"
                              ? "active"
                              : ""
                          }
                          onClick={() =>
                            selectOption1("Popularity: High to Low")
                          }
                        >
                          Popularity: High to Low
                        </li>
                        <li
                          className={
                            selected1 === "Popularity: Low to High"
                              ? "active"
                              : ""
                          }
                          onClick={() =>
                            selectOption1("Popularity: Low to High")
                          }
                        >
                          Popularity: Low to High
                        </li>
                      </ul> */}
                      <ul className={`menu ${isOpen1 ? "menu-open" : ""}`}>
                        {[
                          "Price: Low to High",
                          "Price: High to Low",
                          "Popularity: High to Low",
                          "Popularity: Low to High",
                        ].map((option) => (
                          <li key={option} style={{ cursor: 'pointer' }}>
                            <div className="form-check d-flex align-items-center">
                              <input
                                type="radio"
                                className="form-check-input"
                                name="sorting-options" // Added name attribute for radio button grouping
                                checked={selected1 === option}
                                onChange={() => selectOption1(option)}
                              />
                              <label
                                htmlFor="sorting-options"
                                className="form-check-label ms-2"
                                onClick={() => selectOption1(option)}
                              >
                                {option}
                              </label>
                            </div>
                          </li>
                        ))}
                      </ul>

                    </div>
                  </div>

                  {/* Location Filters for desktop */}
                  <div className="location">
                    <h5 className="sidebar-heading">Location</h5>
                    <form>
                      <div className="form-group">
                        <div className="dropdown">
                          <div
                            className={` form-control select ${isOpen2 ? "select-clicked" : ""} ${selectedStates.length > 0 ? "selected2-active-bg" : ""}`}
                            onClick={toggleDropdown2}
                          >
                            <span
                              className={`selected ${selectedStates.length > 0 ? "selected2-active" : ""}`}
                            >
                              {selectedStates.length > 0
                                ? selectedStates.join(", ")
                                : "Select State"}
                            </span>
                            {selectedStates.length === 0 ? (
                              <i
                                className={`fa-solid fa-caret-down ${isOpen2 ? "caret-rotate" : ""}`}
                              ></i>
                            ) : (
                              <i
                                className="fa-solid fa-circle-xmark"
                                onClick={resetDropdown2}
                                style={{ color: "black" }}
                              ></i>
                            )}
                          </div>

                          {isOpen2 && (
                            <ul
                              className={`menu ${isOpen2 ? "menu-open" : ""}`}
                            >
                              {Object.keys(stateDistricts).map((state) => (
                                <li
                                  className={
                                    selectedStates.includes(state)
                                      ? "active"
                                      : ""
                                  }
                                  onClick={() => selectOption2(state)}
                                  key={state}
                                >
                                  {state}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>

                        {/* District selection */}
                        {selectedStates.map((state) => (
                          <div key={state} className="mb-2 bookDistrictsListScroll">
                            {stateDistricts[state]?.map((district) => (
                              <div
                                className={`form-check d-flex ${selectedDistricts.includes(district) ? "checked" : ""}`}
                                key={district}
                              >
                                <input
                                  type="checkbox"
                                  className="form-check-input"
                                  id={district}
                                  onChange={() =>
                                    handleDistrictChange(district)
                                  }
                                  checked={selectedDistricts.includes(district)}
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor={district}
                                >
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
                {isLoading ? (
                  <div className="col-12 text-center loading-container">
                    {/* <img
                      src="./images/BookLoading.svg"
                      alt="Loading..."
                      className="Book-loading-gif"
                      sk="2"
                    /> */}
                    {/* skleton loader */}
                    <div className="row side-right-content">
                      {Array.from({ length: 6 }).map((_, index) => (
                        <div className="col-lg-4 col-md-6 col-sm-12 mb-4 card-board-contents skeleton">
                          <div className="card board-book skeleton-card ">

                            <img className="card-img-top-book skeleton-box skeleton-img" alt="" />

                            <span className="board-category-book skeleton-pill"></span>
                            <span className="board-location-book skeleton-pill"></span>

                            <div className="board-content-book">
                              <div className="board-content-top-book">
                                <span className="board-loc-book skeleton-line"></span>
                              </div>

                              <div className="board-content-bottom-book">
                                <span className="board-price-book skeleton-line short"></span>
                                <span className="board-dim-book skeleton-line xshort"></span>
                              </div>
                            </div>

                            {/* <div className="skeleton-rating"></div> */}

                            <button className="board-btn-book skeleton-btn"></button>

                          </div>
                        </div>

                      ))}
                    </div>

                    {/* skleton loader */}
                  </div>
                ) : currentSpots.length > 0 ? (
                  currentSpots.map((spot) => (
                    <div
                      className="col-lg-4 col-md-6 col-sm-12 mb-4 card-board-contents"
                      key={spot.id}
                    >
                      <div
                        className="card board-book"
                        onClick={() => handleBookNow(spot)}
                      >
                        <img
                          src={spot.imageUrl}
                          alt={spot.location}
                          className="card-img-top-book"
                        />
                        <span className="board-category-book">
                          {spot.category}
                        </span>
                        <span className="board-location-book">
                          {spot.location}
                        </span>
                        <div className="board-content-book ">
                          <div className="board-content-top-book">
                            <span className="board-loc-book">
                              {spot.prodName}
                            </span>
                          </div>
                          <div className="board-content-bottom-book">
                            <span className="board-price-book">
                              {formatIndianCurrency(spot.price, true)}
                              <span className="board-price-bookPerDay">
                                {" "}
                                / Per Day
                              </span>
                            </span>
                            <span className="board-dim-book">
                              {spot.sizeWidth} x {spot.sizeHeight} | Sq.ft
                            </span>
                          </div>
                        </div>
                        <RatingStars rating={spot.rating} />
                        <button
                          className="board-btn-book"
                          onClick={() => handleBookNow(spot)}
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-12 text-center">
                    <h5 className="NoItems">No results found</h5>
                  </div>
                )}

                {/* Pagination Component */}
                {!isLoading && totalPages > 1 && (
                  <div className="col-12 text-center">
                    <div className="pagination d-flex justify-content-center">
                      <button
                        className="prev-button"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 0}
                      >
                        <i className="fa-solid fa-arrow-left"></i>
                      </button>

                      {getPaginationGroup().map((page, index) =>
                        page === "..." ? (
                          <span key={index} className="dots">
                            ...
                          </span>
                        ) : (
                          <button
                            key={index}
                            className={`page-number ${currentPage === page ? "active" : ""}`}
                            onClick={() => handlePageChange(page)}
                          >
                            {page + 1}{" "}
                            {/* Display page numbers as 1-based for user */}
                          </button>
                        ),
                      )}

                      <button
                        className="next-button"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages - 1}
                      >
                        <i className="fa-solid fa-arrow-right"></i>
                      </button>
                    </div>

                    {/* Optional: Show page info */}
                    {/* <div className="pagination-info mt-2">
                      Page {currentPage + 1} of {totalPages} • Total {totalProducts} products
                    </div> */}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <MainFooter />
      </div>
    </MainLayout>
    </>
  );
}
