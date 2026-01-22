// //PERFECT CODE WHEN HANDLING THE LOGIN LOGOUT AND HIDE THE BOOK NOW BUTTON
// import React, { useState, useEffect } from "react";
// import "./B20CalenderMain.css";
// import { formatIndianCurrency } from './FORMATED_AMOUNT';

// const Calendar = ({
//   closeCalendar,
//   selectedDates,
//   generateMonth,
//   handleDateClick,
//   resetDates,
//   getDateSelectionClass,
//   goToNextMonth,
//   goToPreviousMonth,
//   confirmedDates = [],
//   pendingDates = [],
//   currentMonth,
//   setCurrentMonth,
//   pricePerDay,
//   confirmDates,
//   totalDays,
//   totalPrice,
//   calendarErrorMessage,
//   setCalendarErrorMessage,
//   getAvailableDaysInRange,
//   isDateBooked,
//   isDatePending,
//   showQueueInfo = false,
//   queuePosition = null,
//   isWindowExpanded = false,
//   currentWindowStart = null,
//   currentWindowEnd = null,
//   isSelectionConfirmed = false,
//   INITIAL_SELECTION_DAYS = 10,
//   AVAILABLE_WINDOW_DAYS = 180,
//   MIN_BOOKING_DAYS = 7,
//   isProcessingBooking = false,
//   showLoginRedirect, 

// }) => {

//   const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 991);

// //////////////////////////////////Show Slot Booked Message////////////////////////////////////////////////////
//      const normalizeUTC = (date) =>
//         new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));

//       const formatDate = (date) =>
//         date.toLocaleDateString("en-US", {
//           day: "2-digit",
//           month: "short",
//           year: "numeric",
//           timeZone: "UTC",
//         });
//           const sortedDates = [...confirmedDates]
//         .map((d) => normalizeUTC(new Date(d)))
//         .sort((a, b) => a - b);

//       const lastBookedDate = sortedDates[sortedDates.length - 1];
      

//        const todayUTC = normalizeUTC(new Date());

//       /* --------- Check if ANY green date exists --------- */
//       /*
//     If today + (selectionDays - 1) > lastBookedDate
//     → at least one date becomes selectable (green)
//     */
//       const lastBlockedByToday = new Date(todayUTC);
//       lastBlockedByToday.setUTCDate(
//         lastBlockedByToday.getUTCDate() + (INITIAL_SELECTION_DAYS - 1),
//       );

//       let nextBookingOpenDate = null;

//       if (lastBlockedByToday <= lastBookedDate) {
//         const effectiveLastDate = new Date(lastBookedDate);
//         effectiveLastDate.setUTCDate(effectiveLastDate.getUTCDate() + 1);

//         nextBookingOpenDate = new Date(effectiveLastDate);
//         nextBookingOpenDate.setUTCDate(
//           nextBookingOpenDate.getUTCDate() - (INITIAL_SELECTION_DAYS - 1),
//         );
//       }

//       const bookingMessage = nextBookingOpenDate
//         ? `Slots are booked. Booking opens from ${formatDate(nextBookingOpenDate)}`
//         : null;
        
// setCalendarErrorMessage(bookingMessage)
        
// ///////////////////////////////////Show Slot Booked Message////////////////////////////////////////////////////
//   useEffect(() => {
//     const handleResize = () => {
//       setIsSmallScreen(window.innerWidth <= 991);
//     };
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   // Get custom class for date based on status
//   const getDateCustomClass = (date) => {
//     if (!date || isNaN(date.getTime())) return "";

//     try {
//       const baseClass = getDateSelectionClass(date);

//       // For booked dates, always return "booked" (red)
//       if (baseClass === "booked") return "booked";

//       // For confirmed state, show only selected range as available
//       if (isSelectionConfirmed && selectedDates.start && selectedDates.end) {
//         const normalizedDate = new Date(Date.UTC(
//           date.getFullYear(),
//           date.getMonth(),
//           date.getDate()
//         ));

//         const startUTC = new Date(Date.UTC(
//           selectedDates.start.getFullYear(),
//           selectedDates.start.getMonth(),
//           selectedDates.start.getDate()
//         ));

//         const endUTC = new Date(Date.UTC(
//           selectedDates.end.getFullYear(),
//           selectedDates.end.getMonth(),
//           selectedDates.end.getDate()
//         ));

//         // Check if date is within selected range
//         const isInSelectedRange = normalizedDate >= startUTC && normalizedDate <= endUTC;

//         if (!isInSelectedRange) {
//           return "outside-window";
//         }
//       }

//       // For outside window dates
//       if (baseClass === "outside-window") {
//         return "outside-window";
//       }

//       // For past dates
//       if (baseClass === "past") return "past";

//       // Check if date is in selected range
//       if (selectedDates.start && selectedDates.end && date) {
//         const normalizedDate = new Date(Date.UTC(
//           date.getFullYear(),
//           date.getMonth(),
//           date.getDate()
//         ));

//         const startUTC = selectedDates.start ? new Date(Date.UTC(
//           selectedDates.start.getFullYear(),
//           selectedDates.start.getMonth(),
//           selectedDates.start.getDate()
//         )) : null;

//         const endUTC = selectedDates.end ? new Date(Date.UTC(
//           selectedDates.end.getFullYear(),
//           selectedDates.end.getMonth(),
//           selectedDates.end.getDate()
//         )) : null;

//         // Only apply selection styling if date is available
//         if (baseClass !== "booked" && baseClass !== "outside-window" && baseClass !== "past") {
//           if (startUTC && normalizedDate.getTime() === startUTC.getTime()) {
//             return "selected-start";
//           }
//           if (endUTC && normalizedDate.getTime() === endUTC.getTime()) {
//             return "selected-end";
//           }
//           if (startUTC && endUTC && normalizedDate > startUTC && normalizedDate < endUTC) {
//             return "selected-range";
//           }
//         }
//       }

//       return baseClass;
//     } catch (error) {
//       console.warn("Error in getDateCustomClass:", error);
//       return "";
//     }
//   };

//   // Calculate total calendar days and available days for display
//   const calculateDisplayInfo = () => {
//     if (!selectedDates.start || !selectedDates.end) {
//       return { calendarDays: 0, availableDays: 0, pendingInRange: 0 };
//     }

//     const calendarDays = Math.ceil(Math.abs(selectedDates.end - selectedDates.start) / (1000 * 60 * 60 * 24)) + 1;
//     const availableDays = getAvailableDaysInRange ? getAvailableDaysInRange(selectedDates.start, selectedDates.end).length : calendarDays;

//     // Calculate pending dates in range
//     let pendingInRange = 0;
//     if (selectedDates.start && selectedDates.end) {
//       const current = new Date(selectedDates.start);
//       const end = new Date(selectedDates.end);
//       while (current <= end) {
//         if (isDatePending && isDatePending(current)) {
//           pendingInRange++;
//         }
//         current.setDate(current.getDate() + 1);
//       }
//     }

//     return { calendarDays, availableDays, pendingInRange };
//   };

//   const { calendarDays, availableDays, pendingInRange } = calculateDisplayInfo();

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
//       {/* {showLoginRedirect && (
//         <div className="login-redirect-message">
//           <div className="redirect-spinner"></div>
//           <p>Redirecting to login...</p>
//         </div>
//       )} */}
//       <div className={`calendar-body ${isSmallScreen ? "small-screen-calendar" : "large-screen-calendar"}`}>
//         {isSmallScreen ? (
//           <>
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
//                   className={`date ${getDateCustomClass(date)}`}
//                   onClick={() => {
//                     // Only allow clicks on dates that are not outside window or past
//                     const dateClass = getDateCustomClass(date);
//                     if (dateClass !== "outside-window" && dateClass !== "past") {
//                       handleDateClick(date);
//                     }
//                   }}
//                   style={{
//                     pointerEvents: getDateCustomClass(date) === "outside-window" || getDateCustomClass(date) === "past" ? "none" : "auto",
//                     cursor: getDateCustomClass(date) === "outside-window" || getDateCustomClass(date) === "past" ? "not-allowed" : "pointer"
//                   }}
//                 >
//                   {date ? date.getDate() : ""}
//                   {date && isDatePending && isDatePending(date) && (
//                     <span className="queue-indicator-dot" title="In queue"></span>
//                   )}
//                 </div>
//               ))}
//             </div>

//             <div className="calendar-legend">
//               <div className="calendar-legend-responsive">
//                 <div className=" calendar-legend-responsive-content1">
//                   <i className="fa-solid fa-circle dot-booked"></i>
//                   <span> Booked Dates</span> <br />
//                   <i className="fa-solid fa-circle dot-available"></i>
//                   <span> Available Dates</span> <br />

//                   <i className="fa-solid fa-circle" style={{ color: 'orange', fontSize: '10px' }}></i>
//                   <span> Pending </span> <br />
//                 </div>
//                 <div className="calendar-legend-responsive-content2">
//                   <span>
//                     Start Date: <span style={{ color: 'red' }}>
//                       {selectedDates.start
//                         ? `${selectedDates.start.toLocaleString("en-IN", { month: "short" })} ${selectedDates.start.getDate()}`
//                         : "--"}
//                     </span>
//                   </span><br />
//                   <span>
//                     End Date: <span style={{ color: 'red' }}>
//                       {selectedDates.end
//                         ? `${selectedDates.end.toLocaleString("en-IN", { month: "short" })} ${selectedDates.end.getDate()}`
//                         : "--"}
//                     </span>
//                   </span> <br />
//                   <span>
//                     Amount: <span style={{ color: 'red' }}>
//                       {formatIndianCurrency(totalPrice, true)}
//                     </span>
//                   </span>
//                   <br />
//                 </div>
//               </div>

//               <div className="calendarPendingNoteMain">
//                 <div className="calendarPendingAsh">
//                   <img src='/images/CalenderPendingAsh.svg' className="calendarPendingAsh" alt="pending"></img>
//                 </div>
//                 <div className="calendarPendingContents" >
//                   <i className="fa-solid fa-circle" style={{ color: 'orange', fontSize: '10px' }}></i>
//                 </div>
//                 <div className="calendarPendingContents">
//                   indicates a reserved date. If the booking isn't confirmed, the slot will pass to the next request.
//                 </div>
//               </div>

//               <div className="calendarBtnsResetConfirm">
//                 <button
//                   className="confirm-button"
//                   onClick={confirmDates}
//                   disabled={isProcessingBooking}
//                 >
//                   {isProcessingBooking ? 'Processing...' : 'Reserve & Book'}
//                 </button>
//                 <button
//                   className="reset-button"
//                   onClick={resetDates}
//                   disabled={isProcessingBooking}
//                 >
//                   Reset Date
//                 </button>
//               </div>
//             </div>
//           </>
//         ) : (
//           <div className="large-calendar-layout">
//             <div className="calendar-legend">
//               <div className="calenderLegendContentsMain">
//                 <i className="fa-solid fa-circle dot-booked"></i>
//                 <span> Booked Dates</span> <br />
//                 <i className="fa-solid fa-circle dot-available"></i>
//                 <span> Available Dates</span> <br />

//                 <i className="fa-solid fa-circle" style={{ color: 'orange', fontSize: '10px' }}></i>
//                 <span> Pending </span> <br />
//               </div>

//               <div className="calendarStartEndMain" >
//                 <div>
//                   <span>
//                     Start Date: <span style={{ color: 'red' }}>
//                       {selectedDates.start
//                         ? `${selectedDates.start.toLocaleString("en-IN", { month: "short" })} ${selectedDates.start.getDate()}`
//                         : "--"}
//                     </span>
//                   </span> <br />
//                 </div>
//                 <div>
//                   ---
//                 </div>
//                 <div>
//                   <span>
//                     End Date: <span style={{ color: 'red' }}>
//                       {selectedDates.end
//                         ? `${selectedDates.end.toLocaleString("en-IN", { month: "short" })} ${selectedDates.end.getDate()}`
//                         : "--"}
//                     </span>
//                   </span>
//                 </div>
//               </div>

//               <div className="calendarDaysInfo">
//                 {/* Date info */}
//               </div>

//               <div className="calendarAmountMain">
//                 <span>
//                   Amount: <span style={{ color: 'red' }}>{formatIndianCurrency(totalPrice, true)}</span>
//                 </span>
//                 <br />
//                 <br />
//               </div>

//               <div className="calendarBtnsResetConfirm">
//                 <button
//                   className="confirm-button"
//                   onClick={confirmDates}
//                   disabled={isProcessingBooking}
//                 >
//                   {isProcessingBooking ? 'Processing...' : 'Reserve & Book'}
//                 </button>
//                 <button
//                   className="reset-button"
//                   onClick={resetDates}
//                   disabled={isProcessingBooking}
//                 >
//                   Reset Date
//                 </button>
//               </div>

//               <div className="calendarPendingNoteMain">
//                 {/* <div className="calendarPendingAsh">
//                   <img src='/images/CalenderPendingAsh.svg' className="calendarPendingAsh" alt="pending"></img>
//                 </div> */}
//                 <div className="calendarPendingContents">
//                   <i className="fa-solid fa-circle" style={{ color: 'orange', fontSize: '10px' }}></i>
//                 </div>
//                 <div className="calendarPendingContents">
//                   indicates a reserved date. If the booking isn't confirmed, the slot will pass to the next request.
//                 </div>
//               </div>
//             </div>

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
//                   {generateMonth(monthToRender).map((date, index) => (
//                     <div
//                       key={index}
//                       className={`date ${getDateCustomClass(date)}`}
//                       onClick={() => {
//                         // Only allow clicks on dates that are not outside window or past
//                         const dateClass = getDateCustomClass(date);
//                         if (dateClass !== "outside-window" && dateClass !== "past") {
//                           handleDateClick(date);
//                         }
//                       }}
//                       style={{
//                         pointerEvents: getDateCustomClass(date) === "outside-window" || getDateCustomClass(date) === "past" ? "none" : "auto",
//                         cursor: getDateCustomClass(date) === "outside-window" || getDateCustomClass(date) === "past" ? "not-allowed" : "pointer"
//                       }}
//                     >
//                       {date ? date.getDate() : ""}
//                       {date && isDatePending && isDatePending(date) && (
//                         <span className="queue-indicator-dot" title="In queue"></span>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               );
//             })}
//           </div>
//         )}

//         {calendarErrorMessage && (
//           <div className="calendar-error-message">
//             <div className="calendarAlertIconMain">
//               <img src='/images/CalendarAlertImg.svg' className="calendarAlertIcon" alt="alert"></img>
//             </div>
//             <div className="calendar_error-text">
//               {calendarErrorMessage.split('\n').map((line, index) => (
//                 <div key={index}>{line}</div>
//               ))}
//             </div>
//           </div>
//         )}

//         {showQueueInfo && !calendarErrorMessage && (
//           <div className="calendar-queue-info" style={{
//             background: '#fff3cd',
//             border: '1px solid #ffeaa7',
//             borderRadius: '5px',
//             padding: '10px',
//             margin: '10px auto',
//             color: '#856404',
//             fontSize: '14px'
//           }}>
//             <i className="fa-solid fa-clock" style={{ marginRight: '8px' }}></i>
//             Some selected dates are in queue. You'll be added to the waitlist.
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Calendar;


//B20CALENDAR_MAIN.JSX
//PERFECT CODE FOR LOGIN AND ERROR MESSAGE PROPERLY SHOWN WITH AVAILABLE FUTURE DATES SUGGESTIONS

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
  confirmedDates = [],
  pendingDates = [],
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
  queuePosition = null,
  isWindowExpanded = false,
  currentWindowStart = null,
  currentWindowEnd = null,
  isSelectionConfirmed = false,
  INITIAL_SELECTION_DAYS = 7,
  AVAILABLE_WINDOW_DAYS = 180,
  MIN_BOOKING_DAYS = 7,
  isProcessingBooking = false,
  showLoginMessage = false,
  showLoginRedirect = false,
  allInitialDaysBooked = false,
  nextBookingOpenDate = null,
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
  //   if (!date || isNaN(date.getTime())) return "";

  //   try {
  //     const baseClass = getDateSelectionClass(date);

  //     // For booked dates, always return "booked" (red)
  //     if (baseClass === "booked") return "booked";

  //     // For outside window dates
  //     if (baseClass === "outside-window") {
  //       return "outside-window";
  //     }

  //     // For past dates
  //     if (baseClass === "past") return "past";

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

  //       // Only apply selection styling if date is available
  //       if (baseClass !== "booked" && baseClass !== "outside-window" && baseClass !== "past") {
  //         if (startUTC && normalizedDate.getTime() === startUTC.getTime()) {
  //           return "selected-start";
  //         }
  //         if (endUTC && normalizedDate.getTime() === endUTC.getTime()) {
  //           return "selected-end";
  //         }
  //         if (startUTC && endUTC && normalizedDate > startUTC && normalizedDate < endUTC) {
  //           return "selected-range";
  //         }
  //       }
  //     }

  //     return baseClass;
  //   } catch (error) {
  //     console.warn("Error in getDateCustomClass:", error);
  //     return "";
  //   }
  // };



  // Update getDateCustomClass function
const getDateCustomClass = (date) => {
    if (!date || isNaN(date.getTime())) return "";

    try {
        const baseClass = getDateSelectionClass(date);

        // For hidden dates, return special class
        if (baseClass === "hidden") {
            return "hidden-date";
        }

        // For booked dates, always return "booked" (red)
        if (baseClass === "booked") return "booked";

        // For outside window dates
        if (baseClass === "outside-window") {
            return "outside-window";
        }

        // For past dates
        if (baseClass === "past") return "past";

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

            // Only apply selection styling if date is available
            if (baseClass !== "booked" && baseClass !== "outside-window" && baseClass !== "past" && baseClass !== "hidden-date") {
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

  // Check if the calendar should show login message in error area
  const shouldShowLoginMessage = showLoginMessage || 
    (calendarErrorMessage && calendarErrorMessage.includes("login") || 
     calendarErrorMessage === "Please login to proceed with booking.");

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
                  onClick={() => {
                    // Only allow clicks on dates that are not outside window or past
                    const dateClass = getDateCustomClass(date);
                    if (dateClass !== "outside-window" && dateClass !== "past") {
                      handleDateClick(date);
                    }
                  }}
                  style={{
                    pointerEvents: getDateCustomClass(date) === "outside-window" || getDateCustomClass(date) === "past" ? "none" : "auto",
                    cursor: getDateCustomClass(date) === "outside-window" || getDateCustomClass(date) === "past" ? "not-allowed" : "pointer"
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
                  <span> Booked Dates</span> <br />
                  <i className="fa-solid fa-circle dot-available"></i>
                  <span> Available Dates</span> <br />
                  <i className="fa-solid fa-circle" style={{ color: 'orange', fontSize: '10px' }}></i>
                  <span> Pending </span> <br />
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
                    Amount: <span style={{ color: 'red' }}>
                      {formatIndianCurrency(totalPrice, true)}
                    </span>
                  </span>
                  <br />
                </div>
              </div>

              <div className="calendarPendingNoteMain">
                <div className="calendarPendingAsh">
                  <img src='/images/CalenderPendingAsh.svg' className="calendarPendingAsh" alt="pending"></img>
                </div>
                <div className="calendarPendingContents" >
                  <i className="fa-solid fa-circle" style={{ color: 'orange', fontSize: '10px' }}></i>
                </div>
                <div className="calendarPendingContents">
                  indicates a reserved date. If the booking isn't confirmed, the slot will pass to the next request.
                </div>
              </div>

              <div className="calendarBtnsResetConfirm">
                <button
                  className="confirm-button"
                  onClick={confirmDates}
                  disabled={isProcessingBooking || showLoginMessage || showLoginRedirect}
                >
                  {isProcessingBooking ? 'Processing...' : 'Reserve & Book'}
                </button>
                <button
                  className="reset-button"
                  onClick={resetDates}
                  disabled={isProcessingBooking || showLoginMessage || showLoginRedirect}
                >
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
                <span> Booked Dates</span> <br />
                <i className="fa-solid fa-circle dot-available"></i>
                <span> Available Dates</span> <br />
                <i className="fa-solid fa-circle" style={{ color: 'orange', fontSize: '10px' }}></i>
                <span> Pending </span> <br />
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

              <div className="calendarAmountMain">
                <span>
                  Amount: <span style={{ color: 'red' }}>{formatIndianCurrency(totalPrice, true)}</span>
                </span>
                <br />
                <br />
              </div>

              <div className="calendarBtnsResetConfirm">
                <button
                  className="confirm-button"
                  onClick={confirmDates}
                  disabled={isProcessingBooking || showLoginMessage || showLoginRedirect}
                >
                  {isProcessingBooking ? 'Processing...' : 'Reserve & Book'}
                </button>
                <button
                  className="reset-button"
                  onClick={resetDates}
                  disabled={isProcessingBooking || showLoginMessage || showLoginRedirect}
                >
                  Reset Date
                </button>
              </div>

              <div className="calendarPendingNoteMain">
                <div className="calendarPendingContents">
                  <i className="fa-solid fa-circle" style={{ color: 'orange', fontSize: '10px' }}></i>
                </div>
                <div className="calendarPendingContents">
                  indicates a reserved date. If the booking isn't confirmed, the slot will pass to the next request.
                </div>
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
                      onClick={() => {
                        // Only allow clicks on dates that are not outside window or past
                        const dateClass = getDateCustomClass(date);
                        if (dateClass !== "outside-window" && dateClass !== "past") {
                          handleDateClick(date);
                        }
                      }}
                      style={{
                        pointerEvents: getDateCustomClass(date) === "outside-window" || getDateCustomClass(date) === "past" ? "none" : "auto",
                        cursor: getDateCustomClass(date) === "outside-window" || getDateCustomClass(date) === "past" ? "not-allowed" : "pointer"
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

        {/* Error Message Display */}
        {calendarErrorMessage && !showLoginRedirect && (
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

        {/* Login Message Display */}
        {shouldShowLoginMessage && !calendarErrorMessage && (
          <div className="calendar-error-message login-message">
            <div className="calendarAlertIconMain">
              <img src='/images/CalendarAlertImg.svg' className="calendarAlertIcon" alt="alert"></img>
            </div>
            <div className="calendar_error-text">
              Please login to proceed with booking.
            </div>
          </div>
        )}

        {showQueueInfo && !calendarErrorMessage && !shouldShowLoginMessage && (
          <div className="calendar-queue-info" style={{
            background: '#fff3cd',
            border: '1px solid #ffeaa7',
            borderRadius: '5px',
            padding: '10px',
            margin: '10px auto',
            color: '#856404',
            fontSize: '14px'
          }}>
            <i className="fa-solid fa-clock" style={{ marginRight: '8px' }}></i>
            Some selected dates are in queue. You'll be added to the waitlist.
          </div>
        )}
      </div>
    </div>
  );
};

export default Calendar;