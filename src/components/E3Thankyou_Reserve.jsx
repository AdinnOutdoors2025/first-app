import React, { useState } from 'react';
import './E3Thankyou_pg_reserve.css';
import { useNavigate, useLocation } from 'react-router-dom';
import LoginPageMain from './C1LoginMain';
import MainNavbar from './A1NAVBAR.jsx';
import MainFooter from './A1FOOTER.jsx';
//the mainLayout for login toggle then background gets blurred 
import { MainLayout } from './MainLayout';


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




    const location = useLocation();
    const { billingInfo, reserveItem, orderId } = location.state || {};

    if (!billingInfo || !reserveItem) {
        return <div>No order details found!</div>;
    }

    return (
                <MainLayout>

        <div>

            {/* Navbar section  */}
            {/* <div className="container navbar1">
                <div className="nav-content11">
                    <img src="./images/adinn_logo.png" alt="Adinn Logo" />
                </div>
                <div className={`nav-content21 ${isMenuOpen ? "open" : "notOpen"}`}>
                    <img src="./images/home_icon.png" alt="Home Icon" className='home-icon' onClick={() => navigate("/")} />
                    <a href="#ContactUsFooter">
                        <button className="contact-btn">Contact us</button>
                    </a>
                    <button className="book-btn" onClick={() => navigate("/book")}>
                        <span className='book-btn-text'>Book a site</span>
                        <img src="./images/BookBtn_logo.png" alt="Image" className="book-btn-image" width="45" height="25" />
                    </button>          <i className="fa-solid fa-cart-shopping cart" onClick={() => navigate("/cart")}></i>
                    <p className='cart-number'>2</p>
                    <div className="nav_container">
                        <img src="./images/nav_user.png" alt="User Icon" className='nav_user' onClick={toggleNavOpen} />
                        <div className={`nav_user-content ${isOpen ? 'open' : ''}`} >
                            <span className='nav_user_name'>Hello Arjun</span>
                            <span className='nav_user_phone'>9856256725</span> <br></br>
                            <span className='nav_user_items' onClick={() => navigate("/order")}>Orders</span> <br></br>
                            <span className='nav_user_items' onClick={toggleLoginPage}>Sign Up</span> <br></br>
                            <span className='nav_user_items' onClick={toggleLoginPage}>Log In</span> <br></br>
                            <span className='nav_user_items'>Sign Out</span>
                        </div>
                    </div>        </div>
                <div className="hamburger-menu" onClick={toggleMenu}>
                    {isMenuOpen ? (
                        <i className="fa-solid fa-xmark close-btn"></i> // Close Icon
                    ) : (
                        <i className="fa-solid fa-bars bar-btn"></i> // Hamburger Icon
                    )}
                </div>
            </div>
            {
                isLoginOpen && (
                    <div className="login-overlay">
                        <LoginPageMain toggleLoginPage={toggleLoginPage} closeLoginPage={closeLoginPage} />
                    </div>
                )
            } */}
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
                                <div className='thank_orderDetails orderDetails2'>Date<br></br>
                                    {new Date().toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric"
                                    })}</div>
                                <div className='thank_orderDetails orderDetails3'>Payment Method Upi</div>
                            </div>
                            {/* {
                                thankItems.map(
                                    (item, index) => {
                                        return ( */}
                            <div className='thank_item-content'>
                                <div className='thank_item-contentDetails1'>
                                    <img src={reserveItem.image} className='thank_item-img'></img>
                                </div>
                                <div className='thank_item-contentDetails2' >
                                    <span className='thank-item-heading'>{reserveItem.prodName}</span><br></br>
                                    <span>₹ {reserveItem.totalAmount}</span><br></br>
                                    <span>{reserveItem.totalDays} days</span><br></br>
                                    <span>{reserveItem.dateRange}</span>
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

