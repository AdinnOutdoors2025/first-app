import React, { useState } from 'react';
import './E3Thankyou_pg.css';
import { useNavigate, useLocation } from 'react-router-dom';
import LoginPageMain from './C1LoginMain';
import MainNavbar from './A1NAVBAR.jsx';
import MainFooter from './A1FOOTER.jsx';
//the mainLayout for login toggle then background gets blurred 
import { MainLayout } from './MainLayout';

function ThankyouPage() {

  // Navbar js 
  const [isMenuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };
  //Nav_user toggle section
  const [isOpen, setIsOpen] = useState(false);

  const toggleNavOpen = () => {
    setIsOpen(!isOpen);
  };
  // NAVIGATE    //If i click the orders, signup or login then go the login page
  const navigate = useNavigate();
  const [isLoginOpen, setIsLoginOpen] = useState(false); // State to toggle Login 
  //Toggle LoginPage
  const toggleLoginPage = () => {
    setIsLoginOpen(!isLoginOpen);
  };
  const closeLoginPage = () => {
    setIsLoginOpen(false);
  }
  const thankItems = [
    { id: 1, thankImg: './images/spot1.png', thankTitle: "Adayar L B Road towards Thiruvanmiyur", thankAmount: 41580, thankDays: 5 },
    { id: 2, thankImg: './images/spot1.png', thankTitle: "Adayar L B Road towards Thiruvanmiyur", thankAmount: 10655, thankDays: 5 },
  ]




  const location = useLocation();
  const { billingInfo, cartItems, subTotal, TotalPrice, totalItems, orderId } = location.state || {};

  // if (!billingInfo || !cartItems) {
  //   return <div>No order details found!</div>;
  // }

  return (
            <MainLayout>

    <div>
      <MainNavbar />

      {/* Thankyou page content  */}
      <div className='thankyou_pgMain1'>
        <div className='thankyou_contentMain1 container'>
          <div className='thank_left1'>
            <div className='thank-content11'> Thank You</div>
            <div className='thank-content21' style={{ paddingBottom: '10px' }}>Your order has been confirmed, <span>{billingInfo.name}</span>.</div>
            <div className='thank-content21'>We’ll reach out with further details soon.</div>
            {/* <span className='thank-content2 site-address1'>Site Address</span> */}
          </div>
          <div className='thank_right1'>
            <div className='thank_right-content1'>
              <div className='thank_order-content1'>
                <div className='thank_orderDetails1 orderDetails11'>Order Number
                  <span className='thank_orderDetailsCode1'> {orderId}</span></div>
                <div className='thank_orderDetails1 orderDetails21'>Date<br></br>
                  {new Date().toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                  })}</div>
                <div className='thank_orderDetails1 orderDetails31'>Payment Method Upi</div>
              </div>
              <div className="ThankScrollContent1">

                {
                  cartItems.map(
                    (item, index) =>
                      <div className='thank_item-content1' key={index}>
                        <div className='thank_item-contentDetails11'>
                          <img src={item.image} className='thank_item-img1'></img>
                        </div>
                        <div className='thank_item-contentDetails21' >
                          <span className='thank-item-heading1'>{item.prodName}</span><br></br>
                          <span>₹ {item.totalAmount}</span><br></br>
                          <span>{item.totalDays} days</span><br></br>
                        </div>
                      </div>

                  )
                }
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Footer section */}
      <MainFooter />
    </div>
            </MainLayout>
  )
}
export default ThankyouPage;
