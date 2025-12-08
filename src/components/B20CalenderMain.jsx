import React, { useState, useEffect } from "react";
import "./B20CalenderMain.css";
import { formatIndianCurrency } from './FORMATED_AMOUNT';

const Calendar = ({ closeCalendar, selectedDates, generateMonth, handleDateClick, resetDates, getDateSelectionClass, goToNextMonth, goToPreviousMonth, bookedDates, currentMonth, confirmedDates, setConfirmedDates, pricePerDay, confirmDates, totalPrice, calendarErrorMessage, setCalendarErrorMessage }) => {
  //CALENDER SMALL SCREENS
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 991);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 991);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (

    <div className={`calendar-container ${isSmallScreen ? 'scrollable' : ''}`}>
      <div className="calendar-header">
        {isSmallScreen ? (
          <>
            <button className="nav-button" onClick={goToPreviousMonth}>
              <i className="fa-solid fa-arrow-left left-arr"></i>
            </button>
            <span className="month-year">
              {currentMonth.toLocaleString("default", { month: "long" })} {currentMonth.getFullYear()}
            </span>
            <button className="nav-button" onClick={goToNextMonth}>
              <i className="fa-solid fa-arrow-right right-arr"></i>
            </button>
          </>
        ) : (
          <>
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
          </>
        )}
        <button className="close-xmark" onClick={closeCalendar}>
          <i className="fa-regular fa-circle-xmark"></i>
        </button>
      </div>

      {/* CALENDER BODY  */}

      {/* Calendar Body */}
      <div className={`calendar-body ${isSmallScreen ? "small-screen-calendar" : "large-screen-calendar"}`}>
        {isSmallScreen ? (
          <>
            {/* One Calendar Grid */}
            <div className="calendar-grid">
              <div className="day">Sun</div>
              <div className="day">Mon</div>
              <div className="day">Tue</div>
              <div className="day">Wed</div>
              <div className="day">Thu</div>
              <div className="day">Fri</div>
              <div className="day">Sat</div>
              {generateMonth(currentMonth).map((date, index) => (
                <div
                  key={index}
                  className={`date ${date
                    ? bookedDates.some((d) => d.getTime() === date.getTime())
                      ? "booked"
                      : getDateSelectionClass(date)
                    : ""
                    }`}
                  onClick={() => handleDateClick(date)}
                  style={{ pointerEvents: bookedDates.some((d) => d.getTime() === date?.getTime()) ? "none" : "auto" }}
                >
                  {date ? date.getDate() : ""}
                </div>
              ))}
            </div>

            {/* Legend Section */}
            <div className="calendar-legend">

              <div className="calendar-legend-responsive">
                <div className=" calendar-legend-responsive-content1">
                  <i className="fa-solid fa-circle dot-booked"></i>
                  <span> Booked Dates</span> <br />
                  <i className="fa-solid fa-circle dot-available"></i>
                  <span> Available Dates</span> <br />
                  <i className="fa-solid fa-circle dot-pending"></i>
                  <span> Pendings </span> <br />

                </div>
                <div className="calendar-legend-responsive-content2">
                  <span>
                    Start Date: <span style={{ color: 'red' }}>
                      {selectedDates.start
                        ? `${selectedDates.start.toLocaleString("en-US", { month: "short" })} ${selectedDates.start.getDate()}`
                        : "--"}
                    </span>
                  </span><br />
                  <span>
                    End Date: <span style={{ color: 'red' }}>
                      {selectedDates.end
                        ? `${selectedDates.end.toLocaleString("en-US", { month: "short" })} ${selectedDates.end.getDate()}`
                        : "--"}
                    </span>
                  </span> <br></br>
                  {/* Total Amount Calculation */}
                  <span>
                    {/* Amount: <span style={{ color: 'red' }}>₹{totalPrice.toLocaleString()}</span> */}
                    Amount: <span style={{ color: 'red' }}>{formatIndianCurrency(totalPrice, true)}</span>

                  </span>
                  <br />
                </div>
              </div>
              
              <div className="calendarPendingNoteMain">
                <div className="calendarPendingAsh">
                  <img src='/images/CalenderPendingAsh.svg' className="calendarPendingAsh"></img>
                </div>
                <div className="calendarPendingContents" ><i className="fa-solid fa-circle dot-pending"></i></div>
                <div className="calendarPendingContents">indicates a reserved date. If the booking isn’t confirmed, the slot will pass to the next request.</div>
              </div>

              {/* <div className="calenderLegendButtons">
                <div>   <button className="confirm-button" onClick={confirmDates}>Reserve Slot</button> </div>
                <div> <button className="reset-button" onClick={resetDates}>Reset Date</button></div>
              </div> */} 


              <div className="calendarBtnsResetConfirm">
                <button className="confirm-button" onClick={confirmDates}>Reserve Slot</button>
                <button className="reset-button" onClick={resetDates}>
                  Reset Date
                </button>
              </div> 


            </div>


            {/* ADDED: Error message display above calendar */}
            {/* {calendarErrorMessage && (
                                            <div className="calendar-error-message">
                                                <div className="error-icon">⚠️</div>
                                                <div className="error-text">{calendarErrorMessage}</div>
                                            </div>
                                        )} */}
          </>
        ) : (
          // Large Screen Layout: Legend + 2 Months side by side
          <div className="large-calendar-layout">
            {/* Legend Section */}
            <div className="calendar-legend">
              <div className="calenderLegendContentsMain">
                <i className="fa-solid fa-circle dot-booked"></i>
                <span> Booked Dates</span> <br />
                <i className="fa-solid fa-circle dot-available"></i>
                <span> Available Dates</span> <br />
                <i className="fa-solid fa-circle dot-pending"></i>
                <span> Pendings </span>
                <br />
              </div>
              {/* <span> Start Date: {selectedDates.start ? selectedDates.start.getMonthYear() : "--"}</span> <br /> */}
              <div className="calendarStartEndMain" >
                <div>
                  <span>
                    Start Date: <span style={{ color: 'red' }}>
                      {selectedDates.start
                        ? `${selectedDates.start.toLocaleString("en-US", { month: "short" })} ${selectedDates.start.getDate()}`
                        : "--"}
                    </span>
                  </span> <br></br>
                </div>
                <div>
                  ---
                </div>


                <div>
                  <span>
                    End Date: <span style={{ color: 'red' }}>
                      {selectedDates.end
                        ? `${selectedDates.end.toLocaleString("en-US", { month: "short" })} ${selectedDates.end.getDate()}`
                        : "--"}
                    </span>
                  </span>
                </div>

              </div>
              <div className="calendarAmountMain">
                <span>
                  {/* Amount: <span style={{ color: 'red' }}>₹{totalPrice.toLocaleString()}</span> */}
                    Amount: <span style={{ color: 'red' }}>{formatIndianCurrency(totalPrice, true)}</span>

                </span>
                <br />
                {/* <span> End Date: {selectedDates.end ? selectedDates.end.toDateString() : "--"}</span> <br /> */}
                <br />
              </div> 
  


              <div className="calendarBtnsResetConfirm">
                <button className="confirm-button" onClick={confirmDates}>Reserve Slot</button>
                <button className="reset-button" onClick={resetDates}>
                  Reset Date
                </button>
              </div>  



              <div className="calendarPendingNoteMain">
                <div className="calendarPendingAsh">
                  <img src='/images/CalenderPendingAsh.svg' className="calendarPendingAsh"></img>
                </div>
                <div className="calendarPendingContents" ><i className="fa-solid fa-circle dot-pending"></i></div>
                <div className="calendarPendingContents">indicates a reserved date. If the booking isn’t confirmed, the slot will pass to the next request.</div>
              </div> 

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
                          : getDateSelectionClass(date)
                        // ? "selected-date"
                        // : "available-date"
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
        )} 
        <>
          {calendarErrorMessage && (
            <div className="calendar-error-message">
              <div className="calendarAlertIconMain" >
                {/* ⚠️ */}
                <img src='/images/CalendarAlertImg.svg' className="calendarAlertIcon"></img>
              </div>
              <div className="calendar_error-text">Please select & confirm the <span className="calendar-error-messageBold">Start and End dates</span> to proceed.</div>
            </div>
          )}
        </>
      </div>
    </div>
  );
};

export default Calendar;