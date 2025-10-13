



import React, { useState, useEffect } from 'react';
import './ad1products.css';
import { useNavigate } from 'react-router-dom';
import { baseUrl } from './BASE_URL';

const OfferProductTable = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [selectedFilter, setSelectedFilter] = useState("View All");
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [menuOpenId, setMenuOpenId] = useState(null);
    const productsPerPage = 10;

    // // Timer states
    // const [timer, setTimer] = useState({ hours: 0, minutes: 0, seconds: 0 });
    // const [isRunning, setIsRunning] = useState(false);
    // const [totalSeconds, setTotalSeconds] = useState(0);


    // // Load timer from localStorage on component mount
    // useEffect(() => {
    //     const savedTimer = localStorage.getItem('offerProductTimer');
    //     const savedIsRunning = localStorage.getItem('offerProductTimerRunning');
    //     const savedTotalSeconds = localStorage.getItem('offerProductTotalSeconds');
    //     const timerStartTime = localStorage.getItem('offerProductTimerStartTime');

    //     if (savedTimer && savedTotalSeconds) {
    //         const parsedTimer = JSON.parse(savedTimer);
    //         const parsedTotalSeconds = parseInt(savedTotalSeconds);
            
    //         setTimer(parsedTimer);
    //         setTotalSeconds(parsedTotalSeconds);

    //         if (savedIsRunning === 'true' && timerStartTime) {
    //             // Calculate elapsed time since the timer was started
    //             const startTime = parseInt(timerStartTime);
    //             const currentTime = Math.floor(Date.now() / 1000);
    //             const elapsedSeconds = currentTime - startTime;
    //             const remainingSeconds = Math.max(0, parsedTotalSeconds - elapsedSeconds);
                
    //             if (remainingSeconds > 0) {
    //                 setTotalSeconds(remainingSeconds);
    //                 updateTimerDisplay(remainingSeconds);
    //                 setIsRunning(true);
    //             } else {
    //                 // Timer has expired
    //                 resetTimer();
    //             }
    //         }
    //     }
    // }, []);

    // // Timer effect
    // useEffect(() => {
    //     let intervalId;

    //     if (isRunning && totalSeconds > 0) {
    //         intervalId = setInterval(() => {
    //             setTotalSeconds(prevSeconds => {
    //                 const newSeconds = prevSeconds - 1;
                    
    //                 if (newSeconds <= 0) {
    //                     clearInterval(intervalId);
    //                     setIsRunning(false);
    //                     localStorage.removeItem('offerProductTimer');
    //                     localStorage.removeItem('offerProductTimerRunning');
    //                     localStorage.removeItem('offerProductTotalSeconds');
    //                     localStorage.removeItem('offerProductTimerStartTime');
    //                     return 0;
    //                 }
                    
    //                 updateTimerDisplay(newSeconds);
    //                 return newSeconds;
    //             });
    //         }, 1000);
    //     }

    //     return () => clearInterval(intervalId);
    // }, [isRunning]);

    // const updateTimerDisplay = (seconds) => {
    //     const hours = Math.floor(seconds / 3600);
    //     const minutes = Math.floor((seconds % 3600) / 60);
    //     const secs = seconds % 60;
        
    //     setTimer({
    //         hours: hours,
    //         minutes: minutes,
    //         seconds: secs
    //     });

    //     // Save current state to localStorage
    //     localStorage.setItem('offerProductTimer', JSON.stringify({ hours, minutes, seconds: secs }));
    // };

    // const formatTimeUnit = (unit) => {
    //     return unit < 10 ? `0${unit}` : unit.toString();
    // };

    // const handleTimerInput = (unit, value) => {
    //     if (!isRunning) {
    //         const numValue = parseInt(value) || 0;
    //         let newTimer = { ...timer };
            
    //         switch (unit) {
    //             case 'hours':
    //                 newTimer.hours = Math.min(99, Math.max(0, numValue));
    //                 break;
    //             case 'minutes':
    //                 newTimer.minutes = Math.min(59, Math.max(0, numValue));
    //                 break;
    //             case 'seconds':
    //                 newTimer.seconds = Math.min(59, Math.max(0, numValue));
    //                 break;
    //             default:
    //                 break;
    //         }
            
    //         setTimer(newTimer);
            
    //         // Calculate total seconds
    //         const totalSecs = (newTimer.hours * 3600) + (newTimer.minutes * 60) + newTimer.seconds;
    //         setTotalSeconds(totalSecs);
            
    //         // Save to localStorage
    //         localStorage.setItem('offerProductTimer', JSON.stringify(newTimer));
    //         localStorage.setItem('offerProductTotalSeconds', totalSecs.toString());
    //     }
    // };

    // const startTimer = () => {
    //     if (totalSeconds > 0) {
    //         setIsRunning(true);
    //         const startTime = Math.floor(Date.now() / 1000);
    //         localStorage.setItem('offerProductTimerRunning', 'true');
    //         localStorage.setItem('offerProductTimerStartTime', startTime.toString());
    //     }
    // };

    // const pauseTimer = () => {
    //     setIsRunning(false);
    //     localStorage.setItem('offerProductTimerRunning', 'false');
    // };

    // const resetTimer = () => {
    //     setIsRunning(false);
    //     setTimer({ hours: 0, minutes: 0, seconds: 0 });
    //     setTotalSeconds(0);
        
    //     // Clear localStorage
    //     localStorage.removeItem('offerProductTimer');
    //     localStorage.removeItem('offerProductTimerRunning');
    //     localStorage.removeItem('offerProductTotalSeconds');
    //     localStorage.removeItem('offerProductTimerStartTime');
    // };
    
    // Fetch offer products
   
   
   
   
   
   
   
   





    // Timer states
  
  
  
  
    const [timer, setTimer] = useState({ hours: 0, minutes: 0, seconds: 0 });
    const [isRunning, setIsRunning] = useState(false);
    const [totalSeconds, setTotalSeconds] = useState(0);

    // Fetch timer from backend on component mount
    useEffect(() => {
        fetchTimer();
    }, []);

    const fetchTimer = async () => {
        try {
            const response = await fetch(`${baseUrl}/DealTimerRun/timer`);
            if (!response.ok) throw new Error('Failed to fetch timer');
            
            const timerData = await response.json();
            
            setTimer({
                hours: timerData.hours,
                minutes: timerData.minutes,
                seconds: timerData.seconds
            });
            setTotalSeconds(timerData.totalSeconds);
            setIsRunning(timerData.isRunning);
        } catch (error) {
            console.error('Error fetching timer:', error);
            // Initialize with default values if fetch fails
            setTimer({ hours: 0, minutes: 0, seconds: 0 });
            setTotalSeconds(0);
            setIsRunning(false);
        }
    };

    // Update timer in backend
    const updateTimerInBackend = async (timerData, isRunning, totalSecs) => {
        try {
            await fetch(`${baseUrl}/DealTimerRun/timer`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    hours: timerData.hours,
                    minutes: timerData.minutes,
                    seconds: timerData.seconds,
                    isRunning: isRunning
                }),
            });
        } catch (error) {
            console.error('Error updating timer in backend:', error);
        }
    };

    // Timer effect
    useEffect(() => {
        let intervalId;

        if (isRunning && totalSeconds > 0) {
            intervalId = setInterval(() => {
                setTotalSeconds(prevSeconds => {
                    const newSeconds = prevSeconds - 1;
                    
                    if (newSeconds <= 0) {
                        clearInterval(intervalId);
                        setIsRunning(false);
                        
                        // Update backend when timer ends
                        const expiredTimer = { hours: 0, minutes: 0, seconds: 0 };
                        setTimer(expiredTimer);
                        updateTimerInBackend(expiredTimer, false, 0);
                        
                        return 0;
                    }
                    
                    updateTimerDisplay(newSeconds);
                    return newSeconds;
                });
            }, 1000);
        }

        return () => clearInterval(intervalId);
    }, [isRunning]);

    const updateTimerDisplay = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        
        const newTimer = { hours, minutes, seconds: secs };
        setTimer(newTimer);
        
        // Update backend with current timer state
        if (isRunning) {
            updateTimerInBackend(newTimer, true, seconds);
        }
    };

    const formatTimeUnit = (unit) => {
        return unit < 10 ? `0${unit}` : unit.toString();
    };

    const handleTimerInput = async (unit, value) => {
        if (!isRunning) {
            const numValue = parseInt(value) || 0;
            let newTimer = { ...timer };
            
            switch (unit) {
                case 'hours':
                    newTimer.hours = Math.min(99, Math.max(0, numValue));
                    break;
                case 'minutes':
                    newTimer.minutes = Math.min(59, Math.max(0, numValue));
                    break;
                case 'seconds':
                    newTimer.seconds = Math.min(59, Math.max(0, numValue));
                    break;
                default:
                    break;
            }
            
            setTimer(newTimer);
            
            // Calculate total seconds
            const totalSecs = (newTimer.hours * 3600) + (newTimer.minutes * 60) + newTimer.seconds;
            setTotalSeconds(totalSecs);
            
            // Update backend
            await updateTimerInBackend(newTimer, false, totalSecs);
        }
    };

    const startTimer = async () => {
        if (totalSeconds > 0) {
            setIsRunning(true);
            await updateTimerInBackend(timer, true, totalSeconds);
        }
    };

    const pauseTimer = async () => {
        setIsRunning(false);
        await updateTimerInBackend(timer, false, totalSeconds);
    };

    const resetTimer = async () => {
        setIsRunning(false);
        const resetTimerData = { hours: 0, minutes: 0, seconds: 0 };
        setTimer(resetTimerData);
        setTotalSeconds(0);
        
        try {
            await fetch(`${baseUrl}/DealTimerRun/timer/reset`, {
                method: 'DELETE',
            });
        } catch (error) {
            console.error('Error resetting timer in backend:', error);
        }
    };
   
   
   
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await fetch(`${baseUrl}/OfferedProduct/offerProduct`);

                if (!response.ok) {
                    throw new Error(`Failed to fetch products: ${response.status}`);
                }

                const data = await response.json();
                console.log('Fetched offer products:', data); // Debug log

                const productsWithVisibility = data.map((product) => ({
                    ...product,
                    visible: product.visible !== false,
                }));
                
                const sortedProducts = productsWithVisibility.sort((a, b) => b.visible - a.visible);
                setProducts(sortedProducts);
                setFilteredProducts(sortedProducts);
            } catch (err) {
                console.error('Error fetching products:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    // Handle delete product
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this product permanently?")) {
            try {
                const response = await fetch(`${baseUrl}/OfferedProduct/offerProduct/${id}`, {
                    method: 'DELETE',
                });

                if (!response.ok) {
                    throw new Error('Failed to delete product');
                }

                setProducts(prev => prev.filter(p => p._id !== id));
                setFilteredProducts(prev => prev.filter(p => p._id !== id));
            } catch (error) {
                console.error('Error deleting product:', error);
                alert("Error deleting product");
            }
        }
    };

    // Edit product
    const handleAction = (action, product) => {
        if (action === 'Edit') {
            navigate('/admin#EditOfferProduct', { 
                state: { 
                    editOffProd: product,
                    activeOfferProducts: "Add Offers"
                } 
            });
        } else if (action === 'Delete') {
            handleDelete(product._id);
        }
    };

    // Toggle visibility
    const toggleVisibility = async (productId, currentVisibility) => {
        const message = currentVisibility ? "Wants to hide the product" : "Wants to show the product";
        if (!window.confirm(message)) return;

        try {
            const response = await fetch(`${baseUrl}/OfferedProduct/offerProduct/${productId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ visible: !currentVisibility }),
            });

            if (!response.ok) {
                throw new Error('Failed to update visibility');
            }

            const updatedProduct = await response.json();

            setProducts(prev => {
                const updated = prev.map(p =>
                    p._id === productId ? { ...p, visible: !currentVisibility } : p
                );
                const sorted = updated.sort((a, b) => b.visible - a.visible);
                setFilteredProducts(sorted);
                return sorted;
            });
        } catch (error) {
            console.error('Error updating visibility:', error);
            alert("Error changing product visibility");
        }
    };

    // Filter products
    useEffect(() => {
        let filtered;
        switch (selectedFilter) {
            case "Hidden Products":
                filtered = products.filter(p => !p.visible);
                break;
            case "5 Star Ratings":
                filtered = products.filter(p => Math.floor(p.rating) === 5);
                break;
            default: // View All
                filtered = products;
        }
        setFilteredProducts(filtered);
        setCurrentPage(1);
    }, [selectedFilter, products]);

    // Pagination
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

    const getPaginationGroup = () => {
        let pages = [];
        const maxPagesToShow = 3;

        if (totalPages <= 6) {
            pages = Array.from({ length: totalPages }, (_, i) => i + 1);
        } else {
            if (currentPage <= maxPagesToShow + 1) {
                pages = [...Array(maxPagesToShow + 1).keys()].map((i) => i + 1);
                pages.push("...", totalPages - 1, totalPages);
            } else if (currentPage >= totalPages - maxPagesToShow) {
                pages = [1, 2, "..."];
                pages.push(...Array.from({ length: maxPagesToShow + 1 }, (_, i) => totalPages - maxPagesToShow + i));
            } else {
                pages = [1, 2, "..."];
                pages.push(currentPage - 1, currentPage, currentPage + 1);
                pages.push("...", totalPages - 1, totalPages);
            }
        }
        return pages;
    };

    const toggleMenu = (id) => {
        setMenuOpenId(prevId => (prevId === id ? null : id));
    };

    // Render different states
    if (loading) {
        return (
            <div className="admin-products-loading">
                <div className="admin-spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p>Loading products...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="admin-products-error">
                <div className="alert alert-danger" role="alert">
                    Error loading products: {error}
                </div>
                <button
                    className="btn btn-primary"
                    onClick={() => window.location.reload()}
                >
                    Retry
                </button>
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className="admin-no-products">
                <div className="alert alert-info" role="alert">
                    No offer products available. Please add some offer products in the admin panel.
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className='productsHeader'>
                <div className='productsHeading'>Offered Products</div>

                {/* TIMER START AND RESET */}
                <div className='OffProdTimerMain'>
                    <div className='OffProdNumberSetup'>
                        <input
                            type="number"
                            min="0"
                            max="99"
                            value={formatTimeUnit(timer.hours)}
                            onChange={(e) => handleTimerInput('hours', e.target.value)}
                            className={`timer-input ${isRunning ? 'disabled' : ''}`}
                            disabled={isRunning}
                        />
                        <span className='timer-separator'>:</span>
                        <input
                            type="number"
                            min="0"
                            max="59"
                            value={formatTimeUnit(timer.minutes)}
                            onChange={(e) => handleTimerInput('minutes', e.target.value)}
                            className={`timer-input ${isRunning ? 'disabled' : ''}`}
                            disabled={isRunning}
                        />
                        <span className='timer-separator'>:</span>
                        <input
                            type="number"
                            min="0"
                            max="59"
                            value={formatTimeUnit(timer.seconds)}
                            onChange={(e) => handleTimerInput('seconds', e.target.value)}
                            className={`timer-input ${isRunning ? 'disabled' : ''}`}
                            disabled={isRunning}
                        />
                    </div>
                    
                    <div className='OffProdResetBtn' onClick={resetTimer}>
                        <img src='./images/RefreshIconTimer11.svg' alt="Reset" />
                        Reset
                    </div>
                    
                    {!isRunning ? (
                        <div className='OffProdStartBtn' onClick={startTimer}>
                            <span className='offProdStartIcon'> ▶ </span>
                            Start
                        </div>
                    ) : (
                        <div className='OffProdPauseBtn' onClick={pauseTimer}>
                            <span className='offProdPauseIcon'> ❚❚ </span>
                            Pause
                        </div>
                    )}
                </div>

                <div>
                    <select 
                        className='ProductsInputSelect' 
                        value={selectedFilter}
                        onChange={(e) => setSelectedFilter(e.target.value)}
                    >
                        <option value="View All">View All</option>
                        <option value='Hidden Products'>Hidden Products</option>
                        <option value='5 Star Ratings'>5 Star Ratings</option>
                    </select>
                </div>
            </div>
            <div className="product-table">
                <table>
                    <thead>
                        <tr className='adminProdHeadContent'>
                            <th>Products</th>
                            <th className='TableProductName'>Name</th>
                            <th>SQ.ID</th>
                            <th>Actual Price</th>
                            <th>Offered Price</th>
                            <th>Size</th>
                            <th>Ratings</th>
                            <th> </th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentProducts.length > 0 ? (
                            currentProducts.map((product) => (
                                <tr 
                                    key={product._id} 
                                    className={`product-row adminProdRowContent ${!product.visible ? 'disabled' : ''}`}
                                >
                                    <td>
                                        <img src={product.image} alt="Product" className='productImg' />
                                    </td>
                                    <td className='TableProductName'>{product.name}</td>
                                    <td>{product.originalProductId}</td>
                                    <td className='TableProductPrice'>₹{product.originalPrice}</td>
                                    <td className='TableProductPrice'>₹{product.offerPrice}</td>
                                    <td>
                                        {product.size?.width} X {product.size?.height} | {product.size?.squareFeet} Sq.ft
                                    </td>
                                    <td>
                                        <div className='d-flex productRate'>
                                            <div>
                                                <span className="fa-solid fa-star stars-book-admin"></span>
                                            </div>
                                            <div>
                                                {product.rating}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="threeDotsTd offProdThreeDotsTd" onClick={() => toggleMenu(product._id)}>
                                        <div className="actionMenuRow">
                                            <div>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="34" viewBox="0 0 10 34" fill="none" className='ThreeDotsIcon'>
                                                    <path fillRule="evenodd" clipRule="evenodd"
                                                        d="M5.02241 0.373047C7.2536 0.373047 9.06365 2.18282 9.06365 4.41428C9.06365 6.64547 7.2536 8.45471 5.02241 8.45471C2.79122 8.45444 0.981445 6.64547 0.981445 4.41428C0.981445 2.18282 2.79122 0.373047 5.02241 0.373047ZM5.02241 25.4439C7.2536 25.4439 9.06365 27.2536 9.06365 29.4851C9.06365 31.7166 7.2536 33.5255 5.02241 33.5255C2.79122 33.5253 0.981445 31.7163 0.981445 29.4848C0.981445 27.2534 2.79122 25.4439 5.02241 25.4439ZM5.02241 12.9085C7.2536 12.9085 9.06365 14.7182 9.06365 16.9497C9.06365 19.1812 7.2536 20.9907 5.02241 20.9907C2.79122 20.9904 0.981445 19.1809 0.981445 16.9494C0.981445 14.718 2.79122 12.9085 5.02241 12.9085Z"
                                                        fill="#333333" />
                                                </svg>
                                            </div>

                                            {/* Action Menu */}
                                            <div className={`actionMenu offProdActionMenu ${menuOpenId === product._id ? 'open' : ''}`}>
                                                <i
                                                    className={`fa-solid ${product.visible ? 'fa-eye' : 'fa-eye-slash'}`}
                                                    title={product.visible ? "Hide" : "Unhide"}
                                                    onClick={() => toggleVisibility(product._id, product.visible)}
                                                ></i>
                                                <i 
                                                    className="fa-solid fa-pen" 
                                                    title="Edit" 
                                                    onClick={() => handleAction('Edit', product)}
                                                ></i>
                                                <i 
                                                    className="fa-solid fa-trash" 
                                                    title="Delete" 
                                                    onClick={() => handleAction('Delete', product)}
                                                ></i>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8" className="text-center py-4">
                                    No products match the selected filter.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            {filteredProducts.length > 0 && (
                <div className="Productpagination d-flex justify-content-center">
                    <button 
                        className="Productprev-button" 
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        Prev
                    </button>

                    {getPaginationGroup().map((page, index) =>
                        page === "..." ? (
                            <span key={index} className="paginationDots">...</span>
                        ) : (
                            <button
                                key={index}
                                className={`Productpage-number ${currentPage === page ? "active" : ""}`}
                                onClick={() => setCurrentPage(page)}
                            >
                                {page}
                            </button>
                        )
                    )}
                    <button 
                        className="Productnext-button" 
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default OfferProductTable;

