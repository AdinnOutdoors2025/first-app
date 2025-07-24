import React, { useState, useEffect } from "react";
import "../components/B20CalenderMain.css";
// const bookedDates = [new Date(2025, 2, 10), new Date(2025, 2, 12), new Date(2025, 2, 18)];

const CalendarOrderDetails = ({ isSmallScreen, closeCalender, selectedDates, generateMonth, handleDateClick, resetDates, getDateSelectionClass, goToNextMonth, goToPreviousMonth, bookedDates, currentMonth, confirmedDates, setConfirmedDates, pricePerDay, confirmDates, totalPrice, isPastDate }) => {
  // CALENDER SECTION 
  // Inside the map function for each offset
  const isPastMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0) < new Date();

  return (
    <div>
      <div className="calendar-container" style={{ marginBottom: '15px' }}>
        <div className="calendar-header">
          {isSmallScreen ? (
            <>
              <div className="nav-button" onClick={goToPreviousMonth}>
                <i className="fa-solid fa-arrow-left left-arr"></i>
              </div>
              <span className="month-year">
                {currentMonth.toLocaleString("default", { month: "long" })} {currentMonth.getFullYear()}
              </span>
              <div className="nav-button" onClick={goToNextMonth}>
                <i className="fa-solid fa-arrow-right right-arr"></i>
              </div>
            </>
          ) : (
            <>
              <div className="left-calender">
                <div className="nav-button" onClick={goToPreviousMonth}>
                  <i className="fa-solid fa-arrow-left left-arr"></i>
                </div>
                <span className="month-year">
                  {currentMonth.toLocaleString("default", { month: "long" })} {currentMonth.getFullYear()}
                </span>
              </div>
              <div className="right-calender">
                {/* <span className="month-year">
                {new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1).toLocaleString("default", {
                  month: "long",
                })}{" "}
                {currentMonth.getFullYear()}
              </span> */}

                {(() => {
                  const nextMonthDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1);
                  return (
                    <span className="month-year">
                      {nextMonthDate.toLocaleString("default", { month: "long" })} {nextMonthDate.getFullYear()}
                    </span>
                  );
                })()}
                <div className="nav-button" onClick={goToNextMonth}>
                  <i className="fa-solid fa-arrow-right right-arr"></i>
                </div>
              </div>
            </>
          )}
          <button className="close-xmark" onClick={closeCalender}>
          <i className="fa-regular fa-circle-xmark"></i>
        </button>
        </div>

        {/* CALENDER BODY  */}

        {/* Calendar Body */}
        <div className={`calendar-body ${isSmallScreen ? "small-screen-calendar" : "large-screen-calendar"}`}>
          {isSmallScreen ? (
            <>
              {/* One Calendar Grid */}
              <div className={`calendar-grid ${isPastMonth ? 'past-month' : ''}`}>
                <div className="day">Sun</div>
                <div className="day">Mon</div>
                <div className="day">Tue</div>
                <div className="day">Wed</div>
                <div className="day">Thu</div>
                <div className="day">Fri</div>
                <div className="day">Sat</div>
                {generateMonth(currentMonth).map((date, index) => {

                  return (
                    <div
                      key={index}
                      className={

                        //       `date ${date
                        //       ? bookedDates.some((d) => d.getTime() === date.getTime())
                        //         ? "booked"
                        //         : getDateSelectionClass(date)
                        //       : ""
                        //       } 
                        //       ${isDisabled ? 'disabled' : ''}
                        //     ${getDateSelectionClass(date)}
                        //       `

                        // }
                        //     onClick={() => handleDateClick(date)

                        `date 
       
        ${date ? (bookedDates.some(d =>
                          d.getUTCFullYear() === date.getUTCFullYear() &&
                          d.getUTCMonth() === date.getUTCMonth() &&
                          d.getUTCDate() === date.getUTCDate()
                        ) ? 'booked' : getDateSelectionClass(date)) : ''}
        ${isPastDate ? 'past' : ''}
      `}
                      onClick={() => !isPastDate && handleDateClick(date)}
                      style={{ pointerEvents: bookedDates.some((d) => d.getTime() === date?.getTime()) ? "none" : "auto" }}
                    >
                      {date ? date.getDate() : ""}
                    </div>
                  )
                })}
              </div>

              {/* Legend Section */}
              <div className="calendar-legend">

                <div className="calendar-legend-responsive">
                  <div className=" calendar-legend-responsive-content1">
                    <i className="fa-solid fa-circle dot-booked"></i>
                    <span> Booked Dates</span> <br />
                    <i className="fa-solid fa-circle dot-available"></i>
                    <span> Available Dates</span> <br />

                  </div>
                  <div className="calendar-legend-responsive-content2">
                    {/* <span>
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
                    </span> <br></br> */}


                    // In the legend section, update date display:
<span>
    Start Date: <span style={{ color: 'red' }}>
        {selectedDates.start?.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            timeZone: 'UTC'
        }) || "--"}
    </span>
</span>

<span>
    End Date: <span style={{ color: 'red' }}>
        {selectedDates.end?.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            timeZone: 'UTC'
        }) || "--"}
    </span>
</span>
<br></br>
                    {/* Total Amount Calculation */}
                    <span>
                      Amount: <span style={{ color: 'red' }}>₹{totalPrice.toLocaleString()}</span>
                    </span>
                    <br />
                  </div>
                </div>
                <div className="calenderLegendButtons">
                  <div>   <div className="confirm-button" onClick={confirmDates}>Confirm</div> </div>
                  <div> <div className="reset-button" onClick={resetDates}>Reset Date</div></div></div>
              </div>
            </>
          ) : (
            // Large Screen Layout: Legend + 2 Months side by side
            <div className="large-calendar-layout">

              {/* Legend Section */}


              <div className="calendar-legend">
                <i className="fa-solid fa-circle dot-booked"></i>
                <span> Booked Dates</span> <br />
                <i className="fa-solid fa-circle dot-available"></i>
                <span> Available Dates</span> <br />
                <br />
                {/* <span> Start Date: {selectedDates.start ? selectedDates.start.getMonthYear() : "--"}</span> <br /> */}
                <span>
                  Start Date: <span style={{ color: 'red' }}>
                    {selectedDates.start
                      ? `${selectedDates.start.toLocaleString("en-US", { month: "short" })} ${selectedDates.start.getDate()}`
                      : "--"}
                  </span>
                </span> <br></br>

                <span>
                  End Date: <span style={{ color: 'red' }}>
                    {selectedDates.end
                      ? `${selectedDates.end.toLocaleString("en-US", { month: "short" })} ${selectedDates.end.getDate()}`
                      : "--"}
                  </span>
                </span> <br></br>

                <span>
                  Amount: <span style={{ color: 'red' }}>₹{totalPrice.toLocaleString()}</span>
                </span>
                <br />


                {/* <span> End Date: {selectedDates.end ? selectedDates.end.toDateString() : "--"}</span> <br /> */}
                <br />
                <div className="confirm-button" onClick={confirmDates}>Confirm</div>
                <div className="reset-button" onClick={resetDates}>
                  Reset Date
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
        </div>
      </div>
      {/* <button className="calendarSaveBtn">Save</button> */}
    </div>
  );
};

export default CalendarOrderDetails;