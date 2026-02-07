import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HeroSection from './components/a0Hero'
import HeroSection1 from './components/a1Hero'
import HeroBanner from './components/HeroSectionMain.jsx';
import AdinnHome from './components/a1home'
import Calendar from './components/B20CalenderMain.jsx';
import BookASite from './components/B1book';
import BookASite1 from './components/B2book';
import Cart from './components/E1MyCart.jsx';
import MyOrder from './components/E2MyOrders.jsx';
import ThankyouPage from './components/E3Thankyou_pg.jsx';
import ThankyouPage1 from './components/E3Thankyou_Reserve.jsx';
import { SpotProvider } from "./components/B0SpotContext.jsx";
import Billing from './components/F1Billing.jsx';
import Billing1 from './components/F2BillingCart.jsx';
import Nav from './components/A1NAVBAR.jsx';
import Foot from './components/A1FOOTER.jsx';
import Admin from './Adminpanel/ad1.jsx';
import ProductManage from './Adminpanel/ad1File.jsx';
// LOGIN CONTEXT 
import { LoginProvider } from './components/LoginContext.jsx';
//SPLASH CURSOR
import Splash from './components/splashCursor.jsx';
import SplashText from './components/SPLASH_TEXT.jsx';
import NotFound from './components/404NOT_FOUND.jsx';
import CreativeAdminLogin from './components/CreativeLogin_UserAdmin.jsx';
import ProtectedRoute from './components/PROTECTED_ROUTE.jsx';
import { AdminAuthWrapper } from './Adminpanel/AdminAuthWrapper.jsx';
import EnquireUserTable from './Adminpanel/ad1EnquireUsers.jsx';
import PreLoader from './components/PreLoad.jsx';
//Rich Text 
import RichText from './Adminpanel/RichText.jsx';
//BLOG PAGE
import BlogPage from './components/G1BlogPage.jsx';
import BlogPageAdmin from './Adminpanel/ad2BlogAddPg.jsx';
//Deal of the Day
import DealOfTheDay from './components/H1DealDay.jsx';
//DEAL OF THE DAY SCROLL ANIMATION
import DealScrollAnimation from './components/H2DealScroll.jsx';
// Scroll to Top Component
import ScrollToTop from './SCROLL_TO_TOP.jsx';
//Police_Signal_PoleSizes
import Sizes from './Adminpanel/Police_Signal_PoleSizes.jsx';
/* Add toast message -SK */
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { loadZohoSalesIQ } from './utils/zohoSalesIQ.js';
import SalesIQTracker from './utils/SalesIQTracker.jsx';

/* Add toast message -SK */
function App() {
  const [load, upadateLoad] = useState(true); 
  useEffect(() => {
    loadZohoSalesIQ();
  }, []);

  

  
useEffect(() => {
  const timer = setTimeout(() => {
    upadateLoad(false);

    const initialLoader = document.getElementById("initial-loader");
    if (initialLoader) {
      initialLoader.remove();
    }
  }, 1000);

  return () => clearTimeout(timer);
}, []);

  return (
    <div>
      <ToastContainer position="top-right" autoClose={2000} />
      <SpotProvider>
        <LoginProvider>
          {/* <CartProvider> */}
           <SalesIQTracker />
          <Router>
            {/* <PreLoader load={load} /> */}
            {/* Scroll to Top Component - Add this */}
            <ScrollToTop />
            {/* <Navbar/> */}
            <Routes>
              {/* IF USER GIVE ANY WRONG / NOT FOUND THEN SHOW THIS PAGE  */}
              <Route path="*" element={<NotFound />} />
              <Route path="mainLoader" element={<PreLoader />} />

              {/* Hero Section  */}
              {/* <Route path="/" element={<HeroSection />} /> */}
              <Route path="/" element={<HeroBanner />} />
              <Route path="/hero" element={<HeroSection1 />} />
              {/* AboutUs Home section  */}
              {/* <Route path="/home" element={<AdinnHome />} /> */}
              <Route path="/rich" element={<RichText />} />
              {/* Book a site section  */}
              <Route path="/billboard-advertising-in-india" element={<BookASite />} />
              <Route path="/Product/:productId" element={<BookASite1 />} />
              {/* <Route path="/cart" element={<Cart />} /> */}
              <Route path="/order" element={<MyOrder />} />
              <Route path="/thankyou" element={<ThankyouPage />} />
              <Route path="/thank_you" element={<ThankyouPage1 />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/billing" element={<Billing />} />
              <Route path="/billing_cart" element={<Billing1 />} />
              <Route path="/nav" element={<Nav />} />
              <Route path="/foot" element={<Foot />} />
              <Route path="/HeroBanner" element={<HeroBanner />} />
              <Route path="/Blog/:id" element={<BlogPage />} />
              <Route path="/Blogadmin" element={<BlogPageAdmin />} />
              <Route path="/Rich" element={<RichText />} />
              <Route path='/deal' element={<DealOfTheDay />} />
              <Route path='/DealScroll' element={<DealScrollAnimation />} />

              {/* Protected Admin Routes */}
              <Route path="/admin" element={
                <ProtectedRoute adminOnly>
                  <AdminAuthWrapper>

                    <Admin />
                  </AdminAuthWrapper>

                </ProtectedRoute>
              } />
              <Route path="/manageProducts" element={
                <ProtectedRoute adminOnly>
                  <AdminAuthWrapper>

                    <ProductManage />
                  </AdminAuthWrapper>

                </ProtectedRoute>
              } /> 

              
{/* //ADD LOADING STATES WHEN LOGIN / SIGNUP */}
<Route 
    path="/billing" 
    element={
        <ProtectedRoute requireLogin={true}>
            <Billing />
        </ProtectedRoute>
    } 
/>

<Route 
    path="/thank_you" 
    element={
        <ProtectedRoute requireLogin={true}>
            <ThankyouPage1 />
        </ProtectedRoute>
    } 
/>
{/* //ADD LOADING STATES WHEN LOGIN / SIGNUP */}





              <Route path="/splash" element={<Splash />} />
              <Route path="/splashText" element={<SplashText />} />
              <Route path="/404" element={<NotFound />} />
              <Route path="/Sizes" element={<Sizes />} />


              {/* LOGIN FOR ADMIN AND USER   */}
              {/* <Route path="/adminLogin" element={<CreativeAdminLogin />} /> */}

              <Route path="/adminLogin" element={
                <AdminAuthWrapper>
                  <CreativeAdminLogin />
                </AdminAuthWrapper>} />
              <Route path="/enquire" element={<EnquireUserTable />} />

            </Routes>
          </Router>
          {/* </CartProvider> */}
        </LoginProvider>
      </SpotProvider>
    </div>

  )
} 
export default App;