import React from 'react';
import './H2DealScroll.css';
import { useNavigate } from 'react-router-dom';

function H2DealScrollAnim() {
    const navigate = useNavigate();

    const handleClick = () => {
        // Navigate to deals page - update the path as needed
        navigate('/deal');
    };

    // Duplicate content for seamless scrolling
    const scrollContent = (
        <>
            <div className='DealScroll-item'>Exclusive Deals Available Now</div>
            <div className='DealScrollAnimImg1'>
                <img src='./images/DealScroll3DIcon1Final.png' className='DealScrollAnimImg1' alt='Deal Icon 1' />
            </div>
            <div className='DealScroll-item'>New Arrivals - Limited Time</div>
            <div className='DealScrollAnimImg1'>
                <img src='./images/DealScroll3DIcon2Final.png' className='DealScrollAnimImg1' alt='Deal Icon 2' />
            </div>
            <div className='DealScroll-item'>Hot Picks for You</div>
            
            {/* Duplicated content for seamless loop */}
            <div className='DealScroll-item'>Exclusive Deals Available Now</div>
            <div className='DealScrollAnimImg1'>
                <img src='./images/DealScroll3DIcon1Final.png' className='DealScrollAnimImg1' alt='Deal Icon 1' />
            </div>
            <div className='DealScroll-item'>New Arrivals  - Limited Time</div>
            <div className='DealScrollAnimImg1'>
                <img src='./images/DealScroll3DIcon2Final.png' className='DealScrollAnimImg1' alt='Deal Icon 2' />
            </div>
            <div className='DealScroll-item'>Hot Picks for You</div>
        </>
    );

    return (
        <div>
            <div className='container-fluid DealScrollAnimMain' onClick={handleClick}>
                <div className='DealScroll-container'>
                    {scrollContent}
                </div>
            </div>
        </div>
    );
}

export default H2DealScrollAnim;