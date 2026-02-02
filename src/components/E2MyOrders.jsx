import React, { useState, useEffect } from 'react';
import './E2MyOrders.css';
import { useNavigate } from 'react-router-dom';
import { useLogin } from './LoginContext';
import MainNavbar from './A1NAVBAR.jsx';
import MainFooter from './A1FOOTER.jsx';
import { MainLayout } from './MainLayout';
//BASE URL OF http://localhost:3001 FILE IMPORT 
import { baseUrl } from '../Adminpanel/BASE_URL';
import { formatIndianCurrency } from './FORMATED_AMOUNT'; // Import the currency formatter

function MyOrder() {
    const { user, openLogin } = useLogin();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [selectedDateFilter, setSelectedDateFilter] = useState("Anytime");
    const [dateFilter, setDateFilter] = useState("Anytime");
    const [isLoading, setIsLoading] = useState(true);

    const handleLoginClose = () => {
        // When user closes login without logging in, redirect to home
        navigate("/");
    };

    const fetchOrders = async () => { 
         // Check if user exists and has an _id
    if (!user || !user._id) {
        console.error("No user or user ID found");
        setIsLoading(false);
        return;
    }
        try {
            const response = await fetch(`${baseUrl}/prodOrders?userId=${user._id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch orders');
            }
            const data = await response.json();
            setOrders(data);
            setIsLoading(false);
        } catch (error) {
            console.error("Error fetching orders:", error);
            setIsLoading(false);
        }
    };

    // useEffect(() => {
    //     // Get the intended redirect path from sessionStorage or use current path
    //     const redirectPath = sessionStorage.getItem('loginRedirect') || window.location.pathname;
        
    //     if (user) {
    //         fetchOrders();
    //         // Clear any stored redirect path after successful login
    //         sessionStorage.removeItem('loginRedirect');
    //     } else {
    //         setIsLoading(false);
    //         // Store current path for redirection after login
    //         sessionStorage.setItem('loginRedirect', redirectPath);
            
    //         // Open login modal with success callback
    //         openLogin(() => {
    //             // After successful login, redirect to the stored path or cart page
    //             const storedPath = sessionStorage.getItem('loginRedirect');
    //             if (storedPath === '/order' || storedPath.includes('/order')) {
    //                 // If user was trying to access order page, fetch orders
    //                 fetchOrders();
    //             } else if (storedPath === '/cart' || storedPath.includes('/cart')) {
    //                 // If user was trying to access cart page, navigate to cart
    //                 navigate('/cart');
    //             } else {
    //                 // Otherwise, redirect to the stored path
    //                 navigate(storedPath || '/');
    //             }
    //             // Clear the stored path
    //             sessionStorage.removeItem('loginRedirect');
    //         }, redirectPath);
    //     }
    // }, [user]);


//     useEffect(() => {
//     // Get the intended redirect path from sessionStorage
//     const redirectPath = sessionStorage.getItem('loginRedirect') || window.location.pathname;
    
//     if (user && user._id) {
//         // Only fetch orders if user exists and has an _id
//         fetchOrders();
//         // Clear any stored redirect path after successful login
//         sessionStorage.removeItem('loginRedirect');
//     } else {
//         setIsLoading(false);
//         // Store current path for redirection after login
//         sessionStorage.setItem('loginRedirect', redirectPath);
        
//         // Open login modal with success callback
//         openLogin(() => {
//             // After successful login, redirect to the stored path
//             const storedPath = sessionStorage.getItem('loginRedirect');
            
//             // Add null check for storedPath
//             if (storedPath && storedPath.includes('/order')) {
//                 // If user was trying to access order page, fetch orders
//                 fetchOrders();
//             } else if (storedPath && storedPath.includes('/cart')) {
//                 // If user was trying to access cart page, navigate to cart
//                 navigate('/cart');
//             } else {
//                 // Otherwise, redirect to the stored path or home
//                 navigate(storedPath || '/');
//             }
//             // Clear the stored path
//             sessionStorage.removeItem('loginRedirect');
//         }, redirectPath);
//     }
// }, [user, navigate, openLogin]); // Added dependencies

 useEffect(() => {
        // Only fetch orders if user is logged in
        if (user && user._id) {
            fetchOrders();
        } else {
            // If no user, just set loading to false
            setIsLoading(false);
        }
    }, [user]); // Only depend on user 

    const toggleFilter = () => {
        setIsFilterOpen(!isFilterOpen);
    };

    const closeFilter = () => {
        setIsFilterOpen(false);
    };

    const filterOrders = (orders, filter) => {
        const today = new Date();
        const last30Days = new Date();
        last30Days.setDate(today.getDate() - 30);

        const last6Months = new Date();
        last6Months.setMonth(today.getMonth() - 6);

        const lastYear = new Date();
        lastYear.setFullYear(today.getFullYear() - 1);

        return orders.filter(order => {
            const orderDate = new Date(order.createdAt);

            switch (filter) {
                case "Last 30 days":
                    return orderDate >= last30Days && orderDate <= today;
                case "Last 6 months":
                    return orderDate >= last6Months && orderDate <= today;
                case "Last year":
                    return orderDate >= lastYear && orderDate <= today;
                default:
                    return true;
            }
        });
    };

    const handleApplyFilter = () => {
        setDateFilter(selectedDateFilter);
        setIsFilterOpen(false);
    };

    const handleResetFilter = () => {
        setSelectedDateFilter("Anytime");
        setDateFilter("Anytime");
    };

    const filteredOrders = filterOrders(orders, dateFilter);

    // Calculate overall total for an order
    const calculateOrderOverallTotal = (order) => {
        return order.products.reduce((total, product) => {
            const bookedAmount = product.booking?.totalPrice || 0;
            const printingCost = product.printingCost || 0;
            const mountingCost = product.mountingCost || 0;
            return total + bookedAmount + printingCost + mountingCost;
        }, 0);
    };

    // Calculate per day cost for a product
    const calculatePerDayCost = (product) => {
        return product.price || product.booking?.totalPrice / product.booking?.totalDays || 0;
    };

    // if (!user) {
    //     return (
    //         <MainLayout onClose={handleLoginClose}>
    //             <div className="container noSelected">
    //                 <div className='noSelectedSpot'>Please login to view your Orders</div>
    //                 <button
    //                     className='noSelectedGoBackBtn'
    //                     onClick={() => openLogin(() => navigate('/order'), '/order')}>
    //                     Login
    //                 </button> 
    //                 <br></br>
    //                 <button
    //                     className='noSelectedGoBackBtn mt-3'
    //                     onClick={() => navigate("/")}>
    //                     Go to Home
    //                 </button>
    //             </div>
    //         </MainLayout>
    //     );
    // }

    if (isLoading) {
        return (
            <MainLayout>
                <div className="container loading">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div>
                <MainNavbar />
                <div className='container order-items-main'>
                    <h1 className='order-heading'>All Order</h1>
                    <div className="order-items">
                        <div>
                            <button className='filter-btn' onClick={toggleFilter}>
                                <img src='./images/filter.svg' className='filter-icon' alt="Filter" />
                                Filter
                            </button>
                        </div>

                        <div className='order-scroll'>
                            {filteredOrders.length > 0 ? (
                                filteredOrders.map((order) => {
                                    const orderOverallTotal = calculateOrderOverallTotal(order);
                                    
                                    return (
                                        <div className="order-group" key={order._id}>
                                            <div className="order-headerMain">
                                                <div className="order-header-top">
                                                    <div className="order-id">
                                                        Order Number : <span className='order-idSpan'>{order.orderId}</span>
                                                    </div>
                                                <div className="order-id">
                                                    Order Date : &nbsp;
                                                    <span className="order-idSpan"> 
                                                        {new Date(order.createdAt).toLocaleDateString("en-GB", {
                                                        day: "2-digit",
                                                        month: "short",
                                                        year: "numeric",
                                                        }).replace(/ /g, "-")}
                                                        {" / "}
                                                        {new Date(order.createdAt).toLocaleTimeString("en-GB", {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                        hour12: true,
                                                        }).replace(":", " : ")}
                                                    </span>
                                                </div>

                                                   
                                                </div>
                                            </div>

                                            {order.products.map((product, index) => {
                                                const perDayCost = calculatePerDayCost(product);
                                                const bookedAmount = product.booking?.totalPrice || 0;
                                                const printingCost = product.printingCost || 0;
                                                const mountingCost = product.mountingCost || 0;
                                                const productOverallTotal = bookedAmount + printingCost + mountingCost;
                                                
                                                return (
                                                    <div className="order-item-content" key={`${order._id}-${index}`}>
                                                        <div className="order-details">
                                                            <div>
                                                                <img src={product.image} className='order-item-img' alt={product.name} />
                                                            </div>
                                                            <div className="order-item-info">
                                                                <div className='order-item-title'>{product.name}</div>
                                                                
                                                                <div className="order-itemSizeDimensions">
                                                                    <div className='order-item-LeftContent'>Per Day Cost</div>
                                                                    <div className='order-ItemColon'> : </div>
                                                                    <div className='order-item-detailSection'>
                                                                        {formatIndianCurrency(perDayCost, true)}
                                                                    </div>
                                                                </div>

                                                                <div className="order-itemSizeDimensions">
                                                                    <div className='order-item-LeftContent'>Size & Dimensions</div>
                                                                    <div className='order-ItemColon'> : </div>
                                                                    <div className='order-item-detailSection'>
                                                                        W {product.size?.width || product.sizeWidth || 0} X H {product.size?.height || product.sizeHeight || 0}  
                                                                        <span className='order-item-slash'> | </span> 
                                                                        {product.size?.squareFeet || product.dimension || 0} Sq.ft
                                                                    </div>
                                                                </div>

                                                                {/* <div className="order-itemAdType">
                                                                    <div className='order-item-LeftContent'>Ad Type</div>
                                                                    <div className='order-ItemColon'> : </div>
                                                                    <div className='order-item-detailSection'>{product.mediaType}</div>
                                                                </div> */}
                                                                
                                                                {product.booking && (
                                                                    <div className="order-itemBookingDates">
                                                                        <div className='order-item-LeftContent'>Booking Period</div>
                                                                        <div className='order-ItemColon'> : </div>
                                                                        <div className='order-item-detailSection'>
                                                                            {new Date(product.booking.startDate).toLocaleDateString('en-GB', {
                                                                                day: '2-digit',
                                                                                month: 'short'
                                                                            })} - {new Date(product.booking.endDate).toLocaleDateString('en-GB', {
                                                                                day: '2-digit',
                                                                                month: 'short'
                                                                            })} ( {product.booking.totalDays} Days )
                                                                        </div>
                                                                    </div>
                                                                )}
                                                                
                                                                <div className="order-itemSizeDimensions">
                                                                    <div className='order-item-LeftContent'>Booking Amount</div>
                                                                    <div className='order-ItemColon'> : </div>
                                                                    <div className='order-item-detailSection'>
                                                                        {formatIndianCurrency(bookedAmount, true)}
                                                                    </div>
                                                                </div>
                                                                
                                                                {printingCost > 0 && (
                                                                    <div className="order-itemSizeDimensions">
                                                                        <div className='order-item-LeftContent'>Printing Cost</div>
                                                                        <div className='order-ItemColon'> : </div>
                                                                        <div className='order-item-detailSection'>
                                                                            {formatIndianCurrency(printingCost, true)}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                                
                                                                {mountingCost > 0 && (
                                                                    <div className="order-itemSizeDimensions">
                                                                        <div className='order-item-LeftContent'>Mounting Cost</div>
                                                                        <div className='order-ItemColon'> : </div>
                                                                        <div className='order-item-detailSection'>
                                                                            {formatIndianCurrency(mountingCost, true)}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                                
                                                                <div className="order-itemSizeDimensions">
                                                                    <div className='order-item-LeftContent'>Overall Total</div>
                                                                    <div className='order-ItemColon'> : </div>
                                                                    <div className='order-item-detailSection'>
                                                                        {formatIndianCurrency(productOverallTotal, true)}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    );
                                })
                            ) : (
                                <div className='text-center align-center'>
                                    <i className="fas fa-exclamation-circle" style={{ color: 'red', fontSize: '20px', marginRight: '5px' }}></i>
                                    <span className='NoItems'>No orders found </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                
                {isFilterOpen && (
                    <div className="filter-overlay">
                        <div className="container filter-section">
                            <div className='filter-heading d-flex justify-content-between'>
                                <div className='filter-side'> Filter Orders </div>
                                <div>
                                    <button className='filter-del-icon' onClick={closeFilter}>
                                        <i className="fa-solid fa-x filter-x"></i>
                                    </button>
                                </div>
                            </div>
                            <div>
                                <form>
                                    {["Anytime", "Last 30 days", "Last 6 months", "Last year"].map((filter) => (
                                        <div key={filter} className='filter-option-section d-flex'>
                                            <input
                                                type="radio"
                                                id={filter}
                                                name="date"
                                                value={filter}
                                                className='order-radio-btn'
                                                checked={selectedDateFilter === filter}
                                                onChange={(e) => setSelectedDateFilter(e.target.value)}
                                            />
                                            <label className='filter-option-name' htmlFor={filter}>{filter}</label>
                                        </div>
                                    ))}
                                </form>
                            </div>
                            <div className="filter-btns">
                                <button className='reset-filter-btn' onClick={handleResetFilter}>Reset Filter</button>
                                <button className='apply-filter-btn' onClick={handleApplyFilter}>Apply</button>
                            </div>
                        </div>
                    </div>
                )}
                <MainFooter />
            </div>
        </MainLayout>
    );
}

export default MyOrder;