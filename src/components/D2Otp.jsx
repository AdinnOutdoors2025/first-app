// import React, { useState } from 'react';
// import './d1Otp.css'; // Assuming you have a CSS file for styling
// import { useNavigate } from 'react-router-dom';


// function OTPpage1() {

//     // Navbar js 
//     const [isMenuOpen, setMenuOpen] = useState(false);
//     const toggleMenu = () => {
//         setMenuOpen(!isMenuOpen);
//     };
//     //Nav_user toggle section
//     const [isOpen, setIsOpen] = useState(false);

//     const toggleNavOpen = () => {
//         setIsOpen(!isOpen);
//     };
//     //If i click the orders, signup or login then go the login page
//     const navigate = useNavigate();
    
//     //NAVIGATE TO NUMBER OR MAIL  ENTER PAGE 
//     //const navigate = useNavigate();

//     return (
//         <div className='login-main'>
//             {/* Navbar section  */}
//             <div className="container navbar1">
//                 <div className="nav-content11">
//                     <img src="./images/adinn_logo.png" alt="Adinn Logo" />
//                 </div>
//                 <div className={`nav-content21 ${isMenuOpen ? "open" : "notOpen"}`}>
//                     <img src="./images/home_icon.png" alt="Home Icon" className='home-icon' />
//                     <button className="contact-btn">Contact us</button>
//                     <button className="book-btn">
//                         <span className='book-btn-text'>Book a site</span>
//                         <img src="./images/BookBtn_logo.png" alt="Image" className="book-btn-image" width="45" height="25" />
//                     </button>          <i className="fa-solid fa-cart-shopping cart" ></i>
//                     <p className='cart-number'>2</p>
//                     <div className="nav_container">
//                         <img src="./images/nav_user.png" alt="User Icon" className='nav_user' onClick={toggleNavOpen} />
//                         <div className={`nav_user-content ${isOpen ? 'open' : ''}`} >
//                             <span className='nav_user_name'>Hello Arjun</span>
//                             <span className='nav_user_phone'>9856256725</span> <br></br>
//                             <span className='nav_user_items' onClick={() => navigate("/login")}>Orders</span> <br></br>
//                             <span className='nav_user_items' onClick={() => navigate("/login")}>Sign Up</span> <br></br>
//                             <span className='nav_user_items' onClick={() => navigate("/login")}>Log In</span> <br></br>
//                             <span className='nav_user_items'>Sign Out</span>
//                         </div>
//                     </div>                </div>
//                 <div className="hamburger-menu" onClick={toggleMenu}>
//                     {isMenuOpen ? (
//                         <i className="fa-solid fa-xmark close-btn"></i> // Close Icon
//                     ) : (
//                         <i className="fa-solid fa-bars bar-btn"></i> // Hamburger Icon
//                     )}
//                 </div>
//             </div>

//             <div className="container login-mainn">

//                 <div className="login-upper">

//                     <div className="close-button">
//                         <i class="fa-regular fa-circle-xmark"></i>
//                     </div>
//                     <div className="login-message">Verify</div>

//                 </div>

//                 <div className='login-lower1'>
//                     <div className='OTP_msg'>Enter OTP sent </div>
//                     <div className='OTP_msg1' onClick={() => navigate("/otp")}>CHANGE NUMBER or MAIL </div>
//                     <div>
//                         <img src='./images/OTP_check.png' className='OTP_check-img'></img>
//                     </div>
//                     <div className='OTP_line'>
//                     <div><input type="phone" maxLength={1}  className="Otp_entered"/></div>
//                     <div><input type="phone" maxLength={1}  className="Otp_entered"/></div>
//                     <div><input type="phone" maxLength={1}  className="Otp_entered"/></div>
//                     <div><input type="phone" maxLength={1}  className="Otp_entered"/></div>
//                     <div><input type="phone" maxLength={1}  className="Otp_entered"/></div>
//                     <div><input type="phone" maxLength={1}  className="Otp_entered"/></div>
//                     </div>
//                     <span className='Otp_resends'>Resend OTP in 60 s</span>
//                     <button className="continue-btn1" onClick={() => navigate("/otp2")}>Verify</button>


//                 </div>
//             </div>


//         </div>
//     );
// }

// export default OTPpage1;
