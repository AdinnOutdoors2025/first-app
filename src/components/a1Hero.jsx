import React, { useState } from 'react';
import './a1Hero.css';
import { useNavigate } from 'react-router-dom';
import LoginPageMain from './C1LoginMain';
import MainNavbar from './A1NAVBAR.jsx';
// import MainFooter from './A1FOOTER.jsx';
import { MainLayout } from './MainLayout';

function HeroSection1() {
    const [isMenuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!isMenuOpen);
    };
    //Nav_user toggle section
    const [isOpen, setIsOpen] = useState(false);

    const toggleNavOpen = () => {
        setIsOpen(!isOpen);
    };
    const [isLoginOpen, setIsLoginOpen] = useState(false); // State to toggle Login 
    //Toggle LoginPage
    const toggleLoginPage = () => {
        setIsLoginOpen(!isLoginOpen);
    };
    const closeLoginPage = () => {
        setIsLoginOpen(false);
    };



    //If i click the orders, signup or login then go the login page
    const navigate = useNavigate();

    return ( 
<MainLayout>
        <div className="navbar-main1">
          
            <MainNavbar />
            <div className="laptop-main">
                <img src="./images/img1.png" className="lap-main img1" alt="Image 1" />
                <img src="./images/img2.png" className="lap-main img2" alt="Image 2" />
                <img src="./images/img3.png" className="lap-main img3" alt="Image 3" />
                <img src="./images/img4.png" className="lap-main img4" alt="Image 4" />
                <center>
                    <img src="./images/laptop.png" className="laptop-img1" alt="Laptop" />
                </center>
            </div>
            {/* <MainFooter /> */}
        </div>
        </MainLayout>
    );
}

export default HeroSection1;

