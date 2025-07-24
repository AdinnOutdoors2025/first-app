import React, { useState, useEffect } from 'react'
import './ad1OrderDetails.css';
import { useLocation } from 'react-router-dom';
import CalendarOrderDetails from './ad1CalenderOrderDetails';
//BASE URL OF http://localhost:3001 FILE IMPORT 
import {baseUrl} from './BASE_URL';

function OrderDetails({ order }) {
    // Handle null/undefined order state

    const location = useLocation();
    const [activeProductIndex, setActiveProductIndex] = useState(0);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // CALENDER EDIT SECTION
    const [isCalenderOpen, setIsCalenderOpen] = useState(false);
    const openCalender = () => {
        setIsCalenderOpen(!isCalendarOpen);
    }
    const closeCalender = () => {
        setIsCalenderOpen(false);
    }

    // Add default values for null case
    const safeOrder = order || location.state?.order || {
        products: [{}],
        client: {},
        status: ""
    };


    //CALENDER EDIT
    // Initialize with order's existing dates
    const [selectedDates, setSelectedDates] = useState({
        start: safeOrder.products?.[activeProductIndex]?.booking ? new Date(safeOrder.products?.[activeProductIndex].booking.startDate) : null,
        end: safeOrder.products?.[activeProductIndex]?.booking ? new Date(safeOrder.products?.[activeProductIndex].booking.endDate) : null
    });
    // In your OrderDetails component, update the fetchBookedDates useEffect:
useEffect(() => {
    const fetchBookedDates = async () => {
        if (!safeOrder?._id || !safeOrder.products?.[activeProductIndex]?._id) return;
        try {
            const response = await fetch(
                `${baseUrl}/booked-dates?excludeOrderId=${safeOrder._id}&excludeProductId=${safeOrder.products[activeProductIndex]._id}`
            );
            const dates = await response.json();
            setBookedDates(dates.map(d => new Date(d)));
        } catch (error) {
            console.error('Error fetching booked dates:', error);
        }
    };
    fetchBookedDates();
}, [safeOrder, activeProductIndex]);




    //   // Update selected dates when active product changes
    //     useEffect(() => {
    //         if (safeOrder.products[activeProductIndex]?.booking) {
    //             setSelectedDates({
    //                 start: safeOrder.products[activeProductIndex].booking.startDate 
    //                     ? new Date(safeOrder.products[activeProductIndex].booking.startDate)
    //                     : null,
    //                 end: safeOrder.products[activeProductIndex].booking.endDate
    //                     ? new Date(safeOrder.products[activeProductIndex].booking.endDate)
    //                     : null
    //             });
    //         }
    //     }, [activeProductIndex, safeOrder.products]);

    // Initialize selectedDates based on active product
    useEffect(() => {
        if (safeOrder.products[activeProductIndex]?.booking) {
            const booking = safeOrder.products[activeProductIndex].booking;
            setSelectedDates({
                start: booking.startDate ? new Date(booking.startDate) : null,
                end: booking.endDate ? new Date(booking.endDate) : null
            });
        } else {
            setSelectedDates({ start: null, end: null });
        }
    }, [activeProductIndex, safeOrder.products]);


    // Replace hardcoded bookedDates with fetched data
    const [bookedDates, setBookedDates] = useState([]);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false); // State to toggle calendar
    // const [currentMonth, setCurrentMonth] = useState(new Date(2025, 2)); // Start with March 2025
    const today = new Date();
    const [currentMonth, setCurrentMonth] = useState(new Date()); // Start with March 2025

    // Add date validation for past dates
    const isPastDate = (date) => {
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);
        const normalizedDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
        return normalizedDate < today;
    };

    // Campaign Date Selection
    //  const [selectedDates, setSelectedDates] = useState({ start: null, end: null });
    const [confirmedDates, setConfirmedDates] = useState({}); // To store confirmed dates
    console.log(selectedDates);
    console.log("NEW SELECTED START DATE", selectedDates.start);
    // console.log(" SELECTED START DATE" , selectedDates.start.toISOString());
    const formattedStartDate = selectedDates.start; // Stores full date in ISO format
    const formattedEndDate = selectedDates.end;
    console.log("NEW START DATE", formattedStartDate);
    console.log("NEW  END DATE", formattedEndDate);
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
        // Fill remaining days
        while (days.length < 42) days.push(null);
        return days;
    };
    const handleDateClick = (date) => {
        if (!date || isNaN(date.getTime())) return;

        // Create date without time component
        const normalizedDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
        // Check if date is booked or in the past
        //  const isBooked = bookedDates.some(d =>
        //      d.getUTCFullYear() === normalizedDate.getUTCFullYear() &&
        //      d.getUTCMonth() === normalizedDate.getUTCMonth() &&
        //      d.getUTCDate() === normalizedDate.getUTCDate()
        //  );
        // Check if date is booked or in the past
        const isBooked = bookedDates.some(d => {
            const bookedDate = new Date(d);
            return bookedDate.getTime() === normalizedDate.getTime();
        });


        const isPast = isPastDate(normalizedDate);

        if (isBooked || isPast) return;
        if (bookedDates.some(d =>
            d.getUTCFullYear() === normalizedDate.getUTCFullYear() &&
            d.getUTCMonth() === normalizedDate.getUTCMonth() &&
            d.getUTCDate() === normalizedDate.getUTCDate()
        )) return;

        if (!selectedDates.start || selectedDates.end) {
            setSelectedDates({ start: normalizedDate, end: null });
        } else {
            if (normalizedDate < selectedDates.start) {
                setSelectedDates({ start: normalizedDate, end: selectedDates.start });
            } else {
                setSelectedDates({ start: selectedDates.start, end: normalizedDate });
            }
        }
    };
    const resetDates = () => {
        setSelectedDates({ start: null, end: null });
        setConfirmedDates({ start: null, end: null }); // Reset confirmed dates

    };



    // UPDATED DATE CLASS CALCULATION
    const getDateSelectionClass = (date) => {
        if (!date || isNaN(date.getTime())) return "disabled";


        const normalizedDate = new Date(Date.UTC(
            date.getFullYear(),
            date.getMonth(),
            date.getDate()
        ));

        // Check if date is booked
        const isBooked = bookedDates.some(d =>
            d.getUTCFullYear() === normalizedDate.getUTCFullYear() &&
            d.getUTCMonth() === normalizedDate.getUTCMonth() &&
            d.getUTCDate() === normalizedDate.getUTCDate()
        );

        const isPast = isPastDate(normalizedDate);

        // Return combined classes if both conditions apply
        if (isBooked && isPast) return "past booked";
        if (isBooked) return "booked";
        if (isPast) return "past";


        const dateString = date.toISOString().split('T')[0];
        const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
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

        if (bookedDates.some(d =>
            d.getUTCFullYear() === utcDate.getUTCFullYear() &&
            d.getUTCMonth() === utcDate.getUTCMonth() &&
            d.getUTCDate() === utcDate.getUTCDate()
        )) return "booked";

        if (startUTC && utcDate.getTime() === startUTC.getTime()) return "selected-start";
        if (endUTC && utcDate.getTime() === endUTC.getTime()) return "selected-end";
        if (startUTC && endUTC && utcDate > startUTC && utcDate < endUTC) {
            return "selected-range";
        }

        return "";
    };

    const goToNextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
    };
    const goToPreviousMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
    };

    // Calculate total price dynamically when start and end dates are selected
    const pricePerDay = safeOrder.products[activeProductIndex]?.price || 0; // Ensure pricePerDay is defined
   
   const getAvailableDaysInRange = (start, end) => {
    if (!start || !end || isNaN(start.getTime()) || isNaN(end.getTime())) {
        return [];
    }
    
    const days = [];
    const current = new Date(start);
    const lastDay = new Date(end);
    
    // Normalize to UTC midnight for comparison
    current.setUTCHours(0, 0, 0, 0);
    lastDay.setUTCHours(0, 0, 0, 0);

    // Create Set of booked dates in UTC for faster lookup
    const bookedUTCDates = new Set(
        bookedDates.map(d => 
            Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())
        )
    );

    while (current <= lastDay) {
        const currentUTC = Date.UTC(
            current.getFullYear(), 
            current.getMonth(), 
            current.getDate()
        );
        
        if (!bookedUTCDates.has(currentUTC) && !isPastDate(current)) {
            days.push(new Date(current));
        }
        current.setDate(current.getDate() + 1);
    }

    return days;
};


    const availableDays =
        selectedDates.start && selectedDates.end
            ? getAvailableDaysInRange(selectedDates.start, selectedDates.end)
            : [];
    const totalDays = availableDays.length;
    const totalPrice = totalDays * pricePerDay;
    console.log(totalPrice);
    console.log(totalDays);

    const confirmDates = async () => {
        if (!selectedDates.start || !selectedDates.end) {
            alert('Please select both start and end dates');
            return;
        }
        setIsLoading(true);
        setError(null);
        try {


            // Validate dates
        if (isNaN(selectedDates.start.getTime()) || isNaN(selectedDates.end.getTime())) {
            throw new Error('Invalid date selection');
        }

        // Ensure start date is before end date
        if (selectedDates.start > selectedDates.end) {
            throw new Error('Start date must be before end date');
        }


            // Generate all dates in the range
            const bookedDates = [];
            const current = new Date(selectedDates.start);
            const end = new Date(selectedDates.end);


            // Normalize dates to UTC midnight
            current.setUTCHours(0, 0, 0, 0);
            end.setUTCHours(0, 0, 0, 0);


            while (current <= end) {
                bookedDates.push(new Date(current));
                current.setDate(current.getDate() + 1);
            }



            // Calculate total days and price
            const totalDays = availableDays.length;
            const productPrice = safeOrder.products[activeProductIndex]?.price || 0;
            const totalPrice = totalDays * productPrice;

        // Prepare the update data - modified this part
        const updatedProducts = safeOrder.products.map((product, index) => 
            index === activeProductIndex ? {
                ...product,
                booking: {
                    startDate: selectedDates.start.toISOString(),
                    endDate: selectedDates.end.toISOString(),
                    totalDays: totalDays,
                    totalPrice: totalPrice
                },
                bookedDates: bookedDates.map(d => d.toISOString())
            } : product
        );


            const response = await fetch(`${baseUrl}/prodOrders/${safeOrder._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    products: updatedProducts  // Changed from updateData to products
                })
            });

            // First check if the response is OK
            if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
            const updatedOrder = await response.json();
            // Update local state and close calendar
            setConfirmedDates(selectedDates);
            setIsCalenderOpen(false);
            // Show success message
            alert('Dates updated successfully!');
            // Force reload or update parent state if needed
            window.location.reload();

        } catch (error) {
            console.error('Update error:', error);
                    setError(error.message || 'Failed to update dates');
            alert(`Update failed: ${error.message}`);
        }
        finally {
            setIsLoading(false);
        }
    };


    const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 991);

    useEffect(() => {
        const handleResize = () => {
            setIsSmallScreen(window.innerWidth <= 991);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div className='adminOrderDetailsMain'>
            {!safeOrder._id ? (
                <div className="no-order-selected">
                    <h3>No order selected</h3>
                    <p>Please choose an order to show details</p>
                </div>
            ) : (
                <>


                    {/* Order details Section  */}
                    <div className='order-manageClientSection'>
                        <div className='order-manageRightSideHeading'>Order Information</div>
                        <div className='d-flex order-manageClientInformation'>
                            <div className='order-manageClientInfoLeft'>
                                <div className='order-clientDetailSection'>
                                    <div className='order-clientDetailHeading'>Order ID</div>
                                    <input type='text' placeholder='Enter Order ID' className='order-clientDetailsInput' value={safeOrder.orderId || ''} readOnly ></input>
                                </div>
                                <div className='order-clientDetailSection'>
                                    <div className='order-clientDetailHeading'>Payment</div>
                                    <input type='text' placeholder='Enter Payment' className='order-clientDetailsInput' value={`₹${safeOrder.client?.paidAmount}` || ''}
                                        readOnly ></input>
                                </div>
                            </div>
                            <div className='order-manageClientInfoRight'>
                                <div className='order-clientDetailSection'>
                                    <div className='order-clientDetailHeading'>Date</div>
                                    <input type='text' placeholder='Enter Date' className='order-clientDetailsInput' value={new Date(safeOrder.createdAt).toLocaleDateString('en-GB') || " "}
                                        readOnly  ></input>
                                </div>
                                <div className='order-clientDetailSection'>
                                    <div className='order-clientDetailHeading'>Status</div>
                                    <input type='text' placeholder='Enter Status' className='order-clientDetailsInput' value={safeOrder.status || ''}
                                        readOnly ></input>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Client Section  */}
                    <div className='order-manageClientSection'>
                        <div className='order-manageRightSideHeading'>Client Information</div>
                        <div className='d-flex order-manageClientInformation'>
                            <div className='order-manageClientInfoLeft'>
                                <div className='order-clientDetailSection'>
                                    <div className='order-clientDetailHeading'>Client Name</div>
                                    <input type='text' placeholder='Enter Name' className='order-clientDetailsInput' value={safeOrder.client?.name || ''}
                                        readOnly></input>
                                </div>
                                <div className='order-clientDetailSection'>
                                    <div className='order-clientDetailHeading'>Client Email</div>
                                    <input type='email' placeholder='Enter Email' className='order-clientDetailsInput' value={safeOrder.client?.email || ''}
                                        readOnly></input>
                                </div>
                            </div>
                            <div className='order-manageClientInfoRight'>
                                <div className='order-clientDetailSection'>
                                    <div className='order-clientDetailHeading'>Client Contact</div>
                                    <input type='number' maxLength='10' placeholder='Enter Contact' className='order-clientDetailsInput' value={safeOrder.client?.contact || ''}
                                        readOnly></input>
                                </div>
                                <div className='order-clientDetailSection'>
                                    <div className='order-clientDetailHeading'>Company Name</div>
                                    <input type='text' placeholder='Enter Company' className='order-clientDetailsInput' value={safeOrder.client?.company || ''}
                                        readOnly></input>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Product Section  */}
                    <div className='order-manageClientSection adminOrder_productSection'>
                        <div className='order-manageRightSideHeading admin-OrderTableHeading'>Product Information</div>

                        {/* Product Tabs */}
                        <div className="product-tabs">
                            {safeOrder.products.map((product, index) => (
                                <button
                                    key={index}
                                    className={`product-tab ${activeProductIndex === index ? 'active' : ''}`}
                                    onClick={() => setActiveProductIndex(index)}
                                >
                                    Product {index + 1}
                                </button>
                            ))}
                        </div>


                        <table>
                            <thead>
                                <tr>
                                    <th><div>Product</div></th>
                                    <th><div className='TableOrderName'>Name</div></th>
                                    <th><div>Status</div></th>
                                    <th><div>Amount</div></th>
                                    <th><div>Booked Date</div></th>
                                    <th> </th>
                                </tr>
                            </thead>
                            <tbody>
                                {safeOrder.products.map((product, index) => (
                                    <tr key={index} className={activeProductIndex === index ? 'active-product' : ''} >
                                        <td>
                                            <img src={product.image} alt="Product" className='productImg' />
                                        </td>
                                        <td className='order-TableOrderName'>{product.name || 'No name'}</td>
                                        <td>{safeOrder.status}</td>
                                        <td>₹{product.price || 0}</td>
                                        <td>
                                            {product.booking?.startDate
                                                ? new Date(product.booking.startDate).toLocaleDateString("en-US", {
                                                    month: "short",
                                                    day: "numeric"
                                                })
                                                : "--"
                                            } - {product.booking?.endDate
                                                ? new Date(product.booking.endDate).toLocaleDateString("en-US", {
                                                    month: "short",
                                                    day: "numeric"
                                                })
                                                : "--"
                                            } ({product.booking?.totalDays || 0} Days)
                                        </td>

                                        <td>
                                            <i
                                                //className="fa-solid fa-pen" 
                                                className="fa-solid fa-pen-to-square OrderDetailsEdit"
                                                title="Edit"

                                                onClick={() => {
                                                    setActiveProductIndex(index);
                                                    setIsCalenderOpen(true);
                                                }}

                                            ></i>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {/*  EDIT ICON CLICK THEN ONLY OPEN THE CALENDER   */}
                        {
                            isCalenderOpen && (
                                <div >
                                    <CalendarOrderDetails
                                        selectedDates={selectedDates} setSelectedDates={setSelectedDates} generateMonth={generateMonth} handleDateClick={handleDateClick} resetDates={resetDates} getDateSelectionClass={getDateSelectionClass} goToNextMonth={goToNextMonth} goToPreviousMonth={goToPreviousMonth} bookedDates={bookedDates} currentMonth={currentMonth} setCurrentMonth={setCurrentMonth} confirmedDates={confirmedDates} setConfirmedDates={setConfirmedDates} pricePerDay={safeOrder.products[activeProductIndex]?.price || 0} confirmDates={confirmDates} totalDays={totalDays} totalPrice={totalPrice} isSmallScreen={isSmallScreen} closeCalender={closeCalender}
                                        isValidDate={(date) => date && !isNaN(date.getTime())} isPastDate={isPastDate}
                                    />
                                    {error && (
                                        <div className="error-messageOrderDetails">
                                            <i className="fas fa-exclamation-circle"></i>
                                            {error}
                                        </div>
                                    )}
                                    {isLoading && (
                                        <div className="loading-overlay">
                                            <div className="spinner"></div>
                                            <p>Updating dates...</p>
                                        </div>
                                    )}
                                </div>
                            )
                        }

                        <div className="admin-order-pricing">
                            <div className="admin-orderContent">
                                <div className="admin-orderContentLeft">Total Products</div>
                                <div className="admin-orderContentRight">{safeOrder.products.length}</div>
                            </div>
                            <div className="admin-orderContent">
                                <div className="admin-orderContentLeft">Total Amount</div>
                                <div className="admin-orderContentRight"> ₹{safeOrder.products.reduce((sum, p) => sum + (p.booking?.totalPrice || 0), 0)}</div>
                            </div>
                        </div>
                    </div>
                    <div className="admin-orderContent admin-totalPaidAmt">
                        <div className="admin-orderContentLeft adminTotalAmt">Paid Amount</div>
                        <div className="admin-orderContentRight adminTotalAmt">{`₹${safeOrder.client?.paidAmount}` || 0}</div>
                    </div>

                </>
            )}
        </div>
    )
}

export default OrderDetails;
