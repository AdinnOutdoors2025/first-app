import React, { useState, useEffect } from "react";
import "./F2BillingCart.css";
import { useNavigate, useLocation } from 'react-router-dom';
import MainNavbar from './A1NAVBAR.jsx';
import MainFooter from './A1FOOTER.jsx';
import { toast } from 'react-toastify';
//the mainLayout for login toggle then background gets blurred 
import { MainLayout } from './MainLayout';
import { useLogin } from './LoginContext';
import { baseUrl } from '../Adminpanel/BASE_URL';
import { formatIndianCurrency } from './FORMATED_AMOUNT';


const BillingDetailsCart = () => {
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
  const location = useLocation();
  const { billingInfo, cartItems, subTotal, TotalPrice, totalItems, SpotPay, Offer } = location.state || {};
  //NEWLY ADDED CHECK FOR DATE CONFLICT CHECK  
  // Add this useEffect to check for conflicts when cart loads
  useEffect(() => {
    const checkCartConflicts = async () => {
      if (!cartItems || cartItems.length === 0 || !user) return;

      try {
        const conflictResults = await Promise.all(
          cartItems.map(async (item) => {
            if (!item.startDate || !item.endDate) {
              return { hasConflicts: false, itemId: item._id };
            }

            const response = await fetch(
              `${baseUrl}/check-date-conflicts/${item.prodCode}?startDate=${new Date(item.startDate).toISOString()}&endDate=${new Date(item.endDate).toISOString()}`
            );

            if (response.ok) {
              const data = await response.json();
              return {
                ...data,
                itemId: item._id,
                productName: item.prodName
              };
            }
            return { hasConflicts: false, itemId: item._id };
          })
        );

        // Show warning for conflicted items
        const conflictedItems = conflictResults.filter(result => result.hasConflicts);
        if (conflictedItems.length > 0) {
          console.log("Conflicted items in cart:", conflictedItems);
          // You can show a toast notification or update UI to indicate conflicts
          toast.warning(
            `${conflictedItems.length} item(s) in your cart may no longer be available. Please review before checkout.`,
            { autoClose: 5000 }
          );
        }
      } catch (error) {
        console.error("Error checking cart conflicts:", error);
      }
    };

    if (cartItems.length > 0) {
      checkCartConflicts();
    }
  }, [cartItems, user]);

  // Replace the problematic date handling with this:
  const startDate = cartItems[0]?.startDate ? new Date(cartItems[0].startDate) : null;
  const endDate = cartItems[0]?.endDate ? new Date(cartItems[0].endDate) : null;

  if (!startDate || !endDate || isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    return (
      <div className="container noSelected">
        <h5 className='noSelectedSpot'>Invalid booking dates. Please check your cart items.</h5>
        <button className='noSelectedGoBackBtn' onClick={() => navigate("/cart")}>
          Back to Cart
        </button>
      </div>
    );
  }

  // Helper function to clean and convert price strings to numbers
  const cleanPrice = (price) => {
    if (typeof price === 'number') return price;
    if (typeof price === 'string') {
      // Remove commas and any non-numeric characters except decimal point
      const cleaned = price.replace(/[^0-9.]/g, '');
      return parseFloat(cleaned) || 0;
    }
    return 0;
  };

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
  //NEWLY ADDED CODE
  // Add this function to your component
  // const sendOrderSMS = async (phone, orderId, isAdmin = false) => {
  //     try {
  //         const response = await fetch(`${baseUrl}/send-sms`, {
  //             method: 'POST',
  //             headers: {
  //                 'Content-Type': 'application/json',
  //             },
  //             body: JSON.stringify({
  //                 phone,
  //                 templateId: isAdmin ? "1007478982147905431" : "1007197121174928712",
  //                 variables: {
  //                     orderId,
  //                     customerName: name,
  //                     amount: SpotPay
  //                 }
  //             })
  //         });

  //         if (!response.ok) {
  //             console.error("Failed to send SMS");
  //         }
  //     } catch (error) {
  //         console.error("SMS sending error:", error);
  //     }
  // };



  // const sendOrderSMS = async (phone, orderId, amount) => {
  //     try {
  //         const response = await fetch(`${baseUrl}/OrderCart/send-sms`, {
  //             method: 'POST',
  //             headers: {
  //                 'Content-Type': 'application/json',
  //             },
  //             body: JSON.stringify({
  //                 phone,
  //                 orderId,
  //                 amount: amount || 0
  //                 // Remove templateId from here
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
  //     }
  // }; 


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
          // Only send orderId, not templateId
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


  // // Check for conflicts before proceeding
  //     const conflictCheck = await checkDateConflicts(
  //       reserveItem.prodCode,
  //       new Date(reserveItem.startDate),
  //       new Date(reserveItem.endDate)
  //     );

  //     if (conflictCheck.hasConflicts) {
  //       let errorMessage = "❌ The selected dates are no longer available.\n";

  //       if (conflictCheck.suggestions && conflictCheck.suggestions.length > 0) {
  //         errorMessage += "\nSuggested alternative available periods:\n";
  //         conflictCheck.suggestions.forEach((suggestion, index) => {
  //           const start = new Date(suggestion.startDate);
  //           const end = new Date(suggestion.endDate);
  //           errorMessage += `${index + 1}. ${start.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} - ${end.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}\n`;
  //         });
  //       }

  //       alert(errorMessage);
  //       setIsLoading(false);
  //       // Navigate back to product page
  //       navigate(`/Product/${productId}`, { 
  //         state: { 
  //           selectedSpot: reserveItem,
  //           dateConflict: true,
  //           suggestions: conflictCheck.suggestions 
  //         }
  //       });
  //       return;
  //     }
  // const handleSubmitCartThank = async (e) => {
  //     e.preventDefault();
  //     // Validate form first
  //     if (!validateForm()) {
  //         alert("Please fill all required fields correctly");
  //         return;
  //     }
  //     // Prepare products data with proper date handling
  //     const products = cartItems.map(item => {
  //         // Convert dates to proper format
  //         const startDate = item.startDate ? new Date(item.startDate) : null;
  //         const endDate = item.endDate ? new Date(item.endDate) : null;
  //         // Generate booked dates array
  //         let bookedDates = [];
  //         if (startDate && endDate) {
  //             const current = new Date(startDate);
  //             const end = new Date(endDate);
  //             while (current <= end) {
  //                 bookedDates.push(new Date(current));
  //                 current.setDate(current.getDate() + 1);
  //             }
  //         }
  //         return {
  //             id: item.productId || item.id,
  //             prodCode: item.prodCode,
  //             name: item.prodName,
  //             image: item.image,
  //             price: cleanPrice(item.price),
  //             printingCost: cleanPrice(item.PrintingCost),
  //             mountingCost: cleanPrice(item.MountingCost),
  //             lighting: item.SpotOutdoorType,
  //             fixedAmount: cleanPrice(item.SpotPay),
  //             fixedAmountOffer: cleanPrice(item.Offer),
  //             size: {
  //                 width: item.sizeWidth,
  //                 height: item.sizeHeight,
  //                 squareFeet: item.dimension
  //             },
  //             fromLocation: item.FromSpot,
  //             toLocation: item.ToSpot,
  //             rating: item.rating,
  //             mediaType: item.adType,
  //             location: {
  //                 state: item.state || 'Unknown',
  //                 district: item.district || 'Unknown',
  //             },
  //             booking: {
  //                 startDate: startDate,
  //                 endDate: endDate,
  //                 totalDays: item.totalDays,
  //                 totalPrice: cleanPrice(item.totalAmount)
  //             },
  //             bookedDates: bookedDates
  //         };
  //     });

  //     const orderData = {
  //         client: {
  //             userId: user._id,
  //             name: name,
  //             email: email,
  //             contact: phone,
  //             company: company,
  //             address: address,
  //             pincode: pincode,
  //             state: state,
  //             city: city,
  //             // paidAmount: cleanPrice(SpotPay).toString(),
  //         },
  //         products: products,
  //         status: "UserSideOrder",
  //         orderType: cartItems.length > 1 ? "cart" : "single"
  //     };
  //     setIsLoading(true);
  //     try {
  //         console.log(orderData);
  //         // Save order to database
  //         const response = await fetch(`${baseUrl}/prodOrders`, {
  //             method: 'POST',
  //             headers: { 'Content-Type': 'application/json' },
  //             body: JSON.stringify(orderData)
  //         });

  //         if (!response.ok) {
  //             const errorData = await response.json();
  //             throw new Error(errorData.message || 'Failed to create order');
  //         }

  //         const result = await response.json();

  //         //NEWLY ADDED CODE FOR SMS
  //         try {
  //             // Send SMS to user
  //             await sendOrderSMS(phone, result.orderId);

  //             // Send SMS to admin
  //             await sendOrderSMS('reactdeveloper@adinn.co.in', result.orderId, true);
  //         } catch (smsError) {
  //             console.error("SMS sending error:", smsError);
  //             // Don't fail the order if SMS fails
  //         }
  //         // Inside handleSubmitCartThank function, after order creation:
  //         try {
  //             const emailResponse = await fetch(
  //                 `${baseUrl}/OrderCart/send-orderCart-confirmation`, {
  //                 method: 'POST',
  //                 headers: {
  //                     'Content-Type': 'application/json',
  //                 },
  //                 body: JSON.stringify({
  //                     orderId: result.orderId || result._id,
  //                     userName: name,
  //                     userEmail: email,
  //                     userPhone: phone,
  //                     userAddress: `${address}, ${city}, ${state} - ${pincode}`,
  //                     company,
  //                     products: cartItems.map(item => ({
  //                         id: item.productId || item.id,
  //                         prodCode: item.prodCode,
  //                         name: item.prodName,
  //                         image: item.image,
  //                         price: cleanPrice(item.price),
  //                         booking: {
  //                             startDate: item.startDate,
  //                             endDate: item.endDate,
  //                             totalDays: item.totalDays,
  //                             totalPrice: cleanPrice(item.totalAmount)
  //                         },
  //                         fromLocation: item.FromSpot,
  //                         toLocation: item.ToSpot,
  //                         size: {
  //                             width: item.sizeWidth,
  //                             height: item.sizeHeight,
  //                             squareFeet: item.dimension
  //                         }
  //                     })),
  //                     orderDate: new Date().toLocaleDateString(),
  //                     totalAmount: subTotal
  //                 })
  //             }
  //             );

  //             if (!emailResponse.ok) {
  //                 console.error("Failed to send order confirmation email");
  //             }
  //         } catch (emailError) {
  //             console.error("Email sending error:", emailError);
  //         }


  //         // Clear cart after successful order
  //         try {
  //             const clearResponse = await fetch(`${baseUrl}/cart/clear/${user._id}`, {
  //                 method: 'DELETE'
  //             });

  //             if (!clearResponse.ok) {
  //                 console.error('Failed to clear cart, but order was placed successfully');
  //             }
  //         } catch (clearError) {
  //             console.error('Error clearing cart:', clearError);
  //         }

  //         navigate("/thankyou", {
  //             state: {
  //                 orderId: result.orderId,
  //                 billingInfo: {
  //                     name,
  //                     email,
  //                     phone,
  //                     pincode,
  //                     state,
  //                     city,
  //                     address,
  //                     company,
  //                 },
  //                 cartItems: cartItems,
  //                 subTotal: subTotal,
  //                 totalItems: totalItems,
  //                 TotalPrice: subTotal,
  //             }
  //         });
  //     } catch (error) {
  //         console.error("Order submission error:", error);
  //         alert(`Failed to place order: ${error.message}`);
  //     }
  //     finally {
  //         setIsLoading(false);
  //     }

  //     console.log('Order data being sent:', JSON.stringify(orderData, null, 2));
  // };

  // Helper function to fetch cart items (if you need to refresh after conflicts)
  const fetchCartItems = async () => {
    try {
      const response = await fetch(`${baseUrl}/cart/user/${user._id}`);
      if (response.ok) {
        const data = await response.json();
        // Update cart items state if needed
        // You might want to use setCartItems(data) if you have a state setter
        return data;
      }
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
    return [];
  };

  const handleSubmitCartThank = async (e) => {
    e.preventDefault();

    // Validate form first
    if (!validateForm()) {
      alert("Please fill all required fields correctly");
      return;
    }

    setIsLoading(true);

    try {
      // Check conflicts for each cart item
      const conflictChecks = await Promise.all(
        cartItems.map(async (item) => {
          if (!item.startDate || !item.endDate) {
            return {
              hasConflicts: true,
              productName: item.prodName,
              prodCode: item.prodCode,
              message: "Missing booking dates"
            };
          }

          try {
            // Check date conflicts for this specific item
            const response = await fetch(
              `${baseUrl}/check-date-conflicts/${item.prodCode}?startDate=${new Date(item.startDate).toISOString()}&endDate=${new Date(item.endDate).toISOString()}`
            );

            if (response.ok) {
              const data = await response.json();
              return {
                ...data,
                productName: item.prodName,
                prodCode: item.prodCode,
                itemId: item._id || item.productId,
                image: item.image,
                price: cleanPrice(item.price),
                booking: {
                  startDate: item.startDate,
                  endDate: item.endDate,
                  totalDays: item.totalDays,
                  totalPrice: cleanPrice(item.totalAmount)
                }
              };
            } else {
              return {
                hasConflicts: false, // Assume no conflicts if API fails
                productName: item.prodName,
                prodCode: item.prodCode,
                itemId: item._id || item.productId
              };
            }
          } catch (error) {
            console.error(`Error checking conflicts for ${item.prodCode}:`, error);
            return {
              hasConflicts: false, // Assume no conflicts on error
              productName: item.prodName,
              prodCode: item.prodCode,
              itemId: item._id || item.productId
            };
          }
        })
      );

      // Check if any items have confirmed conflicts (not just queue)
      const conflictedItems = conflictChecks.filter(check => check.hasConflicts && check.confirmedConflictCount > 0);

      if (conflictedItems.length > 0) {
        // Build detailed conflict message
        let conflictMessage = "❌ Some items in your cart are no longer available:\n\n";

        conflictedItems.forEach((item, index) => {
          conflictMessage += `${index + 1}. ${item.productName} (${item.prodCode})\n`;
          conflictMessage += `   Booked: ${new Date(item.booking?.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} - ${new Date(item.booking?.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}\n`;
          conflictMessage += `   Conflicted Dates: ${item.confirmedConflictCount} confirmed booked date(s)\n`;

          // Show suggestions if available
          if (item.suggestions && item.suggestions.length > 0) {
            conflictMessage += "   Available alternatives:\n";
            item.suggestions.slice(0, 2).forEach((suggestion, suggestionIndex) => {
              const start = new Date(suggestion.startDate);
              const end = new Date(suggestion.endDate);
              conflictMessage += `   ${suggestionIndex + 1}. ${start.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} - ${end.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}\n`;
            });
          }
          conflictMessage += "\n";
        });

        conflictMessage += "\nPlease remove these items or update their dates before proceeding.";

        // Show detailed conflict alert
        alert(conflictMessage);
        setIsLoading(false);

        // Navigate back to cart with conflict information
        navigate("/cart", {
          state: {
            conflictedItems: conflictedItems.map(item => ({
              productName: item.productName,
              prodCode: item.prodCode,
              itemId: item.itemId,
              suggestions: item.suggestions,
              conflictedDates: item.confirmedConflictCount
            }))
          }
        });
        return;
      }

      // Check for items with only queue conflicts (pending dates)
      const queueItems = conflictChecks.filter(check => check.hasQueueDates && check.pendingConflictCount > 0);

      if (queueItems.length > 0) {
        // Build queue warning message
        let queueMessage = "⚠️ Some items in your cart have dates in queue:\n\n";

        queueItems.forEach((item, index) => {
          queueMessage += `${index + 1}. ${item.productName} (${item.prodCode})\n`;
          queueMessage += `   ${item.pendingConflictCount} date(s) in queue\n`;
          queueMessage += `   Status: These dates are pending confirmation from other users\n`;
        });

        queueMessage += "\nYou can still book these items, but:\n";
        queueMessage += "• You'll be added to the queue\n";
        queueMessage += "• If pending orders ahead of you get cancelled, your booking will move up\n";
        queueMessage += "• You'll receive email updates on queue status\n\n";
        queueMessage += "Do you want to proceed with the queue?";

        const proceedWithQueue = window.confirm(queueMessage);

        if (!proceedWithQueue) {
          setIsLoading(false);
          return;
        }
      }

      // Prepare products data with proper date handling
      const products = cartItems.map(item => {
        // Convert dates to proper format
        const startDate = item.startDate ? new Date(item.startDate) : null;
        const endDate = item.endDate ? new Date(item.endDate) : null;

        // Generate booked dates array
        let bookedDates = [];
        if (startDate && endDate) {
          const current = new Date(startDate);
          const end = new Date(endDate);
          while (current <= end) {
            bookedDates.push(new Date(current));
            current.setDate(current.getDate() + 1);
          }
        }

        return {
          id: item.productId || item.id,
          prodCode: item.prodCode,
          name: item.prodName,
          image: item.image,
          price: cleanPrice(item.price),
          printingCost: cleanPrice(item.PrintingCost),
          mountingCost: cleanPrice(item.MountingCost),
          lighting: item.SpotOutdoorType,
          fixedAmount: cleanPrice(item.SpotPay),
          fixedAmountOffer: cleanPrice(item.Offer),
          size: {
            width: item.sizeWidth,
            height: item.sizeHeight,
            squareFeet: item.dimension
          },
          fromLocation: item.FromSpot,
          toLocation: item.ToSpot,
          rating: item.rating,
          mediaType: item.adType,
          location: {
            state: item.state || 'Unknown',
            district: item.district || 'Unknown',
          },
          booking: {
            startDate: startDate,
            endDate: endDate,
            totalDays: item.totalDays,
            totalPrice: cleanPrice(item.totalAmount)
          },
          bookedDates: bookedDates
        };
      });

      // Create order data with queue status
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
        status: "UserSideOrder",
        // order_status: queueItems.length > 0 ? "pending" : "confirmed", // Set status based on queue
        order_status: "Pending Client Confirmation", // Set status based on queue

        orderType: cartItems.length > 1 ? "cart" : "single",
        queue_info: queueItems.length > 0 ? {
          queue_count: queueItems.length,
          entered_queue_at: new Date(),
          items_in_queue: queueItems.map(item => item.prodCode)
        } : null
      };

      console.log("📤 Submitting cart order:", {
        productsCount: orderData.products.length,
        order_status: orderData.order_status,
        hasQueue: queueItems.length > 0
      });

      // Save order to database
      const response = await fetch(`${baseUrl}/prodOrders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create order');
      }

      const result = await response.json();

      console.log("✅ Cart order created successfully:", result);

      // Send SMS to user
      try {
        await sendOrderSMS(phone, result.orderId, name, subTotal);
      } catch (smsError) {
        console.error("SMS sending error:", smsError);
        // Don't fail the order if SMS fails
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
              price: cleanPrice(item.price),
              booking: {
                startDate: item.startDate,
                endDate: item.endDate,
                totalDays: item.totalDays,
                totalPrice: cleanPrice(item.totalAmount)
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
            totalAmount: subTotal,
            orderStatus: result.order_status || "pending",
            hasQueue: queueItems.length > 0,
            queueInfo: queueItems.length > 0 ?
              `Your order includes ${queueItems.length} item(s) with dates in queue. You'll receive updates on confirmation.` :
              'All dates are confirmed.'
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

      // Navigate to thank you page with appropriate message
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
          cartItems: cartItems,
          subTotal: subTotal,
          totalItems: totalItems,
          TotalPrice: subTotal,
          orderStatus: result.order_status || "pending",
          queueInfo: queueItems.length > 0 ? {
            hasQueue: true,
            queueCount: queueItems.length,
            message: `Your order includes ${queueItems.length} item(s) with dates in queue. You'll receive email updates when they are confirmed.`
          } : null
        }
      });
    } catch (error) {
      console.error("❌ Cart order submission error:", error);

      // Check if it's a specific conflict error
      if (error.message.includes("conflict") || error.message.includes("already booked")) {
        alert(`❌ Order failed: Some dates are no longer available. Please update your cart and try again.\n\nError: ${error.message}`);

        // Refresh cart items to get current availability
        fetchCartItems();
      } else {
        alert(`Failed to place order: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };
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
            <div>BILLING DETAILS</div>
          </div>
          <div >
            <form onSubmit={handleSubmitCartThank} className="billing-content1">
              {/* Left Section: Delivery Address */}
              <div className="billing-left1">
                <div className="billing-flow1">
                  <div className="billingFlowLeftArr1"> <i className="fa-solid fa-arrow-left"></i></div>
                  <div className="billing-Flowcontent1"> Billing Details</div>
                  <div className="billing-Flowcontent FlowContent1">-------</div>
                  <div className="billing-Flowcontent FlowContent11">Payments</div>
                </div>

                <div className="section-title1">
                  <div className="locationIconOutline1">
                    <img src='./images/loction_icon.svg' className="locationIcon1"></img>
                  </div>
                  <div> Delivery Address</div>
                </div>
                {/* Name */}
                <div className="billingSpan1">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => {
                      let value = e.target.value;

                      // Allow only letters and spaces
                      if (/^[A-Za-z\s]*$/.test(value)) {
                        // Remove starting spaces & multiple spaces
                        value = value.replace(/^\s+/, "").replace(/\s+/g, " ");
                        setName(value);
                        setErrors(prev => ({ ...prev, name: false }));
                      }
                    }}
                    onBlur={() => {
                      // Final trim
                      setName(name.trim());
                    }}
                    className={`input-field1 ${errors.name ? 'AdminProdinput-errorBilling1' : ''}`}
                  />

                  {errors.name && (
                    <div className="AdminProderror-messageBilling1">Enter a valid name</div>
                  )}

                  <span className={`billingInputSpan1 ${name.length === 0 ? "" : "inputSpanFill1"}`}>
                    Your Name*
                  </span>
                </div>


                {/* PHONE  */}
                <div className="phone-input1">
                  <div>
                    <div className={`country-code1 ${errors.phone ? 'AdminProdinput-errorBilling1' : ''}`}>
                      +91
                    </div>
                  </div>

                  <div className="billingSpan1 billingPhoneSpan1">
                    <input
                      type="text"
                      value={phone}
                      maxLength='10'
                      onChange={(e) => {
                        setPhone(e.target.value);
                        setErrors(prev => ({ ...prev, phone: false }));
                      }} readOnly
                      className={`input-field1 phoneInputField1 ${errors.phone ? 'AdminProdinput-errorBilling1' : ''} `}
                    />
                    {errors.phone && <div className="AdminProderror-messageBillingPhone1">
                      {!phone ? "Contact is required" : "Contact must be 10 digits"}
                    </div>}
                    <span className={`billingInputSpan1 billingPhoneInputSpan1  ${phone.length === 0 ? "" : "inputPhoneSpanFill1"}`}>Phone Number*</span>
                  </div>

                </div>

                {/* EMAIL  */}
                <div className="billingSpan1">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setErrors(prev => ({ ...prev, email: false }));
                    }} readOnly

                    className={`input-field1 ${errors.email ? 'AdminProdinput-errorBilling1' : ''}`}
                  />
                  {errors.email && <div className="AdminProderror-messageBilling1">
                    {!email ? "Email is required" : "Invalid email format"}
                  </div>}
                  <span className={`billingInputSpan1  ${email.length === 0 ? "" : "inputSpanFill1"}`}>Your Email*</span>
                </div>

                {/* PINCODE */}
                <div className="billingSpan1">
                  <input
                    type="tel"
                    value={pincode}
                    maxLength={6}
                    onChange={(e) => {
                      let value = e.target.value.replace(/\D/g, ""); // only digits

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


                {/* STATE CITY  */}
                <div className="billingStateCity1">
                  <div className="billingSpan1">
                    {/* Input Field */}
                    <input
                      type="text"
                      value={state}
                      onFocus={() => setIsOpen1(true)}
                      readOnly
                      className={`input-field1 stateInputField1 ${errors.state ? 'AdminProdinput-errorBilling1' : ''}`}
                    />
                    <span className={`billingInputSpan1 ${state.length === 0 ? "" : "inputSpanFill1"}`}>State*</span>

                    {/* Dropdown Icon */}
                    <i
                      className={`fa-solid ${isOpen1 ? "fa-caret-up" : "fa-caret-down"} phoneInputUpDown1`}
                      onClick={() => setIsOpen1(!isOpen1)}
                    ></i>

                    {/* Dropdown List */}
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
                  {/* City  */}
                  <div className=" billingSpan1">
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => {
                        setCity(e.target.value);
                        setErrors(prev => ({ ...prev, city: false }));
                      }} className={`input-field1 cityInputField1 ${errors.city ? 'AdminProdinput-errorBilling1' : ''} `}
                    />
                    {errors.city && <div className="AdminProderror-messageBilling1 ">City is required</div>}

                    <span className={`billingInputSpan1  ${city.length === 0 ? "" : "inputSpanFill1"}`}>City*</span>
                  </div>
                </div>

                {/* COMPANY */}
                <div className=" billingSpan1">
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => {
                      setCompany(e.target.value);
                      setErrors(prev => ({ ...prev, company: false }));
                    }} className={`input-field1 ${errors.company ? 'AdminProdinput-errorBilling1' : ''} `}

                  />
                  {errors.company && <div className="AdminProderror-messageBilling1 ">Company is required</div>}

                  <span className={`billingInputSpan1  ${company.length === 0 ? "" : "inputSpanFill1"}`}>Your Company*</span>
                </div>

                {/* ADDRESS HOUSE NUMBER, APARTMENT  */}
                <div className=" billingSpan1">
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => {
                      setAddress(e.target.value);
                      setErrors(prev => ({ ...prev, address: false }));
                    }} className={`input-field1 ${errors.address ? 'AdminProdinput-errorBilling1' : ''} `}
                  />
                  {errors.address && <div className="AdminProderror-messageBilling1">Address is required</div>}

                  <span className={`billingInputSpan1 ${address.length === 0 ? "" : "inputSpanFill1"}`}>Address*</span>
                </div>

              </div>

              {/* Right Section: Order Summary */}
              <div className="billing-right1">
                <div className="billing-section-title1">Order Summary</div>
                <div className="billing_contents_right1">
                  <div>
                    <div className='BillingCart-scroll1'>
                      {
                        cartItems.map(
                          (item, index) => {
                            const cleanedTotalAmount = cleanPrice(item.totalAmount);
                            return (
                              <div className="billing-order-item1" key={index}>
                                <img src={item.image} alt="Product" className="billing-order-img1" />
                                <div className="billing-order-title1">
                                  <div>{item.prodName}</div>
                                  <div>{formatIndianCurrency(item.price, true)} Per Day</div>
                                  <div>Booked date : {item.dateRange} ({item.totalDays} Days)</div>
                                  <div>Booked Amount : {formatIndianCurrency(cleanedTotalAmount, true)}</div>
                                </div>
                              </div>
                            )
                          }
                        )}
                    </div>

                    <div className="BillingScrollTotalContent">
                      <div className="billing-orderTotalAmtContent1 billingTotalContentTop">
                        <div className="billingTotalLeft" >Total Products</div>
                        <div className="billingTotalRight"> {totalItems}</div>
                      </div>
                      <div className="billing-orderTotalAmtContent1">
                        <div className="billingTotalLeft1">Total Amount</div>
                        {/* <div className="billingTotalRight1"> {subTotal.toLocaleString()}</div> */}
                        <div className="billingTotalRight1"> ₹ {formatIndianCurrency(subTotal, true)}</div>

                      </div>

                    </div>
                    {/* <div className="BillingScrollDiscount">
                                            Enjoy a {Offer}% discount on your total amount when you pre-book
                                        </div> */}
                  </div>
                  <div className="billing-order-pricing1">

                    {/* MOUNTING CHARGE  */}
                    <div className="billing-orderContentPriceMain1">
                      <div className="billing-orderContent11">
                        <div className="billing-orderContentLeft1">Price</div>
                        {/* <div className="billing-orderContentRight1">₹{SpotPay.toLocaleString()}</div> */}
                        <div className="billing-orderContentRight1">{formatIndianCurrency(subTotal, true)}</div>

                      </div>

                      <div className="billing-orderContent1 billingMountingcharge1">
                        <div className="billing-orderContentLeft1">Mounting Charges</div>
                        <div className="billing-orderContentRight1">-</div>
                      </div>
                    </div>
                    <div className="billing-orderContent1">
                      <div className="billing-orderContentLeft1 BillingTotalAmt1">Total Amount</div>
                      {/* <div className="billing-orderContentRight1 BillingTotalAmt1">₹{SpotPay.toLocaleString()}</div> */}
                      <div className="billing-orderContentRight1 BillingTotalAmt1">{formatIndianCurrency(subTotal, true)}</div>

                    </div>

                  </div>
                </div>
                {/* Billing button  */}
                <div className="billingButton1">
                  {/* <div> ₹{SpotPay.toLocaleString()}</div> */}
                  <div>{formatIndianCurrency(subTotal, true)}</div>

                  <div> <button className="billingContinueBtn1" type="submit"
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
export default BillingDetailsCart;