import React from 'react';
// import './App.css'; // Assuming you have a CSS file for styling
import './one.css';

function Apps() {
    return (
        <div className="App">
            <header className="App-header">
                <div className="logo">
                    <img src="./images/adinn_logo.png" alt="Ad inn' Outdoors" />
                </div>
                <nav className="App-nav">
                    <button className="contact-button">Contact us</button>
                    <button className="book-button">Book a site</button>
                </nav>
            </header>
            <main className="App-main">
                <div className="billboards">
                    <img src="./images/img1.png" alt="Billboard 1" />
                    <img src="billboard2.png" alt="Billboard 2" />
                    <img src="billboard3.png" alt="Billboard 3" />
                    <img src="billboard4.png" alt="Billboard 4" />
                </div>
                <div className="main-text">
                    <h1>One <span className="highlight">Stop</span> Shop for all your <span className="highlight">Brand Promotion</span> Needs</h1>
                    <button className="book-button">Book a site</button>
                </div>
            </main>
        </div>
    );
}

export default Apps;
