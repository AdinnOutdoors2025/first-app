// import React, { useState } from 'react';
// import './c2login.css'; // Assuming you have a CSS file for styling
// import { useNavigate } from 'react-router-dom';

// function LoginPage1() {

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

//     //Navigate to OTP enter page on clicking the OTP box
//     // const navigate = useNavigate();


//     // Enter OTP to target next value 
//     const [enterOtp, setEnterOtp] = useState(new Array(4).fill(""));
//     function handleOtpChange(e, index) {
//         if (isNaN(e.target.value)) return false;
//         setEnterOtp(
//             [
//                 ...enterOtp.map(
//                     (data, indx) => (
//                         indx === index ? e.target.value : data
//                     )
//                 )
//             ]
//         );

//             // If a digit is entered, move to next input field

//         if (e.target.value && e.target.nextSibling) {
//             e.target.nextSibling.focus();
//         }


//     // If the user deletes a digit, move back to the previous input field
//     if (!e.target.value && e.target.previousSibling) {
//         e.target.previousSibling.focus();
//     }
//     }

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
//                     <div className="login-message">OTP</div>
//                 </div>

//                 <div className='login-lower'>
//                     <div className='verifyOtp'>
//                         VERIFY WITH OTP
//                     </div>
//                     <span className='verifySent'>Sent to 9463846483</span>
//                     <div className='otpBox'>
//                         {
//                             enterOtp.map(
//                                 (data, i) => {
//                                     return (
//                                         <input type="phone" maxLength={1} className="otpBox-content" value={data} onChange={(e) => handleOtpChange(e, i)}
//                                         onKeyDown={(e) => {
//                 if (e.key === "Backspace" && !enterOtp[i] && e.target.previousSibling) {
//                     e.target.previousSibling.focus();
//                 }
//             }}
                                        
//                                          />
//                                     )

//                                 }
//                             )
//                         }
//                     </div>
//                     <span className='otpTime'> Resend OTP in : 00:27 sec</span>
//                     <button type='submit' className="Submit-btn" onClick={() => navigate("/login2")}>Submit OTP</button>
               
//                 </div>
//             </div>


//         </div>
//     );
// }

// export default LoginPage1;
