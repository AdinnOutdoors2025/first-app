// import React, { useState } from 'react';
// import './d1Otp.css';
// import { useNavigate } from 'react-router-dom';
// //BASE URL OF http://localhost:3001 FILE IMPORT 
// import { baseUrl } from '../Adminpanel/BASE_URL';

// function OtpMain({ closeOtpMainPage, productData }) {
//     const navigate = useNavigate();
//     const [phone, setPhone] = useState('');
//     const [otp, setOtp] = useState('');
//     const [otpSent, setOtpSent] = useState(false);
//     const [verified, setVerified] = useState(false);
//     const [errorMessage, setErrorMessage] = useState('');
//     const [resendTimer, setResendTimer] = useState(30);
//     const [status, setStatus] = useState('');
//     const [otpError, setOtpError] = useState(false);
//     const [enterOtp, setEnterOtp] = useState(new Array(6).fill(""));
//     const [isVerifying, setIsVerifying] = useState(false);

//     // Function to send OTP
//     const sendOtp = async () => {
//         if (!phone.match(/^\d{10}$/)) {
//             setErrorMessage("Enter a valid 10-digit phone number.");
//             return;
//         }
//         try {
//             setStatus('Sending...');
//             const response = await fetch(`${baseUrl}/verify/send-otp`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({ phone: `+91${phone}` })
//             });

//             const data = await response.json();

//             if (!response.ok) {
//                 throw new Error(data.message || "Failed to send OTP");
//             }

//             if (data.success) {
//                 setOtpSent(true);
//                 setErrorMessage('');
//                 startResendTimer();
//                 setStatus('OTP Sent!');
//                 alert("OTP Sent to your phone!");
//             } else {
//                 setStatus('Failed');
//                 setErrorMessage(data.message || "Failed to send OTP. Try again.");
//             }
//         } catch (error) {
//             console.error("Error:", error.message);
//             setStatus('Failed');
//             setErrorMessage(error.message || "Error sending OTP. Try again later.");
//         }
//     };

//     // Function to verify OTP
//     const verifyOtp = async () => {
//         if (otp.length !== 6) {
//             setErrorMessage("Enter a valid 6-digit OTP");
//             return;
//         }
//         if (isVerifying) return; // Prevent multiple clicks
//         setIsVerifying(true);
//         try {
//             const response = await fetch(`${baseUrl}/verify/verify-otp`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                     phone: `+91${phone}`,
//                     // otp: finalOtp,
//                     otp: otp,
//                     productData: productData
//                 })
//             });

//             const data = await response.json();

//             if (!response.ok) {
//                 throw new Error(data.message || "Verification failed");
//             }

//             if (data.success) {
//                 setVerified(true);
//                 setOtpError(false);
//                 setErrorMessage('');
//                 alert("OTP Verified!");
//                 // navigate("/book1");
//                 // closeOtpMainPage();
//             } else {
//                 setOtpError(true);
//                 setErrorMessage("Enter a correct code...");
//             }
//         } catch (error) {
//             console.error("Error:", error.message);
//             setOtpError(true);
//             setErrorMessage(error.message || "Verification failed. Try again.");
//         }
//         finally {
//             setIsVerifying(false);
//         }
//     };

//     // Resend OTP with Timer
//     const startResendTimer = () => {
//         setResendTimer(30);
//         const interval = setInterval(() => {
//             setResendTimer(prev => {
//                 if (prev === 1) {
//                     clearInterval(interval);
//                     return 0;
//                 }
//                 return prev - 1;
//             });
//         }, 1000);
//     };

//     // Handle OTP Input Fields
//     function handleOtpChange(e, index) {
//         if (!/^\d*$/.test(e.target.value)) return;
//         let otpArray = [...enterOtp];
//         otpArray[index] = e.target.value;
//         const newOtp = otpArray.join('');
//         // Update both states simultaneously
//         setEnterOtp(otpArray);
//         setOtp(newOtp);
//         setOtpError(false);

//         if (e.target.value && e.target.nextSibling) {
//             e.target.nextSibling.focus();
//         }
//         if (!e.target.value && e.target.previousSibling) {
//             e.target.previousSibling.focus();
//         }
//     }

//     return (
//         <div className="container login-mainn1">
//             <div className="login-upper1">
//                 <div className="close-button1" onClick={closeOtpMainPage}>
//                     <i className="fa-regular fa-circle-xmark"></i>
//                 </div>
//                 <div className="login-message1">Verification</div>
//             </div>

//             <div className='login-lower1'>
//                 {verified ? (
//                     <div className="thank">
//                         <center>
//                             <div>
//                                 <img src='/images/Thankyou.png' className='thankyou-img' alt="Thank You" />
//                             </div>
//                         </center>
//                         <div className='thankyou-text'>Thank You</div>
//                         <div className='getback-msg'>We will get back to you SOON</div>
//                     </div>
//                 ) : !otpSent ? (
//                     <>
//                         <div>
//                             <img src='/images/Verification_msg.jpg' className='verification_msg' alt="Verification" />
//                         </div>
//                         <div>
//                             <input
//                                 type="text"
//                                 placeholder="Enter Your Phone Number"
//                                 maxLength="10"
//                                 value={phone}
//                                 onChange={(e) => setPhone(e.target.value.replace(/\D/, ''))}
//                                 className={`input-phone`} />
//                         </div>
//                         <div className='reach-msg'>The planner will use this number to reach you</div><br></br>
//                         {errorMessage && <div className="error-messageOTP">{errorMessage}</div>}

//                         <button className="continue-btn1" onClick={sendOtp}>Continue</button>
//                         <div className='OTPMain_sentStatus'>{status}</div>
//                     </>
//                 ) : (
//                     <>
//                         <div className='OTP_msg'>Enter OTP sent</div>
//                         <div className='OTP_msg1' onClick={() => setOtpSent(false)}>CHANGE NUMBER</div>
//                         <div>
//                             <img src='/images/OTP_check.png' className='OTP_check-img' alt="OTP" />
//                         </div>
//                         <div className='OTP_line'>
//                             {enterOtp.map((data, i) => (
//                                 <input
//                                     key={i}
//                                     type="text"
//                                     maxLength={1}
//                                     className={`Otp_entered ${otpError ? "otp-error" : ""}`}
//                                     value={data}
//                                     onChange={(e) => handleOtpChange(e, i)}
//                                     onKeyDown={(e) => {
//                                         if (e.key === "Backspace" && !enterOtp[i] && e.target.previousSibling) {
//                                             e.target.previousSibling.focus();
//                                         }
//                                     }}
//                                 />
//                             ))}
//                         </div>
//                         {otpError && <div className="error-messageOTP">Enter a correct code</div>}<br />

//                         <span className='otpTimes'>
//                             {resendTimer > 0 ? (
//                                 `Resend OTP in: ${resendTimer} sec`
//                             ) : (
//                                 <span className='otpResends'>
//                                     Didn't receive OTP? <span className='ResendHighlight' onClick={sendOtp}>Resend OTP</span>
//                                 </span>
//                             )}
//                         </span> <br></br>

//                         <button className="Submit-btn1" onClick={verifyOtp} disabled={isVerifying}>
//                             {isVerifying ? 'Verifying...' : 'Submit OTP'}
//                         </button><br />
//                     </>
//                 )}
//             </div>
//         </div>
//     );
// }

// export default OtpMain;



//ENQUIRE POP UP OPEN BASED ON THE LOGIN
import React, { useState, useEffect } from 'react';
import './d1Otp.css';
import { useNavigate } from 'react-router-dom';
import { baseUrl } from '../Adminpanel/BASE_URL';
import { toast } from 'react-toastify';

function OtpMain({ closeOtpMainPage, productData, user, skipPhoneVerification = false, enquiryContext = null }) {
    const navigate = useNavigate();
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [verified, setVerified] = useState(skipPhoneVerification && user ? true : false);
    const [errorMessage, setErrorMessage] = useState('');
    const [resendTimer, setResendTimer] = useState(30);
    const [status, setStatus] = useState('');
    const [otpError, setOtpError] = useState(false);
    const [enterOtp, setEnterOtp] = useState(new Array(6).fill(""));
    const [isVerifying, setIsVerifying] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const isOtpComplete = enterOtp.every(digit => digit !== "");



    // Effect to handle skipPhoneVerification for logged in users
    useEffect(() => {
        if (skipPhoneVerification && user && productData) {
            console.log('Skipping phone verification for logged in user');
            // Automatically set verified to true for logged in users
            setVerified(true);
            
            // Send enquiry to server without OTP process
            sendEnquiryWithoutOtp();
        }
    }, [skipPhoneVerification, user, productData]);

    // function to send enquiry without OTP for logged in users
    const sendEnquiryWithoutOtp = async () => {
        try {
            const response = await fetch(`${baseUrl}/save-enquiry-without-otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    phone: user.phone || user.userPhone,
                    productData: productData,
                    userId: user._id,
                    userName: user.userName,
                    userEmail: user.email,
                    enquiryType: enquiryContext === 'booked_dates' ? 'booked_dates_enquiry' : 'normal_enquiry'
                })
            });

            const data = await response.json();
            
            if (response.ok && data.success) {
                console.log('Enquiry saved successfully for logged in user');
            } else {
                console.error('Failed to save enquiry:', data.message);
            }
        } catch (error) {
            console.error('Error saving enquiry without OTP:', error);
        }
    };

    // Function to send OTP
    const sendOtp = async () => {
        if (!phone.match(/^\d{10}$/)) {
            setErrorMessage("Enter a valid 10-digit phone number.");
            return;
        }
        try {
             setIsSending(true);
            // setStatus('Sending...');
            const response = await fetch(`${baseUrl}/verify/send-otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    phone: `+91${phone}`,
                    enquiryType: enquiryContext === 'booked_dates' ? 'booked_dates_enquiry' : 'normal_enquiry'
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to send OTP");
            }

            if (data.success) {
                
                setErrorMessage('');
                startResendTimer();
                // setStatus('OTP Sent!');
                // alert("OTP Sent to your phone!");
                   toast.success("OTP has been sent to your phone", {
                    position: "bottom-right",
                    });
                setTimeout(() => {
                setOtpSent(true);
                }, 3000); 

                
            } else {
                 setIsSending(false);
                setStatus('Failed');
                setErrorMessage(data.message || "Failed to send OTP. Try again.");
            }
        } catch (error) {
            console.error("Error:", error.message);
            setStatus('Failed');
             setIsSending(false);
            setErrorMessage(error.message || "Error sending OTP. Try again later.");
        }
    };

    // Function to verify OTP
    const verifyOtp = async () => {
        if (otp.length !== 6) {
            setErrorMessage("Enter a valid 6-digit OTP");
            return;
        }
        if (isVerifying) return; // Prevent multiple clicks
        setIsVerifying(true);
        try {
            const response = await fetch(`${baseUrl}/verify/verify-otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    phone: `+91${phone}`,
                    otp: otp,
                    productData: productData,
                    enquiryType: enquiryContext === 'booked_dates' ? 'booked_dates_enquiry' : 'normal_enquiry'
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Verification failed");
            }

            if (data.success) {
                setVerified(true);
                setOtpError(false);
                setErrorMessage('');
                alert("OTP Verified!");
            } else {
                setOtpError(true);
                setErrorMessage("Enter a correct code...");
            }
        } catch (error) {
            console.error("Error:", error.message);
            setOtpError(true);
            setErrorMessage(error.message || "Verification failed. Try again.");
        }
        finally {
            setIsVerifying(false);
        }
    };

    // Resend OTP with Timer
    const startResendTimer = () => {
        setResendTimer(30);
        const interval = setInterval(() => {
            setResendTimer(prev => {
                if (prev === 1) {
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    // Handle OTP Input Fields
    function handleOtpChange(e, index) {
        if (!/^\d*$/.test(e.target.value)) return;
        let otpArray = [...enterOtp];
        otpArray[index] = e.target.value;
        const newOtp = otpArray.join('');
        // Update both states simultaneously
        setEnterOtp(otpArray);
        setOtp(newOtp);
        setOtpError(false);

        if (e.target.value && e.target.nextSibling) {
            e.target.nextSibling.focus();
        }
        if (!e.target.value && e.target.previousSibling) {
            e.target.previousSibling.focus();
        }
    }

    return (
        <div className="container login-mainn1">
            <div className="login-upper1">
                <div className="close-button1" onClick={closeOtpMainPage}>
                    <i className="fa-regular fa-circle-xmark"></i>
                </div>
                <div className="login-message1">Verification</div>
            </div>

            <div className='login-lower1'>
                {verified ? (
                    <div className="thank">
                        <center>
                            <div>
                                <img src='/images/Thankyou.png' className='thankyou-img' alt="Thank You" />
                            </div>
                        </center>
                        <div className='thankyou-text'>Thank You</div>
                        <div className='getback-msg'>We will get back to you SOON</div>
                        
                        {/* Admin Contact Details */}
                        <div className="admin-details">
                            <div className="admin-details-title">For any queries, contact:</div>
                            <div className="admin-contact-item">
                                <i className="fa-solid fa-phone admin-icon"></i>
                                <span className="admin-contact-text">Phone: 9864642212</span>
                            </div>
                            <div className="admin-contact-item">
                                <i className="fa-solid fa-envelope admin-icon"></i>
                                <span className="admin-contact-text">Email: test@gmail.com</span>
                            </div>
                            <div className="admin-contact-item">
                                <i className="fa-solid fa-clock admin-icon"></i>
                                <span className="admin-contact-text">Working Hours: 9 AM - 6 PM</span>
                            </div>
                        </div>
                        
                        <div className="thankyou-close-btn-container">
                            <button 
                                className="thankyou-close-btn"
                                onClick={closeOtpMainPage}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                ) : !otpSent ? (
                    <>
                        <div>
                            <img src='/images/Verification_msg.jpg' className='verification_msg' alt="Verification" />
                        </div>
                        <div>
                            <input
                                type="text"
                                placeholder="Enter your phone number"
                                maxLength="10"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value.replace(/\D/, ''))}
                                className={`input-phone`} />
                        </div>
                        <div className='reach-msg'>The planner will use this number to contact you</div><br></br>
                        {errorMessage && <div className="error-messageOTP">{errorMessage}</div>}

                        <button className="continue-btn1" disabled={isSending} onClick={sendOtp}>{isSending ? "Sending..." : "Continue"}</button>
                        <div className='OTPMain_sentStatus'>{status}</div>
                    </>
                ) : (
                    <>
                        <div className='OTP_msg'>Enter the OTP sent to your phone</div>
                        <div className='OTP_msg1' onClick={() => setOtpSent(false)}>Change number</div>
                        <div>
                            <img src='/images/OTP_check.png' className='OTP_check-img' alt="OTP" />
                        </div>
                        <div className='OTP_line'>
                            {enterOtp.map((data, i) => (
                                <input
                                    key={i}
                                    type="text"
                                    maxLength={1}
                                    className={`Otp_entered ${otpError ? "otp-error" : ""}`}
                                    value={data}
                                    onChange={(e) => handleOtpChange(e, i)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Backspace" && !enterOtp[i] && e.target.previousSibling) {
                                            e.target.previousSibling.focus();
                                        }
                                    }}
                                />
                            ))}
                        </div>
                        {otpError && <div className="error-messageOTP">Enter a correct code</div>}<br />

                        <span className='otpTimes'>
                            {resendTimer > 0 ? (
                                `Resend OTP in: ${resendTimer} sec`
                            ) : (
                                <span className='otpResends'>
                                    Didn't receive the OTP? <span className='ResendHighlight' onClick={sendOtp}>Resend OTP</span>
                                </span>
                            )}
                        </span> <br></br>

                        <button className="Submit-btn1" onClick={verifyOtp} disabled={!isOtpComplete || isVerifying}>
                            {isVerifying ? 'Verifying...' : 'Submit OTP'}
                        </button><br />
                    </>
                )}
            </div>
        </div>
    );
}

export default OtpMain;