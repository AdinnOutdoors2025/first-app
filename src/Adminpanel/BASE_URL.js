// export const baseUrl = "https://backend-bq11.onrender.com";
export const baseUrl = "http://localhost:3001";
// export const baseUrl = "http://192.168.0.159:3001";
export const gstPercentage = 18 //18% gst on each order of the product


// BASE_URL.JS
export const DATE_CONFIG = {
  INITIAL_SELECTION_DAYS: 7,     // Number of days to show initially (green)
  AVAILABLE_WINDOW_DAYS: 3650,   // Number of days from today that are available after start date selection(10 YEARS)
  MIN_BOOKING_DAYS: 7,           // Minimum days required for booking
  SHOW_ONLY_AVAILABLE_WINDOW: true // Show only initial window initially
}; 




// ADMIN CALENDAR 
export const DATE_CONFIG_ADMIN = {
  MIN_BOOKING_DAYS_ForAdmin: 1,    // Minimum days required for booking(admin)
}; 