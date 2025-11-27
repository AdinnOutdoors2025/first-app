

// HeroBanner.jsx (Updated)
import React, { useEffect, useRef, useState } from 'react'
import './HeroSectionMain.css';
import { MainLayout } from './MainLayout';
import MainNavbar from './A1NAVBAR.jsx';
import MainNavbarHero from './A1NAVBARHERO.jsx';
import { useNavigate } from 'react-router-dom';
import { useLogin } from './LoginContext';
import AdinnHome from '../components/a1home';
import { gsap } from 'gsap';
import { ScrollTrigger, ScrollSmoother } from 'gsap/all';
import ScrollHero from './ScrollHero.jsx';  //thendral added


function HeroSectionMain() {
    const navigate = useNavigate();
    const [isScrolled, setIsScrolled] = useState(false);
    const heroRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            setIsScrolled(scrollPosition > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <MainLayout>
            <div className="hero-wrapper" ref={heroRef}>
                {/* Hero Banner Navbar - only visible at the top */}
                <div className={`hero-navbar ${isScrolled ? 'hidden' : ''}`}>
                    <MainNavbarHero />
                </div>

               <div className='BannerMainSection'>
                    <div className='HeroBannerLeft'></div>
                    <div className='HeroBannerRight'>
                        <div className='HeroBannerContent' >
                            Capture attention where it matters
                        </div>
                        <div>
                            <button className='HeroBannerMainButton' onClick={() => navigate('/book')}>
                                Book Your Space
                            </button> 
                        </div>
                    </div>
                </div> 
                {/* //thendral added */}
                {/* <div className="scrollhero-wrapper">
                    <ScrollHero />
                </div> */}

            </div>

            {/* Main Content with its own navbar */}
            <div className={`main-content-navbar ${isScrolled ? 'visible' : 'hidden'}`}>
                <MainNavbar />
            </div>

            <AdinnHome />
        </MainLayout>
    )
}

export default HeroSectionMain;
