


// src/components/ProductTable.js
import React, { useState, useEffect } from 'react';
import './ad1Orders.css';
import { useNavigate } from 'react-router-dom';
//BASE URL OF http://localhost:3001 FILE IMPORT 
import { baseUrl } from './BASE_URL';

const OrdersTable = () => {

    //FETCHED PRODUCTS ORDER PAGE
    const [productsOrderData, setProductsOrderData] = useState([]);
    // In your fetchOrders function, normalize the data
    const fetchOrders = async () => {
        try {
            const response = await fetch(`${baseUrl}/prodOrders`);
            const data = await response.json();
            // Add safe product fallback
            const normalizedData = data.map(order => ({
                ...order,
                createdAt: order.createdAt || new Date().toISOString(),
                products: order.products || [], // Ensure product exists
                booking: order.products?.[0]?.booking || {}  // Ensure booking exists
            }));

            setProductsOrderData(normalizedData);
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    };
    useEffect(() => {
        fetchOrders();
    }, []);
    // Pagination States
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 10;
    // Add state for search date(FILTERED DATE TO SHOW THE PRODUCT)
    const [searchDate, setSearchDate] = useState('');
    // Update your fetchOrders and other existing code...
    const filteredOrders = productsOrderData.filter(order => {
        if (!searchDate) return true;

        if (order.createdAt) {
            const date = new Date(order.createdAt);
            const day = date.getDate().toString();
            const month = (date.getMonth() + 1).toString(); // Months are 0-indexed
            const year = date.getFullYear().toString();

            // Check if search term matches any part
            return day.includes(searchDate) ||
                month.includes(searchDate) ||
                year.includes(searchDate) ||
                `${day}/${month}/${year}`.includes(searchDate);
        }
        return false;
    });




    // Calculate Total Pages
    const totalPages = Math.ceil(filteredOrders.length / productsPerPage);

    // Get Current Products for Display
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredOrders.slice(indexOfFirstProduct, indexOfLastProduct);

    // // Pagination Function
    // Function to Generate Pagination Buttons
    const getPaginationGroup = () => {
        let pages = [];
        const maxPagesToShow = 3; // Show 3 pages around the current page

        if (totalPages <= 6) {
            // If there are few pages, show all
            pages = Array.from({ length: totalPages }, (_, i) => i + 1);
        }
        else {
            if (currentPage <= maxPagesToShow + 1) {
                // If near start: Show first few + last 2
                pages = [...Array(maxPagesToShow + 1).keys()].map((i) => i + 1);
                pages.push("...", totalPages - 1, totalPages);
            } else if (currentPage >= totalPages - maxPagesToShow) {
                // If near end: Show first 2 + last few
                pages = [1, 2, "..."];
                pages.push(...Array.from({ length: maxPagesToShow + 1 }, (_, i) => totalPages - maxPagesToShow + i));
            } else {
                // Middle section: Show current, 1 before & after
                pages = [1, 2, "..."];
                pages.push(currentPage - 1, currentPage, currentPage + 1);
                pages.push("...", totalPages - 1, totalPages);
            }
        }
        return pages;
    };
    // 3 DOTS SECTION 
    const [menuOpenId, setMenuOpenId] = useState(null); // Use ID if multiple rows

    const toggleMenu = (id) => {
        setMenuOpenId(prevId => (prevId === id ? null : id));
    };

    const navigate = useNavigate();
    // view details of the order  
    const handleViewOrderDetails = (order) => {
        navigate(
            '/admin#orderDetailsPg', {
            state: {
                order,
                activeMenu: 'orders',
                activeSubOrder: 'Order Info'
            }
        })
    }
    // EDIT PRODUCT 
    const handleAction = (action, order) => {
        if (action === 'Edit') {
            navigate('/admin#manageOrderEdit', {
                state: {
                    editOrder: order,
                    activeMenu: 'orders',
                    activeSubOrder: 'Add Orders'
                }
            });
            {/* <Link to="/admin#admanager">Ad Manager</Link> */ }

        } else if (action === 'Delete') {
            handleOrderDelete(order._id);
        }
    };

    const handleOrderDelete = async (id) => {
        // Show confirmation dialog
        if (window.confirm("Are you sure you want to delete this order permanently?")) {
            await fetch(`${baseUrl}/prodOrders/${id}`, {
                method: 'DELETE',
            });
            setProductsOrderData(prev => prev.filter(p => p._id !== id));
        }
    };

    return (
        <div>
            <div className='productsHeader'>
                <div className='productsHeading'>All Orders</div>
                <div className="Admin-order-search">
                    <i className="fas fa-search search-icon Admin-order-search-icon"></i>
                    <input type="text" placeholder="Search..." className='Admin-order-search-name' value={searchDate}
                        onChange={(e) => setSearchDate(e.target.value)} />
                </div>
            </div>

            <div className="order-product-table">
                <table>
                    <thead>
                        <tr>
                            <th><div className='TableOrderName'>Order ID</div></th>
                            <th><div>Product ID</div></th>
                            <th><div>Order Date</div></th>
                            <th><div>Booking Date</div></th>
                            <th><div>Status</div></th>
                            <th><div> </div></th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentProducts.map((order, index) => (
                            <tr key={index} >
                                <td className='order-TableOrderName'>{order.orderId}</td>
                                <td className='order-TableProdCode'>
                                    {(() => {
                                        if (!order.products) return '--';

                                        const validProducts = order.products.filter(p => p?.prodCode);
                                        if (validProducts.length === 0) return '--';

                                        return (
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                {validProducts.map((p, index) => (
                                                    <div key={index} className='OrderProdIdJoin'>
                                                        {p.prodCode}
                                                    </div>
                                                ))}
                                            </div>
                                        );
                                    })()}
                                </td>
                                <td>{new Date(order.createdAt).toLocaleDateString('en-GB')}</td>
                                <td>
                                    {order.products
                                        ?.filter(product => product != null) // Remove null/undefined products
                                        .map(product => (
                                            <div key={product._id} className='prodOrderDate'> {/* Now safe to access _id */}
                                                {product?.booking?.startDate
                                                    ? new Date(product.booking.startDate).toLocaleDateString("en-US", {
                                                        month: "short",
                                                        day: "numeric"
                                                    })
                                                    : "--"
                                                } - {product?.booking?.endDate
                                                    ? new Date(product.booking.endDate).toLocaleDateString("en-US", {
                                                        month: "short",
                                                        day: "numeric"
                                                    })
                                                    : "--"
                                                } <br />
                                                ({product?.booking?.totalDays || 0} Days)
                                            </div>
                                        ))
                                    }

                                </td>
                                <td>{order.status}</td>
                                <td className="order-threeDotsTd" onClick={() => toggleMenu(order._id)}>
                                    <div className="order-actionMenuRow">
                                        {/* 3 Dots */}
                                        <div >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="34" viewBox="0 0 10 34" fill="none" className='order-ThreeDotsIcon'>
                                                <path fillRule="evenodd" clipRule="evenodd"
                                                    d="M5.02241 0.373047C7.2536 0.373047 9.06365 2.18282 9.06365 4.41428C9.06365 6.64547 7.2536 8.45471 5.02241 8.45471C2.79122 8.45444 0.981445 6.64547 0.981445 4.41428C0.981445 2.18282 2.79122 0.373047 5.02241 0.373047ZM5.02241 25.4439C7.2536 25.4439 9.06365 27.2536 9.06365 29.4851C9.06365 31.7166 7.2536 33.5255 5.02241 33.5255C2.79122 33.5253 0.981445 31.7163 0.981445 29.4848C0.981445 27.2534 2.79122 25.4439 5.02241 25.4439ZM5.02241 12.9085C7.2536 12.9085 9.06365 14.7182 9.06365 16.9497C9.06365 19.1812 7.2536 20.9907 5.02241 20.9907C2.79122 20.9904 0.981445 19.1809 0.981445 16.9494C0.981445 14.718 2.79122 12.9085 5.02241 12.9085Z"
                                                    fill="#333333" />
                                            </svg>
                                        </div>

                                        {/* Action Menu */}
                                        <div className={`order-actionMenu ${menuOpenId === order._id ? 'open' : ''}`}>
                                            <i
                                                className="fa-solid fa-eye" title="Edit"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleViewOrderDetails(order)
                                                }}
                                            ></i>
                                            <i className="fa-solid fa-trash" title="Delete" onClick={() => handleAction('Delete', order)}></i>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {currentProducts.length === 0 && (
                            <tr>
                                <td colSpan="7" className="no-orders-found">
                                    <div className="no-orders-message">
                                        <i className="fas fa-exclamation-circle"></i>
                                        No orders found for the searched date
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            {/* Pagination Controls */}
            <div className="order-Productpagination d-flex justify-content-center">
                <button className="order-Productprev-button" onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                >
                    Prev
                </button>
                {getPaginationGroup().map((page, index) =>
                    page === "..." ? (
                        <span key={index} className="order-paginationDots">...</span>
                    ) : (
                        <button
                            key={index}
                            className={`order-Productpage-number ${currentPage === page ? "active" : ""}`}
                            onClick={() => setCurrentPage(page)} >
                            {page}
                        </button>
                    )
                )}
                <button className="order-Productnext-button" onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}>
                    Next
                </button>
            </div>
        </div>
    );
};

export default OrdersTable;
