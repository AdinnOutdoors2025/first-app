// Updated with date conflict checking at billing time
import React, { useState, useEffect, useRef } from "react";
import "./F1Billing.css";
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import MainNavbar from './A1NAVBAR.jsx';
import MainFooter from './A1FOOTER.jsx';
import { toast } from 'react-toastify';
import { MainLayout } from './MainLayout';
import { useLogin } from './LoginContext';
import { baseUrl, gstPercentage } from '../Adminpanel/BASE_URL';
import { formatIndianCurrency } from './FORMATED_AMOUNT';
import slugify from 'slugify';

const BillingDetails = () => {
    const { productId } = useParams();
    const { user, openLogin } = useLogin();
    const navigate = useNavigate();
    const location = useLocation();

    // State to track if component should render or redirect
    const [isValidUser, setIsValidUser] = useState(false);
    const [isLoadingAuth, setIsLoadingAuth] = useState(true);

    // Date conflict checking states
    const [isCheckingConflicts, setIsCheckingConflicts] = useState(false);
    const [dateConflicts, setDateConflicts] = useState(null);
    const [hasDateConflicts, setHasDateConflicts] = useState(false);
    const [conflictMessage, setConflictMessage] = useState("");

    // Form state and validation
    const [name, setName] = useState(user?.userName || "");
    const [phone, setPhone] = useState(user?.userPhone || "");
    const [email, setEmail] = useState(user?.userEmail || "");
    const [pincode, setPincode] = useState("");
    const [state, setState] = useState("");
    const [city, setCity] = useState("");
    const [address, setAddress] = useState("");
    const [company, setCompany] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [isOpen1, setIsOpen1] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
  
    const statesList = ["Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", " Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"];
    const conflictToastShown = useRef(false);
    const queueToastShown = useRef(false);
    const initialCheckDone = useRef(false);
    const [errors, setErrors] = useState({
        name: false,
        phone: false,
        email: false,
        pincode: false,
        state: false,
        city: false,
        address: false,
        company: false,
    });

    const [queueMessage, setQueueMessage] = useState('');
    const [hasQueueDates, setHasQueueDates] = useState(false);

    const { reserveItem } = location.state || {};

    // Filter states for dropdown
    const filteredStates = statesList.filter((s) =>
        s.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Validate form function
    const validateForm = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const newErrors = {
            name: !name,
            phone: !phone || phone.toString().length !== 10,
            email: !email || !emailRegex.test(email),
            pincode: !pincode,
            state: !state,
            city: !city,
            address: !address,
            company: !company,
        };
        setErrors(newErrors);
        return !Object.values(newErrors).some(error => error);
    };

    // Enhanced authentication check with loading state
    useEffect(() => {
        const checkUser = () => {
            if (!user || !user._id) {
                console.log("User not authenticated, redirecting to login");
                toast.info("Please login to continue with billing", {
                    position: "top-center",
                    autoClose: 3000,
                });
                sessionStorage.setItem('loginRedirect', location.pathname);
                setTimeout(() => {
                    openLogin('login', location.pathname);
                }, 1500);
                navigate('/', { replace: true });
                setIsValidUser(false);
            } else {
                setIsValidUser(true);
            }
            setIsLoadingAuth(false);
        };

        checkUser();

        const handleLogout = () => {
            setIsValidUser(false);
            navigate('/', { replace: true });
        };

        window.addEventListener('user-logged-out', handleLogout);
        return () => {
            window.removeEventListener('user-logged-out', handleLogout);
        };
    }, [user, navigate, openLogin, location.pathname]);

    // Check date conflicts when component mounts
    useEffect(() => {
        if (reserveItem && user && !initialCheckDone.current) {
            checkDateConflicts();
        }
    }, [reserveItem, user]);

    // Function to format date range for display (Mar 21 - Mar 28 format)
    const formatDateRangeForDisplay = (startDate, endDate) => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const startStr = start.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
        const endStr = end.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
        return `${startStr} - ${endStr}`;
    };

    const checkDateConflicts = async (showToast = true) => {
        if (!reserveItem?.startDate || !reserveItem?.endDate) {
            console.log("No dates to check");
            return;
        }

        setIsCheckingConflicts(true);
        setDateConflicts(null);
        setHasDateConflicts(false);
        setConflictMessage("");

        try {
            const response = await fetch(`${baseUrl}/check-date-conflicts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prodCode: reserveItem.prodCode,
                    startDate: new Date(reserveItem.startDate).toISOString(),
                    endDate: new Date(reserveItem.endDate).toISOString(),
                    productId: reserveItem.id,
                    productName: reserveItem.prodName
                })
            });

            const data = await response.json();

            if (data.success) {
                setDateConflicts(data);

                if (data.hasConflicts) {
                    setHasDateConflicts(true);
                    const dateRange = formatDateRangeForDisplay(reserveItem.startDate, reserveItem.endDate);
                    setConflictMessage(`${dateRange} no longer available`);

                    // Only show toast if requested and not shown before
                    if (showToast && !conflictToastShown.current) {
                        toast.error(`${dateRange} - ${data.confirmedConflictCount} date(s) booked`);
                        conflictToastShown.current = true;
                    }
                } else if (data.hasQueueDates) {
                    setHasDateConflicts(false);
                    const dateRange = formatDateRangeForDisplay(reserveItem.startDate, reserveItem.endDate);
                    setConflictMessage(`${dateRange} - ${data.pendingConflictCount} date(s) in queue`);

                    // Only show toast if requested and not shown before
                    if (showToast && !queueToastShown.current) {
                        toast.info(`${dateRange} - ${data.pendingConflictCount} date(s) in queue`);
                        queueToastShown.current = true;
                    }
                    setHasQueueDates(true);
                    setQueueMessage(data.message);
                } else {
                    setHasDateConflicts(false);
                    setConflictMessage("");
                    if (showToast && !initialCheckDone.current) {
                        toast.success("Dates available!");
                        initialCheckDone.current = true;
                    }
                }
            } else {
                console.error("Failed to check date conflicts:", data.message);
                if (showToast) {
                    toast.warning("Unable to verify date availability.");
                }
            }
        } catch (error) {
            console.error("Error checking date conflicts:", error);
            if (showToast) {
                toast.error("Failed to check date availability.");
            }
        } finally {
            setIsCheckingConflicts(false);
        }
    };
    const validateDatesBeforeSubmission = async () => {
        setIsCheckingConflicts(true);

        try {
            const response = await fetch(`${baseUrl}/check-date-conflicts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prodCode: reserveItem.prodCode,
                    startDate: new Date(reserveItem.startDate).toISOString(),
                    endDate: new Date(reserveItem.endDate).toISOString(),
                    productId: reserveItem.id,
                    productName: reserveItem.prodName
                })
            });

            const data = await response.json();

            if (data.success && data.hasConflicts) {
                setHasDateConflicts(true);
                const dateRange = formatDateRangeForDisplay(reserveItem.startDate, reserveItem.endDate);
                setConflictMessage(`${dateRange} no longer available`);
                // Always show toast on submission attempt
                toast.error(`${dateRange} unavailable`);
                return false;
            }

            return true;
        } catch (error) {
            console.error("Error validating dates:", error);
            toast.error("Failed to verify availability");
            return false;
        } finally {
            setIsCheckingConflicts(false);
        }
    };
    // Set queue info from location state
    useEffect(() => {
        if (location.state?.queueInfo) {
            setQueueMessage(location.state.queueInfo.queueMessage);
            setHasQueueDates(location.state.queueInfo.hasQueue);
        }
    }, [location.state]);

    // Show loading while checking authentication
    if (isLoadingAuth) {
        return (
            <MainLayout>
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Verifying your session...</p>
                </div>
            </MainLayout>
        );
    }

    if (!isValidUser) {
        return null;
    }

    // if (location.pathname.includes('/billing') && !reserveItem) {
    //     return (
    //         <MainLayout>
    //             <div className="ReserveError">No reserved item found!</div>
    //         </MainLayout>
    //     );
    // }

    // Format date for storage
    const formatDateForStorage = (date) => {
        if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
            console.error("Invalid date:", date);
            return null;
        }
        return new Date(Date.UTC(
            date.getFullYear(),
            date.getMonth(),
            date.getDate()
        ));
    };

    const generateUserOrderId = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const sequentialNumber = Math.floor(1000 + Math.random() * 9000);
        return `${year}${month}${day}US${sequentialNumber}`;
    };

    const getDateRangeArray = (start, end) => {
        const dates = [];
        const current = new Date(start);
        const endDate = new Date(end);

        while (current <= endDate) {
            const formattedDate = formatDateForStorage(new Date(current));
            if (formattedDate) {
                dates.push(formattedDate);
            }
            current.setDate(current.getDate() + 1);
        }
        return dates;
    };

    const parseAmount = (amount) => {
        if (amount === null || amount === undefined || amount === '') return 0;
        if (typeof amount === 'number') return amount;
        if (typeof amount === 'string') {
            const cleaned = amount.replace(/[₹$,¥\s]/g, '').replace(/,/g, '');
            const parsed = parseFloat(cleaned);
            return isNaN(parsed) ? 0 : parsed;
        }
        const parsed = Number(amount);
        return isNaN(parsed) ? 0 : parsed;
    };

    const parsedPrice = parseAmount(reserveItem?.price || 0);
    const parsedTotalAmount = parseAmount(reserveItem?.totalAmount || 0);
    const parsedSpotPay = parseAmount(reserveItem?.SpotPay || 0);
    const parsedPrintingCost = parseAmount(reserveItem?.PrintingCost || 0);
    const parsedMountingCost = parseAmount(reserveItem?.MountingCost || 0);

    const overAllTotalAmount = parsedTotalAmount + parsedPrintingCost + parsedMountingCost;
    const gstPercentageCount = `${gstPercentage}`;
    const gstPercentageCount100 = gstPercentageCount / 100;
    const gstAmount = overAllTotalAmount * gstPercentageCount100;
    const formattedGstAmount = Math.floor(gstAmount);
    const totalAmountWithGST = overAllTotalAmount + formattedGstAmount;

    const handleCancel = () => {
        const confirmCancel = window.confirm("Are you sure you want to cancel the order?");
        if (confirmCancel) {
            if (reserveItem?.id && reserveItem?.prodName) {
                const productSlug = `${reserveItem.id}-${slugify(reserveItem.prodName, {
                    lower: true,
                    strict: true,
                    trim: true
                })}`;
                navigate(`/Product/${productSlug}`);
            } else {
                navigate('/');
            }
        }
    };

    // Updated handleSubmit with date validation
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user || !user._id) {
            toast.error("Your session has expired. Please login again.", {
                position: "top-center",
                autoClose: 4000,
            });
            localStorage.removeItem('user');
            sessionStorage.removeItem('user');
            openLogin('login', location.pathname);
            return;
        }

        if (!validateForm()) {
            toast.error("Please fill in all required fields correctly");
            return;
        }

        // CRITICAL: Check date conflicts before submission
        const areDatesAvailable = await validateDatesBeforeSubmission();

        if (!areDatesAvailable) {
            // Show conflict modal or message
            toast.error(
                "Cannot place order! Some dates are no longer available. Please go back and select new dates.",
                { autoClose: 8000 }
            );
            return;
        }

        setIsLoading(true);

        try {
            console.log("=== ORDER SUBMISSION START ===");

            if (!reserveItem?.startDate || !reserveItem?.endDate) {
                throw new Error("Invalid date range in reservation");
            }

            const startDate = new Date(reserveItem.startDate);
            const endDate = new Date(reserveItem.endDate);

            if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
                throw new Error("Invalid dates");
            }

            const bookedDates = getDateRangeArray(startDate, endDate);
            const orderId = generateUserOrderId();

            const orderData = {
                client: {
                    userId: user._id,
                    name: name,
                    email: email,
                    contact: phone,
                    company: company,
                    address: address,
                    pincode: pincode,
                    state: state,
                    city: city,
                },
                products: [{
                    id: reserveItem.id,
                    prodCode: reserveItem.prodCode,
                    name: reserveItem.prodName,
                    image: reserveItem.image,
                    price: parsedPrice,
                    printingCost: parseAmount(reserveItem.PrintingCost || 0),
                    mountingCost: parseAmount(reserveItem.MountingCost || 0),
                    lighting: reserveItem.SpotOutdoorType || "Not Specified",
                    fixedAmount: parsedSpotPay,
                    fixedAmountOffer: parseAmount(reserveItem.Offer || 0),
                    size: {
                        width: parseAmount(reserveItem.sizeWidth || 0),
                        height: parseAmount(reserveItem.sizeHeight || 0),
                        squareFeet: parseAmount(reserveItem.dimension || 0)
                    },
                    fromLocation: reserveItem.FromSpot || "Not Specified",
                    toLocation: reserveItem.ToSpot || "Not Specified",
                    rating: reserveItem.rating || 0,
                    mediaType: reserveItem.adType || "Not Specified",
                    location: {
                        state: reserveItem.state || "Not Specified",
                        district: reserveItem.district || "Not Specified"
                    },
                    booking: {
                        startDate: formatDateForStorage(startDate),
                        endDate: formatDateForStorage(endDate),
                        totalDays: reserveItem.totalDays,
                        totalPrice: parsedTotalAmount
                    },
                    bookedDates: bookedDates,
                }],
                overAllTotalAmount: overAllTotalAmount,
                gstPercentage: gstPercentage,
                gstAmount: formattedGstAmount,
                totalAmountWithGST: totalAmountWithGST,
                status: "UserSideOrder",
                order_status: "Pending Client Confirmation",
                orderType: "single"
            };

            const response = await fetch(`${baseUrl}/prodOrders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData)
            });

            const result = await response.json();

            if (!response.ok) {
                // Check if the error is due to date conflict
                if (result.message && result.message.includes("already booked")) {
                    setHasDateConflicts(true);
                    setConflictMessage(
                        "❌ Cannot place order! Some dates are no longer available.\n\n" +
                        "The dates you selected have been booked by another user.\n" +
                        "Please go back and select new dates."
                    );
                    toast.error("Dates are no longer available. Please select new dates.");
                    setIsLoading(false);
                    return;
                }
                throw new Error(result.message || 'Failed to save order');
            }

            // Send email confirmation
            try {
                const emailResponse = await fetch(
                    `${baseUrl}/OrderReserve/send-order-confirmation`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        orderId: result.orderId || result._id,
                        userName: name,
                        userEmail: email,
                        userPhone: phone,
                        userAddress: `${address}, ${city}, ${state} - ${pincode}`,
                        company,
                        products: [{
                            id: reserveItem.id,
                            prodCode: reserveItem.prodCode,
                            name: reserveItem.prodName,
                            image: reserveItem.image,
                            price: parsedPrice,
                            printingCost: parsedPrintingCost,
                            mountingCost: parsedMountingCost,
                            booking: {
                                startDate: reserveItem.startDate,
                                endDate: reserveItem.endDate,
                                totalDays: reserveItem.totalDays,
                                totalPrice: parsedTotalAmount
                            },
                            fromLocation: reserveItem.FromSpot,
                            toLocation: reserveItem.ToSpot,
                            size: {
                                width: reserveItem.sizeWidth,
                                height: reserveItem.sizeHeight,
                                squareFeet: reserveItem.dimension
                            }
                        }],
                        orderDate: new Date().toLocaleDateString(),
                        totalAmount: parsedTotalAmount,
                        overAllTotalAmount: overAllTotalAmount,
                        printingCost: parsedPrintingCost,
                        mountingCost: parsedMountingCost,
                        gstPercentage: gstPercentage,
                        gstAmount: formattedGstAmount,
                        totalAmountWithGST: totalAmountWithGST
                    })
                });

                if (!emailResponse.ok) {
                    console.error("Failed to send order confirmation email");
                }
            } catch (emailError) {
                console.error("Email sending error:", emailError);
            }

            navigate("/thank_you", {
                state: {
                    billingInfo: {
                        name,
                        email,
                        phone,
                        pincode,
                        state,
                        city,
                        address,
                        company,
                    },
                    reserveItem,
                    overAllTotalAmount,
                    gstPercentage,
                    formattedGstAmount,
                    totalAmountWithGST,
                    orderId: result.orderId || result._id,
                    orderStatus: result.order_status || "Pending Client Confirmation"
                }
            });

        } catch (error) {
            console.error("❌ Order submission error:", error);
            toast.error(`Error: ${error.message || "Failed to submit order"}`);
        } finally {
            setIsLoading(false);
        }
    };

    const safePrice = typeof reserveItem?.price === 'string'
        ? parseFloat(reserveItem.price.replace(/[^0-9.]/g, ''))
        : reserveItem?.price || 0;

    return (
        <MainLayout>
            <div>
                <MainNavbar />
                <div className="billing-container">
                    <div className="billing-header">
                        <div></div>
                        <div>BILLING DETAILS</div>
                        <div onClick={handleCancel} style={{ color: 'rgba(227, 34, 40, 1)', textAlign: 'right', alignContent: 'end', cursor: 'pointer' }} >
                            <i className="fa-regular fa-circle-xmark"></i>
                        </div>
                    </div>

                    {/* Date Conflict Warning Banner */}
                    {hasDateConflicts && (
                        <div className="date-conflict-banner">
                            <div className="billingConflictMain">
                                <i className="fa-solid fa-circle-exclamation billingExclamation" ></i>
                                <span className="billingConflictMessage">
                                    {conflictMessage}
                                </span>
                            </div>
                            <button className="billingConflictBackBtn"
                                onClick={handleCancel} >
                                ← Select New Dates
                            </button>
                        </div>
                    )}

                    {/* Queue Notice Banner */}
                    {!hasDateConflicts && hasQueueDates && (
                        <div className="queue-notice-banner_billing" >
                            <i className="fa-solid fa-clock conflict_clockBilling" ></i>
                            <span className="conflict_messageBilling">
                                {queueMessage || "Some dates are in queue. You'll be added to the waitlist."}
                            </span>
                        </div>
                    )}

                    {/* Conflict Checking Loading */}
                    {/* {isCheckingConflicts && (
                        <div className="conflict-checking-loader" style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'rgba(0,0,0,0.7)',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            zIndex: 9999
                        }}>
                            <div style={{
                                backgroundColor: 'white',
                                padding: '30px',
                                borderRadius: '10px',
                                textAlign: 'center'
                            }}>
                                <div className="spinner-border text-primary" role="status" style={{ width: '50px', height: '50px' }}>
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                                <p style={{ marginTop: '15px', fontSize: '16px' }}>Checking date availability...</p>
                            </div>
                        </div>
                    )} */}

                    <div>
                        <form onSubmit={handleSubmit} className="billing-content">
                            <div className="billing-left">
                                <div className="billing-flow">
                                    <div className="billingFlowLeftArr" onClick={handleCancel}>
                                        <i className="fa-solid fa-arrow-left"></i>
                                    </div>
                                    <div className="billing-Flowcontent"> Billing Details</div>
                                </div>

                                <div className="section-title">
                                    <div className="locationIconOutline">
                                        <img src='./images/loction_icon.svg' className="locationIcon" alt="Location" />
                                    </div>
                                    <div> Delivery Address</div>
                                </div>

                                <div className="billingSpan ">
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => {
                                            let value = e.target.value;
                                            if (/^[A-Za-z\s]*$/.test(value)) {
                                                value = value.replace(/^\s+/, "").replace(/\s+/g, " ");
                                                setName(value);
                                                setErrors(prev => ({ ...prev, name: false }));
                                            }
                                        }}
                                        onBlur={() => setName(name.trim())}
                                        className={`input-field ${errors.name ? 'AdminProdinput-errorBilling' : ''}`}
                                    />
                                    {errors.name && (
                                        <div className="AdminProderror-messageBilling">Enter a valid name</div>
                                    )}
                                    <span className={`billingInputSpan ${name.length === 0 ? "" : "inputSpanFill"}`}>
                                        Your Name*
                                    </span>
                                </div>

                                <div className="phone-input">
                                    <div>
                                        <div className={`country-code ${errors.phone ? 'AdminProdinput-errorBilling' : ''}`}>
                                            +91
                                        </div>
                                    </div>
                                    <div className="billingSpan billingPhoneSpan">
                                        <input
                                            type="tel"
                                            value={phone}
                                            maxLength='10'
                                            onChange={(e) => {
                                                setPhone(e.target.value);
                                                setErrors(prev => ({ ...prev, phone: false }));
                                            }}
                                            readOnly
                                            className={`input-field phoneInputField ${errors.phone ? 'AdminProdinput-errorBilling' : ''} `}
                                        />
                                        {errors.phone && <div className="AdminProderror-messageBillingPhone">
                                            {!phone ? "Contact is required" : "Contact must be 10 digits"}
                                        </div>}
                                        <span className={`billingInputSpan billingPhoneInputSpan ${phone.length === 0 ? "" : "inputPhoneSpanFill"}`}>Phone Number*</span>
                                    </div>
                                </div>

                                <div className="billingSpan">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                            setErrors(prev => ({ ...prev, email: false }));
                                        }}
                                        readOnly
                                        className={`input-field ${errors.email ? 'AdminProdinput-errorBilling' : ''}`}
                                    />
                                    {errors.email && <div className="AdminProderror-messageBilling">
                                        {!email ? "Email is required" : "Invalid email format"}
                                    </div>}
                                    <span className={`billingInputSpan ${email.length === 0 ? "" : "inputSpanFill"}`}>Your Email*</span>
                                </div>

                                <div className="billingSpan">
                                    <input
                                        type="tel"
                                        value={pincode}
                                        maxLength={6}
                                        onChange={(e) => {
                                            let value = e.target.value.replace(/\D/g, "");
                                            if (value.length <= 6) {
                                                setPincode(value);
                                                setErrors(prev => ({ ...prev, pincode: false }));
                                            }
                                        }}
                                        className={`input-field ${errors.pincode ? 'AdminProdinput-errorBilling' : ''}`}
                                    />
                                    {errors.pincode && (
                                        <div className="AdminProderror-messageBilling">Enter a valid 6-digit pincode</div>
                                    )}
                                    <span className={`billingInputSpan ${pincode.length === 0 ? "" : "inputSpanFill"}`}>
                                        Pincode*
                                    </span>
                                </div>

                                <div className="billingStateCity">
                                    <div className="billingSpan">
                                        <input
                                            type="text"
                                            value={state}
                                            onFocus={() => setIsOpen1(true)}
                                            readOnly
                                            className={`input-field stateInputField ${errors.state ? 'AdminProdinput-errorBilling' : ''}`}
                                        />
                                        <span className={`billingInputSpan ${state.length === 0 ? "" : "inputSpanFill"}`}>State*</span>
                                        <i
                                            className={`fa-solid ${isOpen1 ? "fa-caret-up" : "fa-caret-down"} phoneInputUpDown`}
                                            onClick={() => setIsOpen1(!isOpen1)}
                                        ></i>

                                        {isOpen1 && (
                                            <div className="billing-dropdown-container">
                                                <div className="billing-search-box">
                                                    <i className="fa-solid fa-magnifying-glass stateSearchIcon"></i>
                                                    <input
                                                        type="text"
                                                        placeholder="Search a state"
                                                        value={searchTerm}
                                                        onChange={(e) => setSearchTerm(e.target.value)}
                                                        className="billing-search-input"
                                                    />
                                                </div>
                                                <ul className="billing-state-list">
                                                    {filteredStates.length > 0 ? (
                                                        filteredStates.map((s, index) => (
                                                            <li
                                                                key={index}
                                                                className="billing-state-item"
                                                                onClick={() => {
                                                                    setState(s);
                                                                    setIsOpen1(false);
                                                                    setSearchTerm("");
                                                                }}
                                                            >
                                                                {s}
                                                            </li>
                                                        ))
                                                    ) : (
                                                        <li className="billing-no-results">No states found</li>
                                                    )}
                                                </ul>
                                            </div>
                                        )}
                                        {errors.state && <div className="AdminProderror-messageBillingState">State is required</div>}
                                    </div>

                                    <div className="billingSpan">
                                        <input
                                            type="text"
                                            value={city}
                                            onChange={(e) => {
                                                setCity(e.target.value);
                                                setErrors(prev => ({ ...prev, city: false }));
                                            }}
                                            className={`input-field cityInputField ${errors.city ? 'AdminProdinput-errorBilling' : ''} `}
                                        />
                                        {errors.city && <div className="AdminProderror-messageBilling">City is required</div>}
                                        <span className={`billingInputSpan ${city.length === 0 ? "" : "inputSpanFill"}`}>City*</span>
                                    </div>
                                </div>

                                <div className="billingSpan">
                                    <input
                                        type="text"
                                        value={company}
                                        onChange={(e) => {
                                            setCompany(e.target.value);
                                            setErrors(prev => ({ ...prev, company: false }));
                                        }}
                                        className={`input-field ${errors.company ? 'AdminProdinput-errorBilling' : ''} `}
                                    />
                                    {errors.company && <div className="AdminProderror-messageBilling">Company is required</div>}
                                    <span className={`billingInputSpan ${company.length === 0 ? "" : "inputSpanFill"}`}>Your Company*</span>
                                </div>

                                <div className="billingSpan">
                                    <input
                                        type="text"
                                        value={address}
                                        onChange={(e) => {
                                            setAddress(e.target.value);
                                            setErrors(prev => ({ ...prev, address: false }));
                                        }}
                                        className={`input-field ${errors.address ? 'AdminProdinput-errorBilling' : ''} `}
                                    />
                                    {errors.address && <div className="AdminProderror-messageBilling">Address is required</div>}
                                    <span className={`billingInputSpan ${address.length === 0 ? "" : "inputSpanFill"}`}>Address*</span>
                                </div>
                            </div>

                            <div className="billing-right">
                                <div className="billing-rightContentMain">
                                    <div>
                                        <div className="billing-section-title">Order Summary</div>
                                        <div className="billing_contents_right">
                                            <div className="billing-order-item">
                                                <img src={reserveItem?.image} alt="Product" className="billing-order-img" />
                                                <div className="billing-order-title">
                                                    <div>{reserveItem?.prodName}</div>
                                                    <div>{formatIndianCurrency(safePrice, true)} / Per Day</div>
                                                    <div>Booking Period : {reserveItem?.dateRange} ({reserveItem?.totalDays} Days)</div>
                                                    <div>Booking Amount : ₹ {formatIndianCurrency(parsedTotalAmount)}</div>
                                                    <div>Printing Cost : ₹ {formatIndianCurrency(parsedPrintingCost)}</div>
                                                    <div>Mounting Cost : ₹ {formatIndianCurrency(parsedMountingCost)}</div>
                                                </div>
                                            </div>

                                            <div className="billing-order-pricing">
                                                <div className="billing-orderContent">
                                                    <div className="billing-orderContentLeft">Base Price (Excl. GST)</div>
                                                    <div className="billing-orderContentRight">₹ {formatIndianCurrency(overAllTotalAmount)}</div>
                                                </div>
                                                <div className="billing-orderContent">
                                                    <div className="billing-orderContentLeft">GST @ {gstPercentage}%  </div>
                                                    <div className="billing-orderContentRight"> ₹ {formatIndianCurrency(formattedGstAmount)}</div>
                                                </div>

                                                <div className="billing-orderContent">
                                                    <div className="billing-orderContentLeft BillingTotalAmt">Total (Incl. GST)</div>
                                                    <div className="billing-orderContentRight BillingTotalAmt">₹ {formatIndianCurrency(totalAmountWithGST)}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="billingButton">
                                            <div className="billing-button-group" style={{ display: 'flex', gap: '10px' }}>
                                                <div>
                                                    <button
                                                        className="billingContinueBtn"
                                                        type="button"
                                                        disabled={isLoading || isCheckingConflicts}
                                                        onClick={handleCancel}
                                                        style={{ color: 'red', fontWeight: '600', border: "none", backgroundColor: "white" }}
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                                <div>
                                                    <button
                                                        className="billingContinueBtn"
                                                        type='submit'
                                                        disabled={isLoading || isCheckingConflicts || hasDateConflicts}
                                                        style={{
                                                            backgroundColor: hasDateConflicts ? '#ccc' : '',
                                                            cursor: hasDateConflicts ? 'not-allowed' : 'pointer'
                                                        }}
                                                    >
                                                        {isLoading ? "Processing..." : isCheckingConflicts ? "Checking..." : "Confirm"}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                <MainFooter />
            </div>
        </MainLayout>
    );
};

export default BillingDetails;