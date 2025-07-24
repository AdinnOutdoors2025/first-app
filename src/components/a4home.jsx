import React, { useState } from 'react';
import './a4home.css';
import MainFooter from './A1FOOTER.jsx';

function AdinnHome4() {
    const [activeIndex, setActiveIndex] = useState(null);

    const handleClick = (index) => {
        setActiveIndex(activeIndex === index ? null : index); // Toggle active index
    };

    const faqs = [
        {
            question: 'Where does Adinn Outdoors operate?',
            answer: 'Adinn Outdoors operates across South India (Tamil Nadu, Karnataka, Kerala, Andhra Pradesh, and Telangana). We proudly manage over 550 outdoor media sites in these regions.'
        },
        {
            question: 'Can I be involved in the media planning process?',
            answer: 'Absolutely! We encourage client collaboration and welcome your input throughout the planning process. Our team will work closely with you to ensure the strategy aligns with your goals and expectations.'
        },
        {
            question: 'How do I stay updated when my campaign launches?',
            answer: "We provide comprehensive updates throughout your campaign. You'll receive start date photos when the campaign launches, mid-monitoring photos 15 days into the campaign, and end date photos upon completion."
        },
        {
            question: 'What special offers does Adinn Outdoors provide?',
            answer: 'When you book a long-term campaign with us, we offer reduced site costs and free mounting services.'
        },
        {
            question: 'How can I contact Adinn Outdoors to start a campaign?',
            answer: 'For any inquiries, please contact Mr. Vinoth Kumar at +91 73737 85048 or email him at vinothkumar@adinn.co.in.'
        }
    ];

    return (
        <div className='freqFoot'>
            {/* Frequently asked questions section  */}
            <div className='qns'>
                <h1 className='heading'>Frequently Asked <span className='highlight'>Questions</span></h1>

                {faqs.map((faq, index) => (
                    <div
                        key={index}
                        className={`frequent container ${activeIndex === index ? 'active' : ''}`} // Add active class
                        >
                        <div onClick={() => handleClick(index)} className='qn'>
                            <div className='qn-content1'>{faq.question}</div>

                            {/* Arrow icon */}
                            <div
                                style={{
                                    color: 'red',
                                    float: 'right',
                                    fontSize: '20px',
                                }}
                                className='arrow-icon'>
                                {activeIndex === index ? (
                                    <i className='fa-solid fa-angle-up frequently-up'></i>
                                ) : (
                                    <i className='fa-solid fa-angle-down frequently-down'></i>
                                )}
                            </div>
                        </div>

                        {/* Conditional rendering with smooth transition */}
                        <div className={`ans ${activeIndex === index ? 'visible' : 'hidden'}`}>
                            {faq.answer}
                        </div>
                    </div>
                ))}
            </div>


            {/* Footer section */}
            {/* <div className='footer container-fluid' id="ContactUsFooter">
                <div className='footer-contact'>
                    <form>
                        <input type="text" name="name" className='f-input' placeholder="Enter E-mail or Phone number" />
                        <button className='f-btn'> Contact me </button>
                    </form>
                </div>
                <img src='./images/f7-building.png' className='f-buildMain'></img>
                <div className='f-info container'>
                    <div className='f-infoContent'>
                        <img src='./images/adinn_logo.png' className='f-adinnLogo'></img>
                        <div className='f-content'>
                            <div className='f-c1'> <img src='./images/f1-phone.png' className='f1'></img></div>
                            <div className='f-c2' > <span>+91 73737 85048</span><br></br> <span>+91 73737 85056</span></div>
                        </div>

                        <div className='f-content1'>

                            <img src='./images/f2-mail.png' className='f2'></img><span className='mail'>vinothkumar@adinn.co.in</span>
                        </div>

                        <div className='f-content2'>
                            <div className='f-c3'><img src='./images/f3-linkedin.png' className='f3'></img></div>
                            <div className='f-c3'><img src='./images/f4-fb.png' className='f4'></img></div>
                            <div className='f-c3'><img src='./images/f5-youtube.png' className='f5'></img></div>
                            <div className='f-c3'><img src='./images/f6-insta.png' className='f6'></img></div>
                        </div>

                    </div>

                    <div className='f-infoContent1'>
                        <div className='f-content3'>
                            <div>
                                <img src='./images/f8-building1.png' className='f7'></img>
                            </div>
                            <div className='f-c4'>
                                <h1 className='footer-heading'>Head office</h1>
                                <p className='footer-para'>
                                    29, 1st Cross street, Vanamamalai nagar, Bye pass road, Madurai, Tamilnadu, 625010.
                                </p>
                            </div>
                        </div>

                        <div className='f-content4'>
                            <div>
                                <img src='./images/f9-building2.png' className='f8'></img>
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
            </div> */}

            <MainFooter />


        </div>
    );
};

export default AdinnHome4;



// import React, { useState } from 'react';
// import { Container, Row, Col, Form, Button } from 'react-bootstrap';
// import './a4home.css';

// function AdinnHome4() {
//     const [activeIndex, setActiveIndex] = useState(null);

//     const handleClick = (index) => {
//         setActiveIndex(activeIndex === index ? null : index); // Toggle active index
//     };

//     const faqs = [
//         {
//             question: 'Where does Adinn Outdoors operate?',
//             answer: 'Adinn Outdoors operates across South India (Tamil Nadu, Karnataka, Kerala, Andhra Pradesh, and Telangana). We proudly manage over 550 outdoor media sites in these regions.'
//         },
//         {
//             question: 'Can I be involved in the media planning process?',
//             answer: 'Absolutely! We encourage client collaboration and welcome your input throughout the planning process. Our team will work closely with you to ensure the strategy aligns with your goals and expectations.'
//         },
//         {
//             question: 'How do I stay updated when my campaign launches??',
//             answer: "We provide comprehensive updates throughout your campaign. You'll receive start date photos when the campaign launches, mid-monitoring photos 15 days into the campaign, and end date photos upon completion."
//         },
//         {
//             question: 'What special offers does Adinn Outdoors provide?',
//             answer: 'When you book a long-term campaign with us, we offer reduced site costs and free mounting services.'
//         },
//         {
//             question: 'How can I contact Adinn Outdoors to start a campaign?',
//             answer: 'For any inquiries, please contact Mr. Vinoth Kumar at +91 73737 85048 or email him at vinothkumar@adinn.co.in.'
//         }
//     ];

//     return (
//         <Container fluid className="freqFoot">
//             {/* Frequently asked questions section */}
//             <Container className="qns">
//                 <h1 className="heading">
//                     Frequently Asked <span className="highlight">Questions</span>
//                 </h1>
//                 {faqs.map((faq, index) => (
//                     <div
//                         key={index}
//                         className={`frequent container ${activeIndex === index ? 'active' : ''}`}
//                     >
//                         <div onClick={() => handleClick(index)} className="qn">
//                             {faq.question}
//                             <span className="arrow-icon">
//                                 {activeIndex === index ? (
//                                     <i className="fa-solid fa-angle-up"></i>
//                                 ) : (
//                                     <i className="fa-solid fa-angle-down"></i>
//                                 )}
//                             </span>
//                         </div>
//                         <div className={`ans ${activeIndex === index ? 'visible' : 'hidden'}`}>
//                             {faq.answer}
//                         </div>
//                     </div>
//                 ))}
//             </Container>

//             {/* Footer section */}
//             <footer className="footer">
//                 <Container fluid className="footer-contact text-center">
//                     <Form>
//                         <Row className="align-items-center">
//                             <Col xs={12} md={8} className="mb-3">
//                                 <Form.Control
//                                     type="text"
//                                     className="f-input"
//                                     placeholder="Enter E-mail or Phone number"
//                                 />
//                             </Col>
//                             <Col xs={12} md={4}>
//                                 <Button className="f-btn">Contact me</Button>
//                             </Col>
//                         </Row>
//                     </Form>
//                 </Container>

//                 <Container className="f-info">
//                     <Row>
//                         <Col xs={12} md={4}>
//                             <img src="./images/adinn_logo.png" className="f-adinnLogo" alt="Adinn Logo" />
//                             <div className="f-content">
//                                 <img src="./images/f1-phone.png" className="f1" alt="Phone" />
//                                 <span>
//                                     +91 73737 85048<br />+91 73737 85056
//                                 </span>
//                             </div>
//                             <div className="f-content1">
//                                 <img src="./images/f2-mail.png" className="f2" alt="Mail" />
//                                 <span className="mail">vinothkumar@adinn.co.in</span>
//                             </div>
//                         </Col>
//                         <Col xs={12} md={4}>
//                             <div className="f-content3">
//                                 <img src="./images/f8-building1.png" className="f7" alt="Building" />
//                                 <h1 className="footer-heading">Head office</h1>
//                                 <p className="footer-para">
//                                     29, 1st Cross Street, Vanamamalai Nagar, Bye Pass Road,
//                                     Madurai, Tamilnadu, 625010.
//                                 </p>
//                             </div>
//                         </Col>
//                         <Col xs={12} md={4}>
//                             <div className="f-content4">
//                                 <img src="./images/f9-building2.png" className="f8" alt="Branch Office" />
//                                 <h1 className="footer-heading">Branch office</h1>
//                                 <p className="footer-para">
//                                     No 3, 1st Floor, Vijayalakshmi Street, Nungambakkam, Chennai - 600 034.
//                                 </p>
//                             </div>
//                         </Col>
//                     </Row>
//                 </Container>
//             </footer>
//         </Container>
//     );
// }

// export default AdinnHome4;


