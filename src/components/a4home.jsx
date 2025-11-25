import React, { useState } from 'react';
import './a4home.css';
import MainFooter from './A1FOOTER.jsx';

function AdinnHome4() {
    const [activeIndex, setActiveIndex] = useState(null);

    const handleClick = (index) => {
        setActiveIndex(activeIndex === index ? null : index); // Toggle active index
    };

    // const faqs = [
    //     {
    //         question: 'Where does Adinn Outdoors operate?',
    //         answer: 'Adinn Outdoors operates across South India (Tamil Nadu, Karnataka, Kerala, Andhra Pradesh, and Telangana). We proudly manage over 550 outdoor media sites in these regions.'
    //     },
    //     {
    //         question: 'Can I be involved in the media planning process?',
    //         answer: 'Absolutely! We encourage client collaboration and welcome your input throughout the planning process. Our team will work closely with you to ensure the strategy aligns with your goals and expectations.'
    //     },
    //     {
    //         question: 'How do I stay updated when my campaign launches?',
    //         answer: "We provide comprehensive updates throughout your campaign. You'll receive start date photos when the campaign launches, mid-monitoring photos 15 days into the campaign, and end date photos upon completion."
    //     },
    //     {
    //         question: 'What special offers does Adinn Outdoors provide?',
    //         answer: 'When you book a long-term campaign with us, we offer reduced site costs and free mounting services.'
    //     },
    //     {
    //         question: 'How can I contact Adinn Outdoors to start a campaign?',
    //         answer: 'For any inquiries, please contact Mr. Vinoth Kumar at +91 73737 85048 or email him at vinothkumar@adinn.co.in.'
    //     }
    // ];
  
  
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