// import React, { useEffect, useRef } from 'react'
// import './HeroSectionMain.css';
// import { MainLayout } from './MainLayout';
// import MainNavbar from './A1NAVBAR.jsx';
// import { useNavigate } from 'react-router-dom';
// import { useLogin } from './LoginContext';
// import AdinnHome from '../components/a1home';
// import { gsap } from 'gsap';
// import { ScrollTrigger, ScrollSmoother } from 'gsap/all';


// function HeroSectionMain() {
//     const navigate = useNavigate();
//     const heroRef = useRef(null);
//     const contentRef = useRef(null);
//     const smootherRef = useRef(null);



//     useEffect(() => {
//         // Register GSAP plugins
//         gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

//         // Initialize smooth scroller
//         smootherRef.current = ScrollSmoother.create({
//             wrapper: "#smooth-wrapper",
//             content: "#smooth-content",
//             smooth: 1.5,
//             speed: 1,
//             effects: true,
//             normalizeScroll: true
//         });

//         // Hero section animation
//         gsap.from(heroRef.current, {
//             opacity: 0,
//             y: 50,
//             duration: 1,
//             ease: "power2.out"
//         });

//         // AdinnHome fade-in animation
//         ScrollTrigger.create({
//             trigger: ".AdinnHome-section",
//             start: "top 80%",
//             end: "bottom 20%",
//             onEnter: () => {
//                 gsap.from(".AdinnHome-section", {
//                     opacity: 0,
//                     y: 100,
//                     duration: 1.5,
//                     ease: "power3.out"
//                 });
//             },
//             markers: false // Set to true for debugging
//         });

//         return () => {
//             // Clean up
//             if (smootherRef.current) {
//                 smootherRef.current.kill();
//             }
//             ScrollTrigger.getAll().forEach(trigger => trigger.kill());
//         };
//     }, []);






//     return (
//         <MainLayout>
//             {/* <div >
//                 <MainNavbar /> */}

//             <div id="smooth-wrapper">
//                 <div id="smooth-content">
//                     <div ref={heroRef} className="hero-wrapper">
//                         <MainNavbar />
//                         <div className='BannerMainSection'>
//                             <div className='HeroBannerLeft'>
//                                 {/* <img src='/images/HeroBannerLeft.png' className='HeroBannerLeftImg'></img> */}

//                             </div>
//                             <div className='HeroBannerRight'>
//                                 <div className='HeroBannerContent' style={{ color: 'white' }}>Capture attention where it matters</div>
//                                 <div><button className='HeroBannerMainButton' onClick={() => navigate('/book')} >Book Your Space</button> </div>
//                             </div>
//                         </div>
//                     </div>


//                     {/* <AdinnHome/> */}
//                     <div className="AdinnHome-section">
//                         <AdinnHome />
//                     </div>
//                 </div>
//             </div>
//         </MainLayout>
//         // {/* <AdinnHome/> */}
//     )
// }

// export default HeroSectionMain;

















import React, { useEffect, useRef } from 'react'
import './HeroSectionMain.css';
import { MainLayout } from './MainLayout';
import MainNavbar from './A1NAVBAR.jsx';
import { useNavigate } from 'react-router-dom';
import { useLogin } from './LoginContext';
import AdinnHome from '../components/a1home';
import { gsap } from 'gsap';
import { ScrollTrigger, ScrollSmoother } from 'gsap/all';


function HeroSectionMain() {
    const navigate = useNavigate();
    // const heroRef = useRef(null);
    // const contentRef = useRef(null);
    // const smootherRef = useRef(null);



    // useEffect(() => {
    //     // Register GSAP plugins
    //     gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

    //     // Initialize smooth scroller
    //     smootherRef.current = ScrollSmoother.create({
    //         wrapper: "#smooth-wrapper",
    //         content: "#smooth-content",
    //         smooth: 1.5,
    //         speed: 1,
    //         effects: true,
    //         normalizeScroll: true
    //     });

    //     // Hero section animation
    //     gsap.from(heroRef.current, {
    //         opacity: 0,
    //         y: 50,
    //         duration: 1,
    //         ease: "power2.out"
    //     });

    //     // AdinnHome fade-in animation
    //     ScrollTrigger.create({
    //         trigger: ".AdinnHome-section",
    //         start: "top 80%",
    //         end: "bottom 20%",
    //         onEnter: () => {
    //             gsap.from(".AdinnHome-section", {
    //                 opacity: 0,
    //                 y: 100,
    //                 duration: 1.5,
    //                 ease: "power3.out"
    //             });
    //         },
    //         markers: false // Set to true for debugging
    //     });

    //     return () => {
    //         // Clean up
    //         if (smootherRef.current) {
    //             smootherRef.current.kill();
    //         }
    //         ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    //     };
    // }, []);    
    return (
        <MainLayout>
            {/* <div >
                <MainNavbar /> */} 
            <div id="smooth-wrapper">
                <div id="smooth-content">
                    <div className="hero-wrapper">
                        <MainNavbar />
                        <div className='BannerMainSection'>
                            <div className='HeroBannerLeft'>
                            </div>
                            <div className='HeroBannerRight'>
                               
                              <div className='HeroBannerContent' style={{ color: 'white' }}>Capture attention where it matters</div>
                                <div><button className='HeroBannerMainButton' onClick={() => navigate('/book')} >Book Your Space</button> </div> 
                             
                            </div>
                        </div>
                    </div>


                    {/* <AdinnHome/> */}
                    <div className="AdinnHome-section">
                        <AdinnHome />
                    </div>
                </div>
            </div>
        </MainLayout>
        // {/* <AdinnHome/> */}
    )
}

export default HeroSectionMain;
