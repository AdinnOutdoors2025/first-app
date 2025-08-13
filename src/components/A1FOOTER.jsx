import React, { useState } from 'react';
import './a4home.css';
import { baseUrl } from '../Adminpanel/BASE_URL';

function FooterMain() {
    const [contactInfo, setContactInfo] = useState('');
    const [isSubmit, setIsSubmit] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' }); // type: 'success' or 'error'
    const [isError, setIsError] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const validateContactInfo = (input) => {
        // Simple email regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        // Simple phone regex (10 digits)
        const phoneRegex = /^[0-9]{10}$/;

        // Remove all whitespace from phone numbers
        const cleanedInput = input.replace(/\s/g, '');

        return emailRegex.test(input) || phoneRegex.test(cleanedInput);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!contactInfo.trim()) {
            // setIsError('Please enter your email or phone number');
            setMessage({
                text: 'Please enter your email or phone number',
                type: 'error'
            });
            return;
        }


        // Format validation
        if (!validateContactInfo(contactInfo)) {
            setMessage({
                text: 'Please enter a valid email or 10-digit phone number',
                type: 'error'
            });
            return;
        }

        setIsSubmit(true);
        setMessage({ text: '', type: '' });

        // setIsError('');
        try {
            const response = await fetch(`${baseUrl}/ContactInfo/footerContactInfo`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contactInfo: contactInfo,
                    createdAt: new Date().toISOString()

                })
            });
            if (!response.ok) {
                throw new Error("Failed to submit contact information");
            }
            // setIsSuccess(true);
            setMessage({
                text: 'Thank you for contacting us! We\'ll reach out to you soon.',
                type: 'success'
            });
            setContactInfo('');
            setTimeout(
                () => {
                    // setIsSuccess(false);
                    setMessage({ text: '', type: '' });
                }, 5000
            );
        }
        catch (err) {
            // setIsError("Failed to submit your information. Please try again later");
            setMessage({
                text: 'Failed to submit your information. Please try again later.',
                type: 'error'
            });
            console.error("Error submitting contact information:", err);
        }
        finally {
            setIsSubmit(false);
        }
    }

    return (
        <div>
            {/* Footer section */}
            <div className='footer container-fluid' id="ContactUsFooter">
                {/* Success message shown at the top of the footer */}
                {/* {isSuccess && (
                    <div className="contact-success-message">
                        Thank you for contacting us! We'll reach you soon.
                    </div>
                )} */}

                {message.text && (
                    <div className={`contact-message ${message.type}`}>
                        {message.text}
                    </div>
                )}

                <div className='footer-contact'>
                    <form onSubmit={handleSubmit}>
                        <input type="text" name="name" className='f-input' placeholder="Enter E-mail or Phone number"
                            value={contactInfo} onChange={(e) => setContactInfo(e.target.value)} disabled={isSubmit} />
                        <button className='f-btn' type="submit" disabled={isSubmit}  >{isSubmit ? 'Sending...' : 'Contact me'} </button>
                    </form>
                    {/* {isError && <div className="contact-error-message">{isError}</div>} */}
                </div>
                {/* Building images  */}
                <img src='/images/f7-building.png' className='f-buildMain'></img>
                <div className='f-info container'>
                    <div className='f-infoContent'>
                        <img src='/images/adinn_logo.png' className='f-adinnLogo'></img>
                        <div className='f-content'>
                            <div className='f-c1'> <img src='/images/f1-phone.png' className='f1'></img></div>
                            <div className='f-c2'  >
                                <div><a href='tel:7373785048' style={{textDecoration:'none', color: "#E41E25"}}> +91 73737 85048</a></div>
                                <div><a href='tel:7373785056' style={{textDecoration:'none', color: "#E41E25"}}>+91 73737 85056</a></div>
                            </div>
                        </div>
                        <div className='f-content1'>
                            <img src='/images/f2-mail.png' className='f2'></img><span className='mail'><a href='mailto:vinothkumar@adinn.co.in' style={{textDecoration:'none', color: "#E41E25"}}>vinothkumar@adinn.co.in</a></span>
                        </div>
                        <div className='f-content2'>
                            <div className='f-c3'><a href="https://www.linkedin.com/showcase/adinn-outdoors/" target="_blank"><img src='/images/f3-linkedin.png' className='f3' /></a></div>
                            <div className='f-c3'><a href="https://www.facebook.com/adinnoutdoors/" target="_blank"><img src='/images/f4-fb.png' className='f4'></img></a></div>
                            <div className='f-c3'><a href="https://www.youtube.com/@AdinnChannel" target="_blank"><img src='/images/f5-youtube.png' className='f5'></img></a></div>
                            <div className='f-c3'><a href="https://www.instagram.com/adinnoutdoor/" target="_blank"><img src='/images/f6-insta.png' className='f6'></img></a></div>
                        </div>
                    </div>

                    {/* right side footer content  */}
                    <div className='f-infoContent1'>
                        <div className='f-content3'>
                            <div>
                                <img src='/images/f8-building1.png' className='f7'></img>
                            </div>
                            <div className='f-c4'>
                                {/* <a href="https://share.google/9k3E51D5OFjMOd0KT" target="_blank" style={{textDecoration:'none', color:'white'}}> */}
                                <h1 className='footer-heading'>Head office</h1>
                                <p className='footer-para'>
                                    29, 1st Cross street, Vanamamalai nagar, Bypass road, Madurai-625016, Tamil Nadu.
                                </p>
                                {/* </a> */}
                            </div>
                        </div>
                        <div className='f-content4'>
                            <div>
                                <img src='/images/f9-building2.png' className='f8'></img>
                            </div>
                            <div className='f-c4'>
                                <h1 className='footer-heading'>Branch office</h1>
                                <p className='footer-para'>
                                    No 3, 1st Floor, Vijayalakshmi Street, Nungambakkam, Chennai - 600 034.
                                </p>
                            </div>
                        </div>
                    </div>

                </div>

                <div className="container-fluid" style={{ padding: '0' }}>
                    <div className="copy">
                        <div className="copy1"></div>
                        <div className="copy11">Copyright &copy; Adinn, All Rights Reserved</div>
                        <div className="copy2"></div>
                        <div className="copy22">Terms</div>
                        <div className="copy3"></div>
                        <div className="copy33">Policy & Privacy</div>
                        <div className="copy4"></div>
                    </div>
                </div>
            </div>
        </div> 
    )
}

export default FooterMain;