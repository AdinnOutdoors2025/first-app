// import React, { useState } from 'react';
// import './d1Otp.css'; // Assuming you have a CSS file for styling
// import { useNavigate } from 'react-router-dom';
// import LoginPageMain from './C1LoginMain';


// function Thankyou() {
//     // Navbar js 
//     const [isMenuOpen, setMenuOpen] = useState(false);
//     const toggleMenu = () => {
//         setMenuOpen(!isMenuOpen);
//     };
//      //Nav_user toggle section
//      const [isOpen, setIsOpen] = useState(false);

//      const toggleNavOpen = () => {
//          setIsOpen(!isOpen);
//      };
//        //Toggle LoginPage
//          const [isLoginOpen, setIsLoginOpen] = useState(false); // State to toggle Login 
       
//     const toggleLoginPage = () => {
//         setIsLoginOpen(!isLoginOpen);
//     };
//     const closeLoginPage = () => {
//         setIsLoginOpen(false);
//     };

//      //If i click the orders, signup or login then go the login page
//      const navigate = useNavigate();
 
//     //ON FOCUS input border
//     const [isFocus, setIsFocus] = useState(false);


//     return (
//         <div className='login-main'>
//               {/* Navbar section  */}
//     <div className="container navbar1">
//         <div className="nav-content11">
//           <img src="./images/adinn_logo.png" alt="Adinn Logo" />
//         </div>
//         <div className={`nav-content21 ${isMenuOpen ? "open" : "notOpen"}`}>
//           <img src="./images/home_icon.png" alt="Home Icon" className='home-icon' onClick={() => navigate("/")}/>
//           <a href="#ContactUsFooter">
//                        <button className="contact-btn">Contact us</button>
//                        </a> 
//           <button className="book-btn" onClick={() => navigate("/book")}>
//             <span className='book-btn-text'>Book a site</span>
//             <img src="./images/BookBtn_logo.png" alt="Image" className="book-btn-image" width="45" height="25" />
//           </button>          <i className="fa-solid fa-cart-shopping cart" onClick={() => navigate("/cart")} ></i>
//           <p className='cart-number'>2</p>
//           <div className="nav_container">
//             <img src="./images/nav_user.png" alt="User Icon" className='nav_user' onClick={toggleNavOpen} />
//             <div className={`nav_user-content ${isOpen ? 'open' : ''}`} >
//               <span className='nav_user_name'>Hello Arjun</span>
//               <span className='nav_user_phone'>9856256725</span> <br></br>
//               <span className='nav_user_items' onClick={() => navigate("/order")}>Orders</span> <br></br>
//               <span className='nav_user_items' onClick={toggleLoginPage}>Sign Up</span> <br></br>
//               <span className='nav_user_items' onClick={toggleLoginPage}>Log In</span> <br></br>
//               <span className='nav_user_items'>Sign Out</span>
//             </div>
//           </div>        </div>
//         <div className="hamburger-menu" onClick={toggleMenu}>
//           {isMenuOpen ? (
//             <i className="fa-solid fa-xmark close-btn"></i> // Close Icon
//           ) : (
//             <i className="fa-solid fa-bars bar-btn"></i> // Hamburger Icon
//           )}
//         </div>
//       </div>
    

//             <div className="container login-mainn">

//                 <div className="login-upper">

//                     <div className="close-button">
//                         <i class="fa-regular fa-circle-xmark"></i>
//                     </div>
//                     <div className="login-message">Verify</div>

//                 </div>

//                 <div className='login-lower1'>
//                 <center>
//                    <div> <img src='./images/Thankyou.png' className='thankyou-img'></img> </div>

//                 </center>
//                    <div className='thankyou-text'>Thank You</div>
//                    <div className='getback-msg'>We will get back to you SOON</div>


//                 </div>
//             </div>

//             {/* Login Page open  */}
//                                     {
//                                         isLoginOpen && (
//                                             <div className="login-overlay">
            
//                                                 <LoginPageMain toggleLoginPage={toggleLoginPage} closeLoginPage={closeLoginPage} />
//                                             </div>
//                                         )
//                                     }

//         </div>
//     );
// }

// export default Thankyou;
