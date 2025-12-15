import React, { useState, useEffect } from "react";
import "./ad1OrderDetails.css";
import { useLocation } from "react-router-dom";
import CalendarOrderDetails from "./ad1CalenderOrderDetails";
//BASE URL OF http://localhost:3001 FILE IMPORT
import { baseUrl } from "./BASE_URL";
import { formatIndianCurrency } from "../components/FORMATED_AMOUNT";
import axios from "axios";
import { toast } from "react-toastify";

const formatEditedDateTime = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
        return "";
    }

    // Date
    const day = date.getDate().toString().padStart(2, "0");
    const month = date.toLocaleString("en-US", { month: "short" }); // Dec
    const year = date.getFullYear();

    const time = date
        .toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        })
        .toLowerCase(); // convert AM/PM to am/pm

    return `${day}-${month}-${year}, ${time}`;
};

function OrderDetails({ order, onOrderUpdate }) {

    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [selectedProductId, setSelectedProductId] = useState(null);

    const handleDeleteClick = (orderId, productId) => {
        setSelectedOrderId(orderId);
        setSelectedProductId(productId);
        setShowDeletePopup(true);
    };

    const confirmDelete = async () => {
        try {
            await axios.get(
                `${baseUrl}/deleteProductOrder/${selectedProductId}/${selectedOrderId}`
            );
            setOrderData((prev) => ({
                ...prev,
                products: prev.products.filter((p) => p.id !== selectedOrderId),
            }));
        } catch (err) {
            // toast.error("Failed to delete");
        }
        setShowDeletePopup(false);
    };

    // Handle null/undefined order state

    const location = useLocation();
    const [activeProductIndex, setActiveProductIndex] = useState(0);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // CALENDER EDIT SECTION
    const [isCalenderOpen, setIsCalenderOpen] = useState(false);
    const openCalender = () => {
        setIsCalenderOpen(!isCalendarOpen);
    };
    const closeCalender = () => {
        setIsCalenderOpen(false);
    };

    // Add local state for the order
    const [localOrder, setLocalOrder] = useState(null);
    // Initialize localOrder when order or location.state changes
    useEffect(() => {
        const newOrder = order || location.state?.order || {
            products: [{}],
            client: {},
            status: ""
        };
        setLocalOrder(newOrder);
    }, [order, location.state]);


    const initialOrder = localOrder || order ||
        location.state?.order || {
        products: [{}],
        client: {},
        status: "",
    };

    const [orderData, setOrderData] = useState(initialOrder);
    const safeOrder = orderData;

    /* delete product */

    /* Set order statuses */

    const [orderStatuses, setOrderStatuses] = useState([]);
    const [selectOrderStatus, setSelectOrderStatus] = useState("");
    const [showAddInput, setShowAddInput] = useState(false);
    const [newStatus, setNewStatus] = useState("");
    
    // Check if handler is assigned
    const [hasHandlerAssigned, setHasHandlerAssigned] = useState(
        safeOrder.handled_by && safeOrder.handled_by.trim() !== ""
    );

    const fetchOrderStatuses = async () => {
        try {
            const res = await axios.get(`${baseUrl}/getOrderStatuses`);
            setOrderStatuses(res.data.data || []);
        } catch (err) {
            console.error(err);
        }
    };

    const handleStatusChange = (e) => {
        const value = e.target.value;
        if (value === "__add_new__") {
            setShowAddInput(true);
            return;
        } else {
            setShowAddInput(false);
            setSelectOrderStatus(value);
            if (value) {
                updateOrderStatus(value);
            }
        }
    };

    const setNewStatusInput = (newStatus) => {
        setNewStatus(newStatus);
    };

    const updateOrderStatus = async (statusValue) => {
        if (!statusValue || statusValue.trim() === "") return;
        
        try {
            const res = await axios.put(
                `${baseUrl}/updateOrderStatus/${safeOrder._id}`,
                {
                    status: statusValue,
                }
            );

            if (res.data?.status === true) {
                toast.success(res.data.message || "Status Updated successfully!");
            } else {
                toast.error(res.data.message || "Server Error!");
            }
        } catch (err) {
            console.error("Status update failed", err);
        }
    };

    const addNewStatus = async () => {
        if (!newStatus.trim()) return;

        try {
            const res = await axios.post(`${baseUrl}/addOrderStatus`, {
                name: newStatus,
                createdAt: new Date(),
                updatedAt: null,
            });

            setOrderStatuses((prev) => [...prev, newStatus]);
            setShowAddInput(false);

            // Show toast with backend message
            if (res.data?.status === true) {
                toast.success(res.data.message || "Status added successfully!");
            } else {
                toast.error(res.data.message || "Server Error!");
            }

            setShowAddInput(false);
            setNewStatus("");

            fetchOrderStatuses(); // refresh dropdown list
        } catch (err) {
            console.error("Error adding status", err);
        }
    };

    /* Set order statuses */

    const cancelDelete = () => {
        setShowDeletePopup(false);
    };

    /* delete product */

    //CALENDER EDIT
    // Initialize with order's existing dates
    const [selectedDates, setSelectedDates] = useState({
        start: null,
        end: null,
    });

    useEffect(() => {
        const fetchBookedDates = async () => {
            const currentProduct = safeOrder.products?.[activeProductIndex];
            if (currentProduct?.prodCode) {
                try {
                    const cleanProductCode = currentProduct.prodCode
                        .replace(/^#/, "")
                        .trim();
                    let url = `${baseUrl}/booked-dates/${encodeURIComponent(
                        cleanProductCode
                    )}`;

                    // Exclude current order when editing
                    if (safeOrder._id) {
                        url += `?excludeOrderId=${safeOrder._id}`;
                    }

                    const res = await fetch(url);
                    if (res.ok) {
                        const dates = await res.json();
                        const dateObjects = dates.map((d) => {
                            const date = new Date(d);
                            return new Date(
                                Date.UTC(
                                    date.getUTCFullYear(),
                                    date.getUTCMonth(),
                                    date.getUTCDate()
                                )
                            );
                        });
                        setBookedDates(dateObjects);
                    } else {
                        setBookedDates([]);
                    }
                } catch (error) {
                    console.error("❌ OrderDetails: Error fetching booked dates:", error);
                    setBookedDates([]);
                }
            } else {
                setBookedDates([]);
            }
        };

        fetchBookedDates();
    }, [safeOrder.products, activeProductIndex, safeOrder._id]);


    useEffect(() => {
        if (safeOrder.products[activeProductIndex]?.booking) {
            const booking = safeOrder.products[activeProductIndex].booking;
            setSelectedDates({
                start: booking.startDate ? new Date(booking.startDate) : null,
                end: booking.endDate ? new Date(booking.endDate) : null,
            });
        } else {
            setSelectedDates({ start: null, end: null });
        }
    }, [activeProductIndex, safeOrder.products]);

    // Replace hardcoded bookedDates with fetched data
    const [bookedDates, setBookedDates] = useState([]);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false); // State to toggle calendar
    const today = new Date();
    const [currentMonth, setCurrentMonth] = useState(new Date()); // Start with March 2025

    // Add date validation for past dates
    const isPastDate = (date) => {
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);
        const normalizedDate = new Date(
            Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
        );
        return normalizedDate < today;
    };

    // Campaign Date Selection
    const [confirmedDates, setConfirmedDates] = useState({}); // To store confirmed dates

    const formattedStartDate = selectedDates.start; // Stores full date in ISO format
    const formattedEndDate = selectedDates.end;

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
        const normalizedDate = new Date(
            Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
        );
        // Check if date is booked or in the past
        const isBooked = bookedDates.some((d) => {
            const bookedDate = new Date(d);
            return (
                bookedDate.getUTCFullYear() === normalizedDate.getUTCFullYear() &&
                bookedDate.getUTCMonth() === normalizedDate.getUTCMonth() &&
                bookedDate.getUTCDate() === normalizedDate.getUTCDate()
            );
        });

        const isPast = isPastDate(normalizedDate);

        if (isBooked || isPast) return;

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
    const getDateSelectionClass = (date) => {
        if (!date || isNaN(date.getTime())) return "disabled";

        const normalizedDate = new Date(
            Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
        );

        // Check if date is booked for this specific product
        const isBooked = bookedDates.some((d) => {
            const bookedDate = new Date(d);
            return (
                bookedDate.getUTCFullYear() === normalizedDate.getUTCFullYear() &&
                bookedDate.getUTCMonth() === normalizedDate.getUTCMonth() &&
                bookedDate.getUTCDate() === normalizedDate.getUTCDate()
            );
        });

        const isPast = isPastDate(normalizedDate);

        // Return combined classes if both conditions apply
        if (isBooked && isPast) return "past booked";
        if (isBooked) return "booked";
        if (isPast) return "past";

        const utcDate = new Date(
            Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
        );
        const startUTC = selectedDates.start
            ? new Date(
                Date.UTC(
                    selectedDates.start.getFullYear(),
                    selectedDates.start.getMonth(),
                    selectedDates.start.getDate()
                )
            )
            : null;

        const endUTC = selectedDates.end
            ? new Date(
                Date.UTC(
                    selectedDates.end.getFullYear(),
                    selectedDates.end.getMonth(),
                    selectedDates.end.getDate()
                )
            )
            : null;

        if (startUTC && utcDate.getTime() === startUTC.getTime())
            return "selected-start";
        if (endUTC && utcDate.getTime() === endUTC.getTime()) return "selected-end";
        if (startUTC && endUTC && utcDate > startUTC && utcDate < endUTC) {
            return "selected-range";
        }

        return "";
    };

    const goToNextMonth = () => {
        setCurrentMonth(
            new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
        );
    };
    const goToPreviousMonth = () => {
        setCurrentMonth(
            new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
        );
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
            bookedDates.map((d) =>
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

    const confirmDates = async () => {
        if (!selectedDates.start || !selectedDates.end) {
            alert("Please select both start and end dates");
            return;
        }

        // Normalize dates to UTC for consistent comparison
        const startUTC = new Date(
            Date.UTC(
                selectedDates.start.getFullYear(),
                selectedDates.start.getMonth(),
                selectedDates.start.getDate()
            )
        );

        const endUTC = new Date(
            Date.UTC(
                selectedDates.end.getFullYear(),
                selectedDates.end.getMonth(),
                selectedDates.end.getDate()
            )
        );

        if (isNaN(startUTC.getTime()) || isNaN(endUTC.getTime())) {
            alert("Invalid date selection");
            return;
        }

        if (startUTC > endUTC) {
            alert("Start date must be before end date");
            return;
        }

        // Check for conflicts with THIS PRODUCT only
        const selectedRangeDates = [];
        const current = new Date(startUTC);

        while (current <= endUTC) {
            selectedRangeDates.push(new Date(current));
            current.setDate(current.getDate() + 1);
        }

        // Check conflicts only for this specific product
        const hasConflict = selectedRangeDates.some((selectedDate) => {
            return bookedDates.some((bookedDate) => {
                const selectedUTC = new Date(
                    Date.UTC(
                        selectedDate.getFullYear(),
                        selectedDate.getMonth(),
                        selectedDate.getDate()
                    )
                );
                const bookedUTC = new Date(
                    Date.UTC(
                        bookedDate.getFullYear(),
                        bookedDate.getMonth(),
                        bookedDate.getDate()
                    )
                );
                return selectedUTC.getTime() === bookedUTC.getTime();
            });
        });

        if (hasConflict) {
            alert(
                "Selected dates conflict with existing bookings for THIS PRODUCT. Please choose different dates."
            );
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            // Generate booked dates for the new range
            const updatedBookedDates = [];
            const currentDate = new Date(startUTC);

            while (currentDate <= endUTC) {
                updatedBookedDates.push(new Date(currentDate));
                currentDate.setDate(currentDate.getDate() + 1);
            }

            // Calculate pricing
            const totalDays = updatedBookedDates.length;
            const productPrice = safeOrder.products[activeProductIndex]?.price || 0;
            const totalPrice = totalDays * productPrice;

            // Update only the active product
            const updatedProducts = safeOrder.products.map((product, index) => {
                if (index === activeProductIndex) {
                    return {
                        ...product,
                        booking: {
                            startDate: startUTC.toISOString(),
                            endDate: endUTC.toISOString(),
                            totalDays: totalDays,
                            totalPrice: totalPrice,
                        },
                        bookedDates: updatedBookedDates.map((d) => d.toISOString()),
                    };
                }
                return product;
            });

            const response = await fetch(`${baseUrl}/prodOrders/${safeOrder._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ products: updatedProducts }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(
                    errorData.message || `HTTP error! status: ${response.status}`
                );
            }

            const updatedOrder = await response.json();

            setConfirmedDates({ start: startUTC, end: endUTC });
            setIsCalenderOpen(false);

            alert("✅ Dates updated successfully!");
            window.location.reload();
        } catch (error) {
            console.error("❌ Update error:", error);
            setError(error.message || "Failed to update dates");
            alert(`❌ Update failed: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 991);

    useEffect(() => {
        const handleResize = () => {
            setIsSmallScreen(window.innerWidth <= 991);
        };
        window.addEventListener("resize", handleResize);
        fetchOrderStatuses();
        
        // Update hasHandlerAssigned whenever safeOrder changes
        if (safeOrder.handled_by && safeOrder.handled_by.trim() !== "") {
            setHasHandlerAssigned(true);
        } else {
            setHasHandlerAssigned(false);
        }
        
        // Initialize selectOrderStatus with empty string (for "Select Status" placeholder)
        if (safeOrder.order_status && safeOrder.order_status.trim() !== "") {
            setSelectOrderStatus(safeOrder.order_status);
        } else {
            setSelectOrderStatus(""); // Empty for "Select Status" placeholder
        }
        
        return () => window.removeEventListener("resize", handleResize);
    }, [safeOrder.handled_by, safeOrder.order_status]);


    // Updated updateHandlerName function - FIXED
    const updateHandlerName = async (newHandlerName) => {
        if (!newHandlerName || newHandlerName.trim() === '') {
            alert('Handler name cannot be empty');
            return;
        }
        // Don't proceed if name is same as current
        if (newHandlerName.trim() === safeOrder.handled_by) {
            alert('No changes made. Handler name is the same.');
            return;
        }
        try {
            setIsLoading(true);

            const response = await fetch(`${baseUrl}/prodOrders/${safeOrder._id}/handled-by`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    handled_by: newHandlerName.trim()
                })
            });

            if (response.ok) {
                const data = await response.json();

                // Update both localOrder AND orderData to ensure UI updates immediately
                const updatedOrder = {
                    ...safeOrder,
                    handled_by: newHandlerName.trim(),
                    last_edited: new Date().toISOString()
                };

                // Update both states
                setLocalOrder(updatedOrder);
                setOrderData(updatedOrder);
                setHasHandlerAssigned(true); // Set to true when handler is assigned

                if (onOrderUpdate) {
                    onOrderUpdate(updatedOrder);
                }

                alert('✅ Handler updated successfully!');

            } else {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to update handler');
            }
        }
        catch (error) {
            console.error('Error updating handler:', error);
            alert(`❌ Error: ${error.message || 'Failed to update handler'}`);
        }
        finally {
            setIsLoading(false);
        }
    };

    // Update the prompt handler
    const handleEditHandler = () => {
        const newHandler = prompt(
            `Current handler: ${safeOrder.handled_by || '-'}\n\nEnter new handler name:`,
            safeOrder.handled_by || ''
        );

        if (newHandler && newHandler.trim() !== '' && newHandler.trim() !== safeOrder.handled_by) {
            updateHandlerName(newHandler.trim());
        } else if (newHandler && newHandler.trim() === safeOrder.handled_by) {
            alert('No changes made. Handler name is the same.');
        }
    };


    return (
        <div className="adminOrderDetailsMain">

            {/* ALWAYS SHOW Handler Assignment Section - Never Hide */}
            <div className="order-card-header">
                <div className="handler-info-section">
                    <span className="order-taken-by">
                        <i className="fas fa-user-circle"></i>
                        Order Handled By: {safeOrder.handled_by || "-"}
                    </span>
                    <button
                        className="edit-handler-btn"
                        onClick={handleEditHandler}
                        disabled={isLoading}
                    >
                        {safeOrder.handled_by && safeOrder.handled_by.trim() !== "" ? (
                            <>
                                {isLoading ? (
                                    <>
                                        <i className="fas fa-spinner fa-spin"></i> Updating...
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-edit"></i> Edit Handler
                                    </>
                                )}
                            </>
                        ) : (
                            <>
                                {isLoading ? (
                                    <>
                                        <i className="fas fa-spinner fa-spin"></i> Assigning...
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-user-plus"></i> Assign Handler
                                    </>
                                )}
                            </>
                        )}
                    </button>
                </div>
            </div>


            {!safeOrder._id ? (
                <div className="no-order-selected">
                    <h3>No order selected</h3>
                    <p>Please choose an order to show details</p>
                </div>
            ) : (
                <>
                    {/* Order details Section  */}
                    <div className="order-manageClientSection">
                        <div className="order-manageRightSideHeading">
                            Order Information
                        </div>
                        
                        {/* Conditionally render status section ONLY when handler is assigned */}
                        {hasHandlerAssigned && (
                            <div className="order-status-container">
                                <div className="order-status-header">
                                    <label className="order-status-label">Order Status</label>
                                    <div className="current-status-display">
                                        {selectOrderStatus || "Select Status"}
                                    </div>
                                </div>

                                <div className="order-status-dropdown">
                                    <div className="dropdown-wrapper">
                                        <select
                                            onChange={handleStatusChange}
                                            value={selectOrderStatus}
                                            className="status-select"
                                        >
                                            <option value="">Select Status</option>
                                            {orderStatuses.map((status) => (
                                                <option key={status._id} value={status.name}>
                                                    {status.name}
                                                </option>
                                            ))}
                                            <option value="__add_new__">+ Add New Status</option>
                                        </select>
                                        <div className="dropdown-arrow">
                                            <i className="fas fa-chevron-down"></i>
                                        </div>
                                    </div>
                                </div>

                                {showAddInput && (
                                    <div className="add-status-section">
                                        <div className="add-status-input-group">
                                            <input
                                                onChange={(e) => setNewStatusInput(e.target.value)}
                                                type="text"
                                                placeholder="Enter new status"
                                                className="new-status-input"
                                            />
                                            <button
                                                onClick={addNewStatus}
                                                className="add-status-button"
                                            >
                                                Add
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                        
                        <div className="d-flex order-manageClientInformation">
                            <div className="order-manageClientInfoLeft">
                                <div className="order-clientDetailSection">
                                    <div className="order-clientDetailHeading">Order ID</div>
                                    <input
                                        type="text"
                                        placeholder="Enter Order ID"
                                        className="order-clientDetailsInput"
                                        value={safeOrder.orderId || ""}
                                        readOnly
                                    ></input>
                                </div>
                                <div className="order-clientDetailSection">
                                    <div className="order-clientDetailHeading">Payment</div>
                                    <input
                                        type="text"
                                        placeholder="Enter Payment"
                                        className="order-clientDetailsInput"
                                        value={formatIndianCurrency(
                                            safeOrder.products.reduce(
                                                (sum, p) => sum + (p.booking?.totalPrice || 0),
                                                0
                                            ),
                                            true
                                        )}
                                        readOnly
                                    ></input>
                                </div>
                            </div>
                            <div className="order-manageClientInfoRight">
                                <div className="order-clientDetailSection">
                                    <div className="order-clientDetailHeading">Date</div>
                                    <input
                                        type="text"
                                        placeholder="Enter Date"
                                        className="order-clientDetailsInput"
                                        value={
                                            new Date(safeOrder.createdAt).toLocaleDateString(
                                                "en-GB"
                                            ) || " "
                                        }
                                        readOnly
                                    ></input>
                                </div>
                                <div className="order-clientDetailSection">
                                    <div className="order-clientDetailHeading">
                                        Order Taken By
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Enter Status"
                                        className="order-clientDetailsInput"
                                        value={safeOrder.status || ""}
                                        readOnly
                                    ></input>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Client Section  */}
                    <div className="order-manageClientSection">
                        <div className="order-manageRightSideHeading">
                            Client Information
                        </div>
                        <div className="d-flex order-manageClientInformation">
                            <div className="order-manageClientInfoLeft">
                                <div className="order-clientDetailSection">
                                    <div className="order-clientDetailHeading">Client Name</div>
                                    <input
                                        type="text"
                                        placeholder="Enter Name"
                                        className="order-clientDetailsInput"
                                        value={safeOrder.client?.name || ""}
                                        readOnly
                                    ></input>
                                </div>
                                <div className="order-clientDetailSection">
                                    <div className="order-clientDetailHeading">Client Email</div>
                                    <input
                                        type="email"
                                        placeholder="Enter Email"
                                        className="order-clientDetailsInput"
                                        value={safeOrder.client?.email || ""}
                                        readOnly
                                    ></input>
                                </div>
                            </div>
                            <div className="order-manageClientInfoRight">
                                <div className="order-clientDetailSection">
                                    <div className="order-clientDetailHeading">
                                        Client Contact
                                    </div>
                                    <input
                                        type="number"
                                        maxLength="10"
                                        placeholder="Enter Contact"
                                        className="order-clientDetailsInput"
                                        value={safeOrder.client?.contact || ""}
                                        readOnly
                                    ></input>
                                </div>
                                <div className="order-clientDetailSection">
                                    <div className="order-clientDetailHeading">Company Name</div>
                                    <input
                                        type="text"
                                        placeholder="Enter Company"
                                        className="order-clientDetailsInput"
                                        value={safeOrder.client?.company || ""}
                                        readOnly
                                    ></input>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Product Section  */}
                    <div className="order-manageClientSection adminOrder_productSection">
                        <div
                            className="order-manageRightSideHeading admin-OrderTableHeading"
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <span>Product Information</span>
                            {safeOrder.last_edited && (
                                <span
                                    style={{
                                        fontSize: "12px",
                                        color: "#666",
                                        fontStyle: "italic",
                                        marginLeft: "10px",
                                    }}
                                >
                                    Last Edited: {formatEditedDateTime(safeOrder.last_edited)}
                                </span>
                            )}
                        </div>

                        {/* Product Tabs */}
                        <div className="product-tabs">
                            {safeOrder.products.map((product, index) => (
                                <button
                                    key={index}
                                    className={`product-tab ${activeProductIndex === index ? "active" : ""
                                        }`}
                                    onClick={() => setActiveProductIndex(index)}
                                >
                                    Product {index + 1}
                                </button>
                            ))}
                        </div>

                        <table>
                            <thead>
                                <tr>
                                    <th>
                                        <div>Product</div>
                                    </th>
                                    <th>
                                        <div className="TableOrderName">Name</div>
                                    </th>
                                    <th>
                                        <div>Status</div>
                                    </th>
                                    <th>
                                        <div>Amount</div>
                                    </th>
                                    <th>
                                        <div>Booked Date</div>
                                    </th>
                                    <th> </th>
                                </tr>
                            </thead>
                            <tbody>
                                {safeOrder.products.map((product, index) => (
                                    <tr
                                        key={index}
                                        className={
                                            activeProductIndex === index ? "active-product" : ""
                                        }
                                    >
                                        <td>
                                            <img
                                                src={product.image}
                                                alt="Product"
                                                className="productImg"
                                            />
                                        </td>
                                        <td className="order-TableOrderName">
                                            {product.name || "No name"}
                                        </td>
                                        <td>{safeOrder.status}</td>
                                        <td>₹{product.price || 0}</td>
                                        <td>
                                            {product.booking?.startDate
                                                ? new Date(
                                                    product.booking.startDate
                                                ).toLocaleDateString("en-US", {
                                                    month: "short",
                                                    day: "numeric",
                                                })
                                                : "--"}{" "}
                                            -{" "}
                                            {product.booking?.endDate
                                                ? new Date(product.booking.endDate).toLocaleDateString(
                                                    "en-US",
                                                    {
                                                        month: "short",
                                                        day: "numeric",
                                                    }
                                                )
                                                : "--"}{" "}
                                            ({product.booking?.totalDays || 0} Days)
                                        </td>

                                        <td>
                                            {/* Conditionally show action buttons based on handler assignment */}
                                            {hasHandlerAssigned && (
                                                <div className="action-buttons">
                                                    <i
                                                        className="fa-solid fa-pen-to-square status-edit-icon"
                                                        title="Edit Dates"
                                                        onClick={() => {
                                                            setActiveProductIndex(index);
                                                            setIsCalenderOpen(true);
                                                        }}
                                                    ></i>
                                                    <i
                                                        className="fa-solid fa-trash status-delete-icon"
                                                        title="Delete Product"
                                                        onClick={() => {
                                                            handleDeleteClick(product.id, safeOrder.orderId);
                                                        }}
                                                    ></i>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {/*  EDIT ICON CLICK THEN ONLY OPEN THE CALENDER   */}
                        {isCalenderOpen && (
                            <div className="calendar_admin">
                                <CalendarOrderDetails
                                    selectedDates={selectedDates}
                                    setSelectedDates={setSelectedDates}
                                    generateMonth={generateMonth}
                                    handleDateClick={handleDateClick}
                                    resetDates={resetDates}
                                    getDateSelectionClass={getDateSelectionClass}
                                    goToNextMonth={goToNextMonth}
                                    goToPreviousMonth={goToPreviousMonth}
                                    bookedDates={bookedDates}
                                    currentMonth={currentMonth}
                                    setCurrentMonth={setCurrentMonth}
                                    confirmedDates={confirmedDates}
                                    setConfirmedDates={setConfirmedDates}
                                    pricePerDay={
                                        safeOrder.products[activeProductIndex]?.price || 0
                                    }
                                    confirmDates={confirmDates}
                                    totalDays={totalDays}
                                    totalPrice={totalPrice}
                                    isSmallScreen={isSmallScreen}
                                    closeCalender={closeCalender}
                                    isValidDate={(date) => date && !isNaN(date.getTime())}
                                    isPastDate={isPastDate}
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
                        )}

                        <div className="admin-order-pricing">
                            <div className="admin-orderContent">
                                <div className="admin-orderContentLeft">Total Products</div>
                                <div className="admin-orderContentRight">
                                    {safeOrder.products.length}
                                </div>
                            </div>
                            <div className="admin-orderContent">
                                <div className="admin-orderContentLeft">Total Amount</div>
                                <div
                                    className="admin-orderContentRight"
                                    style={{ width: "auto" }}
                                >
                                    {formatIndianCurrency(
                                        safeOrder.products.reduce(
                                            (sum, p) => sum + (p.booking?.totalPrice || 0),
                                            0
                                        ),
                                        true
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="admin-orderContent admin-totalPaidAmt">
                        <div className="admin-orderContentLeft adminTotalAmt">
                            Paid Amount
                        </div>
                        <div
                            className="admin-orderContentRight adminTotalAmt"
                            style={{ width: "auto" }}
                        >
                            {formatIndianCurrency(
                                safeOrder.products.reduce(
                                    (sum, p) => sum + (p.booking?.totalPrice || 0),
                                    0
                                ),
                                true
                            )}
                        </div>
                    </div>
                </>
            )}

            {showDeletePopup && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        background: "rgba(0,0,0,0.5)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 999,
                    }}
                >
                    <div
                        style={{
                            background: "#fff",
                            padding: "20px",
                            borderRadius: "8px",
                            width: "300px",
                            textAlign: "center",
                        }}
                    >
                        <h3>Are you sure?</h3>
                        <p>Do you want to delete this product?</p>

                        <div
                            style={{
                                marginTop: "20px",
                                display: "flex",
                                justifyContent: "space-between",
                            }}
                        >
                            <button
                                onClick={confirmDelete}
                                style={{
                                    background: "red",
                                    color: "#fff",
                                    padding: "8px 15px",
                                    borderRadius: "5px",
                                    border: "none",
                                }}
                            >
                                Yes, Delete
                            </button>

                            <button
                                onClick={cancelDelete}
                                style={{
                                    background: "gray",
                                    color: "#fff",
                                    padding: "8px 15px",
                                    borderRadius: "5px",
                                    border: "none",
                                }}
                            >
                                No
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
export default OrderDetails;