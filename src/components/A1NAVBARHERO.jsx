import React, { useState, useEffect } from 'react';
import './A1NAVBARHERO.css';
import { useNavigate } from 'react-router-dom';
import { useLogin } from './LoginContext';
import { baseUrl } from '../Adminpanel/BASE_URL';

function MainNavbarHero() {
    const [isMenuOpen, setMenuOpen] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const { openLogin, user, logoutUser } = useLogin();
    const [isMobile, setIsMobile] = useState(window.innerWidth < 480);
    const navigate = useNavigate();

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 480);
            if (window.innerWidth <= 480) {
                setIsOpen(true);
            } else {
                setIsOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, []);


    //Newly added code
    
    // Add scroll event listener to close dropdown on scroll
    useEffect(() => {
        const handleScroll = () => {
            if (isOpen) {
                setIsOpen(false);
            }
            if (isMenuOpen && isMobile) {
                setMenuOpen(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [isOpen, isMenuOpen, isMobile]);

    const toggleMenu = () => {
        setMenuOpen(!isMenuOpen);
    };

    const toggleNavOpen = () => {
        if (!isMobile) {
            setIsOpen(!isOpen);
        }
    };









    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isOpen && !event.target.closest('.nav_containerHero')) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

        const [cartCount, setCartCount] = useState(0);
    
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

        <div className="container navbar1Hero">
            <div className="nav-content11Hero">
                <img src="/images/adinn_logo.png" alt="Adinn Logo" onClick={() => navigate('/home')} />
            </div>

            <div className={`nav-content21Hero ${isMenuOpen ? "open" : ""}`}>
                <img src="/images/home_icon.png" alt="Home Icon" className='home-iconHero' onClick={() => navigate("/")} />

                <a href="#ContactUsFooter" onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('ContactUsFooter')?.scrollIntoView({ behavior: 'smooth' });
                }}>
                    <button className="contact-btnHero">Contact us</button>
                </a>

                <button className="book-btnHero" onClick={() => navigate("/book")}>
                    <span className='book-btn-textHero'>Book a site</span>
                    <img src="/images/BookBtn_logo.png" alt="Book Button" className="book-btn-imageHero" width="45" height="25" />
                </button>

                <i className="fa-solid fa-cart-shopping cartHero"
                    // onClick={() => navigate("/cart")}
                    onClick={() => {
                        if (user) {
                            navigate("/cart");
                        } else {
                            openLogin('login', '/cart'); // Show login popup, redirect to cart after
                        }
                    }}></i>
                {cartCount > 0 && <p className='cart-numberHero'>{cartCount}</p>}

                <div className="nav_containerHero">
                    <img src="/images/nav_user.png" alt="User Icon" className='nav_userHero'
                        onMouseEnter={toggleNavOpen} onClick={toggleNavOpen} />
                    <div className={`nav_user-contentHero ${isOpen || isMobile ? 'open' : ''}`}
                        onMouseLeave={!isMobile ? toggleNavOpen : undefined}>
                        {user ? (
                            <>
                                <span className='nav_user_nameHero'>Hello {user.userName}</span> <br />
                                <span className='nav_user_phoneHero'>{user.userPhone}</span> <br />
                                <span className='nav_user_itemsHero' onClick={() => navigate("/order")}>Orders</span> <br />
                                <span className='nav_user_itemsHero' onClick={logoutUser}>Sign Out</span> <br />
                            </>
                        ) : (
                            <>
                                <span className='nav_user_nameHero'>Hello User</span> <br />
                                <span className='nav_user_itemsHero' onClick={() => openLogin('signup')}>Sign Up</span> <br />
                                <span className='nav_user_itemsHero' onClick={() => openLogin('login')}>Log In</span> <br />
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className="hamburger-menuHero" onClick={toggleMenu}>
                {isMenuOpen ? (
                    <i className="fa-solid fa-xmark close-btnHero"></i>
                ) : (
                    <i className="fa-solid fa-bars bar-btnHero"></i>
                )}
            </div>
        </div>
    );
}
export default MainNavbarHero;