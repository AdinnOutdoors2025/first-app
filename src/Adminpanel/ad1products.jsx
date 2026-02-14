import React, { useState, useEffect } from 'react';
import './ad1products.css';
import { useNavigate } from 'react-router-dom';
import { getPaginationGroup } from "../utils/pagination";
//BASE URL OF http://localhost:3001 FILE IMPORT 
import { baseUrl } from './BASE_URL';
import { formatIndianCurrency } from '../components/FORMATED_AMOUNT';

const ProductTable = () => {
    // NAVIGATE 
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [selectedFilter, setSelectedFilter] = useState("View All");
    // Add filtered products state
    const [filteredProducts, setFilteredProducts] = useState([]);

    // const baseUrl = "http://192.168.2.159:3001";

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await fetch(`${baseUrl}/products`);

                if (!response.ok) {
                    throw new Error('Failed to fetch products');
                }

                const data = await response.json();
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


    const handleDelete = async (id) => {
        // Show confirmation dialog
        if (window.confirm("Are you sure you want to delete this product permanently?")) {
            await fetch(`${baseUrl}/products/${id}`, {
                method: 'DELETE',
            });
            // setProducts(prev => prev.filter(p => p._id !== id));
            // Update both products and filtered products
            setProducts(prev => prev.filter(p => p._id !== id));
            setFilteredProducts(prev => prev.filter(p => p._id !== id));
        }
    };
    // EDIT PRODUCT 
    const handleAction = (action, product) => {
        if (action === 'Edit') {

            //   navigate(`/manageProducts/${product._id}`, { state: product });
            // navigate('/manageProducts', { state: { editProduct: product } });
            navigate('/admin#admanager', { state: { editProduct: product } });
            {/* <Link to="/admin#admanager">Ad Manager</Link> */ }

        } else if (action === 'Delete') {
            handleDelete(product._id);
        }
    };
    // // HIDE PRODUCTS 
    const toggleVisibility = async (productId, currentVisibility) => {
        const message = currentVisibility ? "Wants to hide the product" : "Wants to show the product";
        if (!window.confirm(message)) return;

        try {
            await fetch(`${baseUrl}/products/${productId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ visible: !currentVisibility }),
            });

            setProducts(prev => {
                const updated = prev.map(p =>
                    p._id === productId ? { ...p, visible: !currentVisibility } : p
                );
                // return updated.sort((a, b) => b.visible - a.visible);

                const sorted = updated.sort((a, b) => b.visible - a.visible);
                // Keep filtered products in sync
                setFilteredProducts(sorted);
                return sorted;
            });
        } catch (error) {
            console.error('Error updating visibility:', error);
            alert("Error changing product visibility");
        }
    };


    // Pagination States
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 150;
    // 🔍 Search input state (NEW)
    const [searchTerm, setSearchTerm] = useState('');

    // Update filtered products when filter changes

    // 🔍 Filter products based on dropdown + search (UPDATED)
    useEffect(() => {
        let filtered = products;

        // Apply dropdown filter
        if (selectedFilter === "Hidden Products") {
            filtered = filtered.filter(p => !p.visible);
        } else if (selectedFilter === "5 Star Ratings") {
            filtered = filtered.filter(p => Math.floor(p.rating) === 5);
        }

        // Apply search filter
        if (searchTerm.trim() !== '') {
            const search = searchTerm.toLowerCase();

            filtered = filtered.filter((product) =>
                product.name?.toLowerCase().includes(search) ||             // Name
                product.prodCode?.toLowerCase().includes(search) ||         // SQ.ID
                product.mediaType?.toLowerCase().includes(search) ||        // Media Type
                product.price?.toString().includes(search) ||               // Price
                product.rating?.toString().includes(search) ||              // Ratings
                `${product.width} ${product.height} ${product.productsquareFeet}`
                    .toLowerCase()
                    .includes(search)                                       // Size
            );
        }

        setFilteredProducts(filtered);      // UPDATE filtered list
        setCurrentPage(1);                  // Reset pagination
    }, [selectedFilter, searchTerm, products]); // 👈 NEW dependency





    // Calculate Total Pages
    //  const totalPages = Math.ceil(products.length / productsPerPage);
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    // Get Current Products for Display
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    //  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    // Function to Generate Pagination Buttons
    // const getPaginationGroup = () => {
    //     let pages = [];
    //     const maxPagesToShow = 3; // Show 3 pages around the current page

    //     if (totalPages <= 6) {
    //         // If there are few pages, show all
    //         pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    //     }
    //     else {
    //         if (currentPage <= maxPagesToShow + 1) {
    //             // If near start: Show first few + last 2
    //             pages = [...Array(maxPagesToShow + 1).keys()].map((i) => i + 1);
    //             pages.push("...", totalPages - 1, totalPages);
    //         } else if (currentPage >= totalPages - maxPagesToShow) {
    //             // If near end: Show first 2 + last few
    //             pages = [1, 2, "..."];
    //             pages.push(...Array.from({ length: maxPagesToShow + 1 }, (_, i) => totalPages - maxPagesToShow + i));
    //         } else {
    //             // Middle section: Show current, 1 before & after
    //             pages = [1, 2, "..."];
    //             pages.push(currentPage - 1, currentPage, currentPage + 1);
    //             pages.push("...", totalPages - 1, totalPages);
    //         }
    //     }
    //     return pages;
    // };

    const pages = getPaginationGroup(currentPage, totalPages);



    // 3 DOTS SECTION 
    const [menuOpenId, setMenuOpenId] = useState(null); // Use ID if multiple rows

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
                    No products available. Please add some products in the admin panel.
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className='productsHeader'>
                <div className='productsHeading'>All Products</div>
                {/* <div className="Admin-navbar-search">
                        <i className="fas fa-search search-icon Admin-search-icon"></i>
                        <input type="text" placeholder="Search..." className='Admin-search-name'
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)} />
                    </div>
                     {searchTerm && (                               // ❌ Clear button (NEW)
                        <span
                            className="clear-search"
                            onClick={() => setSearchTerm('')}
                        >
                            ✕
                        </span>
                    )} */}
                
                <div className="search-wrapper"> 
                    <input
                        type="text"
                        placeholder="Type to search the products..."
                        className="ProductsSearchInput"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />

                    {searchTerm && (                               // ❌ Clear button (NEW)
                        <span
                            className="clear-search"
                            onClick={() => setSearchTerm('')}
                        >
                            ✕
                        </span>
                    )}
                   

                </div>


                <div>
                    <select className='ProductsInputSelect' value={selectedFilter}
                        onChange={(e) => setSelectedFilter(e.target.value)}>
                        <option value="View All" >View All</option>
                        <option value='Hidden Products'>Hidden Products</option>
                        <option value='5 Star Ratings'>5 Star Ratings</option>
                    </select>
                </div>


            </div>
            <div className="product-table">
                <table>
                    <thead className='adminProductHeading'>
                        <tr className='adminProdHeadContent'>
                            <th>Products</th>
                            <th className='TableProductName'>Name</th>
                            <th>SQ.ID</th>
                            <th>Price</th>
                            <th>Media Type</th>

                            <th>Size</th>
                            <th>Ratings</th>
                            <th > </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            filteredProducts.length > 0 ? (


                                filteredProducts
                                    .slice(indexOfFirstProduct, indexOfLastProduct)
                                    .map((product, index) => (
                                        <tr key={product._id} className={`product-row adminProdRowContent ${!product.visible ? 'disabled' : ''}`}>
                                            <td>
                                                <img src={product.image} alt="Product" className='productImg' />
                                            </td>
                                            <td className='TableProductName'>{product.name}</td>
                                            <td>{product.prodCode}</td>
                                            <td className='TableProductPrice'>{formatIndianCurrency(product.price, true)}</td>
                                            <td className='TableProductPrice'>{product.mediaType}</td>
                                            <td>{product.width} X {product.height} | {product.productsquareFeet} Sq.ft </td>
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
                                            <td className="threeDotsTd" onClick={() => toggleMenu(product._id)}>
                                                <div className="actionMenuRow">
                                                    <div>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="34" viewBox="0 0 10 34" fill="none" className='ThreeDotsIcon'>
                                                            <path fillRule="evenodd" clipRule="evenodd"
                                                                d="M5.02241 0.373047C7.2536 0.373047 9.06365 2.18282 9.06365 4.41428C9.06365 6.64547 7.2536 8.45471 5.02241 8.45471C2.79122 8.45444 0.981445 6.64547 0.981445 4.41428C0.981445 2.18282 2.79122 0.373047 5.02241 0.373047ZM5.02241 25.4439C7.2536 25.4439 9.06365 27.2536 9.06365 29.4851C9.06365 31.7166 7.2536 33.5255 5.02241 33.5255C2.79122 33.5253 0.981445 31.7163 0.981445 29.4848C0.981445 27.2534 2.79122 25.4439 5.02241 25.4439ZM5.02241 12.9085C7.2536 12.9085 9.06365 14.7182 9.06365 16.9497C9.06365 19.1812 7.2536 20.9907 5.02241 20.9907C2.79122 20.9904 0.981445 19.1809 0.981445 16.9494C0.981445 14.718 2.79122 12.9085 5.02241 12.9085Z"
                                                                fill="#333333" />
                                                        </svg>
                                                    </div>

                                                    {/* Action Menu */}
                                                    <div className={`actionMenu ${menuOpenId === product._id ? 'open' : ''}`}>

                                                        <i
                                                            className={`fa-solid ${product.visible ? 'fa-eye' : 'fa-eye-slash'}`}
                                                            title={product.visible ? "Hide" : "Unhide"}
                                                            onClick={() => toggleVisibility(product._id, product.visible)}
                                                        ></i>
                                                        <i className="fa-solid fa-pen" title="Edit" onClick={() => handleAction('Edit', product)}></i>
                                                        <i className="fa-solid fa-trash" title="Delete" onClick={() => handleAction('Delete', product)}></i>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="no-orders-found">
                                        <div className="no-orders-message">
                                            <i className="fas fa-exclamation-circle"></i>
                                            No Products Match
                                        </div>
                                    </td>
                                </tr>
                            )}
                    </tbody>
                </table>
            </div>
            {/* Pagination Controls */}
            {/* Only show pagination if there are products */}
            {filteredProducts.length > 0 && (


                <div className="Productpagination d-flex justify-content-center">
                    <button className="Productprev-button" onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1} >
                        Prev
                    </button>

                    {pages.map((page, index) =>

                        page === "..." ? (

                            <span key={index} className="paginationDots">...</span>
                        ) : (
                            <button
                                key={index}
                                className={`Productpage-number ${currentPage === page ? "active" : ""}`}
                                onClick={() => setCurrentPage(page)} >
                                {page}
                            </button>
                        )

                    )}
                    <button className="Productnext-button" onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}>
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};
export default ProductTable;