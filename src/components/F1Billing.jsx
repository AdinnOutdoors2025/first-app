import React, { useState, useEffect } from "react";
import "./F1Billing.css";
import { useNavigate, useLocation } from 'react-router-dom';
import MainNavbar from './A1NAVBAR.jsx';
import MainFooter from './A1FOOTER.jsx';
import { toast } from 'react-toastify';
//the mainLayout for login toggle then background gets blurred
import { MainLayout } from './MainLayout';
import { useLogin } from './LoginContext';
import { baseUrl } from '../Adminpanel/BASE_URL';
import { formatIndianCurrency } from './FORMATED_AMOUNT';

const BillingDetails = () => {
    const { user } = useLogin();
    //HANDLING ERRORS
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
    // Pre-fill form with user data if available
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
    const statesList = ["Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", " Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"];
    const [searchTerm, setSearchTerm] = useState("");
    const filteredStates = statesList.filter((s) =>
        s.toLowerCase().includes(searchTerm.toLowerCase())
    );
    // NAVIGATE    //If i click Continue, go to thank you page
    const navigate = useNavigate();
    // SELECTED ITEM SENT TO BILLING PAGE 
    const location = useLocation();
    const { reserveItem } = location.state || {}; // Destructure from state
    // Only show error if coming from booking path
    if (location.pathname.includes('/billing') && !reserveItem) {
        return <div className="ReserveError">No reserved item found!</div>;
    }
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
        const year = now.getFullYear().toString().slice(-2);
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        return `US${year}${month}${day}${randomNum}`;
    };
    // Helper function to generate array of all dates in range
    const getDateRangeArray = (start, end) => {
        const dates = [];
        const current = new Date(start);
        const endDate = new Date(end);

        while (current <= endDate) {
            dates.push(formatDateForStorage(new Date(current)));
            current.setDate(current.getDate() + 1);
        }

        return dates;
    };
    //NEWLY ADDED FUNCTION FOR SMS
    // Add this function to your component
    const sendOrderSMS = async (phone, orderId, isAdmin = false) => {
        try {
            const response = await fetch(`${baseUrl}/send-sms`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    phone,
                    templateId: isAdmin ? "1007478982147905431" : "1007197121174928712",
                    variables: {
                        orderId,
                        customerName: name,
                        // amount: reserveItem.SpotPay
                    }
                })
            });

            if (!response.ok) {
                console.error("Failed to send SMS");
            }
        } catch (error) {
            console.error("SMS sending error:", error);
        }
    };


     // AMOUNT CONVERTED INTO INDIAN CURRENCY
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

     // Parse the amounts once at the beginning
    const parsedPrice = parseAmount(reserveItem?.price || 0);
    const parsedTotalAmount = parseAmount(reserveItem?.totalAmount || 0);
    const parsedSpotPay = parseAmount(reserveItem?.SpotPay || 0);
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            alert("Please login to complete your order");
            return;
        }
        // Validate form first
        if (!validateForm()) {
            alert("Please fill in all required fields correctly");
            return;
        }
        setIsLoading(true);
        try {

            if (!reserveItem?.startDate || !reserveItem?.endDate) {
                throw new Error("Invalid date range in reservation");
            }
            // Use the Date objects stored in reserveItem
            const startDate = new Date(reserveItem.startDate);;
            const endDate = new Date(reserveItem.endDate);;
            if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
                throw new Error("Invalid dates");
            }
            // Generate all dates in the range for booking
            const bookedDates = getDateRangeArray(startDate, endDate);
            // // Helper function to clean and convert price strings to numbers
            // const cleanPrice = (price) => {
            //     if (typeof price === 'number') return price;
            //     if (typeof price === 'string') {
            //         // Remove commas and any non-numeric characters except decimal point
            //         const cleaned = price.replace(/[^0-9.]/g, '');
            //         return parseFloat(cleaned) || 0;
            //     }
            //     return 0;
            // };
            // Generate order ID
            const orderId = generateUserOrderId();
            // Prepare order data
            const orderData = {
                client: {
                    userId: user._id, // Link order to user
                    name: name,
                    email: email,
                    contact: phone,
                    company: company,
                    address: address,
                    pincode: pincode,
                    state: state,
                    city: city,
                //  paidAmount: cleanPrice(reserveItem.SpotPay).toString(),
                    // paidAmount: parsedSpotPay, // Use raw number

                },
                products: [{
                    id: reserveItem.id,
                    prodCode: reserveItem.prodCode,
                    name: reserveItem.prodName,
                    image: reserveItem.image,
                    price: parsedPrice,
                    // printingCost: cleanPrice(reserveItem.PrintingCost || 0), // Add if available
                    // mountingCost: cleanPrice(reserveItem.MountingCost || 0), // Add if available
                     printingCost: parseAmount(reserveItem.PrintingCost || 0),
                    mountingCost: parseAmount(reserveItem.MountingCost || 0),
                    lighting: reserveItem.SpotOutdoorType || "Not Specified", 
                    fixedAmount: parsedSpotPay, 
                    // fixedAmountOffer: cleanPrice(reserveItem.Offer || 0), 
                    // size: {
                    //     width: cleanPrice(reserveItem.sizeHeight || 0), 
                    //     height: cleanPrice(reserveItem.sizeWidth || 0), 
                    //     squareFeet: cleanPrice(reserveItem.dimension || 0)
                    // },
                     fixedAmountOffer: parseAmount(reserveItem.Offer || 0),
                    size: {
                        width: parseAmount(reserveItem.sizeHeight || 0),
                        height: parseAmount(reserveItem.sizeWidth || 0),
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
                        // currentDate: getCurrentDateFormatted(),
                        totalDays: reserveItem.totalDays,
                        // totalPrice: cleanPrice(reserveItem.totalAmount)
                        totalPrice: parsedTotalAmount
                        
                        
                    },
                    bookedDates: bookedDates,

                }],
                status: "UserSideOrder",
                orderType: "single"
            };

            // Save to database using fetch instead of axios
            const response = await fetch(`${baseUrl}/prodOrders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData)
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to save order');
            }
            const result = await response.json();
            //NEWLY ADDED CODE FOR SMS
            try {
                // Send SMS to user
                await sendOrderSMS(phone, result.orderId || result._id);

                // Send SMS to admin
                await sendOrderSMS('reactdeveloper@adinn.co.in', result.orderId || result._id, true);
            } catch (smsError) {
                console.error("SMS sending error:", smsError);
                // Don't fail the order if SMS fails
            }
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
                        totalAmount: parsedTotalAmount
                    })
                }
                );

                if (!emailResponse.ok) {
                    const errorData = await emailResponse.json();

                    console.error("Failed to send order confirmation email:", errorData);
                }
            } catch (emailError) {
                console.error("Email sending error:", emailError);
            }



            navigate("/thankyou1", {
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
                    }, reserveItem,
                    orderId: result.orderId || result._id
                }
            });
        }
        catch (error) {
            console.error("Order submission error:", error);
            alert(`Error: ${error.message || "Failed to submit order"}`);
        } finally {
            setIsLoading(false);
        }
    };

    // Ensure the amount is properly parsed
const safePrice = typeof reserveItem.price === 'string' 
    ? parseFloat(reserveItem.price.replace(/[^0-9.]/g, '')) 
    : reserveItem.price;
const safeTotalAmount = typeof reserveItem.totalAmount === 'string' 
    ? parseFloat(reserveItem.totalAmount.replace(/[^0-9.]/g, '')) 
    : reserveItem.totalAmount;

    return (
        <MainLayout>
            <div>
                <MainNavbar />
                <div className="billing-container">
                    <div className="billing-header">
                        <div>BILLING DETAILS</div>
                    </div>
                    <div >
                        {/* Left Section: Delivery Address */}
                        <form onSubmit={handleSubmit} className="billing-content">

                            <div className="billing-left">
                                <div className="billing-flow">
                                    <div className="billingFlowLeftArr" > <i class="fa-solid fa-arrow-left"></i></div>
                                    <div className="billing-Flowcontent"> Billing Details</div>
                                    <div className="billing-Flowcontent FlowContent">-------</div>
                                    <div className="billing-Flowcontent FlowContent1">Payments</div>
                                </div>

                                <div className="section-title">
                                    <div className="locationIconOutline">
                                        <img src='./images/loction_icon.svg' className="locationIcon"></img>
                                    </div>
                                    <div> Delivery Address</div>
                                </div>
                                {/* Name  */}
                                <div className="billingSpan">
                                    <input type="text"
                                        value={name}
                                        onChange={(e) => {
                                            setName(e.target.value);
                                            setErrors(prev => ({ ...prev, name: false }));
                                        }}
                                        className={`input-field ${errors.name ? 'AdminProdinput-errorBilling' : ''} `}>
                                    </input>
                                    {errors.name && <div className="AdminProderror-messageBilling ">Name is required</div>}

                                    <span className={`billingInputSpan  ${name.length === 0 ? "" : "inputSpanFill"}`}>Your Name*</span>
                                </div>
                                {/* PHONE  */}
                                <div className="phone-input">
                                    <div>
                                        <div className={`country-code ${errors.phone ? 'AdminProdinput-errorBilling' : ''}`}>
                                            +91
                                        </div>
                                    </div>
                                    <div className="billingSpan billingPhoneSpan">
                                        <input
                                            type="number"
                                            value={phone} maxLength='10'
                                            onChange={(e) => {
                                                setPhone(e.target.value);
                                                setErrors(prev => ({ ...prev, phone: false }));
                                            }}
                                            className={`input-field phoneInputField ${errors.phone ? 'AdminProdinput-errorBilling' : ''} `} />
                                        {errors.phone && <div className="AdminProderror-messageBillingPhone">
                                            {!phone ? "Contact is required" : "Contact must be 10 digits"}
                                        </div>}
                                        <span className={`billingInputSpan billingPhoneInputSpan  ${phone.length === 0 ? "" : "inputPhoneSpanFill"}`}>Phone Number*</span>
                                    </div>

                                </div>

                                {/* EMAIL  */}
                                <div className=" billingSpan">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                            setErrors(prev => ({ ...prev, email: false }));
                                        }}

                                        className={`input-field ${errors.email ? 'AdminProdinput-errorBilling' : ''}`} >

                                    </input>
                                    {errors.email && <div className="AdminProderror-messageBilling">
                                        {!email ? "Email is required" : "Invalid email format"}
                                    </div>}
                                    <span className={`billingInputSpan  ${email.length === 0 ? "" : "inputSpanFill"}`}>Your Email*</span>
                                </div>

                                {/* PINCODE  */}
                                <div className=" billingSpan">
                                    <input
                                        type="text"
                                        value={pincode}
                                        onChange={(e) => {
                                            setPincode(e.target.value);
                                            setErrors(prev => ({ ...prev, pincode: false }));
                                        }}
                                        className={`input-field ${errors.pincode ? 'AdminProdinput-errorBilling' : ''} `} pattern="[0-9]{6}">

                                    </input>
                                    {errors.pincode && <div className="AdminProderror-messageBilling ">Pincode is required</div>}

                                    <span className={`billingInputSpan  ${pincode.length === 0 ? "" : "inputSpanFill"}`}>Pincode*</span>
                                </div>

                                {/* STATE CITY  */}
                                <div className="billingStateCity">
                                    <div className="billingSpan">
                                        {/* Input Field */}
                                        <input
                                            type="text"
                                            value={state}
                                            onFocus={() => setIsOpen1(true)}
                                            readOnly
                                            className={`input-field stateInputField ${errors.state ? 'AdminProdinput-errorBilling' : ''}`}
                                        />
                                        <span className={`billingInputSpan ${state.length === 0 ? "" : "inputSpanFill"}`}>State*</span>
                                        {/* Dropdown Icon */}
                                        <i
                                            className={`fa-solid ${isOpen1 ? "fa-caret-up" : "fa-caret-down"} phoneInputUpDown`}
                                            onClick={() => setIsOpen1(!isOpen1)}
                                        ></i>

                                        {/* Dropdown List */}
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
                                        {/* Error Message */}
                                        {errors.state && <div className="AdminProderror-messageBillingState">State is required</div>}
                                    </div>
                                    {/* CITY  */}
                                    <div className=" billingSpan">
                                        <input
                                            type="text"
                                            value={city}
                                            onChange={(e) => {
                                                setCity(e.target.value);
                                                setErrors(prev => ({ ...prev, city: false }));
                                            }} className={`input-field cityInputField ${errors.city ? 'AdminProdinput-errorBilling' : ''} `}
                                        />
                                        {errors.city && <div className="AdminProderror-messageBilling ">City is required</div>}

                                        <span className={`billingInputSpan  ${city.length === 0 ? "" : "inputSpanFill"}`}>City*</span>
                                    </div>
                                </div>
                                {/* Company  */}
                                <div className=" billingSpan">
                                    <input
                                        type="text"
                                        value={company}
                                        onChange={(e) => {
                                            setCompany(e.target.value);
                                            setErrors(prev => ({ ...prev, company: false }));
                                        }} className={`input-field ${errors.company ? 'AdminProdinput-errorBilling' : ''} `} />
                                    {errors.company && <div className="AdminProderror-messageBilling ">Company is required</div>}

                                    <span className={`billingInputSpan  ${company.length === 0 ? "" : "inputSpanFill"}`}>Your Company*</span>
                                </div>

                                {/* ADDRESS HOUSE NUMBER, APARTMENT  */}
                                <div className=" billingSpan">
                                    <input
                                        type="text"
                                        value={address}
                                        onChange={(e) => {
                                            setAddress(e.target.value);
                                            setErrors(prev => ({ ...prev, address: false }));
                                        }} className={`input-field ${errors.address ? 'AdminProdinput-errorBilling' : ''} `} />
                                    {errors.address && <div className="AdminProderror-messageBilling ">Address is required</div>}

                                    <span className={`billingInputSpan  ${address.length === 0 ? "" : "inputSpanFill"}`}>Address*</span>
                                </div>



                            </div>

                            {/* Right Section: Order Summary */}
                            <div className="billing-right">
                                <div className="billing-section-title">Order Summary</div>
                                <div className="billing_contents_right">

                                    <div className="billing-order-item" >
                                        <img src={reserveItem.image} alt="Product" className="billing-order-img" />
                                        <div className="billing-order-title">
                                            <div>{reserveItem.prodName}</div>
                                            {/* <div>₹ {reserveItem.price.toLocaleString()} Per Day</div> */}
                                            <div>{formatIndianCurrency(safePrice, true)} Per Day</div>

                                            <div>Booked date : {reserveItem.dateRange} ({reserveItem.totalDays} Days)</div>
                                            <div>Booked Amount : {formatIndianCurrency(parsedTotalAmount)}</div>
                                        </div>
                                    </div>


                                    <div className="billing-order-pricing">
                                        <div className="billing-orderContent">
                                            <div className="billing-orderContentLeft">Price</div>
                                            {/* <div className="billing-orderContentRight">₹{reserveItem.SpotPay.toLocaleString()}</div> */}
                                            <div className="billing-orderContentRight">{formatIndianCurrency(parsedTotalAmount)}</div>

                                        </div>

                                        <div className="billing-orderContent">
                                            <div className="billing-orderContentLeft BillingTotalAmt">Total Amount</div>
                                            {/* <div className="billing-orderContentRight BillingTotalAmt">₹{reserveItem.SpotPay.toLocaleString()}</div> */}
                                            <div className="billing-orderContentRight BillingTotalAmt">{formatIndianCurrency(parsedTotalAmount)}</div>

                                        </div>
                                    </div>
                                    <div className="billingNoteContent">
                                        <span className="billingNote"> NOTE : &nbsp;</span>This is for only Reservation Price. For Further details Our team will contact you
                                    </div>


                                </div>
                                {/* Billing button  */}
                                <div className="billingButton">
                                    {/* <div> ₹{reserveItem.SpotPay.toLocaleString()}</div> */}
                                    <div className="billingTotalAmount"> {formatIndianCurrency(parsedTotalAmount)}</div>
                                    <div> <button className="billingContinueBtn" type='submit'
                                        disabled={isLoading} >
                                        {isLoading ? "Processing..." : "Continue"}

                                    </button> </div>
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