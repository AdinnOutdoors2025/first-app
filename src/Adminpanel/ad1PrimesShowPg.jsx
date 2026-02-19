import React, { useState, useEffect } from 'react';
import './ad1products.css';
import { useNavigate } from 'react-router-dom';
import { baseUrl } from './BASE_URL';
import { getPaginationGroup } from "../utils/pagination";
import { formatIndianCurrency } from '../components/FORMATED_AMOUNT';

const PrimeSpotsTable = () => {
    const [searchTerm, setSearchTerm] = useState('');
    // 🟢 SIZE RANGE FILTER (NEW)
    const [sizeRange, setSizeRange] = useState([0, 10000]); // sqft

    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [selectedFilter, setSelectedFilter] = useState("Prime Spots");
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [menuOpenId, setMenuOpenId] = useState(null);
    const [totalPrimeCount, setTotalPrimeCount] = useState(0);
    const [totalRegularCount, setTotalRegularCount] = useState(0);
    const [totalAllCount, setTotalAllCount] = useState(0);
    const productsPerPage = 10;

    // Fetch products with prime status
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                setError(null);

                // Fetch all products
                const response = await fetch(`${baseUrl}/products`);

                if (!response.ok) {
                    throw new Error(`Failed to fetch products: ${response.status}`);
                }

                const allProducts = await response.json();

                console.log('Fetched all products:', allProducts.length);

                // Process products and count prime/regular
                const processedProducts = allProducts.map((product) => ({
                    ...product,
                    visible: product.visible !== false,
                    isPrime: product.isPrime || 0,
                    primeUpdatedAt: product.primeUpdatedAt || product.updatedAt
                }));

                // Calculate counts
                const primeCount = processedProducts.filter(p => p.isPrime === 1).length;
                const regularCount = processedProducts.filter(p => p.isPrime === 0).length;
                const allCount = processedProducts.length;

                setTotalPrimeCount(primeCount);
                setTotalRegularCount(regularCount);
                setTotalAllCount(allCount);

                // Sort: Prime first, then by primeUpdatedAt, then by createdAt
                const sortedProducts = processedProducts.sort((a, b) => {
                    // Prime products first
                    if (b.isPrime !== a.isPrime) {
                        return b.isPrime - a.isPrime;
                    }
                    // Then by prime update time (most recent first)
                    if (a.isPrime === 1 && b.isPrime === 1) {
                        const timeA = a.primeUpdatedAt ? new Date(a.primeUpdatedAt) : new Date(0);
                        const timeB = b.primeUpdatedAt ? new Date(b.primeUpdatedAt) : new Date(0);
                        return timeB - timeA;
                    }
                    // Then by visibility
                    if (b.visible !== a.visible) {
                        return b.visible - a.visible;
                    }
                    // Finally by creation date
                    return new Date(b.createdAt || b.updatedAt) - new Date(a.createdAt || a.updatedAt);
                });

                setProducts(sortedProducts);
                // Initialize filtered products with prime spots
                const initialFiltered = sortedProducts.filter(p => p.isPrime === 1);
                setFilteredProducts(initialFiltered);
            } catch (err) {
                console.error('Error fetching products:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    // Filter products when selectedFilter changes
    useEffect(() => {
        let filtered;
        const normalize = (str) => str.replace(/\s+/g, '').toLowerCase();

        // 1️⃣ DROPDOWN FILTER
        switch (selectedFilter) {
            case "Hidden Products":
                filtered = products.filter(p => !p.visible);
                break;
            case "Prime Spots":
                filtered = products.filter(p => p.isPrime === 1);
                break;
            case "Regular Spots":
                filtered = products.filter(p => p.isPrime === 0);
                break;
            case "View All":
                filtered = products;
                break;
            default:
                filtered = products.filter(p => p.isPrime === 1);
        }

        // 2️⃣ SEARCH FILTER
        if (searchTerm.trim()) {
            const search = searchTerm.toLowerCase();

            filtered = filtered.filter(p =>
                p.name?.toLowerCase().includes(search) ||
                p.prodCode?.toLowerCase().includes(search) ||
                p.price?.toString().includes(search) ||
                p.rating?.toString().includes(search) ||
                normalize(`${p.width}x${p.height} ${p.width * p.height} sqft`).includes(search)
            );
        }

        // 3️⃣ SIZE RANGE FILTER ✅ (FIXED POSITION)
        filtered = filtered.filter(p => {
            const size = (p.width || 0) * (p.height || 0);
            return size >= sizeRange[0] && size <= sizeRange[1];
        });

        // ✅ UPDATE STATE ONCE (IMPORTANT)
        setFilteredProducts(filtered);
        setCurrentPage(1);

    }, [selectedFilter, products, searchTerm, sizeRange]);



    // Toggle Prime Status
    const togglePrimeStatus = async (productId, currentPrimeStatus) => {
        const newStatus = currentPrimeStatus === 1 ? 0 : 1;
        const message = `Change Prime Status from ${currentPrimeStatus === 1 ? 'Prime' : 'Regular'} to ${newStatus === 1 ? 'Prime' : 'Regular'}?`;

        if (!window.confirm(message)) return;

        try {
            const response = await fetch(`${baseUrl}/products/${productId}/mark-prime`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isPrime: newStatus }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Failed to update prime status');
            }

            // Update local state
            setProducts(prev => {
                const updated = prev.map(p => {
                    if (p._id === productId) {
                        return {
                            ...p,
                            isPrime: newStatus,
                            primeUpdatedAt: new Date().toISOString()
                        };
                    }
                    return p;
                });

                // Update counts
                if (newStatus === 1) {
                    setTotalPrimeCount(prev => prev + 1);
                    setTotalRegularCount(prev => prev - 1);
                } else {
                    setTotalPrimeCount(prev => prev - 1);
                    setTotalRegularCount(prev => prev + 1);
                }

                // Re-sort after update
                return updated.sort((a, b) => {
                    if (b.isPrime !== a.isPrime) return b.isPrime - a.isPrime;
                    if (a.isPrime === 1 && b.isPrime === 1) {
                        const timeA = a.primeUpdatedAt ? new Date(a.primeUpdatedAt) : new Date(0);
                        const timeB = b.primeUpdatedAt ? new Date(b.primeUpdatedAt) : new Date(0);
                        return timeB - timeA;
                    }
                    return new Date(b.createdAt || b.updatedAt) - new Date(a.createdAt || a.updatedAt);
                });
            });

            // Also update filtered products
            if (selectedFilter === "Prime Spots" && newStatus === 0) {
                setFilteredProducts(prev => prev.filter(p => p._id !== productId));
            } else if (selectedFilter === "Regular Spots" && newStatus === 1) {
                setFilteredProducts(prev => prev.filter(p => p._id !== productId));
            }

            alert(`Prime status updated to ${newStatus === 1 ? 'Prime Spot' : 'Regular Spot'}`);
        } catch (error) {
            console.error('Error updating prime status:', error);
            alert(`Error changing prime status: ${error.message}`);
        }
    };

    // Handle delete product
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this product permanently?")) {
            try {
                const response = await fetch(`${baseUrl}/products/${id}`, {
                    method: 'DELETE',
                });

                if (!response.ok) {
                    throw new Error('Failed to delete product');
                }

                const deletedProduct = products.find(p => p._id === id);
                if (deletedProduct?.isPrime === 1) {
                    setTotalPrimeCount(prev => prev - 1);
                } else {
                    setTotalRegularCount(prev => prev - 1);
                }
                setTotalAllCount(prev => prev - 1);

                setProducts(prev => prev.filter(p => p._id !== id));
                setFilteredProducts(prev => prev.filter(p => p._id !== id));
                alert("Product deleted successfully!");
            } catch (error) {
                console.error('Error deleting product:', error);
                alert("Error deleting product");
            }
        }
    };

    // Edit prime status
    const handleEdit = (product) => {
        navigate('/admin#AddPrimeSpots', {
            state: {
                editProduct: product,
                activePrimeSpots: "Add Primes"
            }
        });
    };

    // Toggle visibility
    const toggleVisibility = async (productId, currentVisibility) => {
        const message = currentVisibility ? "Wants to hide the product" : "Wants to show the product";
        if (!window.confirm(message)) return;

        try {
            const response = await fetch(`${baseUrl}/products/${productId}`, {
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
                return updated.sort((a, b) => {
                    if (b.visible !== a.visible) return b.visible - a.visible;
                    if (b.isPrime !== a.isPrime) return b.isPrime - a.isPrime;
                    return new Date(b.createdAt || b.updatedAt) - new Date(a.createdAt || a.updatedAt);
                });
            });
        } catch (error) {
            console.error('Error updating visibility:', error);
            alert("Error changing product visibility");
        }
    };

    // Pagination
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);


    const pages = getPaginationGroup(currentPage, totalPages);
    const toggleMenu = (id) => {
        setMenuOpenId(prevId => (prevId === id ? null : id));
    };

    // Format date for display
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Render Prime Status column
    const renderPrimeStatus = (isPrime, primeUpdatedAt) => {
        if (isPrime === 1) {
            return (
                <div>
                    <span className="prime-badge active">
                        <i className="fa-solid fa-crown" style={{ marginRight: '4px' }}></i>
                        Prime
                    </span>
                    {primeUpdatedAt && (
                        <div className="prime-updated-time">
                            Updated: {formatDate(primeUpdatedAt)}
                        </div>
                    )}
                </div>
            );
        } else if (isPrime === 0) {
            return (
                <span className="prime-badge inactive">
                    <i className="fa-solid fa-star" style={{ marginRight: '4px' }}></i>
                    Regular
                </span>
            );
        } else {
            return (
                <span className="prime-badge undefined">
                    <i className="fa-solid fa-question" style={{ marginRight: '4px' }}></i>
                    Not Set
                </span>
            );
        }
    };

    // 🟢 Calculate size limits dynamically (NEW)
    const sizes = products.map(p => (p.width || 0) * (p.height || 0));
    const minSize = sizes.length ? Math.min(...sizes) : 0;
    const maxSize = sizes.length ? Math.max(...sizes) : 10000;


    if (loading) {
        return (
            <div className="admin-products-loading">
                <div className="admin-spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p>Loading prime spots...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="admin-products-error">
                <div className="alert alert-danger" role="alert">
                    Error loading prime spots: {error}
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

    return (
        <div>
            {/* <div className='productsHeader'> */}
            <div id="primeSpotsSection" className='productsHeader'>
                <div className='productsHeading'>Prime Advertising Spots</div>

            <div>
                <div className='productsHeader'>
                    <div className='productsHeading'>Prime Advertising Spots</div>
                    <div className="prime-stats">
                        <span className="prime-stat-item" style={{ color: '#ffc107', marginRight: '15px' }}>
                            <i className="fa-solid fa-crown"></i> Prime: {totalPrimeCount}
                        </span>
                        <span className="prime-stat-item" style={{ color: '#6c757d', marginRight: '15px' }}>
                            <i className="fa-solid fa-star"></i> Regular: {totalRegularCount}
                        </span>
                        <span className="prime-stat-item" style={{ color: '#007bff' }}>
                            <i className="fa-solid fa-layer-group"></i> Total: {totalAllCount}
                        </span>
                    </div>


                  
                </div>

                  <div className='adminPrimeProdFilterMain'>


                        <div className="size-slider-wrapper">
                            {/* <label className="size-label">
                                Size (Sq.ft)
                            </label> */}

                            {/* LIVE VALUES */}
                            <div className="size-values">
                                <span>{sizeRange[0]} Sq.ft</span>
                                <span>{sizeRange[1]} Sq.ft</span>
                            </div>

                            <div className="size-slider">
                                <input
                                    type="range"
                                    min={minSize}
                                    max={maxSize}
                                    value={sizeRange[0]}
                                    onChange={(e) =>
                                        setSizeRange([Number(e.target.value), sizeRange[1]])
                                    }
                                />

                                <input
                                    type="range"
                                    min={minSize}
                                    max={maxSize}
                                    value={sizeRange[1]}
                                    onChange={(e) =>
                                        setSizeRange([sizeRange[0], Number(e.target.value)])
                                    }
                                />
                            </div>

                            {/* HELPER TEXT */}
                            <div className="size-helper-text">
                                Drag the sliders to select the minimum and maximum size (in Sq.ft).
                            </div>
                        </div>



                        <div className="search-wrapper">
                            <input
                                type="text"
                                placeholder="Type to search the Prime Spots..."
                                className="ProductsSearchInput"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />

                            {searchTerm && (
                                <span
                                    className="clear-search"
                                    onClick={() => setSearchTerm('')}
                                    title="Clear search"
                                >
                                    ✕
                                </span>
                            )}
                        </div>


                        <div>
                            <select
                                className='ProductsInputSelect'
                                value={selectedFilter}
                                onChange={(e) => setSelectedFilter(e.target.value)}
                            >
                                <option value="Prime Spots">Prime Spots</option>
                                <option value="Regular Spots">Regular Spots </option>
                                <option value="View All">View All </option>
                                <option value='Hidden Products'>Hidden Spots</option>
                            </select>
                        </div>
                    </div>

                {filteredProducts.length === 0 && selectedFilter === "Prime Spots" ? (
                    <div className="admin-no-products">
                        <div className="alert alert-info" role="alert">
                            <i className="fa-solid fa-crown me-2"></i>
                            No Prime Spots found. Click below to add your first Prime Spot.
                        </div>
                        <button
                            className="btn btn-primary"
                            onClick={() => navigate('/admin#AddPrimeSpots')}
                        >
                            <i className="fa-solid fa-plus"></i> Add Prime Spot
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="product-table">
                            <table>
                                <thead>
                                    <tr className='adminProdHeadContent'>
                                        <th>Products</th>
                                        <th className='TableProductName'>Name</th>
                                        <th>Product Code</th>
                                        <th>Price</th>
                                        <th>Prime Status</th>
                                        <th>Size</th>
                                        <th>Ratings</th>
                                        <th>Last Updated</th>
                                        <th> </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentProducts.length > 0 ? (
                                        currentProducts.map((product) => (

                                            <tr
                                                key={product._id}
                                                className={`product-row adminProdRowContent ${!product.visible ? 'disabled' : ''} ${product.isPrime === 1 ? 'prime-spot-row' : ''}`}>
                                                <td>
                                                    <img src={product.image} alt="Product" className='productImg' />
                                                </td>
                                                <td className='TableProductName'>{product.name}</td>
                                                <td>
                                                    <div className="product-code-cell">
                                                        {product.prodCode}
                                                        {product.isPrime === 1 && (
                                                            <span className="product-code-prime-badge">
                                                                <i className="fa-solid fa-crown"></i>
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className='TableProductPrice'>{formatIndianCurrency(product.price, true)}</td>
                                                <td>
                                                    {renderPrimeStatus(product.isPrime, product.primeUpdatedAt)}
                                                </td>
                                                <td>
                                                    {product.width} X {product.height} | {(product.width * product.height).toFixed(2)} Sq.ft
                                                </td>
                                                <td>
                                                    <div className='d-flex productRate'>
                                                        <div>
                                                            <span className="fa-solid fa-star stars-book-admin"></span>
                                                        </div>
                                                        <div>
                                                            {product.rating || 0}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    {formatDate(product.primeUpdatedAt || product.updatedAt)}
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
                                                        <div className={`actionMenu offProdActionMenuPrime ${menuOpenId === product._id ? 'open' : ''}`}>
                                                            <i
                                                                className={`fa-solid ${product.visible ? 'fa-eye' : 'fa-eye-slash'}`}
                                                                title={product.visible ? "Hide" : "Unhide"}
                                                                onClick={() => toggleVisibility(product._id, product.visible)}
                                                            ></i>
                                                            <i
                                                                className={`fa-solid ${product.isPrime === 1 ? 'fa-star' : 'fa-crown'}`}
                                                                title={product.isPrime === 1 ? "Make Regular" : "Make Prime"}
                                                                onClick={() => togglePrimeStatus(product._id, product.isPrime || 0)}
                                                            ></i>
                                                            <i
                                                                className="fa-solid fa-pen"
                                                                title="Edit Prime Status"
                                                                onClick={() => handleEdit(product)}
                                                            ></i>
                                                            <i
                                                                className="fa-solid fa-trash"
                                                                title="Delete Product"
                                                                onClick={() => handleDelete(product._id)}
                                                            ></i>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="9" className="text-center py-4">
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

                                {pages.map((page, index) =>
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
                    </>
                )}
            </div>
        </div>
        </div>
    );
};

export default PrimeSpotsTable;


