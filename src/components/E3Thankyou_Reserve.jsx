import React, { useState } from 'react';
import './E3Thankyou_pg_reserve.css';
import { useNavigate, useLocation } from 'react-router-dom';
import LoginPageMain from './C1LoginMain';
import MainNavbar from './A1NAVBAR.jsx';
import MainFooter from './A1FOOTER.jsx';
import { MainLayout } from './MainLayout';
import { formatIndianCurrency } from './FORMATED_AMOUNT';


function ThankyouPageReserve() {

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
    const { billingInfo, reserveItem, orderId } = location.state || {};
    console.log("BILLING INFO", billingInfo);

    if (!billingInfo || !reserveItem) {
        return <div>No order details found!</div>;
    }

     // Calculate display amounts
    const parsedTotalAmount = parseAmount(reserveItem?.totalAmount || 0);
    const displayTotalAmount = formatIndianCurrency(parsedTotalAmount, true);

    return (
        <MainLayout>

            <div>
                <MainNavbar />

                {/* Thankyou page content  */}
                <div className='thankyou_pgMain'>
                    <div className='thankyou_contentMain container'>
                        <div className='thank_left'>
                            <div className='thank-content1'> Thank You !</div>
                            <div className='thank-content2' style={{ paddingBottom: '30px' }}>Your reservation has been successfully placed, <span>{billingInfo.name}</span>.</div>
                            <div className='thank-content2'>Our team will contact you shortly.</div>
                            {/* <span className='thank-content2 site-address'>Site Address</span> */}
                        </div>
                        <div className='thank_right'>
                            <div className='thank_right-content' >
                                <div className='thank_order-content' >
                                    <div className='thank_orderDetails orderDetails1'>Order Number<br></br>
                                        <span className='thank_orderDetailsCode'>{orderId} </span>
                                    </div> 
                                    <div  className='ThankYouRightHeadingLine'>
                                    </div>
                                    <div className='thank_orderDetails orderDetails2'>Date<br></br>
                                        {new Date().toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric"
                                        })}</div>
                                    {/* <div className='thank_orderDetails orderDetails3'>Payment Method Upi</div> */}
                                </div>
                                {/* {
                                thankItems.map(
                                    (item, index) => {
                                        return ( */}
                                <div className='thank_item-content'>
                                    <div className='thank_item-contentDetails1'>
                                        <img src={reserveItem.image} className='thank_item-img' alt={reserveItem.prodName} ></img>
                                    </div>
                                    <div className='thank_item-contentDetails2' >
                                        <span className='thank-item-heading'>{reserveItem.prodName}</span><br></br>
                                        {/* <span>₹ {reserveItem.totalAmount}</span><br></br> */}
                                        <span>{displayTotalAmount}</span><br />

                                        {/* <span>{reserveItem.totalDays} days</span><br></br> */}
                                        <span>{reserveItem.dateRange} ({reserveItem.totalDays} days)</span>
                                    </div>
                                </div>
                                {/* )
                                    }
                                )
                            } */}
                            </div>
                        </div>
                    </div>
                </div>
                <MainFooter />
            </div>
        </MainLayout>


    )
}
export default ThankyouPageReserve;

