// // F2BillingCart.jsx - Updated with date conflict checking at billing time
// import React, { useState, useEffect, useRef} from "react";
// import "./F2BillingCart.css";
// import { useNavigate, useLocation } from 'react-router-dom';
// import MainNavbar from './A1NAVBAR.jsx';
// import MainFooter from './A1FOOTER.jsx';
// import { toast } from 'react-toastify';
// import { MainLayout } from './MainLayout';
// import { useLogin } from './LoginContext';
// import { baseUrl, gstPercentage } from '../Adminpanel/BASE_URL';
// import { formatIndianCurrency } from './FORMATED_AMOUNT';
// import slugify from 'slugify';

// const BillingDetailsCart = () => {
//   const { user } = useLogin();

//   // Date conflict checking states
//   const [isCheckingConflicts, setIsCheckingConflicts] = useState(false);
//   const [conflictResults, setConflictResults] = useState([]);
//   const [hasDateConflicts, setHasDateConflicts] = useState(false);
//   const [conflictedItems, setConflictedItems] = useState([]);
//   const [conflictMessage, setConflictMessage] = useState("");

//   const [errors, setErrors] = useState({
//     name: false,
//     phone: false,
//     email: false,
//     pincode: false,
//     state: false,
//     city: false,
//     address: false,
//     company: false,
//   });


  
//       const handleCancel = () => {
//           const confirmCancel = window.confirm("Are you sure you want to cancel the order?");
//           if (confirmCancel) {
//               if (cartItems?.id && cartItems?.prodName) {
//                   const productSlug = `${cartItems.id}-${slugify(cartItems.prodName, {
//                       lower: true,
//                       strict: true,
//                       trim: true
//                   })}`;
//                   navigate(`/Product/${productSlug}`);
//               } else {
//                   navigate('/');
//               }
//           }
//       };

//   const validateForm = () => {
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     const newErrors = {
//       name: !name,
//       phone: !phone || phone.toString().length !== 10,
//       email: !email || !emailRegex.test(email),
//       pincode: !pincode,
//       state: !state,
//       city: !city,
//       address: !address,
//       company: !company,
//     };
//     setErrors(newErrors);
//     return !Object.values(newErrors).some(error => error);
//   };

//   const [name, setName] = useState(user?.userName || "");
//   const [phone, setPhone] = useState(user?.userPhone || "");
//   const [email, setEmail] = useState(user?.userEmail || "");
//   const [pincode, setPincode] = useState("");
//   const [state, setState] = useState("");
//   const [city, setCity] = useState("");
//   const [address, setAddress] = useState("");
//   const [company, setCompany] = useState('');
//   const [isOpen, setIsOpen] = useState(false);
//   const [isOpen1, setIsOpen1] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const statesList = ["Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", " Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"];
// const conflictToastShown = useRef(false);
// const queueToastShown = useRef(false);
// const initialCartCheckDone = useRef(false);
//   const [searchTerm, setSearchTerm] = useState("");

//   const filteredStates = statesList.filter((s) =>
//     s.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const navigate = useNavigate();
//   const location = useLocation();
//   const { billingInfo, cartItems, subTotal, TotalPrice, totalItems, SpotPay, Offer } = location.state || {};


//   const formatCartDateRange = (startDate, endDate) => {
//     const start = new Date(startDate);
//     const end = new Date(endDate);
//     const startStr = start.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
//     const endStr = end.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
//     return `${startStr} - ${endStr}`;
//   };


// // Function to check date conflicts for all cart items using unified API
// const checkAllCartDateConflicts = async (showToast = true) => {
//     if (!cartItems || cartItems.length === 0) return;

//     setIsCheckingConflicts(true);
//     setConflictResults([]);
//     setHasDateConflicts(false);
//     setConflictedItems([]);
//     setConflictMessage("");

//     try {
//         const itemsToCheck = cartItems.map(item => ({
//             cartItemId: item._id,
//             productId: item.productId || item.id,
//             productName: item.prodName,
//             prodCode: item.prodCode,
//             startDate: new Date(item.startDate).toISOString(),
//             endDate: new Date(item.endDate).toISOString()
//         }));

//         const response = await fetch(`${baseUrl}/check-date-conflicts`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({ items: itemsToCheck })
//         });

//         const data = await response.json();

//         if (data.success && data.type === 'bulk') {
//             setConflictResults(data.results);
            
//             const conflicted = data.results.filter(r => r.hasConflicts);
            
//             setHasDateConflicts(conflicted.length > 0);
//             setConflictedItems(conflicted);
            
//             if (conflicted.length > 0) {
//                 const conflictedItem = cartItems.find(item => 
//                     conflicted.some(c => c.cartItemId === item._id)
//                 );
//                 if (conflictedItem) {
//                     const dateRange = formatCartDateRange(conflictedItem.startDate, conflictedItem.endDate);
//                     setConflictMessage(`${dateRange} no longer available`);
//                 } else {
//                     setConflictMessage(`${conflicted.length} item(s) unavailable`);
//                 }
//                 // Only show toast if requested and not shown before
//                 if (showToast && !conflictToastShown.current) {
//                     toast.error(`${conflicted.length} item(s) have date conflicts`);
//                     conflictToastShown.current = true;
//                 }
//             } else if (data.hasQueueDates) {
//                 const queueCount = data.results.filter(r => r.hasQueueDates).length;
//                 setConflictMessage(`${queueCount} item(s) in queue`);
//                 // Only show toast if requested and not shown before
//                 if (showToast && !queueToastShown.current) {
//                     toast.info(`${queueCount} item(s) have dates in queue`);
//                     queueToastShown.current = true;
//                 }
//             }
//         }
//     } catch (error) {
//         console.error("Error checking cart date conflicts:", error);
//         if (showToast) {
//             toast.error("Failed to verify availability");
//         }
//     } finally {
//         setIsCheckingConflicts(false);
//     }
// };

//   // Check conflicts when component mounts
// useEffect(() => {
//     if (cartItems && cartItems.length > 0 && !initialCartCheckDone.current) {
//         checkAllCartDateConflicts(true);
//         initialCartCheckDone.current = true;
//     }
// }, [cartItems]);
// // Validate dates before final submission
// const validateDatesBeforeSubmission = async () => {
//     if (!cartItems || cartItems.length === 0) return true;

//     setIsCheckingConflicts(true);

//     try {
//         const itemsToCheck = cartItems.map(item => ({
//             cartItemId: item._id,
//             productId: item.productId || item.id,
//             productName: item.prodName,
//             prodCode: item.prodCode,
//             startDate: new Date(item.startDate).toISOString(),
//             endDate: new Date(item.endDate).toISOString()
//         }));

//         const response = await fetch(`${baseUrl}/check-date-conflicts`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({ items: itemsToCheck })
//         });

//         const data = await response.json();

//         if (data.success) {
//             const conflicted = data.results.filter(r => r.hasConflicts);
            
//             if (conflicted.length > 0) {
//                 setHasDateConflicts(true);
//                 setConflictedItems(conflicted);
//                 const conflictedItem = cartItems.find(item => 
//                     conflicted.some(c => c.cartItemId === item._id)
//                 );
//                 if (conflictedItem) {
//                     const dateRange = formatCartDateRange(conflictedItem.startDate, conflictedItem.endDate);
//                     setConflictMessage(`${dateRange} no longer available`);
//                 } else {
//                     setConflictMessage(`${conflicted.length} item(s) unavailable`);
//                 }
//                 // Always show toast on submission attempt
//                 toast.error(`${conflicted.length} item(s) no longer available`);
//                 return false;
//             }
//             return true;
//         }
//         return true;
//     } catch (error) {
//         console.error("Error validating dates:", error);
//         toast.error("Failed to verify availability");
//         return false;
//     } finally {
//         setIsCheckingConflicts(false);
//     }
// };

//   const calculateProductBasePrice = (item) => {
//     const totalAmount = parseAmount(item.totalAmount || 0);
//     const printingCost = parseAmount(item.PrintingCost || 0);
//     const mountingCost = parseAmount(item.MountingCost || 0);
//     return totalAmount + printingCost + mountingCost;
//   };

//   const calculateOverallTotal = () => {
//     if (!cartItems || cartItems.length === 0) return 0;
//     return cartItems.reduce((total, item) => {
//       return total + calculateProductBasePrice(item);
//     }, 0);
//   };

//   const parseAmount = (amount) => {
//     if (amount === null || amount === undefined || amount === '') return 0;
//     if (typeof amount === 'number') return amount;
//     if (typeof amount === 'string') {
//       const cleaned = amount.replace(/[₹$,¥\s]/g, '').replace(/,/g, '');
//       const parsed = parseFloat(cleaned);
//       return isNaN(parsed) ? 0 : parsed;
//     }
//     const parsed = Number(amount);
//     return isNaN(parsed) ? 0 : parsed;
//   };

//   const overallTotalBasePrice = calculateOverallTotal();
//   const gstPercentageValue = parseFloat(gstPercentage) / 100;
//   const gstAmount = overallTotalBasePrice * gstPercentageValue;
//   const formattedGstAmount = Math.floor(gstAmount);
//   const totalAmountWithGST = overallTotalBasePrice + formattedGstAmount;

//   const formatDateForStorage = (date) => {
//     if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
//       return null;
//     }
//     return new Date(Date.UTC(
//       date.getFullYear(),
//       date.getMonth(),
//       date.getDate()
//     ));
//   };

//   const getDateRangeArray = (start, end) => {
//     const dates = [];
//     const current = new Date(start);
//     const endDate = new Date(end);

//     while (current <= endDate) {
//       dates.push(formatDateForStorage(new Date(current)));
//       current.setDate(current.getDate() + 1);
//     }
//     return dates;
//   };

//   const sendOrderSMS = async (phone, orderId) => {
//     try {
//       const response = await fetch(`${baseUrl}/OrderCart/send-sms`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           phone,
//           orderId
//         })
//       });

//       const result = await response.json();
//       if (!response.ok || !result.success) {
//         console.error("Failed to send SMS:", result.error);
//       }
//     } catch (error) {
//       console.error("SMS sending error:", error);
//     }
//   };

//   const handleSubmitCartThank = async (e) => {
//     e.preventDefault();

//     if (!validateForm()) {
//       alert("Please fill all required fields correctly");
//       return;
//     }

//     // CRITICAL: Check date conflicts before submission
//     const areDatesAvailable = await validateDatesBeforeSubmission();

//     if (!areDatesAvailable || hasDateConflicts) {
//       toast.error(
//         "Cannot place order! Some items are no longer available. Please update your cart and try again.",
//         { autoClose: 8000 }
//       );
//       return;
//     }

//     setIsLoading(true);

//     try {
//       // Prepare products data with proper date handling
//       const products = cartItems.map(item => {
//         const startDate = item.startDate ? new Date(item.startDate) : null;
//         const endDate = item.endDate ? new Date(item.endDate) : null;

//         let bookedDates = [];
//         if (startDate && endDate) {
//           const current = new Date(startDate);
//           const end = new Date(endDate);
//           while (current <= end) {
//             bookedDates.push(new Date(current));
//             current.setDate(current.getDate() + 1);
//           }
//         }

//         const productBasePrice = calculateProductBasePrice(item);

//         return {
//           id: item.productId || item.id,
//           prodCode: item.prodCode,
//           name: item.prodName,
//           image: item.image,
//           price: parseAmount(item.price),
//           printingCost: parseAmount(item.PrintingCost),
//           mountingCost: parseAmount(item.MountingCost),
//           lighting: item.SpotOutdoorType,
//           fixedAmount: parseAmount(item.SpotPay),
//           fixedAmountOffer: parseAmount(item.Offer),
//           size: {
//             width: item.sizeWidth,
//             height: item.sizeHeight,
//             squareFeet: item.dimension
//           },
//           fromLocation: item.FromSpot,
//           toLocation: item.ToSpot,
//           rating: item.rating,
//           mediaType: item.adType,
//           location: {
//             state: item.state || 'Unknown',
//             district: item.district || 'Unknown',
//           },
//           booking: {
//             startDate: startDate,
//             endDate: endDate,
//             totalDays: item.totalDays,
//             totalPrice: parseAmount(item.totalAmount)
//           },
//           productBasePrice: productBasePrice,
//           bookedDates: bookedDates
//         };
//       });

//       const orderData = {
//         client: {
//           userId: user._id,
//           name: name,
//           email: email,
//           contact: phone,
//           company: company,
//           address: address,
//           pincode: pincode,
//           state: state,
//           city: city,
//         },
//         products: products,
//         overAllTotalAmount: overallTotalBasePrice,
//         gstPercentage: gstPercentage,
//         gstAmount: formattedGstAmount,
//         totalAmountWithGST: totalAmountWithGST,
//         status: "UserSideOrder",
//         order_status: "Pending Client Confirmation",
//         orderType: cartItems.length > 1 ? "cart" : "single",
//         queue_info: null
//       };

//       const response = await fetch(`${baseUrl}/prodOrders`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(orderData)
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         // Check if the error is due to date conflict
//         if (errorData.message && errorData.message.includes("already booked")) {
//           setHasDateConflicts(true);
//           setConflictMessage(
//             "❌ Cannot place order! Some dates are no longer available.\n\n" +
//             "The dates you selected have been booked by another user.\n" +
//             "Please update your cart and try again."
//           );
//           toast.error("Some items are no longer available. Please update your cart.");
//           setIsLoading(false);
//           return;
//         }
//         throw new Error(errorData.message || 'Failed to create order');
//       }

//       const result = await response.json();

//       // Send SMS to user
//       try {
//         await sendOrderSMS(phone, result.orderId);
//       } catch (smsError) {
//         console.error("SMS sending error:", smsError);
//       }

//       // Send order confirmation email
//       try {
//         const emailResponse = await fetch(
//           `${baseUrl}/OrderCart/send-orderCart-confirmation`, {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({
//             orderId: result.orderId || result._id,
//             userName: name,
//             userEmail: email,
//             userPhone: phone,
//             userAddress: `${address}, ${city}, ${state} - ${pincode}`,
//             company,
//             products: cartItems.map(item => ({
//               id: item.productId || item.id,
//               prodCode: item.prodCode,
//               name: item.prodName,
//               image: item.image,
//               price: parseAmount(item.price),
//               printingCost: parseAmount(item.PrintingCost),
//               mountingCost: parseAmount(item.MountingCost),
//               booking: {
//                 startDate: item.startDate,
//                 endDate: item.endDate,
//                 totalDays: item.totalDays,
//                 totalPrice: parseAmount(item.totalAmount)
//               },
//               fromLocation: item.FromSpot,
//               toLocation: item.ToSpot,
//               size: {
//                 width: item.sizeWidth,
//                 height: item.sizeHeight,
//                 squareFeet: item.dimension
//               }
//             })),
//             orderDate: new Date().toLocaleDateString(),
//             totalAmount: overallTotalBasePrice,
//             overAllTotalAmount: overallTotalBasePrice,
//             gstPercentage: gstPercentage,
//             gstAmount: formattedGstAmount,
//             totalAmountWithGST: totalAmountWithGST,
//             orderStatus: result.order_status || "pending"
//           })
//         });

//         if (!emailResponse.ok) {
//           console.error("Failed to send order confirmation email");
//         }
//       } catch (emailError) {
//         console.error("Email sending error:", emailError);
//       }

//       // Clear cart after successful order
//       try {
//         const clearResponse = await fetch(`${baseUrl}/cart/clear/${user._id}`, {
//           method: 'DELETE'
//         });

//         if (!clearResponse.ok) {
//           console.error('Failed to clear cart, but order was placed successfully');
//         }
//       } catch (clearError) {
//         console.error('Error clearing cart:', clearError);
//       }

//       // Navigate to thank you page
//       navigate("/thankyou", {
//         state: {
//           orderId: result.orderId,
//           billingInfo: {
//             name,
//             email,
//             phone,
//             pincode,
//             state,
//             city,
//             address,
//             company,
//           },
//           cartItems: cartItems.map((item, index) => {
//             const cleanedTotalAmount = parseAmount(item.totalAmount);
//             const printingCost = parseAmount(item.PrintingCost);
//             const mountingCost = parseAmount(item.MountingCost);
//             const productBasePrice = cleanedTotalAmount + printingCost + mountingCost;

//             return {
//               ...item,
//               cleanedTotalAmount: cleanedTotalAmount,
//               printingCost: printingCost,
//               mountingCost: mountingCost,
//               productBasePrice: productBasePrice,
//               formattedCleanedTotalAmount: formatIndianCurrency(cleanedTotalAmount, true),
//               formattedPrintingCost: formatIndianCurrency(printingCost, true),
//               formattedMountingCost: formatIndianCurrency(mountingCost, true),
//               formattedProductBasePrice: formatIndianCurrency(productBasePrice, true)
//             };
//           }),
//           subTotal: overallTotalBasePrice,
//           totalItems: totalItems,
//           TotalPrice: overallTotalBasePrice,
//           gstPercentage: gstPercentage,
//           gstAmount: formattedGstAmount,
//           totalAmountWithGST: totalAmountWithGST,
//           orderStatus: result.order_status || "pending"
//         }
//       });
//     } catch (error) {
//       console.error("❌ Cart order submission error:", error);

//       if (error.message.includes("conflict") || error.message.includes("already booked")) {
//         alert(`❌ Order failed: Some dates are no longer available. Please update your cart and try again.\n\nError: ${error.message}`);
//       } else {
//         alert(`Failed to place order: ${error.message}`);
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const startDate = cartItems?.[0]?.startDate ? new Date(cartItems[0].startDate) : null;
//   const endDate = cartItems?.[0]?.endDate ? new Date(cartItems[0].endDate) : null;

//   if (!cartItems || cartItems.length === 0) {
//     return (
//       <MainLayout>
//         <div className="container noSelected">
//           <h5 className='noSelectedSpot'>No items found for checkout</h5>
//           <button className='noSelectedGoBackBtn' onClick={() => navigate("/cart")}>
//             Back to Cart
//           </button>
//         </div>
//       </MainLayout>
//     );
//   }

//   return (
//     <MainLayout>
//       <div>
//         <MainNavbar />
//         <div className="billing-container1">
//           <div className="billing-header1">
//           <div></div>
//             <div>BILLING DETAILS</div>
//             <div onClick={handleCancel} style={{ color: 'rgba(227, 34, 40, 1)', textAlign: 'right', alignContent: 'end', cursor: 'pointer' }} >
//                             <i className="fa-regular fa-circle-xmark"></i>
//                         </div>
//           </div>
//             {hasDateConflicts && (
//                         <div className="date-conflict-banner">
//                             <div className="billingConflictMain">
//                                 <i className="fa-solid fa-circle-exclamation billingExclamation" ></i>
//                                 <span className="billingConflictMessage">
//                                     {conflictMessage}
//                                 </span>
//                             </div>
//                             <button className="billingConflictBackBtn"
//                                onClick={() => navigate("/cart")} >
//                                Go Back to Cart & Update
//                             </button>
//                         </div>
//                     )}

//           {/* Queue Notice Banner */}
//           {/* {!hasDateConflicts && conflictResults.some(r => r.hasQueueDates) && (
//             <div className="queue-notice-banner" style={{
//               backgroundColor: '#fff3e0',
//               border: '2px solid #ff9800',
//               borderRadius: '8px',
//               padding: '12px 15px',
//               margin: '15px auto',
//               maxWidth: '1200px',
//               display: 'flex',
//               alignItems: 'center',
//               gap: '10px'
//             }}>
//               <i className="fa-solid fa-clock" style={{ color: '#ff9800', fontSize: '20px' }}></i>
//               <span style={{ color: '#e65100' }}>
//                 Some items have dates in queue. You'll be added to the waitlist.
//               </span>
//             </div>
//           )} */}
//            {!hasDateConflicts && conflictResults.some(r => r.hasQueueDates) && (
//                         <div className="queue-notice-banner_billing" >
//                             <i className="fa-solid fa-clock conflict_clockBilling" ></i>
//                             <span className="conflict_messageBilling">
// Some items have dates in queue. You'll be added to the waitlist.
//                             </span>
//                         </div>
//                     )}

//           {/* Conflict Checking Loader */}
//           {/* {isCheckingConflicts && (
//             <div className="conflict-checking-loader" style={{
//               position: 'fixed',
//               top: 0,
//               left: 0,
//               right: 0,
//               bottom: 0,
//               backgroundColor: 'rgba(0,0,0,0.7)',
//               display: 'flex',
//               justifyContent: 'center',
//               alignItems: 'center',
//               zIndex: 9999
//             }}>
//               <div style={{
//                 backgroundColor: 'white',
//                 padding: '30px',
//                 borderRadius: '10px',
//                 textAlign: 'center'
//               }}>
//                 <div className="spinner-border text-primary" role="status" style={{ width: '50px', height: '50px' }}>
//                   <span className="visually-hidden">Loading...</span>
//                 </div>
//                 <p style={{ marginTop: '15px', fontSize: '16px' }}>Verifying date availability for all items...</p>
//               </div>
//             </div>
//           )} */}

//           <div>
//             <form onSubmit={handleSubmitCartThank} className="billing-content1">
//               <div className="billing-left1">
//                 <div className="billing-flow1">
//                   <div className="billingFlowLeftArr1" onClick={handleCancel}> <i className="fa-solid fa-arrow-left"></i></div>
//                   <div className="billing-Flowcontent1"> Billing Details</div>
//                   {/* <div className="billing-Flowcontent FlowContent1">-------</div>
//                   <div className="billing-Flowcontent FlowContent11">Payments</div> */}
//                 </div>

//                 <div className="section-title1">
//                   <div className="locationIconOutline1">
//                     <img src='./images/loction_icon.svg' className="locationIcon1" alt="Location" />
//                   </div>
//                   <div> Delivery Address</div>
//                 </div>

//                 <div className="billingSpan1">
//                   <input
//                     type="text"
//                     value={name}
//                     onChange={(e) => {
//                       let value = e.target.value;
//                       if (/^[A-Za-z\s]*$/.test(value)) {
//                         value = value.replace(/^\s+/, "").replace(/\s+/g, " ");
//                         setName(value);
//                         setErrors(prev => ({ ...prev, name: false }));
//                       }
//                     }}
//                     onBlur={() => setName(name.trim())}
//                     className={`input-field1 ${errors.name ? 'AdminProdinput-errorBilling1' : ''}`}
//                   />
//                   {errors.name && (
//                     <div className="AdminProderror-messageBilling1">Enter a valid name</div>
//                   )}
//                   <span className={`billingInputSpan1 ${name.length === 0 ? "" : "inputSpanFill1"}`}>
//                     Your Name*
//                   </span>
//                 </div>

//                 <div className="phone-input1">
//                   <div>
//                     <div className={`country-code1 ${errors.phone ? 'AdminProdinput-errorBilling1' : ''}`}>
//                       +91
//                     </div>
//                   </div>
//                   <div className="billingSpan1 billingPhoneSpan1">
//                     <input
//                       type="text"
//                       value={phone}
//                       maxLength='10'
//                       onChange={(e) => {
//                         setPhone(e.target.value);
//                         setErrors(prev => ({ ...prev, phone: false }));
//                       }}
//                       readOnly
//                       className={`input-field1 phoneInputField1 ${errors.phone ? 'AdminProdinput-errorBilling1' : ''} `}
//                     />
//                     {errors.phone && <div className="AdminProderror-messageBillingPhone1">
//                       {!phone ? "Contact is required" : "Contact must be 10 digits"}
//                     </div>}
//                     <span className={`billingInputSpan1 billingPhoneInputSpan1 ${phone.length === 0 ? "" : "inputPhoneSpanFill1"}`}>Phone Number*</span>
//                   </div>
//                 </div>

//                 <div className="billingSpan1">
//                   <input
//                     type="email"
//                     value={email}
//                     onChange={(e) => {
//                       setEmail(e.target.value);
//                       setErrors(prev => ({ ...prev, email: false }));
//                     }}
//                     readOnly
//                     className={`input-field1 ${errors.email ? 'AdminProdinput-errorBilling1' : ''}`}
//                   />
//                   {errors.email && <div className="AdminProderror-messageBilling1">
//                     {!email ? "Email is required" : "Invalid email format"}
//                   </div>}
//                   <span className={`billingInputSpan1 ${email.length === 0 ? "" : "inputSpanFill1"}`}>Your Email*</span>
//                 </div>

//                 <div className="billingSpan1">
//                   <input
//                     type="tel"
//                     value={pincode}
//                     maxLength={6}
//                     onChange={(e) => {
//                       let value = e.target.value.replace(/\D/g, "");
//                       if (value.length <= 6) {
//                         setPincode(value);
//                         setErrors(prev => ({ ...prev, pincode: false }));
//                       }
//                     }}
//                     className={`input-field1 ${errors.pincode ? 'AdminProdinput-errorBilling1' : ''}`}
//                   />
//                   {errors.pincode && (
//                     <div className="AdminProderror-messageBilling1">Enter a valid 6-digit pincode</div>
//                   )}
//                   <span className={`billingInputSpan1 ${pincode.length === 0 ? "" : "inputSpanFill1"}`}>
//                     Pincode*
//                   </span>
//                 </div>

//                 <div className="billingStateCity1">
//                   <div className="billingSpan1">
//                     <input
//                       type="text"
//                       value={state}
//                       onFocus={() => setIsOpen1(true)}
//                       readOnly
//                       className={`input-field1 stateInputField1 ${errors.state ? 'AdminProdinput-errorBilling1' : ''}`}
//                     />
//                     <span className={`billingInputSpan1 ${state.length === 0 ? "" : "inputSpanFill1"}`}>State*</span>
//                     <i
//                       className={`fa-solid ${isOpen1 ? "fa-caret-up" : "fa-caret-down"} phoneInputUpDown1`}
//                       onClick={() => setIsOpen1(!isOpen1)}
//                     ></i>

//                     {isOpen1 && (
//                       <div className="billing-dropdown-container1">
//                         <div className="billing-search-box1">
//                           <i className="fa-solid fa-magnifying-glass stateSearchIcon1"></i>
//                           <input
//                             type="text"
//                             placeholder="Search a state"
//                             value={searchTerm}
//                             onChange={(e) => setSearchTerm(e.target.value)}
//                             className="billing-search-input1"
//                           />
//                         </div>
//                         <ul className="billing-state-list1">
//                           {filteredStates.length > 0 ? (
//                             filteredStates.map((s, index) => (
//                               <li
//                                 key={index}
//                                 className="billing-state-item1"
//                                 onClick={() => {
//                                   setState(s);
//                                   setIsOpen1(false);
//                                   setSearchTerm("");
//                                 }}
//                               >
//                                 {s}
//                               </li>
//                             ))
//                           ) : (
//                             <li className="billing-no-results1">No states found</li>
//                           )}
//                         </ul>
//                       </div>
//                     )}
//                     {errors.state && <div className="AdminProderror-messageBillingState1">State is required</div>}
//                   </div>

//                   <div className="billingSpan1">
//                     <input
//                       type="text"
//                       value={city}
//                       onChange={(e) => {
//                         setCity(e.target.value);
//                         setErrors(prev => ({ ...prev, city: false }));
//                       }}
//                       className={`input-field1 cityInputField1 ${errors.city ? 'AdminProdinput-errorBilling1' : ''} `}
//                     />
//                     {errors.city && <div className="AdminProderror-messageBilling1 ">City is required</div>}
//                     <span className={`billingInputSpan1 ${city.length === 0 ? "" : "inputSpanFill1"}`}>City*</span>
//                   </div>
//                 </div>

//                 <div className="billingSpan1">
//                   <input
//                     type="text"
//                     value={company}
//                     onChange={(e) => {
//                       setCompany(e.target.value);
//                       setErrors(prev => ({ ...prev, company: false }));
//                     }}
//                     className={`input-field1 ${errors.company ? 'AdminProdinput-errorBilling1' : ''} `}
//                   />
//                   {errors.company && <div className="AdminProderror-messageBilling1 ">Company is required</div>}
//                   <span className={`billingInputSpan1 ${company.length === 0 ? "" : "inputSpanFill1"}`}>Your Company*</span>
//                 </div>

//                 <div className="billingSpan1">
//                   <input
//                     type="text"
//                     value={address}
//                     onChange={(e) => {
//                       setAddress(e.target.value);
//                       setErrors(prev => ({ ...prev, address: false }));
//                     }}
//                     className={`input-field1 ${errors.address ? 'AdminProdinput-errorBilling1' : ''} `}
//                   />
//                   {errors.address && <div className="AdminProderror-messageBilling1">Address is required</div>}
//                   <span className={`billingInputSpan1 ${address.length === 0 ? "" : "inputSpanFill1"}`}>Address*</span>
//                 </div>
//               </div>

//               <div className="billing-right1">
//                 <div className="billing-section-title1">Order Summary</div>
//                 <div className="billing_contents_right1">
//                   <div>
//                     <div className='BillingCart-scroll1'>
//                       {cartItems.map((item, index) => {
//                         const cleanedTotalAmount = parseAmount(item.totalAmount);
//                         const printingCost = parseAmount(item.PrintingCost);
//                         const mountingCost = parseAmount(item.MountingCost);
//                         const productBasePrice = cleanedTotalAmount + printingCost + mountingCost;

//                         // Check if this item has conflict
//                         const itemConflict = conflictResults.find(r => r.cartItemId === item._id);
//                         const isItemConflicted = itemConflict?.hasConflicts || false;

//                         return (
//                           <div
//                             className={`billing-order-item1 ${isItemConflicted ? 'conflicted-item' : ''}`}
//                             key={index}
//                             style={isItemConflicted ? {
//                               border: '2px solid #f44336',
//                               backgroundColor: '#ffebee',
//                               padding: '10px',
//                               borderRadius: '8px',
//                               marginBottom: '10px'
//                             } : {}}
//                           >
//                             <img src={item.image} alt="Product" className="billing-order-img1" />
//                             <div className="billing-order-title1">
//                               <div>{item.prodName}</div>
//                               <div>{formatIndianCurrency(item.price, true)} Per Day</div>
//                               <div>Booked date : {item.dateRange} ({item.totalDays} Days)</div>
//                               <div>Booking Amount : {formatIndianCurrency(cleanedTotalAmount, true)}</div>
//                               <div>Printing Cost : {formatIndianCurrency(printingCost, true)}</div>
//                               <div>Mounting Cost : {formatIndianCurrency(mountingCost, true)}</div>
//                               <div className="product-total">Product Total : {formatIndianCurrency(productBasePrice, true)}</div>
//                               {isItemConflicted && (
//                                 <div style={{ color: '#f44336', fontSize: '12px', marginTop: '5px' }}>
//                                   <i className="fa-solid fa-circle-exclamation"></i> {itemConflict?.message}
//                                 </div>
//                               )}
//                             </div>
//                           </div>
//                         );
//                       })}
//                     </div>

//                     <div className="BillingScrollTotalContent">
//                       <div className="billing-orderTotalAmtContent1 billingTotalContentTop">
//                         <div className="billingTotalLeft">Total Products</div>
//                         <div className="billingTotalRight">{totalItems}</div>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="billing-order-pricing1">
//                     <div className="billing-orderContentPriceMain1">
//                       <div className="billing-orderContent11">
//                         <div className="billing-orderContentLeft1">Base Price (Excl. GST)</div>
//                         <div className="billing-orderContentRight1">{formatIndianCurrency(overallTotalBasePrice, true)}</div>
//                       </div>
//                       <div className="billing-orderContent1">
//                         <div className="billing-orderContentLeft1">GST @ {gstPercentage}%</div>
//                         <div className="billing-orderContentRight1">{formatIndianCurrency(formattedGstAmount, true)}</div>
//                       </div>
//                     </div>
//                     <div className="billing-orderContent1">
//                       <div className="billing-orderContentLeft1 BillingTotalAmt1">Total Amount (Incl. GST)</div>
//                       <div className="billing-orderContentRight1 BillingTotalAmt1">{formatIndianCurrency(totalAmountWithGST, true)}</div>
//                     </div>
//                   </div>
//                 </div>
// {/* 
//                 <div className="billingButton1">
//                   <div>{formatIndianCurrency(totalAmountWithGST, true)}</div>
//                   <div>
//                     <button
//                       className="billingContinueBtn1"
//                       type="submit"
//                       disabled={isLoading || isCheckingConflicts || hasDateConflicts}
//                       style={{
//                         backgroundColor: hasDateConflicts ? '#ccc' : '',
//                         cursor: hasDateConflicts ? 'not-allowed' : 'pointer'
//                       }}
//                     >
//                       {isLoading ? "Processing..." : isCheckingConflicts ? "Checking..." : "Continue"}
//                     </button>
//                   </div>
//                 </div> */}


//                                     <div>
//                                         <div className="billingButton">
//                                             <div className="billing-button-group" style={{ display: 'flex', gap: '10px' }}>
//                                                 <div>
//                                                     <button
//                                                         className="billingContinueBtn"
//                                                         type="button"
//                                                         disabled={isLoading || isCheckingConflicts}
//                                                         onClick={handleCancel}
//                                                         style={{ color: 'red', fontWeight: '600', border: "none", backgroundColor: "white" }}
//                                                     >
//                                                         Cancel
//                                                     </button>
//                                                 </div>
//                                                 <div>
//                                                     <button
//                                                         className="billingContinueBtn"
//                                                         type='submit'
//                                                         disabled={isLoading || isCheckingConflicts || hasDateConflicts}
//                                                         style={{
//                                                             backgroundColor: hasDateConflicts ? '#ccc' : '',
//                                                             cursor: hasDateConflicts ? 'not-allowed' : 'pointer'
//                                                         }}
//                                                     >
//                                                         {isLoading ? "Processing..." : isCheckingConflicts ? "Checking..." : "Confirm"}
//                                                     </button>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div>                
//               </div>
//             </form>
//           </div>
//         </div>
//         <MainFooter />
//       </div>
//     </MainLayout>
//   );
// };

// export default BillingDetailsCart;






// F2BillingCart.jsx - Updated with date conflict checking at billing time
import React, { useState, useEffect, useRef } from "react";
import "./F2BillingCart.css";
import { useNavigate, useLocation } from 'react-router-dom';
import MainNavbar from './A1NAVBAR.jsx';
import MainFooter from './A1FOOTER.jsx';
import { toast } from 'react-toastify';
import { MainLayout } from './MainLayout';
import { useLogin } from './LoginContext';
import { baseUrl, gstPercentage } from '../Adminpanel/BASE_URL';
import { formatIndianCurrency } from './FORMATED_AMOUNT';
import slugify from 'slugify';

const BillingDetailsCart = () => {
  const { user, openLogin } = useLogin();
  const navigate = useNavigate();
  const location = useLocation();

  // State to track if component should render or redirect
  const [isValidUser, setIsValidUser] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  // Date conflict checking states
  const [isCheckingConflicts, setIsCheckingConflicts] = useState(false);
  const [conflictResults, setConflictResults] = useState([]);
  const [hasDateConflicts, setHasDateConflicts] = useState(false);
  const [conflictedItems, setConflictedItems] = useState([]);
  const [conflictMessage, setConflictMessage] = useState("");

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

  const conflictToastShown = useRef(false);
  const queueToastShown = useRef(false);
  const initialCartCheckDone = useRef(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredStates = statesList.filter((s) =>
    s.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const { billingInfo, cartItems, subTotal, TotalPrice, totalItems, SpotPay, Offer } = location.state || {};

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

  const handleCancel = () => {
    const confirmCancel = window.confirm("Are you sure you want to cancel the order?");
    if (confirmCancel) {
      navigate('/cart');
    }
  };
  
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

  const formatCartDateRange = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const startStr = start.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
    const endStr = end.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
    return `${startStr} - ${endStr}`;
  };

  // Function to check date conflicts for all cart items using unified API
  const checkAllCartDateConflicts = async (showToast = true) => {
    if (!cartItems || cartItems.length === 0) return;

    setIsCheckingConflicts(true);
    setConflictResults([]);
    setHasDateConflicts(false);
    setConflictedItems([]);
    setConflictMessage("");

    try {
      const itemsToCheck = cartItems.map(item => ({
        cartItemId: item._id,
        productId: item.productId || item.id,
        productName: item.prodName,
        prodCode: item.prodCode,
        startDate: new Date(item.startDate).toISOString(),
        endDate: new Date(item.endDate).toISOString()
      }));

      const response = await fetch(`${baseUrl}/check-date-conflicts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items: itemsToCheck })
      });

      const data = await response.json();

      if (data.success && data.type === 'bulk') {
        setConflictResults(data.results);
        
        const conflicted = data.results.filter(r => r.hasConflicts);
        
        setHasDateConflicts(conflicted.length > 0);
        setConflictedItems(conflicted);
        
        if (conflicted.length > 0) {
          const conflictedItem = cartItems.find(item => 
            conflicted.some(c => c.cartItemId === item._id)
          );
          if (conflictedItem) {
            const dateRange = formatCartDateRange(conflictedItem.startDate, conflictedItem.endDate);
            setConflictMessage(`${dateRange} no longer available`);
          } else {
            setConflictMessage(`${conflicted.length} item(s) unavailable`);
          }
          // Only show toast if requested and not shown before
          if (showToast && !conflictToastShown.current) {
            toast.error(`${conflicted.length} item(s) have date conflicts`);
            conflictToastShown.current = true;
          }
        } else if (data.hasQueueDates) {
          const queueCount = data.results.filter(r => r.hasQueueDates).length;
          setConflictMessage(`${queueCount} item(s) in queue`);
          // Only show toast if requested and not shown before
          if (showToast && !queueToastShown.current) {
            toast.info(`${queueCount} item(s) have dates in queue`);
            queueToastShown.current = true;
          }
        }
      }
    } catch (error) {
      console.error("Error checking cart date conflicts:", error);
      if (showToast) {
        toast.error("Failed to verify availability");
      }
    } finally {
      setIsCheckingConflicts(false);
    }
  };

  // Check conflicts when component mounts
  useEffect(() => {
    if (cartItems && cartItems.length > 0 && !initialCartCheckDone.current && isValidUser) {
      checkAllCartDateConflicts(true);
      initialCartCheckDone.current = true;
    }
  }, [cartItems, isValidUser]);

  // Validate dates before final submission
  const validateDatesBeforeSubmission = async () => {
    if (!cartItems || cartItems.length === 0) return true;

    setIsCheckingConflicts(true);

    try {
      const itemsToCheck = cartItems.map(item => ({
        cartItemId: item._id,
        productId: item.productId || item.id,
        productName: item.prodName,
        prodCode: item.prodCode,
        startDate: new Date(item.startDate).toISOString(),
        endDate: new Date(item.endDate).toISOString()
      }));

      const response = await fetch(`${baseUrl}/check-date-conflicts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items: itemsToCheck })
      });

      const data = await response.json();

      if (data.success) {
        const conflicted = data.results.filter(r => r.hasConflicts);
        
        if (conflicted.length > 0) {
          setHasDateConflicts(true);
          setConflictedItems(conflicted);
          const conflictedItem = cartItems.find(item => 
            conflicted.some(c => c.cartItemId === item._id)
          );
          if (conflictedItem) {
            const dateRange = formatCartDateRange(conflictedItem.startDate, conflictedItem.endDate);
            setConflictMessage(`${dateRange} no longer available`);
          } else {
            setConflictMessage(`${conflicted.length} item(s) unavailable`);
          }
          // Always show toast on submission attempt
          toast.error(`${conflicted.length} item(s) no longer available`);
          return false;
        }
        return true;
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

  const calculateProductBasePrice = (item) => {
    const totalAmount = parseAmount(item.totalAmount || 0);
    const printingCost = parseAmount(item.PrintingCost || 0);
    const mountingCost = parseAmount(item.MountingCost || 0);
    return totalAmount + printingCost + mountingCost;
  };

  const calculateOverallTotal = () => {
    if (!cartItems || cartItems.length === 0) return 0;
    return cartItems.reduce((total, item) => {
      return total + calculateProductBasePrice(item);
    }, 0);
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

  const overallTotalBasePrice = calculateOverallTotal();
  const gstPercentageValue = parseFloat(gstPercentage) / 100;
  const gstAmount = overallTotalBasePrice * gstPercentageValue;
  const formattedGstAmount = Math.floor(gstAmount);
  const totalAmountWithGST = overallTotalBasePrice + formattedGstAmount;

  const formatDateForStorage = (date) => {
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
      return null;
    }
    return new Date(Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    ));
  };

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

  const generateUserOrderId = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const sequentialNumber = Math.floor(1000 + Math.random() * 9000);
    return `${year}${month}${day}US${sequentialNumber}`;
  };

  const sendOrderSMS = async (phone, orderId) => {
    try {
      const response = await fetch(`${baseUrl}/OrderCart/send-sms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone,
          orderId
        })
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        console.error("Failed to send SMS:", result.error);
      }
    } catch (error) {
      console.error("SMS sending error:", error);
    }
  };

  const handleSubmitCartThank = async (e) => {
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

    if (!areDatesAvailable || hasDateConflicts) {
      toast.error(
        "Cannot place order! Some items are no longer available. Please update your cart and try again.",
        { autoClose: 8000 }
      );
      return;
    }

    setIsLoading(true);

    try {
      // Prepare products data with proper date handling
      const products = cartItems.map(item => {
        const startDate = item.startDate ? new Date(item.startDate) : null;
        const endDate = item.endDate ? new Date(item.endDate) : null;

        let bookedDates = [];
        if (startDate && endDate) {
          const current = new Date(startDate);
          const end = new Date(endDate);
          while (current <= end) {
            bookedDates.push(formatDateForStorage(new Date(current)));
            current.setDate(current.getDate() + 1);
          }
        }

        const productBasePrice = calculateProductBasePrice(item);
        const orderId = generateUserOrderId();

        return {
          id: item.productId || item.id,
          prodCode: item.prodCode,
          name: item.prodName,
          image: item.image,
          price: parseAmount(item.price),
          printingCost: parseAmount(item.PrintingCost),
          mountingCost: parseAmount(item.MountingCost),
          lighting: item.SpotOutdoorType || "Not Specified",
          fixedAmount: parseAmount(item.SpotPay),
          fixedAmountOffer: parseAmount(item.Offer),
          size: {
            width: parseAmount(item.sizeWidth),
            height: parseAmount(item.sizeHeight),
            squareFeet: parseAmount(item.dimension)
          },
          fromLocation: item.FromSpot || "Not Specified",
          toLocation: item.ToSpot || "Not Specified",
          rating: item.rating || 0,
          mediaType: item.adType || "Not Specified",
          location: {
            state: item.state || 'Unknown',
            district: item.district || 'Unknown',
          },
          booking: {
            startDate: startDate ? formatDateForStorage(startDate) : null,
            endDate: endDate ? formatDateForStorage(endDate) : null,
            totalDays: item.totalDays,
            totalPrice: parseAmount(item.totalAmount)
          },
          productBasePrice: productBasePrice,
          bookedDates: bookedDates.filter(date => date !== null)
        };
      });

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
        products: products,
        overAllTotalAmount: overallTotalBasePrice,
        gstPercentage: gstPercentage,
        gstAmount: formattedGstAmount,
        totalAmountWithGST: totalAmountWithGST,
        status: "UserSideOrder",
        order_status: "Pending Client Confirmation",
        orderType: cartItems.length > 1 ? "cart" : "single",
        queue_info: null
      };

      const response = await fetch(`${baseUrl}/prodOrders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        // Check if the error is due to date conflict
        if (errorData.message && errorData.message.includes("already booked")) {
          setHasDateConflicts(true);
          setConflictMessage(
            "❌ Cannot place order! Some dates are no longer available.\n\n" +
            "The dates you selected have been booked by another user.\n" +
            "Please update your cart and try again."
          );
          toast.error("Some items are no longer available. Please update your cart.");
          setIsLoading(false);
          return;
        }
        throw new Error(errorData.message || 'Failed to create order');
      }

      const result = await response.json();

      // Send SMS to user
      try {
        await sendOrderSMS(phone, result.orderId);
      } catch (smsError) {
        console.error("SMS sending error:", smsError);
      }

      // Send order confirmation email
      try {
        const emailResponse = await fetch(
          `${baseUrl}/OrderCart/send-orderCart-confirmation`, {
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
            products: cartItems.map(item => ({
              id: item.productId || item.id,
              prodCode: item.prodCode,
              name: item.prodName,
              image: item.image,
              price: parseAmount(item.price),
              printingCost: parseAmount(item.PrintingCost),
              mountingCost: parseAmount(item.MountingCost),
              booking: {
                startDate: item.startDate,
                endDate: item.endDate,
                totalDays: item.totalDays,
                totalPrice: parseAmount(item.totalAmount)
              },
              fromLocation: item.FromSpot,
              toLocation: item.ToSpot,
              size: {
                width: item.sizeWidth,
                height: item.sizeHeight,
                squareFeet: item.dimension
              }
            })),
            orderDate: new Date().toLocaleDateString(),
            totalAmount: overallTotalBasePrice,
            overAllTotalAmount: overallTotalBasePrice,
            gstPercentage: gstPercentage,
            gstAmount: formattedGstAmount,
            totalAmountWithGST: totalAmountWithGST,
            orderStatus: result.order_status || "pending"
          })
        });

        if (!emailResponse.ok) {
          console.error("Failed to send order confirmation email");
        }
      } catch (emailError) {
        console.error("Email sending error:", emailError);
      }

      // Clear cart after successful order
      try {
        const clearResponse = await fetch(`${baseUrl}/cart/clear/${user._id}`, {
          method: 'DELETE'
        });

        if (!clearResponse.ok) {
          console.error('Failed to clear cart, but order was placed successfully');
        }
      } catch (clearError) {
        console.error('Error clearing cart:', clearError);
      }

      // Navigate to thank you page
      navigate("/thankyou", {
        state: {
          orderId: result.orderId,
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
          cartItems: cartItems.map((item, index) => {
            const cleanedTotalAmount = parseAmount(item.totalAmount);
            const printingCost = parseAmount(item.PrintingCost);
            const mountingCost = parseAmount(item.MountingCost);
            const productBasePrice = cleanedTotalAmount + printingCost + mountingCost;

            return {
              ...item,
              cleanedTotalAmount: cleanedTotalAmount,
              printingCost: printingCost,
              mountingCost: mountingCost,
              productBasePrice: productBasePrice,
              formattedCleanedTotalAmount: formatIndianCurrency(cleanedTotalAmount, true),
              formattedPrintingCost: formatIndianCurrency(printingCost, true),
              formattedMountingCost: formatIndianCurrency(mountingCost, true),
              formattedProductBasePrice: formatIndianCurrency(productBasePrice, true)
            };
          }),
          subTotal: overallTotalBasePrice,
          totalItems: totalItems,
          TotalPrice: overallTotalBasePrice,
          gstPercentage: gstPercentage,
          gstAmount: formattedGstAmount,
          totalAmountWithGST: totalAmountWithGST,
          orderStatus: result.order_status || "pending"
        }
      });
    } catch (error) {
      console.error("❌ Cart order submission error:", error);

      if (error.message.includes("conflict") || error.message.includes("already booked")) {
        toast.error(`❌ Order failed: Some dates are no longer available. Please update your cart and try again.`);
      } else {
        toast.error(`Failed to place order: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

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

  if (!cartItems || cartItems.length === 0) {
    return (
      <MainLayout>
        <div className="container noSelected">
          <h5 className='noSelectedSpot'>No items found for checkout</h5>
          <button className='noSelectedGoBackBtn' onClick={() => navigate("/cart")}>
            Back to Cart
          </button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div>
        <MainNavbar />
        <div className="billing-container1">
          <div className="billing-header1">
            <div></div>
            <div>BILLING DETAILS</div>
            <div onClick={handleCancel} style={{ color: 'rgba(227, 34, 40, 1)', textAlign: 'right', alignContent: 'end', cursor: 'pointer' }}>
              <i className="fa-regular fa-circle-xmark"></i>
            </div>
          </div>

          {/* Date Conflict Warning Banner */}
          {hasDateConflicts && (
            <div className="date-conflict-banner">
              <div className="billingConflictMain">
                <i className="fa-solid fa-circle-exclamation billingExclamation"></i>
                <span className="billingConflictMessage">
                  {conflictMessage}
                </span>
              </div>
              <button className="billingConflictBackBtn" onClick={() => navigate("/cart")}>
                ← Go Back to Cart & Update
              </button>
            </div>
          )}

          {/* Queue Notice Banner */}
          {!hasDateConflicts && conflictResults.some(r => r.hasQueueDates) && (
            <div className="queue-notice-banner_billing">
              <i className="fa-solid fa-clock conflict_clockBilling"></i>
              <span className="conflict_messageBilling">
                Some items have dates in queue. You'll be added to the waitlist.
              </span>
            </div>
          )}

          <div>
            <form onSubmit={handleSubmitCartThank} className="billing-content1">
              <div className="billing-left1">
                <div className="billing-flow1">
                  <div className="billingFlowLeftArr1" onClick={handleCancel}>
                    <i className="fa-solid fa-arrow-left"></i>
                  </div>
                  <div className="billing-Flowcontent1"> Billing Details</div>
                </div>

                <div className="section-title1">
                  <div className="locationIconOutline1">
                    <img src='./images/loction_icon.svg' className="locationIcon1" alt="Location" />
                  </div>
                  <div> Delivery Address</div>
                </div>

                <div className="billingSpan1">
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
                    className={`input-field1 ${errors.name ? 'AdminProdinput-errorBilling1' : ''}`}
                  />
                  {errors.name && (
                    <div className="AdminProderror-messageBilling1">Enter a valid name</div>
                  )}
                  <span className={`billingInputSpan1 ${name.length === 0 ? "" : "inputSpanFill1"}`}>
                    Your Name*
                  </span>
                </div>

                <div className="phone-input1">
                  <div>
                    <div className={`country-code1 ${errors.phone ? 'AdminProdinput-errorBilling1' : ''}`}>
                      +91
                    </div>
                  </div>
                  <div className="billingSpan1 billingPhoneSpan1">
                    <input
                      type="tel"
                      value={phone}
                      maxLength='10'
                      onChange={(e) => {
                        setPhone(e.target.value);
                        setErrors(prev => ({ ...prev, phone: false }));
                      }}
                      readOnly
                      className={`input-field1 phoneInputField1 ${errors.phone ? 'AdminProdinput-errorBilling1' : ''}`}
                    />
                    {errors.phone && <div className="AdminProderror-messageBillingPhone1">
                      {!phone ? "Contact is required" : "Contact must be 10 digits"}
                    </div>}
                    <span className={`billingInputSpan1 billingPhoneInputSpan1 ${phone.length === 0 ? "" : "inputPhoneSpanFill1"}`}>Phone Number*</span>
                  </div>
                </div>

                <div className="billingSpan1">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setErrors(prev => ({ ...prev, email: false }));
                    }}
                    readOnly
                    className={`input-field1 ${errors.email ? 'AdminProdinput-errorBilling1' : ''}`}
                  />
                  {errors.email && <div className="AdminProderror-messageBilling1">
                    {!email ? "Email is required" : "Invalid email format"}
                  </div>}
                  <span className={`billingInputSpan1 ${email.length === 0 ? "" : "inputSpanFill1"}`}>Your Email*</span>
                </div>

                <div className="billingSpan1">
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
                    className={`input-field1 ${errors.pincode ? 'AdminProdinput-errorBilling1' : ''}`}
                  />
                  {errors.pincode && (
                    <div className="AdminProderror-messageBilling1">Enter a valid 6-digit pincode</div>
                  )}
                  <span className={`billingInputSpan1 ${pincode.length === 0 ? "" : "inputSpanFill1"}`}>
                    Pincode*
                  </span>
                </div>

                <div className="billingStateCity1">
                  <div className="billingSpan1">
                    <input
                      type="text"
                      value={state}
                      onFocus={() => setIsOpen1(true)}
                      readOnly
                      className={`input-field1 stateInputField1 ${errors.state ? 'AdminProdinput-errorBilling1' : ''}`}
                    />
                    <span className={`billingInputSpan1 ${state.length === 0 ? "" : "inputSpanFill1"}`}>State*</span>
                    <i
                      className={`fa-solid ${isOpen1 ? "fa-caret-up" : "fa-caret-down"} phoneInputUpDown1`}
                      onClick={() => setIsOpen1(!isOpen1)}
                    ></i>

                    {isOpen1 && (
                      <div className="billing-dropdown-container1">
                        <div className="billing-search-box1">
                          <i className="fa-solid fa-magnifying-glass stateSearchIcon1"></i>
                          <input
                            type="text"
                            placeholder="Search a state"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="billing-search-input1"
                          />
                        </div>
                        <ul className="billing-state-list1">
                          {filteredStates.length > 0 ? (
                            filteredStates.map((s, index) => (
                              <li
                                key={index}
                                className="billing-state-item1"
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
                            <li className="billing-no-results1">No states found</li>
                          )}
                        </ul>
                      </div>
                    )}
                    {errors.state && <div className="AdminProderror-messageBillingState1">State is required</div>}
                  </div>

                  <div className="billingSpan1">
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => {
                        setCity(e.target.value);
                        setErrors(prev => ({ ...prev, city: false }));
                      }}
                      className={`input-field1 cityInputField1 ${errors.city ? 'AdminProdinput-errorBilling1' : ''}`}
                    />
                    {errors.city && <div className="AdminProderror-messageBilling1">City is required</div>}
                    <span className={`billingInputSpan1 ${city.length === 0 ? "" : "inputSpanFill1"}`}>City*</span>
                  </div>
                </div>

                <div className="billingSpan1">
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => {
                      setCompany(e.target.value);
                      setErrors(prev => ({ ...prev, company: false }));
                    }}
                    className={`input-field1 ${errors.company ? 'AdminProdinput-errorBilling1' : ''}`}
                  />
                  {errors.company && <div className="AdminProderror-messageBilling1">Company is required</div>}
                  <span className={`billingInputSpan1 ${company.length === 0 ? "" : "inputSpanFill1"}`}>Your Company*</span>
                </div>

                <div className="billingSpan1">
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => {
                      setAddress(e.target.value);
                      setErrors(prev => ({ ...prev, address: false }));
                    }}
                    className={`input-field1 ${errors.address ? 'AdminProdinput-errorBilling1' : ''}`}
                  />
                  {errors.address && <div className="AdminProderror-messageBilling1">Address is required</div>}
                  <span className={`billingInputSpan1 ${address.length === 0 ? "" : "inputSpanFill1"}`}>Address*</span>
                </div>
              </div>

              <div className="billing-right1">
              <div className="billing-rightContentMain">
              <div>
                <div className="billing-section-title1">Order Summary</div>
                <div className="billing_contents_right1">
                  <div>
                    <div className='BillingCart-scroll1'>
                      {cartItems.map((item, index) => {
                        const cleanedTotalAmount = parseAmount(item.totalAmount);
                        const printingCost = parseAmount(item.PrintingCost);
                        const mountingCost = parseAmount(item.MountingCost);
                        const productBasePrice = cleanedTotalAmount + printingCost + mountingCost;

                        // Check if this item has conflict
                        const itemConflict = conflictResults.find(r => r.cartItemId === item._id);
                        const isItemConflicted = itemConflict?.hasConflicts || false;

                        return (
                          <div
                            className={`billing-order-item1 ${isItemConflicted ? 'conflicted-item' : ''}`}
                            key={index}
                            style={isItemConflicted ? {
                              border: '2px solid #f44336',
                              backgroundColor: '#ffebee',
                              padding: '10px',
                              borderRadius: '8px',
                              marginBottom: '10px'
                            } : {}}
                          >
                            <img src={item.image} alt="Product" className="billing-order-img1" />
                            <div className="billing-order-title1">
                              <div>{item.prodName}</div>
                              <div>{formatIndianCurrency(item.price, true)} Per Day</div>
                              <div>Booked date : {item.dateRange} ({item.totalDays} Days)</div>
                              <div>Booking Amount : {formatIndianCurrency(cleanedTotalAmount, true)}</div>
                              <div>Printing Cost : {formatIndianCurrency(printingCost, true)}</div>
                              <div>Mounting Cost : {formatIndianCurrency(mountingCost, true)}</div>
                              <div className="product-total">Product Total : {formatIndianCurrency(productBasePrice, true)}</div>
                              {isItemConflicted && (
                                <div style={{ color: '#f44336', fontSize: '12px', marginTop: '5px' }}>
                                  <i className="fa-solid fa-circle-exclamation"></i> {itemConflict?.message}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="BillingScrollTotalContent">
                      <div className="billing-orderTotalAmtContent1 billingTotalContentTop">
                        <div className="billingTotalLeft">Total Products</div>
                        <div className="billingTotalRight">{totalItems}</div>
                      </div>
                    </div>
                  </div>

                  <div className="billing-order-pricing1">
                    <div className="billing-orderContentPriceMain1">
                      <div className="billing-orderContent1">
                        <div className="billing-orderContentLeft1">Base Price (Excl. GST)</div>
                        <div className="billing-orderContentRight1">{formatIndianCurrency(overallTotalBasePrice, true)}</div>
                      </div>
                      <div className="billing-orderContent1">
                        <div className="billing-orderContentLeft1">GST @ {gstPercentage}%</div>
                        <div className="billing-orderContentRight1">{formatIndianCurrency(formattedGstAmount, true)}</div>
                      </div>
                    </div>
                    <div className="billing-orderContent1">
                      <div className="billing-orderContentLeft1 BillingTotalAmt1">Total (Incl. GST)</div>
                      <div className="billing-orderContentRight1 BillingTotalAmt1">{formatIndianCurrency(totalAmountWithGST, true)}</div>
                    </div>
                  </div>
                </div>
</div>
                <div>
                  <div className="billingButton1">
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

export default BillingDetailsCart;