// import React, { useState, useEffect } from "react";
// import "./F1Billing.css";
// import { useNavigate, useLocation } from 'react-router-dom';
// import MainNavbar from './A1NAVBAR.jsx';
// import MainFooter from './A1FOOTER.jsx';
// import { toast } from 'react-toastify';
// //the mainLayout for login toggle then background gets blurred
// import { MainLayout } from './MainLayout';
// import { useLogin } from './LoginContext';
// import { baseUrl } from '../Adminpanel/BASE_URL';
// import { formatIndianCurrency } from './FORMATED_AMOUNT';

// const BillingDetails = () => {
//     const { user } = useLogin();
//     //HANDLING ERRORS
//     const [errors, setErrors] = useState({
//         name: false,
//         phone: false,
//         email: false,
//         pincode: false,
//         state: false,
//         city: false,
//         address: false,
//         company: false,
//     });

//     const validateForm = () => {
//         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//         const newErrors = {
//             name: !name,
//             phone: !phone || phone.toString().length !== 10,
//             email: !email || !emailRegex.test(email),
//             pincode: !pincode,
//             state: !state,
//             city: !city,
//             address: !address,
//             company: !company,
//         };
//         setErrors(newErrors);
//         return !Object.values(newErrors).some(error => error);
//     };
//     // Pre-fill form with user data if available
//     const [name, setName] = useState(user?.userName || "");
//     const [phone, setPhone] = useState(user?.userPhone || "");
//     const [email, setEmail] = useState(user?.userEmail || "");
//     const [pincode, setPincode] = useState("");
//     const [state, setState] = useState("");
//     const [city, setCity] = useState("");
//     const [address, setAddress] = useState("");
//     const [company, setCompany] = useState('');
//     const [isOpen, setIsOpen] = useState(false);
//     const [isOpen1, setIsOpen1] = useState(false);
//     const [isLoading, setIsLoading] = useState(false);
//     const statesList = ["Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", " Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"];
//     const [searchTerm, setSearchTerm] = useState("");
//     const filteredStates = statesList.filter((s) =>
//         s.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//     // NAVIGATE    //If i click Continue, go to thank you page
//     const navigate = useNavigate();
//     // SELECTED ITEM SENT TO BILLING PAGE 
//     const location = useLocation();
//     const { reserveItem } = location.state || {}; // Destructure from state
//     // Only show error if coming from booking path
//     if (location.pathname.includes('/billing') && !reserveItem) {
//         return <div className="ReserveError">No reserved item found!</div>;
//     }
//     const formatDateForStorage = (date) => {
//         if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
//             console.error("Invalid date:", date);
//             return null;
//         }
//         return new Date(Date.UTC(
//             date.getFullYear(),
//             date.getMonth(),
//             date.getDate()
//         ));
//     };
//     const generateUserOrderId = () => {
//         const now = new Date();
//         const year = now.getFullYear().toString().slice(-2);
//         const month = String(now.getMonth() + 1).padStart(2, '0');
//         const day = String(now.getDate()).padStart(2, '0');
//         const randomNum = Math.floor(1000 + Math.random() * 9000);
//         return `US${year}${month}${day}${randomNum}`;
//     };
//     // Helper function to generate array of all dates in range
//     const getDateRangeArray = (start, end) => {
//         const dates = [];
//         const current = new Date(start);
//         const endDate = new Date(end);

//         while (current <= endDate) {
//             dates.push(formatDateForStorage(new Date(current)));
//             current.setDate(current.getDate() + 1);
//         }

//         return dates;
//     };
//     //NEWLY ADDED FUNCTION FOR SMS
//     const sendOrderSMS = async (phone, orderId, isAdmin = false) => {
//         try {
//             const response = await fetch(`${baseUrl}/send-sms`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                     phone,
//                     templateId: "1007197121174928712",
//                     variables: {
//                         orderId,
//                         customerName: name,
//                         amount: reserveItem.SpotPay
//                     }
//                 })
//             });

//             if (!response.ok) {
//                 console.error("Failed to send SMS");
//             }
//         } catch (error) {
//             console.error("SMS sending error:", error);
//         }
//     };


//      // AMOUNT CONVERTED INTO INDIAN CURRENCY
//     const parseAmount = (amount) => {
//         if (amount === null || amount === undefined || amount === '') return 0;
//         if (typeof amount === 'number') return amount;

//         if (typeof amount === 'string') {
//             // Remove any commas, currency symbols, and spaces
//             const cleaned = amount.replace(/[₹$,¥\s]/g, '').replace(/,/g, '');
//             const parsed = parseFloat(cleaned);
//             return isNaN(parsed) ? 0 : parsed;
//         }
//         // Try to convert to number
//         const parsed = Number(amount);
//         return isNaN(parsed) ? 0 : parsed;
//     };

//      // Parse the amounts once at the beginning
//     const parsedPrice = parseAmount(reserveItem?.price || 0);
//     const parsedTotalAmount = parseAmount(reserveItem?.totalAmount || 0);
//     const parsedSpotPay = parseAmount(reserveItem?.SpotPay || 0);


//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         if (!user) {
//             alert("Please login to complete your order");
//             return;
//         }
//         // Validate form first
//         if (!validateForm()) {
//             alert("Please fill in all required fields correctly");
//             return;
//         }
//         setIsLoading(true);
//         try {

//             if (!reserveItem?.startDate || !reserveItem?.endDate) {
//                 throw new Error("Invalid date range in reservation");
//             }
//             // Use the Date objects stored in reserveItem
//             const startDate = new Date(reserveItem.startDate);;
//             const endDate = new Date(reserveItem.endDate);;
//             if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
//                 throw new Error("Invalid dates");
//             }
//             // Generate all dates in the range for booking
//             const bookedDates = getDateRangeArray(startDate, endDate);
//             // // Helper function to clean and convert price strings to numbers
//             // const cleanPrice = (price) => {
//             //     if (typeof price === 'number') return price;
//             //     if (typeof price === 'string') {
//             //         // Remove commas and any non-numeric characters except decimal point
//             //         const cleaned = price.replace(/[^0-9.]/g, '');
//             //         return parseFloat(cleaned) || 0;
//             //     }
//             //     return 0;
//             // };
//             // Generate order ID
//             const orderId = generateUserOrderId();
//             // Prepare order data
//             const orderData = {
//                 client: {
//                     userId: user._id, // Link order to user
//                     name: name,
//                     email: email,
//                     contact: phone,
//                     company: company,
//                     address: address,
//                     pincode: pincode,
//                     state: state,
//                     city: city,
//                 //  paidAmount: cleanPrice(reserveItem.SpotPay).toString(),
//                     // paidAmount: parsedSpotPay, // Use raw number

//                 },
//                 products: [{
//                     id: reserveItem.id,
//                     prodCode: reserveItem.prodCode,
//                     name: reserveItem.prodName,
//                     image: reserveItem.image,
//                     price: parsedPrice,
//                     // printingCost: cleanPrice(reserveItem.PrintingCost || 0), // Add if available
//                     // mountingCost: cleanPrice(reserveItem.MountingCost || 0), // Add if available
//                      printingCost: parseAmount(reserveItem.PrintingCost || 0),
//                     mountingCost: parseAmount(reserveItem.MountingCost || 0),
//                     lighting: reserveItem.SpotOutdoorType || "Not Specified", 
//                     fixedAmount: parsedSpotPay, 
//                     // fixedAmountOffer: cleanPrice(reserveItem.Offer || 0), 
//                     // size: {
//                     //     width: cleanPrice(reserveItem.sizeHeight || 0), 
//                     //     height: cleanPrice(reserveItem.sizeWidth || 0), 
//                     //     squareFeet: cleanPrice(reserveItem.dimension || 0)
//                     // },
//                      fixedAmountOffer: parseAmount(reserveItem.Offer || 0),
//                     size: {
//                         width: parseAmount(reserveItem.sizeHeight || 0),
//                         height: parseAmount(reserveItem.sizeWidth || 0),
//                         squareFeet: parseAmount(reserveItem.dimension || 0)
//                     },
//                     fromLocation: reserveItem.FromSpot || "Not Specified", 
//                     toLocation: reserveItem.ToSpot || "Not Specified", 
//                     rating: reserveItem.rating || 0, 
//                     mediaType: reserveItem.adType || "Not Specified", 
//                     location: {
//                         state: reserveItem.state || "Not Specified", 
//                         district: reserveItem.district || "Not Specified" 
//                     },
//                     booking: {
//                         startDate: formatDateForStorage(startDate),
//                         endDate: formatDateForStorage(endDate),
//                         // currentDate: getCurrentDateFormatted(),
//                         totalDays: reserveItem.totalDays,
//                         // totalPrice: cleanPrice(reserveItem.totalAmount)
//                         totalPrice: parsedTotalAmount


//                     },
//                     bookedDates: bookedDates,

//                 }],
//                 status: "UserSideOrder",
//                 orderType: "single"
//             };

//             // Save to database using fetch instead of axios
//             const response = await fetch(`${baseUrl}/prodOrders`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(orderData)
//             });
//             if (!response.ok) {
//                 const errorData = await response.json();
//                 throw new Error(errorData.message || 'Failed to save order');
//             }
//             const result = await response.json();
//             //NEWLY ADDED CODE FOR SMS
//             try {
//                 // Send SMS to user
//                 await sendOrderSMS(phone, result.orderId || result._id);

//                 // Send SMS to admin
//                 // await sendOrderSMS('reactdeveloper@adinn.co.in', result.orderId || result._id, true);
//             } catch (smsError) {
//                 console.error("SMS sending error:", smsError);
//                 // Don't fail the order if SMS fails
//             }
//             try {
//                 const emailResponse = await fetch(
//                     `${baseUrl}/OrderReserve/send-order-confirmation`, {
//                     method: 'POST',
//                     headers: {
//                         'Content-Type': 'application/json',
//                     },
//                     body: JSON.stringify({
//                         orderId: result.orderId || result._id,
//                         userName: name,
//                         userEmail: email,
//                         userPhone: phone,
//                         userAddress: `${address}, ${city}, ${state} - ${pincode}`,
//                         company,
//                         products: [{
//                             id: reserveItem.id,
//                             prodCode: reserveItem.prodCode,
//                             name: reserveItem.prodName,
//                             image: reserveItem.image,
//                             price: parsedPrice,
//                             booking: {
//                                 startDate: reserveItem.startDate,
//                                 endDate: reserveItem.endDate,
//                                 totalDays: reserveItem.totalDays,
//                                 totalPrice: parsedTotalAmount
//                             },
//                             fromLocation: reserveItem.FromSpot,
//                             toLocation: reserveItem.ToSpot,
//                             size: {
//                                 width: reserveItem.sizeWidth,
//                                 height: reserveItem.sizeHeight,
//                                 squareFeet: reserveItem.dimension
//                             }
//                         }],
//                         orderDate: new Date().toLocaleDateString(),
//                         totalAmount: parsedTotalAmount
//                     })
//                 }
//                 );

//                 if (!emailResponse.ok) {
//                     const errorData = await emailResponse.json();

//                     console.error("Failed to send order confirmation email:", errorData);
//                 }
//             } catch (emailError) {
//                 console.error("Email sending error:", emailError);
//             }



//             navigate("/thankyou1", {
//                 state: {
//                     billingInfo: {
//                         name,
//                         email,
//                         phone,
//                         pincode,
//                         state,
//                         city,
//                         address,
//                         company,
//                     }, reserveItem,
//                     orderId: result.orderId || result._id
//                 }
//             });
//         }
//         catch (error) {
//             console.error("Order submission error:", error);
//             alert(`Error: ${error.message || "Failed to submit order"}`);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     // Ensure the amount is properly parsed
// const safePrice = typeof reserveItem.price === 'string' 
//     ? parseFloat(reserveItem.price.replace(/[^0-9.]/g, '')) 
//     : reserveItem.price;
// const safeTotalAmount = typeof reserveItem.totalAmount === 'string' 
//     ? parseFloat(reserveItem.totalAmount.replace(/[^0-9.]/g, '')) 
//     : reserveItem.totalAmount;

//     return (
//         <MainLayout>
//             <div>
//                 <MainNavbar />
//                 <div className="billing-container">
//                     <div className="billing-header">
//                         <div>BILLING DETAILS</div>
//                     </div>
//                     <div >
//                         {/* Left Section: Delivery Address */}
//                         <form onSubmit={handleSubmit} className="billing-content">

//                             <div className="billing-left">
//                                 <div className="billing-flow">
//                                     <div className="billingFlowLeftArr" > <i class="fa-solid fa-arrow-left"></i></div>
//                                     <div className="billing-Flowcontent"> Billing Details</div>
//                                     <div className="billing-Flowcontent FlowContent">-------</div>
//                                     <div className="billing-Flowcontent FlowContent1">Payments</div>
//                                 </div>

//                                 <div className="section-title">
//                                     <div className="locationIconOutline">
//                                         <img src='./images/loction_icon.svg' className="locationIcon"></img>
//                                     </div>
//                                     <div> Delivery Address</div>
//                                 </div>
//                                 {/* Name  */}
//                                 <div className="billingSpan">
//                                     <input type="text"
//                                         value={name}
//                                         onChange={(e) => {
//                                             setName(e.target.value);
//                                             setErrors(prev => ({ ...prev, name: false }));
//                                         }}
//                                         className={`input-field ${errors.name ? 'AdminProdinput-errorBilling' : ''} `}>
//                                     </input>
//                                     {errors.name && <div className="AdminProderror-messageBilling ">Name is required</div>}

//                                     <span className={`billingInputSpan  ${name.length === 0 ? "" : "inputSpanFill"}`}>Your Name*</span>
//                                 </div>
//                                 {/* PHONE  */}
//                                 <div className="phone-input">
//                                     <div>
//                                         <div className={`country-code ${errors.phone ? 'AdminProdinput-errorBilling' : ''}`}>
//                                             +91
//                                         </div>
//                                     </div>
//                                     <div className="billingSpan billingPhoneSpan">
//                                         <input
//                                             type="number"
//                                             value={phone} maxLength='10'
//                                             onChange={(e) => {
//                                                 setPhone(e.target.value);
//                                                 setErrors(prev => ({ ...prev, phone: false }));
//                                             }}
//                                             className={`input-field phoneInputField ${errors.phone ? 'AdminProdinput-errorBilling' : ''} `} />
//                                         {errors.phone && <div className="AdminProderror-messageBillingPhone">
//                                             {!phone ? "Contact is required" : "Contact must be 10 digits"}
//                                         </div>}
//                                         <span className={`billingInputSpan billingPhoneInputSpan  ${phone.length === 0 ? "" : "inputPhoneSpanFill"}`}>Phone Number*</span>
//                                     </div>

//                                 </div>

//                                 {/* EMAIL  */}
//                                 <div className=" billingSpan">
//                                     <input
//                                         type="email"
//                                         value={email}
//                                         onChange={(e) => {
//                                             setEmail(e.target.value);
//                                             setErrors(prev => ({ ...prev, email: false }));
//                                         }}

//                                         className={`input-field ${errors.email ? 'AdminProdinput-errorBilling' : ''}`} >

//                                     </input>
//                                     {errors.email && <div className="AdminProderror-messageBilling">
//                                         {!email ? "Email is required" : "Invalid email format"}
//                                     </div>}
//                                     <span className={`billingInputSpan  ${email.length === 0 ? "" : "inputSpanFill"}`}>Your Email*</span>
//                                 </div>

//                                 {/* PINCODE  */}
//                                 <div className=" billingSpan">
//                                     <input
//                                         type="text"
//                                         value={pincode}
//                                         onChange={(e) => {
//                                             setPincode(e.target.value);
//                                             setErrors(prev => ({ ...prev, pincode: false }));
//                                         }}
//                                         className={`input-field ${errors.pincode ? 'AdminProdinput-errorBilling' : ''} `} pattern="[0-9]{6}">

//                                     </input>
//                                     {errors.pincode && <div className="AdminProderror-messageBilling ">Pincode is required</div>}

//                                     <span className={`billingInputSpan  ${pincode.length === 0 ? "" : "inputSpanFill"}`}>Pincode*</span>
//                                 </div>

//                                 {/* STATE CITY  */}
//                                 <div className="billingStateCity">
//                                     <div className="billingSpan">
//                                         {/* Input Field */}
//                                         <input
//                                             type="text"
//                                             value={state}
//                                             onFocus={() => setIsOpen1(true)}
//                                             readOnly
//                                             className={`input-field stateInputField ${errors.state ? 'AdminProdinput-errorBilling' : ''}`}
//                                         />
//                                         <span className={`billingInputSpan ${state.length === 0 ? "" : "inputSpanFill"}`}>State*</span>
//                                         {/* Dropdown Icon */}
//                                         <i
//                                             className={`fa-solid ${isOpen1 ? "fa-caret-up" : "fa-caret-down"} phoneInputUpDown`}
//                                             onClick={() => setIsOpen1(!isOpen1)}
//                                         ></i>

//                                         {/* Dropdown List */}
//                                         {isOpen1 && (
//                                             <div className="billing-dropdown-container">
//                                                 <div className="billing-search-box">
//                                                     <i className="fa-solid fa-magnifying-glass stateSearchIcon"></i>
//                                                     <input
//                                                         type="text"
//                                                         placeholder="Search a state"
//                                                         value={searchTerm}
//                                                         onChange={(e) => setSearchTerm(e.target.value)}
//                                                         className="billing-search-input"
//                                                     />
//                                                 </div>
//                                                 <ul className="billing-state-list">
//                                                     {filteredStates.length > 0 ? (
//                                                         filteredStates.map((s, index) => (
//                                                             <li
//                                                                 key={index}
//                                                                 className="billing-state-item"
//                                                                 onClick={() => {
//                                                                     setState(s);
//                                                                     setIsOpen1(false);
//                                                                     setSearchTerm("");
//                                                                 }}
//                                                             >
//                                                                 {s}
//                                                             </li>
//                                                         ))
//                                                     ) : (
//                                                         <li className="billing-no-results">No states found</li>
//                                                     )}
//                                                 </ul>
//                                             </div>
//                                         )}
//                                         {/* Error Message */}
//                                         {errors.state && <div className="AdminProderror-messageBillingState">State is required</div>}
//                                     </div>
//                                     {/* CITY  */}
//                                     <div className=" billingSpan">
//                                         <input
//                                             type="text"
//                                             value={city}
//                                             onChange={(e) => {
//                                                 setCity(e.target.value);
//                                                 setErrors(prev => ({ ...prev, city: false }));
//                                             }} className={`input-field cityInputField ${errors.city ? 'AdminProdinput-errorBilling' : ''} `}
//                                         />
//                                         {errors.city && <div className="AdminProderror-messageBilling ">City is required</div>}

//                                         <span className={`billingInputSpan  ${city.length === 0 ? "" : "inputSpanFill"}`}>City*</span>
//                                     </div>
//                                 </div>
//                                 {/* Company  */}
//                                 <div className=" billingSpan">
//                                     <input
//                                         type="text"
//                                         value={company}
//                                         onChange={(e) => {
//                                             setCompany(e.target.value);
//                                             setErrors(prev => ({ ...prev, company: false }));
//                                         }} className={`input-field ${errors.company ? 'AdminProdinput-errorBilling' : ''} `} />
//                                     {errors.company && <div className="AdminProderror-messageBilling ">Company is required</div>}

//                                     <span className={`billingInputSpan  ${company.length === 0 ? "" : "inputSpanFill"}`}>Your Company*</span>
//                                 </div>

//                                 {/* ADDRESS HOUSE NUMBER, APARTMENT  */}
//                                 <div className=" billingSpan">
//                                     <input
//                                         type="text"
//                                         value={address}
//                                         onChange={(e) => {
//                                             setAddress(e.target.value);
//                                             setErrors(prev => ({ ...prev, address: false }));
//                                         }} className={`input-field ${errors.address ? 'AdminProdinput-errorBilling' : ''} `} />
//                                     {errors.address && <div className="AdminProderror-messageBilling ">Address is required</div>}

//                                     <span className={`billingInputSpan  ${address.length === 0 ? "" : "inputSpanFill"}`}>Address*</span>
//                                 </div>



//                             </div>

//                             {/* Right Section: Order Summary */}
//                             <div className="billing-right">
//                                 <div className="billing-section-title">Order Summary</div>
//                                 <div className="billing_contents_right">

//                                     <div className="billing-order-item" >
//                                         <img src={reserveItem.image} alt="Product" className="billing-order-img" />
//                                         <div className="billing-order-title">
//                                             <div>{reserveItem.prodName}</div>
//                                             {/* <div>₹ {reserveItem.price.toLocaleString()} Per Day</div> */}
//                                             <div>{formatIndianCurrency(safePrice, true)} Per Day</div>

//                                             <div>Booked date : {reserveItem.dateRange} ({reserveItem.totalDays} Days)</div>
//                                             <div>Booked Amount : {formatIndianCurrency(parsedTotalAmount)}</div>
//                                         </div>
//                                     </div>


//                                     <div className="billing-order-pricing">
//                                         <div className="billing-orderContent">
//                                             <div className="billing-orderContentLeft">Price</div>
//                                             {/* <div className="billing-orderContentRight">₹{reserveItem.SpotPay.toLocaleString()}</div> */}
//                                             <div className="billing-orderContentRight">{formatIndianCurrency(parsedTotalAmount)}</div>

//                                         </div>

//                                         <div className="billing-orderContent">
//                                             <div className="billing-orderContentLeft BillingTotalAmt">Total Amount</div>
//                                             {/* <div className="billing-orderContentRight BillingTotalAmt">₹{reserveItem.SpotPay.toLocaleString()}</div> */}
//                                             <div className="billing-orderContentRight BillingTotalAmt">{formatIndianCurrency(parsedTotalAmount)}</div>

//                                         </div>
//                                     </div>
//                                     <div className="billingNoteContent">
//                                         <span className="billingNote"> NOTE : &nbsp;</span>This is for only Reservation Price. For Further details Our team will contact you
//                                     </div>


//                                 </div>
//                                 {/* Billing button  */}
//                                 <div className="billingButton">
//                                     {/* <div> ₹{reserveItem.SpotPay.toLocaleString()}</div> */}
//                                     <div className="billingTotalAmount"> {formatIndianCurrency(parsedTotalAmount)}</div>
//                                     <div> <button className="billingContinueBtn" type='submit'
//                                         disabled={isLoading} >
//                                         {isLoading ? "Processing..." : "Continue"}

//                                     </button> </div>
//                                 </div>

//                             </div>
//                         </form>
//                     </div>
//                 </div>
//                 <MainFooter />
//             </div>
//         </MainLayout>
//     );
// };
// export default BillingDetails;






//PERFECT CODE FOR HANDLING THE LOGOUT FUNCTIONALITY WHEN RESTRICT THE PAGES
import React, { useState, useEffect } from "react";
import "./F1Billing.css";
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import MainNavbar from './A1NAVBAR.jsx';
import MainFooter from './A1FOOTER.jsx';
import { toast } from 'react-toastify';
//the mainLayout for login toggle then background gets blurred
import { MainLayout } from './MainLayout';
import { useLogin } from './LoginContext';
import { baseUrl } from '../Adminpanel/BASE_URL';
import { formatIndianCurrency } from './FORMATED_AMOUNT';

const BillingDetails = () => {

    const { productId } = useParams();
    const { user, openLogin } = useLogin();
    // NAVIGATE    //If i click Continue, go to thank you page
    const navigate = useNavigate();
    // SELECTED ITEM SENT TO BILLING PAGE 
    const location = useLocation();



//LOADING ERROR HANDLING WHILE LOGOUT



// State to track if component should render or redirect
    const [isValidUser, setIsValidUser] = useState(false);
    const [isLoadingAuth, setIsLoadingAuth] = useState(true);

 
//LOADING ERROR HANDLING WHILE LOGOUT


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


    // {/* //ADD LOADING STATES WHEN LOGIN / SIGNUP */}

    // // Or use a more direct approach with LoginContext:
    // useEffect(() => {
    //     if (!user || !user._id) {
    //         // If user is not logged in, redirect to home
    //         navigate('/', { replace: true });
    //     }
    // }, [user, navigate]);

    // {/* //ADD LOADING STATES WHEN LOGIN / SIGNUP */}



    // Add this to BillingDetails.js before the form submit
    const [queueMessage, setQueueMessage] = useState('');
    const [hasQueueDates, setHasQueueDates] = useState(false);
    useEffect(() => {
        if (location.state?.queueInfo) {
            setQueueMessage(location.state.queueInfo.queueMessage);
            setHasQueueDates(location.state.queueInfo.hasQueue);
        }
    }, [location.state]);
//LOADING ERROR HANDLING WHILE LOGOUT

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

    // Don't render billing form if user is not valid
    if (!isValidUser) {
        return null; // Already redirected by useEffect
    }  

//LOADING ERROR HANDLING WHILE LOGOUT

    const { reserveItem } = location.state || {}; // Destructure from state
    console.log('RESERVE ITEM', reserveItem);
    // Only show error if coming from booking path
    if (location.pathname.includes('/billing') && !reserveItem) {
        return <div className="ReserveError">No reserved item found!</div>;
    }
    // const formatDateForStorage = (date) => {
    //     if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    //         console.error("Invalid date:", date);
    //         return null;
    //     }
    //     return new Date(Date.UTC(
    //         date.getFullYear(),
    //         date.getMonth(),
    //         date.getDate()
    //     ));
    // };
    // Update the formatDateForStorage function
    const formatDateForStorage = (date) => {
        if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
            console.error("Invalid date:", date);
            return null;
        }

        try {
            return new Date(Date.UTC(
                date.getFullYear(),
                date.getMonth(),
                date.getDate()
            ));
        } catch (error) {
            console.error("Error formatting date for storage:", error);
            return null;
        }
    };

    const generateUserOrderId = () => {
        const now = new Date();
        const year = now.getFullYear().toString().slice(-2);
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        return `US${year}${month}${day}${randomNum}`;
    };
   
    // Update the getDateRangeArray function
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

    // // UPDATED SMS FUNCTION - SIMPLIFIED
    // const sendOrderSMS = async (phone, orderId, customerName, amount) => {
    //     try {
    //         const response = await fetch(`${baseUrl}/send-sms`, {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify({
    //                 phone,
    //                 templateId: "1007197121174928712", // User template only
    //                 variables: {
    //                     orderId,
    //                     customerName,
    //                     amount: amount || 0
    //                 }
    //             })
    //         });

    //         const result = await response.json();
    //         if (!response.ok || !result.success) {
    //             console.error("Failed to send SMS:", result.error);
    //         } else {
    //             console.log("SMS sent successfully");
    //         }
    //     } catch (error) {
    //         console.error("SMS sending error:", error);
    //         // Don't throw error - continue with order processing
    //     }
    // };



    const sendOrderSMS = async (phone, orderId, customerName, amount) => {
        try {
            const response = await fetch(`${baseUrl}/OrderReserve/send-sms`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    phone,
                    orderId,
                    customerName,
                    amount: amount || 0
                    // Remove templateId from here
                })
            });

            const result = await response.json();
            if (!response.ok || !result.success) {
                console.error("Failed to send SMS:", result.error);
            } else {
                console.log("SMS sent successfully");
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

    // Update the handleSubmit function in BillingDetails.js
    // const handleSubmit = async (e) => {
    //   e.preventDefault();
    //   if (!user) {
    //     alert("Please login to complete your order");
    //     return;
    //   }

    //   // Validate form first
    //   if (!validateForm()) {
    //     alert("Please fill in all required fields correctly");
    //     return;
    //   }

    //   setIsLoading(true);
    //   try {
    //     if (!reserveItem?.startDate || !reserveItem?.endDate) {
    //       throw new Error("Invalid date range in reservation");
    //     }

    //     // Use the Date objects stored in reserveItem
    //     const startDate = new Date(reserveItem.startDate);
    //     const endDate = new Date(reserveItem.endDate);
    //     if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    //       throw new Error("Invalid dates");
    //     }

    //     // Generate all dates in the range for booking
    //     const bookedDates = getDateRangeArray(startDate, endDate);

    //     // Generate order ID
    //     const orderId = generateUserOrderId();

    //     // Calculate if there are pending dates in selection
    //     const pendingCount = reserveItem.pendingDatesCount || 0;

    //     // Prepare order data with CORRECT order_status
    //     const orderData = {
    //       client: {
    //         userId: user._id,
    //         name: name,
    //         email: email,
    //         contact: phone,
    //         company: company,
    //         address: address,
    //         pincode: pincode,
    //         state: state,
    //         city: city,
    //       },
    //       products: [{
    //         id: reserveItem.id,
    //         prodCode: reserveItem.prodCode,
    //         name: reserveItem.prodName,
    //         image: reserveItem.image,
    //         price: parsedPrice,
    //         printingCost: parseAmount(reserveItem.PrintingCost || 0),
    //         mountingCost: parseAmount(reserveItem.MountingCost || 0),
    //         lighting: reserveItem.SpotOutdoorType || "Not Specified", 
    //         fixedAmount: parsedSpotPay, 
    //         fixedAmountOffer: parseAmount(reserveItem.Offer || 0),
    //         size: {
    //           width: parseAmount(reserveItem.sizeWidth || 0),
    //           height: parseAmount(reserveItem.sizeHeight || 0), // Fixed: was using sizeHeight for width
    //           squareFeet: parseAmount(reserveItem.dimension || 0)
    //         },
    //         fromLocation: reserveItem.FromSpot || "Not Specified", 
    //         toLocation: reserveItem.ToSpot || "Not Specified", 
    //         rating: reserveItem.rating || 0, 
    //         mediaType: reserveItem.adType || "Not Specified", 
    //         location: {
    //           state: reserveItem.state || "Not Specified", 
    //           district: reserveItem.district || "Not Specified" 
    //         },
    //         booking: {
    //           startDate: formatDateForStorage(startDate),
    //           endDate: formatDateForStorage(endDate),
    //           totalDays: reserveItem.totalDays,
    //           totalPrice: parsedTotalAmount
    //         },
    //         bookedDates: bookedDates,
    //       }],
    //       status: "UserSideOrder",
    //       order_status: pendingCount > 0 ? "pending" : "confirmed", // Set proper order_status
    //       orderType: "single"
    //     };

    //     console.log("📤 Submitting order:", {
    //       orderId: orderId,
    //       status: orderData.status,
    //       order_status: orderData.order_status,
    //       totalAmount: parsedTotalAmount
    //     });

    //     // Save to database
    //     const response = await fetch(`${baseUrl}/prodOrders`, {
    //       method: 'POST',
    //       headers: {
    //         'Content-Type': 'application/json',
    //       },
    //       body: JSON.stringify(orderData)
    //     });

    //     const result = await response.json();

    //     if (!response.ok) {
    //       console.error("Order creation failed:", result);
    //       throw new Error(result.message || 'Failed to save order');
    //     }

    //     console.log("✅ Order created successfully:", result);

    //     // Send SMS to user only
    //     try {
    //       await sendOrderSMS(phone, result.orderId || result._id, name, parsedTotalAmount);
    //     } catch (smsError) {
    //       console.error("SMS sending error:", smsError);
    //       // Don't fail the order if SMS fails
    //     }

    //     // Send email confirmation
    //     try {
    //       const emailResponse = await fetch(
    //         `${baseUrl}/OrderReserve/send-order-confirmation`, {
    //         method: 'POST',
    //         headers: {
    //           'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify({
    //           orderId: result.orderId || result._id,
    //           userName: name,
    //           userEmail: email,
    //           userPhone: phone,
    //           userAddress: `${address}, ${city}, ${state} - ${pincode}`,
    //           company,
    //           products: [{
    //             id: reserveItem.id,
    //             prodCode: reserveItem.prodCode,
    //             name: reserveItem.prodName,
    //             image: reserveItem.image,
    //             price: parsedPrice,
    //             booking: {
    //               startDate: reserveItem.startDate,
    //               endDate: reserveItem.endDate,
    //               totalDays: reserveItem.totalDays,
    //               totalPrice: parsedTotalAmount
    //             },
    //             fromLocation: reserveItem.FromSpot,
    //             toLocation: reserveItem.ToSpot,
    //             size: {
    //               width: reserveItem.sizeWidth,
    //               height: reserveItem.sizeHeight,
    //               squareFeet: reserveItem.dimension
    //             }
    //           }],
    //           orderDate: new Date().toLocaleDateString(),
    //           totalAmount: parsedTotalAmount,
    //           orderStatus: result.order_status || "pending"
    //         })
    //       });

    //       if (!emailResponse.ok) {
    //         const errorData = await emailResponse.json();
    //         console.error("Failed to send order confirmation email:", errorData);
    //       }
    //     } catch (emailError) {
    //       console.error("Email sending error:", emailError);
    //     }

    //     // Navigate to thank you page
    //     navigate("/thankyou1", {
    //       state: {
    //         billingInfo: {
    //           name,
    //           email,
    //           phone,
    //           pincode,
    //           state,
    //           city,
    //           address,
    //           company,
    //         },
    //         reserveItem,
    //         orderId: result.orderId || result._id,
    //         orderStatus: result.order_status || "pending"
    //       }
    //     });
    //   } catch (error) {
    //     console.error("❌ Order submission error:", error);
    //     alert(`Error: ${error.message || "Failed to submit order"}`);
    //   } finally {
    //     setIsLoading(false);
    //   }
    // }; 


    // Add this function to check date availability before final submission
    const checkDateAvailability = async (prodCode, startDate, endDate, excludeOrderId = null) => {
        try {
            const params = new URLSearchParams({
                startDate: startDate.toISOString().split('T')[0],
                endDate: endDate.toISOString().split('T')[0]
            });

            if (excludeOrderId) {
                params.append('excludeOrderId', excludeOrderId);
            }

            const response = await fetch(`${baseUrl}/check-date-conflicts/${prodCode}?${params}`);
            const data = await response.json();

            console.log('Date availability check result:', data);

            return {
                isAvailable: data.success && !data.hasConflicts,
                hasConflicts: data.hasConflicts,
                conflictingDates: data.confirmedConflicts || [],
                pendingConflicts: data.pendingConflicts || [],
                availableDates: data.availableDates || [],
                message: data.message || 'Date availability check completed'
            };
        } catch (error) {
            console.error('Error checking date availability:', error);
            return {
                isAvailable: false,
                hasConflicts: true,
                message: 'Failed to verify date availability. Please try again.'
            };
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            alert("Please login to complete your order");
            return;
        }
        //LOADING ERROR HANDLING WHILE LOGOUT

        // // Check if user has _id
        // if (!user._id) {
        //     console.error("User object missing _id:", user);
        //     alert("User session error. Please try logging in again.");

        //     // Clear invalid user session
        //     localStorage.removeItem('user');
        //     sessionStorage.removeItem('user');

        //     // Redirect to login
        //     openLogin('login', window.location.pathname);
        //     return;
        // }



        // Double-check user authentication
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

        //LOADING ERROR HANDLING WHILE LOGOUT



        // Validate form first
        if (!validateForm()) {
            alert("Please fill in all required fields correctly");
            return;
        }

        setIsLoading(true);

        try {
            // Detailed console logging
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



            //   // ===== DATE REVALIDATION AT BILLING =====
            //     console.log("🔄 Revalidating date availability at billing...");
            //     const dateAvailability = await checkDateAvailability(
            //         reserveItem.prodCode,
            //         startDate,
            //         endDate
            //     );

            //     if (!dateAvailability.isAvailable) {
            //         console.error("Date conflicts detected at billing:", dateAvailability);
            //         alert(`Date conflict detected: ${dateAvailability.message}\n\nPlease go back and select new available dates.`);

            //         // Optionally navigate back to product page with calendar open
            //         // You might want to save the billing info and redirect
            //         navigate(`/Product/${productId}`, {
            //             state: {
            //                 billingInfo: { name, email, phone, pincode, state, city, address, company },
            //                 showCalendar: true,
            //                 dateConflict: true,
            //                 conflictMessage: dateAvailability.message
            //             }
            //         });
            //         setIsLoading(false);
            //         return;
            //     }
            //     console.log("✅ Date revalidation passed at billing");
            //     // ===== END DATE REVALIDATION ===== 

            // Generate dates and log them
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
                status: "UserSideOrder",
                // order_status: reserveItem.pendingDatesCount > 0 ? "pending" : "confirmed",
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

            console.log('ORDER DATA FOR SUBMISSIION IN RESERVER A PRODUCT:', orderData);

            if (!response.ok) {
                throw new Error(result.message || 'Failed to save order');
            }
            console.log("✅ Order created successfully:", result);

            // Send SMS to user only
            try {
                await sendOrderSMS(phone, result.orderId || result._id, name, parsedTotalAmount);
            } catch (smsError) {
                console.error("SMS sending error:", smsError);
                // Don't fail the order if SMS fails
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
                        // orderStatus: result.order_status || "pending"
                    })
                });

                if (!emailResponse.ok) {
                    const errorData = await emailResponse.json();
                    console.error("Failed to send order confirmation email:", errorData);
                }
            } catch (emailError) {
                console.error("Email sending error:", emailError);
            }

            // Navigate to thank you page
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
                    },
                    reserveItem,
                    orderId: result.orderId || result._id,
                    orderStatus: result.order_status || "Pending Client Confirmation"
                }
            });

        //LOADING ERROR HANDLING WHILE LOGOUT
// Change the console.log to safely check user
    console.log('USER ID:', user?._id || 'User not authenticated');
        //LOADING ERROR HANDLING WHILE LOGOUT

        
        } catch (error) {
            console.error("❌ Order submission error:", error);
            alert(`Error: ${error.message || "Failed to submit order"}`);
        } finally {
            setIsLoading(false);
        }
    };

    console.log('USER ID:', user._id);

    const safePrice = typeof reserveItem?.price === 'string'
        ? parseFloat(reserveItem.price.replace(/[^0-9.]/g, ''))
        : reserveItem?.price || 0;
    const safeTotalAmount = typeof reserveItem?.totalAmount === 'string'
        ? parseFloat(reserveItem.totalAmount.replace(/[^0-9.]/g, ''))
        : reserveItem?.totalAmount || 0;



    //RAC CONCEPTS 


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
                                        <img src={reserveItem?.image} alt="Product" className="billing-order-img" />
                                        <div className="billing-order-title">
                                            <div>{reserveItem?.prodName}</div>
                                            <div>{formatIndianCurrency(safePrice, true)} Per Day</div>
                                            <div>Booked date : {reserveItem?.dateRange} ({reserveItem?.totalDays} Days)</div>
                                            <div>Booked Amount : {formatIndianCurrency(parsedTotalAmount)}</div>
                                        </div>
                                    </div>


                                    <div className="billing-order-pricing">
                                        <div className="billing-orderContent">
                                            <div className="billing-orderContentLeft">Price</div>
                                            <div className="billing-orderContentRight">{formatIndianCurrency(parsedTotalAmount)}</div>
                                        </div>

                                        <div className="billing-orderContent">
                                            <div className="billing-orderContentLeft BillingTotalAmt">Total Amount</div>
                                            <div className="billing-orderContentRight BillingTotalAmt">{formatIndianCurrency(parsedTotalAmount)}</div>
                                        </div>
                                    </div>
                                    <div className="billingNoteContent">
                                        <span className="billingNote"> NOTE : &nbsp;</span>This is for only Reservation Price. For Further details Our team will contact you
                                    </div>


                                </div>
                                {/* Billing button  */}
                                <div className="billingButton">
                                    <div className="billingTotalAmount"> {formatIndianCurrency(parsedTotalAmount)}</div>
                                    <div> <button className="billingContinueBtn" type='submit'
                                        disabled={isLoading} >
                                        {isLoading ? "Processing..." : "Continue"}

                                    </button> </div>
                                </div>

                            </div>
                        </form>
                    </div>


                    {hasQueueDates && (
                        <div className="queue-alert-billing">
                            <div className="queue-alert-header">
                                <i className="fas fa-clock"></i>
                                <h5>Queue Information</h5>
                            </div>
                            <div className="queue-alert-body">
                                <p>{queueMessage}</p>
                                <div className="queue-tips">
                                    <strong>How the queue works:</strong>
                                    <ul>
                                        <li>Your booking will be in "Pending" status (orange dates)</li>
                                        <li>Admin will review and confirm your booking</li>
                                        <li>Once confirmed, dates turn red and are locked</li>
                                        <li>If pending orders ahead of you get cancelled, you move up</li>
                                        <li>You'll receive email updates on queue status</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <MainFooter />
            </div>
        </MainLayout>
    );
};
export default BillingDetails;