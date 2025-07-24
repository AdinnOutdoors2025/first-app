import React, { useState } from 'react';
import './a1Hero.css';
import { useNavigate } from 'react-router-dom';
import LoginPageMain from './C1LoginMain';
import MainNavbar from './A1NAVBAR.jsx';
// import MainFooter from './A1FOOTER.jsx';
import { MainLayout } from './MainLayout';


function HeroSection1() {
    const [isMenuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!isMenuOpen);
    };
    //Nav_user toggle section
    const [isOpen, setIsOpen] = useState(false);

    const toggleNavOpen = () => {
        setIsOpen(!isOpen);
    };
    const [isLoginOpen, setIsLoginOpen] = useState(false); // State to toggle Login 
    //Toggle LoginPage
    const toggleLoginPage = () => {
        setIsLoginOpen(!isLoginOpen);
    };
    const closeLoginPage = () => {
        setIsLoginOpen(false);
    };



    //If i click the orders, signup or login then go the login page
    const navigate = useNavigate();

    return ( 
<MainLayout>
        <div className="navbar-main1">
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
                            <span className='book-btn-text' >Book a site</span>
                            <img src="./images/BookBtn_logo.png" alt="Image" className="book-btn-image" width="45" height="25" />
                        </button>

                        <i className="fa-solid fa-cart-shopping cart" onClick={() => navigate("/cart")} ></i>
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
                        </div>
                    </div>
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
                        }  */}
            <MainNavbar />
            <div className="laptop-main">
                <img src="./images/img1.png" className="lap-main img1" alt="Image 1" />
                <img src="./images/img2.png" className="lap-main img2" alt="Image 2" />
                <img src="./images/img3.png" className="lap-main img3" alt="Image 3" />
                <img src="./images/img4.png" className="lap-main img4" alt="Image 4" />
                <center>
                    <img src="./images/laptop.png" className="laptop-img1" alt="Laptop" />
                </center>
            </div>
            {/* <MainFooter /> */}
        </div>
        </MainLayout>
    );
}

export default HeroSection1;

