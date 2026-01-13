// src/utils/dateFormatter.js

/**
 * Convert UTC date to Indian Standard Time (IST)
 * IST = UTC + 5:30 hours
 */
export const convertUTCToIST = (dateString) => {
    if (!dateString) return null;
    
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return null;
        
        // Add 5 hours 30 minutes for IST (in milliseconds)
        const istOffset = 5.5 * 60 * 60 * 1000;
        const istDate = new Date(date.getTime() + istOffset);
        
        return istDate;
    } catch (error) {
        console.error("Error converting to IST:", error);
        return null;
    }
};

/**
 * Format date for display in Indian format (DD-MM-YYYY)
 */
export const formatIndianDate = (dateString, includeTime = false) => {
    const date = convertUTCToIST(dateString);
    if (!date) return "N/A";
    
    if (includeTime) {
        return date.toLocaleString('en-IN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    }
    
    return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
};

/**
 * Format date for display with month names (13 Jan 2026, 1:39 PM)
 */
export const formatIndianDateTime = (dateString, showSeconds = false) => {
    const date = convertUTCToIST(dateString);
    if (!date) return "N/A";
    
    const options = {
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
    
    return date.toLocaleString('en-IN', options);
};

/**
 * Format booking dates range (27 Jan - 10 Feb 2026)
 */
export const formatBookingRange = (startDate, endDate) => {
    const start = convertUTCToIST(startDate);
    const end = convertUTCToIST(endDate);
    
    if (!start || !end) return "N/A";
    
    const startFormatted = start.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short'
    });
    
    const endFormatted = end.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });
    
    return `${startFormatted} - ${endFormatted}`;
};

/**
 * Format time only (1:39 PM)
 */
export const formatIndianTime = (dateString, showSeconds = false) => {
    const date = convertUTCToIST(dateString);
    if (!date) return "N/A";
    
    const options = {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    };
    
    if (showSeconds) {
        options.second = '2-digit';
    }
    
    return date.toLocaleTimeString('en-IN', options);
};

/**
 * Calculate booking status and remaining days
 */
export const getBookingStatus = (startDate, endDate) => {
    const start = convertUTCToIST(startDate);
    const end = convertUTCToIST(endDate);
    const now = new Date();
    
    if (!start || !end) return { status: 'unknown', days: 0 };
    
    if (now < start) {
        // Upcoming
        const daysUntil = Math.ceil((start - now) / (1000 * 60 * 60 * 24));
        return { 
            status: 'upcoming', 
            days: daysUntil,
            message: `Starts in ${daysUntil} day${daysUntil !== 1 ? 's' : ''}`
        };
    } else if (now > end) {
        // Past
        const daysAgo = Math.floor((now - end) / (1000 * 60 * 60 * 24));
        return { 
            status: 'past', 
            days: daysAgo,
            message: `Ended ${daysAgo} day${daysAgo !== 1 ? 's' : ''} ago`
        };
    } else {
        // Active
        const daysRemaining = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
        const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
        const daysElapsed = totalDays - daysRemaining;
        
        return { 
            status: 'active', 
            days: daysRemaining,
            progress: Math.round((daysElapsed / totalDays) * 100),
            message: `${daysElapsed}/${totalDays} days completed (${daysRemaining} days remaining)`
        };
    }
};

/**
 * Format for table display (13-01-2026, 1:39 PM)
 */
export const formatForTable = (dateString) => {
    return formatIndianDate(dateString, true);
};

/**
 * Get relative time (2 days ago, 1 hour ago, etc.)
 */
export const getRelativeTime = (dateString) => {
    const date = convertUTCToIST(dateString);
    if (!date) return "N/A";
    
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
};

export default {
    convertUTCToIST,
    formatIndianDate,
    formatIndianDateTime,
    formatBookingRange,
    formatIndianTime,
    getBookingStatus,
    formatForTable,
    getRelativeTime
};