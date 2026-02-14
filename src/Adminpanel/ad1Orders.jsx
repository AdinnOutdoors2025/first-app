import React, { useState, useEffect } from 'react';
import './ad1Orders.css';
import { useNavigate } from 'react-router-dom';
//BASE URL OF http://localhost:3001 FILE IMPORT 
import { baseUrl } from './BASE_URL';
//FORMATTER DATE AND TIME
import { formatIndianDateTime, formatForTable, formatBookingRange } from '../../src/DateTimeFormatter';
import { getPaginationGroup } from "../utils/pagination";

const OrdersTable = () => {
    // Handled by the admin name

    const [orderStatuses, setOrderStatuses] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState('');
    const [selectedHandler, setSelectedHandler] = useState('');

    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');

    const [reservedFrom, setReservedFrom] = useState('');
    const [reservedTo, setReservedTo] = useState('');






    const [showHandlerModal, setShowHandlerModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [handlerName, setHandlerName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [handlerError, setHandlerError] = useState('');
    const [handlerSuccess, setHandlerSuccess] = useState('');
    // Handled by the admin name

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
        }
        catch (error) {
            console.error("Error fetching orders:", error);
        }
    };
    useEffect(() => {
        fetchOrders();
    }, []);

    useEffect(() => {
        const fetchOrderStatuses = async () => {
            try {
                const res = await fetch(`${baseUrl}/getOrderStatuses`);
                const data = await res.json();
                setOrderStatuses(data.data || []);
            } catch (err) {
                console.error(err);
            }
        };

        fetchOrderStatuses();
    }, []);

    // Pagination States
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 10;
    const [searchTerm, setSearchTerm] = useState('');

    const filteredOrders = productsOrderData.filter(order => {

        /* =========================
           1️⃣ STATUS FILTER
        ========================= */
        if (selectedStatus && order.order_status !== selectedStatus) {
            return false;
        }

        /* =========================
           2️⃣ HANDLER FILTER
        ========================= */
        if (selectedHandler && order.handled_by !== selectedHandler) {
            return false;
        }

        /* =========================
           3️⃣ ORDER CREATED DATE FILTER
        ========================= */
        if (fromDate || toDate) {
            const orderDate = new Date(order.createdAt);

            if (fromDate) {
                const from = new Date(fromDate);
                from.setHours(0, 0, 0, 0);
                if (orderDate < from) return false;
            }

            if (toDate) {
                const to = new Date(toDate);
                to.setHours(23, 59, 59, 999);
                if (orderDate > to) return false;
            }
        }

        /* =========================
           4️⃣ RESERVED DATE RANGE FILTER (NEW)
           Booking overlap logic
        ========================= */
        if (reservedFrom || reservedTo) {
            const from = reservedFrom ? new Date(reservedFrom) : null;
            const to = reservedTo ? new Date(reservedTo) : null;

            if (from) from.setHours(0, 0, 0, 0);
            if (to) to.setHours(23, 59, 59, 999);

            const hasValidReservation = (order.products || []).some(product => {
                if (!product?.booking?.startDate || !product?.booking?.endDate) return false;

                const bookingStart = new Date(product.booking.startDate);
                const bookingEnd = new Date(product.booking.endDate);

                // overlap condition
                if (from && bookingEnd < from) return false;
                if (to && bookingStart > to) return false;

                return true;
            });

            if (!hasValidReservation) return false;
        }

        /* =========================
           5️⃣ SEARCH FILTER
        ========================= */
        if (!searchTerm.trim()) return true;

        const search = searchTerm.toLowerCase();

        const orderId = order.orderId?.toLowerCase() || '';
        const handler = order.handled_by?.toLowerCase() || '';
        const status = order.status?.toLowerCase() || '';
        const orderStatus = order.order_status?.toLowerCase() || '';
        const clientName = order.client?.name?.toLowerCase() || '';

        const productCodes = (order.products || [])
            .map(p => p?.prodCode?.toLowerCase())
            .join(' ');

        const formattedDate = order.createdAt
            ? formatIndianDateTime(order.createdAt).toLowerCase()
            : '';

        return (
            orderId.includes(search) ||
            handler.includes(search) ||
            status.includes(search) ||
            orderStatus.includes(search) ||
            clientName.includes(search) ||
            productCodes.includes(search) ||
            formattedDate.includes(search)
        );
    });


    const handlerOptions = Array.from(
        new Set(
            productsOrderData
                .map(o => o.handled_by)
                .filter(Boolean)
        )
    );

    // Calculate Total Pages
    const totalPages = Math.ceil(filteredOrders.length / productsPerPage);

    // Get Current Products for Display
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredOrders.slice(indexOfFirstProduct, indexOfLastProduct);

    const pages = getPaginationGroup(currentPage, totalPages);
    // 3 DOTS SECTION 
    const [menuOpenId, setMenuOpenId] = useState(null); // Use ID if multiple rows

    const toggleMenu = (id) => {
        setMenuOpenId(prevId => (prevId === id ? null : id));
    };

    const navigate = useNavigate();

    // Handled by the admin name
    // Handle view order details with handler input
    const handleViewOrderDetails = (order) => {
        setSelectedOrder(order);
        setHandlerName('');
        setHandlerError('');
        setHandlerSuccess('');

        // Check if order already has a handler
        if (order.handled_by && order.handled_by.trim() !== '') {


            // CHANGED: If order already has a handler, go directly to order details
            if (order.handled_by && order.handled_by.trim() !== '') {
                navigate('/admin#orderDetailsPg', {
                    state: {
                        order,
                        activeMenu: 'orders',
                        activeSubOrder: 'Order Info'
                    }
                });
            } else {
                // Only show modal if no handler exists
                setShowHandlerModal(true);
            }
        }
        else {
            setShowHandlerModal(true);
        }
    };

    const handleSubmitHandler = async () => {
        if (!handlerName.trim()) {
            setHandlerError('Please enter your name');
            return;
        }

        const nameRegex = /^[a-zA-Z\s]{2,50}$/;
        if (!nameRegex.test(handlerName.trim())) {
            setHandlerError('Please enter a valid name (2-50 characters, letters only)');
            return;
        }

        setIsSubmitting(true);
        setHandlerError('');
        setHandlerSuccess('');

        try {
            const response = await fetch(`${baseUrl}/prodOrders/${selectedOrder._id}/handled-by`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    handled_by: handlerName.trim(),
                    last_edited: new Date().toISOString()
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || `Server error: ${response.status}`);
            }

            setHandlerSuccess('Handler name saved successfully!');

            // Update local state
            const updatedOrders = productsOrderData.map(order =>
                order._id === selectedOrder._id
                    ? {
                        ...order,
                        handled_by: handlerName.trim(),
                        last_edited: new Date().toISOString()
                    }
                    : order
            );
            setProductsOrderData(updatedOrders);

            // Navigate to order details
            setTimeout(() => {
                navigate('/admin#orderDetailsPg', {
                    state: {
                        order: {
                            ...selectedOrder,
                            handled_by: handlerName.trim(),
                            last_edited: new Date().toISOString()
                        },
                        activeMenu: 'orders',
                        activeSubOrder: 'Order Info'
                    }
                });
                closeHandlerModal();
            }, 1000);

        } catch (error) {
            console.error('Handler submission error:', error);
            setHandlerError(error.message || 'Failed to save handler name. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };
    // Close handler modal
    const closeHandlerModal = () => {
        setShowHandlerModal(false);
        setHandlerName('');
        setHandlerError('');
        setHandlerSuccess('');
        setSelectedOrder(null);
    };

    // Handle direct navigation without entering handler
    const handleSkipHandler = () => {
        navigate('/admin#orderDetailsPg', {
            state: {
                order: selectedOrder,
                activeMenu: 'orders',
                activeSubOrder: 'Order Info'
            }
        });
        setShowHandlerModal(false);
    };

    // Handled by the admin name

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

        <div className='adminOrderTableMain'>

            {/* NEWLY ADDED Handled by admin  */}
            {/* Handler Name Modal */}
            {showHandlerModal && selectedOrder && (
                <div className="handler-modal-overlay">
                    <div className="handler-modal">
                        <div className="handler-modal-header">
                            <h3>Enter Your Name
                                {/* {selectedOrder.handled_by ? 'Update Handler' : 'Enter Your Name'} */}
                            </h3>
                            <button className="handler-modal-close" onClick={closeHandlerModal}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>

                        <div className="handler-modal-body">
                            <p className="handler-modal-instruction">
                                Please enter your name to mark yourself as handling this order.
                                {/* {selectedOrder.handled_by
                                    ? `Current handler: "${selectedOrder.handled_by}"`
                                    : 'Please enter your name to mark yourself as handling this order.'} */}

                            </p>

                            <div className="handler-input-group">
                                <label htmlFor="handlerName">
                                    Your Name *
                                    {/* {selectedOrder.handled_by ? 'New Handler Name *' : 'Your Name *'} */}
                                </label>
                                <input
                                    type="text"
                                    id="handlerName"
                                    placeholder=
                                    "Enter your full name"
                                    // {selectedOrder.handled_by
                                    //     ? "Enter new handler name"
                                    //     : "Enter your full name"}
                                    value={handlerName}
                                    onChange={(e) => setHandlerName(e.target.value)}
                                    disabled={isSubmitting}
                                    className={handlerError ? 'error' : ''}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            handleSubmitHandler();
                                        }
                                    }}
                                />
                                {handlerError && (
                                    <div className="handler-error-message">
                                        <i className="fas fa-exclamation-circle"></i>
                                        {handlerError}
                                    </div>
                                )}
                                {handlerSuccess && (
                                    <div className="handler-success-message">
                                        <i className="fas fa-check-circle"></i>
                                        {handlerSuccess}
                                    </div>
                                )}
                            </div>

                            <div className="handler-order-info">
                                <p><strong>Order ID:</strong> {selectedOrder.orderId}</p>
                                <p><strong>Client:</strong> {selectedOrder.client?.name || 'N/A'}</p>
                                {/* {selectedOrder.handled_by && (
                                    <p><strong>Current Handler:</strong> {selectedOrder.handled_by}</p>
                                )} */}
                            </div>
                        </div>

                        <div className="handler-modal-footer">
                            <button
                                className="handler-btn-skip"
                                onClick={handleSkipHandler}
                                disabled={isSubmitting}
                            >
                                Skip (View Only)
                                {/* {selectedOrder.handled_by ? 'Cancel' : 'Skip (View Only)'} */}

                            </button>
                            <button
                                className="handler-btn-submit"
                                onClick={handleSubmitHandler}
                                disabled={isSubmitting || !handlerName.trim()}
                            >
                                {isSubmitting ? (
                                    <>
                                        <span className="handler-spinner"></span>
                                        Saving...
                                        {/* {selectedOrder.handled_by ? 'Updating...' : 'Saving...'} */}
                                    </>
                                ) : (
                                    "Submit & View Order"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* NEWLY ADDED Handled by admin  */}

            {/* <div className='productsHeading'>All Orders</div> */}

            <div className='productsHeader'>
                <div>
                    <select className="Admin-order-filter" value={selectedStatus} onChange={(e) => { setSelectedStatus(e.target.value); setCurrentPage(1); }} >
                        <option value="">All Status</option>
                        {orderStatuses.map(status => (
                            <option key={status._id} value={status.name}>
                                {status.name}
                            </option>
                        ))}
                    </select>
                </div>


                <div>
                    <select
                        className="Admin-order-filter"
                        value={selectedHandler}
                        onChange={(e) => {
                            setSelectedHandler(e.target.value);
                            setCurrentPage(1);
                        }}
                    >
                        <option value="">All Handlers</option>
                        {handlerOptions.map((handler, idx) => (
                            <option key={idx} value={handler}>
                                {handler}
                            </option>
                        ))}
                    </select>
                </div>


                <div>

                    <div className="Admin-order-search">
                        <i className="fas fa-search search-icon Admin-order-search-icon"></i>

                        <input
                            type="text"
                            placeholder="Search by Order ID, Product Code, etc.."
                            className="Admin-order-search-name"
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1); // reset pagination
                            }}
                        />
                    </div>
                </div>



                {(searchTerm || selectedStatus || selectedHandler || fromDate || toDate || reservedTo) && (
                    <button
                        className="clear-all-filters"
                        onClick={() => {
                            setSearchTerm('');
                            setSelectedStatus('');
                            setSelectedHandler('');
                            setFromDate('');
                            setToDate('');
                            setReservedTo('');
                            setReservedFrom('');
                            setCurrentPage(1);
                        }}
                    >
                        Clear all
                    </button>
                )}
            </div>

            <div className="Admin-order-date-filter">
                {/* Order date filter  */}
                <div>
                    <div className="admin-orderFilterHeading">Order Date Filter</div>
                    <div className='admin-orderDateFilterMain'>
                        <div>
                            <span className="adminDate-separator">From Date</span><br></br>

                            <input
                                type="date"
                                value={fromDate}
                                onChange={(e) => {
                                    setFromDate(e.target.value);
                                    setCurrentPage(1);
                                }}
                            />
                        </div>

                        <div>
                            <span className="adminDate-separator">To Date</span> <br></br>

                            <input
                                type="date"
                                value={toDate}
                                onChange={(e) => {
                                    setToDate(e.target.value);
                                    setCurrentPage(1);
                                }}
                            />
                        </div>

                    </div>
                </div>

                <div className='productsHeading'>All Orders</div>
                {/* Reserved date filter  */}
                <div>
                    <div className="admin-orderFilterHeading" >Reserved Date Filter</div>
                    <div className='admin-orderDateFilterMain' >
                        <div>
                            <span className="adminDate-separator">From Date</span><br></br>

                            <input
                                type="date"
                                value={reservedFrom}
                                onChange={(e) => {
                                    setReservedFrom(e.target.value);
                                    setCurrentPage(1);
                                }}
                            />
                        </div>

                        <div>
                            <span className="adminDate-separator">To Date</span> <br></br>

                            <input
                                type="date"
                                value={reservedTo}
                                onChange={(e) => {
                                    setReservedTo(e.target.value);
                                    setCurrentPage(1);
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>


            <div className="order-product-table">
                <table>
                    <thead>
                        <tr>
                            <th><div className='TableOrderName'>Order ID</div></th>
                            <th><div>Product ID</div></th>
                            <th><div>Order Date & Time</div></th>
                            <th><div>Reserved</div></th>
                            <th><div>Submitter</div></th>
                            <th><div>Handler</div></th>
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
                                {/* <td>{new Date(order.createdAt).toLocaleDateString('en-GB')}</td> */}
                                <td>
                                    <div className="order-date-time">
                                        <div className="order-date-main">
                                            {formatIndianDateTime(order.createdAt)}
                                        </div>
                                        {/* <div className="order-time-small">
                                            {formatForTable(order.createdAt)}
                                        </div> */}
                                    </div>
                                </td>
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
                                {/* <td>{order.status}</td>
                                <td>{order.handled_by ? order.handled_by : "-"}</td>
                                <td>{order.order_status}</td> */}


                                <td>
                                    {(() => {
                                        // Display "UserOrder" for user orders, "Added Manually" for admin orders
                                        if (order.status === "UserOrder") {
                                            return "UserOrder";
                                        } else if (order.status === "Manual Entry") {
                                            return "Manual Entry";
                                        } else {
                                            return order.status || "-";
                                        }
                                    })()}
                                </td>

                                <td>{order.handled_by ? order.handled_by : "-"}</td>
                                <td>
                                    {(() => {
                                        // Display order_status if available, otherwise show status
                                        if (order.order_status && order.order_status !== "pending") {
                                            return order.order_status;
                                        } else if (order.status === "UserOrder") {
                                            return "Payment Pending";
                                        } else {
                                            return order.status || "-";
                                        }
                                    })()}
                                </td>


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
                {pages.map((page, index) =>
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