import React, { useState } from 'react';
import './a4home.css';

const FAQ = () => {
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
            question: 'How do I stay updated when my campaign launches??',
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
        <div>
            <div className='qns'>
                <h1 className='heading'>Frequently Asked <span className='highlight'>Questions</span></h1>

                {faqs.map((faq, index) => (
                    <div
                        key={index}
                        className={`frequent container ${activeIndex === index ? 'active' : ''}`} // Add active class
                    >
                        <div onClick={() => handleClick(index)} className='qn'>
                            {faq.question}

                            {/* Arrow icon */}
                            <span
                                style={{
                                    color: 'red',
                                    float: 'right',
                                    fontSize: '20px',
                                }}
                                className='arrow-icon'
                            >
                                {activeIndex === index ? (
                                    <i className='fa-solid fa-angle-up'></i>
                                ) : (
                                    <i className='fa-solid fa-angle-down'></i>
                                )}
                            </span>
                        </div>

                        {/* Conditional rendering with smooth transition */}
                        <div className={`ans ${activeIndex === index ? 'visible' : 'hidden'}`}>
                            {faq.answer}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FAQ;



