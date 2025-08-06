import React, { useState, useEffect } from 'react';
import './a1Hero.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLogin } from './LoginContext';
import LoginPageMain from './C1LoginMain';
//BASE URL OF http://localhost:3001 FILE IMPORT
import { baseUrl } from '../Adminpanel/BASE_URL';


function NavbarMain() {
    const [isMenuOpen, setMenuOpen] = useState(false);
    const toggleMenu = () => { setMenuOpen(!isMenuOpen); };
    //Nav_user toggle section
    const [isOpen, setIsOpen] = useState(false);
    const { openLogin, closeLogin, isLoginOpen, user, logoutUser, loginUser } = useLogin();
    const [cartCount, setCartCount] = useState(0);
    // Add a state to track screen size
    const [isMobile, setIsMobile] = useState(window.innerWidth < 480);


    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 480);
            // If we switch to mobile view, force the dropdown to stay open
            if (window.innerWidth <= 480) {
                setIsOpen(true);
            } else {
                setIsOpen(false);
            }
        };


        window.addEventListener('resize', handleResize);
        // Set initial state
        handleResize();


        return () => window.removeEventListener('resize', handleResize);
    }, []);




    const toggleNavOpen = () => {
        //setIsOpen(!isOpen);
        if (!isMobile) {
            setIsOpen(!isOpen);
        }
    };
    // Close dropdown when clicking anywhere outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isOpen && !event.target.closest('.nav_container')) {
                setIsOpen(false);
            }
        };


        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);






    //If i click the orders, signup or login then go the login page
    const navigate = useNavigate();
    const location = useLocation();
    const { totalItems } = location.state || {};
    // ITEMS ARRAY
    const [items, setItems] = useState([]);
    // Fetch cart count from database
    const fetchCartCount = async () => {
        try {
            if (!user || !user._id) {
                setCartCount(0);
                return;
            }
            const response = await fetch(`${baseUrl}/cart/user/${user._id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch cart count');
            }
            const data = await response.json();
            setCartCount(data.length);
        } catch (error) {
            console.error('Error fetching cart count:', error);
            setCartCount(0);
        }
    };


    useEffect(() => {
        fetchCartCount();
        // Set up interval to periodically check for cart updates
        const interval = setInterval(fetchCartCount, 30000); // Check every 5 seconds


        return () => clearInterval(interval);
    }, [user]);




    return (
        <div className="container navbar1">
            <div className="nav-content11">
                <img src="/images/adinn_logo.png" alt="Adinn Logo" onClick={() => navigate('/home')} />
            </div>
            <div className={`nav-content21 ${isMenuOpen ? "open" : "notOpen"}`}>
                <img src="/images/home_icon.png" alt="Home Icon" className='home-icon' onClick={() => navigate("/")} />
                <a href="#ContactUsFooter"
                    onClick={(e) => {
                        e.preventDefault();
                        document.getElementById('ContactUsFooter')?.scrollIntoView({ behavior: 'smooth' });
                    }} > <button className="contact-btn">Contact us</button>
                </a>
                <button className="book-btn" onClick={() => navigate("/book")}>
                    <span className='book-btn-text' >Book a site</span>
                    <img src="/images/BookBtn_logo.png" alt="Image" className="book-btn-image" width="45" height="25" />
                </button>
                <i className="fa-solid fa-cart-shopping cart"
                // onClick={() => navigate("/cart")}
                onClick={() => {
    if (user) {
      navigate("/cart");
    } else {
      openLogin('login', '/cart'); // Show login popup, redirect to cart after
    }
  }}




                ></i>
                {/* <p className='cart-number'>{items.length}</p> */}
                {cartCount > 0 && <p className='cart-number'>{cartCount}</p>}
                <div className="nav_container">
                    <img src="/images/nav_user.png" alt="User Icon" className='nav_user' onMouseEnter={toggleNavOpen}
                        onClick={toggleNavOpen} />
                    <div className={`nav_user-content ${isOpen || isMobile ? 'open' : ''}`} onMouseLeave={!isMobile ? toggleNavOpen : undefined}>
                        {
                            user ? (
                                //Afer Login Content
                                <>
                                    <span className='nav_user_name'>Hello {user.userName}</span> <br></br>
                                    <span className='nav_user_phone'>{user.userPhone}</span> <br></br>
                                    <span className='nav_user_items' onClick={() => navigate("/order")}>Orders</span> <br></br>
                                    <span className='nav_user_items' onClick={logoutUser}>Sign Out</span> <br></br>
                                    {/* <span className='nav_user_items'>Sign Out</span> */}
                                </>
                            ) :
                                (
                                    //Before Login Content
                                    <>
                                        <span className='nav_user_name'>Hello User</span> <br></br>
                                        <span className='nav_user_items' onClick={() => openLogin('signup')}>Sign Up</span> <br></br>
                                        <span className='nav_user_items' onClick={() => openLogin('login')}>Log In</span> <br></br>
                                    </>
                                )}
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
    )
}
export default NavbarMain;