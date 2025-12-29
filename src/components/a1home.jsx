// import React, { useState, useEffect, useRef } from 'react';
// import Odometer from "odometer"; // Import the Odometer library directly
// import "odometer/themes/odometer-theme-default.css"; // Odometer styles
// import Odo from '../components/a1homeOdo';
// import AdinnHome2 from '../components/a2home';
// import AdinnHome3 from '../components/a3home';
// import AdinnHome4 from '../components/a4home';
// import './a1home.css';
// import { useNavigate } from 'react-router-dom';
// import LoginPageMain from './C1LoginMain';
// import MainNavbar from './A1NAVBAR.jsx';
// import MainFooter from './A1FOOTER.jsx';
// import { MainLayout } from './MainLayout';
// import Splash from './splashCursor.jsx';

// function AdinnHome() {
//  // WHAT WE DO SECTION
//   const [logoPosition, setLogoPosition] = useState(8.5); // Start at 9%
//   const [activeIndex, setActiveIndex] = useState(0);
//   const [isPaused, setIsPaused] = useState(false); // State to pause animation
//   const [isDragging, setIsDragging] = useState(false); // State to track dragging
//   const [dragStartX, setDragStartX] = useState(0); // X-coordinate during drag

// const [isMobile, setIsMobile] = useState(window.innerWidth <= 480);
//   const scrollContainerRef = useRef(null);


//   const dragItems = [
//     { id: 1, name: "3D and Cut-out", image: "./images/what1.png", content: ' Adinn eye-catching hoardings make you stand out from a wider audience. Our strategical placements make your brand dominate in high-traffic urban areas.' },
//     { id: 2, name: "Dynamic Advertising", image: "./images/what2.png", content: "Content 2..." },
//     { id: 3, name: "Geo Targeting", image: "./images/what3.png", content: "Content 3..." },
//     { id: 4, name: "Traditional", image: "./images/what4.png", content: "Content 4..." },
//     { id: 5, name: "Mobile Billboard", image: "./images/what5.png", content: "Content 5..." },
//     { id: 6, name: "Wall Painting", image: "./images/what6.png", content: "Content 6..." },
//     { id: 7, name: "Dynamic Lighting", image: "./images/what7.png", content: "Content 7..." },
//   ];

//   const [currentImage, setCurrentImage] = useState(dragItems[0].image);
//   const [currentContent, setCurrentContent] = useState(dragItems[0].content);


// // Check screen size on resize
//   useEffect(() => {
//     const handleResize = () => {
//       setIsMobile(window.innerWidth <= 480);
//     };
//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//  // Auto-scroll for mobile
//   useEffect(() => {
//     if (!isMobile || isPaused || isDragging) return;
    
//     const interval = setInterval(() => {
//       setActiveIndex(prev => (prev + 1) % dragItems.length);
//     }, 3000);

//     return () => clearInterval(interval);
//   }, [isMobile, isPaused, isDragging, dragItems.length]);

//   // Scroll to active item on mobile
//   useEffect(() => {
//     if (!isMobile || !scrollContainerRef.current) return;
    
//     const container = scrollContainerRef.current;
//     const activeItem = container.children[activeIndex];
    
//     if (activeItem) {
//       const containerWidth = container.offsetWidth;
//       const itemWidth = activeItem.offsetWidth;
//       const itemOffset = activeItem.offsetLeft;
//       const scrollPosition = itemOffset - (containerWidth / 2) + (itemWidth / 2);
      
//       container.scrollTo({
//         left: scrollPosition,
//         behavior: 'smooth'
//       });
//     }
//   }, [activeIndex, isMobile]);

  
//   // Automatic movement
//   useEffect(() => {
//     if (isPaused || isDragging) return;

//     const interval = setInterval(() => {
//       setLogoPosition((prev) => {
//         if (prev >= 92) return 8.5; // Reset to start
//         return prev + 14; // Move forward
//       });
//     }, 2000); // Adjust speed as needed

//     return () => clearInterval(interval);
//   }, [isMobile, isPaused, isDragging, dragItems.length]);

//   // Update content based on active index or logo position
//   useEffect(() => {
//     if (isMobile) {
//       setCurrentImage(dragItems[activeIndex].image);
//       setCurrentContent(dragItems[activeIndex].content);
//     } else {
//       const index = Math.floor((logoPosition - 8.5) / ((92 - 8.5) / (dragItems.length - 1)));
//       const newIndex = Math.min(index, dragItems.length - 1);
//       setActiveIndex(newIndex);
//       setCurrentImage(dragItems[newIndex].image);
//       setCurrentContent(dragItems[newIndex].content);
//     }
//   }, [logoPosition, activeIndex, isMobile]);



//   // Handle drag start
//   const handleMouseDown = (e) => {
//      if (isMobile) return;
//     setIsDragging(true);
//     setIsPaused(true); // Pause auto movement
//     setDragStartX(e.clientX);
//   };

//   // Handle drag movement
//   const handleMouseMove = (e) => {
//     if (!isDragging || isMobile) return;

//     const deltaX = e.clientX - dragStartX;
//     const deltaPercentage = (deltaX / window.innerWidth) * 100;

//     setLogoPosition((prev) => {
//       const newPos = prev + deltaPercentage;
//       // Ensure the position stays within bounds (9% to 92%)
//       return Math.max(8.5, Math.min(92, newPos));
//     });

//     setDragStartX(e.clientX); // Update start position
//   };

//   // Handle drag end
//   const handleMouseUp = () => {

//      if (isMobile) return;
//     setIsDragging(false);
//     setIsPaused(false); // Resume auto movement
//   };
//  // Mobile item click handler
//   const handleItemClick = (index) => {
//     if (!isMobile) return;
//     setActiveIndex(index);
//     setIsPaused(true);
//     setTimeout(() => setIsPaused(false), 5000);
//   };

//   const [isLoginOpen, setIsLoginOpen] = useState(false); // State to toggle Login 
//   //Toggle LoginPage
//   const toggleLoginPage = () => {
//     setIsLoginOpen(!isLoginOpen);
//   };
//   const closeLoginPage = () => {
//     setIsLoginOpen(false);
//   };


//   return (
//     <MainLayout>
//     <div>
//  {/* <Splash/> */}
//        <MainNavbar />
//       {/* About us content  */}
//       <div className='about container-fluid'>
//         <div className='heading about-heading'>About <span className='highlight'>Us</span></div>
//         <div className='about-content'>
//           <div className='about-content1'>
//             <div className='about-content1-heading'>Who <span className='highlight'>we</span> are </div>
//             <div className='about-content-para'>Adinn Outdoors enhances your brand visibility with over 550 impactful hoarding sites across Tamil Nadu, Kerala, Karnataka, Andhra Pradesh, and Telangana. With 20 years of experience, we offer unparalleled exposure through strategic billboards, bus shelters, unipoles, pole kiosks, and police booths.</div> <br></br>
//             <div className='about-content-para'>Reach a diverse audience with our effective outdoor advertising solutions.</div><br></br>
//             <div className='about-content-para about-content-para-last'><span className='highlight contactUs'>Contact Us</span> to make your campaign special.</div>
//           </div>
//           <div className='about-content2 img-fluid'>
//             <img src='./images/road_gif.png'></img>
//           </div>
//         </div>
//       </div>

//       {/* Client section */}
//       <div className="client">
//         <h1 className="heading client-heading">
//           Esteemed <span className="highlight">Clients</span>
//         </h1>
//         <div className='client-main'>
//           <div className="client-content">
//             {/* <!-- Original Set --> */}
//             <div><img src="./images/client1.png" className="cli1" alt="Client 1" /></div>
//             <div><img src="./images/client2.png" className="cli2" alt="Client 2" /></div>
//             <div><img src="./images/client3.png" className="cli3" alt="Client 3" /></div>
//             <div><img src="./images/client4.png" className="cli4" alt="Client 4" /></div>
//             <div><img src="./images/client5.png" className="cli5" alt="Client 5" /></div>
//             <div><img src="./images/client6.png" className="cli6" alt="Client 6" /></div>
//             <div><img src="./images/client7.png" className="cli7" alt="Client 7" /></div>
//             <div><img src="./images/client8.png" className="cli8" alt="Client 8" /></div>
//             {/* <!-- Duplicate Set for Seamless Scrolling --> */}
//             <div><img src="./images/client1.png" className="cli1" alt="Client 1" /></div>
//             <div><img src="./images/client2.png" className="cli2" alt="Client 2" /></div>
//             <div><img src="./images/client3.png" className="cli3" alt="Client 3" /></div>
//             <div><img src="./images/client4.png" className="cli4" alt="Client 4" /></div>
//             <div><img src="./images/client5.png" className="cli5" alt="Client 5" /></div>
//             <div><img src="./images/client6.png" className="cli6" alt="Client 6" /></div>
//             <div><img src="./images/client7.png" className="cli7" alt="Client 7" /></div>
//             <div><img src="./images/client8.png" className="cli8" alt="Client 8" /></div>
//           </div>

//           {/* CLIENT ROW 2  */}
//           <div className="client-content1">
//             {/* <!-- Original Set --> */}
//             <div><img src="./images/client9.png" className="cli1" alt="Client 9" /></div>
//             <div><img src="./images/client10.png" className="cli2" alt="Client 10" /></div>
//             <div><img src="./images/client11.png" className="cli3" alt="Client 11" /></div>
//             <div><img src="./images/client12.png" className="cli4" alt="Client 12" /></div>
//             <div><img src="./images/client13.png" className="cli5" alt="Client 13" /></div>
//             <div><img src="./images/client14.png" className="cli6" alt="Client 14" /></div>
//             <div><img src="./images/client15.png" className="cli7" alt="Client 15" /></div>
//             <div><img src="./images/client16.png" className="cli8" alt="Client 16" /></div>
//             {/* <!-- Duplicate Set for Seamless Scrolling --> */}
//             <div><img src="./images/client9.png" className="cli1" alt="Client 9" /></div>
//             <div><img src="./images/client10.png" className="cli2" alt="Client 10" /></div>
//             <div><img src="./images/client11.png" className="cli3" alt="Client 11" /></div>
//             <div><img src="./images/client12.png" className="cli4" alt="Client 12" /></div>
//             <div><img src="./images/client13.png" className="cli5" alt="Client 13" /></div>
//             <div><img src="./images/client14.png" className="cli6" alt="Client 14" /></div>
//             <div><img src="./images/client15.png" className="cli7" alt="Client 15" /></div>
//             <div><img src="./images/client16.png" className="cli8" alt="Client 16" /></div>
//           </div>
//         </div>
//       </div>
//       <div onMouseMove={handleMouseMove}
//       onMouseUp={handleMouseUp}
//       onMouseLeave={() => setIsDragging(false)}  >
//       <div className="what">
//         <h1 className="heading what-head">
//           What <span className="highlight">We</span> do?
//         </h1>
//         <div className="what-main container">
//           <div className="whatWeDo-main container">
//             <div className="what-main-content1">
//               <p className="what-heading">
//                 We Ensure the best <span className="highlight whatWeDo-highlight">Support</span>
//               </p>
//               <p className="what-para">{currentContent}</p>
//             </div>
//             <div className="what-main-content2">
//               <img 
//                 src={currentImage} 
//                 className="what-img1" 
//                 alt="Dynamic Visual" 
//               />
//             </div>
//           </div>

//           {/* Different rendering for mobile vs desktop */}
//           {isMobile ? (
//             <div className="mobile-drag-container">
//               <div 
//                 className="mobile-drag-scroll" 
//                 ref={scrollContainerRef}
//                 onMouseEnter={() => setIsPaused(true)}
//                 onMouseLeave={() => setIsPaused(false)} >
//                 {dragItems.map((item, index) => (
//                   <div
//                     key={item.id}
//                     className={`mobile-drag-content ${index === activeIndex ? "active" : ""}`}
//                     onClick={() => handleItemClick(index)}
//                   >
//                     {item.name}
//                   </div>
//                 ))}
//               </div>
//             </div>
//           ) : (
//             <>
//               <div className="what-drag container-fluid">
//                 {dragItems.map((item, index) => (
//                   <div
//                     key={item.id}
//                     className={`drag-content ${index === activeIndex ? "active" : ""}`}
//                   >
//                     {item.name}
//                   </div>
//                 ))}
//               </div>
//               <div className="container whatWeDoDragContainer">
//                 <p className="drag-line"></p>
//                 <img
//                   src="./images/A_logo.png"
//                   className="drag-img"
//                   alt="Logo"
//                   onMouseDown={handleMouseDown}
//                   onMouseUp={handleMouseUp}
//                   onMouseEnter={() => setIsPaused(true)}
//                   onMouseLeave={() => setIsPaused(false)}
//                   style={{
//                     position: "absolute",
//                     left: `calc(${logoPosition}% - 30px)`,
//                     transition: isDragging ? "none" : "all 0.5s ease-in-out",
//                     cursor: isDragging ? "grabbing" : "grab",
//                   }}
//                 />
//               </div>
//             </>
//           )} 
//         </div>
//       </div>
//     </div>

    
//       {/* What we acheieved section in a1homeOdo.jsx file  */}
//       <Odo />
//       {/* Prime advertising spots in a2home.jsx file  */}
//       <AdinnHome2 />
//       {/* Our highlights and OOH Insights in a3home.jsx file  */}
//       <AdinnHome3 />
//       {/*Frequently asked question and footer in a4home.jsx file  */}
//       <AdinnHome4 />




//     </div>


//     </MainLayout>

//   )
// }

// export default AdinnHome;









// CHANGED CONTENTS
import React, { useState, useEffect, useRef } from 'react';
import Odometer from "odometer"; // Import the Odometer library directly
import "odometer/themes/odometer-theme-default.css"; // Odometer styles
import Odo from '../components/a1homeOdo';
import AdinnHome2 from '../components/a2home';
import AdinnHome3 from '../components/a3home';
import AdinnHome4 from '../components/a4home';
import './a1home.css';
import { useNavigate } from 'react-router-dom';
import LoginPageMain from './C1LoginMain';
import MainNavbar from './A1NAVBAR.jsx';
import MainFooter from './A1FOOTER.jsx';
import { MainLayout } from './MainLayout';
import Splash from './splashCursor.jsx';
// import ScrollHero from './ScrollHero.jsx';
import ScrollHero from './ScrollHero.jsx';  //thendral added



function AdinnHome() {
 // WHAT WE DO SECTION
  const [logoPosition, setLogoPosition] = useState(8.5); // Start at 9%
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false); // State to pause animation
  const [isDragging, setIsDragging] = useState(false); // State to track dragging
  const [dragStartX, setDragStartX] = useState(0); // X-coordinate during drag

const [isMobile, setIsMobile] = useState(window.innerWidth <= 480);
  const scrollContainerRef = useRef(null);


  const dragItems = [
    { id: 1, name: "Immersive 3D & Precision Cut-Outs", image: "./images/what1.png", content: 'It is our firm belief that attention is the first step to success. We don’t just put your brand on a hoarding. We make sure it stands out and gets noticed. Our bold designs, smart placements and cutting edge 3D immersive displays transform ordinary cityscapes into extraordinary brand experiences. With igniting visuals, strategic ideas and interactive elements, we elevate your brand to grab attention, spark curiosity and leave a lasting impression in the minds of your audience.' },
    { id: 2, name: "Dynamic Advertising", image: "./images/what2.png", content: "Dynamic advertising uses digital technologies to change content in real time displays such as digital billboards. Messages can be updated instantly, allowing advertisers to deliver timely, targeted and engaging content to their audience. " },
    { id: 3, name: "Geo Targeting", image: "./images/what3.png", content: "Geo Targeting makes your Ads more effective by placing in a specific location where your audience lives, work and  travels . It enhances your brand visibility in an effective way and is impactful locally with the right people where they are" },
    { id: 4, name: "Traditional", image: "./images/what4.png", content: "We provide high impactful Traditional ads through Billboards, Transit Media and Hoardings etc. We help your brand get noticed among the right people with the right placements. From Idea to Execution , we make sure your ads are clear and effective." },
    { id: 6, name: "Wall Painting", image: "./images/what6.png", content: "Adinn Outdoor creates stunning wall ads in key locations to boost your brand clarity. Our Wall paintings help you to connect with local audiences in a powerful way like allowing brands to reflect their unique identity by telling a story in an artistic way and make a long lasting impression." },
    { id: 7, name: "Dynamic Lighting", image: "./images/what7.png", content: "Dynamic Lighting solutions make your ads stand out with moving lights, colour effects and we turn static visuals into eye catching experiences. It is perfect for events, billboards and building facades that grabs attention and enhances brand impact." },
  ];

  const [currentImage, setCurrentImage] = useState(dragItems[0].image);
  const [currentContent, setCurrentContent] = useState(dragItems[0].content);


// Check screen size on resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 480);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

 // Auto-scroll for mobile
  useEffect(() => {
    if (!isMobile || isPaused || isDragging) return;
    
    const interval = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % dragItems.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [isMobile, isPaused, isDragging, dragItems.length]);

  // Scroll to active item on mobile
  useEffect(() => {
    if (!isMobile || !scrollContainerRef.current) return;
    
    const container = scrollContainerRef.current;
    const activeItem = container.children[activeIndex];
    
    if (activeItem) {
      const containerWidth = container.offsetWidth;
      const itemWidth = activeItem.offsetWidth;
      const itemOffset = activeItem.offsetLeft;
      const scrollPosition = itemOffset - (containerWidth / 2) + (itemWidth / 2);
      
      container.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      });
    }
  }, [activeIndex, isMobile]);

  
  // Automatic movement
  useEffect(() => {
    if (isPaused || isDragging) return;

    const interval = setInterval(() => {
      setLogoPosition((prev) => {
        if (prev >= 92) return 8.5; // Reset to start
        return prev + 14; // Move forward
      });
    }, 2000); // Adjust speed as needed

    return () => clearInterval(interval);
  }, [isMobile, isPaused, isDragging, dragItems.length]);

  // Update content based on active index or logo position
  useEffect(() => {
    if (isMobile) {
      setCurrentImage(dragItems[activeIndex].image);
      setCurrentContent(dragItems[activeIndex].content);
    } else {
      const index = Math.floor((logoPosition - 8.5) / ((92 - 8.5) / (dragItems.length - 1)));
      const newIndex = Math.min(index, dragItems.length - 1);
      setActiveIndex(newIndex);
      setCurrentImage(dragItems[newIndex].image);
      setCurrentContent(dragItems[newIndex].content);
    }
  }, [logoPosition, activeIndex, isMobile]);



  // Handle drag start
  const handleMouseDown = (e) => {
     if (isMobile) return;
    setIsDragging(true);
    setIsPaused(true); // Pause auto movement
    setDragStartX(e.clientX);
  };

  // Handle drag movement
  const handleMouseMove = (e) => {
    if (!isDragging || isMobile) return;

    const deltaX = e.clientX - dragStartX;
    const deltaPercentage = (deltaX / window.innerWidth) * 100;

    setLogoPosition((prev) => {
      const newPos = prev + deltaPercentage;
      // Ensure the position stays within bounds (9% to 92%)
      return Math.max(8.5, Math.min(92, newPos));
    });

    setDragStartX(e.clientX); // Update start position
  };

  // Handle drag end
  const handleMouseUp = () => {

     if (isMobile) return;
    setIsDragging(false);
    setIsPaused(false); // Resume auto movement
  };
 // Mobile item click handler
  const handleItemClick = (index) => {
    if (!isMobile) return;
    setActiveIndex(index);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 5000);
  };

  const [isLoginOpen, setIsLoginOpen] = useState(false); // State to toggle Login 
  //Toggle LoginPage
  const toggleLoginPage = () => {
    setIsLoginOpen(!isLoginOpen);
  };
  const closeLoginPage = () => {
    setIsLoginOpen(false);
  };


  return (
    <MainLayout>
    <div>
 {/* <Splash/> */}
       <MainNavbar />
        {/* //thendral added */}
               <div className="scrollhero-wrapper">  
           {/* <ScrollHero /> */}
           <ScrollHero />
       </div>
       
      {/* About us content  */}
      <div className='about about-desktop container-fluid' style={{padding: '100px 20px'}}>
        <div className='heading about-heading about-mobile-heading'>About <span className='highlight'>Us</span></div>
        <div className='about-content'>
          <div className='about-content1 about-mobile-content'>
            <div className='about-content1-heading'>Who <span className='highlight'>we</span> are </div>
            <div className='about-content-para'> Adinn Outdoor owns over 550 outdoor ad spaces across Tamil Nadu and extends even outside the state. Our media network spans diverse formats from billboards to police booths and we have successfully amplified brand visibility and achieved tangible results. We make sure your brand is visible to the right people at the ideal time. With 25 Years of Excellence , we know where to put your ads to get the most impact. If you want to reach more people and expand the visibility of your ads , we’re here to help. </div> 
     <div className='about-content-para about-content-para-last'><span className='highlight contactUs'>Contact Us</span>to take your brand to new heights at prime locations ,where visibility shines.</div>
          </div>
          <div className='about-content2 img-fluid desktop-only'>
            <img src='./images/road_gif.png'></img>
          </div>
        </div>
      </div>
 {/* //thendral added */}

      {/* Client section */}
      <div className="client">
        <h1 className="heading client-heading">
          Esteemed <span className="highlight">Clients</span>
        </h1>
        <div className='client-main'>
          <div className="client-content">
            {/* <!-- Original Set --> */}
            <div><img src="./images/client1.png" className="cli1" alt="Client 1" /></div>
            <div><img src="./images/client2.png" className="cli2" alt="Client 2" /></div>
            <div><img src="./images/client3.png" className="cli3" alt="Client 3" /></div>
            <div><img src="./images/client4.png" className="cli4" alt="Client 4" /></div>
            <div><img src="./images/client5.png" className="cli5" alt="Client 5" /></div>
            <div><img src="./images/client6.png" className="cli6" alt="Client 6" /></div>
            <div><img src="./images/client7.png" className="cli7" alt="Client 7" /></div>
            <div><img src="./images/client8.png" className="cli8" alt="Client 8" /></div>
            {/* <!-- Duplicate Set for Seamless Scrolling --> */}
            <div><img src="./images/client1.png" className="cli1" alt="Client 1" /></div>
            <div><img src="./images/client2.png" className="cli2" alt="Client 2" /></div>
            <div><img src="./images/client3.png" className="cli3" alt="Client 3" /></div>
            <div><img src="./images/client4.png" className="cli4" alt="Client 4" /></div>
            <div><img src="./images/client5.png" className="cli5" alt="Client 5" /></div>
            <div><img src="./images/client6.png" className="cli6" alt="Client 6" /></div>
            <div><img src="./images/client7.png" className="cli7" alt="Client 7" /></div>
            <div><img src="./images/client8.png" className="cli8" alt="Client 8" /></div>
          </div>

          {/* CLIENT ROW 2  */}
          <div className="client-content1">
            {/* <!-- Original Set --> */}
            <div><img src="./images/client9.png" className="cli1" alt="Client 9" /></div>
            <div><img src="./images/client10.png" className="cli2" alt="Client 10" /></div>
            <div><img src="./images/client11.png" className="cli3" alt="Client 11" /></div>
            <div><img src="./images/client12.png" className="cli4" alt="Client 12" /></div>
            <div><img src="./images/client13.png" className="cli5" alt="Client 13" /></div>
            <div><img src="./images/client14.png" className="cli6" alt="Client 14" /></div>
            <div><img src="./images/client15.png" className="cli7" alt="Client 15" /></div>
            <div><img src="./images/client16.png" className="cli8" alt="Client 16" /></div>
            {/* <!-- Duplicate Set for Seamless Scrolling --> */}
            <div><img src="./images/client9.png" className="cli1" alt="Client 9" /></div>
            <div><img src="./images/client10.png" className="cli2" alt="Client 10" /></div>
            <div><img src="./images/client11.png" className="cli3" alt="Client 11" /></div>
            <div><img src="./images/client12.png" className="cli4" alt="Client 12" /></div>
            <div><img src="./images/client13.png" className="cli5" alt="Client 13" /></div>
            <div><img src="./images/client14.png" className="cli6" alt="Client 14" /></div>
            <div><img src="./images/client15.png" className="cli7" alt="Client 15" /></div>
            <div><img src="./images/client16.png" className="cli8" alt="Client 16" /></div>
          </div>
        </div>
      </div>
      <div onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={() => setIsDragging(false)}  >
      <div className="what">
        <h1 className="heading what-head">
          What <span className="highlight">We</span> do?
        </h1>
        <div className="what-main container">
          <div className="whatWeDo-main container">
            <div className="what-main-content1">
              <p className="what-heading">
                We Ensure the best <span className="highlight whatWeDo-highlight">Support</span>
              </p>
              <p className="what-para">{currentContent}</p>
            </div>
            <div className="what-main-content2">
              <img 
                src={currentImage} 
                className="what-img1" 
                alt="Dynamic Visual" 
              />
            </div>
          </div>

          {/* Different rendering for mobile vs desktop */}
          {isMobile ? (
            <div className="mobile-drag-container">
              <div 
                className="mobile-drag-scroll" 
                ref={scrollContainerRef}
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)} >
                {dragItems.map((item, index) => (
                  <div
                    key={item.id}
                    className={`mobile-drag-content ${index === activeIndex ? "active" : ""}`}
                    onClick={() => handleItemClick(index)}
                  >
                    {item.name}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <>
              <div className="what-drag container-fluid">
                {dragItems.map((item, index) => (
                  <div
                    key={item.id}
                    className={`drag-content ${index === activeIndex ? "active" : ""}`}
                  >
                    {item.name}
                  </div>
                ))}
              </div>
              <div className="container whatWeDoDragContainer">
                <p className="drag-line"></p>
                <img
                  src="./images/A_logo.png"
                  className="drag-img"
                  alt="Logo"
                  onMouseDown={handleMouseDown}
                  onMouseUp={handleMouseUp}
                  onMouseEnter={() => setIsPaused(true)}
                  onMouseLeave={() => setIsPaused(false)}
                  style={{
                    position: "absolute",
                    left: `calc(${logoPosition}% - 30px)`,
                    transition: isDragging ? "none" : "all 0.5s ease-in-out",
                    cursor: isDragging ? "grabbing" : "grab",
                  }}
                />
              </div>
            </>
          )} 
        </div>
      </div>
    </div>

      {/* What we acheieved section in a1homeOdo.jsx file  */}
      <Odo />
      {/* Prime advertising spots in a2home.jsx file  */}
      <AdinnHome2 />
      {/* Our highlights and OOH Insights in a3home.jsx file  */}
      <AdinnHome3 />
      {/*Frequently asked question and footer in a4home.jsx file  */}
      <AdinnHome4 />




    </div>


    </MainLayout>

  )
}

export default AdinnHome;