// AdminOrderCalendar.jsx - PEERFECT CODE WITH PAST DATE HANDLING and MIN_BOOKING_DAY  counts dynamically assingned
import React, { useState, useEffect } from "react";
import "../components/B20CalenderMain.css";
import { formatIndianCurrency } from '../components/FORMATED_AMOUNT';
import { baseUrl } from './BASE_URL';
import { DATE_CONFIG_ADMIN } from './BASE_URL'; // Import DATE_CONFIG_ADMIN

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
  
  // Get date configuration from DATE_CONFIG_ADMIN - Only need MIN_BOOKING_DAYS_ForAdmin
  const MIN_BOOKING_DAYS_ForAdmin = DATE_CONFIG_ADMIN.MIN_BOOKING_DAYS_ForAdmin;

  console.log('Admin Calendar Config:', { 
    MIN_BOOKING_DAYS_ForAdmin
  });

  // Local state for categorized dates
  const [dateCategories, setDateCategories] = useState({
    cancelled: [],
    pending: [],
    confirmed: []
  });

  // State for calendar messages
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

  // Function to check if date is in the past (for admin)
  const isDatePast = (date) => {
    if (!date || isNaN(date.getTime())) return true;
    
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    
    const normalizedDate = new Date(Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    ));
    
    return normalizedDate < today;
  };

  // Function to get date class based on category
  const getDateClass = (date) => {
    // Handle null or invalid dates
    if (!date || isNaN(date.getTime())) return "disabled";

    // Check if date is in past FIRST
    if (isDatePast(date)) {
      return "past";
    }

    const normalizedDate = new Date(Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    ));
    
    const dateString = normalizedDate.toISOString().split("T")[0];

    // CHECK BOOKING STATUS
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
    }

    return "available"; // Default to available
  };

  // Calculate days difference
  const calculateDaysDifference = (start, end) => {
    if (!start || !end) return 0;
    const timeDiff = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(timeDiff / (1000 * 60 * 60 * 24)) + 1;
  };

  // Get available days in range (not booked and not past)
  const getAvailableDaysInRange = (start, end) => {
    if (!start || !end || isNaN(start.getTime()) || isNaN(end.getTime())) {
      return [];
    }
    const days = [];
    const current = new Date(start);
    const normalizedEnd = new Date(end);
    while (current <= normalizedEnd) {
      if (!isDateBooked(current) && !isDatePast(current)) {
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

  // Find a range with minimum available days from a start date
  const findRangeWithMinAvailableDays = (startDate) => {
    if (!startDate || isNaN(startDate.getTime())) return null;
    
    let availableDays = 0;
    let current = new Date(startDate);
    let endDate = new Date(startDate);
    let maxSearchDays = 365; // Search up to 1 year ahead
    
    for (let i = 0; i < maxSearchDays; i++) {
      if (!isDateBooked(current) && !isDatePast(current)) {
        availableDays++;
        if (availableDays === MIN_BOOKING_DAYS_ForAdmin) {
          endDate = new Date(current);
          break;
        }
      }
      current.setDate(current.getDate() + 1);
    }
    
    return availableDays === MIN_BOOKING_DAYS_ForAdmin ? { start: startDate, end: endDate } : null;
  };

  // Fetch date suggestions
  const fetchDateSuggestions = async (startDate) => {
    try {
      if (!productID || !startDate || isNaN(startDate.getTime())) return [];
      const cleanedProductId = productID.replace(/^#/, '').trim();
      const response = await fetch(
        `${baseUrl}/date-suggestions/${cleanedProductId}?requiredDays=${MIN_BOOKING_DAYS_ForAdmin}&startFrom=${startDate.toISOString()}`
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

  // Auto-select minimum days when start date is clicked
  const autoSelectMinimumDays = (startDate) => {
    // Calculate end date
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + (MIN_BOOKING_DAYS_ForAdmin - 1));
    
    // Check for conflicts
    const conflictBlocks = getConflictBlocks(startDate, endDate);
    const availableDays = getAvailableDaysInRange(startDate, endDate).length;
    
    if (availableDays >= MIN_BOOKING_DAYS_ForAdmin) {
      // Set the selection
      setSelectedDates({ start: startDate, end: endDate });
      
      if (conflictBlocks.length === 0) {
        setCalendarErrorMessage(
          `✅ Auto-selected ${MIN_BOOKING_DAYS_ForAdmin} days: ${startDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} - ${endDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`
        );
      } else {
        setCalendarErrorMessage(
          `⚠️ Auto-selected ${MIN_BOOKING_DAYS_ForAdmin} days with ${conflictBlocks.length} conflict block(s).\nYou can adjust the end date.`
        );
      }
    } else {
      // Try to find alternative range
      const range = findRangeWithMinAvailableDays(startDate);
      if (range) {
        setSelectedDates({ start: range.start, end: range.end });
        setCalendarErrorMessage(
          `✅ Found available ${MIN_BOOKING_DAYS_ForAdmin} days: ${range.start.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} - ${range.end.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`
        );
      } else {
        setCalendarErrorMessage(
          `❌ Cannot find ${MIN_BOOKING_DAYS_ForAdmin} continuous available days starting from ${startDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}.`
        );
      }
    }
  };

  // Enhanced handleDateClick with MIN_BOOKING_DAYS_ForAdmin selection and past date handling
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

      // // Check if date is in the past
      // if (isDatePast(normalizedDate)) {
      //   setCalendarErrorMessage("Cannot select past dates.");
      //   return;
      // }


       // Check if date is in the past - Show professional error message
        if (isDatePast(normalizedDate)) {
            const today = new Date();
            today.setUTCHours(0, 0, 0, 0);
            
            const pastDays = Math.ceil((today - normalizedDate) / (1000 * 60 * 60 * 24));
            
            setCalendarErrorMessage(
                `❌ Cannot select past dates\n` +
                `📅 Selected: ${normalizedDate.toLocaleDateString('en-IN', { 
                    weekday: 'short', 
                    day: 'numeric', 
                    month: 'short', 
                    year: 'numeric' 
                })}\n` +
                `⏰ Today: ${today.toLocaleDateString('en-IN', { 
                    weekday: 'short', 
                    day: 'numeric', 
                    month: 'short', 
                    year: 'numeric' 
                })}\n` +
                `⌛ This date was ${pastDays} day${pastDays > 1 ? 's' : ''} ago`
            );
            
            // Clear message after 5 seconds
            setTimeout(() => {
                setCalendarErrorMessage("");
            }, 5000);
            return;
        }


      // // Check if date is confirmed booked (red - blocked)
      // if (isDateBooked(normalizedDate)) {
      //   const suggestions = await fetchDateSuggestions(normalizedDate);
      //   let message = `❌ This date is already confirmed booked (red).\n`;
        
      //   if (suggestions.length > 0) {
      //     message += `\nSuggested alternative available periods:\n`;
      //     suggestions.forEach((suggestion, index) => {
      //       const start = new Date(suggestion.startDate);
      //       const end = new Date(suggestion.endDate);
      //       message += `${index + 1}. ${start.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} - ${end.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}\n`;
      //     });
      //   }
        
      //   setCalendarErrorMessage(message);
      //   return;
      // }

       // Check if date is confirmed booked (red - blocked)
        if (isDateBooked(normalizedDate)) {
            const suggestions = await fetchDateSuggestions(normalizedDate);
            
            let message = `❌ Date already confirmed booked\n`;
            message += `📅 ${normalizedDate.toLocaleDateString('en-IN', { 
                weekday: 'short', 
                day: 'numeric', 
                month: 'short' 
            })}\n`;
            message += `🔴 Red dates are not available for selection\n`;
            
            if (suggestions.length > 0) {
                message += `\n✅ Alternative available periods:\n`;
                suggestions.slice(0, 3).forEach((suggestion, index) => {
                    const start = new Date(suggestion.startDate);
                    const end = new Date(suggestion.endDate);
                    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
                    
                    message += `${index + 1}. ${start.toLocaleDateString('en-IN', { 
                        day: 'numeric', 
                        month: 'short' 
                    })} - ${end.toLocaleDateString('en-IN', { 
                        day: 'numeric', 
                        month: 'short' 
                    })} (${days} days)\n`;
                });
            }
            
            setCalendarErrorMessage(message);
            
            // Clear message after 6 seconds
            setTimeout(() => {
                setCalendarErrorMessage("");
            }, 6000);
            return;
        }

      // // Check if date is pending (orange - can be booked but in queue)
      // const isPending = isDatePending(normalizedDate);
      // if (isPending) {
      //   setShowQueueInfo(true);
      //   const queueMessage = "⏳ This date is in queue (pending confirmation).\n" +
      //                      "You can still book it, but it's pending.\n" +
      //                      "Please check with the client before proceeding.";
      //   setCalendarErrorMessage(queueMessage);
      // } else {
      //   setShowQueueInfo(false);
      //   setCalendarErrorMessage("");
      // }


        // Check if date is pending (orange - can be booked but in queue)
        const isPending = isDatePending(normalizedDate);
        if (isPending) {
            setShowQueueInfo(true);
            const queueMessage = `⏳ Date in queue\n` +
                               `📅 ${normalizedDate.toLocaleDateString('en-IN', { 
                                   weekday: 'short', 
                                   day: 'numeric', 
                                   month: 'short' 
                               })}\n` +
                               `🟠 Orange dates are pending confirmation\n` +
                               `✅ You can still book this date\n` +
                               `📋 Position in queue will be assigned after booking`;
            setCalendarErrorMessage(queueMessage);
            
            // Clear message after 4 seconds
            setTimeout(() => {
                setCalendarErrorMessage("");
            }, 4000);
        } else {
            setShowQueueInfo(false);
            setCalendarErrorMessage("");
        } 

        

      // Handle date selection
      if (!selectedDates.start) {
        // First click - set start date and auto-select minimum days
        setSelectedDates({ start: normalizedDate, end: null });
        autoSelectMinimumDays(normalizedDate);
        return;
      }

      if (selectedDates.start && !selectedDates.end) {
        // This shouldn't happen as we auto-select end date, but handle just in case
        autoSelectMinimumDays(selectedDates.start);
        return;
      }

      if (selectedDates.start && selectedDates.end) {
        // Check if clicking on a date that's before the start date
        if (normalizedDate < selectedDates.start) {
          // Clicked date is before start - set as new start and auto-select
          // First check if new start date is valid
          if (isDatePast(normalizedDate)) {
            setCalendarErrorMessage("Cannot select past dates as start date.");
            return;
          }
          if (isDateBooked(normalizedDate)) {
            setCalendarErrorMessage("Cannot select booked dates as start date.");
            return;
          }
          
          setSelectedDates({ start: normalizedDate, end: null });
          autoSelectMinimumDays(normalizedDate);
        } else {
          // Clicked date is after start - adjust end date
          // First check if end date is valid
          if (isDatePast(normalizedDate)) {
            setCalendarErrorMessage("Cannot select past dates as end date.");
            return;
          }
          if (isDateBooked(normalizedDate)) {
            setCalendarErrorMessage("Cannot select booked dates as end date.");
            return;
          }
          
          const daysSelected = calculateDaysDifference(selectedDates.start, normalizedDate);
          
          if (daysSelected < MIN_BOOKING_DAYS_ForAdmin) {
            // Auto-extend to minimum days
            const newEndDate = new Date(selectedDates.start);
            newEndDate.setDate(selectedDates.start.getDate() + MIN_BOOKING_DAYS_ForAdmin - 1);
            
            // Check if new end date is valid
            if (isDatePast(newEndDate)) {
              setCalendarErrorMessage(`Cannot extend to ${MIN_BOOKING_DAYS_ForAdmin} days as it includes past dates.`);
              return;
            }
            
            if (isDateBooked(newEndDate)) {
              // Find next available range
              const range = findRangeWithMinAvailableDays(selectedDates.start);
              if (range) {
                setSelectedDates({ start: range.start, end: range.end });
                setCalendarErrorMessage(`Minimum ${MIN_BOOKING_DAYS_ForAdmin} days required. Found available range: ${range.start.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} - ${range.end.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`);
              } else {
                setCalendarErrorMessage(`Cannot extend to ${MIN_BOOKING_DAYS_ForAdmin} days as there are conflicts. Please select a different start date.`);
              }
            } else {
              setSelectedDates({ start: selectedDates.start, end: newEndDate });
              setCalendarErrorMessage(`Minimum ${MIN_BOOKING_DAYS_ForAdmin} days required. Auto-extended to ${newEndDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`);
            }
          } else {
            // Valid selection - check for conflicts in new range
            const conflictBlocks = getConflictBlocks(selectedDates.start, normalizedDate);
            if (conflictBlocks.length > 0) {
              setCalendarErrorMessage(`⚠️ Selected range has ${conflictBlocks.length} conflict block(s).`);
            }
            setSelectedDates({ start: selectedDates.start, end: normalizedDate });
          }
        }
        return;
      }
    } catch (error) {
      console.error("Error in handleDateClick:", error);
      setCalendarErrorMessage("An error occurred while selecting the date. Please try again.");
    }
  };

  // Calculate total price
  const availableDays = selectedDates.start && selectedDates.end ? getAvailableDaysInRange(selectedDates.start, selectedDates.end) : [];
  const totalDays = availableDays.length;
  const totalPrice = totalDays * (productAmount || 0);

  // Validate minimum days selection
  const validateMinimumDays = (start, end) => {
    if (!start || !end) {
      return { 
        valid: false, 
        days: 0, 
        availableDays: 0, 
        message: "Please select both start and end dates." 
      };
    }
    
    // Check if dates are in past
    if (isDatePast(start)) {
      return {
        valid: false,
        days: 0,
        availableDays: 0,
        message: "Start date cannot be in the past."
      };
    }
    
    if (isDatePast(end)) {
      return {
        valid: false,
        days: 0,
        availableDays: 0,
        message: "End date cannot be in the past."
      };
    }
    
    const days = calculateDaysDifference(start, end);
    const availableDays = getAvailableDaysInRange(start, end).length;
    
    if (availableDays < MIN_BOOKING_DAYS_ForAdmin) {
      return {
        valid: false,
        days: days,
        availableDays: availableDays,
        message: `Minimum ${MIN_BOOKING_DAYS_ForAdmin} available days required. Selected range has ${days} calendar days with only ${availableDays} available days.`
      };
    }
    
    // Check for conflict blocks
    const conflictBlocks = getConflictBlocks(start, end);
    const bookedCount = conflictBlocks.reduce((total, block) => total + block.days, 0);
    
    return {
      valid: true,
      days: days,
      availableDays: availableDays,
      bookedCount: bookedCount,
      conflictBlocks: conflictBlocks.length,
      message: `✅ ${days} days selected with ${availableDays} available days${bookedCount > 0 ? ` (${bookedCount} booked days excluded)` : ''}.`
    };
  };

  // Enhanced confirm dates function
  const enhancedConfirmDates = () => {
    if (!selectedDates.start || !selectedDates.end) {
      setCalendarErrorMessage("Please select start and end dates.");
      return;
    }

    // Check for past dates
    if (isDatePast(selectedDates.start)) {
      setCalendarErrorMessage("Start date cannot be in the past.");
      return;
    }
    
    if (isDatePast(selectedDates.end)) {
      setCalendarErrorMessage("End date cannot be in the past.");
      return;
    }

    const validation = validateMinimumDays(selectedDates.start, selectedDates.end);
    
    if (!validation.valid) {
      setCalendarErrorMessage(validation.message);
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

    const pendingCount = getPendingDaysInRange(selectedDates.start, selectedDates.end);
    let message = `✅ Dates confirmed!\n`;
    message += `📅 ${validation.days} calendar days selected\n`;
    message += `✅ ${validation.availableDays} available days for booking\n`;
    
    if (conflictBlocks.length > 0) {
      const conflictBlock = conflictBlocks[0];
      message += `⚠️ ${conflictBlock.days} booked day(s) excluded from pricing.\n`;
    }
    
    if (pendingCount > 0) {
      message += `⏳ ${pendingCount} date${pendingCount > 1 ? 's' : ''} in queue.\n`;
    }
    
    message += `💰 Price calculated for ${validation.availableDays} available days.`;

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

  // // Render a date cell with null handling and past date checking
  // const renderDateCell = (date, index) => {
  //   if (!date) {
  //     return <div key={index} className="date disabled"></div>;
  //   }

  //   const dateClass = getDateClass(date);
  //   const isBooked = isDateBooked(date);
  //   const isPast = isDatePast(date);
  //   const isPending = isDatePending(date);

  //   return (
  //     <div
  //       key={index}
  //       className={`date ${dateClass}`}
  //       onClick={() => handleDateClick(date)}
  //       style={{ 
  //         pointerEvents: isBooked || isPast ? "none" : "auto",
  //         cursor: isBooked || isPast ? "not-allowed" : "pointer"
  //       }}
  //     >
  //       {date.getDate()}
  //       {isPending && <span className="queue-indicator-dot" title="In queue"></span>}
  //     </div>
  //   );
  // };


  const renderDateCell = (date, index) => {
    if (!date) {
        return <div key={index} className="date disabled"></div>;
    }

    const dateClass = getDateClass(date);
    const isBooked = isDateBooked(date);
    const isPast = isDatePast(date);
    const isPending = isDatePending(date);

    // Determine if we should allow pointer events
    // Allow clicks on past dates to show error messages
    // Disable pointer events only for booked dates
    const shouldAllowPointerEvents = !isBooked; // Only booked dates get no pointer events
    
    // Determine cursor style
    let cursorStyle = "pointer";
    if (isBooked) {
        cursorStyle = "not-allowed";
    } else if (isPast) {
        cursorStyle = "not-allowed";
    }

    return (
        <div
            key={index}
            className={`date ${dateClass}`}
            onClick={() => handleDateClick(date)}
            style={{ 
                pointerEvents: shouldAllowPointerEvents ? "auto" : "none",
                cursor: cursorStyle,
                position: "relative"
            }}
            title={
                isBooked ? "This date is already booked" :
                isPast ? "This date is in the past" :
                isPending ? "This date is in queue (pending confirmation)" :
                "Available date - click to select"
            }
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
                  {/* <i className="fa-solid fa-circle dot-booked"></i>
                  <span> Confirmed Booked Dates</span> <br />
                  <i className="fa-solid fa-circle dot-pending"></i>
                  <span> Pending Reservations (Queue)</span> <br />
                  <i className="fa-solid fa-circle dot-available"></i>
                  <span> Available Dates</span> <br />
                  <i className="fa-solid fa-circle dot-past"></i>
                  <span> Past Dates (Not Selectable)</span> <br /> */}

                    <i className="fa-solid fa-circle dot-booked"></i>
                  <span> Booked Dates</span> <br />
                  <i className="fa-solid fa-circle dot-available"></i>
                  <span> Available Dates</span> <br />

                  <i className="fa-solid fa-circle" style={{color: 'orange', fontSize: '10px'}}></i>
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
                  <span>
                    Minimum Required: <span style={{ color: 'purple' }}>
                      {MIN_BOOKING_DAYS_ForAdmin} days
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
                  Reserve Slot
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
                {/* <i className="fa-solid fa-circle dot-booked"></i>
                <span> Confirmed Booked Dates</span> <br />
                <i className="fa-solid fa-circle dot-pending"></i>
                <span> Pending Reservations (Queue)</span> <br />
                <i className="fa-solid fa-circle dot-available"></i>
                <span> Available Dates</span> <br />
                <i className="fa-solid fa-circle dot-past"></i>
                <span> Past Dates (Not Selectable)</span> <br /> */}

                  <i className="fa-solid fa-circle dot-booked"></i>
                  <span> Booked Dates</span> <br />
                  <i className="fa-solid fa-circle dot-available"></i>
                  <span> Available Dates</span> <br />

                  <i className="fa-solid fa-circle" style={{color: 'orange', fontSize: '10px'}}></i>
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
              
              <div className="calendarDaysInfo">
                {/* <span>
                  Calendar Days: <span style={{ color: 'blue' }}>
                    {calendarDays}
                  </span>
                </span><br />
                <span>
                  Available Days: <span style={{ color: 'green' }}>
                    {availableDaysCount}
                  </span>
                </span><br />
                <span>
                  Minimum Required: <span style={{ color: 'purple' }}>
                    {MIN_BOOKING_DAYS_ForAdmin} days
                  </span>
                </span><br /> */}
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
                  Reserve Slot
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