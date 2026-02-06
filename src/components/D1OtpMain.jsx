//CORRECTLY HANDLE THE BOTH LOGGED IN AND LOGOUT USER ADMIN MAIL 
import React, { useState, useEffect, useCallback, useRef } from 'react';
import './d1Otp.css';
import { useNavigate } from 'react-router-dom';
import { baseUrl } from '../Adminpanel/BASE_URL';
import { toast } from 'react-toastify';

function OtpMain({ closeOtpMainPage, productData, user, skipPhoneVerification = false, enquiryContext = null }) {
    const navigate = useNavigate();
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [verified, setVerified] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [resendTimer, setResendTimer] = useState(30);
    const [status, setStatus] = useState('');
    const [otpError, setOtpError] = useState(false);
    const [enterOtp, setEnterOtp] = useState(new Array(6).fill(""));
    const [isVerifying, setIsVerifying] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [hasSentEnquiry, setHasSentEnquiry] = useState(false);
    const [isProcessingEnquiry, setIsProcessingEnquiry] = useState(false);
    const isOtpComplete = enterOtp.every(digit => digit !== "");

    // Use refs to track state without triggering re-renders
    const enquirySentRef = useRef(false);
    const verificationInProgressRef = useRef(false);

    // Initialize phone from user if available
    useEffect(() => {
        if (user && user.userPhone) {
            console.log('User object in OtpMain:', user);
            console.log('User phone from user object:', user.userPhone);

            // Extract phone number - handle different formats
            let userPhone = user.userPhone;

            // Remove any non-numeric characters except +
            userPhone = userPhone.replace(/\s/g, '');

            // If it starts with +91, keep it as is
            if (userPhone.startsWith('+91')) {
                // Remove +91 for display in input
                const displayPhone = userPhone.substring(3);
                setPhone(displayPhone);
                console.log('Formatted phone for display:', displayPhone);
            } else if (userPhone.startsWith('91') && userPhone.length === 12) {
                // If it's 91xxxxxxxxxx, remove 91 for display
                const displayPhone = userPhone.substring(2);
                setPhone(displayPhone);
                console.log('Formatted phone (starts with 91):', displayPhone);
            } else if (userPhone.length === 10) {
                // If it's already 10 digits
                setPhone(userPhone);
                console.log('Phone already 10 digits:', userPhone);
            } else {
                // Any other format, just set as is
                setPhone(userPhone);
                console.log('Phone in other format:', userPhone);
            }
        }
    }, [user]);

    // Handle logged-in user enquiry without OTP
    const sendEnquiryWithoutOtp = useCallback(async () => {
        // Check if enquiry has already been sent or is in progress
        if (!user || !productData || enquirySentRef.current || verificationInProgressRef.current) {
            console.log('Cannot send enquiry: missing data or already sent');
            return;
        }

        verificationInProgressRef.current = true;
        setIsProcessingEnquiry(true);

        try {
            // Format phone number properly
            let formattedPhone;
            if (user.userPhone) {
                let userPhone = user.userPhone.replace(/\s/g, '');

                if (userPhone.startsWith('+91')) {
                    formattedPhone = userPhone; // Already in correct format
                } else if (userPhone.startsWith('91') && userPhone.length === 12) {
                    formattedPhone = '+' + userPhone; // Add + to 91 format
                } else if (userPhone.length === 10) {
                    formattedPhone = '+91' + userPhone; // Add +91 to 10-digit
                } else {
                    formattedPhone = '+91' + userPhone; // Default: add +91
                }
            } else {
                console.error('No user phone available');
                toast.error("Phone number not available. Please update your profile.", {
                    position: "bottom-right",
                });
                verificationInProgressRef.current = false;
                setIsProcessingEnquiry(false);
                return;
            }

            // Prepare enquiry data
            const enquiryData = {
                phone: formattedPhone,
                productData: productData,
                userId: user._id,
                userName: user.userName || user.name || '',
                userEmail: user.email || user.userEmail || '',
                enquiryType: enquiryContext === 'booked_dates' ? 'booked_dates_enquiry' : 'normal_enquiry'
            };

            console.log('=========================================');
            console.log('SENDING ENQUIRY WITHOUT OTP (Logged-in User):');
            console.log('=========================================');
            console.log('User Status: LOGGED_IN_USER');
            console.log('Formatted Phone:', formattedPhone);
            console.log('User ID:', user._id);
            console.log('User Name:', user.userName || user.name);
            console.log('User Email:', user.email || user.userEmail);
            console.log('Product Data:', productData);
            console.log('Product Name:', productData.prodName || productData.name);
            console.log('Product Code:', productData.prodCode);
            console.log('Enquiry Type:', enquiryData.enquiryType);
            console.log('=========================================');

            const response = await fetch(`${baseUrl}/verify/save-enquiry-without-otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(enquiryData)
            });

            const data = await response.json();

            console.log('Backend Response:', data);
            console.log('Response Status:', response.status);

            if (response.ok && data.success) {
                // DUPLICATE USER ENTRY RESTRICT 

                // Handle duplicate enquiry (per day limit reached)
                if (data.duplicate) {
                    console.log('⚠️ Duplicate enquiry prevented for today');
                    toast.info(data.message || "You've already submitted an enquiry for this product today.", {
                        position: "bottom-right",
                        autoClose: 3000,
                    });

                    enquirySentRef.current = true;

                    // // Close the modal after showing message
                    // setTimeout(() => {
                    //     if (closeOtpMainPage) closeOtpMainPage();
                    // }, 3000);
                    return;
                }
                // DUPLICATE USER ENTRY RESTRICT 

                console.log('✅ Enquiry saved successfully');
                enquirySentRef.current = true;
                setHasSentEnquiry(true);

                toast.success("Thank you for your enquiry! We'll contact you soon.", {
                    position: "bottom-right",
                    autoClose: 3000,
                });

                // // Close the modal after successful submission
                // setTimeout(() => {
                //     if (closeOtpMainPage) closeOtpMainPage();
                // }, 3000);
            } else {
                console.error('❌ Failed to save enquiry:', data.message);
                toast.error(data.message || "Failed to save enquiry. Please try again.", {
                    position: "bottom-right",
                    autoClose: 5000,
                });
            }
        } catch (error) {
            console.error('❌ Error saving enquiry without OTP:', error);
            toast.error("Network error. Please try again.", {
                position: "bottom-right",
                autoClose: 5000,
            });
        } finally {
            verificationInProgressRef.current = false;
            setIsProcessingEnquiry(false);
        }
    }, [user, productData, enquiryContext, closeOtpMainPage]);

    // Effect to handle skipPhoneVerification for logged in users
    useEffect(() => {
        console.log('useEffect triggered:', {
            skipPhoneVerification,
            userExists: !!user,
            productDataExists: !!productData,
            verified,
            hasSentEnquiry,
            enquirySentRef: enquirySentRef.current
        });

        // Check if we should skip verification and send enquiry
        if (skipPhoneVerification && user && productData && !verified && !enquirySentRef.current) {
            console.log('🚀 Skipping phone verification for logged in user');
            console.log('User details:', {
                id: user._id,
                name: user.userName,
                phone: user.userPhone,
                email: user.email
            });

            // Mark as verified to prevent multiple calls
            setVerified(true);

            // Send enquiry without OTP process
            sendEnquiryWithoutOtp();
        }
    }, [skipPhoneVerification, user, productData, verified, sendEnquiryWithoutOtp]);

    // Function to send OTP
    const sendOtp = async () => {
        if (!phone.match(/^\d{10}$/)) {
            setErrorMessage("Enter a valid 10-digit phone number.");
            return;
        }

        setIsSending(true);
        setErrorMessage('');
        setStatus('Sending OTP...');

        try {
            const response = await fetch(`${baseUrl}/verify/send-otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    phone: `+91${phone}`,
                    // DUPLICATE USER ENTRY RESTRICT 
                    productCode: productData?.prodCode, // Required for duplicate check
                    // DUPLICATE USER ENTRY RESTRICT 
                    enquiryType: enquiryContext === 'booked_dates' ? 'booked_dates_enquiry' : 'normal_enquiry'
                })
            });

            const data = await response.json();

            if (!response.ok) {
                // Handle duplicate enquiry error
                if (data.duplicate) {
                    setErrorMessage(data.message || "Duplicate enquiry detected");
                    setStatus('');
                    setOtpSent(false); // Don't show OTP input

                    toast.info(data.message || "You have already submitted an enquiry for this product today.", {
                        position: "bottom-right",
                        autoClose: 5000,
                    });
                    return;
                }
                throw new Error(data.message || "Failed to send OTP");
            }

            if (data.success) {
                // For testing on localhost, show OTP in console
                if (data.testOtp) {
                    console.log('=========================================');
                    console.log('TEST OTP (Localhost only):', data.testOtp);
                    console.log('=========================================');
                }

                setErrorMessage('');
                startResendTimer();
                setStatus('');

                toast.success("OTP has been sent to your phone", {
                    position: "bottom-right",
                });

                setOtpSent(true);
            } else {
                setStatus('');
                setErrorMessage(data.message || "Failed to send OTP. Try again.");
                toast.error(data.message || "Failed to send OTP", {
                    position: "bottom-right",
                });
            }
        } catch (error) {
            console.error("Error:", error.message);
            setStatus('');
            setErrorMessage(error.message || "Error sending OTP. Try again later.");
            toast.error(error.message || "Error sending OTP", {
                position: "bottom-right",
            });
        } finally {
            setIsSending(false);
        }
    };

    // Function to verify OTP (for guest users)
    const verifyOtp = async () => {
        if (otp.length !== 6) {
            setErrorMessage("Enter a valid 6-digit OTP");
            return;
        }

        if (isVerifying) return;

        setIsVerifying(true);
        setErrorMessage('');

        try {
            // For guest users, we need to send user status and basic info
            const verificationData = {
                phone: `+91${phone}`,
                otp: otp,
                productData: productData,
                enquiryType: enquiryContext === 'booked_dates' ? 'booked_dates_enquiry' : 'normal_enquiry',
                userStatus: 'guest', // Explicitly mark as guest
                isGuest: true // Add flag for guest user
            };

            console.log('=========================================');
            console.log('VERIFYING OTP (Guest User):');
            console.log('=========================================');
            console.log('User Status: GUEST_USER');
            console.log('Phone:', `+91${phone}`);
            console.log('Product Name:', productData.prodName || productData.name);
            console.log('Product Code:', productData.prodCode);
            console.log('=========================================');

            const response = await fetch(`${baseUrl}/verify/verify-otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(verificationData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Verification failed");
            }

            if (data.success) {
                // DUPLICATE USER ENTRY RESTRICT 
                // Handle duplicate enquiry (per day limit reached)
                if (data.duplicate) {
                    console.log('⚠️ Duplicate enquiry prevented for today - Guest');
                    setErrorMessage(data.message || "Duplicate enquiry detected");
                    setOtpError(true);
                    toast.info(data.message || "You've already submitted an enquiry for this product today.", {
                        position: "bottom-right",
                        autoClose: 5000,
                    });
                    return;
                }
                // DUPLICATE USER ENTRY RESTRICT 
                throw new Error(data.message || "Verification failed");
            }

            if (data.success) {
                // DUPLICATE USER ENTRY RESTRICT 

                // DUPLICATE USER ENTRY RESTRICT 
                setVerified(true);
                setOtpError(false);
                setErrorMessage('');

                toast.success("OTP verified successfully!", {
                    position: "bottom-right",
                });
            } else {
                setOtpError(true);
                setErrorMessage(data.message || "Invalid OTP. Please try again.");
                toast.error(data.message || "Invalid OTP", {
                    position: "bottom-right",
                });
            }
        } catch (error) {
            console.error("Error:", error.message);
            setOtpError(true);
            setErrorMessage(error.message || "Verification failed. Try again.");
            toast.error(error.message || "Verification failed", {
                position: "bottom-right",
            });
        } finally {
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

        setEnterOtp(otpArray);
        setOtp(newOtp);
        setOtpError(false);

        // Auto focus next input
        if (e.target.value && e.target.nextSibling) {
            e.target.nextSibling.focus();
        }

        // Auto focus previous input on backspace
        if (!e.target.value && e.target.previousSibling) {
            e.target.previousSibling.focus();
        }
    }

    // Handle change number - reset all OTP related states
    const handleChangeNumber = () => {
        setOtpSent(false);
        setIsSending(false);
        setOtp('');
        setEnterOtp(new Array(6).fill(""));
        setErrorMessage('');
        setStatus('');
        setOtpError(false);
        setResendTimer(30);
    };

    return (
        <div className="container login-mainn1">
            <div className="login-upper1">
                <div className="close-button1" onClick={closeOtpMainPage}>
                    <i className="fa-regular fa-circle-xmark"></i>
                </div>
                <div className="login-message1">
                    {verified ? "Verified" : "Verification"}
                </div>
            </div>

            <div className='login-lower1'>
                {verified ? (
                    <div className="thank">
                        <center>
                            <div>
                                <img src='/images/Enquire_thankYou_TickImg.png' className='thankyou-img' alt="Thank You" />
                            </div>
                        </center>
                        <div className='thankyou-text'>Thank You</div>
                        <div className='getback-msg'>
                            We will get back <br /> to you <span className='getback-msg1'>SOON</span>
                        </div>

                        {/* Admin Contact Details */}
                        <div className='EnquireAdminDetails'>
                            <div className='EnquireAdminDetailsContents'>
                                <div className='EnquireContactImg'>
                                    <img src='/images/EnquireContactImg.png' alt="Contact" className='EnquireContactImg' />
                                </div>
                                <div>
                                    <a href='tel:+91 7373785057' className='EnquireContactImgContent' style={{ textDecoration: 'none', color: "#333333" }}>
                                        7373785057
                                    </a>
                                </div>
                            </div>

                            <div className='EnquireAdminDetailsCenterLine'>|</div>

                            <div className='EnquireAdminDetailsContents'>
                                <div className='EnquireEmailImg'>
                                    <img src='/images/EnquireEmailImg.png' alt="Email" className='EnquireEmailImg' />
                                </div>
                                <div>
                                    <a href='mailto:vinothkumar@adinn.co.in' className='EnquireContactImgContent' style={{ textDecoration: 'none', color: "#333333" }}>
                                        vinothkumar@adinn.co.in
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : !otpSent ? (
                    <>
                        <div>
                            <img src='/images/Verification_msg.jpg' className='verification_msg' alt="Verification" />
                        </div>
                        <div>
                            <input
                                type="tel"
                                placeholder="Enter your phone number"
                                maxLength="10"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value.replace(/\D/, ''))}
                                className={`input-phone ${errorMessage ? 'error' : ''}`}
                                disabled={isSending}
                            />
                        </div>
                        <div className='reach-msg'>
                            The planner will use this number to contact you
                        </div>
                        <br />
                        {/* {errorMessage && <div className="error-messageOTP">{errorMessage}</div>}
                        {status && <div className="status-messageOTP">{status}</div>} */}

                        <button
                            className="continue-btn1"
                            onClick={sendOtp}
                            disabled={isSending || phone.length !== 10}
                        >
                            {isSending ? "Sending OTP..." : "Continue"}
                        </button>
                    </>
                ) : (
                    <>
                        <div className='OTP_msg'>Enter the OTP sent to your phone</div>
                        <div className='OTP_msg1' onClick={handleChangeNumber}>
                            Change number
                        </div>
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
                                    disabled={isVerifying}
                                />
                            ))}
                        </div>
                        {/* {otpError && <div className="error-messageOTP">{errorMessage}</div>} */}
                        <br />

                        <span className='otpTimes'>
                            {resendTimer > 0 ? (
                                `Resend OTP in ${resendTimer}s`
                            ) : (
                                <span className='otpResends'>
                                    Didn't receive the OTP?{' '}
                                    <span className='ResendHighlight' onClick={sendOtp}>
                                        Resend OTP
                                    </span>
                                </span>
                            )}
                        </span>
                        <br />

                        <button
                            className="Submit-btn1"
                            onClick={verifyOtp}
                            disabled={!isOtpComplete || isVerifying}
                        >
                            {isVerifying ? 'Verifying...' : 'Submit OTP'}
                        </button>
                        <br />
                    </>
                )}
            </div>
        </div>
    );
}

export default OtpMain;