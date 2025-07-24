import React, { useState } from 'react';
import './d1Otp.css';
import { useNavigate } from 'react-router-dom';

//BASE URL OF http://localhost:3001 FILE IMPORT 
import { baseUrl } from '../Adminpanel/BASE_URL';

function OtpMain({ closeOtpMainPage, productData }) {
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

    // Function to send OTP
    const sendOtp = async () => {
        if (!phone.match(/^\d{10}$/)) {
            setErrorMessage("Enter a valid 10-digit phone number.");
            return;
        }
        try {
            setStatus('Sending...');
            const response = await fetch(`${baseUrl}/verify/send-otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ phone: `+91${phone}` })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to send OTP");
            }

            if (data.success) {
                setOtpSent(true);
                setErrorMessage('');
                startResendTimer();
                setStatus('OTP Sent!');
                alert("OTP Sent to your phone!");
            } else {
                setStatus('Failed');
                setErrorMessage(data.message || "Failed to send OTP. Try again.");
            }
        } catch (error) {
            console.error("Error:", error.message);
            setStatus('Failed');
            setErrorMessage(error.message || "Error sending OTP. Try again later.");
        }
    };

    // Function to verify OTP
    const verifyOtp = async () => {
        const finalOtp = enterOtp.join('');
        setOtp(finalOtp);

        if (finalOtp.length !== 6) {
            setErrorMessage("Enter a valid 6-digit OTP");
            return;
        } 
         
        try {
            const response = await fetch(`${baseUrl}/verify/verify-otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    phone: `+91${phone}`, 
                    otp: finalOtp,
                    productData : productData 
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
                // navigate("/book1");
                // closeOtpMainPage();
            } else {
                setOtpError(true);
                setErrorMessage("Enter a correct code...");
            }
        } catch (error) {
            console.error("Error:", error.message);
            setOtpError(true);
            setErrorMessage(error.message || "Verification failed. Try again.");
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
        setEnterOtp(otpArray);
        setOtp(otpArray.join(''));
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
                    </div>
                ) : !otpSent ? (
                    <>
                        <div>
                            <img src='/images/Verification_msg.jpg' className='verification_msg' alt="Verification" />
                        </div>
                        <div>
                            <input
                                type="text"
                                placeholder="Enter Your Phone Number"
                                maxLength="10"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value.replace(/\D/, ''))}
                                className={`input-phone`} />
                        </div>
                        <div className='reach-msg'>The planner will use this number to reach you</div><br></br>
                        {errorMessage && <div className="error-messageOTP">{errorMessage}</div>}

                        <button className="continue-btn1" onClick={sendOtp}>Continue</button>
                        <div className='OTPMain_sentStatus'>{status}</div>
                    </>
                ) : (
                    <>
                        <div className='OTP_msg'>Enter OTP sent</div>
                        <div className='OTP_msg1' onClick={() => setOtpSent(false)}>CHANGE NUMBER</div>
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
                                    Didn't receive OTP? <span className='ResendHighlight' onClick={sendOtp}>Resend OTP</span>
                                </span>
                            )}
                        </span> <br></br>

                        <button className="Submit-btn1" onClick={verifyOtp}>Submit OTP</button><br />
                    </>
                )}
            </div>
        </div>
    );
}

export default OtpMain;




//  // RUN 
// // cd backend -> node VerifyMain 
// // then run D1OtpMain.jsx