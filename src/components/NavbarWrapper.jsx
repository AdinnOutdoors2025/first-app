// NavbarWrapper.jsx
import React, { useState, useEffect } from 'react';
import MainNavbar from './A1NAVBAR.jsx'; // Desktop navbar
import A1NAVBARHEROMOBILE from './A1NAVBARHEROMOBILE'; // Mobile navbar

const NavbarWrapper = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      {isMobile ? <A1NAVBARHEROMOBILE /> : <MainNavbar />}
    </>
  );
};

export default NavbarWrapper;
