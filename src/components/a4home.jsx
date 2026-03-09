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
            question: 'How long does outdoor installation take?',
            answer: 'Installation usually takes 24 to 48 hours, depending on the weather and location.'
        },
        {
            question: 'Are there any corporation or regulatory issues to consider?',
            answer: 'We take care of all permissions from local authorities and corporate policies for you, whenever approvals are required'
        },
        {
            question: 'How often will monitoring or maintenance occur?',
            answer: "We check the site regularly to make sure everything stays clear, safe and in good condition"
        },
        {
            question: 'Are outdoor signs durable for long-term projects and eco-friendly?',
            answer: 'Yes. We use durable, weather resistant materials for long lasting, reusable and eco-friendly and follow all local regulations'
        },
        {
            question: 'Can outdoor advertising drive foot traffic to my store?',
            answer: 'Yes, they can. We place ads in the right busy locations, which helps increase walk-ins to your store'
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

            <MainFooter />


        </div>
    );
};

export default AdinnHome4;