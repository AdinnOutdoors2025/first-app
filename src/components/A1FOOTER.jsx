import React, { useState, useEffect } from 'react';
import './a4home.css';
import { baseUrl } from '../Adminpanel/BASE_URL';
import { toast } from 'react-toastify';
import billboardImg from "../assets/images/billboard.png";
import CaptchaModal from './CaptchaModal'; // Import the captcha component

function FooterMain() {
    const [contactInfo, setContactInfo] = useState('');
    const [isSubmit, setIsSubmit] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });
    const [isError, setIsError] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [currentYear, setCurrentYear] = useState('');
    const [showCaptcha, setShowCaptcha] = useState(false);
    const [pendingContactInfo, setPendingContactInfo] = useState('');

    useEffect(() => {
        setCurrentYear(new Date().getFullYear());
    }, []);

    // terms and conditions privacy policy popup
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState("");

    const openModal = (type) => {
        setModalType(type);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setModalType("");
    };

    const validateContactInfo = (input) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[0-9]{10}$/;
        const cleanedInput = input.replace(/\s/g, '');
        return emailRegex.test(input) || phoneRegex.test(cleanedInput);
    };

    // Function to submit the form after captcha verification
    const submitForm = async () => {
        try {
            const response = await fetch(`${baseUrl}/ContactInfo/footerContactInfo`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contactInfo: pendingContactInfo,
                })
            });

            const result = await response.json();
            
            // Handle duplicate error (409 Conflict)
            if (response.status === 409) {
                toast.warning(result.error || "This contact information has already been submitted.", {
                    position: "bottom-right",
                    autoClose: 3000,
                });
                return false;
            }

            if (!response.ok) {
                throw new Error("Failed to submit contact information");
            }

            if (result.success) {
                const isEmail = pendingContactInfo.includes('@');
                let successMessage = '';

                if (isEmail) {
                    if (result.userEmailSent) {
                        successMessage = "Thank you for contacting us! We've sent a confirmation email and will reach out to you soon.";
                    } else {
                        successMessage = "Thank you for contacting us! We'll reach out to you soon.";
                    }
                } else {
                    if (result.smsSent) {
                        successMessage = "Thank you for contacting us! We've notified our team and will call you soon.";
                    } else {
                        successMessage = "Thank you for your interest! We've received your phone number and will call you soon.";
                    }
                }

                toast.success(successMessage, {
                    position: "bottom-right",
                    autoClose: 3000,
                });

                setContactInfo('');
                return true;
            }
            
            return false;
        } catch (err) {
            toast.error(`Failed to submit your information. Please try again later.`, {
                position: "bottom-right",
                autoClose: 2000,
            });
            console.error("Error submitting contact information:", err);
            return false;
        }
    };

    // Handle captcha verification success
    const handleCaptchaVerify = async () => {
        await submitForm();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!contactInfo.trim()) {
            setMessage({
                text: 'Please enter your email or phone number',
                type: 'error'
            });
            return;
        }

        if (!validateContactInfo(contactInfo)) {
            setMessage({
                text: 'Please enter a valid email or 10-digit phone number',
                type: 'error'
            });
            return;
        }

        setIsSubmit(true);
        setMessage({ text: '', type: '' });

        // Store the contact info and show captcha
        setPendingContactInfo(contactInfo);
        setShowCaptcha(true);
        setIsSubmit(false);
    };

    return (
        <div>
            {/* Captcha Modal */}
            <CaptchaModal 
                isOpen={showCaptcha}
                onClose={() => {
                    setShowCaptcha(false);
                    setPendingContactInfo('');
                }}
                onVerify={handleCaptchaVerify}
            />

            {/* Footer section */}
            <div className='footer container-fluid' id="ContactUsFooter">
                {message.text && (
                    <div className={`contact-message ${message.type}`}>
                        {message.text}
                    </div>
                )}

                <div className='footer-contact'>
                    <form onSubmit={handleSubmit}>
                        {/* ALLOW TO TYPE BOTH PHONE AND EMAIL  */}
                        <div>   <input
                            type="text"
                            name="name"
                            className='f-input'
                            placeholder="Enter E-mail or Phone Number"
                            value={contactInfo}
                            onChange={(e) => setContactInfo(e.target.value)}
                            disabled={isSubmit}
                        /> </div>
                        {/* ALLOW ONLY PHONE NUMBER  */}
                        {/* <input
                            placeholder="Enter Your Phone Number"
                            className='f-input'
                            type="tel"
                            value={contactInfo}
                            maxLength='10'
                            onChange={(e) => {
                                let value = e.target.value.replace(/\D/g, "");
                                if (value.length <= 10) {
                                    setContactInfo(value);
                                }
                            }}
                            disabled={isSubmit}/> */}


                        <div>    <button className='f-btn' type="submit" disabled={isSubmit}>
                            {/* {isSubmit ? 'Sending...' : 'Contact me'} */}
                            <img
                                src="/images/footer-contacticon.svg"
                                alt="Send"
                                className="f-btn-arrow"
                            />                        </button> </div>
                        {/* <button className='f-btn' type="submit" disabled={isSubmit}>
                            {isSubmit ? 'Sending...' : 'Contact me'} 
                        </button> */}
                        {/* <button className="f-btn" type="submit" disabled={isSubmit}>
  {isSubmit ? (
    'Sending...'
  ) : (
    <img
      src="/images/footer-contacticon.svg"   
      alt="Send"
      className="btn-arrow"
    />
  )}
</button> */}
                    </form>
                </div>

                <div className='f-info container'>
                    <div className='f-infoContent'>
                        <img src='/images/adinn_logo.png' className='f-adinnLogo' alt="Adinn Logo" />
                        <div className='f-content'>
                            <div className='f-c1'> 
                                <img src='/images/f11-phone.svg' className='f1' alt="Phone" />
                            </div>
                            <div className='f-c2'>
                                <div>
                                    <a href='tel:7373785048' style={{ textDecoration: 'none', color: "#121927" }}> 
                                        +91 73737 85048
                                    </a>
                                </div>
                                <div>
                                    <a href='tel:9787885055' style={{ textDecoration: 'none', color: "#121927" }}> 
                                        +91 97878 85055
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className='f-content1'>
                            <img src='/images/f2-mail.svg' className='f2' alt="Mail" />
                            <span className='mail'>
                                <a href='mailto:outdoorsales@adinn.co.in' style={{ textDecoration: 'none', color: "#121927" }}> 
                                    outdoorsales@adinn.co.in 
                                </a>
                            </span>
                        </div>
                        <div className='f-content2'>
                            <div className='f-c3'>
                                <a href="https://www.linkedin.com/showcase/adinn-outdoors/" target="_blank" rel="noopener noreferrer">
                                    <img src='/images/f3-linkedin.svg' className='f3' alt="LinkedIn" />
                                </a>
                            </div>
                            <div className='f-c3'>
                                <a href="https://www.facebook.com/adinnoutdoors/" target="_blank" rel="noopener noreferrer">
                                    <img src='/images/f4-fb.svg' className='f4' alt="Facebook" />
                                </a>
                            </div>
                            <div className='f-c3'>
                                <a href="https://www.youtube.com/@AdinnChannel" target="_blank" rel="noopener noreferrer">
                                    <img src='/images/f5-youtube.svg' className='f5' alt="YouTube" />
                                </a>
                            </div>
                            <div className='f-c3'>
                                <a href="https://www.instagram.com/adinnoutdoor/" target="_blank" rel="noopener noreferrer">
                                    <img src='/images/f6-insta.svg' className='f6' alt="Instagram" />
                                </a>
                            </div>
                        </div>
                    </div>
                    <img src='/images/footer_image1.svg' className='f-buildMain' alt="Building" />
                    {/* right side footer content */}
                    <div className='f-infoContent1'>
                        <div className='f-content3'>
                            <div>
                                <img src='/images/BuildingApartment1.svg' className='f7' alt="Head Office Building" />
                            </div>
                            <div className='f-c4'>
                                <h1 className='footer-heading'>Head office</h1>
                                <p className='footer-para'>
                                    29, 1st Cross street, Vanamamalai nagar, Bypass road, Madurai-625016, Tamil Nadu.
                                </p>
                            </div>
                        </div>
                        <div className='f-content4'>
                            <div>
                                <img src='/images/BuildingOffice1.svg' className='f8' alt="Branch Office Building" />
                            </div>
                            <div className='f-c4'>
                                <h1 className='footer-heading'>Branch office</h1>
                                <p className='footer-para'>
                                    No 3, 1st Floor, Vijayalakshmi Street, Nungambakkam, Chennai - 600 034 , Tamil Nadu.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container-fluid" style={{ padding: '0' }}>
                    <div className="copy">
                        <div className="copy1"></div>
                        <div className="copy11">&copy; {currentYear} Adinn Outdoors. All rights reserved.</div>
                        <div className="copy2"></div>
                        <div className="copy22" onClick={() => openModal("terms")}>Terms & Conditions</div>
                        <div className="copy3"></div>
                        <div className="copy33" onClick={() => openModal("privacy")}>Privacy & Policy</div>
                        <div className="copy4"></div>
                    </div>
                </div>
            </div>

            {/* Terms and Conditions Privacy Policy Popup */}
            {
                showModal && (
                    <>
                        <div className="billboard-overlay" onClick={closeModal}></div>

                        {/* Billboard modal - Removed overlay effect */}
                        <div className="billboard-modal" style={{ backgroundImage: `url(${billboardImg})` }}>
                            <span className="billboard-close" onClick={closeModal}>×</span>

                            <div className="billboard-content">
                                <h1 className="billboard-heading">
                                    {modalType === "terms" ? "Terms and Conditions" : "Privacy Policy"}
                                </h1>

                                <ul className="billboard-text">
                                    {modalType === "terms" ? (
                                        <>
                                            <li className="billboard-section-heading"> Conditions of use</li>
                                            <li>By using this website, you certify that you have read and reviewed this Agreement and that you agree to comply with its terms. If you do not want to be bound by the terms of this Agreement, you are advised to stop using the website accordingly. Adinn Outdoors only grants use and access of this website, its products, and its services to those who have accepted its terms.</li>
                                            <li className="billboard-section-heading"> Privacy policy</li>
                                            <li>Before you continue using our website, we advise you to read our  <b>privacy policy</b> regarding our user data collection. It will help you better understand our practices.</li>
                                            <li className="billboard-section-heading"> Age restriction</li>
                                            <li>You must be at least 18 (eighteen) years of age before you can use this website. By using this website, you warrant that you are at least 18 years of age and you may legally adhere to this Agreement. Adinn Outdoors assumes no responsibility for liabilities related to age misrepresentation.</li>
                                            <li className="billboard-section-heading"> Intellectual property</li>
                                            <li>You agree that all materials, products, and services provided on this website are the property of <b>Adinn Outdoors</b>, its affiliates, directors, officers, employees, agents, suppliers, or licensors including all copyrights, trade secrets, trademarks, patents, and other intellectual property. You also agree that you will not reproduce or redistribute the <b>Adinn Outdoors</b> intellectual property in any way, including electronic, digital, or new trademark registrations.You grant Adinn Outdoors a royalty-free and non-exclusive license to display, use, copy, transmit, and broadcast the content you upload and publish. For issues regarding intellectual property claims, you should contact the company in order to come to an agreement.</li>
                                            <li className="billboard-section-heading"> User accounts</li>
                                            <li>As a user of this website, you may be asked to register with us and provide private information. You are responsible for ensuring the accuracy of this information, and you are responsible for maintaining the safety and security of your identifying information.If you think there are any possible issues regarding the security of your account on the website, inform us immediately so we may address them accordingly.We reserve all rights to terminate accounts, edit or remove content and cancel orders at our sole discretion.</li>
                                            <li className="billboard-section-heading"> Applicable law</li>
                                            <li>By using this website, you agree that the laws of the Madurai, without regard to principles of conflict laws, will govern these terms and conditions, or any dispute of any sort that might come between Adinn Outdoors and you, or its business partners and associates.</li>
                                            <li className="billboard-section-heading"> Disputes</li>
                                            <li>Any dispute related in any way to your use of this website or to products you purchase from us shall be arbitrated by state or federal court [your location] and you consent to exclusive jurisdiction and venue of such courts.</li>
                                            <li className="billboard-section-heading"> Indemnification</li>
                                            <li>You agree to indemnify Adinn Outdoors and its affiliates and hold Adinn Outdoors harmless against legal claims and demands that may arise from your use or misuse of our services. We reserve the right to select our own legal counsel.</li>
                                            <li className="billboard-section-heading"> Limitation on liability</li>
                                            <li>Adinn Outdoors is not liable for any damages that may occur to you as a result of your misuse of our website.Adinn Outdoors reserves the right to edit, modify, and change this Agreement at any time. We shall let our users know of these changes through electronic mail. This Agreement is an understanding between Adinn Outdoors and the user, and this supersedes and replaces all prior agreements regarding the use of this website. Adinn Outdoors reserves the right to edit, modify, and change this Agreement at any time. We shall let our users know of these changes through electronic mail. This Agreement is an understanding between Adinn Outdoors and the user, and this supersedes and replaces all prior agreements regarding the use of this website.</li>
                                        </>
                                    ) : (
                                        <>
                                            <li className="billboard-section-heading">Who we are</li>
                                            <li>Our website address is: <a href="https://www.adinnoutdoors.com" target="_blank" rel="noopener noreferrer">www.adinnoutdoors.com</a></li>
                                            <li className="billboard-section-heading">Comments</li>
                                            <li>When visitors leave comments on the site we collect the data shown in the comments form, and also the visitor's IP address and browser user agent string to help spam detection.
                                                An anonymized string created from your email address (also called a hash) may be provided to the Gravatar service to see if you are using it. The Gravatar service privacy policy is available here: <a href="https://automattic.com/privacy" target="_blank" rel="noopener noreferrer">https://automattic.com/privacy</a>. After approval of your comment, your profile picture is visible to the public in the context of your comment.</li>
                                            <li className="billboard-section-heading">Media</li>
                                            <li>If you upload images to the website, you should avoid uploading images with embedded location data (EXIF GPS) included. Visitors to the website can download and extract any location data from images on the website.</li>
                                            <li className="billboard-section-heading">Cookies</li>
                                            <li>If you leave a comment on our site you may opt-in to saving your name, email address and website in cookies. These are for your convenience so that you do not have to fill in your details again when you leave another comment. These cookies will last for one year.
                                                If you visit our login page, we will set a temporary cookie to determine if your browser accepts cookies. This cookie contains no personal data and is discarded when you close your browser.
                                                When you log in, we will also set up several cookies to save your login information and your screen display choices. Login cookies last for two days, and screen options cookies last for a year. If you select "Remember Me", your login will persist for two weeks. If you log out of your account, the login cookies will be removed.
                                                If you edit or publish an article, an additional cookie will be saved in your browser. This cookie includes no personal data and simply indicates the post ID of the article you just edited. It expires after 1 day.
                                            </li>
                                            <li className="billboard-section-heading">Embedded content from other websites</li>
                                            <li>Articles on this site may include embedded content (e.g. videos, images, articles, etc.). Embedded content from other websites behaves in the exact same way as if the visitor has visited the other website.
                                                These websites may collect data about you, use cookies, embed additional third-party tracking, and monitor your interaction with that embedded content, including tracking your interaction with the embedded content if you have an account and are logged in to that website.
                                            </li>
                                            <li className="billboard-section-heading">Who we share your data with</li>
                                            <li>If you request a password reset, your IP address will be included in the reset email.</li>
                                            <li className="billboard-section-heading">How long we retain your data</li>
                                            <li>If you leave a comment, the comment and its metadata are retained indefinitely. This is so we can recognize and approve any follow-up comments automatically instead of holding them in a moderation queue.
                                                For users that register on our website (if any), we also store the personal information they provide in their user profile. All users can see, edit, or delete their personal information at any time (except they cannot change their username). Website administrators can also see and edit that information.
                                            </li>
                                            <li className="billboard-section-heading">What rights you have over your data</li>
                                            <li>If you have an account on this site, or have left comments, you can request to receive an exported file of the personal data we hold about you, including any data you have provided to us. You can also request that we erase any personal data we hold about you. This does not include any data we are obliged to keep for administrative, legal, or security purposes.</li>
                                        </>
                                    )}
                                </ul>
                            </div>
                        </div>
                    </>
                )
            }
        </div>
    )
}

export default FooterMain;