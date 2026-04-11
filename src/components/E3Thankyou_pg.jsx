// import React, { useState } from 'react';
// import './E3Thankyou_pg.css';
// import { useNavigate, useLocation } from 'react-router-dom';
// import LoginPageMain from './C1LoginMain';
// import MainNavbar from './A1NAVBAR.jsx';
// import MainFooter from './A1FOOTER.jsx';
// import { MainLayout } from './MainLayout';
// import { formatIndianCurrency } from './FORMATED_AMOUNT';

// function ThankyouPage() {

//   // Navbar js 
//   const [isMenuOpen, setMenuOpen] = useState(false);
//   const toggleMenu = () => {
//     setMenuOpen(!isMenuOpen);
//   };
//   //Nav_user toggle section
//   const [isOpen, setIsOpen] = useState(false);

//   const toggleNavOpen = () => {
//     setIsOpen(!isOpen);
//   };
//   // NAVIGATE    //If i click the orders, signup or login then go the login page
//   const navigate = useNavigate();
//   const [isLoginOpen, setIsLoginOpen] = useState(false); // State to toggle Login 
//   //Toggle LoginPage
//   const toggleLoginPage = () => {
//     setIsLoginOpen(!isLoginOpen);
//   };
//   const closeLoginPage = () => {
//     setIsLoginOpen(false);
//   }
//   const thankItems = [
//     { id: 1, thankImg: './images/spot1.png', thankTitle: "Adayar L B Road towards Thiruvanmiyur", thankAmount: 41580, thankDays: 5 },
//     { id: 2, thankImg: './images/spot1.png', thankTitle: "Adayar L B Road towards Thiruvanmiyur", thankAmount: 10655, thankDays: 5 },
//   ]
//    // Define parseAmount function
//     const parseAmount = (amount) => {
//         if (amount === null || amount === undefined || amount === '') return 0;
//         if (typeof amount === 'number') return amount;


//         if (typeof amount === 'string') {
//             // Remove any commas, currency symbols, and spaces
//             const cleaned = amount.replace(/[₹$,¥€\s]/g, '').replace(/,/g, '');
//             const parsed = parseFloat(cleaned);
//             return isNaN(parsed) ? 0 : parsed;
//         }
//         // Try to convert to number
//         const parsed = Number(amount);
//         return isNaN(parsed) ? 0 : parsed;
//     };

//   const location = useLocation();
//   const { billingInfo, cartItems, subTotal, TotalPrice, totalItems, orderId, overAllTotalAmount, gstPercentage, gstAmount, totalAmountWithGST } = location.state || {};
// console.log("BILLING INFO1", billingInfo, cartItems, TotalPrice, totalItems, orderId, gstPercentage, gstAmount, totalAmountWithGST);
//   // if (!billingInfo || !cartItems) {
//   //   return <div>No order details found!</div>;
//   // }

//  // Function to calculate product base price if not already in cartItems
//   const getProductBasePrice = (item) => {
//     // If productBasePrice already exists in the item (sent from BillingDetailsCart)
//     if (item.productBasePrice !== undefined && item.productBasePrice !== null) {
//       return item.productBasePrice;
//     }
    
//     // Otherwise calculate it
//     const cleanedTotalAmount = parseAmount(item.totalAmount);
//     const printingCost = parseAmount(item.PrintingCost);
//     const mountingCost = parseAmount(item.MountingCost);
//     return cleanedTotalAmount + printingCost + mountingCost;
//   };

//   // Function to get formatted product base price
//   const getFormattedProductBasePrice = (item) => {
//     const productBasePrice = getProductBasePrice(item);
//     return formatIndianCurrency(productBasePrice, true);
//   };

//   // Function to get individual components
//   const getBookingAmount = (item) => {
//     if (item.cleanedTotalAmount !== undefined) {
//       return formatIndianCurrency(item.cleanedTotalAmount, true);
//     }
//     return formatIndianCurrency(parseAmount(item.totalAmount), true);
//   };
//     // Calculate display amounts
//     const parsedTotalAmount = parseAmount( cartItems?.totalAmount || 0);
//     const displayTotalAmount = formatIndianCurrency(parsedTotalAmount, true);


//     const displayOverAllTotalAmount = formatIndianCurrency(overAllTotalAmount, true);
//     const displayOverAllPrice = formatIndianCurrency(TotalPrice, true);
//     const displaygstPercentage = formatIndianCurrency(gstPercentage, true);
//     const displaygstAmount = formatIndianCurrency(gstAmount, true);
//     const displaytotalAmountWithGST = formatIndianCurrency(totalAmountWithGST, true);
//     console.log("GST % : ", displaygstPercentage, "GST Amt : ", displaygstAmount, "TotalAmtWithGST : ", displaytotalAmountWithGST);


//   return (
//             <MainLayout>

//     <div>
//       <MainNavbar />

//       {/* Thankyou page content  */}
//       <div className='thankyou_pgMain1'>
//         <div className='thankyou_contentMain1 container'>
//           <div className='thank_left1'>
//             <div className='thank-content11'> Thank You !</div>
//             <div className='thank-content21' style={{ paddingBottom: '10px' }}>Your order has been confirmed, <span>{billingInfo.name}</span>.</div>
//             {/* <div className='thank-content21'>We’ll reach out with further details soon.</div> */}
//             <div className='thank-content21'>Our team will contact you shortly.</div>
//             {/* <span className='thank-content2 site-address1'>Site Address</span> */}
//           </div>
//           <div className='thank_right1'>
//             <div className='thank_right-content1'>
//               <div className='thank_order-content1'>
//                 <div className='thank_orderDetails1 orderDetails11'>Order Number
//                   <span className='thank_orderDetailsCode1'> {orderId}</span></div>
//                 <div className='thank_orderDetails1 orderDetails21'>Date<br></br>
//                   {new Date().toLocaleDateString("en-US", {
//                     year: "numeric",
//                     month: "long",
//                     day: "numeric"
//                   })}</div>
//                 <div className='thank_orderDetails1 orderDetails31'>Total Amount (Incl.GST)</div>
//                                 <div className='thank_orderDetailsCode1 orderAmount1'> {displayOverAllPrice}</div> |
//                 <div className='thank_orderDetailsCode1 orderAmount1'> {displaygstAmount}</div> |
//                 <div className='thank_orderDetailsCode1 orderAmount1'> {displaytotalAmountWithGST}</div>
//               </div>
//               <div className="ThankScrollContent1">
//                 {
//                   cartItems.map(
//                     (item, index) =>
//                       <div className='thank_item-content1' key={index}>
//                         <div className='thank_item-contentDetails11'>
//                           <img src={item.image} className='thank_item-img1' alt={item.prodName}></img>
//                         </div>
//                         <div className='thank_item-contentDetails21' >
//                           <span className='thank-item-heading1'>{item.prodName}</span><br></br>
//                           {/* <span>₹ {item.subTotal}</span><br></br> */} 
//                           <span>{getFormattedProductBasePrice(item)}</span><br></br>

//                           {/* <span>{item.totalDays} days</span><br></br> */}
//                           <span>{item.dateRange} ({item.totalDays} days)</span><br></br>

//                         </div>
//                       </div>
//                   )
//                 }
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       {/* Footer section */}
//       <MainFooter />
//     </div>
//             </MainLayout>
//   )
// }
// export default ThankyouPage;




import React, { useState } from 'react';
import './E3Thankyou_pg.css';
import { useNavigate, useLocation } from 'react-router-dom';
import LoginPageMain from './C1LoginMain';
import MainNavbar from './A1NAVBAR.jsx';
import MainFooter from './A1FOOTER.jsx';
import { MainLayout } from './MainLayout';
import { formatIndianCurrency } from './FORMATED_AMOUNT';

function ThankyouPage() {

  // Navbar js 
  const [isMenuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };
  //Nav_user toggle section
  const [isOpen, setIsOpen] = useState(false);

  const toggleNavOpen = () => {
    setIsOpen(!isOpen);
  };
  // NAVIGATE    //If i click the orders, signup or login then go the login page
  const navigate = useNavigate();
  const [isLoginOpen, setIsLoginOpen] = useState(false); // State to toggle Login 
  //Toggle LoginPage
  const toggleLoginPage = () => {
    setIsLoginOpen(!isLoginOpen);
  };
  const closeLoginPage = () => {
    setIsLoginOpen(false);
  }
  const thankItems = [
    { id: 1, thankImg: './images/spot1.png', thankTitle: "Adayar L B Road towards Thiruvanmiyur", thankAmount: 41580, thankDays: 5 },
    { id: 2, thankImg: './images/spot1.png', thankTitle: "Adayar L B Road towards Thiruvanmiyur", thankAmount: 10655, thankDays: 5 },
  ]
   // Define parseAmount function
    const parseAmount = (amount) => {
        if (amount === null || amount === undefined || amount === '') return 0;
        if (typeof amount === 'number') return amount;


        if (typeof amount === 'string') {
            // Remove any commas, currency symbols, and spaces
            const cleaned = amount.replace(/[₹$,¥€\s]/g, '').replace(/,/g, '');
            const parsed = parseFloat(cleaned);
            return isNaN(parsed) ? 0 : parsed;
        }
        // Try to convert to number
        const parsed = Number(amount);
        return isNaN(parsed) ? 0 : parsed;
    };

  const location = useLocation();
  const { billingInfo, cartItems, subTotal, TotalPrice, totalItems, orderId, overAllTotalAmount, gstPercentage, gstAmount, totalAmountWithGST } = location.state || {};
console.log("BILLING INFO1", billingInfo, cartItems, TotalPrice, totalItems, orderId, gstPercentage, gstAmount, totalAmountWithGST);
  // if (!billingInfo || !cartItems) {
  //   return <div>No order details found!</div>;
  // }

 // Function to calculate product base price if not already in cartItems
  const getProductBasePrice = (item) => {
    // If productBasePrice already exists in the item (sent from BillingDetailsCart)
    if (item.productBasePrice !== undefined && item.productBasePrice !== null) {
      return item.productBasePrice;
    }
    
    // Otherwise calculate it
    const cleanedTotalAmount = parseAmount(item.totalAmount);
    const printingCost = parseAmount(item.PrintingCost);
    const mountingCost = parseAmount(item.MountingCost);
    return cleanedTotalAmount + printingCost + mountingCost;
  };

  // Function to get formatted product base price
  const getFormattedProductBasePrice = (item) => {
    const productBasePrice = getProductBasePrice(item);
    return formatIndianCurrency(productBasePrice, true);
  };

  // Function to get individual components
  const getBookingAmount = (item) => {
    if (item.cleanedTotalAmount !== undefined) {
      return formatIndianCurrency(item.cleanedTotalAmount, true);
    }
    return formatIndianCurrency(parseAmount(item.totalAmount), true);
  };
    // Calculate display amounts
    const parsedTotalAmount = parseAmount( cartItems?.totalAmount || 0);
    const displayTotalAmount = formatIndianCurrency(parsedTotalAmount, true);


    const displayOverAllTotalAmount = formatIndianCurrency(overAllTotalAmount, true);
    const displayOverAllPrice = formatIndianCurrency(TotalPrice, true);
    const displaygstPercentage = formatIndianCurrency(gstPercentage, true);
    const displaygstAmount = formatIndianCurrency(gstAmount, true);
    const displaytotalAmountWithGST = formatIndianCurrency(totalAmountWithGST, true);
    console.log("GST % : ", displaygstPercentage, "GST Amt : ", displaygstAmount, "TotalAmtWithGST : ", displaytotalAmountWithGST);

    // Calculate total product base price (sum of all productBasePrice from cartItems)
    const calculateTotalProductBasePrice = () => {
      if (!cartItems || cartItems.length === 0) return 0;
      let total = 0;
      cartItems.forEach(item => {
        total += getProductBasePrice(item);
      });
      return total;
    };

    const totalProductBasePrice = calculateTotalProductBasePrice();
    const displayTotalProductBasePrice = formatIndianCurrency(totalProductBasePrice, true);

  return (
            <MainLayout>

    <div>
      <MainNavbar />

      {/* Thankyou page content  */}
      <div className='thankyou_pgMain1'>
        <div className='thankyou_contentMain1 container'>
          <div className='thank_left1'>
            <div className='thank-content11'> Thank You !</div>
            <div className='thank-content21' style={{ paddingBottom: '10px' }}>Your order has been confirmed, <span>{billingInfo?.name || 'Customer'}</span>.</div>
            {/* <div className='thank-content21'>We’ll reach out with further details soon.</div> */}
            <div className='thank-content21'>Our team will contact you shortly.</div>
            {/* <span className='thank-content2 site-address1'>Site Address</span> */}
          </div>
          <div className='thank_right1'>
            <div className='thank_right-content1'>
              <div className='thank_order-content1'>
                <div className='thank_orderDetails1 orderDetails11'>Order Number <br></br>
                  <span className='thank_orderDetailsCode1'> {orderId}</span>
                  </div>
                  <div className='ThankYouRightHeadingLine1'>
                                    </div>
                <div className='thank_orderDetails1 orderDetails21'>Date<br></br>
                  {new Date().toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                  })}</div>
                {/* <div className='thank_orderDetails1 orderDetails31'>Total Amount (Incl.GST)</div>
                <div className='thank_orderDetailsCode1 orderAmount1'>{displaytotalAmountWithGST}</div> */}
              </div>
              <div className="ThankScrollContent1">
                {
                  cartItems?.map(
                    (item, index) =>
                      <div className='thank_item-content1' key={index}>
                        <div className='thank_item-contentDetails11'>
                          <img src={item.image} className='thank_item-img1' alt={item.prodName}></img>
                        </div>
                        <div className='thank_item-contentDetails21' >
                          <span className='thank-item-heading1'>{item.prodName}</span><br></br>
                          {/* <span>₹ {item.subTotal}</span><br></br> */} 
                          <span>{getFormattedProductBasePrice(item)}</span><br></br>

                          {/* <span>{item.totalDays} days</span><br></br> */}
                          <span>{item.dateRange} ({item.totalDays} days)</span><br></br>

                        </div>
                      </div>
                  )
                }
              </div>
              {/* Order Summary Section - Below Product Scroll Area */}
              <div className='thank_order-summary1'>
                <div className='summary-row'>
                  <span className='summary-label'>Base Price (Excl. GST)</span>
                  <span className='summary-value'>{displayTotalProductBasePrice}</span>
                </div>
                <div className='summary-row'>
                  <span className='summary-label'>GST @ {gstPercentage || 18}%</span>
                  <span className='summary-value'>{displaygstAmount}</span>
                </div>
                <div className='summary-row total-row'>
                  <span className='summary-label'><strong>Total Amount (Incl. GST)</strong></span>
                  <span className='summary-value'>{displaytotalAmountWithGST}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Footer section */}
      <MainFooter />
    </div>
            </MainLayout>
  )
}
export default ThankyouPage;