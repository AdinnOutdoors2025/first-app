import React, { useState, useEffect } from 'react';
import './E2MyOrders.css';
import { useNavigate } from 'react-router-dom';
import { useLogin } from './LoginContext';
import MainNavbar from './A1NAVBAR.jsx';
import MainFooter from './A1FOOTER.jsx';
import { MainLayout } from './MainLayout';
//BASE URL OF http://localhost:3001 FILE IMPORT 
import { baseUrl } from '../Adminpanel/BASE_URL';

function MyOrder() {
    // const { user } = useLogin();
    const { user, openLogin, closeLogin, isLoggedIn } = useLogin();

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
    //     if (user) {
    //         const fetchOrders = async () => {
    //             try {
    //                 const response = await fetch(`${baseUrl}/prodOrders?userId=${user._id}`);
    //                 if (!response.ok) {
    //                     throw new Error('Failed to fetch orders');
    //                 }
    //                 const data = await response.json();
    //                 setOrders(data);
    //                 setIsLoading(false);
    //             } catch (error) {
    //                 console.error("Error fetching orders:", error);
    //                 setIsLoading(false);
    //             }
    //         };
    //         fetchOrders();
    //     }
    // }, [user]);




    useEffect(() => {
        //     fetchOrders();
        // }, [user]);
        if (user) {
            fetchOrders();
        } else {
            setIsLoading(false);
            // openLogin();
            openLogin(handleLoginSuccess, "/cart"); // Pass success callback

        }
    }, [user]);

    const handleLoginSuccess = () => {
        // This will be called after successful login
        fetchOrders();
    };

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

    // if (!user) {
    //     return (
    //         <MainLayout>
    //             <div className="container noSelected">
    //                 <h5 className='noSelectedSpot'>Please login to view your orders</h5>
    //                 <button className='noSelectedGoBackBtn' onClick={() => navigate("/")}>Go to Home</button>
    //             </div>
    //         </MainLayout>
    //     );
    // }

    if (!user) {
        return (
            <MainLayout onClose={handleLoginClose}>
                <div className="container noSelected">
                    <div className='noSelectedSpot'>Please login to view your Orders</div>
                    <button
                        className='noSelectedGoBackBtn'
                        onClick={() => openLogin(handleLoginSuccess, "/cart")}>
                        Login</button> <br></br>
                    <button
                        className='noSelectedGoBackBtn mt-3'
                        onClick={() => navigate("/")}>Go to Home</button>
                </div>
            </MainLayout>
        );
    }


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
                                filteredOrders.map((order) => (
                                    <div className="order-group" key={order._id}>
                                        <div className="order-headerMain">
                                            <div className="order-header-top">
                                                <div className="order-id">Order Number : <span className='order-idSpan'>{order.orderId}</span></div>
                                                <div className="order-id">Paid : <span className='order-idSpan'>{`₹${order.client.paidAmount}`}</span></div>
                                                <div className="order-id">
                                                    Order Date : <span className='order-idSpan'>{new Date(order.createdAt).toLocaleDateString('en-GB', {
                                                        day: '2-digit',
                                                        month: 'numeric',
                                                        year: 'numeric'
                                                    })}
                                                    </span>


                                                </div>
                                            </div>
                                        </div>

                                        {order.products.map((product, index) => (
                                            <div className="order-item-content" key={`${order._id}-${index}`}>
                                                <div className="order-details">
                                                    <div>
                                                        <img src={product.image} className='order-item-img' alt={product.name} />
                                                    </div>
                                                    <div className="order-item-info">
                                                        <div className='order-item-title'>{product.name}</div>
                                                        <div className="order-itemSizeDimensions">
                                                            <div className='order-item-LeftContent'>Size & Dimensions</div>
                                                            <div className='order-ItemColon'> : </div>
                                                            <div className='order-item-detailSection'>
                                                                W {product.size.width} X H {product.size.height}  <span className='order-item-slash'> | </span> {product.size.squareFeet} Sq.ft
                                                            </div>
                                                        </div>

                                                        <div className="order-itemAdType">
                                                            <div className='order-item-LeftContent'>Ad Type</div>
                                                            <div className='order-ItemColon'> : </div>
                                                            <div className='order-item-detailSection'>{product.mediaType}</div>
                                                        </div>
                                                        {product.booking && (
                                                            <div className="order-itemBookingDates">
                                                                <div className='order-item-LeftContent'>Booked Date</div>
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
                                                        <div className="order-itemActualAmount">
                                                            <div className='order-item-LeftContent'>Actual Amount</div>
                                                            <div className='order-ItemColon'> : </div>
                                                            <div className='order-item-detailSection'>₹ {product.booking.totalPrice.toLocaleString()}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ))
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