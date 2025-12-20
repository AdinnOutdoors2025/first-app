// import React, { useState, useEffect } from 'react';
// import './ad1products.css';
// import { useNavigate } from 'react-router-dom';
// import { baseUrl } from './BASE_URL';

// const PrimeSpotsTable = () => {
//     const navigate = useNavigate();
//     const [products, setProducts] = useState([]);
//     const [selectedFilter, setSelectedFilter] = useState("View All");
//     const [filteredProducts, setFilteredProducts] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [currentPage, setCurrentPage] = useState(1);
//     const [menuOpenId, setMenuOpenId] = useState(null);
//     const productsPerPage = 10;

//     // Fetch offer products
//     useEffect(() => {
//         const fetchProducts = async () => {
//             try {
//                 setLoading(true);
//                 setError(null);
//                 const response = await fetch(`${baseUrl}/PrimeSpoted/primeSpots`);

//                 if (!response.ok) {
//                     throw new Error(`Failed to fetch products: ${response.status}`);
//                 }

//                 const data = await response.json();
//                 console.log('Fetched offer products:', data);

//                 const productsWithVisibility = data.map((product) => ({
//                     ...product,
//                     visible: product.visible !== false,
//                 }));

//                 const sortedProducts = productsWithVisibility.sort((a, b) => b.visible - a.visible);
//                 setProducts(sortedProducts);
//                 setFilteredProducts(sortedProducts);
//             } catch (err) {
//                 console.error('Error fetching products:', err);
//                 setError(err.message);
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchProducts();
//     }, []);

//     // Handle delete product
//     const handleDelete = async (id) => {
//         if (window.confirm("Are you sure you want to delete this product permanently?")) {
//             try {
//                 const response = await fetch(`${baseUrl}/PrimeSpoted/primeSpots/${id}`, {
//                     method: 'DELETE',
//                 });

//                 if (!response.ok) {
//                     throw new Error('Failed to delete product');
//                 }

//                 setProducts(prev => prev.filter(p => p._id !== id));
//                 setFilteredProducts(prev => prev.filter(p => p._id !== id));
//             } catch (error) {
//                 console.error('Error deleting product:', error);
//                 alert("Error deleting product");
//             }
//         }
//     };

//     // Edit product
//     const handleAction = (action, product) => {
//         if (action === 'Edit') {
//             navigate('/admin#EditPrimeSpots', { 
//                 state: { 
//                     editPrimeSpots: product,
//                     activePrimeSpots: "Add Primes"
//                 } 
//             });
//         } else if (action === 'Delete') {
//             handleDelete(product._id);
//         }
//     };

//     // Toggle visibility
//     const toggleVisibility = async (productId, currentVisibility) => {
//         const message = currentVisibility ? "Wants to hide the product" : "Wants to show the product";
//         if (!window.confirm(message)) return;

//         try {
//             const response = await fetch(`${baseUrl}/PrimeSpoted/primeSpots/${productId}`, {
//                 method: 'PATCH',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ visible: !currentVisibility }),
//             });

//             if (!response.ok) {
//                 throw new Error('Failed to update visibility');
//             }

//             const updatedProduct = await response.json();

//             setProducts(prev => {
//                 const updated = prev.map(p =>
//                     p._id === productId ? { ...p, visible: !currentVisibility } : p
//                 );
//                 const sorted = updated.sort((a, b) => b.visible - a.visible);
//                 setFilteredProducts(sorted);
//                 return sorted;
//             });
//         } catch (error) {
//             console.error('Error updating visibility:', error);
//             alert("Error changing product visibility");
//         }
//     };

//     // Filter products
//     useEffect(() => {
//         let filtered;
//         switch (selectedFilter) {
//             case "Hidden Products":
//                 filtered = products.filter(p => !p.visible);
//                 break;
//             case "5 Star Ratings":
//                 filtered = products.filter(p => Math.floor(p.rating) === 5);
//                 break;
//             default: // View All
//                 filtered = products;
//         }
//         setFilteredProducts(filtered);
//         setCurrentPage(1);
//     }, [selectedFilter, products]);

//     // Pagination
//     const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
//     const indexOfLastProduct = currentPage * productsPerPage;
//     const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
//     const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

//     const getPaginationGroup = () => {
//         let pages = [];
//         const maxPagesToShow = 3;

//         if (totalPages <= 6) {
//             pages = Array.from({ length: totalPages }, (_, i) => i + 1);
//         } else {
//             if (currentPage <= maxPagesToShow + 1) {
//                 pages = [...Array(maxPagesToShow + 1).keys()].map((i) => i + 1);
//                 pages.push("...", totalPages - 1, totalPages);
//             } else if (currentPage >= totalPages - maxPagesToShow) {
//                 pages = [1, 2, "..."];
//                 pages.push(...Array.from({ length: maxPagesToShow + 1 }, (_, i) => totalPages - maxPagesToShow + i));
//             } else {
//                 pages = [1, 2, "..."];
//                 pages.push(currentPage - 1, currentPage, currentPage + 1);
//                 pages.push("...", totalPages - 1, totalPages);
//             }
//         }
//         return pages;
//     };

//     const toggleMenu = (id) => {
//         setMenuOpenId(prevId => (prevId === id ? null : id));
//     };

//     // Render different states
//     if (loading) {
//         return (
//             <div className="admin-products-loading">
//                 <div className="admin-spinner-border text-primary" role="status">
//                     <span className="visually-hidden">Loading...</span>
//                 </div>
//                 <p>Loading products...</p>
//             </div>
//         );
//     }

//     if (error) {
//         return (
//             <div className="admin-products-error">
//                 <div className="alert alert-danger" role="alert">
//                     Error loading products: {error}
//                 </div>
//                 <button
//                     className="btn btn-primary"
//                     onClick={() => window.location.reload()}
//                 >
//                     Retry
//                 </button>
//             </div>
//         );
//     }

//     if (products.length === 0) {
//         return (
//             <div className="admin-no-products">
//                 <div className="alert alert-info" role="alert">
//                     No offer products available. Please add some offer products in the admin panel.
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div>
//             <div className='productsHeader'>
//                 <div className='productsHeading'>Offered Products</div>                

//                 <div>
//                     <select 
//                         className='ProductsInputSelect' 
//                         value={selectedFilter}
//                         onChange={(e) => setSelectedFilter(e.target.value)}
//                     >
//                         <option value="View All">View All</option>
//                         <option value='Hidden Products'>Hidden Products</option>
//                         <option value='5 Star Ratings'>5 Star Ratings</option>
//                     </select>
//                 </div>
//             </div>
//             <div className="product-table">
//                 <table>
//                     <thead>
//                         <tr className='adminProdHeadContent'>
//                             <th>Products</th>
//                             <th className='TableProductName'>Name</th>
//                             <th>SQ.ID</th>
//                             <th>Actual Price</th>
//                             <th>Offered Price</th>
//                             <th>Size</th>
//                             <th>Ratings</th>
//                             <th> </th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {currentProducts.length > 0 ? (
//                             currentProducts.map((product) => (
//                                 <tr 
//                                     key={product._id} 
//                                     className={`product-row adminProdRowContent ${!product.visible ? 'disabled' : ''}`}
//                                 >
//                                     <td>
//                                         <img src={product.image} alt="Product" className='productImg' />
//                                     </td>
//                                     <td className='TableProductName'>{product.name}</td>
//                                     <td>{product.originalProductId}</td>
//                                     <td className='TableProductPrice'>₹{product.originalPrice}</td>
//                                     <td className='TableProductPrice'>₹{product.offerPrice}</td>
//                                     <td>
//                                         {product.size?.width} X {product.size?.height} | {product.size?.squareFeet} Sq.ft
//                                     </td>
//                                     <td>
//                                         <div className='d-flex productRate'>
//                                             <div>
//                                                 <span className="fa-solid fa-star stars-book-admin"></span>
//                                             </div>
//                                             <div>
//                                                 {product.rating}
//                                             </div>
//                                         </div>
//                                     </td>
//                                     <td className="threeDotsTd offProdThreeDotsTd" onClick={() => toggleMenu(product._id)}>
//                                         <div className="actionMenuRow">
//                                             <div>
//                                                 <svg xmlns="http://www.w3.org/2000/svg" width="10" height="34" viewBox="0 0 10 34" fill="none" className='ThreeDotsIcon'>
//                                                     <path fillRule="evenodd" clipRule="evenodd"
//                                                         d="M5.02241 0.373047C7.2536 0.373047 9.06365 2.18282 9.06365 4.41428C9.06365 6.64547 7.2536 8.45471 5.02241 8.45471C2.79122 8.45444 0.981445 6.64547 0.981445 4.41428C0.981445 2.18282 2.79122 0.373047 5.02241 0.373047ZM5.02241 25.4439C7.2536 25.4439 9.06365 27.2536 9.06365 29.4851C9.06365 31.7166 7.2536 33.5255 5.02241 33.5255C2.79122 33.5253 0.981445 31.7163 0.981445 29.4848C0.981445 27.2534 2.79122 25.4439 5.02241 25.4439ZM5.02241 12.9085C7.2536 12.9085 9.06365 14.7182 9.06365 16.9497C9.06365 19.1812 7.2536 20.9907 5.02241 20.9907C2.79122 20.9904 0.981445 19.1809 0.981445 16.9494C0.981445 14.718 2.79122 12.9085 5.02241 12.9085Z"
//                                                         fill="#333333" />
//                                                 </svg>
//                                             </div>

//                                             {/* Action Menu */}
//                                             <div className={`actionMenu offProdActionMenu ${menuOpenId === product._id ? 'open' : ''}`}>
//                                                 <i
//                                                     className={`fa-solid ${product.visible ? 'fa-eye' : 'fa-eye-slash'}`}
//                                                     title={product.visible ? "Hide" : "Unhide"}
//                                                     onClick={() => toggleVisibility(product._id, product.visible)}
//                                                 ></i>
//                                                 <i 
//                                                     className="fa-solid fa-pen" 
//                                                     title="Edit" 
//                                                     onClick={() => handleAction('Edit', product)}
//                                                 ></i>
//                                                 <i 
//                                                     className="fa-solid fa-trash" 
//                                                     title="Delete" 
//                                                     onClick={() => handleAction('Delete', product)}
//                                                 ></i>
//                                             </div>
//                                         </div>
//                                     </td>
//                                 </tr>
//                             ))
//                         ) : (
//                             <tr>
//                                 <td colSpan="8" className="text-center py-4">
//                                     No products match the selected filter.
//                                 </td>
//                             </tr>
//                         )}
//                     </tbody>
//                 </table>
//             </div>

//             {/* Pagination Controls */}
//             {filteredProducts.length > 0 && (
//                 <div className="Productpagination d-flex justify-content-center">
//                     <button 
//                         className="Productprev-button" 
//                         onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//                         disabled={currentPage === 1}
//                     >
//                         Prev
//                     </button>

//                     {getPaginationGroup().map((page, index) =>
//                         page === "..." ? (
//                             <span key={index} className="paginationDots">...</span>
//                         ) : (
//                             <button
//                                 key={index}
//                                 className={`Productpage-number ${currentPage === page ? "active" : ""}`}
//                                 onClick={() => setCurrentPage(page)}
//                             >
//                                 {page}
//                             </button>
//                         )
//                     )}
//                     <button 
//                         className="Productnext-button" 
//                         onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
//                         disabled={currentPage === totalPages}
//                     >
//                         Next
//                     </button>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default PrimeSpotsTable;





// // //YESTERDAY CORRECTED CODE
// import React, { useState, useEffect } from 'react';
// import './ad1products.css';
// import { useNavigate } from 'react-router-dom';
// import { baseUrl } from './BASE_URL';

// const PrimeSpotsTable = () => {
//     const navigate = useNavigate();
//     const [products, setProducts] = useState([]);
//     const [selectedFilter, setSelectedFilter] = useState("View All");
//     const [filteredProducts, setFilteredProducts] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [currentPage, setCurrentPage] = useState(1);
//     const [menuOpenId, setMenuOpenId] = useState(null);
//     const productsPerPage = 10;

//     // Fetch prime spots
//     useEffect(() => {
//         const fetchProducts = async () => {
//             try {
//                 setLoading(true);
//                 setError(null);
//                 const response = await fetch(`${baseUrl}/PrimeSpoted/primeSpots`);

//                 if (!response.ok) {
//                     throw new Error(`Failed to fetch prime spots: ${response.status}`);
//                 }

//                 const data = await response.json();
//                 console.log('Fetched prime spots:', data);

//                 const productsWithVisibility = data.map((product) => ({
//                     ...product,
//                     visible: product.visible !== false,
//                 }));

//                 const sortedProducts = productsWithVisibility.sort((a, b) => b.visible - a.visible);
//                 setProducts(sortedProducts);
//                 setFilteredProducts(sortedProducts);
//             } catch (err) {
//                 console.error('Error fetching prime spots:', err);
//                 setError(err.message);
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchProducts();
//     }, []);

//     // Handle delete prime spot
//     const handleDelete = async (id) => {
//         if (window.confirm("Are you sure you want to delete this prime spot permanently?")) {
//             try {
//                 const response = await fetch(`${baseUrl}/PrimeSpoted/primeSpots/${id}`, {
//                     method: 'DELETE',
//                 });

//                 if (!response.ok) {
//                     throw new Error('Failed to delete prime spot');
//                 }

//                 setProducts(prev => prev.filter(p => p._id !== id));
//                 setFilteredProducts(prev => prev.filter(p => p._id !== id));
//                 alert("Prime spot deleted successfully!");
//             } catch (error) {
//                 console.error('Error deleting prime spot:', error);
//                 alert("Error deleting prime spot");
//             }
//         }
//     };

//     // Edit prime spot
//     const handleEdit = (product) => {
//         navigate('/admin#EditPrimeSpots', { 
//             state: { 
//                 editPrimeSpot: product,
//                 activePrimeSpots: "Add Primes"
//             } 
//         });
//     };

//     // Toggle visibility
//     const toggleVisibility = async (productId, currentVisibility) => {
//         const message = currentVisibility ? "Wants to hide the prime spot" : "Wants to show the prime spot";
//         if (!window.confirm(message)) return;

//         try {
//             const response = await fetch(`${baseUrl}/PrimeSpoted/primeSpots/${productId}`, {
//                 method: 'PATCH',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ visible: !currentVisibility }),
//             });

//             if (!response.ok) {
//                 throw new Error('Failed to update visibility');
//             }

//             const updatedProduct = await response.json();

//             setProducts(prev => {
//                 const updated = prev.map(p =>
//                     p._id === productId ? { ...p, visible: !currentVisibility } : p
//                 );
//                 const sorted = updated.sort((a, b) => b.visible - a.visible);
//                 setFilteredProducts(sorted);
//                 return sorted;
//             });
//         } catch (error) {
//             console.error('Error updating visibility:', error);
//             alert("Error changing prime spot visibility");
//         }
//     };

//     // Toggle Prime Status
//     const togglePrimeStatus = async (productId, currentPrimeStatus) => {
//         const newStatus = currentPrimeStatus === 1 ? 0 : 1;
//         const message = `Change Prime Status from ${currentPrimeStatus} to ${newStatus}?`;

//         if (!window.confirm(message)) return;

//         try {
//             const response = await fetch(`${baseUrl}/PrimeSpoted/primeSpots/${productId}/toggle-prime`, {
//                 method: 'PATCH',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ isPrime: newStatus }),
//             });

//             if (!response.ok) {
//                 throw new Error('Failed to update prime status');
//             }

//             const updatedProduct = await response.json();

//             setProducts(prev => {
//                 const updated = prev.map(p =>
//                     p._id === productId ? { ...p, isPrime: newStatus } : p
//                 );
//                 setFilteredProducts(updated);
//                 return updated;
//             });

//             alert(`Prime status updated to ${newStatus === 1 ? 'Prime Spot' : 'Regular Spot'}`);
//         } catch (error) {
//             console.error('Error updating prime status:', error);
//             alert("Error changing prime status");
//         }
//     };

//     // Filter prime spots
//     useEffect(() => {
//         let filtered;
//         switch (selectedFilter) {
//             case "Hidden Products":
//                 filtered = products.filter(p => !p.visible);
//                 break;
//             case "Prime Spots":
//                 filtered = products.filter(p => p.isPrime === 1);
//                 break;
//             case "Regular Spots":
//                 filtered = products.filter(p => p.isPrime === 0);
//                 break;
//             default: // View All
//                 filtered = products;
//         }
//         setFilteredProducts(filtered);
//         setCurrentPage(1);
//     }, [selectedFilter, products]);

//     // Pagination
//     const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
//     const indexOfLastProduct = currentPage * productsPerPage;
//     const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
//     const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

//     const getPaginationGroup = () => {
//         let pages = [];
//         const maxPagesToShow = 3;

//         if (totalPages <= 6) {
//             pages = Array.from({ length: totalPages }, (_, i) => i + 1);
//         } else {
//             if (currentPage <= maxPagesToShow + 1) {
//                 pages = [...Array(maxPagesToShow + 1).keys()].map((i) => i + 1);
//                 pages.push("...", totalPages - 1, totalPages);
//             } else if (currentPage >= totalPages - maxPagesToShow) {
//                 pages = [1, 2, "..."];
//                 pages.push(...Array.from({ length: maxPagesToShow + 1 }, (_, i) => totalPages - maxPagesToShow + i));
//             } else {
//                 pages = [1, 2, "..."];
//                 pages.push(currentPage - 1, currentPage, currentPage + 1);
//                 pages.push("...", totalPages - 1, totalPages);
//             }
//         }
//         return pages;
//     };

//     const toggleMenu = (id) => {
//         setMenuOpenId(prevId => (prevId === id ? null : id));
//     };

//     // Add Prime Status Column to table
//     const renderPrimeStatus = (isPrime) => {
//         if (isPrime === 1) {
//             return (
//                 <span className="prime-badge active">
//                     <i className="fa-solid fa-crown" style={{ marginRight: '4px' }}></i>
//                     Prime
//                 </span>
//             );
//         } else {
//             return (
//                 <span className="prime-badge inactive">
//                     <i className="fa-solid fa-star" style={{ marginRight: '4px' }}></i>
//                     Regular
//                 </span>
//             );
//         }
//     };

//     if (loading) {
//         return (
//             <div className="admin-products-loading">
//                 <div className="admin-spinner-border text-primary" role="status">
//                     <span className="visually-hidden">Loading...</span>
//                 </div>
//                 <p>Loading prime spots...</p>
//             </div>
//         );
//     }

//     if (error) {
//         return (
//             <div className="admin-products-error">
//                 <div className="alert alert-danger" role="alert">
//                     Error loading prime spots: {error}
//                 </div>
//                 <button
//                     className="btn btn-primary"
//                     onClick={() => window.location.reload()}
//                 >
//                     Retry
//                 </button>
//             </div>
//         );
//     }

//     if (products.length === 0) {
//         return (
//             <div className="admin-no-products">
//                 <div className="alert alert-info" role="alert">
//                     No prime spots available. Please add some prime spots in the admin panel.
//                 </div>
//                 <button
//                     className="btn btn-primary"
//                     onClick={() => navigate('/admin#AddPrimeSpots')}
//                 >
//                     Add Prime Spot
//                 </button>
//             </div>
//         );
//     }

//     return (
//         <div>
//             <div className='productsHeader'>
//                 <div className='productsHeading'>Prime Advertising Spots</div>                

//                 <div>
//                     <select 
//                         className='ProductsInputSelect' 
//                         value={selectedFilter}
//                         onChange={(e) => setSelectedFilter(e.target.value)}
//                     >
//                         <option value="View All">View All</option>
//                         <option value='Prime Spots'>Prime Spots</option>
//                         <option value='Regular Spots'>Regular Spots</option>
//                         <option value='Hidden Products'>Hidden Spots</option>
//                     </select>
//                 </div>
//             </div>
//             <div className="product-table">
//                 <table>
//                     <thead>
//                         <tr className='adminProdHeadContent'>
//                             <th>Products</th>
//                             <th className='TableProductName'>Name</th>
//                             <th>SQ.ID</th>
//                             <th>Price</th>
//                             <th>Prime Status</th>
//                             <th>Size</th>
//                             <th>Ratings</th>
//                             <th> </th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {currentProducts.length > 0 ? (
//                             currentProducts.map((product) => (
//                                 <tr 
//                                     key={product._id} 
//                                     className={`product-row adminProdRowContent ${!product.visible ? 'disabled' : ''} ${product.isPrime === 1 ? 'prime-spot-row' : ''}`}
//                                 >
//                                     <td>
//                                         <img src={product.image} alt="Product" className='productImg' />
//                                     </td>
//                                     <td className='TableProductName'>{product.name}</td>
//                                     <td>{product.originalProductId}</td>
//                                     <td className='TableProductPrice'>₹{product.originalPrice}</td>
//                                     <td>
//                                         {renderPrimeStatus(product.isPrime)}
//                                     </td>
//                                     <td>
//                                         {product.size?.width} X {product.size?.height} | {product.size?.squareFeet} Sq.ft
//                                     </td>
//                                     <td>
//                                         <div className='d-flex productRate'>
//                                             <div>
//                                                 <span className="fa-solid fa-star stars-book-admin"></span>
//                                             </div>
//                                             <div>
//                                                 {product.rating}
//                                             </div>
//                                         </div>
//                                     </td>
//                                     <td className="threeDotsTd offProdThreeDotsTd" onClick={() => toggleMenu(product._id)}>
//                                         <div className="actionMenuRow">
//                                             <div>
//                                                 <svg xmlns="http://www.w3.org/2000/svg" width="10" height="34" viewBox="0 0 10 34" fill="none" className='ThreeDotsIcon'>
//                                                     <path fillRule="evenodd" clipRule="evenodd"
//                                                         d="M5.02241 0.373047C7.2536 0.373047 9.06365 2.18282 9.06365 4.41428C9.06365 6.64547 7.2536 8.45471 5.02241 8.45471C2.79122 8.45444 0.981445 6.64547 0.981445 4.41428C0.981445 2.18282 2.79122 0.373047 5.02241 0.373047ZM5.02241 25.4439C7.2536 25.4439 9.06365 27.2536 9.06365 29.4851C9.06365 31.7166 7.2536 33.5255 5.02241 33.5255C2.79122 33.5253 0.981445 31.7163 0.981445 29.4848C0.981445 27.2534 2.79122 25.4439 5.02241 25.4439ZM5.02241 12.9085C7.2536 12.9085 9.06365 14.7182 9.06365 16.9497C9.06365 19.1812 7.2536 20.9907 5.02241 20.9907C2.79122 20.9904 0.981445 19.1809 0.981445 16.9494C0.981445 14.718 2.79122 12.9085 5.02241 12.9085Z"
//                                                         fill="#333333" />
//                                                 </svg>
//                                             </div>

//                                             {/* Action Menu */}
//                                             <div className={`actionMenu offProdActionMenu ${menuOpenId === product._id ? 'open' : ''}`}>
//                                                 <i
//                                                     className={`fa-solid ${product.visible ? 'fa-eye' : 'fa-eye-slash'}`}
//                                                     title={product.visible ? "Hide" : "Unhide"}
//                                                     onClick={() => toggleVisibility(product._id, product.visible)}
//                                                 ></i>
//                                                 <i
//                                                     className={`fa-solid ${product.isPrime === 1 ? 'fa-star' : 'fa-crown'}`}
//                                                     title={product.isPrime === 1 ? "Make Regular" : "Make Prime"}
//                                                     onClick={() => togglePrimeStatus(product._id, product.isPrime)}
//                                                 ></i>
//                                                 <i 
//                                                     className="fa-solid fa-pen" 
//                                                     title="Edit" 
//                                                     onClick={() => handleEdit(product)}
//                                                 ></i>
//                                                 <i 
//                                                     className="fa-solid fa-trash" 
//                                                     title="Delete" 
//                                                     onClick={() => handleDelete(product._id)}
//                                                 ></i>
//                                             </div>
//                                         </div>
//                                     </td>
//                                 </tr>
//                             ))
//                         ) : (
//                             <tr>
//                                 <td colSpan="8" className="text-center py-4">
//                                     No prime spots match the selected filter.
//                                 </td>
//                             </tr>
//                         )}
//                     </tbody>
//                 </table>
//             </div>

//             {/* Pagination Controls */}
//             {filteredProducts.length > 0 && (
//                 <div className="Productpagination d-flex justify-content-center">
//                     <button 
//                         className="Productprev-button" 
//                         onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//                         disabled={currentPage === 1}
//                     >
//                         Prev
//                     </button>

//                     {getPaginationGroup().map((page, index) =>
//                         page === "..." ? (
//                             <span key={index} className="paginationDots">...</span>
//                         ) : (
//                             <button
//                                 key={index}
//                                 className={`Productpage-number ${currentPage === page ? "active" : ""}`}
//                                 onClick={() => setCurrentPage(page)}
//                             >
//                                 {page}
//                             </button>
//                         )
//                     )}
//                     <button 
//                         className="Productnext-button" 
//                         onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
//                         disabled={currentPage === totalPages}
//                     >
//                         Next
//                     </button>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default PrimeSpotsTable;


import React, { useState, useEffect } from 'react';
import './ad1products.css';
import { useNavigate } from 'react-router-dom';
import { baseUrl } from './BASE_URL';

const PrimeSpotsTable = () => {
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
        setFilteredProducts(filtered);
        setCurrentPage(1);
    }, [selectedFilter, products]);

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
            <div className='productsHeader'>
                <div className='productsHeading'>Prime Advertising Spots</div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
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
                                            <td className='TableProductPrice'>₹{product.price}</td>
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
                </>
            )}
        </div>
    );
};

export default PrimeSpotsTable;


