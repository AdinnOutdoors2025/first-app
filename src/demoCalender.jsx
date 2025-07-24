import React, { useState, useRef } from 'react';
import '../components/b2book.css';
import BookASite11 from './components/B21book';

function BookASite13() {
  // Navbar js 
  const [isMenuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  //Image change
  const imgRef = useRef(null); // Reference to the image element
  const handleImageChange = (image) => {
    // Switch statement to set image based on color
    switch (image) {
      case 'image1':
        imgRef.current.src = "./images/spot1.png";
        break;
      case 'image2':
        imgRef.current.src = "./images/spot2.png";
        break;
      case 'image3':
        imgRef.current.src = "./images/spot3.png";
        break;
      default:
        imgRef.current.src = "./images/spot1.png"; // Default image
    }
  };

  const cardDetails = [
    {
      id: 1,
      SpotName: "Adayar L B Road towards Thiruvanmiyur",
      SpotSize: "20 x 30",
      SpotInSquareFeet: "245",
      SpotOutdoorMedium: "Hoarding",
      SpotOutdoorType: "Non-Lighting",
      PrintingCost: 4500,
      MountingCost: 1500,
      FromSpot: "Adayar",
      ToSpot: "Thiruvanmiyur",
      RatePerDay: 12000,
      SpotPay: 999,
      Offer: 5,
      SpotRating: 4,
    }
  ]


  //Start rating board
  // Function to render star ratings
  const RatingStars = ({ rating }) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    return (
      <span className='rating-star'>
        {[...Array(fullStars)].map((_, index) => (
          <span key={index} className="fa-solid fa-star stars1"></span>
        ))}
        {halfStar && <span className="fa-solid fa-star-half-alt1 stars1"></span>}
        {[...Array(emptyStars)].map((_, index) => (
          <span key={index} className="fa-solid fa-star empty-star1 stars1"></span>
        ))}
      </span>
    );
  };



  // CALENDER SECTION 
  const bookedDates = [new Date(2025, 2, 10), new Date(2025, 2, 12), new Date(2025, 2, 18)];
  const [isCalendarOpen, setIsCalendarOpen] = useState(false); // State to toggle calendar
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 2)); // Start with March 2025
  const [selectedDates, setSelectedDates] = useState({ start: null, end: null });

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

    return days;
  };

  const handleDateClick = (date) => {
    if (!date || bookedDates.some((d) => d.getTime() === date.getTime())) return;

    if (!selectedDates.start || selectedDates.end) {
      setSelectedDates({ start: date, end: null });
    } else {
      setSelectedDates({ start: selectedDates.start, end: date });
    }
  };

  const resetDates = () => {
    setSelectedDates({ start: null, end: null });
  };

  const isDateSelected = (date) => {
    if (!date || !selectedDates.start) return false;
    if (!selectedDates.end) return date.getTime() === selectedDates.start.getTime();
    return date >= selectedDates.start && date <= selectedDates.end;
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  // Toggle calender 
  const toggleCalendar = () => {
    setIsCalendarOpen(!isCalendarOpen);
  };

  const closeCalendar = () => {
    setIsCalendarOpen(false);
  };



  return (
    <div>
      {/* Navbar section  */}
      {/* <div className='container '> */}
      {/* </div> */}

      <div className={`calendar-wrapper ${isCalendarOpen ? "calendar-open" : ""}`}>
        {/* Image with details section  */}
        <div className="container-fluid mt-5  Book-section">
          <div className="row BookMain">
            <div className="col-md-6 col-lg-6 d-flex Book-content1">
              <div className="row">
                <div style={{ display: 'flex', }}>
                  <div className='1'>
                    <div className='book-images'>
                      <img src="./images/spot1.png" className="img-fluid book-img11" alt="Small image1" onClick={() => handleImageChange('image1')} />
                    </div>
                    <div className='book-images'>
                      <img src="./images/spot2.png" className="img-fluid book-img21 " alt="Small image 1" onClick={() => handleImageChange('image2')} />
                    </div>
                    <div className='book-images'>
                      <img src="./images/spot3.png" className="img-fluid book-img31" alt="Small image 1" onClick={() => handleImageChange('image3')} />
                    </div>
                  </div>
                  <div className='book-mainImage'>
                    <img src="./images/spot1.png" ref={imgRef} className="img-fluid book-mainImg1" alt="Large image" />
                  </div>
                </div>
              </div>
            </div>
            {cardDetails.map(
              (card, index) => (
                <div className="col-md-6 col-lg-6 Book-content2" key={index} >
                  <p className='book-sideHeading'>{card.SpotName}</p>
                  <p className='book-size'>Size: {card.SpotSize} <span className='slash-bar'>|</span> {card.SpotInSquareFeet} Sq.ft</p>
                  <button className="btn-type">{card.SpotOutdoorMedium}</button>
                  <span className="badge ms-2 book-type">{card.SpotOutdoorType}</span>
                  <p className="book-price mt-3">Printing Cost<span className='cost-gap'>: ₹ {card.PrintingCost.toLocaleString()}</span> <span className='slash-bar1'>|</span> Mounting Cost<span className='cost-gap'>: ₹ {card.MountingCost.toLocaleString()}</span></p>
                  <button className='book-spot'>{card.FromSpot} <span><img src='./images/Location_arrow.png' className='location-arrow'></img>  </span> {card.ToSpot}</button>
                  <div className='book-rate'>
                    <div className='book-rateContent1'>
                      <span className='rate-perDay'>₹ {card.RatePerDay.toLocaleString()} <span className='rate-perDay1'>Per Day</span></span><br></br>
                      <a href="#" className='book-condition anchor'>Terms & Condition</a>
                    </div>
                    <div className='book-rateContent2'>
                      <button className=" book-date" onClick={toggleCalendar}>Select date
                        <span><img src='./images/calender_icon.png' className='calender'></img></span>
                      </button>
                    </div>
                  </div>
                  <span className="me-2 payOffer">Pay {card.SpotPay.toLocaleString()} and Get {card.Offer.toLocaleString()}% Off <span className='refund'>100% Refundable</span></span><br></br>
                  <button className="me-4 btn-pay">Pay ₹999</button>
                  <button className="btn-cart">Add to Cart</button><br></br>
                  <button className=" mt-3 mb-2 btn-enquire">Enquire Now</button><br></br>
                  <span><RatingStars rating={card.SpotRating} /> <span className='rating-number'>({card.SpotRating})</span>
                  </span><br></br>
                  {/* <span className="badge bg-warning text-dark rating-number">({card.SpotRating})</span> */}
                  <a href="#" className=" anchor">Drop Your Reviews</a>
                </div>
              ))}
            {isCalendarOpen && (
              <div className="calendar-overlay">
                <div className="calendar-container">
                  <div className="calendar-header">
                    <div className="left-calender">
                      <button className="nav-button" onClick={goToPreviousMonth}>
                        <i className="fa-solid fa-arrow-left left-arr"></i>
                      </button>
                      <span className="month-year">
                        {currentMonth.toLocaleString("default", { month: "long" })} {currentMonth.getFullYear()}
                      </span>
                    </div>
                    <div className="right-calender">
                      <span className="month-year">
                        {new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1).toLocaleString("default", {
                          month: "long",
                        })}{" "}
                        {currentMonth.getFullYear()}
                      </span>
                      <button className="nav-button" onClick={goToNextMonth}>
                        <i className="fa-solid fa-arrow-right right-arr"></i>
                      </button>
                    </div>
                    <button className="close-xmark" onClick={closeCalendar}>
                      <i className="fa-regular fa-circle-xmark"></i>
                    </button>
                  </div>

                  <div className="calendar-body">
                    {/* Legend Section */}
                    <div className="calendar-legend">
                      <i className="fa-solid fa-circle dot-booked"></i>
                      <span> Booked Dates</span> <br />
                      <i className="fa-solid fa-circle dot-available"></i>
                      <span> Available Dates</span> <br />
                      <br />
                      {/* <span> Start Date: {selectedDates.start ? selectedDates.start.getMonthYear() : "--"}</span> <br /> */}
                      <span>
                        Start Date: {selectedDates.start
                          ? `${selectedDates.start.toLocaleString("en-US", { month: "short" })} ${selectedDates.start.getDate()}`
                          : "--"}
                      </span> <br></br>

                      <span>
                        End Date: {selectedDates.end
                          ? `${selectedDates.end.toLocaleString("en-US", { month: "short" })} ${selectedDates.end.getDate()}`
                          : "--"}
                      </span> <br></br>


                      {/* <span> End Date: {selectedDates.end ? selectedDates.end.toDateString() : "--"}</span> <br /> */}
                      <br />
                      <button className="reset-button" onClick={resetDates}>
                        Reset Date
                      </button>
                    </div>

                    {/* Calendar Grid for 2 months */}
                    {[0, 1].map((offset) => {
                      const monthToRender = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + offset);
                      return (
                        <div key={offset} className="calendar-grid">
                          <div className="day">Sun</div>
                          <div className="day">Mon</div>
                          <div className="day">Tue</div>
                          <div className="day">Wed</div>
                          <div className="day">Thu</div>
                          <div className="day">Fri</div>
                          <div className="day">Sat</div>
                          {/* <div className="day">Sun</div> */}
                          {generateMonth(monthToRender).map((date, index) => (
                            <div
                              key={index}
                              className={`date ${date
                                  ? bookedDates.some((d) => d.getTime() === date.getTime())
                                    ? "booked"
                                    : isDateSelected(date)
                                      ? "selected"
                                      : "available"
                                  : ""
                                }`}
                              onClick={() => handleDateClick(date)}
                              style={{ pointerEvents: bookedDates.some((d) => d.getTime() === date?.getTime()) ? "none" : "auto" }}
                            >
                              {date ? date.getDate() : ""}
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <div>
          <BookASite11 />
        </div>


      </div>
    </div>

  )
}

export default BookASite13;
