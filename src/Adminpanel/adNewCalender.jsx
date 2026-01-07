// import React, { useState, useEffect } from "react";
// import "../components/B20CalenderMain.css";
// // const bookedDates = [new Date(2025, 2, 10), new Date(2025, 2, 12), new Date(2025, 2, 18)];
// import { formatIndianCurrency } from '../components/FORMATED_AMOUNT';

// const Calendar = ({ isSmallScreen, closeCalendar, selectedDates, generateMonth, handleDateClick, resetDates, getDateSelectionClass, goToNextMonth, goToPreviousMonth, bookedDates, currentMonth, confirmedDates, setConfirmedDates, pricePerDay, confirmDates, totalPrice, isPastDate }) => {
//   // CALENDER SECTION 
//   // Inside the map function for each offset
//   const isPastMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0) < new Date();

//   return (
//     <div>
//       <div className="calendar-container" style={{ marginBottom: '15px', width:'100%' }}>
//         <div className="calendar-header">
//           {isSmallScreen ? (
//             <>
//               <div className="nav-button" onClick={goToPreviousMonth}>
//                 <i className="fa-solid fa-arrow-left left-arr"></i>
//               </div>
//               <span className="month-year">
//                 {currentMonth.toLocaleString("default", { month: "long" })} {currentMonth.getFullYear()}
//               </span>
//               <div className="nav-button" onClick={goToNextMonth}>
//                 <i className="fa-solid fa-arrow-right right-arr"></i>
//               </div>
//             </>
//           ) : (
//             <>
//               <div className="left-calender">
//                 <div className="nav-button" onClick={goToPreviousMonth}>
//                   <i className="fa-solid fa-arrow-left left-arr"></i>
//                 </div>
//                 <span className="month-year">
//                   {currentMonth.toLocaleString("default", { month: "long" })} {currentMonth.getFullYear()}
//                 </span>
//               </div>
//               <div className="right-calender">
//                 {(() => {
//                   const nextMonthDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1);
//                   return (
//                     <span className="month-year">
//                       {nextMonthDate.toLocaleString("default", { month: "long" })} {nextMonthDate.getFullYear()}
//                     </span>
//                   );
//                 })()}
//                 <div className="nav-button" onClick={goToNextMonth}>
//                   <i className="fa-solid fa-arrow-right right-arr"></i>
//                 </div>
//               </div>
//             </>
//           )}
//         </div>
//         {/* CALENDER BODY  */}
//         <div className={`calendar-body ${isSmallScreen ? "small-screen-calendar" : "large-screen-calendar"}`}>
//           {isSmallScreen ? (
//             <>
//               {/* One Calendar Grid */}
//               <div className={`calendar-grid ${isPastMonth ? 'past-month' : ''}`}>
//                 <div className="day">Sun</div>
//                 <div className="day">Mon</div>
//                 <div className="day">Tue</div>
//                 <div className="day">Wed</div>
//                 <div className="day">Thu</div>
//                 <div className="day">Fri</div>
//                 <div className="day">Sat</div>
//                 {generateMonth(currentMonth).map((date, index) => {

//                   return (
//                     <div
//                       key={index}
//                       className={

//                         `date 
       
//         ${date ? (bookedDates.some(d =>
//                           d.getUTCFullYear() === date.getUTCFullYear() &&
//                           d.getUTCMonth() === date.getUTCMonth() &&
//                           d.getUTCDate() === date.getUTCDate()
//                         ) ? 'booked' : getDateSelectionClass(date)) : ''}
//         ${isPastDate ? 'past' : ''}
//       `}
//                       onClick={() => !isPastDate && handleDateClick(date)}
//                       style={{ pointerEvents: bookedDates.some((d) => d.getTime() === date?.getTime()) ? "none" : "auto" }}
//                     >
//                       {date ? date.getDate() : ""}
//                     </div>
//                   )
//                 })}
//               </div>

//               {/* Legend Section */}
//               <div className="calendar-legend">

//                 <div className="calendar-legend-responsive">
//                   <div className=" calendar-legend-responsive-content1">
//                     <i className="fa-solid fa-circle dot-booked"></i>
//                     <span> Booked Dates</span> <br />
//                     <i className="fa-solid fa-circle dot-available"></i>
//                     <span> Available Dates</span> <br />

//                   </div>
//                   <div className="calendar-legend-responsive-content2">
//                     <span>
//                       Start Date: <span style={{ color: 'red' }}>
//                         {selectedDates.start
//                           ? `${selectedDates.start.toLocaleString("en-US", { month: "short" })} ${selectedDates.start.getDate()}`
//                           : "--"}
//                       </span>
//                     </span><br />
//                     <span>
//                       End Date: <span style={{ color: 'red' }}>
//                         {selectedDates.end
//                           ? `${selectedDates.end.toLocaleString("en-US", { month: "short" })} ${selectedDates.end.getDate()}`
//                           : "--"}
//                       </span>
//                     </span> <br></br>
//                     {/* Total Amount Calculation */}
//                     <span>
//                       Amount: <span style={{ color: 'red' }}>{formatIndianCurrency(totalPrice, true)}</span>
//                     </span>
//                     <br />
//                   </div>
//                 </div>
//                 <div className="calenderLegendButtons">
//                   {/* <div>   <div className="confirm-button" onClick={confirmDates}>Confirm</div> </div> */}
//                   <div> <div className="reset-button" onClick={resetDates}>Reset Date</div></div></div>
//               </div>
//             </>
//           ) : (
//             // Large Screen Layout: Legend + 2 Months side by side
//             <div className="large-calendar-layout">
//               {/* Legend Section */}
//               <div className="calendar-legend">
//                 <i className="fa-solid fa-circle dot-booked"></i>
//                 <span> Booked Dates</span> <br />
//                 <i className="fa-solid fa-circle dot-available"></i>
//                 <span> Available Dates</span> <br />
//                 <br />
//                 {/* <span> Start Date: {selectedDates.start ? selectedDates.start.getMonthYear() : "--"}</span> <br /> */}
//                 <span>
//                   Start Date: <span style={{ color: 'red' }}>
//                     {selectedDates.start
//                       ? `${selectedDates.start.toLocaleString("en-US", { month: "short" })} ${selectedDates.start.getDate()}`
//                       : "--"}
//                   </span>
//                 </span> <br></br>

//                 <span>
//                   End Date: <span style={{ color: 'red' }}>
//                     {selectedDates.end
//                       ? `${selectedDates.end.toLocaleString("en-US", { month: "short" })} ${selectedDates.end.getDate()}`
//                       : "--"}
//                   </span>
//                 </span> <br></br>

//                 <span>
//                   Amount: <span style={{ color: 'red' }}>{formatIndianCurrency(totalPrice, true)}</span>
//                 </span>
//                 <br />
//                 <br />
//                 {/* <div className="confirm-button" onClick={confirmDates}>Confirm</div> */}
//                 <div className="reset-button" onClick={resetDates}>
//                   Reset Date
//                 </div>
//               </div>

//               {/* Calendar Grid for 2 months */}
//               {[0, 1].map((offset) => {
//                 const monthToRender = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + offset);
//                 return (
//                   <div key={offset} className="calendar-grid">
//                     <div className="day">Sun</div>
//                     <div className="day">Mon</div>
//                     <div className="day">Tue</div>
//                     <div className="day">Wed</div>
//                     <div className="day">Thu</div>
//                     <div className="day">Fri</div>
//                     <div className="day">Sat</div>
//                     {/* <div className="day">Sun</div> */}
//                     {generateMonth(monthToRender).map((date, index) => (
//                       <div
//                         key={index}
//                         className={`date ${date
//                           ? bookedDates.some((d) => d.getTime() === date.getTime())
//                             ? "booked"
//                             : getDateSelectionClass(date)
//                           : ""
//                           }`}
//                         onClick={() => handleDateClick(date)}
//                         style={{ pointerEvents: bookedDates.some((d) => d.getTime() === date?.getTime()) ? "none" : "auto" }}
//                       >
//                         {date ? date.getDate() : ""}
//                       </div>
//                     ))}
//                   </div>
//                 );
//               })}
//             </div>

//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Calendar;

//  ADMIN CALENDAR BOOKED DATES PERFECTLY FETCHED WITH RAC & BOOKED DATES SELECTION
import React, { useState, useEffect } from "react";
import "../components/B20CalenderMain.css";
import { formatIndianCurrency } from '../components/FORMATED_AMOUNT';
import { baseUrl } from './BASE_URL';

const AdminOrderCalendar = ({ 
  productAmount,
  selectedDates, 
  setSelectedDates, 
  generateMonth, 
  resetDates, 
  goToNextMonth, 
  goToPreviousMonth, 
  currentMonth, 
  setCurrentMonth,
  confirmDates, 
  isSmallScreen,
  isPastDate,
  productID
}) => {
  
  // Local state for categorized dates
  const [dateCategories, setDateCategories] = useState({
    cancelled: [],
    pending: [],
    confirmed: []
  });

  // State for 7-day selection
  const [firstClickDate, setFirstClickDate] = useState(null);
  const [calendarErrorMessage, setCalendarErrorMessage] = useState('');
  const [dateSuggestions, setDateSuggestions] = useState([]);
  const [showQueueInfo, setShowQueueInfo] = useState(false);
  
  // Fetch date categories when productID changes
  useEffect(() => {
    const fetchDateCategories = async () => {
      if (!productID || productID.trim() === '') return;
      
      try {
        const cleanedProductId = productID.replace(/^#/, '').trim();
        const response = await fetch(`${baseUrl}/booked-dates/${encodeURIComponent(cleanedProductId)}`);
        const data = await response.json();
        
        if (response.ok) {
          setDateCategories({
            cancelled: data.cancelled || [],
            pending: data.pending || [],
            confirmed: data.confirmed || []
          });
        }
      } catch (error) {
        console.error("Error fetching date categories:", error);
      }
    };

    fetchDateCategories();
  }, [productID]);

  // Function to check if date is confirmed booked (red)
  const isDateBooked = (date) => {
    if (!date || isNaN(date.getTime())) return false;

    try {
      const normalizedDate = new Date(Date.UTC(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
      ));
      const dateString = normalizedDate.toISOString().split('T')[0];

      return dateCategories.confirmed.includes(dateString);
    } catch (error) {
      console.warn("Error in isDateBooked:", error);
      return false;
    }
  };

  // Function to check if date is pending (orange)
  const isDatePending = (date) => {
    if (!date || isNaN(date.getTime())) return false;

    try {
      const normalizedDate = new Date(Date.UTC(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
      ));
      const dateString = normalizedDate.toISOString().split('T')[0];

      return dateCategories.pending.some(p => p.date === dateString);
    } catch (error) {
      console.warn("Error in isDatePending:", error);
      return false;
    }
  };

  // Function to get date class based on category - FIXED ORDER OF CONDITIONS
  const getDateClass = (date) => {
    // Handle null or invalid dates
    if (!date || isNaN(date.getTime())) return "disabled";

    // First check if date is in past
    if (isPastDate && isPastDate(date)) {
      return "past";
    }

    const normalizedDate = new Date(Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    ));
    
    const dateString = normalizedDate.toISOString().split("T")[0];

    // CHECK BOOKING STATUS FIRST (before selection status)
    if (dateCategories.confirmed.includes(dateString)) {
      return "booked"; // Red - confirmed/booked (should NOT be selectable)
    } else if (dateCategories.pending.some(p => p.date === dateString)) {
      // Pending dates can be selected, so we check selection status after
    }

    // Then check selection status for non-booked dates
    const utcDate = new Date(Date.UTC(
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

    // Check selection status
    if (startUTC && utcDate.getTime() === startUTC.getTime()) return "selected-start";
    if (endUTC && utcDate.getTime() === endUTC.getTime()) return "selected-end";
    if (startUTC && endUTC && utcDate > startUTC && utcDate < endUTC) {
      return "selected-range";
    }

    // Then return pending or available status
    if (dateCategories.pending.some(p => p.date === dateString)) {
      return "pending"; // Orange - pending confirmation
    } else if (dateCategories.cancelled.includes(dateString)) {
      return "available"; // Green - available (cancelled)
    }

    return "available"; // Default to available
  };

  // Calculate days difference
  const calculateDaysDifference = (start, end) => {
    if (!start || !end) return 0;
    const timeDiff = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(timeDiff / (1000 * 60 * 60 * 24)) + 1;
  };

  // Get available days in range (not booked)
  const getAvailableDaysInRange = (start, end) => {
    if (!start || !end || isNaN(start.getTime()) || isNaN(end.getTime())) {
      return [];
    }
    const days = [];
    const current = new Date(start);
    const normalizedEnd = new Date(end);
    while (current <= normalizedEnd) {
      if (!isDateBooked(current) && (!isPastDate || !isPastDate(current))) {
        days.push(new Date(current));
      }
      current.setDate(current.getDate() + 1);
    }
    return days;
  };

  // Get pending days in range
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

  // Get conflict blocks in a date range
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
        
        // Extend block while consecutive dates are booked
        while (current <= normalizedEnd && isDateBooked(current)) {
          blockEnd = new Date(current);
          current.setDate(current.getDate() + 1);
        }
        
        blocks.push({
          start: blockStart,
          end: blockEnd,
          days: Math.ceil((blockEnd - blockStart) / (1000 * 60 * 60 * 24)) + 1
        });
      } else {
        current.setDate(current.getDate() + 1);
      }
    }
    
    return blocks;
  };

  // Find a range with 7 available days from a start date
  const findRangeWith7AvailableDays = (startDate) => {
    if (!startDate || isNaN(startDate.getTime())) return null;
    
    let availableDays = 0;
    let current = new Date(startDate);
    let endDate = new Date(startDate);
    let maxSearchDays = 60; // Search up to 60 days ahead
    
    for (let i = 0; i < maxSearchDays; i++) {
      if (!isDateBooked(current) && (!isPastDate || !isPastDate(current))) {
        availableDays++;
        if (availableDays === 7) {
          endDate = new Date(current);
          break;
        }
      }
      current.setDate(current.getDate() + 1);
    }
    
    return availableDays === 7 ? { start: startDate, end: endDate } : null;
  };

  // Fetch date suggestions
  const fetchDateSuggestions = async (startDate) => {
    try {
      if (!productID || !startDate || isNaN(startDate.getTime())) return [];
      const cleanedProductId = productID.replace(/^#/, '').trim();
      const response = await fetch(
        `${baseUrl}/date-suggestions/${cleanedProductId}?requiredDays=7&startFrom=${startDate.toISOString()}`
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

  // Enhanced handleDateClick with 7-day selection - WITH NULL HANDLING
  const handleDateClick = async (date) => {
    if (!date || isNaN(date.getTime())) {
      console.warn("Invalid date clicked:", date);
      return;
    }

    try {
      const normalizedDate = new Date(Date.UTC(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
      ));

      // Check if date is in the past
      if (isPastDate && isPastDate(normalizedDate)) {
        setCalendarErrorMessage("Cannot select past dates.");
        return;
      }

      // Check if date is confirmed booked (red - blocked) - DO NOT ALLOW SELECTION
      if (isDateBooked(normalizedDate)) {
        const suggestions = await fetchDateSuggestions(normalizedDate);
        let message = `❌ This date is already confirmed booked (red).\n`;
        
        if (suggestions.length > 0) {
          message += `\nSuggested alternative available periods:\n`;
          suggestions.forEach((suggestion, index) => {
            const start = new Date(suggestion.startDate);
            const end = new Date(suggestion.endDate);
            message += `${index + 1}. ${start.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} - ${end.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}\n`;
          });
        }
        
        setCalendarErrorMessage(message);
        return;
      }

      // Check if date is pending (orange - can be booked but in queue)
      const isPending = isDatePending(normalizedDate);
      if (isPending) {
        setShowQueueInfo(true);
        const queueMessage = "⏳ This date is in queue (pending confirmation).\n" +
                           "You can still book it, but it's pending.\n" +
                           "Please check with the client before proceeding.";
        setCalendarErrorMessage(queueMessage);
      } else {
        setShowQueueInfo(false);
        setCalendarErrorMessage("");
      }

      // Intelligent date selection for 7 days
      if (!selectedDates.start && !selectedDates.end) {
        await intelligentDateSelection(normalizedDate);
        return;
      }

      if (selectedDates.start && selectedDates.end) {
        await handleContinuousSelection(normalizedDate);
        return;
      }
    } catch (error) {
      console.error("Error in handleDateClick:", error);
      setCalendarErrorMessage("An error occurred while selecting the date. Please try again.");
    }
  };

  // Intelligent date selection with conflict handling
  const intelligentDateSelection = async (startDate) => {
    try {
      // Find a range with 7 available days starting from the clicked date
      const range = findRangeWith7AvailableDays(startDate);
      
      if (!range) {
        const suggestions = await fetchDateSuggestions(startDate);
        let message = `Cannot find 7 continuous available days starting from ${startDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}.\n`;
        
        if (suggestions.length > 0) {
          message += `\nTry these available periods instead:\n`;
          suggestions.forEach((suggestion, index) => {
            const start = new Date(suggestion.startDate);
            const end = new Date(suggestion.endDate);
            message += `${index + 1}. ${start.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} - ${end.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}\n`;
          });
        } else {
          message += "Please select a different date.";
        }
        
        setCalendarErrorMessage(message);
        return;
      }

      const { start, end } = range;
      
      // Get conflict blocks in the selected range
      const conflictBlocks = getConflictBlocks(start, end);
      
      // Calculate pending dates in selection
      const pendingCount = getPendingDaysInRange(start, end);
      const totalCalendarDays = calculateDaysDifference(start, end);
      
      if (conflictBlocks.length === 0) {
        // No conflicts - all good
        setSelectedDates({ start, end });
        setCalendarErrorMessage(
          `✅ ${totalCalendarDays} days selected (all available).\n` +
          (pendingCount > 0 ? `⏳ ${pendingCount} date(s) in queue.\n` : "") +
          `Click "Confirm Dates" to proceed.`
        );
        if (pendingCount > 0) setShowQueueInfo(true);
        
      } else if (conflictBlocks.length === 1) {
        // Single conflict block - allow selection with warning
        const conflictBlock = conflictBlocks[0];
        const conflictStart = conflictBlock.start;
        const conflictEnd = conflictBlock.end;
        
        let conflictText;
        if (conflictStart.getTime() === conflictEnd.getTime()) {
          conflictText = conflictStart.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
        } else {
          conflictText = `${conflictStart.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} - ${conflictEnd.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`;
        }
        
        const availableDaysCount = getAvailableDaysInRange(start, end).length;
        
        setSelectedDates({ start, end });
        setCalendarErrorMessage(
          `⚠️ Selected range contains ${conflictBlock.days} booked day(s) (${conflictText}).\n` +
          `✅ ${availableDaysCount} days are available for booking.\n` +
          (pendingCount > 0 ? `⏳ ${pendingCount} date(s) in queue.\n` : "") +
          `Price will be calculated for ${availableDaysCount} available days only.`
        );
        if (pendingCount > 0) setShowQueueInfo(true);
        
      } else {
        // Multiple conflict blocks - suggest alternatives
        const suggestions = await fetchDateSuggestions(startDate);
        let message = `❌ Selected range has ${conflictBlocks.length} separate booked periods.\n` +
                     `Please select a continuous available period.\n`;
        
        if (suggestions.length > 0) {
          message += `\nSuggested alternative available periods:\n`;
          suggestions.forEach((suggestion, index) => {
            const suggestionStart = new Date(suggestion.startDate);
            const suggestionEnd = new Date(suggestion.endDate);
            message += `${index + 1}. ${suggestionStart.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} - ${suggestionEnd.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}\n`;
          });
        }
        
        setCalendarErrorMessage(message);
        // Don't set selected dates for multiple conflicts
      }
    } catch (error) {
      console.error("Error in intelligent date selection:", error);
      setCalendarErrorMessage("Error checking date availability. Please try again.");
    }
  };

  // Handle continuous selection with conflict handling
  const handleContinuousSelection = async (clickedDate) => {
    if (!clickedDate || isNaN(clickedDate.getTime())) return;
    
    const currentStart = selectedDates.start;
    const currentEnd = selectedDates.end;

    let newStart, newEnd;

    if (clickedDate < currentStart) {
      newStart = clickedDate;
      newEnd = currentEnd;
    } else if (clickedDate > currentEnd) {
      newStart = currentStart;
      newEnd = clickedDate;
    } else {
      newStart = currentStart;
      newEnd = clickedDate;
    }

    // Ensure minimum 7 calendar days
    let calendarDays = calculateDaysDifference(newStart, newEnd);
    if (calendarDays < 7) {
      newEnd = new Date(newStart);
      newEnd.setDate(newEnd.getDate() + 6);
    }

    // Get conflict blocks in the new range
    const conflictBlocks = getConflictBlocks(newStart, newEnd);
    
    // Calculate pending dates in selection
    const pendingCount = getPendingDaysInRange(newStart, newEnd);
    const totalCalendarDays = calculateDaysDifference(newStart, newEnd);
    const availableDaysCount = getAvailableDaysInRange(newStart, newEnd).length;
    
    if (conflictBlocks.length === 0) {
      // No conflicts
      setSelectedDates({ start: newStart, end: newEnd });
      setCalendarErrorMessage(
        `✅ ${totalCalendarDays} days selected (all available).\n` +
        (pendingCount > 0 ? `⏳ ${pendingCount} date(s) in queue.\n` : "")
      );
      if (pendingCount > 0) setShowQueueInfo(true);
      
    } else if (conflictBlocks.length === 1) {
      // Single conflict block - allow with warning
      const conflictBlock = conflictBlocks[0];
      const conflictStart = conflictBlock.start;
      const conflictEnd = conflictBlock.end;
      
      let conflictText;
      if (conflictStart.getTime() === conflictEnd.getTime()) {
        conflictText = conflictStart.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
      } else {
        conflictText = `${conflictStart.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} - ${conflictEnd.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`;
      }
      
      setSelectedDates({ start: newStart, end: newEnd });
      setCalendarErrorMessage(
        `⚠️ Selected range contains ${conflictBlock.days} booked day(s) (${conflictText}).\n` +
        `✅ ${availableDaysCount} days are available for booking.\n` +
        (pendingCount > 0 ? `⏳ ${pendingCount} date(s) in queue.\n` : "") +
        `Price will be calculated for ${availableDaysCount} available days only.`
      );
      if (pendingCount > 0) setShowQueueInfo(true);
      
    } else {
      // Multiple conflict blocks - suggest alternatives
      const suggestions = await fetchDateSuggestions(newStart);
      let message = `❌ Selected range has ${conflictBlocks.length} separate booked periods.\n`;
      
      // List the conflict blocks
      message += "Booked periods in your selection:\n";
      conflictBlocks.slice(0, 3).forEach((block, index) => {
        const start = block.start;
        const end = block.end;
        if (start.getTime() === end.getTime()) {
          message += `• ${start.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}\n`;
        } else {
          message += `• ${start.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} - ${end.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}\n`;
        }
      });
      
      if (conflictBlocks.length > 3) {
        message += `• ...and ${conflictBlocks.length - 3} more\n`;
      }
      
      if (suggestions.length > 0) {
        message += `\nSuggested alternative available periods:\n`;
        suggestions.forEach((suggestion, index) => {
          const start = new Date(suggestion.startDate);
          const end = new Date(suggestion.endDate);
          message += `${index + 1}. ${start.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} - ${end.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}\n`;
        });
      }
      
      setCalendarErrorMessage(message);
      // Don't update selected dates for multiple conflicts
    }
  };

  // Calculate total price
  const availableDays = selectedDates.start && selectedDates.end ? getAvailableDaysInRange(selectedDates.start, selectedDates.end) : [];
  const totalDays = availableDays.length;
  const totalPrice = totalDays * (productAmount || 0);

  // Enhanced confirm dates function
  const enhancedConfirmDates = () => {
    if (!selectedDates.start || !selectedDates.end) {
      setCalendarErrorMessage("Please select start and end dates.");
      return;
    }

    const availableDays = getAvailableDaysInRange(selectedDates.start, selectedDates.end);
    const totalCalendarDays = calculateDaysDifference(selectedDates.start, selectedDates.end);
    const bookedCount = totalCalendarDays - availableDays.length;
    const pendingCount = getPendingDaysInRange(selectedDates.start, selectedDates.end);

    if (availableDays.length < 7) {
      setCalendarErrorMessage(
        `Minimum 7 available days required.\n` +
        `Selected range has ${totalCalendarDays} days with only ${availableDays.length} available.`
      );
      return;
    }

    // Get conflict blocks
    const conflictBlocks = getConflictBlocks(selectedDates.start, selectedDates.end);
    
    if (conflictBlocks.length >= 2) {
      setCalendarErrorMessage(
        `❌ Selected range has ${conflictBlocks.length} separate booked periods.\n` +
        `Please select a continuous available period.`
      );
      return;
    }

    let message = `✅ Dates confirmed!\n`;
    if (bookedCount > 0) {
      message += `⚠️ ${bookedCount} booked day${bookedCount > 1 ? 's' : ''} excluded from pricing.\n`;
    }
    if (pendingCount > 0) {
      message += `⏳ ${pendingCount} date${pendingCount > 1 ? 's' : ''} in queue.\n`;
    }
    message += `💰 Price calculated for ${availableDays.length} available days.`;

    setCalendarErrorMessage(message);
    
    // Call the original confirmDates function if provided
    if (confirmDates) {
      confirmDates();
    }
  };

  // Enhanced reset dates function
  const enhancedResetDates = () => {
    setSelectedDates({ start: null, end: null });
    setCalendarErrorMessage("");
    setShowQueueInfo(false);
    setDateSuggestions([]);
    
    // Call the original resetDates function if provided
    if (resetDates) {
      resetDates();
    }
  };

  // Calculate display info
  const calculateDisplayInfo = () => {
    if (!selectedDates.start || !selectedDates.end) {
      return { calendarDays: 0, availableDays: 0, pendingInRange: 0 };
    }
    
    const calendarDays = calculateDaysDifference(selectedDates.start, selectedDates.end);
    const availableDays = getAvailableDaysInRange(selectedDates.start, selectedDates.end).length;
    const pendingInRange = getPendingDaysInRange(selectedDates.start, selectedDates.end);
    
    return { calendarDays, availableDays, pendingInRange };
  };

  const { calendarDays, availableDays: availableDaysCount, pendingInRange } = calculateDisplayInfo();

  // Render a date cell with null handling
  const renderDateCell = (date, index) => {
    if (!date) {
      return <div key={index} className="date disabled"></div>;
    }

    const dateClass = getDateClass(date);
    const isBooked = isDateBooked(date);
    const isPast = isPastDate && isPastDate(date);
    const isPending = isDatePending(date);

    return (
      <div
        key={index}
        className={`date ${dateClass}`}
        onClick={() => handleDateClick(date)}
        style={{ 
          pointerEvents: isBooked || isPast ? "none" : "auto",
          cursor: isBooked || isPast ? "not-allowed" : "pointer"
        }}
      >
        {date.getDate()}
        {isPending && <span className="queue-indicator-dot" title="In queue"></span>}
      </div>
    );
  };

  // Function to handle month navigation - PREVENT FORM SUBMISSION
  const handlePreviousMonth = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (goToPreviousMonth) goToPreviousMonth();
  };

  const handleNextMonth = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (goToNextMonth) goToNextMonth();
  };

  return (
    <div className="calendar-container" style={{ marginBottom: '15px', width: '100%' }}>
      <div className="calendar-header">
        {isSmallScreen ? (
          <>
            <button 
              type="button" 
              className="nav-button" 
              onClick={handlePreviousMonth}
            >
              <i className="fa-solid fa-arrow-left left-arr"></i>
            </button>
            <span className="month-year">
              {currentMonth.toLocaleString("default", { month: "long" })} {currentMonth.getFullYear()}
            </span>
            <button 
              type="button" 
              className="nav-button" 
              onClick={handleNextMonth}
            >
              <i className="fa-solid fa-arrow-right right-arr"></i>
            </button>
          </>
        ) : (
          <>
            <div className="left-calender">
              <button 
                type="button" 
                className="nav-button" 
                onClick={handlePreviousMonth}
              >
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
              <button 
                type="button" 
                className="nav-button" 
                onClick={handleNextMonth}
              >
                <i className="fa-solid fa-arrow-right right-arr"></i>
              </button>
            </div>
          </>
        )}
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
              {generateMonth(currentMonth).map((date, index) => renderDateCell(date, index))}
            </div>

            <div className="calendar-legend">
              <div className="calendar-legend-responsive">
                <div className="calendar-legend-responsive-content1">
                  <i className="fa-solid fa-circle dot-booked"></i>
                  <span> Confirmed Booked Dates</span> <br />
                  <i className="fa-solid fa-circle dot-pending"></i>
                  <span> Pending Reservations (Queue)</span> <br />
                  <i className="fa-solid fa-circle dot-available"></i>
                  <span> Available Dates</span> <br />
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
                  </span> <br></br>
                  <span>
                    Calendar Days: <span style={{ color: 'blue' }}>
                      {calendarDays}
                    </span>
                  </span><br />
                  <span>
                    Available Days: <span style={{ color: 'green' }}>
                      {availableDaysCount}
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
                      {formatIndianCurrency(totalPrice || 0, true)}
                    </span>
                  </span>
                  <br />
                  {productAmount > 0 && (
                    <small style={{ fontSize: '10px', color: '#666' }}>
                      ({availableDaysCount} days × ₹{productAmount.toLocaleString()})
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
                  indicates a reserved date. If the booking isn't confirmed, the slot will pass to the next request.
                </div>
              </div>

              <div className="calendarBtnsResetConfirm">
                <button 
                  type="button"
                  className="confirm-button" 
                  onClick={enhancedConfirmDates}
                >
                  Confirm Dates
                </button>
                <button 
                  type="button"
                  className="reset-button" 
                  onClick={enhancedResetDates}
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
                <span> Confirmed Booked Dates</span> <br />
                <i className="fa-solid fa-circle dot-pending"></i>
                <span> Pending Reservations (Queue)</span> <br />
                <i className="fa-solid fa-circle dot-available"></i>
                <span> Available Dates</span> <br />
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
                    {availableDaysCount}
                  </span>
                </span><br />
                {pendingInRange > 0 && (
                  <span>
                    In Queue: <span style={{ color: 'orange', fontWeight: 'bold' }}>
                      {pendingInRange} date{pendingInRange > 1 ? 's' : ''}
                    </span>
                  </span>
                )}
                {productAmount > 0 && (
                  <small style={{ fontSize: '10px', color: '#666' }}>
                    ({availableDaysCount} available days × ₹{productAmount.toLocaleString()}/day)
                  </small>
                )}
              </div>
              
              <div className="calendarAmountMain">
                <span>
                  Amount: <span style={{ color: 'red' }}>{formatIndianCurrency(totalPrice || 0, true)}</span>
                </span>
                <br />
                <br />
              </div>

              <div className="calendarBtnsResetConfirm">
                <button 
                  type="button"
                  className="confirm-button" 
                  onClick={enhancedConfirmDates}
                >
                  Confirm Dates
                </button>
                <button 
                  type="button"
                  className="reset-button" 
                  onClick={enhancedResetDates}
                >
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
                  {generateMonth(monthToRender).map((date, index) => renderDateCell(date, index))}
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
            Some selected dates are in queue. Please check with the client before proceeding.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrderCalendar;