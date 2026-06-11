import React, { useState, useEffect, useRef } from 'react';
import './a1Hero.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLogin } from './LoginContext';
import LoginPageMain from './C1LoginMain';
import { baseUrl } from '../Adminpanel/BASE_URL';


function NavbarMain() {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => { setMenuOpen(!isMenuOpen); };
  //Nav_user toggle section
  const [isOpen, setIsOpen] = useState(false);
  const { openLogin, closeLogin, isLoginOpen, user, logoutUser, loginUser } = useLogin();
  const [cartCount, setCartCount] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 480);
  // const [activeAuth, setActiveAuth] = useState(null);
  const [activeAuth, setActiveAuth] = useState("signup");
  // const [isScrolled, setIsScrolled] = useState(false);
  // const [dynamicPadding, setDynamicPadding] = useState(70);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [moveDistance, setMoveDistance] = useState(150);
  const [isMobile800, setIsMobile800] = useState(window.innerWidth <= 767);
  // const liquidRef = useRef(null);
  // const [activeIndex, setActiveIndex] = useState(0);
  // const itemRefs = useRef([]);
  const [isPrimeSpotsActive, setIsPrimeSpotsActive] = useState(false);
  const primeSpotsRef = useRef(null);
  const [activeNavItem, setActiveNavItem] = useState(''); // 'primeSpots', etc.
  const [activeUserItem, setActiveUserItem] = useState(''); // 'orders', 'signout', etc.

  // Get current path for active tab highlighting
  const location = useLocation();
  const currentPath = location.pathname;

  // Function to check if a tab is active
  const isActiveTab = (path) => {
    if (path === '/') {
      return currentPath === '/';
    }
    return currentPath.startsWith(path);
  };

  // Check if we're on the orders page to set active state
  useEffect(() => {
    if (currentPath === '/order') {
      setActiveUserItem('orders');
    } else {
      setActiveUserItem('');
    }
  }, [currentPath]);

  useEffect(() => {
    const checkPrimeSpotsInView = () => {
      // Only check if we're on the home page
      if (currentPath !== '/') {
        setIsPrimeSpotsActive(false);
        return;
      }

      const primeSpotsSection = document.getElementById("primeSpotsSection");
      if (primeSpotsSection) {
        const rect = primeSpotsSection.getBoundingClientRect();
        // Check if section is in viewport (with some threshold)
        const isInView = rect.top <= 200 && rect.bottom >= 200;
        setIsPrimeSpotsActive(isInView);
      }
    };
    setTimeout(checkPrimeSpotsInView, 500);
    window.addEventListener('scroll', checkPrimeSpotsInView);

    return () => {
      window.removeEventListener('scroll', checkPrimeSpotsInView);
    };
  }, [currentPath]);

  // Handle navigation state from navbar click
  useEffect(() => {
    if (location.state?.fromNavbar === "primeSpots") {
      setIsPrimeSpotsActive(true);
      // Clear the state to prevent issues on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Reset prime spots active when navigating away from home
  useEffect(() => {
    if (currentPath !== '/') {
      setIsPrimeSpotsActive(false);
    }
  }, [currentPath]);

  // Handle hash navigation
  useEffect(() => {
    if (window.location.hash === '#prime-spots') {
      const scrollToPrimeSpots = () => {
        const element = document.getElementById("primeSpotsSection");
        if (element) {
          element.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });
          setIsPrimeSpotsActive(true);
          // Clean up the hash after scrolling
          window.history.replaceState(null, null, ' ');
          return true;
        }
        return false;
      };

      // Try immediately
      if (scrollToPrimeSpots()) return;

      // If element not found, try again after delays
      setTimeout(scrollToPrimeSpots, 500);
      setTimeout(scrollToPrimeSpots, 1000);
      setTimeout(scrollToPrimeSpots, 1500);
    }
  }, []);


  // Also update the useEffect that watches isPrimeSpotsActive
  useEffect(() => {
    // Only set activeNavItem when prime spots becomes active, but not when it's from auth clicks
    if (isPrimeSpotsActive) {
      setActiveNavItem('primeSpots');
      setActiveAuth(''); // Clear auth active state
      setActiveUserItem(''); // Clear user item active state
    } else {
      // Only clear if it's not coming from auth clicks
      if (activeNavItem === 'primeSpots') {
        setActiveNavItem('');
      }
    }
  }, [isPrimeSpotsActive]);

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

  const toggleNavOpen = () => {
    setIsOpen(prev => !prev);
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
  // const location = useLocation();
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
    const interval = setInterval(fetchCartCount, 30000); // Check every 5 seconds
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerWidth < 992) {
        setScrollProgress(0); // disable effect
        return;
      }

      const maxScroll = 200;
      const progress = Math.min(window.scrollY / maxScroll, 1);

      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const updateMoveDistance = () => {
      const width = window.innerWidth;

      if (width >= 1900) {
        setMoveDistance(380); // Large desktop screens
      } else if (width >= 1600) {
        setMoveDistance(340);
      }
      else if (width >= 1400) {
        setMoveDistance(230);
      }
      else if (width >= 1200) {
        setMoveDistance(115); //my desktop screen 
      }
      else if (width == 1114) {
        setMoveDistance(130);
      }
      else if (width >= 1024) {
        setMoveDistance(230);
      } else {
        setMoveDistance(80); // tablet / small
      }
    };

    updateMoveDistance();
    window.addEventListener("resize", updateMoveDistance);

    return () => window.removeEventListener("resize", updateMoveDistance);
  }, []);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile800(window.innerWidth <= 800);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  // Add this function in your component
  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({
      behavior: "smooth"
    });
  };

  const handlePrimeSpotsClick = () => {
    const currentPath = window.location.pathname;

    if (currentPath === "/") {
      const element = document.getElementById("primeSpotsSection");
      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
        setActiveNavItem('primeSpots'); // Set active nav item
        setActiveAuth(''); // Clear auth active state
        setActiveUserItem(''); // Clear user item active state
      }
    } else {
      navigate("/#prime-spots");
      setActiveNavItem('primeSpots');
      setActiveAuth('');
      setActiveUserItem('');
    }

    if (isMenuOpen) {
      setMenuOpen(false);
    }
  };

  // Handle Orders click
  const handleOrdersClick = () => {
    navigate("/order");
    setIsOpen(false);
    handleMobileNavClick();
    setActiveUserItem('orders');
    setActiveNavItem(''); // Clear nav item active state
    setActiveAuth(''); // Clear auth active state
  };

  // Handle Sign Out click
  const handleSignOutClick = () => {
    logoutUser();
    setIsOpen(false);
    handleMobileNavClick();
    setActiveUserItem('');
  };

  // Close mobile menu after clicking on any nav item
  const handleMobileNavClick = () => {
    if (isMenuOpen) {
      setMenuOpen(false);
    }
  };

  return (
    //    <div className="container navbar1">
    // <div className={`container navbar1 ${isScrolled ? "navbar-scrolled" : ""}`}>
    <div
      className="container navbar1">

      {/* LEFT – LOGO */}
      <div className="nav-content11" style={{
        transform: `translateX(${scrollProgress * moveDistance}px)`
      }}>
        <img
          src="/images/adinn_logo.png"
          alt="Adinn Logo"
          className="nav-logo"
          onClick={() => {
            navigate("/");
            handleMobileNavClick();
          }}
        />
      </div>

      {/* CENTER – MENU ITEMS */}
      <div
        className={`nav-content21 ${isMenuOpen ? "open" : ""}`}>
        {/* <div className="menu-liquid-area" ref={liquidRef}> */}
        {/* <div
  className="liquid-indicator"
  style={{
    width: itemRefs.current[activeIndex]?.offsetWidth || 0,
    transform: `translateX(${
      itemRefs.current[activeIndex]?.offsetLeft || 0
    }px)`
  }}
/> */}


        <span
          className={`nav-item ${isActiveTab('/') && !isPrimeSpotsActive ? 'active' : ''}`}
          onClick={() => {
            navigate("/");
            handleMobileNavClick();
          }}
        >
          Home
        </span>

        <span
          className={`nav-item ${isActiveTab('/billboard-advertising-in-india') ? 'active' : ''}`}
          onClick={() => {
            navigate("/billboard-advertising-in-india");
            handleMobileNavClick();
          }}
        >
          All Media
        </span>

        {/* <span className="nav-item" onClick={() => navigate("/prime-spots")}>
      Prime Spots
    </span> */}
        {/* PRIME SPOTS — SHOW ONLY DESKTOP */}


        {!isMobile800 && (
          <span
            className={`nav-item ${isPrimeSpotsActive ? 'active' : ''}`}
            onClick={() => {
              handlePrimeSpotsClick();
              handleMobileNavClick();
            }}
            style={{ cursor: 'pointer' }}
          >
            Prime Spots
          </span>
        )}

        {/* <button
          className="contact-btn"
          onClick={() => {
            document
              .getElementById("ContactUsFooter")
              ?.scrollIntoView({ behavior: "smooth" });
            handleMobileNavClick();
          }}
        >
          Contact
        </button> */}


        {/* CONTACT BUTTON — DESKTOP ONLY */}
  {!isMobile800 && (
    <button
      className="contact-btn"
      onClick={() => {
        document
          .getElementById("ContactUsFooter")
          ?.scrollIntoView({ behavior: "smooth" });
        handleMobileNavClick();
      }}
    >
      Contact
    </button>
  )}


        {/* <div>
          <i className="fa-solid fa-cart-shopping cart"
            onClick={() => {
              if (user) {
                navigate("/cart");
              } else {
                openLogin('login', '/cart'); // Show login popup, redirect to cart after
              }
            }}></i>
          {cartCount > 0 && <p className='cart-number'>{cartCount}</p>}
        </div> */}
 {/* CART — SHOWN ON BOTH DESKTOP AND MOBILE */}
  <div>
    <i className="fa-solid fa-cart-shopping cart"
      onClick={() => {
        if (user) {
          navigate("/cart");
        } else {
          openLogin('login', '/cart');
        }
      }}>
    </i>
    {cartCount > 0 && <p className='cart-number'>{cartCount}</p>}
  </div>

        
      </div>
      {/* RIGHT – USER + HAMBURGER */}
      <div className="nav-right" style={{
        transform: `translateX(-${scrollProgress * moveDistance}px)`
      }}>
        <div className="nav_container">
          <div className="profile-menu-wrapper" onClick={toggleNavOpen}>
            <img
              src="/images/profilenavbar.svg"
              alt="User Icon"
              className="nav_user"
            />

            <div className="menu-toggle">
              <span className="menu-line top"></span>
              <span className="menu-line middle"></span>
              <span className="menu-line bottom"></span>
            </div>
          </div>

          <div
            // className={`nav_user-content ${isOpen || isMobile ? "open" : ""}`}
            className={`nav_user-content ${isOpen ? "open" : ""}`}
            onMouseLeave={!isMobile ? toggleNavOpen : undefined}
          >
            {user ? (
              <>
                <span className="nav_user_name">Hello {user.userName}</span><br />
                <span className="nav_user_phone">{user.userPhone}</span><br />
                <span
                  className={`nav_user_items ${activeUserItem === 'orders' ? 'nav_user_active' : ''}`}
                  onClick={handleOrdersClick}
                >
                  Orders
                </span><br />
                <span
                  className={`nav_user_items ${activeUserItem === 'signout' ? 'nav_user_active' : ''}`}
                  onClick={handleSignOutClick}
                >
                  Sign Out
                </span>


                {/* PRIME SPOTS — MOBILE ONLY */}
                {isMobile800 && (
                  <>
                    <br />

                    <span
                      className={`nav_user_items ${activeNavItem === 'primeSpots' ? 'nav_user_active' : ''}`}
                      onClick={() => {
                        handlePrimeSpotsClick();
                        setIsOpen(false);
                        handleMobileNavClick();
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                      Prime Spots
                    </span>
<br />
          <span
            className="nav_user_items contact-mobile"
            onClick={() => {
              document
                .getElementById("ContactUsFooter")
                ?.scrollIntoView({ behavior: "smooth" });
              setIsOpen(false);
              handleMobileNavClick();
            }}
            style={{ cursor: 'pointer' }}
          >
            Contact
          </span>
                  </>
                )}
              </>
            ) : (
              <>

                <span
                  className={`nav_user_items ${activeNavItem === 'primeSpots' ? '' : (activeAuth === "signup" ? "nav_user_active" : "")
                    }`}
                  onClick={() => {
                    setActiveAuth("signup");
                    setActiveNavItem(''); // Clear nav item active state
                    setActiveUserItem(''); // Clear user item active state
                    openLogin("signup");
                    setIsOpen(false);
                    handleMobileNavClick();
                  }}
                >
                  Sign Up
                </span>
                <br></br>
                <span
                  className={`nav_user_items ${activeNavItem === 'primeSpots' ? '' : (activeAuth === "login" ? "nav_user_active" : "")
                    }`}
                  onClick={() => {
                    setActiveAuth("login");
                    setActiveNavItem(''); // Clear nav item active state
                    setActiveUserItem(''); // Clear user item active state
                    openLogin("login");
                    setIsOpen(false);
                    handleMobileNavClick();
                  }}
                >
                  Log In
                </span>


                {/* PRIME SPOTS — MOBILE ONLY */}
                {isMobile800 && (
                  <>
                    <br />

                    <span
                      className={`nav_user_items ${activeNavItem === 'primeSpots' ? 'nav_user_active' : ''}`}
                      onClick={() => {
                        handlePrimeSpotsClick();
                        setIsOpen(false);
                        handleMobileNavClick();
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                      Prime Spots
                    </span> 

                     <br />
          <span
            className="nav_user_items contact-mobile"
            onClick={() => {
              document
                .getElementById("ContactUsFooter")
                ?.scrollIntoView({ behavior: "smooth" });
              setIsOpen(false);
              handleMobileNavClick();
            }}
            style={{ cursor: 'pointer' }} 
          >
            Contact
          </span>
                  </>
                )}

              </>
            )}
          </div>
        </div>

        {/* HAMBURGER */}
        <div className="hamburger-menu" onClick={toggleMenu}>
          {isMenuOpen ? (
            <i className="fa-solid fa-xmark close-btn"></i>
          ) : (
            <i className="fa-solid fa-bars bar-btn"></i>
          )}
        </div>
      </div>

    </div>

  )
}

export default NavbarMain;