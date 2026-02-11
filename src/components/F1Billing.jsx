import React, { useState, useEffect } from "react";
import "./F1Billing.css";
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import MainNavbar from './A1NAVBAR.jsx';
import MainFooter from './A1FOOTER.jsx';
import { toast } from 'react-toastify';
import { MainLayout } from './MainLayout';
import { useLogin } from './LoginContext';
import { baseUrl, gstPercentage } from '../Adminpanel/BASE_URL';
import { formatIndianCurrency } from './FORMATED_AMOUNT';
import slugify from 'slugify'; // Import slugify for creating product slug

const BillingDetails = () => {
    const { productId } = useParams();
    const { user, openLogin } = useLogin();
    const navigate = useNavigate();
    const location = useLocation();

    // State to track if component should render or redirect
    const [isValidUser, setIsValidUser] = useState(false);
    const [isLoadingAuth, setIsLoadingAuth] = useState(true);

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
            // If user is null or doesn't have _id
            if (!user || !user._id) {
                console.log("User not authenticated, redirecting to login");

                // Show toast notification
                toast.info("Please login to continue with billing", {
                    position: "top-center",
                    autoClose: 3000,
                });

                // Store the current path for redirect after login
                sessionStorage.setItem('loginRedirect', location.pathname);

                // Open login modal with delay to show toast first
                setTimeout(() => {
                    openLogin('login', location.pathname);
                }, 1500);

                // Navigate to home
                navigate('/', { replace: true });
                setIsValidUser(false);
            } else {
                setIsValidUser(true);
            }
            setIsLoadingAuth(false);
        };

        // Initial check
        checkUser();

        // Listen for logout events
        const handleLogout = () => {
            setIsValidUser(false);
            navigate('/', { replace: true });
        };

        window.addEventListener('user-logged-out', handleLogout);

        return () => {
            window.removeEventListener('user-logged-out', handleLogout);
        };
    }, [user, navigate, openLogin, location.pathname]);

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
        return null; // Already redirected by useEffect
    }

    // Check if reserveItem exists
    if (location.pathname.includes('/billing') && !reserveItem) {
        return (
            <MainLayout>
                <div className="ReserveError">No reserved item found!</div>
            </MainLayout>
        );
    }

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



    // Update this function in your React component
    const generateUserOrderId = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');

        // Generate a sequential number (you might want to store this in localStorage or get from server)
        // For now, using a random number, but you should implement a proper counter
        const sequentialNumber = Math.floor(1000 + Math.random() * 9000);

        return `${year}${month}${day}US${sequentialNumber}`;
    };

    // Get date range array
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

    // // Send SMS function
    // const sendOrderSMS = async (phone, orderId, customerName, amount) => {
    //     try {
    //         const userResponse = await fetch(`${baseUrl}/OrderReserve/send-sms`, {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify({
    //                 phone,
    //                 orderId,
    //                 customerName,
    //                 amount: amount || 0
    //             })
    //         });

    //         const result = await userResponse.json();
    //         if (!userResponse.ok || !result.success) {
    //             console.error("Failed to send SMS:", result.error);
    //         } else {
    //             console.log("SMS sent successfully");
    //         }

    //         // ADMIN SMS TEMPLATE IMPLEMENTED 

    //         // Send admin SMS

    //         const adminResponse = await fetch(`${baseUrl}/OrderReserve/send-admin-sms`, {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify({
    //                 orderId,
    //                 customerName,
    //                 amount: amount || 0
    //             })
    //         });

    //         const adminResult = await adminResponse.json();
    //         if (!adminResponse.ok || !adminResult.success) {
    //             console.error("Failed to send admin SMS:", adminResult.error);
    //         } else {
    //             console.log("Admin SMS sent successfully");
    //         }
    //         // ADMIN SMS TEMPLATE IMPLEMENTED 

    //     } catch (error) {
    //         console.error("SMS sending error:", error);
    //     }
    // };

    // Parse amount function
    const parseAmount = (amount) => {
        if (amount === null || amount === undefined || amount === '') return 0;
        if (typeof amount === 'number') return amount;

        if (typeof amount === 'string') {
            // Remove any commas, currency symbols, and spaces
            const cleaned = amount.replace(/[₹$,¥\s]/g, '').replace(/,/g, '');
            const parsed = parseFloat(cleaned);
            return isNaN(parsed) ? 0 : parsed;
        }
        // Try to convert to number
        const parsed = Number(amount);
        return isNaN(parsed) ? 0 : parsed;
    };

    // Parse amounts once at the beginning
    const parsedPrice = parseAmount(reserveItem?.price || 0);
    const parsedTotalAmount = parseAmount(reserveItem?.totalAmount || 0);
    const parsedSpotPay = parseAmount(reserveItem?.SpotPay || 0);
    const parsedPrintingCost = parseAmount(reserveItem?.PrintingCost || 0);
    const parsedMountingCost = parseAmount(reserveItem?.MountingCost || 0);


    const overAllTotalAmount = parsedTotalAmount + parsedPrintingCost + parsedMountingCost
    console.log("OVERALL_TOTAL_AMOUNT:", overAllTotalAmount);

    // For multiple products, you would need to loop through all products:
    // const overAllTotalAmount = products.reduce((total, product) => {
    //   const productTotal = parseAmount(product.totalAmount || 0);
    //   const printing = parseAmount(product.PrintingCost || 0);
    //   const mounting = parseAmount(product.MountingCost || 0);
    //   return total + productTotal + printing + mounting;
    // }, 0);


    // Calculate GST (18% of the overall total)
    const gstPercentageCount = `${gstPercentage}`
    const gstPercentageCount100 = gstPercentageCount / 100
    console.log(gstPercentageCount100)
    const gstAmount = overAllTotalAmount * gstPercentageCount100;
    console.log(gstAmount)
    // Calculate total including GST
    const totalAmountWithGST = overAllTotalAmount + gstAmount;
    console.log(totalAmountWithGST)
    // Handle cancel button click
    const handleCancel = () => {
        const confirmCancel = window.confirm("Are you sure you want to cancel the order?");
        console.log("HI")
        if (confirmCancel) {
            // Create product slug for redirecting back to product page
            if (reserveItem?.id && reserveItem?.prodName) {
                const productSlug = `${reserveItem.id}-${slugify(reserveItem.prodName, {
                    lower: true,
                    strict: true,
                    trim: true
                })}`;

                console.log('Redirecting to product page with slug:', productSlug);
                navigate(`/Product/${productSlug}`);
            } else {
                // Fallback: if product info is missing, redirect to home
                console.warn('Product info missing, redirecting to home');
                navigate('/');
            }
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check user authentication
        if (!user || !user._id) {
            toast.error("Your session has expired. Please login again.", {
                position: "top-center",
                autoClose: 4000,
            });

            // Clear invalid session
            localStorage.removeItem('user');
            sessionStorage.removeItem('user');

            // Open login
            openLogin('login', location.pathname);
            return;
        }

        // Validate form first
        if (!validateForm()) {
            // toast.error("Please fill in all required fields correctly", {
            //     position: "bottom-right",
            //     autoClose: 5000,
            //     hideProgressBar: false,
            //     closeOnClick: true,
            //     pauseOnHover: true,
            //     draggable: true,
            //     progress: undefined,
            //     theme: "colored",
            // });
            return;
        }

        setIsLoading(true);

        try {
            console.log("=== ORDER SUBMISSION START ===");
            console.log("User:", user);
            console.log("Reserve Item:", reserveItem);
            console.log("Billing Info:", {
                name, email, phone, pincode, state, city, address, company
            });

            // Validate dates
            if (!reserveItem?.startDate || !reserveItem?.endDate) {
                throw new Error("Invalid date range in reservation");
            }

            const startDate = new Date(reserveItem.startDate);
            const endDate = new Date(reserveItem.endDate);

            if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
                throw new Error("Invalid dates");
            }

            // Generate dates array
            const bookedDates = getDateRangeArray(startDate, endDate);
            console.log("Booked Dates Array:", bookedDates.map(d => d.toISOString()));

            const orderId = generateUserOrderId();
            console.log("Generated Order ID:", orderId);

            // Prepare order payload
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
                overAllTotalAmount: overAllTotalAmount, // Newly sending...
                gstPercentage: gstPercentage, // Newly sending...
                gstAmount: gstAmount, // Newly sending...
                totalAmountWithGST: totalAmountWithGST, // Newly sending...
                status: "UserSideOrder",
                order_status: "Pending Client Confirmation",
                orderType: "single"
            };

            console.log("Order Payload:", JSON.stringify(orderData, null, 2));
            console.log("=== ORDER SUBMISSION PAYLOAD END ===");

            // Send to server
            const response = await fetch(`${baseUrl}/prodOrders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData)
            });

            console.log("Response Status:", response.status);
            const result = await response.json();
            console.log("Server Response:", result);

            if (!response.ok) {
                throw new Error(result.message || 'Failed to save order');
            }
            console.log("✅ Order created successfully:", result);

            // Send SMS to user only
            // try {
            //     await sendOrderSMS(phone, result.orderId || result._id, name, parsedTotalAmount);
            // } catch (smsError) {
            //     console.error("SMS sending error:", smsError);
            //     // Don't fail the order if SMS fails
            // }
            //Order confirmation mail disabled
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
                            printingCost: parsedPrintingCost, // Newly sending...
                            mountingCost: parsedMountingCost, // Newly sending...
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
                        overAllTotalAmount: overAllTotalAmount, // Newly sending...
                        printingCost: parsedPrintingCost,  // Newly sending...
                        mountingCost: parsedMountingCost,  // Newly sending...
                        gstPercentage: gstPercentage, // Newly sending...
                        gstAmount: gstAmount, // Newly sending...
                        totalAmountWithGST: totalAmountWithGST // Newly sending...
                    })
                });

                if (!emailResponse.ok) {
                    const errorData = await emailResponse.json();
                    console.error("Failed to send order confirmation email:", errorData);
                }
                else {
                    console.log("✅ Order confirmation sent successfully");
                }
            } catch (emailError) {
                console.error("Email sending error:", emailError);
            }

            // Navigate to thank you page
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
                    gstAmount,
                    totalAmountWithGST,
                    orderId: result.orderId || result._id,
                    orderStatus: result.order_status || "Pending Client Confirmation"
                }
            });

        } catch (error) {
            console.error("❌ Order submission error:", error);
            alert(`Error: ${error.message || "Failed to submit order"}`);
        } finally {
            setIsLoading(false);
        }
    }

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
                        <div onClick={handleCancel} style={{ color: 'white', textAlign: 'right', alignContent: 'end', cursor: 'pointer' }} >
                            <i className="fa-regular fa-circle-xmark"></i>
                        </div>
                    </div>
                    <div>
                        {/* Left Section: Delivery Address */}
                        <form onSubmit={handleSubmit} className="billing-content">
                            <div className="billing-left">
                                <div className="billing-flow">
                                    <div className="billingFlowLeftArr" onClick={handleCancel} > <i className="fa-solid fa-arrow-left"></i></div>
                                    <div className="billing-Flowcontent"> Billing Details</div>
                                    {/* <div className="billing-Flowcontent FlowContent">-------</div>
                                    <div className="billing-Flowcontent FlowContent1">Payments</div> */}
                                </div>

                                <div className="section-title">
                                    <div className="locationIconOutline">
                                        <img src='./images/loction_icon.svg' className="locationIcon" alt="Location" />
                                    </div>
                                    <div> Delivery Address</div>
                                </div>
                                {/* Name */}
                                <div className="billingSpan ">
                                    <input
                                        type="text"
                                        placeholder=""
                                        value={name}
                                        onChange={(e) => {
                                            let value = e.target.value;
                                            if (/^[A-Za-z\s]*$/.test(value)) {
                                                value = value.replace(/^\s+/, "").replace(/\s+/g, " ");
                                                setName(value);
                                                setErrors(prev => ({ ...prev, name: false }));
                                            }
                                        }}
                                        onBlur={() => {
                                            setName(name.trim());
                                        }}
                                        className={`input-field ${errors.name ? 'AdminProdinput-errorBilling' : ''}`}
                                    />
                                    {errors.name && (
                                        <div className="AdminProderror-messageBilling">Enter a valid name</div>
                                    )}
                                    <span className={`billingInputSpan ${name.length === 0 ? "" : "inputSpanFill"}`}>
                                        Your Name*
                                    </span>
                                </div>

                                {/* Phone */}
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
                                            }} readOnly
                                            className={`input-field phoneInputField ${errors.phone ? 'AdminProdinput-errorBilling' : ''} `}
                                        />
                                        {errors.phone && <div className="AdminProderror-messageBillingPhone">
                                            {!phone ? "Contact is required" : "Contact must be 10 digits"}
                                        </div>}
                                        <span className={`billingInputSpan billingPhoneInputSpan  ${phone.length === 0 ? "" : "inputPhoneSpanFill"}`}>Phone Number*</span>
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="billingSpan">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                            setErrors(prev => ({ ...prev, email: false }));
                                        }} readOnly
                                        className={`input-field ${errors.email ? 'AdminProdinput-errorBilling' : ''}`}
                                    />
                                    {errors.email && <div className="AdminProderror-messageBilling">
                                        {!email ? "Email is required" : "Invalid email format"}
                                    </div>}
                                    <span className={`billingInputSpan  ${email.length === 0 ? "" : "inputSpanFill"}`}>Your Email*</span>
                                </div>

                                {/* Pincode */}
                                <div className="billingSpan">
                                    <input
                                        type="tel"
                                        placeholder=""
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

                                {/* State and City */}
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

                                    {/* City */}
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
                                        {errors.city && <div className="AdminProderror-messageBilling ">City is required</div>}
                                        <span className={`billingInputSpan  ${city.length === 0 ? "" : "inputSpanFill"}`}>City*</span>
                                    </div>
                                </div>

                                {/* Company */}
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
                                    {errors.company && <div className="AdminProderror-messageBilling ">Company is required</div>}
                                    <span className={`billingInputSpan  ${company.length === 0 ? "" : "inputSpanFill"}`}>Your Company*</span>
                                </div>

                                {/* Address */}
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
                                    {errors.address && <div className="AdminProderror-messageBilling ">Address is required</div>}
                                    <span className={`billingInputSpan  ${address.length === 0 ? "" : "inputSpanFill"}`}>Address*</span>
                                </div>
                            </div>

                            {/* Right Section: Order Summary */}
                            <div className="billing-right" >
                                <div className="billing-rightContentMain" >
                                    <div>
                                        <div className="billing-section-title">Order Summary</div>
                                        <div className="billing_contents_right" >
                                            <div className="billing-order-item" >
                                                <img src={reserveItem?.image} alt="Product" className="billing-order-img" />
                                                <div className="billing-order-title">
                                                    <div>{reserveItem?.prodName}</div>
                                                    <div>{formatIndianCurrency(safePrice, true)} / Per Day</div>
                                                    <div>Booking Period : {reserveItem?.dateRange} ({reserveItem?.totalDays} Days)</div>
                                                    <div>Booking Amount : ₹ {formatIndianCurrency(parsedTotalAmount)}</div>
                                                    <div>Printing Cost : ₹ {formatIndianCurrency(parsedPrintingCost)}</div>
                                                    <div>Mounting Cost : ₹ {formatIndianCurrency(parsedMountingCost)}</div>
                                                    {/* <div>Printing Cost : ₹ {reserveItem?.PrintingCost}</div>
                                            <div>Mounting Cost : ₹ {reserveItem?.MountingCost}</div> */}
                                                </div>
                                            </div>

                                            <div className="billing-order-pricing">
                                                <div className="billing-orderContent">
                                                    <div className="billing-orderContentLeft">Base Price (Excl. GST):</div>
                                                    <div className="billing-orderContentRight">₹ {formatIndianCurrency(overAllTotalAmount)}</div>
                                                </div>
                                                <div className="billing-orderContent">
                                                    <div className="billing-orderContentLeft">GST @ {gstPercentage}% : </div>
                                                    <div className="billing-orderContentRight"> ₹ {formatIndianCurrency(gstAmount)}</div>
                                                </div>

                                                <div className="billing-orderContent">
                                                    <div className="billing-orderContentLeft BillingTotalAmt">Total (Incl. GST):</div>
                                                    <div className="billing-orderContentRight BillingTotalAmt">₹ {formatIndianCurrency(totalAmountWithGST)}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Billing button section - UPDATED with Cancel button */}
                                    <div >
                                        <div className="billingButton" >
                                            {/* <div className="billingTotalAmount"> ₹ {formatIndianCurrency(parsedTotalAmount)}</div> */}
                                            <div className="billing-button-group" style={{ display: 'flex', gap: '10px' }}>
                                                <div>
                                                    <button
                                                        className="billingContinueBtn"
                                                        type="button"
                                                        disabled={isLoading}
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
                                                        disabled={isLoading}
                                                    >
                                                        {isLoading ? "Processing..." : "Confirm"}
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