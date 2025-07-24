import React, { useEffect, useRef, useState } from 'react';
import './a0hero.css';
import HeroSection1 from '../components/a1Hero'
import AdinnHome from '../components/a1home'

import { useNavigate, useLocation } from 'react-router-dom';
import LoginPageMain from './C1LoginMain';
import { MainLayout } from './MainLayout';
import {useLogin} from './LoginContext';


function HeroSection() {
            const { openLogin, closeLogin,  } = useLogin();
    
    const mainRef = useRef(null);
    useEffect(() => {
        const handleMouseMove = (event) => {
            const main = mainRef.current;
            if (!main) return;

            const images = main.querySelectorAll(".main-img");
            const { left, top, width, height } = main.getBoundingClientRect();
            const mouseX = event.clientX - left; // Mouse X relative to .main
            const mouseY = event.clientY - top; // Mouse Y relative to .main

            // Normalize cursor movement relative to the center of `.main`
            const offsetX = (mouseX - width / 2) / 20;
            const offsetY = (mouseY - height / 2) / 20;

            images.forEach((img, index) => {
                const xMove = offsetX * (index + 1);
                const yMove = offsetY * (index + 1);

                img.style.transform = `translate(${xMove}px, ${yMove}px) scale(1)`; // Cursor move effect
            });
        };

        const main = mainRef.current;
        if (main) {
            main.addEventListener("mousemove", handleMouseMove);
        }

        return () => {
            if (main) main.removeEventListener("mousemove", handleMouseMove);
        };
    }, []);


    const [isMenuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!isMenuOpen);
    };
    //Nav_user toggle section
        const [isOpen, setIsOpen] = useState(false);
    
        const toggleNavOpen = () => {
            setIsOpen(!isOpen);
        };

        // const [isLoginOpen, setIsLoginOpen] = useState(false); // State to toggle Login 
  //Toggle LoginPage
//   const toggleLoginPage = () => {
//     setIsLoginOpen(!isLoginOpen);
//     };
//     const closeLoginPage = () => {
//         setIsLoginOpen(false);
//         };



    //If i click the orders, signup or login then go the login page
    const navigate = useNavigate();


    const location = useLocation();
    const { totalItems } = location.state || {};


    // ITEMS ARRAY 
    const [items, setItems] = useState([
        // { id: 1, image: './images/spot1.png', title: 'Adayar L B Road towards Thiruvanmiyur', price: 35000, dateRange: 'Feb 16 - Feb 20', sizeWidth: 20, sizeHeight: 40, dimension: 245, adType: "Hoarding" },
        // { id: 2, image: './images/spot1.png', title: 'Adayar L B Road towards Thiruvanmiyur', price: 12000, dateRange: 'Feb 16 - Feb 20', sizeWidth: 20, sizeHeight: 40, dimension: 245, adType: "Hoarding" },
        // { id: 3, image: './images/spot1.png', title: 'Adayar L B Road towards Thiruvanmiyur', price: 12000, dateRange: 'Feb 16 - Feb 20', sizeWidth: 20, sizeHeight: 40, dimension: 245, adType: "Hoarding" },
        // { id: 4, image: './images/spot1.png', title: 'Adayar L B Road towards Thiruvanmiyur', price: 12000, dateRange: 'Feb 16 - Feb 20', sizeWidth: 20, sizeHeight: 40, dimension: 245, adType: "Hoarding" },
    ]);

    useEffect(() => {
        // Retrieve cart items from localStorage
        const storedCartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
        setItems(storedCartItems);
    }, []);


    return (
        <MainLayout>
        
        <div>
            {/* NAVBAR  */}
            <div className='navbar-main'>
                <div className={`navbar ${isMenuOpen ? 'open' : ''} container-fluid`}>
                    <div className='nav-content1'>
                        <img src='./images/adinn_logo.png'></img>
                    </div>
                    <div className='nav-content2'>
                        <img src="./images/home_icon.png" alt="Home Icon" className='home-icon' onClick={() => navigate("/hero")}  />
                       <a href="#ContactUsFooter">
                       <button className="contact-btn">Contact us</button>
                       </a> 
                        <button className="book-btn" onClick={() => navigate("/book")}>
                            <span className='book-btn-text' >Book a site</span>
                            <img src="./images/BookBtn_logo.png" alt="Image" className="book-btn-image" width="45" height="25" />
                        </button>
                        <i className="fa-solid fa-cart-shopping cart1" onClick={() => navigate("/cart")} ></i>
                        <p className='cart-number1'>{items.length}</p>
                        <div className="nav_container">
                            <img src="./images/nav_user.png" alt="User Icon" className='nav_user' onClick={toggleNavOpen} />
                            <div className={`nav_user-content ${isOpen ? 'open' : ''}`} >
                                <span className='nav_user_name'>Hello Arjun</span>
                                <span className='nav_user_phone'>9856256725</span> <br></br>
                                <span className='nav_user_items' onClick={() => navigate("/order")}>Orders</span> <br></br>
                                <span className='nav_user_items' onClick={openLogin}>Sign Up</span> <br></br>
                                <span className='nav_user_items' onClick={openLogin}>Log In</span> <br></br>
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
                        {/* Login Page open  */}
                        {/* {
                            isLoginOpen && (
                                <div className="login-overlay">

                                    <LoginPageMain toggleLoginPage={toggleLoginPage} closeLoginPage={closeLoginPage} />
                                </div>
                            )
                        } */}

                <div className='main' ref={mainRef}>
                    <img src='./images/img1.png' className='main-img main-img1'></img>
                    <img src='./images/img2.png' className='main-img main-img2'></img>
                    <img src='./images/img3.png' className='main-img main-img3'></img>
                    <img src='./images/img4.png' className='main-img main-img4'></img>
                    <div className="main-text">
                        <p >One <span className="highlight">Stop</span> Shop for <br></br> all your <span className="highlight">Brand </span><br></br><span className="highlight">Promotion </span> Needs</p>
                        <button style={{
                            background: "rgba(228, 30, 37, 1)",
                            fontSize: '20px', color: '#fff', padding: '8px 15px', border: 'none', borderRadius: '23px', cursor: 'pointer',
                        }}  > Book a  site </button>
                        <center>
                            <img src='./images/laptop_half.png' className='main-text-img2'></img>
                        </center>
                    </div>
                </div>
            </div>


            {/* <HeroSection1 /> */}
            {/* <AdinnHome/> */}
        </div>
         </MainLayout>
    )
}

export default HeroSection;