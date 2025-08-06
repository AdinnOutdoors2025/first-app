import React, { createContext, useState, useEffect } from 'react';
import './ad1.css'; // Import CSS for styling
import PieSection from './ad1Pie';
import Products from './ad1products';
import ADManage from './ad1Manage';
import OrdersTable from './ad1Orders';
import ImageUploadPage from './ad1File';
import CategorySection from './ad1Category';
import MediaTypeSection from './ad1MediaType';
import { useLocation } from 'react-router-dom';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import OrderDetails from './ad1OrderDetails';
import { useLogin } from '../components/LoginContext';
import EnquireUsers from '../Adminpanel/ad1EnquireUsers';
//Blog page
import AllBlogPg from './ad2BlogsPg';
import BlogAddPg from './ad2BlogAddPg';

// export const CategoryContext = createContext();
function AdminpanelHome() {

  const { logoutUser } = useLogin();
  const [isAdminDropdownOpen, setIsAdminDropdownOpen] = useState(false);

  const toggleAdminDropdown = () => {
    setIsAdminDropdownOpen(!isAdminDropdownOpen);
  };
  const [activeMenu, setActiveMenu] = useState('dashboard'); // default active

  const [activeSubCategory, setActiveSubCategory] = useState(''); // default active
  const [activeSubProduct, setActiveSubProduct] = useState(''); // default active
  const [activeSubOrder, setActiveSubOrder] = useState(''); // default active
  const [activeEnquiryUsers, setActiveEnquiryUsers] = useState(''); // default active

  const [activeBlogPage, setActiveBlogPage] = useState(''); // default active

  const handleMenuClick = (menu) => {
    if (activeMenu === menu) {
      setActiveMenu('');
      setActiveSubCategory('');
      setActiveSubProduct('');
      setActiveSubOrder('');
      setActiveEnquiryUsers('');
      setActiveBlogPage('');

    } else {
      setActiveMenu(menu);
      if (menu === 'category') {
        setActiveSubCategory('location'); // 👈 default subcategory when category menu is opened
        setActiveSubProduct('');
        setActiveSubOrder('');
        setActiveEnquiryUsers('');
        setActiveBlogPage('');


      }
      else if (menu === 'admanager') {
        setActiveSubProduct('All Products'); // 👈 default subcategory when admanager menu is opened
        setActiveSubCategory('');
        setActiveSubOrder('');
        setActiveEnquiryUsers('');
        setActiveBlogPage('');

      }

      else if (menu === 'orders') {
        setActiveSubOrder('All Orders'); // 👈 default subcategory when orders menu is opened
        setActiveSubCategory('');
        setActiveSubProduct('');
        setActiveEnquiryUsers('');
        setActiveBlogPage('');

      }
      else if (menu === 'EnquireUsers') {
        setActiveEnquiryUsers('All Enquiries'); // 👈 default subcategory when orders menu is opened
        setActiveSubOrder('');
        setActiveSubCategory('');
        setActiveSubProduct('');
        setActiveBlogPage('');


      }
      else if (menu === 'BlogPage') {
        setActiveBlogPage('All Blogs'); // 👈 default subcategory when orders menu is opened
        setActiveSubOrder('');
        setActiveSubCategory('');
        setActiveSubProduct('');
        setActiveEnquiryUsers('');
      }
      else {
        setActiveSubCategory('');
        setActiveSubProduct('');
        setActiveSubOrder('');
        setActiveEnquiryUsers('');
        setActiveBlogPage('');
      }
    }
  };

  const [isProductFilterOpen, setIsProductFilterOpen] = useState(false);

  const toggleproductFilter = () => {
    setIsProductFilterOpen(!isProductFilterOpen);
  };

  //pie chart
  const [hoveredWeek, setHoveredWeek] = useState(null);
  const data = [
    { name: 'Week 1', value: 5000 },
    { name: 'Week 2', value: 10000 },
    { name: 'Week 3', value: 4000 },
    { name: 'Week 4', value: 6000 },
  ];
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const dashboardSummary = [
    { id: 1, icons: './images/dashboard-icon1.svg', summaryHeading: 'Total Sites Added', summaryCount: 13000 },
    { id: 2, icons: './images/dashboard-icon2.svg', summaryHeading: 'Total Reservations', summaryCount: 8000 },

    { id: 3, icons: './images/dashboard-icon5.svg', summaryHeading: 'Total Users', summaryCount: 8000 },

    { id: 4, icons: './images/dashboard-icon3.svg', summaryHeading: 'Total Revenue', summaryCount: 800105 },

    { id: 5, icons: './images/dashboard-icon4.svg', summaryHeading: 'Total Enquiries', summaryCount: 500 },

    { id: 6, icons: './images/dashboard-icon6.svg', summaryHeading: 'Booked Sites', summaryCount: 5000 }
  ]
  //edit product page automatically opens
  const location = useLocation();
  const [editProduct, setEditProduct] = useState(null);

  useEffect(() => {
    if (location.hash) {
      const sectionId = location.hash.replace('#', '');
      setActiveMenu(sectionId); // activates sidebar + section
      const element = document.getElementById(sectionId);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100); // wait for render
      }
    }

    if (location.state?.editProduct) {
      setEditProduct(location.state.editProduct);
      setActiveMenu('admanager'); // ✅ Automatically open 'admanager' section
      // setActiveSubProduct('Add Products'); // ✅ Make "Add Products" tab active
      setActiveSubProduct(location.state.activeSubProduct || 'Add Products'); // 👈 This line sets tab to Add Products

      setTimeout(() => {
        const element = document.getElementById('admanager');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
      // Clear location.state after using it (so it doesn't persist)
      window.history.replaceState({}, document.title, location.pathname + location.hash);

    }
  }, [location]);

  const isEditing = !!editProduct;





  //Order Info page automatically opens
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    // Check for order details in location state
    if (location.state?.order) {
      setOrderDetails(location.state.order);

      // Activate the orders menu and Order Info tab
      setActiveMenu(location.state.activeMenu || 'orders');
      setActiveSubOrder(location.state.activeSubOrder || 'Order Info');

      // Scroll to the order details section if needed
      setTimeout(() => {
        const element = document.getElementById('orderDetailsPg');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);

      // Clear the state to prevent re-triggering
      window.history.replaceState({}, document.title, location.pathname + location.hash);
    }
  }, [location.state]);












    const [editBlog, setEditBlog] = useState(null);

  useEffect(() => {
    // if (location.hash) {
    //   const sectionId = location.hash.replace('#', '');
    //   setActiveMenu(sectionId); // activates sidebar + section
    //   const element = document.getElementById(sectionId);
    //   if (element) {
    //     setTimeout(() => {
    //       element.scrollIntoView({ behavior: 'smooth' });
    //     }, 100); // wait for render
    //   }
    // }

    if (location.state?.editBlog) {
      setEditBlog(location.state.editBlog);
      setActiveMenu('BlogPage'); // ✅ Automatically open 'EditBlogPage' section
      // setActiveSubBlog('Add Blogs'); // ✅ Make "Add Blogs" tab active
      setActiveBlogPage(location.state.activeSubBlog || 'Add Blogs'); // 👈 This line sets tab to Add Blogs

      setTimeout(() => {
        const element = document.getElementById('EditBlogPage');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
      // Clear location.state after using it (so it doesn't persist)
      window.history.replaceState({}, document.title, location.pathname + location.hash);

    }
  }, [location]);




  const isEditingBlog = !!editBlog;








  //EDIT ORDERS page automatically opens
  // const [editOrder, setEditOrder] = useState(null);

  // useEffect(() => {
  //   // Check for order details in location state
  //   if (location.state?.editOrder) {
  //     setEditOrder(location.state.order);

  //     // Activate the orders menu and Order Info tab
  //     setActiveMenu(location.state.activeMenu || 'orders');
  //     setActiveSubOrder(location.state.activeSubOrder || 'Add Orders');

  //     // Scroll to the order details section if needed
  //     setTimeout(() => {
  //       const element = document.getElementById('manageOrderEdit');
  //       if (element) {
  //         element.scrollIntoView({ behavior: 'smooth' });
  //       }
  //     }, 100);

  //     // Clear the state to prevent re-triggering
  //     window.history.replaceState({}, document.title, location.pathname + location.hash);
  //   }
  // }, [location.state]);



// //EDIT BLOG THEN AUTOMATICALLY OPEN THE ADD BLOG PAGE 
//   const [editBlog, setEditBlog] = useState(null);

//   useEffect(() => {
//     if (location.hash) {
//       const sectionId = location.hash.replace('#', '');
//       setActiveMenu(sectionId); // activates sidebar + section
//       const element = document.getElementById(sectionId);
//       if (element) {
//         setTimeout(() => {
//           element.scrollIntoView({ behavior: 'smooth' });
//         }, 100); // wait for render
//       }
//     }

//     if (location.state?.editBlog) {
//       setEditBlog(location.state.editBlog);
//       setActiveMenu('BlogPage'); // ✅ Automatically open 'BlogPage' section
//       // setActiveBlogPage('Add Blogs'); // ✅ Make "Add Blogs" tab active
//       setActiveBlogPage(location.state.activeBlogPage || 'Add Blogs'); // 👈 This line sets tab to Add Blogs

//       setTimeout(() => {
//         const element = document.getElementById('EditBlogPage');
//         if (element) {
//           element.scrollIntoView({ behavior: 'smooth' });
//         }
//       }, 100);
//       // Clear location.state after using it (so it doesn't persist)
//       window.history.replaceState({}, document.title, location.pathname + location.hash);

//     }
//   }, [location]);

//   const isEditingBlog = !!editBlog;





  return (

    <div>
      {/* Navbar for Admin  */}
      <div>
        <nav className="container-fluid Admin-navbar">
          {/* Left - Logo */}
          <div className="Admin-navbar-logo">
            <img src="./images/adinn_logo.png" alt="AdinnOutdoors" />
          </div>

          {/* Center - Search */}
          {/* <div className="Admin-navbar-search">
              <i className="fas fa-search search-icon Admin-search-icon"></i>
              <input type="text" placeholder="Search..." className='Admin-search-name' />
            </div> */}

          {/* Right - Notifications & Profile */}
          <div className="Admin-navbar-right">
            <div className="Admin-notification-icon">
              <img src='./images/notification-bell.svg' className='notification-bell'></img>
              <span className="Admin-notification-badge">10</span>
            </div>

            <div className="Admin-profile" onClick={toggleAdminDropdown}>
              <img src="./images/admin-proficPic.svg" alt="User" className="Admin-profile-img" />
              <span className="Admin-profile-name">Arjun Prakash</span>
              <i className={`fas fa-chevron-${isAdminDropdownOpen ? "up" : "down"} Admin-profile-downUp`}></i>
            </div>
            {isAdminDropdownOpen && (
              <div className="Admin-dropdown-menu">
                <ul>
                  <li>Profile</li>
                  <li>Settings</li>
                  {/* <li>Logout</li> */}
                  <li onClick={() => {
                    logoutUser();
                    window.location.href = '/adminLogin'; // Force full page reload
                  }}>Logout</li>
                </ul>
              </div>
            )}
          </div>
        </nav>

      </div>
      {/* Sidebar with admin panel content section  */}
      <div className='AdminPanelHome-content d-flex'>
        {/* LEFT CONTENT  */}
        <div className='AdminPanelHome-contentLeft'>
          {/* DASHBOARD SECTION WITH CHARTS  */}
          <div className={`adminHeadings ${activeMenu === 'dashboard' ? 'active' : ''}`}
            onClick={() => handleMenuClick('dashboard')}  >
            <div className='sideImageHeading'>
              <svg xmlns="http://www.w3.org/2000/svg" className='adminHeading-imgs' viewBox="0 0 31 31" fill={activeMenu === 'dashboard' ? 'black' : 'rgba(227, 31, 37, 1)'}>
                <path d="M20.1246 17.1054L28.8742 17.1795C29.2284 17.1825 29.5243 17.3048 29.7618 17.5464C29.9993 17.788 30.1166 18.0859 30.1136 18.44L30.0183 29.6896C30.0153 30.0438 29.893 30.3396 29.6514 30.5772C29.4098 30.8147 29.1119 30.932 28.7578 30.929L20.0081 30.8549C19.6539 30.8519 19.3581 30.7296 19.1206 30.488C18.883 30.2464 18.7657 29.9485 18.7687 29.5943L18.864 18.3447C18.867 17.9906 18.9893 17.6947 19.2309 17.4572C19.4725 17.2196 19.7704 17.1024 20.1246 17.1054ZM15.2624 0.813609L29.0119 0.930071C29.366 0.933071 29.6619 1.05537 29.8994 1.29698C30.137 1.53858 30.2543 1.83646 30.2513 2.19061L30.156 13.4402C30.153 13.7944 30.0307 14.0902 29.7891 14.3278C29.5475 14.5653 29.2496 14.6826 28.8954 14.6796L15.1459 14.5631C14.7918 14.5601 14.4959 14.4378 14.2584 14.1962C14.0208 13.9546 13.9035 13.6567 13.9065 13.3026L14.0018 2.05298C14.0048 1.69882 14.1271 1.40297 14.3687 1.16543C14.6103 0.927882 14.9082 0.810609 15.2624 0.813609ZM1.37523 16.9466L15.1247 17.063C15.4789 17.066 15.7747 17.1883 16.0123 17.4299C16.2498 17.6715 16.3671 17.9694 16.3641 18.3236L16.2688 29.5732C16.2658 29.9273 16.1435 30.2232 15.9019 30.4607C15.6603 30.6983 15.3624 30.8155 15.0083 30.8125L1.25877 30.6961C0.904618 30.6931 0.608768 30.5708 0.371222 30.3292C0.133678 30.0876 0.0164036 29.7897 0.0194034 29.4355L0.114691 18.1859C0.117691 17.8318 0.239994 17.5359 0.481596 17.2984C0.723201 17.0608 1.02108 16.9436 1.37523 16.9466ZM1.51287 0.697146L10.2626 0.771259C10.6167 0.774259 10.9126 0.896561 11.1501 1.13816C11.3877 1.37977 11.5049 1.67765 11.5019 2.0318L11.4066 13.2814C11.4036 13.6356 11.2813 13.9314 11.0397 14.1689C10.7981 14.4065 10.5003 14.5238 10.1461 14.5208L1.39641 14.4467C1.04226 14.4437 0.746405 14.3214 0.508859 14.0797C0.271315 13.8381 0.154041 13.5403 0.157041 13.1861L0.252328 1.93651C0.255328 1.58236 0.377631 1.28651 0.619234 1.04896C0.860838 0.81142 1.15872 0.694147 1.51287 0.697146ZM16.4912 3.32411L16.417 12.0738L27.6666 12.1691L27.7408 3.41939L16.4912 3.32411ZM2.60401 19.4571L2.5299 28.2067L13.7795 28.302L13.8536 19.5523L2.60401 19.4571ZM21.3533 19.6159L21.2792 28.3656L27.529 28.4185L27.6031 19.6688L21.3533 19.6159ZM2.74165 3.20764L2.66754 11.9573L8.91732 12.0103L8.99143 3.26058L2.74165 3.20764Z" />
              </svg>Dashboard
            </div>
            <i className={`fas fa-chevron-${activeMenu === 'dashboard' ? "up" : "down"} ml-2`}></i>
          </div>

          {/* ADMANAGER WITH DRAG & DROP IMAGE SECTION  */}
          <div className={`adminHeadings ${activeMenu === 'admanager' ? 'active' : ''}`}
            onClick={() => handleMenuClick('admanager')}>
            <div className='sideImageHeading'>
              {/* <svg xmlns="http://www.w3.org/2000/svg" className='adminHeading-imgs' viewBox="0 0 39 30" fill="currentColor">
                <path d="M6.76016 0.5H32.8769C34.5025 0.5 35.9833 1.13712 37.0594 2.15092C38.1442 3.17262 38.8184 4.58016 38.8184 6.10764V23.8924C38.8184 25.4164 38.1374 26.8209 37.0545 27.84C35.9728 28.8591 34.4872 29.5 32.8769 29.5H6.76016C5.14635 29.5 3.65582 28.8656 2.57252 27.8446C1.49531 26.8305 0.818359 25.4317 0.818359 23.8924V6.10764C0.818359 4.56534 1.48841 3.16277 2.5677 2.14638C3.64617 1.13062 5.13054 0.5 6.76016 0.5ZM25.0722 19.9679H20.9728V9.93344H25.0306C26.1268 9.93344 27.0742 10.1331 27.875 10.5334C28.6732 10.9335 29.2913 11.5084 29.7254 12.2579C30.16 13.0074 30.3802 13.9065 30.3802 14.9507C30.3802 15.9967 30.1629 16.8935 29.7283 17.6431C29.2961 18.3929 28.6808 18.9678 27.8871 19.3676C27.0936 19.7678 26.1538 19.9679 25.0722 19.9679ZM12.3794 19.9679H9.25696L12.7749 9.93344H16.7279L20.2439 19.9679H17.1234L16.5078 18.0478H12.9946L12.3794 19.9679ZM15.8539 16.0085L14.7919 12.6972H14.7089L13.6482 16.0085H15.8539ZM23.8659 17.6548H24.9694C25.4971 17.6548 25.9462 17.5766 26.3196 17.4156C26.6909 17.2546 26.9763 16.9786 27.1718 16.5879C27.3669 16.1945 27.4649 15.6496 27.4649 14.9507C27.4649 14.2517 27.3669 13.7068 27.167 13.3157C26.9666 12.9223 26.6763 12.6467 26.2929 12.4857C25.9095 12.327 25.4407 12.2465 24.8867 12.2465H23.8659V17.6548ZM32.8769 2.82977H6.76016C5.79502 2.82977 4.92013 3.19925 4.2892 3.79346C3.65864 4.38724 3.26713 5.20665 3.26713 6.10764V23.8924C3.26713 24.7877 3.66346 25.604 4.29402 26.1975C4.9306 26.7974 5.80831 27.1702 6.76016 27.1702H32.8769C33.8228 27.1702 34.6964 26.7928 35.333 26.1929C35.9692 25.5942 36.3696 24.7752 36.3696 23.8924V6.10764C36.3696 5.21917 35.974 4.39717 35.3379 3.798C34.7069 3.2038 33.8357 2.82977 32.8769 2.82977Z" fill={activeMenu === 'admanager' ? 'black' : 'rgba(227, 31, 37, 1)'} />
              </svg> */}
              <svg xmlns="http://www.w3.org/2000/svg" className='adminHeading-imgs' viewBox="0 0 39 36" fill="none">
                <mask id="path-1-inside-1_1763_293017" fill="white">
                  <path d="M10.4699 20.3596C10.3124 20.3596 10.1614 20.2964 10.0501 20.184C9.9387 20.0717 9.87615 19.9192 9.87615 19.7603C9.87615 19.6014 9.9387 19.4489 10.0501 19.3366C10.1614 19.2242 10.3124 19.161 10.4699 19.161H11.3327C11.8382 19.1514 12.3367 19.282 12.7738 19.5387C13.2586 19.8583 13.6038 20.353 13.7386 20.9213C13.7353 20.9287 13.7336 20.9367 13.7336 20.9448C13.7336 20.9528 13.7353 20.9608 13.7386 20.9682L13.8871 21.5924H14.2272V19.1267C14.228 18.9672 14.2912 18.8145 14.4029 18.7017C14.5147 18.5889 14.666 18.5252 14.8241 18.5243H17.9753C18.1333 18.5252 18.2846 18.5889 18.3964 18.7017C18.5082 18.8145 18.5713 18.9672 18.5721 19.1267V20.5905C18.8217 20.3358 19.1188 20.1334 19.4463 19.9952C19.7738 19.857 20.1252 19.7857 20.4802 19.7853C20.7967 19.7838 21.111 19.8399 21.4079 19.9507C21.8177 19.5109 22.3403 19.1944 22.9175 19.0361C23.4948 18.8778 24.1042 18.8841 24.6782 19.0541C25.2522 19.2241 25.7682 19.5513 26.1692 19.9994C26.5701 20.4474 26.8402 20.9988 26.9496 21.5924H27.0949C27.2502 21.5932 27.3988 21.6561 27.5084 21.7672C27.6179 21.8783 27.6794 22.0287 27.6794 22.1854C27.6777 22.2467 27.6683 22.3075 27.6515 22.3664L26.1053 28.6086C26.0757 28.739 26.0028 28.8553 25.8988 28.9382C25.7947 29.021 25.6658 29.0655 25.5332 29.0643H15.891C16.1012 29.8383 16.3146 30.269 16.5899 30.4625C16.9362 30.6904 17.5392 30.706 18.5474 30.6904H25.3786C25.5344 30.6904 25.6839 30.7529 25.7941 30.8641C25.9042 30.9753 25.9662 31.1261 25.9662 31.2834C25.9662 31.4407 25.9042 31.5915 25.7941 31.7027C25.6839 31.8139 25.5344 31.8764 25.3786 31.8764H18.5752C17.3382 31.8764 16.5558 31.8764 15.9404 31.4488C15.325 31.0212 14.9756 30.294 14.6447 28.9707L12.6222 21.2709C12.6222 21.2709 12.6222 21.2709 12.6222 21.2428C12.5953 21.1045 12.5415 20.9729 12.464 20.8556C12.3866 20.7383 12.2869 20.6376 12.1707 20.5593C11.9158 20.414 11.6251 20.3447 11.3327 20.3596H10.4699ZM36.2454 16.9263V33.4682C36.2446 34.0068 36.0323 34.5231 35.6549 34.904C35.2775 35.2848 34.7659 35.4992 34.2323 35.5H5.40447C5.13995 35.4995 4.87813 35.4463 4.63403 35.3435C4.38992 35.2406 4.16832 35.0902 3.98194 34.9007C3.79466 34.7125 3.64608 34.4887 3.54472 34.2424C3.44335 33.996 3.39121 33.7318 3.39128 33.465V16.9482C3.98997 17.0478 4.59728 17.0844 5.20346 17.0574V33.3152C5.20321 33.3616 5.2121 33.4076 5.22962 33.4504C5.24714 33.4933 5.27294 33.5322 5.30551 33.5649C5.33817 33.5972 5.37685 33.6227 5.41931 33.6398C5.46177 33.657 5.50718 33.6655 5.55291 33.6648H15.8786C15.9604 33.3536 16.1418 33.0784 16.3946 32.8819C16.6473 32.6855 16.9574 32.5789 17.2764 32.5787C17.5958 32.5787 17.9063 32.6852 18.1596 32.8816C18.4129 33.078 18.5948 33.3533 18.6773 33.6648H22.2181C22.2999 33.3536 22.4813 33.0784 22.7341 32.8819C22.9869 32.6855 23.2969 32.5789 23.6159 32.5787C23.9354 32.5782 24.2462 32.6845 24.4996 32.881C24.753 33.0775 24.9348 33.3531 25.0168 33.6648H34.0838C34.1765 33.6648 34.2654 33.6276 34.3309 33.5615C34.3965 33.4954 34.4333 33.4056 34.4333 33.3121V16.9794C35.0373 17.0299 35.645 17.0131 36.2454 16.9295V16.9263ZM22.0975 24.0144C22.1161 23.9184 22.1671 23.832 22.2418 23.7698C22.3166 23.7077 22.4104 23.6737 22.5072 23.6737C22.6041 23.6737 22.6979 23.7077 22.7727 23.7698C22.8474 23.832 22.8984 23.9184 22.917 24.0144V26.3084C22.8984 26.4043 22.8474 26.4907 22.7727 26.5529C22.6979 26.615 22.6041 26.649 22.5072 26.649C22.4104 26.649 22.3166 26.615 22.2418 26.5529C22.1671 26.4907 22.1161 26.4043 22.0975 26.3084V24.0144ZM19.6421 24.0144C19.6606 23.9184 19.7117 23.832 19.7864 23.7698C19.8612 23.7077 19.955 23.6737 20.0518 23.6737C20.1487 23.6737 20.2425 23.7077 20.3173 23.7698C20.392 23.832 20.443 23.9184 20.4616 24.0144V26.3084C20.443 26.4043 20.392 26.4907 20.3173 26.5529C20.2425 26.615 20.1487 26.649 20.0518 26.649C19.955 26.649 19.8612 26.615 19.7864 26.5529C19.7117 26.4907 19.6606 26.4043 19.6421 26.3084V24.0144ZM17.1898 24.0144C17.2083 23.9184 17.2594 23.832 17.3341 23.7698C17.4089 23.7077 17.5027 23.6737 17.5995 23.6737C17.6964 23.6737 17.7902 23.7077 17.865 23.7698C17.9397 23.832 17.9907 23.9184 18.0093 24.0144V26.3084C17.9907 26.4043 17.9397 26.4907 17.865 26.5529C17.7902 26.615 17.6964 26.649 17.5995 26.649C17.5027 26.649 17.4089 26.615 17.3341 26.5529C17.2594 26.4907 17.2083 26.4043 17.1898 26.3084V24.0144ZM22.2676 20.475C22.6071 20.7798 22.87 21.1618 23.0345 21.5893H25.9074C25.8135 21.2148 25.6253 20.8712 25.3611 20.5918C25.0969 20.3124 24.7656 20.1066 24.3993 19.9945C24.0331 19.8824 23.6444 19.8677 23.2709 19.9519C22.8974 20.0361 22.5518 20.2163 22.2676 20.475ZM23.2293 22.7753H14.2365L15.5755 27.8658H25.0786L26.3156 22.7753H23.2293ZM17.8887 21.5768C17.8887 21.5362 17.9227 21.4925 17.9413 21.4519V19.5605C17.9413 19.4447 17.8956 19.3335 17.8144 19.2516C17.7333 19.1696 17.6231 19.1236 17.5083 19.1236H15.3529C15.238 19.1236 15.1279 19.1696 15.0467 19.2516C14.9655 19.3335 14.9199 19.4447 14.9199 19.5605V21.5768H17.8887ZM33.6261 14.9819C33.2396 14.7978 32.2871 14.5481 31.9871 14.2484C31.7262 13.9828 31.5053 13.6799 31.3315 13.3496C31.1578 13.6799 30.9369 13.9828 30.676 14.2484C30.0142 14.9132 28.5112 15.3283 27.4938 15.3283C26.4764 15.3283 24.9735 14.9132 24.321 14.2484C24.06 13.9828 23.8392 13.6799 23.6654 13.3496C23.4916 13.6799 23.2707 13.9828 23.0098 14.2484C22.348 14.9132 20.8451 15.3283 19.8276 15.3283C18.8102 15.3283 17.3073 14.9132 16.6455 14.2484C16.378 13.9841 16.1508 13.6812 15.9714 13.3496C15.7976 13.6799 15.5767 13.9828 15.3158 14.2484C14.654 14.9132 13.151 15.3283 12.1336 15.3283C11.1162 15.3283 9.61329 14.9132 8.9515 14.2484C8.69058 13.9828 8.4697 13.6799 8.29591 13.3496C8.12212 13.6799 7.90123 13.9828 7.64031 14.2484C7.20427 14.6854 6.05697 15.0162 5.45085 15.1848C4.22934 15.3346 2.78826 15.1567 1.88217 14.2484C1.54395 13.9065 1.2759 13.5006 1.09335 13.0539C0.910809 12.6072 0.817363 12.1286 0.818367 11.6454V10.1973C0.819307 10.1253 0.837336 10.0547 0.870939 9.99126L3.44386 1.67353C3.65414 0.990012 4.17058 0.549938 5.16944 0.5H34.2663C35.1631 0.596754 35.7476 0.977528 35.9888 1.66729L38.772 9.97566C38.8073 10.0353 38.8275 10.1029 38.8307 10.1723C38.8322 10.1868 38.8322 10.2015 38.8307 10.216V11.6454C38.8305 12.1293 38.7356 12.6083 38.5515 13.055C38.3673 13.5017 38.0975 13.9073 37.7577 14.2484C36.6815 15.3346 35.0425 15.3065 33.6385 14.9819H33.6261Z" />
                </mask>
                <path d="M10.4699 20.3596C10.3124 20.3596 10.1614 20.2964 10.0501 20.184C9.9387 20.0717 9.87615 19.9192 9.87615 19.7603C9.87615 19.6014 9.9387 19.4489 10.0501 19.3366C10.1614 19.2242 10.3124 19.161 10.4699 19.161H11.3327C11.8382 19.1514 12.3367 19.282 12.7738 19.5387C13.2586 19.8583 13.6038 20.353 13.7386 20.9213C13.7353 20.9287 13.7336 20.9367 13.7336 20.9448C13.7336 20.9528 13.7353 20.9608 13.7386 20.9682L13.8871 21.5924H14.2272V19.1267C14.228 18.9672 14.2912 18.8145 14.4029 18.7017C14.5147 18.5889 14.666 18.5252 14.8241 18.5243H17.9753C18.1333 18.5252 18.2846 18.5889 18.3964 18.7017C18.5082 18.8145 18.5713 18.9672 18.5721 19.1267V20.5905C18.8217 20.3358 19.1188 20.1334 19.4463 19.9952C19.7738 19.857 20.1252 19.7857 20.4802 19.7853C20.7967 19.7838 21.111 19.8399 21.4079 19.9507C21.8177 19.5109 22.3403 19.1944 22.9175 19.0361C23.4948 18.8778 24.1042 18.8841 24.6782 19.0541C25.2522 19.2241 25.7682 19.5513 26.1692 19.9994C26.5701 20.4474 26.8402 20.9988 26.9496 21.5924H27.0949C27.2502 21.5932 27.3988 21.6561 27.5084 21.7672C27.6179 21.8783 27.6794 22.0287 27.6794 22.1854C27.6777 22.2467 27.6683 22.3075 27.6515 22.3664L26.1053 28.6086C26.0757 28.739 26.0028 28.8553 25.8988 28.9382C25.7947 29.021 25.6658 29.0655 25.5332 29.0643H15.891C16.1012 29.8383 16.3146 30.269 16.5899 30.4625C16.9362 30.6904 17.5392 30.706 18.5474 30.6904H25.3786C25.5344 30.6904 25.6839 30.7529 25.7941 30.8641C25.9042 30.9753 25.9662 31.1261 25.9662 31.2834C25.9662 31.4407 25.9042 31.5915 25.7941 31.7027C25.6839 31.8139 25.5344 31.8764 25.3786 31.8764H18.5752C17.3382 31.8764 16.5558 31.8764 15.9404 31.4488C15.325 31.0212 14.9756 30.294 14.6447 28.9707L12.6222 21.2709C12.6222 21.2709 12.6222 21.2709 12.6222 21.2428C12.5953 21.1045 12.5415 20.9729 12.464 20.8556C12.3866 20.7383 12.2869 20.6376 12.1707 20.5593C11.9158 20.414 11.6251 20.3447 11.3327 20.3596H10.4699ZM36.2454 16.9263V33.4682C36.2446 34.0068 36.0323 34.5231 35.6549 34.904C35.2775 35.2848 34.7659 35.4992 34.2323 35.5H5.40447C5.13995 35.4995 4.87813 35.4463 4.63403 35.3435C4.38992 35.2406 4.16832 35.0902 3.98194 34.9007C3.79466 34.7125 3.64608 34.4887 3.54472 34.2424C3.44335 33.996 3.39121 33.7318 3.39128 33.465V16.9482C3.98997 17.0478 4.59728 17.0844 5.20346 17.0574V33.3152C5.20321 33.3616 5.2121 33.4076 5.22962 33.4504C5.24714 33.4933 5.27294 33.5322 5.30551 33.5649C5.33817 33.5972 5.37685 33.6227 5.41931 33.6398C5.46177 33.657 5.50718 33.6655 5.55291 33.6648H15.8786C15.9604 33.3536 16.1418 33.0784 16.3946 32.8819C16.6473 32.6855 16.9574 32.5789 17.2764 32.5787C17.5958 32.5787 17.9063 32.6852 18.1596 32.8816C18.4129 33.078 18.5948 33.3533 18.6773 33.6648H22.2181C22.2999 33.3536 22.4813 33.0784 22.7341 32.8819C22.9869 32.6855 23.2969 32.5789 23.6159 32.5787C23.9354 32.5782 24.2462 32.6845 24.4996 32.881C24.753 33.0775 24.9348 33.3531 25.0168 33.6648H34.0838C34.1765 33.6648 34.2654 33.6276 34.3309 33.5615C34.3965 33.4954 34.4333 33.4056 34.4333 33.3121V16.9794C35.0373 17.0299 35.645 17.0131 36.2454 16.9295V16.9263ZM22.0975 24.0144C22.1161 23.9184 22.1671 23.832 22.2418 23.7698C22.3166 23.7077 22.4104 23.6737 22.5072 23.6737C22.6041 23.6737 22.6979 23.7077 22.7727 23.7698C22.8474 23.832 22.8984 23.9184 22.917 24.0144V26.3084C22.8984 26.4043 22.8474 26.4907 22.7727 26.5529C22.6979 26.615 22.6041 26.649 22.5072 26.649C22.4104 26.649 22.3166 26.615 22.2418 26.5529C22.1671 26.4907 22.1161 26.4043 22.0975 26.3084V24.0144ZM19.6421 24.0144C19.6606 23.9184 19.7117 23.832 19.7864 23.7698C19.8612 23.7077 19.955 23.6737 20.0518 23.6737C20.1487 23.6737 20.2425 23.7077 20.3173 23.7698C20.392 23.832 20.443 23.9184 20.4616 24.0144V26.3084C20.443 26.4043 20.392 26.4907 20.3173 26.5529C20.2425 26.615 20.1487 26.649 20.0518 26.649C19.955 26.649 19.8612 26.615 19.7864 26.5529C19.7117 26.4907 19.6606 26.4043 19.6421 26.3084V24.0144ZM17.1898 24.0144C17.2083 23.9184 17.2594 23.832 17.3341 23.7698C17.4089 23.7077 17.5027 23.6737 17.5995 23.6737C17.6964 23.6737 17.7902 23.7077 17.865 23.7698C17.9397 23.832 17.9907 23.9184 18.0093 24.0144V26.3084C17.9907 26.4043 17.9397 26.4907 17.865 26.5529C17.7902 26.615 17.6964 26.649 17.5995 26.649C17.5027 26.649 17.4089 26.615 17.3341 26.5529C17.2594 26.4907 17.2083 26.4043 17.1898 26.3084V24.0144ZM22.2676 20.475C22.6071 20.7798 22.87 21.1618 23.0345 21.5893H25.9074C25.8135 21.2148 25.6253 20.8712 25.3611 20.5918C25.0969 20.3124 24.7656 20.1066 24.3993 19.9945C24.0331 19.8824 23.6444 19.8677 23.2709 19.9519C22.8974 20.0361 22.5518 20.2163 22.2676 20.475ZM23.2293 22.7753H14.2365L15.5755 27.8658H25.0786L26.3156 22.7753H23.2293ZM17.8887 21.5768C17.8887 21.5362 17.9227 21.4925 17.9413 21.4519V19.5605C17.9413 19.4447 17.8956 19.3335 17.8144 19.2516C17.7333 19.1696 17.6231 19.1236 17.5083 19.1236H15.3529C15.238 19.1236 15.1279 19.1696 15.0467 19.2516C14.9655 19.3335 14.9199 19.4447 14.9199 19.5605V21.5768H17.8887ZM33.6261 14.9819C33.2396 14.7978 32.2871 14.5481 31.9871 14.2484C31.7262 13.9828 31.5053 13.6799 31.3315 13.3496C31.1578 13.6799 30.9369 13.9828 30.676 14.2484C30.0142 14.9132 28.5112 15.3283 27.4938 15.3283C26.4764 15.3283 24.9735 14.9132 24.321 14.2484C24.06 13.9828 23.8392 13.6799 23.6654 13.3496C23.4916 13.6799 23.2707 13.9828 23.0098 14.2484C22.348 14.9132 20.8451 15.3283 19.8276 15.3283C18.8102 15.3283 17.3073 14.9132 16.6455 14.2484C16.378 13.9841 16.1508 13.6812 15.9714 13.3496C15.7976 13.6799 15.5767 13.9828 15.3158 14.2484C14.654 14.9132 13.151 15.3283 12.1336 15.3283C11.1162 15.3283 9.61329 14.9132 8.9515 14.2484C8.69058 13.9828 8.4697 13.6799 8.29591 13.3496C8.12212 13.6799 7.90123 13.9828 7.64031 14.2484C7.20427 14.6854 6.05697 15.0162 5.45085 15.1848C4.22934 15.3346 2.78826 15.1567 1.88217 14.2484C1.54395 13.9065 1.2759 13.5006 1.09335 13.0539C0.910809 12.6072 0.817363 12.1286 0.818367 11.6454V10.1973C0.819307 10.1253 0.837336 10.0547 0.870939 9.99126L3.44386 1.67353C3.65414 0.990012 4.17058 0.549938 5.16944 0.5H34.2663C35.1631 0.596754 35.7476 0.977528 35.9888 1.66729L38.772 9.97566C38.8073 10.0353 38.8275 10.1029 38.8307 10.1723C38.8322 10.1868 38.8322 10.2015 38.8307 10.216V11.6454C38.8305 12.1293 38.7356 12.6083 38.5515 13.055C38.3673 13.5017 38.0975 13.9073 37.7577 14.2484C36.6815 15.3346 35.0425 15.3065 33.6385 14.9819H33.6261Z" stroke={activeMenu === 'admanager' ? 'black' : 'rgba(227, 31, 37, 1)'} stroke-width="4" mask="url(#path-1-inside-1_1763_293017)" />
              </svg>
              Products
            </div>
            <i className={`fas fa-chevron-${activeMenu === 'admanager' ? "up" : "down"} ml-2`}></i>
          </div>

          {/* SubProducts with products and add product section */}
          {activeMenu === 'admanager' && (
            <div className="subcategory-list pl-6">
              <div
                className={`subcategory-item ${activeSubProduct === 'All Products' ? 'active' : ''}`}
                onClick={() => {
                  // setEditProduct(null); // Reset edit state when user clicks manually
                  setActiveSubProduct('All Products')
                }}>
                All Products
              </div>
              <div
                className={`subcategory-item ${activeSubProduct === 'Add Products' ? 'active' : ''}`}
                onClick={() => {
                  setEditProduct(null); // Reset edit state when user clicks manually
                  setActiveSubProduct('Add Products')

                  // ✅ Also make sure state from URL is cleared (rare case fallback)
                  // window.history.replaceState({}, document.title, location.pathname + '#admanager');
                }}>
                {isEditing ? "Edit Product" : "Add Product"}
              </div>
            </div>
          )}


          {/* CATEGORY SECTION  */}
          <div className={`adminHeadings ${activeMenu === 'category' ? 'active' : ''}`}
            onClick={() => handleMenuClick('category')}>
            <div className='sideImageHeading'>
              <svg xmlns="http://www.w3.org/2000/svg" className='adminHeading-imgs' viewBox="0 0 39 38" fill="currentColor">
                <path d="M2.95525 0.500036H16.2157C16.5323 0.4999 16.845 0.569413 17.1308 0.703477C17.4165 0.83754 17.6681 1.03275 17.867 1.27479C18.025 1.45869 18.1466 1.66992 18.2258 1.89764C18.3103 2.12229 18.3532 2.35998 18.3526 2.59948V15.5698C18.3514 15.8534 18.2925 16.1339 18.1794 16.3948C18.0663 16.6557 17.9012 16.8917 17.6939 17.089C17.2955 17.4632 16.7668 17.674 16.2157 17.6784H2.95525C2.68507 17.6743 2.41827 17.6186 2.16977 17.5143C1.90848 17.4148 1.67014 17.2649 1.46883 17.0734C1.26753 16.8819 1.10734 16.6527 0.997731 16.3993C0.878628 16.1385 0.817482 15.8557 0.818369 15.5698V2.59948C0.821648 2.09246 1.00919 1.60327 1.34718 1.22011L1.43686 1.13503C1.62053 0.950965 1.83628 0.800728 2.0739 0.691447C2.35073 0.567507 2.65104 0.502286 2.95525 0.500036ZM23.4211 20.3278H36.6908C37.0117 20.3259 37.3289 20.3955 37.6185 20.5313C37.9034 20.6666 38.1546 20.8616 38.3545 21.1025C38.5087 21.2834 38.63 21.4889 38.7132 21.7102C38.7978 21.9359 38.8407 22.1746 38.84 22.415V35.3854C38.8393 35.6666 38.7804 35.9446 38.6668 36.2027C38.5536 36.4631 38.3885 36.6986 38.1813 36.8954C37.9834 37.0827 37.7502 37.2303 37.4948 37.3299C37.2438 37.4319 36.9748 37.4845 36.7031 37.4848H23.4211C23.1509 37.483 22.8834 37.4315 22.6325 37.3329C22.3798 37.2343 22.1489 37.0889 21.9522 36.9045C21.7433 36.7078 21.5762 36.4723 21.4605 36.2118C21.3441 35.9513 21.2841 35.6699 21.2842 35.3854V22.4302C21.2834 22.1778 21.3306 21.9274 21.4233 21.6919C21.5125 21.4565 21.6433 21.2384 21.8099 21.0478L21.8965 20.9628C22.0809 20.779 22.2978 20.6297 22.5366 20.5222C22.8137 20.3953 23.1154 20.3289 23.4211 20.3278ZM36.6908 22.4211H23.4211V35.4006C24.5591 35.4006 36.6846 35.4006 36.6969 35.4006C36.6969 34.3068 36.6969 22.4272 36.6969 22.4211H36.6908ZM2.95525 20.3278H16.2157C16.5323 20.3276 16.845 20.3971 17.1308 20.5312C17.4165 20.6653 17.6681 20.8605 17.867 21.1025C18.0233 21.2819 18.1449 21.4878 18.2258 21.7102C18.3103 21.9359 18.3533 22.1746 18.3526 22.415V35.3854C18.3519 35.6666 18.2929 35.9446 18.1794 36.2027C18.0685 36.4643 17.9031 36.7003 17.6939 36.8954C17.2955 37.2696 16.7668 37.4804 16.2157 37.4848H2.95525C2.68603 37.4832 2.41954 37.4317 2.16977 37.3329C1.9158 37.2351 1.68366 37.0896 1.48634 36.9045C1.27748 36.7085 1.11127 36.4728 0.997731 36.2118C0.881092 35.9566 0.82 35.6803 0.818369 35.4006V22.4302C0.819087 22.1779 0.866232 21.9278 0.957529 21.6919C1.04788 21.4564 1.17978 21.2384 1.34718 21.0478L1.43686 20.9628C1.61985 20.7787 1.8358 20.6293 2.0739 20.5222C2.34994 20.3956 2.65062 20.3293 2.95525 20.3278ZM16.2157 22.4211H2.95525V35.4006C4.09018 35.4006 16.2188 35.4006 16.228 35.4006C16.228 34.3068 16.228 22.4272 16.228 22.4211H16.2157ZM23.4211 0.500036H36.6908C37.0117 0.498176 37.3289 0.567772 37.6185 0.7036C37.9034 0.838865 38.1546 1.03384 38.3545 1.27479C38.5102 1.46022 38.6316 1.67102 38.7132 1.89764C38.7977 2.12229 38.8407 2.35998 38.84 2.59948V15.5698C38.8397 15.852 38.7807 16.1311 38.6668 16.3902C38.5529 16.6502 38.3879 16.8856 38.1813 17.0829C37.9759 17.2704 37.7354 17.4169 37.4732 17.5143C37.2217 17.6149 36.953 17.6675 36.6815 17.6693H23.4211C23.1505 17.6681 22.8827 17.6155 22.6325 17.5143C22.3806 17.4157 22.1498 17.2714 21.9522 17.089C21.7433 16.8922 21.5762 16.6568 21.4605 16.3962C21.3438 16.1347 21.2838 15.8523 21.2842 15.5668V2.59948C21.2837 2.34802 21.3309 2.09868 21.4233 1.86422C21.5119 1.62852 21.6429 1.41035 21.8099 1.22011L21.8965 1.13503C22.0815 0.951117 22.2982 0.800924 22.5366 0.691447C22.8144 0.56709 23.1158 0.501859 23.4211 0.500036ZM36.6908 2.5934H23.4211V15.5789C24.5591 15.5789 36.6846 15.5789 36.6969 15.5789C36.6969 14.4852 36.6969 2.60252 36.6969 2.59948L36.6908 2.5934ZM16.2249 2.5934H2.95525V15.5729C4.09018 15.5729 16.2188 15.5729 16.228 15.5729C16.228 14.4791 16.228 2.59644 16.228 2.5934H16.2249Z" fill={activeMenu === 'category' ? 'black' : 'rgba(227, 31, 37, 1)'} />
              </svg>Category
            </div>
            <i className={`fas fa-chevron-${activeMenu === 'category' ? "up" : "down"} ml-2`}></i>
          </div>

          {/* Subcategories under Category */}
          {activeMenu === 'category' && (
            <div className="subcategory-list pl-6">
              <div
                className={`subcategory-item ${activeSubCategory === 'location' ? 'active' : ''}`}
                onClick={() => setActiveSubCategory('location')}
              >
                Location
              </div>
              <div
                className={`subcategory-item ${activeSubCategory === 'media' ? 'active' : ''}`}
                onClick={() => setActiveSubCategory('media')}
              >
                Media Types
              </div>
            </div>
          )}



          {/* ORDERS LIST SECTION   */}
          <div className={`adminHeadings ${activeMenu === 'orders' ? 'active' : ''}`}
            onClick={() => handleMenuClick('orders')}>
            <div className='sideImageHeading'>
              <svg xmlns="http://www.w3.org/2000/svg" className='adminHeading-imgs' viewBox="0 0 39 40" fill="currentColor">
                <path d="M9.14311 27.9541C8.54684 27.9541 8.06916 27.4907 8.06916 26.9194C8.06916 26.3481 8.55343 25.8848 9.14311 25.8848H16.2226C16.8189 25.8848 17.2966 26.3481 17.2966 26.9194C17.2966 27.4907 16.8156 27.9541 16.2226 27.9541H9.14311ZM20.9467 24.9548C20.6304 24.9548 20.3603 24.6946 20.3603 24.3772C20.3603 24.0725 20.6304 23.8123 20.9467 23.8123H22.4785C22.4917 23.8123 22.5246 23.8123 22.5378 23.8123C23.0781 23.825 23.5591 23.9265 23.9643 24.1741C24.4156 24.4502 24.745 24.8691 24.9262 25.4912C24.9262 25.5039 24.9262 25.5198 24.9427 25.5356L25.0942 26.1133H38.2353C38.5647 26.1133 38.8217 26.3735 38.8217 26.6782C38.8217 26.7354 38.8052 26.7925 38.792 26.8528L37.2601 32.8005C37.2008 33.0608 36.9604 33.2354 36.6902 33.2354H27.0774C27.2882 33.9875 27.4991 34.3938 27.7824 34.5811C28.1283 34.7969 28.7278 34.8127 29.7359 34.7969H29.7491H36.5387C36.8681 34.7969 37.1251 35.0571 37.1251 35.3618C37.1251 35.6792 36.8549 35.9268 36.5387 35.9268H29.7458C28.4972 35.9395 27.733 35.9109 27.1169 35.5205C26.4844 35.1143 26.155 34.4224 25.8256 33.1624L23.8127 25.8213C23.8127 25.8054 23.8127 25.8054 23.7995 25.7927C23.7106 25.4753 23.5591 25.2563 23.3482 25.1421C23.1374 25.012 22.8541 24.9548 22.5213 24.9548C22.5049 24.9548 22.4917 24.9548 22.4752 24.9548H20.9467ZM34.7795 36.5901C35.5767 36.5901 36.2224 37.2122 36.2224 37.9802C36.2224 38.7483 35.5767 39.3704 34.7795 39.3704C33.9823 39.3704 33.3366 38.7483 33.3366 37.9802C33.3366 37.2122 33.9823 36.5901 34.7795 36.5901ZM28.4544 36.5901C29.2516 36.5901 29.8973 37.2122 29.8973 37.9802C29.8973 38.7483 29.2516 39.3704 28.4544 39.3704C27.6572 39.3704 27.0115 38.7483 27.0115 37.9802C27.0115 37.2122 27.6605 36.5901 28.4544 36.5901ZM9.14311 11.0249C8.54684 11.0249 8.06916 10.5583 8.06916 9.99023C8.06916 9.41895 8.55343 8.95557 9.14311 8.95557H25.786C26.3823 8.95557 26.86 9.41895 26.86 9.99023C26.86 10.5615 26.379 11.0249 25.786 11.0249H9.14311ZM3.31216 0.367188H31.5214C32.2099 0.367188 32.8359 0.636963 33.2839 1.0686C33.7319 1.50024 34.0119 2.10327 34.0119 2.7666V21.8032H31.8706V2.77612C31.8706 2.68408 31.8311 2.59839 31.7685 2.53491C31.7026 2.47461 31.6137 2.43652 31.5181 2.43652H3.31216C3.21663 2.43652 3.12768 2.47461 3.06179 2.53491C2.99591 2.59521 2.96296 2.68408 2.96296 2.77612V34.0923C2.96296 34.1843 3.00249 34.27 3.06509 34.3335C3.12768 34.397 3.21663 34.4319 3.31545 34.4319H21.4507C21.6516 35.1904 21.879 35.8538 22.1853 36.4854H3.31216C2.62365 36.4854 1.99773 36.2156 1.5497 35.7839C1.09838 35.3555 0.818359 34.7524 0.818359 34.0891V2.76978C0.818359 2.10645 1.09838 1.50024 1.5464 1.0686C1.99443 0.636963 2.62365 0.367188 3.31216 0.367188ZM9.14311 19.4895C8.54684 19.4895 8.06916 19.0261 8.06916 18.4548C8.06916 17.8835 8.55343 17.4202 9.14311 17.4202H25.786C26.3823 17.4202 26.86 17.8835 26.86 18.4548C26.86 19.0261 26.379 19.4895 25.786 19.4895H9.14311Z" fill={activeMenu === 'orders' ? 'black' : 'rgba(227, 31, 37, 1)'} />
              </svg>Orders
            </div>
            <i className={`fas fa-chevron-${activeMenu === 'orders' ? "up" : "down"} ml-2`}></i>
          </div>


          {/* SubOrders  with Orders  and add product section */}
          {activeMenu === 'orders' && (
            <div className="subcategory-list pl-6">
              <div
                className={`subcategory-item ${activeSubOrder === 'All Orders' ? 'active' : ''}`}
                onClick={() => {
                  // setEditOrder(null); // Reset edit state when user clicks manually
                  setActiveSubOrder('All Orders')
                }}>
                All Orders  
              </div>
              <div
                className={`subcategory-item ${activeSubOrder === 'Add Orders' ? 'active' : ''}`}
                onClick={() => {
                  // setEditOrder(null); // Reset edit state when user clicks manually
                  setActiveSubOrder('Add Orders')

                  // ✅ Also make sure state from URL is cleared (rare case fallback)
                  //   window.history.replaceState({}, document.title, location.pathname + '#orders');
                }}>
                Add Order
                {/* {editOrder ? "Edit Order" : "Add Order"} */}
              </div>
              <div
                className={`subcategory-item ${activeSubOrder === 'Order Info' ? 'active' : ''}`}
                onClick={() => {
                  //   setEditProduct(null); // Reset edit state when user clicks manually
                  setActiveSubOrder('Order Info')

                  // ✅ Also make sure state from URL is cleared (rare case fallback)
                  // window.history.replaceState({}, document.title, location.pathname + '#orders');
                }}>
                Order Info
              </div>
            </div>
          )}










          {/* PRODUCT ENQUIRE USERS LIST   */}
          <div className={`adminHeadings ${activeMenu === 'EnquireUsers' ? 'active' : ''}`}
            onClick={() => handleMenuClick('EnquireUsers')}>
            <div className='sideImageHeading'>
              {/* <svg xmlns="http://www.w3.org/2000/svg" className='adminHeading-imgs' viewBox="0 0 39 40" fill="currentColor">
                <path d="M9.14311 27.9541C8.54684 27.9541 8.06916 27.4907 8.06916 26.9194C8.06916 26.3481 8.55343 25.8848 9.14311 25.8848H16.2226C16.8189 25.8848 17.2966 26.3481 17.2966 26.9194C17.2966 27.4907 16.8156 27.9541 16.2226 27.9541H9.14311ZM20.9467 24.9548C20.6304 24.9548 20.3603 24.6946 20.3603 24.3772C20.3603 24.0725 20.6304 23.8123 20.9467 23.8123H22.4785C22.4917 23.8123 22.5246 23.8123 22.5378 23.8123C23.0781 23.825 23.5591 23.9265 23.9643 24.1741C24.4156 24.4502 24.745 24.8691 24.9262 25.4912C24.9262 25.5039 24.9262 25.5198 24.9427 25.5356L25.0942 26.1133H38.2353C38.5647 26.1133 38.8217 26.3735 38.8217 26.6782C38.8217 26.7354 38.8052 26.7925 38.792 26.8528L37.2601 32.8005C37.2008 33.0608 36.9604 33.2354 36.6902 33.2354H27.0774C27.2882 33.9875 27.4991 34.3938 27.7824 34.5811C28.1283 34.7969 28.7278 34.8127 29.7359 34.7969H29.7491H36.5387C36.8681 34.7969 37.1251 35.0571 37.1251 35.3618C37.1251 35.6792 36.8549 35.9268 36.5387 35.9268H29.7458C28.4972 35.9395 27.733 35.9109 27.1169 35.5205C26.4844 35.1143 26.155 34.4224 25.8256 33.1624L23.8127 25.8213C23.8127 25.8054 23.8127 25.8054 23.7995 25.7927C23.7106 25.4753 23.5591 25.2563 23.3482 25.1421C23.1374 25.012 22.8541 24.9548 22.5213 24.9548C22.5049 24.9548 22.4917 24.9548 22.4752 24.9548H20.9467ZM34.7795 36.5901C35.5767 36.5901 36.2224 37.2122 36.2224 37.9802C36.2224 38.7483 35.5767 39.3704 34.7795 39.3704C33.9823 39.3704 33.3366 38.7483 33.3366 37.9802C33.3366 37.2122 33.9823 36.5901 34.7795 36.5901ZM28.4544 36.5901C29.2516 36.5901 29.8973 37.2122 29.8973 37.9802C29.8973 38.7483 29.2516 39.3704 28.4544 39.3704C27.6572 39.3704 27.0115 38.7483 27.0115 37.9802C27.0115 37.2122 27.6605 36.5901 28.4544 36.5901ZM9.14311 11.0249C8.54684 11.0249 8.06916 10.5583 8.06916 9.99023C8.06916 9.41895 8.55343 8.95557 9.14311 8.95557H25.786C26.3823 8.95557 26.86 9.41895 26.86 9.99023C26.86 10.5615 26.379 11.0249 25.786 11.0249H9.14311ZM3.31216 0.367188H31.5214C32.2099 0.367188 32.8359 0.636963 33.2839 1.0686C33.7319 1.50024 34.0119 2.10327 34.0119 2.7666V21.8032H31.8706V2.77612C31.8706 2.68408 31.8311 2.59839 31.7685 2.53491C31.7026 2.47461 31.6137 2.43652 31.5181 2.43652H3.31216C3.21663 2.43652 3.12768 2.47461 3.06179 2.53491C2.99591 2.59521 2.96296 2.68408 2.96296 2.77612V34.0923C2.96296 34.1843 3.00249 34.27 3.06509 34.3335C3.12768 34.397 3.21663 34.4319 3.31545 34.4319H21.4507C21.6516 35.1904 21.879 35.8538 22.1853 36.4854H3.31216C2.62365 36.4854 1.99773 36.2156 1.5497 35.7839C1.09838 35.3555 0.818359 34.7524 0.818359 34.0891V2.76978C0.818359 2.10645 1.09838 1.50024 1.5464 1.0686C1.99443 0.636963 2.62365 0.367188 3.31216 0.367188ZM9.14311 19.4895C8.54684 19.4895 8.06916 19.0261 8.06916 18.4548C8.06916 17.8835 8.55343 17.4202 9.14311 17.4202H25.786C26.3823 17.4202 26.86 17.8835 26.86 18.4548C26.86 19.0261 26.379 19.4895 25.786 19.4895H9.14311Z" fill={activeMenu === 'EnquireUsers' ? 'black' : 'rgba(227, 31, 37, 1)'} />
              </svg> */}
              <i class="fa-solid fa-phone-volume" style={{ fontSize: '23px', marginRight: '15px' }}></i>
              Enquiry
            </div>
            <i className={`fas fa-chevron-${activeMenu === 'EnquireUsers' ? "up" : "down"} ml-2`}></i>
          </div>


          {/* SubEnquireUsers  with EnquireUsers  and add product section */}
          {activeMenu === 'EnquireUsers' && (
            <div className="subcategory-list pl-6">
              <div
                className={`subcategory-item ${activeEnquiryUsers === 'All Enquiries' ? 'active' : ''}`}
                onClick={() => {
                  // setEditOrder(null); // Reset edit state when user clicks manually
                  setActiveEnquiryUsers('All Enquiries')
                }}>
                All Enquiries
              </div>

              {/* <div
                className={`subcategory-item ${activeSubOrder === 'Order Info' ? 'active' : ''}`}
                onClick={() => {
                  //   setEditProduct(null); // Reset edit state when user clicks manually
                  setActiveSubOrder('Order Info')

                  // ✅ Also make sure state from URL is cleared (rare case fallback)
                  // window.history.replaceState({}, document.title, location.pathname + '#orders');
                }}>
                Order Info
              </div> */}
            </div>
          )}





          {/* BLOG PAGE  */}
          <div className={`adminHeadings ${activeMenu === 'BlogPage' ? 'active' : ''}`}
            onClick={() => handleMenuClick('BlogPage')}>
            <div className='sideImageHeading'>
    
              <svg xmlns="http://www.w3.org/2000/svg" className='adminHeading-imgs' viewBox="0 0 39 36" fill="none">
                <mask id="path-1-inside-1_1763_293017" fill="white">
                  <path d="M10.4699 20.3596C10.3124 20.3596 10.1614 20.2964 10.0501 20.184C9.9387 20.0717 9.87615 19.9192 9.87615 19.7603C9.87615 19.6014 9.9387 19.4489 10.0501 19.3366C10.1614 19.2242 10.3124 19.161 10.4699 19.161H11.3327C11.8382 19.1514 12.3367 19.282 12.7738 19.5387C13.2586 19.8583 13.6038 20.353 13.7386 20.9213C13.7353 20.9287 13.7336 20.9367 13.7336 20.9448C13.7336 20.9528 13.7353 20.9608 13.7386 20.9682L13.8871 21.5924H14.2272V19.1267C14.228 18.9672 14.2912 18.8145 14.4029 18.7017C14.5147 18.5889 14.666 18.5252 14.8241 18.5243H17.9753C18.1333 18.5252 18.2846 18.5889 18.3964 18.7017C18.5082 18.8145 18.5713 18.9672 18.5721 19.1267V20.5905C18.8217 20.3358 19.1188 20.1334 19.4463 19.9952C19.7738 19.857 20.1252 19.7857 20.4802 19.7853C20.7967 19.7838 21.111 19.8399 21.4079 19.9507C21.8177 19.5109 22.3403 19.1944 22.9175 19.0361C23.4948 18.8778 24.1042 18.8841 24.6782 19.0541C25.2522 19.2241 25.7682 19.5513 26.1692 19.9994C26.5701 20.4474 26.8402 20.9988 26.9496 21.5924H27.0949C27.2502 21.5932 27.3988 21.6561 27.5084 21.7672C27.6179 21.8783 27.6794 22.0287 27.6794 22.1854C27.6777 22.2467 27.6683 22.3075 27.6515 22.3664L26.1053 28.6086C26.0757 28.739 26.0028 28.8553 25.8988 28.9382C25.7947 29.021 25.6658 29.0655 25.5332 29.0643H15.891C16.1012 29.8383 16.3146 30.269 16.5899 30.4625C16.9362 30.6904 17.5392 30.706 18.5474 30.6904H25.3786C25.5344 30.6904 25.6839 30.7529 25.7941 30.8641C25.9042 30.9753 25.9662 31.1261 25.9662 31.2834C25.9662 31.4407 25.9042 31.5915 25.7941 31.7027C25.6839 31.8139 25.5344 31.8764 25.3786 31.8764H18.5752C17.3382 31.8764 16.5558 31.8764 15.9404 31.4488C15.325 31.0212 14.9756 30.294 14.6447 28.9707L12.6222 21.2709C12.6222 21.2709 12.6222 21.2709 12.6222 21.2428C12.5953 21.1045 12.5415 20.9729 12.464 20.8556C12.3866 20.7383 12.2869 20.6376 12.1707 20.5593C11.9158 20.414 11.6251 20.3447 11.3327 20.3596H10.4699ZM36.2454 16.9263V33.4682C36.2446 34.0068 36.0323 34.5231 35.6549 34.904C35.2775 35.2848 34.7659 35.4992 34.2323 35.5H5.40447C5.13995 35.4995 4.87813 35.4463 4.63403 35.3435C4.38992 35.2406 4.16832 35.0902 3.98194 34.9007C3.79466 34.7125 3.64608 34.4887 3.54472 34.2424C3.44335 33.996 3.39121 33.7318 3.39128 33.465V16.9482C3.98997 17.0478 4.59728 17.0844 5.20346 17.0574V33.3152C5.20321 33.3616 5.2121 33.4076 5.22962 33.4504C5.24714 33.4933 5.27294 33.5322 5.30551 33.5649C5.33817 33.5972 5.37685 33.6227 5.41931 33.6398C5.46177 33.657 5.50718 33.6655 5.55291 33.6648H15.8786C15.9604 33.3536 16.1418 33.0784 16.3946 32.8819C16.6473 32.6855 16.9574 32.5789 17.2764 32.5787C17.5958 32.5787 17.9063 32.6852 18.1596 32.8816C18.4129 33.078 18.5948 33.3533 18.6773 33.6648H22.2181C22.2999 33.3536 22.4813 33.0784 22.7341 32.8819C22.9869 32.6855 23.2969 32.5789 23.6159 32.5787C23.9354 32.5782 24.2462 32.6845 24.4996 32.881C24.753 33.0775 24.9348 33.3531 25.0168 33.6648H34.0838C34.1765 33.6648 34.2654 33.6276 34.3309 33.5615C34.3965 33.4954 34.4333 33.4056 34.4333 33.3121V16.9794C35.0373 17.0299 35.645 17.0131 36.2454 16.9295V16.9263ZM22.0975 24.0144C22.1161 23.9184 22.1671 23.832 22.2418 23.7698C22.3166 23.7077 22.4104 23.6737 22.5072 23.6737C22.6041 23.6737 22.6979 23.7077 22.7727 23.7698C22.8474 23.832 22.8984 23.9184 22.917 24.0144V26.3084C22.8984 26.4043 22.8474 26.4907 22.7727 26.5529C22.6979 26.615 22.6041 26.649 22.5072 26.649C22.4104 26.649 22.3166 26.615 22.2418 26.5529C22.1671 26.4907 22.1161 26.4043 22.0975 26.3084V24.0144ZM19.6421 24.0144C19.6606 23.9184 19.7117 23.832 19.7864 23.7698C19.8612 23.7077 19.955 23.6737 20.0518 23.6737C20.1487 23.6737 20.2425 23.7077 20.3173 23.7698C20.392 23.832 20.443 23.9184 20.4616 24.0144V26.3084C20.443 26.4043 20.392 26.4907 20.3173 26.5529C20.2425 26.615 20.1487 26.649 20.0518 26.649C19.955 26.649 19.8612 26.615 19.7864 26.5529C19.7117 26.4907 19.6606 26.4043 19.6421 26.3084V24.0144ZM17.1898 24.0144C17.2083 23.9184 17.2594 23.832 17.3341 23.7698C17.4089 23.7077 17.5027 23.6737 17.5995 23.6737C17.6964 23.6737 17.7902 23.7077 17.865 23.7698C17.9397 23.832 17.9907 23.9184 18.0093 24.0144V26.3084C17.9907 26.4043 17.9397 26.4907 17.865 26.5529C17.7902 26.615 17.6964 26.649 17.5995 26.649C17.5027 26.649 17.4089 26.615 17.3341 26.5529C17.2594 26.4907 17.2083 26.4043 17.1898 26.3084V24.0144ZM22.2676 20.475C22.6071 20.7798 22.87 21.1618 23.0345 21.5893H25.9074C25.8135 21.2148 25.6253 20.8712 25.3611 20.5918C25.0969 20.3124 24.7656 20.1066 24.3993 19.9945C24.0331 19.8824 23.6444 19.8677 23.2709 19.9519C22.8974 20.0361 22.5518 20.2163 22.2676 20.475ZM23.2293 22.7753H14.2365L15.5755 27.8658H25.0786L26.3156 22.7753H23.2293ZM17.8887 21.5768C17.8887 21.5362 17.9227 21.4925 17.9413 21.4519V19.5605C17.9413 19.4447 17.8956 19.3335 17.8144 19.2516C17.7333 19.1696 17.6231 19.1236 17.5083 19.1236H15.3529C15.238 19.1236 15.1279 19.1696 15.0467 19.2516C14.9655 19.3335 14.9199 19.4447 14.9199 19.5605V21.5768H17.8887ZM33.6261 14.9819C33.2396 14.7978 32.2871 14.5481 31.9871 14.2484C31.7262 13.9828 31.5053 13.6799 31.3315 13.3496C31.1578 13.6799 30.9369 13.9828 30.676 14.2484C30.0142 14.9132 28.5112 15.3283 27.4938 15.3283C26.4764 15.3283 24.9735 14.9132 24.321 14.2484C24.06 13.9828 23.8392 13.6799 23.6654 13.3496C23.4916 13.6799 23.2707 13.9828 23.0098 14.2484C22.348 14.9132 20.8451 15.3283 19.8276 15.3283C18.8102 15.3283 17.3073 14.9132 16.6455 14.2484C16.378 13.9841 16.1508 13.6812 15.9714 13.3496C15.7976 13.6799 15.5767 13.9828 15.3158 14.2484C14.654 14.9132 13.151 15.3283 12.1336 15.3283C11.1162 15.3283 9.61329 14.9132 8.9515 14.2484C8.69058 13.9828 8.4697 13.6799 8.29591 13.3496C8.12212 13.6799 7.90123 13.9828 7.64031 14.2484C7.20427 14.6854 6.05697 15.0162 5.45085 15.1848C4.22934 15.3346 2.78826 15.1567 1.88217 14.2484C1.54395 13.9065 1.2759 13.5006 1.09335 13.0539C0.910809 12.6072 0.817363 12.1286 0.818367 11.6454V10.1973C0.819307 10.1253 0.837336 10.0547 0.870939 9.99126L3.44386 1.67353C3.65414 0.990012 4.17058 0.549938 5.16944 0.5H34.2663C35.1631 0.596754 35.7476 0.977528 35.9888 1.66729L38.772 9.97566C38.8073 10.0353 38.8275 10.1029 38.8307 10.1723C38.8322 10.1868 38.8322 10.2015 38.8307 10.216V11.6454C38.8305 12.1293 38.7356 12.6083 38.5515 13.055C38.3673 13.5017 38.0975 13.9073 37.7577 14.2484C36.6815 15.3346 35.0425 15.3065 33.6385 14.9819H33.6261Z" />
                </mask>
                <path d="M10.4699 20.3596C10.3124 20.3596 10.1614 20.2964 10.0501 20.184C9.9387 20.0717 9.87615 19.9192 9.87615 19.7603C9.87615 19.6014 9.9387 19.4489 10.0501 19.3366C10.1614 19.2242 10.3124 19.161 10.4699 19.161H11.3327C11.8382 19.1514 12.3367 19.282 12.7738 19.5387C13.2586 19.8583 13.6038 20.353 13.7386 20.9213C13.7353 20.9287 13.7336 20.9367 13.7336 20.9448C13.7336 20.9528 13.7353 20.9608 13.7386 20.9682L13.8871 21.5924H14.2272V19.1267C14.228 18.9672 14.2912 18.8145 14.4029 18.7017C14.5147 18.5889 14.666 18.5252 14.8241 18.5243H17.9753C18.1333 18.5252 18.2846 18.5889 18.3964 18.7017C18.5082 18.8145 18.5713 18.9672 18.5721 19.1267V20.5905C18.8217 20.3358 19.1188 20.1334 19.4463 19.9952C19.7738 19.857 20.1252 19.7857 20.4802 19.7853C20.7967 19.7838 21.111 19.8399 21.4079 19.9507C21.8177 19.5109 22.3403 19.1944 22.9175 19.0361C23.4948 18.8778 24.1042 18.8841 24.6782 19.0541C25.2522 19.2241 25.7682 19.5513 26.1692 19.9994C26.5701 20.4474 26.8402 20.9988 26.9496 21.5924H27.0949C27.2502 21.5932 27.3988 21.6561 27.5084 21.7672C27.6179 21.8783 27.6794 22.0287 27.6794 22.1854C27.6777 22.2467 27.6683 22.3075 27.6515 22.3664L26.1053 28.6086C26.0757 28.739 26.0028 28.8553 25.8988 28.9382C25.7947 29.021 25.6658 29.0655 25.5332 29.0643H15.891C16.1012 29.8383 16.3146 30.269 16.5899 30.4625C16.9362 30.6904 17.5392 30.706 18.5474 30.6904H25.3786C25.5344 30.6904 25.6839 30.7529 25.7941 30.8641C25.9042 30.9753 25.9662 31.1261 25.9662 31.2834C25.9662 31.4407 25.9042 31.5915 25.7941 31.7027C25.6839 31.8139 25.5344 31.8764 25.3786 31.8764H18.5752C17.3382 31.8764 16.5558 31.8764 15.9404 31.4488C15.325 31.0212 14.9756 30.294 14.6447 28.9707L12.6222 21.2709C12.6222 21.2709 12.6222 21.2709 12.6222 21.2428C12.5953 21.1045 12.5415 20.9729 12.464 20.8556C12.3866 20.7383 12.2869 20.6376 12.1707 20.5593C11.9158 20.414 11.6251 20.3447 11.3327 20.3596H10.4699ZM36.2454 16.9263V33.4682C36.2446 34.0068 36.0323 34.5231 35.6549 34.904C35.2775 35.2848 34.7659 35.4992 34.2323 35.5H5.40447C5.13995 35.4995 4.87813 35.4463 4.63403 35.3435C4.38992 35.2406 4.16832 35.0902 3.98194 34.9007C3.79466 34.7125 3.64608 34.4887 3.54472 34.2424C3.44335 33.996 3.39121 33.7318 3.39128 33.465V16.9482C3.98997 17.0478 4.59728 17.0844 5.20346 17.0574V33.3152C5.20321 33.3616 5.2121 33.4076 5.22962 33.4504C5.24714 33.4933 5.27294 33.5322 5.30551 33.5649C5.33817 33.5972 5.37685 33.6227 5.41931 33.6398C5.46177 33.657 5.50718 33.6655 5.55291 33.6648H15.8786C15.9604 33.3536 16.1418 33.0784 16.3946 32.8819C16.6473 32.6855 16.9574 32.5789 17.2764 32.5787C17.5958 32.5787 17.9063 32.6852 18.1596 32.8816C18.4129 33.078 18.5948 33.3533 18.6773 33.6648H22.2181C22.2999 33.3536 22.4813 33.0784 22.7341 32.8819C22.9869 32.6855 23.2969 32.5789 23.6159 32.5787C23.9354 32.5782 24.2462 32.6845 24.4996 32.881C24.753 33.0775 24.9348 33.3531 25.0168 33.6648H34.0838C34.1765 33.6648 34.2654 33.6276 34.3309 33.5615C34.3965 33.4954 34.4333 33.4056 34.4333 33.3121V16.9794C35.0373 17.0299 35.645 17.0131 36.2454 16.9295V16.9263ZM22.0975 24.0144C22.1161 23.9184 22.1671 23.832 22.2418 23.7698C22.3166 23.7077 22.4104 23.6737 22.5072 23.6737C22.6041 23.6737 22.6979 23.7077 22.7727 23.7698C22.8474 23.832 22.8984 23.9184 22.917 24.0144V26.3084C22.8984 26.4043 22.8474 26.4907 22.7727 26.5529C22.6979 26.615 22.6041 26.649 22.5072 26.649C22.4104 26.649 22.3166 26.615 22.2418 26.5529C22.1671 26.4907 22.1161 26.4043 22.0975 26.3084V24.0144ZM19.6421 24.0144C19.6606 23.9184 19.7117 23.832 19.7864 23.7698C19.8612 23.7077 19.955 23.6737 20.0518 23.6737C20.1487 23.6737 20.2425 23.7077 20.3173 23.7698C20.392 23.832 20.443 23.9184 20.4616 24.0144V26.3084C20.443 26.4043 20.392 26.4907 20.3173 26.5529C20.2425 26.615 20.1487 26.649 20.0518 26.649C19.955 26.649 19.8612 26.615 19.7864 26.5529C19.7117 26.4907 19.6606 26.4043 19.6421 26.3084V24.0144ZM17.1898 24.0144C17.2083 23.9184 17.2594 23.832 17.3341 23.7698C17.4089 23.7077 17.5027 23.6737 17.5995 23.6737C17.6964 23.6737 17.7902 23.7077 17.865 23.7698C17.9397 23.832 17.9907 23.9184 18.0093 24.0144V26.3084C17.9907 26.4043 17.9397 26.4907 17.865 26.5529C17.7902 26.615 17.6964 26.649 17.5995 26.649C17.5027 26.649 17.4089 26.615 17.3341 26.5529C17.2594 26.4907 17.2083 26.4043 17.1898 26.3084V24.0144ZM22.2676 20.475C22.6071 20.7798 22.87 21.1618 23.0345 21.5893H25.9074C25.8135 21.2148 25.6253 20.8712 25.3611 20.5918C25.0969 20.3124 24.7656 20.1066 24.3993 19.9945C24.0331 19.8824 23.6444 19.8677 23.2709 19.9519C22.8974 20.0361 22.5518 20.2163 22.2676 20.475ZM23.2293 22.7753H14.2365L15.5755 27.8658H25.0786L26.3156 22.7753H23.2293ZM17.8887 21.5768C17.8887 21.5362 17.9227 21.4925 17.9413 21.4519V19.5605C17.9413 19.4447 17.8956 19.3335 17.8144 19.2516C17.7333 19.1696 17.6231 19.1236 17.5083 19.1236H15.3529C15.238 19.1236 15.1279 19.1696 15.0467 19.2516C14.9655 19.3335 14.9199 19.4447 14.9199 19.5605V21.5768H17.8887ZM33.6261 14.9819C33.2396 14.7978 32.2871 14.5481 31.9871 14.2484C31.7262 13.9828 31.5053 13.6799 31.3315 13.3496C31.1578 13.6799 30.9369 13.9828 30.676 14.2484C30.0142 14.9132 28.5112 15.3283 27.4938 15.3283C26.4764 15.3283 24.9735 14.9132 24.321 14.2484C24.06 13.9828 23.8392 13.6799 23.6654 13.3496C23.4916 13.6799 23.2707 13.9828 23.0098 14.2484C22.348 14.9132 20.8451 15.3283 19.8276 15.3283C18.8102 15.3283 17.3073 14.9132 16.6455 14.2484C16.378 13.9841 16.1508 13.6812 15.9714 13.3496C15.7976 13.6799 15.5767 13.9828 15.3158 14.2484C14.654 14.9132 13.151 15.3283 12.1336 15.3283C11.1162 15.3283 9.61329 14.9132 8.9515 14.2484C8.69058 13.9828 8.4697 13.6799 8.29591 13.3496C8.12212 13.6799 7.90123 13.9828 7.64031 14.2484C7.20427 14.6854 6.05697 15.0162 5.45085 15.1848C4.22934 15.3346 2.78826 15.1567 1.88217 14.2484C1.54395 13.9065 1.2759 13.5006 1.09335 13.0539C0.910809 12.6072 0.817363 12.1286 0.818367 11.6454V10.1973C0.819307 10.1253 0.837336 10.0547 0.870939 9.99126L3.44386 1.67353C3.65414 0.990012 4.17058 0.549938 5.16944 0.5H34.2663C35.1631 0.596754 35.7476 0.977528 35.9888 1.66729L38.772 9.97566C38.8073 10.0353 38.8275 10.1029 38.8307 10.1723C38.8322 10.1868 38.8322 10.2015 38.8307 10.216V11.6454C38.8305 12.1293 38.7356 12.6083 38.5515 13.055C38.3673 13.5017 38.0975 13.9073 37.7577 14.2484C36.6815 15.3346 35.0425 15.3065 33.6385 14.9819H33.6261Z" stroke={activeMenu === 'BlogPage' ? 'black' : 'rgba(227, 31, 37, 1)'} stroke-width="4" mask="url(#path-1-inside-1_1763_293017)" />
              </svg>
              Blogs
            </div>
            <i className={`fas fa-chevron-${activeMenu === 'BlogPage' ? "up" : "down"} ml-2`}></i>
          </div>

          {/* SubProducts with products and add product section */}
          {activeMenu === 'BlogPage' && (
            <div className="subcategory-list pl-6">
              <div
                className={`subcategory-item ${activeBlogPage === 'All Blogs' ? 'active' : ''}`}
                onClick={() => {
                  // setEditProduct(null); // Reset edit state when user clicks manually
                  setActiveBlogPage('All Blogs');
                                  // setEditBlog(null);

                }}>
                All Blogs
              </div>
              <div
                className={`subcategory-item ${activeBlogPage === 'Add Blogs' ? 'active' : ''}`}
                onClick={() => {
                   setEditBlog(null); // Reset edit state when user clicks manually
                  setActiveBlogPage('Add Blogs')
                  // ✅ Also make sure state from URL is cleared (rare case fallback)
                //  window.history.replaceState({}, document.title, location.pathname + '#EditBlogPage');
                }}>
                {isEditingBlog ? "Edit Blog" : "Add Blog"}

                {/* Add Blog */}
              </div>
            </div>
          )}

          {/* <div className='settingsSection'>
            <svg xmlns="http://www.w3.org/2000/svg" className='adminHeading-imgs' viewBox="0 0 31 31" fill="none">
              <path d="M14.1327 30.2387H16.9364C18.0827 30.2387 18.9805 29.5205 19.2567 28.4156L19.8092 25.9986L20.1682 25.8605L22.2814 27.1726C23.2482 27.7803 24.3945 27.6145 25.2094 26.7997L27.143 24.8661C27.9717 24.0374 28.1098 22.9049 27.5021 21.9519L26.19 19.8387L26.3281 19.5073L28.7451 18.941C29.8362 18.6648 30.5544 17.767 30.5544 16.6207V13.8998C30.5544 12.7535 29.85 11.8557 28.7451 11.5795L26.3419 10.9994L26.2038 10.6403L27.5159 8.54102C28.1236 7.58803 27.9855 6.4555 27.1568 5.613L25.2232 3.67941C24.4222 2.86454 23.2758 2.71261 22.309 3.3065L20.1959 4.60477L19.8092 4.46666L19.2567 2.03585C18.9805 0.930943 18.0827 0.226562 16.9364 0.226562H14.1327C12.9725 0.226562 12.0748 0.930943 11.8124 2.03585L11.2599 4.46666L10.8732 4.60477L8.76005 3.3065C7.77944 2.71261 6.6469 2.86454 5.84584 3.67941L3.89844 5.613C3.08357 6.4555 2.93164 7.58803 3.53934 8.54102L4.85142 10.6403L4.71331 10.9994L2.32394 11.5795C1.21903 11.8557 0.514648 12.7535 0.514648 13.8998V16.6207C0.514648 17.767 1.23284 18.6648 2.32394 18.941L4.74093 19.5073L4.86523 19.8387L3.55315 21.9519C2.94545 22.9049 3.09738 24.0374 3.91225 24.8661L5.85965 26.7997C6.66071 27.6145 7.80706 27.7803 8.77386 27.1726L10.887 25.8605L11.2599 25.9986L11.8124 28.4156C12.0748 29.5205 12.9725 30.2387 14.1327 30.2387ZM14.4918 27.6974C14.257 27.6974 14.1327 27.6007 14.1051 27.3936L13.2764 23.996C12.4063 23.7888 11.5638 23.4297 10.887 23.0015L7.90374 24.8384C7.72419 24.9489 7.55845 24.9351 7.39272 24.7694L5.94252 23.3192C5.77679 23.1673 5.77679 23.0015 5.88728 22.822L7.72419 19.8387C7.33747 19.1758 6.97838 18.3471 6.77121 17.477L3.35979 16.6621C3.15262 16.6345 3.04213 16.5102 3.04213 16.2754V14.2313C3.04213 13.9827 3.13881 13.886 3.35979 13.8308L6.75739 13.0297C6.96457 12.1044 7.3651 11.248 7.71038 10.6265L5.87347 7.6709C5.76297 7.47754 5.76297 7.3118 5.9149 7.14607L7.37891 5.70968C7.54464 5.55776 7.69657 5.53013 7.90374 5.65444L10.8594 7.46373C11.4809 7.07701 12.4063 6.69029 13.2902 6.46931L14.1051 3.07171C14.1327 2.86454 14.257 2.75405 14.4918 2.75405H16.5773C16.8121 2.75405 16.9226 2.85073 16.964 3.07171L17.7927 6.48312C18.6904 6.7041 19.5053 7.07701 20.1959 7.46373L23.1515 5.65444C23.3587 5.54395 23.5106 5.55776 23.6763 5.72349L25.1403 7.15988C25.3061 7.3118 25.3061 7.47754 25.1818 7.6709L23.3587 10.6265C23.6902 11.248 24.1045 12.1044 24.3117 13.0297L27.7093 13.8308C27.9302 13.886 28.0131 13.9827 28.0131 14.2313V16.2754C28.0131 16.5102 27.9164 16.6345 27.7093 16.6621L24.2979 17.477C24.0907 18.3471 23.7178 19.1896 23.3311 19.8387L25.168 22.8082C25.2785 23.0015 25.2785 23.1535 25.1127 23.3054L23.6625 24.7694C23.4968 24.9351 23.3311 24.9489 23.1515 24.8384L20.1821 23.0015C19.4915 23.4297 18.7042 23.775 17.7927 23.996L16.964 27.3936C16.9226 27.6007 16.8121 27.6974 16.5773 27.6974H14.4918ZM15.5414 20.4741C18.4142 20.4741 20.7759 18.1123 20.7759 15.2257C20.7759 12.3668 18.4142 10.005 15.5414 10.005C12.6549 10.005 10.2793 12.3668 10.2793 15.2257C10.2793 18.1123 12.6549 20.4741 15.5414 20.4741ZM15.5414 18.0847C13.9669 18.0847 12.6825 16.8002 12.6825 15.2257C12.6825 13.6789 13.9807 12.3944 15.5414 12.3944C17.0745 12.3944 18.359 13.6789 18.359 15.2257C18.359 16.7864 17.0745 18.0847 15.5414 18.0847Z" fill="#E31F25" />
            </svg>
            Log Out
          </div> */}

        </div>



        {/* RIGHT CONTENT  */}
        {/* DASHBOARD SECTION WITH CHARTS  */}
        {activeMenu === 'dashboard' && (
          <div className='dashboardMain' style={{ width: '100%', margin: '20px' }}>
            <div className="dashboardSummary-wrapper">
              {
                dashboardSummary.map(
                  (summary) => (
                    <div className='dashboardSummary ' key={summary.id}>
                      <div className="cards">
                        <div className="summaryIcon"><img src={summary.icons}></img></div>
                        <div className="content">
                          <span className="summaryHeading">{summary.summaryHeading}</span><br></br>
                          <span className="summaryCount">{summary.summaryCount}</span>
                        </div>
                      </div>
                    </div>
                  )

                )
              }
            </div>

            <div className='dashboardCharts'>
              <div className='RevenueChartMain'>
                <div className='revenueHeader'>
                  <div>
                    Revenue by Month
                  </div>
                  <div>
                    <select className='RevenueInputSelect'>
                      <option >2020</option>
                      <option value='2021'>2021</option>
                      <option value='2022'>2022</option>
                      <option value='2023'>2023</option>
                      <option value='2024'>2024</option>
                      <option value='2025'>2025</option>
                    </select>
                  </div>
                </div>
                <div className='revenueBar'>
                  <div className='revenueContent'> <div className='revenubarContent'></div>Jan</div>
                  <div className='revenueContent'> <div className='revenubarContent'></div>Feb</div>
                  <div className='revenueContent'> <div className='revenubarContent'></div>Mar</div>
                  <div className='revenueContent'> <div className='revenubarContent'></div>Apr</div>
                  <div className='revenueContent'> <div className='revenubarContent'></div>May</div>
                  <div className='revenueContent'> <div className='revenubarContent'></div>Jun</div>
                  <div className='revenueContent'> <div className='revenubarContent'></div>Jul</div>
                  <div className='revenueContent'> <div className='revenubarContent'></div>Aug</div>
                  <div className='revenueContent'> <div className='revenubarContent'></div>Sep</div>
                  <div className='revenueContent'> <div className='revenubarContent'></div>Oct</div>
                  <div className='revenueContent'> <div className='revenubarContent'></div>Nov</div>
                  <div className='revenueContent'> <div className='revenubarContent'></div>Dec</div>
                </div>
              </div>
              <div className='RevenueChartMain UsersChartMain'>
                <div className='revenueHeader userHeader'>
                  <div> Users by Weekly </div>
                  <div>
                    <select className='RevenueInputSelect'>
                      <option >March</option>
                      <option value='April'>April</option>
                      <option value='May'>May</option>
                      <option value='June'>June</option>
                      <option value='July'>July</option>
                      <option value='August'>August</option>
                    </select>
                  </div>
                </div>
                <div className='usersbyWeek'>
                  <div className='usersbyWeekContent'>
                    <PieSection />
                  </div>
                  <div className='usersbyWeekContent'>
                    <div className='usersCount'>Week1 <br></br>5000</div>
                    <div className='usersCount'>Week2 <br></br>10000</div>
                    <div className='usersCount'>Week3 <br></br>4000</div>
                    <div className='usersCount'>Week4 <br></br>6000</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        )}


        {/* ADMANAGER WITH DRAG & DROP IMAGE SECTION  */}

        {/* Show subproduct content */}

        
        {activeSubProduct === 'All Products' && (
          <div className='productsMain'>
            <div>
              <Products />
            </div>
          </div>
        )}

        {activeSubProduct === 'Add Products' && (
          <div className="pl-6" id='admanager' style={{ display: activeSubProduct === 'Add Products' ? 'block' : 'none' }}>
            <ImageUploadPage editProduct={editProduct} />
          </div>
        )}

        {/* Show subcategory content */}
        {activeSubCategory === 'location' && (
          <div className="pl-6">
            <CategorySection />
          </div>
        )}

        {activeSubCategory === 'media' && (
          <div className="pl-6">
            <MediaTypeSection />
          </div>
        )}

        {/* ORDERS LIST SECTION  */}
        {activeSubOrder === 'All Orders' && (
          <div className='productsMain'>
            <div>
              <OrdersTable />
            </div>
          </div>
        )}

        {/* CLIENT DETAILS WITH PRODUCT ADD SECTION   */}
        {activeSubOrder === 'Add Orders' && (
          <div
          //  id="manageOrderEdit"
          >
            {/* <ImageUploadPage/> */}
            <ADManage 
            // editOrder={editOrder} 

            />
          </div>
        )}
        {activeSubOrder === 'Order Info' && (
          <div id="orderDetailsPg">
            {/* <ImageUploadPage/> */}
            <OrderDetails order={orderDetails} />
          </div>
        )}


        {/* ENQUIRE USER DETAILS  */}
        {activeEnquiryUsers === 'All Enquiries' && (
          <div className='productsMain'>
            <div>
              <EnquireUsers />
            </div>
          </div>
        )}

        {/* {activeEnquiryUsers === 'Add Orders' && (
          <div id="manageOrderEdit">
            <ADManage editOrder={editOrder} />
          </div>
        )} */}
        {/* Show Sub Blog content */}
        {activeBlogPage === 'All Blogs' && (
          <div className='productsMain'>
            <div>
              <AllBlogPg />
            </div>
          </div>
        )}

        {activeBlogPage === 'Add Blogs' && (
          <div className="pl-6" id='EditBlogPage' style={{ display: activeBlogPage === 'Add Blogs' ? 'block' : 'none' }}>
            <BlogAddPg 
            // editBlog={editBlog} setEditBlog={setEditBlog}
             />
          </div>
        )} 
      </div>
    </div>

    // </CategoryContext.Provider>
  );
}

export default AdminpanelHome;