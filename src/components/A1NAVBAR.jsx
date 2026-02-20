import React, { useState, useEffect, useRef } from 'react';
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
    // const [activeAuth, setActiveAuth] = useState(null);
    const [activeAuth, setActiveAuth] = useState("signup");
    // const [isScrolled, setIsScrolled] = useState(false);
// const [dynamicPadding, setDynamicPadding] = useState(70);
const [scrollProgress, setScrollProgress] = useState(0);
const [moveDistance, setMoveDistance] = useState(150);
const [isMobile800, setIsMobile800] = useState(window.innerWidth <= 800);
// const liquidRef = useRef(null);
// const [activeIndex, setActiveIndex] = useState(0);
// const itemRefs = useRef([]);








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

    const toggleNavOpen = () => {
    setIsOpen(prev => !prev);
};

    // const toggleNavOpen = () => {
        //setIsOpen(!isOpen);
    //     if (!isMobile) {
    //         setIsOpen(!isOpen);
    //     }
    // };
    
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
        const interval = setInterval(fetchCartCount, 30000); // Check every 5 seconds
        return () => clearInterval(interval);
    }, [user]);

//     useEffect(() => {
//   const handleScroll = () => {
//     if (window.scrollY > 50) {
//       setIsScrolled(true);
//     } else {
//       setIsScrolled(false);
//     }
//   };

//   window.addEventListener("scroll", handleScroll);

//   return () => window.removeEventListener("scroll", handleScroll);
// }, []);
// useEffect(() => {
//   const handleScroll = () => {
//     const maxScroll = 200;
//     const progress = Math.min(window.scrollY / maxScroll, 1);
//     setScrollProgress(progress);
//   };

//   window.addEventListener("scroll", handleScroll);
//   return () => window.removeEventListener("scroll", handleScroll);
// }, []);
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
      setMoveDistance(400);
    } else if (width >= 1600) {
      setMoveDistance(340);
    }
    else if (width >= 1400) {
      setMoveDistance(280);
    }
    else if (width >= 1200) {
      setMoveDistance(180);
    }
     else if (width >= 1024) {
      setMoveDistance(150);
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
    return (
    //    <div className="container navbar1">
    // <div className={`container navbar1 ${isScrolled ? "navbar-scrolled" : ""}`}>
    <div
  className="container navbar1">

  {/* LEFT – LOGO */}
  <div className="nav-content11"  style={{
    transform: `translateX(${scrollProgress * moveDistance}px)`
  }}>
    <img
      src="/images/adinn_logo.png"
      alt="Adinn Logo"
      className="nav-logo"
      onClick={() => navigate("/")}
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


    <span className="nav-item" onClick={() => navigate("/")}>Home</span>

    <span className="nav-item" onClick={() => navigate("/billboard-advertising-in-india")}>
      All Media
    </span>

    {/* <span className="nav-item" onClick={() => navigate("/prime-spots")}>
      Prime Spots
    </span> */}
{/* PRIME SPOTS — SHOW ONLY DESKTOP */}
{!isMobile800 && (
  // <span
  //   className="nav-item"
  //   onClick={() => document
  //         .getElementById("primeSpotsSection")
  //         ?.scrollIntoView({ behavior: "smooth" })
  //     }
  // >
  //   Prime Spots
  // </span>
  <span 
  className="nav-item" 
  onClick={() => {
    const currentPath = window.location.pathname; // Use window.location instead
    
    if (currentPath === "/") {
      // Already on home page - scroll directly
      document.getElementById("primeSpotsSection")?.scrollIntoView({ 
        behavior: "smooth" 
      });
    } else {
      // Go to home page first
      navigate("/");
      
      // Then wait and scroll
      setTimeout(() => {
        document.getElementById("primeSpotsSection")?.scrollIntoView({ 
          behavior: "smooth" 
        });
      }, 1200);
    }
  }}
  style={{ cursor: 'pointer' }}
>
  Prime Spots
</span>
)}
{/* <span 
  className="nav-item" 
  onClick={() => {
    const currentPath = window.location.pathname; // Use window.location instead
    
    if (currentPath === "/") {
      // Already on home page - scroll directly
      document.getElementById("primeSpotsSection")?.scrollIntoView({ 
        behavior: "smooth" 
      });
    } else {
      // Go to home page first
      navigate("/");
      
      // Then wait and scroll
      setTimeout(() => {
        document.getElementById("primeSpotsSection")?.scrollIntoView({ 
          behavior: "smooth" 
        });
      }, 1200);
    }
  }}
  style={{ cursor: 'pointer' }}
>
  Prime Spots
</span> */}
{/* <span 
  className="nav-item" 
  onClick={() => {
    document.getElementById("primeSpotsSection")?.scrollIntoView({ 
      behavior: "smooth" 
    });
  }}
>
  Prime Spots
</span> */}
{/* <span
    ref={(el) => (itemRefs.current[0] = el)}
    className={`nav-item ${activeIndex === 0 ? "active" : ""}`}
    onClick={() => {
      setActiveIndex(0);
      navigate("/");
    }}
  >
    Home
  </span>

  <span
    ref={(el) => (itemRefs.current[1] = el)}
    className={`nav-item ${activeIndex === 1 ? "active" : ""}`}
    onClick={() => {
      setActiveIndex(1);
      navigate("/billboard-advertising-in-india");
    }}
  >
    All Media
  </span>

  {!isMobile800 && (
    <span
      ref={(el) => (itemRefs.current[2] = el)}
      className={`nav-item ${activeIndex === 2 ? "active" : ""}`}
      onClick={() => {
        setActiveIndex(2);
        document
          .getElementById("ContactUsFooter")
          ?.scrollIntoView({ behavior: "smooth" });
      }}
    >
      Prime Spots
    </span>
  )} */}
{/* 👇 NOW it works only inside center menu */}
{/* <Magnifier targetRef={liquidRef} /> */}
{/* </div> */}
    <button
      className="contact-btn"
      onClick={() =>
        document
          .getElementById("ContactUsFooter")
          ?.scrollIntoView({ behavior: "smooth" })
      }
    >
      Contact
    </button>   
    {/* {!isMobile800 && (
  <button
    className="contact-btn"
    onClick={() =>
      document
        .getElementById("ContactUsFooter")
        ?.scrollIntoView({ behavior: "smooth" })
    }
  >
    Contact
  </button>
)} */}
 
  </div>

  {/* RIGHT – USER + HAMBURGER */}
  <div className="nav-right"style={{
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
            <span className="nav_user_items" onClick={() => navigate("/order")}>
              Orders
            </span><br />
            <span className="nav_user_items" onClick={logoutUser}>
              Sign Out
            </span>
            
      
    {/* PRIME SPOTS — MOBILE ONLY */}
    {isMobile800 && (
      <>
        <br />
        {/* <span
          className="nav_user_items"
          onClick={() => {
            navigate("/primeSpotsSection");
            setIsOpen(false);
          }}
        >
          Prime Spots
        </span> */}
         <span
    className="nav_user_items"
   onClick={() => document
         .getElementById("primeSpotsSection")
          ?.scrollIntoView({ behavior: "smooth" })
      }
   >
    Prime Spots
  </span>
         {/* <span 
  className="nav_user_items" 
  onClick={() => {
    const currentPath = window.location.pathname; // Use window.location instead
    
    if (currentPath === "/") {
      // Already on home page - scroll directly
      document.getElementById("primeSpotsSection")?.scrollIntoView({ 
        behavior: "smooth" 
      });
    } else {
      // Go to home page first
      navigate("/");
      
      // Then wait and scroll
      setTimeout(() => {
        document.getElementById("primeSpotsSection")?.scrollIntoView({ 
          behavior: "smooth" 
        });
      }, 1200);
    }
  }}
  style={{ cursor: 'pointer' }}
>
  Prime Spots
</span> */}
      </>
    )}
          </>
        ) : (
          <>
            {/* <span className="nav_user_items" onClick={() => openLogin("signup")}>
              Sign Up
            </span><br />
            <span className="nav_user_items" onClick={() => openLogin("login")}>
              Log In
            </span> */}
         <span
  className={`nav_user_items ${
    activeAuth === "signup" ? "nav_user_active" : ""
  }`}
  onClick={() => {
    setActiveAuth("signup");
    openLogin("signup");
  }}
>
  Sign Up
</span>
<br />

<span
  className={`nav_user_items ${
    activeAuth === "login" ? "nav_user_active" : ""
  }`}
  onClick={() => {
    setActiveAuth("login");
    openLogin("login");
  }}
>
  Log In
</span>

     
    {/* PRIME SPOTS — MOBILE ONLY */}
    {isMobile800 && (
      <>
        <br />
        {/* <span
          className="nav_user_items"
          onClick={() => {
            navigate("/prime-spots");
            setIsOpen(false);
          }}
        >
          Prime Spots
        </span> */}
         {/* <span 
  className="nav_user_items" 
  onClick={() => {
    const currentPath = window.location.pathname; // Use window.location instead
    
    if (currentPath === "/") {
      // Already on home page - scroll directly
      document.getElementById("primeSpotsSection")?.scrollIntoView({ 
        behavior: "smooth" 
      });
    } else {
      // Go to home page first
      navigate("/");
      
      // Then wait and scroll
      setTimeout(() => {
        document.getElementById("primeSpotsSection")?.scrollIntoView({ 
          behavior: "smooth" 
        });
      }, 1200);
    }
  }}
  style={{ cursor: 'pointer' }}
>
  Prime Spots
</span> */}
<span 
  className="nav_user_items" 
  onClick={() => {
    if (location.pathname === "/") {
      // Already on home page - scroll directly
      document.getElementById("primeSpotsSection")?.scrollIntoView({ 
        behavior: "smooth" 
      });
    } else {
      // Navigate to home page with state
      navigate("/", { state: { fromNavbar: "primeSpots" } });
    }
  }}
  style={{ cursor: 'pointer' }}
>
  Prime Spots
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