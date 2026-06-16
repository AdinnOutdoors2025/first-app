/** * Convert UTC date to Indian Standard Time (IST)* IST = UTC + 5:30 hours*/
export const convertUTCToIST = (dateString) => {
    if (!dateString) return null;
    
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return null;
        
     
        
        // Get timezone offset in minutes and convert to hours
        const timezoneOffset = date.getTimezoneOffset();
        const localTimezoneHours = Math.abs(timezoneOffset) / 60;
        
  
        if (Math.abs(timezoneOffset) === 330) { 
            return date;
        }
        

        if (dateString.includes('Z') || dateString.includes('+') || dateString.includes('-')) {
            const istOffset = 5.5 * 60 * 60 * 1000;
            return new Date(date.getTime() + istOffset);
        }
        
        return date;
    } catch (error) {
        console.error("Error converting to IST:", error);
        return null;
    }
};

export const formatIndianDate = (dateString, includeTime = false) => {
    if (!dateString) return "N/A";
    
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return "N/A";
        
        const isDateOnly = !dateString.includes('T') && !dateString.includes(' ');
        
        if (includeTime || !isDateOnly) {
            const formatted = date.toLocaleString('en-IN', {
                timeZone: 'Asia/Kolkata',
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });
            return formatted.replace(/\b(am|pm)\b/g, (match) => match.toUpperCase());
        }
        
        return date.toLocaleDateString('en-IN', {
            timeZone: 'Asia/Kolkata',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    } catch (error) {
        console.error("Error formatting date:", error);
        return "N/A";
    }
};

/*** Format date for display with month names (13 Jan 2026, 1:39 PM)*/
export const formatIndianDateTime = (dateString, showSeconds = false) => {
    if (!dateString) return "N/A";
    
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return "N/A";
        
        const options = {
            timeZone: 'Asia/Kolkata',
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        };
        
        if (showSeconds) {
            options.second = '2-digit';
        }
        
        const formatted = date.toLocaleString('en-IN', options);
        // Convert AM/PM to uppercase
        return formatted.replace(/\b(am|pm)\b/g, (match) => match.toUpperCase());
    } catch (error) {
        console.error("Error formatting date time:", error);
        return "N/A";
    }
};

/** * Format booking dates range (27 Jan - 10 Feb 2026) */
export const formatBookingRange = (startDate, endDate) => {
    if (!startDate || !endDate) return "N/A";
    
    try {
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        if (isNaN(start.getTime()) || isNaN(end.getTime())) return "N/A";
        
        const startFormatted = start.toLocaleDateString('en-IN', {
            timeZone: 'Asia/Kolkata',
            day: '2-digit',
            month: 'short'
        });
        
        const endFormatted = end.toLocaleDateString('en-IN', {
            timeZone: 'Asia/Kolkata',
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
        
        return `${startFormatted} - ${endFormatted}`;
    } catch (error) {
        console.error("Error formatting booking range:", error);
        return "N/A";
    }
};

/** * Format time only (1:39 PM) */
export const formatIndianTime = (dateString, showSeconds = false) => {
    if (!dateString) return "N/A";
    
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return "N/A";
        
        const options = {
            timeZone: 'Asia/Kolkata',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        };
        
        if (showSeconds) {
            options.second = '2-digit';
        }
        
        const formatted = date.toLocaleTimeString('en-IN', options);
        // Convert AM/PM to uppercase
        return formatted.replace(/\b(am|pm)\b/g, (match) => match.toUpperCase());
    } catch (error) {
        console.error("Error formatting time:", error);
        return "N/A";
    }
};

/** * Calculate booking status and remaining days */
export const getBookingStatus = (startDate, endDate) => {
    if (!startDate || !endDate) return { status: 'unknown', days: 0 };
    
    try {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const now = new Date();
        
        if (isNaN(start.getTime()) || isNaN(end.getTime())) return { status: 'unknown', days: 0 };
        
        // Adjust dates to IST timezone for comparison
        const istOptions = { timeZone: 'Asia/Kolkata' };
        const nowIST = new Date(now.toLocaleString('en-US', istOptions));
        const startIST = new Date(start.toLocaleString('en-US', istOptions));
        const endIST = new Date(end.toLocaleString('en-US', istOptions));
        
        if (nowIST < startIST) {
            // Upcoming
            const daysUntil = Math.ceil((startIST - nowIST) / (1000 * 60 * 60 * 24));
            return { 
                status: 'upcoming', 
                days: daysUntil,
                message: `Starts in ${daysUntil} day${daysUntil !== 1 ? 's' : ''}`
            };
        } else if (nowIST > endIST) {
            // Past
            const daysAgo = Math.floor((nowIST - endIST) / (1000 * 60 * 60 * 24));
            return { 
                status: 'past', 
                days: daysAgo,
                message: `Ended ${daysAgo} day${daysAgo !== 1 ? 's' : ''} ago`
            };
        } else {
            // Active
            const daysRemaining = Math.ceil((endIST - nowIST) / (1000 * 60 * 60 * 24));
            const totalDays = Math.ceil((endIST - startIST) / (1000 * 60 * 60 * 24));
            const daysElapsed = totalDays - daysRemaining;
            
            return { 
                status: 'active', 
                days: daysRemaining,
                progress: Math.round((daysElapsed / totalDays) * 100),
                message: ``
            };
        }
    } catch (error) {
        console.error("Error getting booking status:", error);
        return { status: 'unknown', days: 0 };
    }
};

/** * Format for table display (13-01-2026, 1:39 PM)*/
export const formatForTable = (dateString) => {
    if (!dateString) return "N/A";
    
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return "N/A";
        
        const datePart = date.toLocaleDateString('en-IN', {
            timeZone: 'Asia/Kolkata',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
        
        const timePart = date.toLocaleTimeString('en-IN', {
            timeZone: 'Asia/Kolkata',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
        
        // Convert AM/PM to uppercase in time part
        const timePartUpper = timePart.replace(/\b(am|pm)\b/g, (match) => match.toUpperCase());
        
        return `${datePart}, ${timePartUpper}`;
    } catch (error) {
        console.error("Error formatting for table:", error);
        return "N/A";
    }
};

/** * Get relative time (2 days ago, 1 hour ago, etc.)*/
export const getRelativeTime = (dateString) => {
    if (!dateString) return "N/A";
    
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return "N/A";
        
        const now = new Date();
        const diffMs = now - date;
        const diffSeconds = Math.floor(diffMs / 1000);
        const diffMinutes = Math.floor(diffSeconds / 60);
        const diffHours = Math.floor(diffMinutes / 60);
        const diffDays = Math.floor(diffHours / 24);
        
        if (diffDays > 0) {
            return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
        } else if (diffHours > 0) {
            return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
        } else if (diffMinutes > 0) {
            return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
        } else {
            return 'Just now';
        }
    } catch (error) {
        console.error("Error getting relative time:", error);
        return "N/A";
    }
};

/*** Format time with uppercase AM/PM (1:39 PM)*/
export const formatTimeWithUppercaseAMPM = (dateString, showSeconds = false) => {
    if (!dateString) return "N/A";
    
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return "N/A";
        
        const options = {
            timeZone: 'Asia/Kolkata',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        };
        
        if (showSeconds) {
            options.second = '2-digit';
        }
        
        // Use toLocaleTimeString with specific options
        const timeStr = date.toLocaleTimeString('en-IN', options);
        
        // Convert am/pm to uppercase
        return timeStr.replace(/(\s?)(am|pm)(\s?)/gi, (match, spaceBefore, ampm, spaceAfter) => {
            return `${spaceBefore}${ampm.toUpperCase()}${spaceAfter}`;
        });
    } catch (error) {
        console.error("Error formatting time with uppercase AM/PM:", error);
        return "N/A";
    }
};

/** * Format date and time with uppercase AM/PM (13 Jan 2026, 1:39 PM)*/
export const formatDateTimeUppercaseAMPM = (dateString, showSeconds = false) => {
    if (!dateString) return "N/A";
    
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return "N/A";
        
        const dateOptions = {
            timeZone: 'Asia/Kolkata',
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        };
        
        const timeOptions = {
            timeZone: 'Asia/Kolkata',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        };
        
        if (showSeconds) {
            timeOptions.second = '2-digit';
        }
        
        const datePart = date.toLocaleDateString('en-IN', dateOptions);
        const timePart = date.toLocaleTimeString('en-IN', timeOptions);
        
        // Convert AM/PM to uppercase
        const timePartUpper = timePart.replace(/\b(am|pm)\b/g, (match) => match.toUpperCase());
        
        return `${datePart}, ${timePartUpper}`;
    } catch (error) {
        console.error("Error formatting date time with uppercase AM/PM:", error);
        return "N/A";
    }
};

/** * Format complete timestamp with uppercase AM/PM (13-01-2026 01:39:25 PM) */
export const formatTimestampUppercaseAMPM = (dateString) => {
    if (!dateString) return "N/A";
    
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return "N/A";
        
        const datePart = date.toLocaleDateString('en-IN', {
            timeZone: 'Asia/Kolkata',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
        
        const timePart = date.toLocaleTimeString('en-IN', {
            timeZone: 'Asia/Kolkata',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        });
        
        // Convert AM/PM to uppercase
        const timePartUpper = timePart.replace(/\b(am|pm)\b/g, (match) => match.toUpperCase());
        
        return `${datePart} ${timePartUpper}`;
    } catch (error) {
        console.error("Error formatting timestamp with uppercase AM/PM:", error);
        return "N/A";
    }
};

export default {
    convertUTCToIST,
    formatIndianDate,
    formatIndianDateTime,
    formatBookingRange,
    formatIndianTime,
    getBookingStatus,
    formatForTable,
    getRelativeTime,
    formatTimeWithUppercaseAMPM,
    formatDateTimeUppercaseAMPM,
    formatTimestampUppercaseAMPM
};