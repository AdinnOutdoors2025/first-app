// import React, { useState, useEffect } from "react";
// import "./B20CalenderMain.css";
// import { formatIndianCurrency } from './FORMATED_AMOUNT';

// const Calendar = ({ closeCalendar, selectedDates, generateMonth, handleDateClick, resetDates, getDateSelectionClass, goToNextMonth, goToPreviousMonth, bookedDates, currentMonth, confirmedDates, setConfirmedDates, pricePerDay, confirmDates, totalPrice, calendarErrorMessage, setCalendarErrorMessage }) => {
//   //CALENDER SMALL SCREENS
//   const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 991);

//   useEffect(() => {
//     const handleResize = () => {
//       setIsSmallScreen(window.innerWidth <= 991);
//     };
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);
//   return (

//     <div className={`calendar-container ${isSmallScreen ? 'scrollable' : ''}`}>
//       <div className="calendar-header">
//         {isSmallScreen ? (
//           <>
//             <button className="nav-button" onClick={goToPreviousMonth}>
//               <i className="fa-solid fa-arrow-left left-arr"></i>
//             </button>
//             <span className="month-year">
//               {currentMonth.toLocaleString("default", { month: "long" })} {currentMonth.getFullYear()}
//             </span>
//             <button className="nav-button" onClick={goToNextMonth}>
//               <i className="fa-solid fa-arrow-right right-arr"></i>
//             </button>
//           </>
//         ) : (
//           <>
//             <div className="left-calender">
//               <button className="nav-button" onClick={goToPreviousMonth}>
//                 <i className="fa-solid fa-arrow-left left-arr"></i>
//               </button>
//               <span className="month-year">
//                 {currentMonth.toLocaleString("default", { month: "long" })} {currentMonth.getFullYear()}
//               </span>
//             </div> 
          
//             <div className="right-calender">
//               <span className="month-year">
//                 {new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1).toLocaleString("default", {
//                   month: "long",
//                 })}{" "}
//                 {currentMonth.getFullYear()}
//               </span>
//               <button className="nav-button" onClick={goToNextMonth}>
//                 <i className="fa-solid fa-arrow-right right-arr"></i>
//               </button>
//             </div>
//           </>
//         )}
//         <button className="close-xmark" onClick={closeCalendar}>
//           <i className="fa-regular fa-circle-xmark"></i>
//         </button>
//       </div>

//       {/* CALENDER BODY  */}

//       {/* Calendar Body */}
//       <div className={`calendar-body ${isSmallScreen ? "small-screen-calendar" : "large-screen-calendar"}`}>
//         {isSmallScreen ? (
//           <>
//             {/* One Calendar Grid */}
//             <div className="calendar-grid">
//               <div className="day">Sun</div>
//               <div className="day">Mon</div>
//               <div className="day">Tue</div>
//               <div className="day">Wed</div>
//               <div className="day">Thu</div>
//               <div className="day">Fri</div>
//               <div className="day">Sat</div>
//               {generateMonth(currentMonth).map((date, index) => (
//                 <div
//                   key={index}
//                   className={`date ${date
//                     ? bookedDates.some((d) => d.getTime() === date.getTime())
//                       ? "booked"
//                       : getDateSelectionClass(date)
//                     : ""
//                     }`}
//                   onClick={() => handleDateClick(date)}
//                   style={{ pointerEvents: bookedDates.some((d) => d.getTime() === date?.getTime()) ? "none" : "auto" }}
//                 >
//                   {date ? date.getDate() : ""}
//                 </div>
//               ))}
//             </div>

//             {/* Legend Section */}
//             <div className="calendar-legend">

//               <div className="calendar-legend-responsive">
//                 <div className=" calendar-legend-responsive-content1">
//                   <i className="fa-solid fa-circle dot-booked"></i>
//                   <span> Booked Dates</span> <br />
//                   <i className="fa-solid fa-circle dot-available"></i>
//                   <span> Available Dates</span> <br />
//                   <i className="fa-solid fa-circle dot-pending"></i>
//                   <span> Pendings </span> <br />

//                 </div>
//                 <div className="calendar-legend-responsive-content2">
//                   <span>
//                     Start Date: <span style={{ color: 'red' }}>
//                       {selectedDates.start
//                         ? `${selectedDates.start.toLocaleString("en-US", { month: "short" })} ${selectedDates.start.getDate()}`
//                         : "--"}
//                     </span>
//                   </span><br />
//                   <span>
//                     End Date: <span style={{ color: 'red' }}>
//                       {selectedDates.end
//                         ? `${selectedDates.end.toLocaleString("en-US", { month: "short" })} ${selectedDates.end.getDate()}`
//                         : "--"}
//                     </span>
//                   </span> <br></br>
//                   {/* Total Amount Calculation */}
//                   <span>
//                     {/* Amount: <span style={{ color: 'red' }}>₹{totalPrice.toLocaleString()}</span> */}
//                     Amount: <span style={{ color: 'red' }}>{formatIndianCurrency(totalPrice, true)}</span>

//                   </span>
//                   <br />
//                 </div>
//               </div>
              
//               <div className="calendarPendingNoteMain">
//                 <div className="calendarPendingAsh">
//                   <img src='/images/CalenderPendingAsh.svg' className="calendarPendingAsh"></img>
//                 </div>
//                 <div className="calendarPendingContents" ><i className="fa-solid fa-circle dot-pending"></i></div>
//                 <div className="calendarPendingContents">indicates a reserved date. If the booking isn’t confirmed, the slot will pass to the next request.</div>
//               </div>

//               {/* <div className="calenderLegendButtons">
//                 <div>   <button className="confirm-button" onClick={confirmDates}>Reserve Slot</button> </div>
//                 <div> <button className="reset-button" onClick={resetDates}>Reset Date</button></div>
//               </div> */} 


//               <div className="calendarBtnsResetConfirm">
//                 <button className="confirm-button" onClick={confirmDates}>Reserve Slot</button>
//                 <button className="reset-button" onClick={resetDates}>
//                   Reset Date
//                 </button>
//               </div> 


//             </div>


//             {/* ADDED: Error message display above calendar */}
//             {/* {calendarErrorMessage && (
//                                             <div className="calendar-error-message">
//                                                 <div className="error-icon">⚠️</div>
//                                                 <div className="error-text">{calendarErrorMessage}</div>
//                                             </div>
//                                         )} */}
//           </>
//         ) : (
//           // Large Screen Layout: Legend + 2 Months side by side
//           <div className="large-calendar-layout">
//             {/* Legend Section */}
//             <div className="calendar-legend">
//               <div className="calenderLegendContentsMain">
//                 <i className="fa-solid fa-circle dot-booked"></i>
//                 <span> Booked Dates</span> <br />
//                 <i className="fa-solid fa-circle dot-available"></i>
//                 <span> Available Dates</span> <br />
//                 <i className="fa-solid fa-circle dot-pending"></i>
//                 <span> Pendings </span>
//                 <br />
//               </div>
//               {/* <span> Start Date: {selectedDates.start ? selectedDates.start.getMonthYear() : "--"}</span> <br /> */}
//               <div className="calendarStartEndMain" >
//                 <div>
//                   <span>
//                     Start Date: <span style={{ color: 'red' }}>
//                       {selectedDates.start
//                         ? `${selectedDates.start.toLocaleString("en-US", { month: "short" })} ${selectedDates.start.getDate()}`
//                         : "--"}
//                     </span>
//                   </span> <br></br>
//                 </div>
//                 <div>
//                   ---
//                 </div>


//                 <div>
//                   <span>
//                     End Date: <span style={{ color: 'red' }}>
//                       {selectedDates.end
//                         ? `${selectedDates.end.toLocaleString("en-US", { month: "short" })} ${selectedDates.end.getDate()}`
//                         : "--"}
//                     </span>
//                   </span>
//                 </div>

//               </div>
//               <div className="calendarAmountMain">
//                 <span>
//                   {/* Amount: <span style={{ color: 'red' }}>₹{totalPrice.toLocaleString()}</span> */}
//                     Amount: <span style={{ color: 'red' }}>{formatIndianCurrency(totalPrice, true)}</span>

//                 </span>
//                 <br />
//                 {/* <span> End Date: {selectedDates.end ? selectedDates.end.toDateString() : "--"}</span> <br /> */}
//                 <br />
//               </div> 
  


//               <div className="calendarBtnsResetConfirm">
//                 <button className="confirm-button" onClick={confirmDates}>Reserve Slot</button>
//                 <button className="reset-button" onClick={resetDates}>
//                   Reset Date
//                 </button>
//               </div>  



//               <div className="calendarPendingNoteMain">
//                 <div className="calendarPendingAsh">
//                   <img src='/images/CalenderPendingAsh.svg' className="calendarPendingAsh"></img>
//                 </div>
//                 <div className="calendarPendingContents" ><i className="fa-solid fa-circle dot-pending"></i></div>
//                 <div className="calendarPendingContents">indicates a reserved date. If the booking isn’t confirmed, the slot will pass to the next request.</div>
//               </div> 

//             </div>

//             {/* Calendar Grid for 2 months */} 

//             {[0, 1].map((offset) => {
//               const monthToRender = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + offset);
//               return (
//                 <div key={offset} className="calendar-grid">
//                   <div className="day">Sun</div>
//                   <div className="day">Mon</div>
//                   <div className="day">Tue</div>
//                   <div className="day">Wed</div>
//                   <div className="day">Thu</div>
//                   <div className="day">Fri</div>
//                   <div className="day">Sat</div>
//                   {/* <div className="day">Sun</div> */}
//                   {generateMonth(monthToRender).map((date, index) => (
//                     <div
//                       key={index}
//                       className={`date ${date
//                         ? bookedDates.some((d) => d.getTime() === date.getTime())
//                           ? "booked"
//                           : getDateSelectionClass(date)
//                         // ? "selected-date"
//                         // : "available-date"
//                         : ""
//                         }`}
//                       onClick={() => handleDateClick(date)}
//                       style={{ pointerEvents: bookedDates.some((d) => d.getTime() === date?.getTime()) ? "none" : "auto" }}
//                     >
//                       {date ? date.getDate() : ""}
//                     </div>
//                   ))}
//                 </div>
//               );
//             })}
        
//           </div>
//         )} 
//         <>
//           {calendarErrorMessage && (
//             <div className="calendar-error-message">
//               <div className="calendarAlertIconMain" >
//                 {/* ⚠️ */}
//                 <img src='/images/CalendarAlertImg.svg' className="calendarAlertIcon"></img>
//               </div>
//               <div className="calendar_error-text">Please select & confirm the <span className="calendar-error-messageBold">Start and End dates</span> to proceed.</div>
//             </div>
//           )}
//         </>
//       </div>
//     </div>
//   );
// };

// export default Calendar;


// PERFECT CODE FOR DATE CONFLICT CHECK (1,2) AND DATE SELECTION UI 
import React, { useState, useEffect } from "react";
import "./B20CalenderMain.css";
import { formatIndianCurrency } from './FORMATED_AMOUNT';

const Calendar = ({ 
  closeCalendar, 
  selectedDates, 
  generateMonth, 
  handleDateClick, 
  resetDates, 
  getDateSelectionClass, 
  goToNextMonth, 
  goToPreviousMonth, 
  confirmedDates = [], // Renamed from bookedDates
  pendingDates = [],   // New prop for pending dates
  currentMonth, 
  setCurrentMonth,
  pricePerDay, 
  confirmDates, 
  totalDays, 
  totalPrice, 
  calendarErrorMessage, 
  setCalendarErrorMessage,
  getAvailableDaysInRange,
  isDateBooked,
  isDatePending,
  showQueueInfo = false,
  queuePosition = null
}) => {

  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 991);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 991);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // // Get custom class for date based on status
  // const getDateCustomClass = (date) => {
  //   if (!date) return "";
    
  //   const baseClass = getDateSelectionClass(date);
    
  //   // Check if date is in selected range
  //   if (selectedDates.start && selectedDates.end && date) {
  //     const normalizedDate = new Date(Date.UTC(
  //       date.getFullYear(),
  //       date.getMonth(),
  //       date.getDate()
  //     ));
      
  //     const startUTC = selectedDates.start ? new Date(Date.UTC(
  //       selectedDates.start.getFullYear(),
  //       selectedDates.start.getMonth(),
  //       selectedDates.start.getDate()
  //     )) : null;

  //     const endUTC = selectedDates.end ? new Date(Date.UTC(
  //       selectedDates.end.getFullYear(),
  //       selectedDates.end.getMonth(),
  //       selectedDates.end.getDate()
  //     )) : null;

  //     if (startUTC && normalizedDate.getTime() === startUTC.getTime()) {
  //       return "selected-start";
  //     }
  //     if (endUTC && normalizedDate.getTime() === endUTC.getTime()) {
  //       return "selected-end";
  //     }
  //     if (startUTC && endUTC && normalizedDate > startUTC && normalizedDate < endUTC) {
  //       return "selected-range";
  //     }
  //   }
    
  //   return baseClass;
  // };


  //  // Get custom class for date based on status
  // const getDateCustomClass = (date) => {
  //   if (!date || isNaN(date.getTime())) return "";
    
  //   try {
  //     const baseClass = getDateSelectionClass(date);
      
  //     // Check if date is in selected range
  //     if (selectedDates.start && selectedDates.end && date) {
  //       const normalizedDate = new Date(Date.UTC(
  //         date.getFullYear(),
  //         date.getMonth(),
  //         date.getDate()
  //       ));
        
  //       const startUTC = selectedDates.start ? new Date(Date.UTC(
  //         selectedDates.start.getFullYear(),
  //         selectedDates.start.getMonth(),
  //         selectedDates.start.getDate()
  //       )) : null;

  //       const endUTC = selectedDates.end ? new Date(Date.UTC(
  //         selectedDates.end.getFullYear(),
  //         selectedDates.end.getMonth(),
  //         selectedDates.end.getDate()
  //       )) : null;

  //       if (startUTC && normalizedDate.getTime() === startUTC.getTime()) {
  //         return "selected-start";
  //       }
  //       if (endUTC && normalizedDate.getTime() === endUTC.getTime()) {
  //         return "selected-end";
  //       }
  //       if (startUTC && endUTC && normalizedDate > startUTC && normalizedDate < endUTC) {
  //         return "selected-range";
  //       }
  //     }
      
  //     return baseClass;
  //   } catch (error) {
  //     console.warn("Error in getDateCustomClass:", error);
  //     return "";
  //   }
  // };

  // Get custom class for date based on status
const getDateCustomClass = (date) => {
  if (!date || isNaN(date.getTime())) return "";
  
  try {
    const baseClass = getDateSelectionClass(date);
    
    // For booked dates, always return "booked" (red) - they should never show as selected
    if (baseClass === "booked") return "booked";
    
    // Check if date is in selected range
    if (selectedDates.start && selectedDates.end && date) {
      const normalizedDate = new Date(Date.UTC(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
      ));
      
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

      // Only apply selection styling if date is available (not booked)
      if (baseClass !== "booked") {
        if (startUTC && normalizedDate.getTime() === startUTC.getTime()) {
          return "selected-start";
        }
        if (endUTC && normalizedDate.getTime() === endUTC.getTime()) {
          return "selected-end";
        }
        if (startUTC && endUTC && normalizedDate > startUTC && normalizedDate < endUTC) {
          return "selected-range";
        }
      }
    }
    
    return baseClass;
  } catch (error) {
    console.warn("Error in getDateCustomClass:", error);
    return "";
  }
};

  // Calculate total calendar days and available days for display
  const calculateDisplayInfo = () => {
    if (!selectedDates.start || !selectedDates.end) {
      return { calendarDays: 0, availableDays: 0, pendingInRange: 0 };
    }
    
    const calendarDays = Math.ceil(Math.abs(selectedDates.end - selectedDates.start) / (1000 * 60 * 60 * 24)) + 1;
    const availableDays = getAvailableDaysInRange ? getAvailableDaysInRange(selectedDates.start, selectedDates.end).length : calendarDays;
    
    // Calculate pending dates in range
    let pendingInRange = 0;
    if (selectedDates.start && selectedDates.end) {
      const current = new Date(selectedDates.start);
      const end = new Date(selectedDates.end);
      while (current <= end) {
        if (isDatePending && isDatePending(current)) {
          pendingInRange++;
        }
        current.setDate(current.getDate() + 1);
      }
    }
    
    return { calendarDays, availableDays, pendingInRange };
  };

  const { calendarDays, availableDays, pendingInRange } = calculateDisplayInfo();

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

      <div className={`calendar-body ${isSmallScreen ? "small-screen-calendar" : "large-screen-calendar"}`}>
        {isSmallScreen ? (
          <>
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
                  className={`date ${getDateCustomClass(date)}`}
                  onClick={() => handleDateClick(date)}
                  style={{ 
                    pointerEvents: isDateBooked && date && isDateBooked(date) ? "none" : "auto"
                  }}
                >
                  {date ? date.getDate() : ""}
                  {date && isDatePending && isDatePending(date) && (
                    <span className="queue-indicator-dot" title="In queue"></span>
                  )}
                </div>
              ))}
            </div>

            <div className="calendar-legend">
              <div className="calendar-legend-responsive">
                <div className=" calendar-legend-responsive-content1">
                  <i className="fa-solid fa-circle dot-booked"></i>
                  <span> Confirmed Booked Dates</span> <br />
                  <i className="fa-solid fa-circle" style={{color: 'orange', fontSize: '10px'}}></i>
                  <span> Pending Reservations (Queue)</span> <br />
                  <i className="fa-solid fa-circle dot-available"></i>
                  <span> Available Dates</span> <br />
                  {showQueueInfo && queuePosition && (
                    <>
                      <i className="fa-solid fa-clock" style={{color: '#ff9800', fontSize: '10px'}}></i>
                      <span> Your Position in Queue: #{queuePosition}</span> <br />
                    </>
                  )}
                </div>
                <div className="calendar-legend-responsive-content2">
                  <span>
                    Start Date: <span style={{ color: 'red' }}>
                      {selectedDates.start
                        ? `${selectedDates.start.toLocaleString("en-IN", { month: "short" })} ${selectedDates.start.getDate()}`
                        : "--"}
                    </span>
                  </span><br />
                  <span>
                    End Date: <span style={{ color: 'red' }}>
                      {selectedDates.end
                        ? `${selectedDates.end.toLocaleString("en-IN", { month: "short" })} ${selectedDates.end.getDate()}`
                        : "--"}
                    </span>
                  </span> <br />
                  <span>
                    Calendar Days: <span style={{ color: 'blue' }}>
                      {calendarDays}
                    </span>
                  </span><br />
                  <span>
                    Available Days: <span style={{ color: 'green' }}>
                      {availableDays}
                    </span>
                  </span><br />
                  {pendingInRange > 0 && (
                    <span>
                      In Queue: <span style={{ color: 'orange', fontWeight: 'bold' }}>
                        {pendingInRange} date{pendingInRange > 1 ? 's' : ''}
                      </span>
                    </span>
                  )}
                  <br />
                  <span>
                    Amount: <span style={{ color: 'red' }}>
                      {formatIndianCurrency(totalPrice, true)}
                    </span>
                  </span>
                  <br />
                  {pricePerDay > 0 && (
                    <small style={{ fontSize: '10px', color: '#666' }}>
                      ({availableDays} days × ₹{pricePerDay.toLocaleString()})
                    </small>
                  )}
                </div>
              </div>

              <div className="calendarPendingNoteMain">
                <div className="calendarPendingAsh">
                  <img src='/images/CalenderPendingAsh.svg' className="calendarPendingAsh" alt="pending"></img>
                </div>
                <div className="calendarPendingContents" >
                  <i className="fa-solid fa-circle" style={{color: 'orange', fontSize: '10px'}}></i>
                </div>
                <div className="calendarPendingContents">
                indicates a reserved date. If the booking isn’t confirmed, the slot will pass to the next request.
                </div>
              </div>

              <div className="calendarBtnsResetConfirm">
                <button className="confirm-button" onClick={confirmDates}>
                  {pendingInRange > 0 ? 'Join Queue' : 'Reserve Slot'}
                </button>
                <button className="reset-button" onClick={resetDates}>
                  Reset Date
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="large-calendar-layout">
            <div className="calendar-legend">
              <div className="calenderLegendContentsMain">
                <i className="fa-solid fa-circle dot-booked"></i>
                <span> Confirmed Booked Dates</span> <br />
                <i className="fa-solid fa-circle" style={{color: 'orange', fontSize: '10px'}}></i>
                <span> Pending Reservations (Queue)</span> <br />
                <i className="fa-solid fa-circle dot-available"></i>
                <span> Available Dates</span> <br />
                {showQueueInfo && queuePosition && (
                  <>
                    <i className="fa-solid fa-clock" style={{color: '#ff9800', fontSize: '10px'}}></i>
                    <span> Your Position in Queue: #{queuePosition}</span> <br />
                  </>
                )}
              </div>
              
              <div className="calendarStartEndMain" >
                <div>
                  <span>
                    Start Date: <span style={{ color: 'red' }}>
                      {selectedDates.start
                        ? `${selectedDates.start.toLocaleString("en-IN", { month: "short" })} ${selectedDates.start.getDate()}`
                        : "--"}
                    </span>
                  </span> <br />
                </div>
                <div>
                  ---
                </div>
                <div>
                  <span>
                    End Date: <span style={{ color: 'red' }}>
                      {selectedDates.end
                        ? `${selectedDates.end.toLocaleString("en-IN", { month: "short" })} ${selectedDates.end.getDate()}`
                        : "--"}
                    </span>
                  </span>
                </div>
              </div>
              
              <div className="calendarDaysInfo">
                <span>
                  Calendar Days: <span style={{ color: 'blue' }}>
                    {calendarDays}
                  </span>
                </span><br />
                <span>
                  Available Days: <span style={{ color: 'green' }}>
                    {availableDays}
                  </span>
                </span><br />
                {pendingInRange > 0 && (
                  <span>
                    In Queue: <span style={{ color: 'orange', fontWeight: 'bold' }}>
                      {pendingInRange} date{pendingInRange > 1 ? 's' : ''}
                    </span>
                  </span>
                )}
                {pricePerDay > 0 && (
                  <small style={{ fontSize: '10px', color: '#666' }}>
                    ({availableDays} available days × ₹{pricePerDay.toLocaleString()}/day)
                  </small>
                )}
              </div>
              
              <div className="calendarAmountMain">
                <span>
                  Amount: <span style={{ color: 'red' }}>{formatIndianCurrency(totalPrice, true)}</span>
                </span>
                <br />
                <br />
              </div>

              <div className="calendarBtnsResetConfirm">
                <button className="confirm-button" onClick={confirmDates}>
                  {pendingInRange > 0 ? 'Join Queue' : 'Reserve Slot'}
                </button>
                <button className="reset-button" onClick={resetDates}>
                  Reset Date
                </button>
              </div>

              <div className="calendarPendingNoteMain">
                <div className="calendarPendingAsh">
                  <img src='/images/CalenderPendingAsh.svg' className="calendarPendingAsh" alt="pending"></img>
                </div>
                <div className="calendarPendingContents">
                  <i className="fa-solid fa-circle" style={{color: 'orange', fontSize: '10px'}}></i>
                </div>
                <div className="calendarPendingContents">
indicates a reserved date. If the booking isn’t confirmed, the slot will pass to the next request.                </div>
              </div>
            </div>

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
                  {generateMonth(monthToRender).map((date, index) => (
                    <div
                      key={index}
                      className={`date ${getDateCustomClass(date)}`}
                      onClick={() => handleDateClick(date)}
                      style={{ 
                        pointerEvents: isDateBooked && date && isDateBooked(date) ? "none" : "auto"
                      }}
                    >
                      {date ? date.getDate() : ""}
                      {date && isDatePending && isDatePending(date) && (
                        <span className="queue-indicator-dot" title="In queue"></span>
                      )}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        )}
        
        {calendarErrorMessage && (
          <div className="calendar-error-message">
            <div className="calendarAlertIconMain">
              <img src='/images/CalendarAlertImg.svg' className="calendarAlertIcon" alt="alert"></img>
            </div>
            <div className="calendar_error-text">
              {calendarErrorMessage.split('\n').map((line, index) => (
                <div key={index}>{line}</div>
              ))}
            </div>
          </div>
        )}
        
        {showQueueInfo && !calendarErrorMessage && (
          <div className="calendar-queue-info" style={{
            background: '#fff3cd',
            border: '1px solid #ffeaa7',
            borderRadius: '5px',
            padding: '10px',
            margin: '10px auto',
            color: '#856404',
            fontSize: '14px'
          }}>
            <i className="fa-solid fa-clock" style={{marginRight: '8px'}}></i>
            Some selected dates are in queue. You'll be added to the waitlist.
          </div>
        )}
      </div>
    </div>
  );
};

export default Calendar;