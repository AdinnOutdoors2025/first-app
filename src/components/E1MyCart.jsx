// import React, { useState, useEffect } from 'react';
// import './E1MyCart.css';
// import { useNavigate } from 'react-router-dom';
// import { useLogin } from './LoginContext';
// import MainNavbar from './A1NAVBAR.jsx';
// import MainFooter from './A1FOOTER.jsx';
// import { MainLayout } from './MainLayout';
// import { baseUrl } from '../Adminpanel/BASE_URL';
// import { formatIndianCurrency } from './FORMATED_AMOUNT';


// const Cart = () => {
//     const { user, openLogin, closeLogin, isLoggedIn, isLoginOpen } = useLogin();
//     const [items, setItems] = useState([]);
//     const [isLoading, setIsLoading] = useState(true);
//     const [selectedItems, setSelectedItems] = useState([]);
//     const navigate = useNavigate();


//     const handleLoginClose = () => {
//         // When user closes login without logging in, redirect to home
//         navigate("/home");
//     };


//     // Fetch cart items from database
//     const fetchCartItems = async () => {
//         try {
//             if (!user) {
//                 setIsLoading(false);
//                 return;
//             }

//             setIsLoading(true);
//             console.log('Fetching cart items for user:', user._id);

//             const response = await fetch(`${baseUrl}/cart/user/${user._id}`);
//             if (!response.ok) {
//                 throw new Error('Failed to fetch cart items');
//             }
//             const data = await response.json();
//             console.log('Cart items fetched:', data);
//             setItems(data);
//             // setIsLoading(false); 
//         } catch (error) {
//             console.error('Error fetching cart items:', error);
//             // setIsLoading(false);
//         }
//         finally {
//             setIsLoading(false);
//         }
//     };
//     useEffect(() => {
//         if (user) {
//             fetchCartItems();
//         } else if (!isLoginOpen) {
//             openLogin('login');
//         }
//     }, [user, isLoginOpen]);

//     // Add debugging to see what's happening
//     useEffect(() => {
//         console.log('User state changed:', user);
//         console.log('Items state:', items);
//     }, [user, items]);


//     const handleLoginSuccess = () => {
//         // This will be called after successful login
//         fetchCartItems();
//     };

//     // Add item to cart in database
//     const addToCart = async (item) => {
//         try {
//             const response = await fetch(`${baseUrl}/cart`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(item)
//             });

//             if (!response.ok) {
//                 throw new Error('Failed to add item to cart');
//             }

//             fetchCartItems(); // Refresh cart items
//         } catch (error) {
//             console.error('Error adding to cart:', error);
//         }
//     };

//     // Delete item from cart in database
//     const deleteCartItem = async (id) => {
//         try {
//             const response = await fetch(`${baseUrl}/cart/${id}`, {
//                 method: 'DELETE'
//             });

//             if (!response.ok) {
//                 throw new Error('Failed to delete item from cart');
//             }

//             fetchCartItems(); // Refresh cart items
//             setSelectedItems(prev => prev.filter(itemId => itemId !== id));

//         } catch (error) {
//             console.error('Error deleting from cart:', error);
//         }
//     };

//     // Delete multiple items from cart in database
//     const deleteMultipleCartItems = async (itemIds) => {
//         try {
//             const response = await fetch(`${baseUrl}/cart`, {
//                 method: 'DELETE',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({ itemIds })
//             });

//             if (!response.ok) {
//                 throw new Error('Failed to delete items from cart');
//             }

//             fetchCartItems(); // Refresh cart items
//         } catch (error) {
//             console.error('Error deleting multiple items from cart:', error);
//         }
//     };

//     // Clear user's cart in database
//     const clearCart = async () => {
//         try {
//             const response = await fetch(`${baseUrl}/cart/clear/${user._id}`, {
//                 method: 'DELETE'
//             });

//             if (!response.ok) {
//                 throw new Error('Failed to clear cart');
//             }

//             fetchCartItems(); // Refresh cart items
//         } catch (error) {
//             console.error('Error clearing cart:', error);
//         }
//     };

//     // Select/deselect an item
//     const handleSelectItem = (id) => {
//         setSelectedItems(prev =>
//             prev.includes(id)
//                 ? prev.filter(itemId => itemId !== id)
//                 : [...prev, id]
//         );
//     };

//     // Select all items
//     const handleSelectAll = () => {
//         if (selectedItems.length === items.length) {
//             setSelectedItems([]);
//         } else {
//             setSelectedItems(items.map(item => item._id));
//         }
//     };

//     // Delete selected items
//     const handleDeleteSelected = () => {
//         if (selectedItems.length === 0) return;

//         if (window.confirm(`Are you sure you want to remove ${selectedItems.length} item(s) from cart?`)) {
//             deleteMultipleCartItems(selectedItems);
//             setSelectedItems([]);
//         }
//     };

//     // Delete a single item
//     const handleDeleteItem = (id) => {
//         if (window.confirm("Are you sure you want to remove this item from cart?")) {
//             deleteCartItem(id);
//             setSelectedItems(prev => prev.filter(itemId => itemId !== id));
//         }
//     };

//     // Calculate totals
//     const subTotal = items.reduce((acc, item) => {
//         const amount = typeof item.totalAmount === 'string'
//             ? parseFloat(item.totalAmount.replace(/,/g, ''))
//             : item.totalAmount || 0;
//         return acc + amount;
//     }, 0);

//     const totalItems = items.length;
//     const cartAmount = items.length > 0 ? items[0]?.SpotPay : 0;
//     const cartOffer = items.length > 0 ? items[0]?.Offer : 0;

//     // Handle checkout
//     const handleCheckout = () => {
//         if (items.length === 0) {
//             alert("Your cart is empty");
//             return;
//         }
//         navigate("/billing_cart", {
//             state: {
//                 cartItems: items,
//                 subTotal: subTotal,
//                 totalItems: items.length,
//                 SpotPay: cartAmount,
//                 Offer: cartOffer
//             }
//         });
//     };



//     //FORMAT THE AMOUNT INTO INDIAN CURRENCY
//     const parseAmount = (amount) => {
//         if (!amount && amount !== 0) return 0;

//         if (typeof amount === 'number') return amount;

//         if (typeof amount === 'string') {
//             // Remove any commas, currency symbols, and spaces
//             const cleaned = amount.replace(/[₹$,¥\s]/g, '').replace(/,/g, '');
//             const parsed = parseFloat(cleaned);
//             return isNaN(parsed) ? 0 : parsed;
//         }

//         return 0;
//     };


//     return (
//         <MainLayout>
//             <div>
//                 <MainNavbar />
//                 <div className="container-fluid cart-container">

//                     {isLoading ? (
//                         <div className="container loading">
//                             <div className="spinner-border text-primary" role="status">
//                                 <span className="visually-hidden">Loading...</span>
//                             </div>
//                         </div>
//                     ) : (

//                         <div className='cart-items-main'>
//                             <h1 className='cart-heading'>My Cart</h1>
//                             <div className="cart-items">
//                                 <div className="form-group cart-option">
//                                     <div>
//                                         <label className="checkbox-container1">
//                                             <input
//                                                 type="checkbox"
//                                                 checked={selectedItems.length === items.length && items.length > 0}
//                                                 onChange={handleSelectAll}
//                                             />
//                                             <span className="checkmark1">&#x2714;</span>
//                                             <span className='check-content1'>Select all</span>
//                                         </label>
//                                     </div>
//                                     <div>
//                                         <button
//                                             className="select-delete-button"
//                                             onClick={handleDeleteSelected}
//                                             disabled={selectedItems.length === 0}
//                                         >
//                                             <img src='./images/Delete_icon.svg' className='select_delete' alt="Delete Selected" />
//                                         </button>
//                                     </div>
//                                 </div>
//                                 <div className='item-scroll'>
//                                     {items.length > 0 ? (
//                                         items.map((item) => {
//                                             // Parse amounts for this item
//                                             const priceAmount = parseAmount(item.price);
//                                             const totalAmount = parseAmount(item.totalAmount);
//                                             return (
//                                             <div className="cart-item-content" key={item._id}>
//                                                 <div className='input-checks'>
//                                                     <label className="checkbox-container1">
//                                                         <input
//                                                             type="checkbox"
//                                                             checked={selectedItems.includes(item._id)}
//                                                             onChange={() => handleSelectItem(item._id)}
//                                                         />
//                                                         <span className="checkmark1">&#x2714;</span>
//                                                     </label>
//                                                 </div>
//                                                 <div className="item-details d-flex">
//                                                     <div>
//                                                         <img src={item.image} className='item-img' alt={item.title} />
//                                                     </div>
//                                                     <div>
//                                                         <div className='item-title'>{item.prodName}</div>
//                                                         <div className='item-price'>{formatIndianCurrency(priceAmount, true)} / Per Day</div>
//                                                         <div className="d-flex itemDateRange">
//                                                             <div className='item-dateRange'>Campaign Date</div>
//                                                             <div className='item-detailSection'> {item.dateRange}</div>
//                                                         </div>
//                                                         <div className="d-flex itemDateRange">
//                                                             <div className='item-dateRange'>Total Amount</div>
//                                                             <div className='item-detailSection'>{formatIndianCurrency(totalAmount, true)}</div>
//                                                         </div>
//                                                         <div className="d-flex itemSizeDimensions">
//                                                             <div className='item-size'>Size & Dimensions</div>
//                                                             <div className='item-detailSection'> W {item.sizeWidth} x H {item.sizeHeight} <span className='item-slash'> | </span> {item.dimension} Sq.ft</div>
//                                                         </div>
//                                                         <div className="d-flex itemAdType">
//                                                             <div className='item-type'>Ad Type</div>
//                                                             <div className='item-detailSection'> {item.adType}</div>
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                                 <div>
//                                                     <button
//                                                         className="item-delete-button"
//                                                         onClick={() => handleDeleteItem(item._id)}
//                                                     >
//                                                         <i className="fa-solid fa-x"></i>
//                                                     </button>
//                                                 </div>
//                                             </div>
//                                             )
//                                     })
//                                     ) : (
//                                         <div className='text-center align-center'>
//                                             <i className="fas fa-exclamation-circle" style={{ color: 'red', fontSize: '20px', marginRight: '5px' }}></i>
//                                             <span className='NoItems'>No Items in the Cart</span>
//                                         </div>
//                                     )}
//                                 </div>
//                             </div>
//                         </div>
//                     )}
//                     <div className='cart-items-mainR'>
//                         <div className='cart-items-mainRight'>
//                             <div className="cart-summary">
//                                 <div className='item-subTotal'>
//                                     <div> Subtotal<br />({totalItems} items)</div>
//                                     {/* <div>₹{subTotal.toLocaleString()}</div> */}
//                                     <div>{formatIndianCurrency(subTotal, true)}</div>

//                                 </div>
//                                 <div className='item-totalAmount'>
//                                     <div>Total Amount</div>
//                                     <div>{formatIndianCurrency(subTotal, true)}</div>
//                                 </div>
//                                 <button
//                                     className="me-4 cart-btn-pay"
//                                     onClick={handleCheckout}
//                                     disabled={items.length === 0}
//                                 >
//                                     {/* Pay ₹{cartAmount.toLocaleString()} */}
//                                     Pay {formatIndianCurrency(subTotal, true)}

//                                 </button>
//                                 {/* <div className="item-reserve-button">
//                                     Reserve at ₹{cartAmount.toLocaleString()} & Get {cartOffer.toLocaleString()}% Off
//                                 </div> */}
//                             </div>
//                             <div className="help-section">
//                                 <div className='help-section-content'>
//                                     Need Help? <br />
//                                     We're available by phone every day 24/7 <br />
//                                     Contact us at +91 9976274632.
//                                 </div>
//                                 <div className='help-section-content1'>
//                                     <p className='help-socialIcon'>
//                                         <img src='./images/Help_phones.png' className='help-socialIconPhone' alt="Phone" />
//                                     </p>
//                                     <p className='help-socialIcon'>
//                                         <i className="fa-brands fa-whatsapp help-socialIconWp"></i>
//                                     </p>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//                 <br></br> <br></br>
//                 <MainFooter />
//             </div>
//         </MainLayout>
//     );
// };
// export default Cart;



// import React, { useState, useEffect } from 'react';
// import './E1MyCart.css';
// import { useNavigate } from 'react-router-dom';
// import { useLogin } from './LoginContext';
// import MainNavbar from './A1NAVBAR.jsx';
// import MainFooter from './A1FOOTER.jsx';
// import { MainLayout } from './MainLayout';
// import { baseUrl } from '../Adminpanel/BASE_URL';
// import { formatIndianCurrency } from './FORMATED_AMOUNT';
// import { toast } from 'react-toastify';

// const Cart = () => {
//     const { user, openLogin, closeLogin, isLoggedIn, isLoginOpen } = useLogin();
//     const [items, setItems] = useState([]);
//     const [isLoading, setIsLoading] = useState(true);
//     const [selectedItems, setSelectedItems] = useState([]);
//     const navigate = useNavigate();

//     const handleLoginClose = () => {
//         navigate("/home");
//     };

//     // Fetch cart items from database
//     const fetchCartItems = async () => {
//         try {
//             if (!user || !user._id) {
//                 console.log('No user found, skipping cart fetch');
//                 setIsLoading(false);
//                 return;
//             }

//             setIsLoading(true);
//             console.log('Fetching cart items for user:', user._id);

//             const response = await fetch(`${baseUrl}/cart/user/${user._id}`);
//             if (!response.ok) {
//                 throw new Error('Failed to fetch cart items');
//             }
//             const data = await response.json();
//             console.log('Raw cart items fetched:', data);
//             console.log('Cart items fetched:', data.length);
//             setItems(data);
//         } catch (error) {
//             console.error('Error fetching cart items:', error);
//             toast.error('Failed to load cart items');
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     useEffect(() => {
//         if (user && user._id) {
//             fetchCartItems();
//         } else if (!isLoginOpen) {
//             openLogin('login');
//         }
//     }, [user, isLoginOpen]);

//     const handleLoginSuccess = () => {
//         fetchCartItems();
//     };

//     // Add item to cart in database
//     const addToCart = async (item) => {
//         try {
//             const response = await fetch(`${baseUrl}/cart`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(item)
//             });

//             if (!response.ok) {
//                 throw new Error('Failed to add item to cart');
//             }

//             fetchCartItems();
//         } catch (error) {
//             console.error('Error adding to cart:', error);
//             toast.error('Failed to add item to cart');
//         }
//     };

//     // Delete item from cart in database
//     const deleteCartItem = async (id) => {
//         try {
//             const response = await fetch(`${baseUrl}/cart/${id}`, {
//                 method: 'DELETE'
//             });

//             if (!response.ok) {
//                 throw new Error('Failed to delete item from cart');
//             }

//             fetchCartItems();
//             setSelectedItems(prev => prev.filter(itemId => itemId !== id));
//             toast.success('Item removed from cart');
//         } catch (error) {
//             console.error('Error deleting from cart:', error);
//             toast.error('Failed to remove item');
//         }
//     };

//     // Delete multiple items from cart in database
//     const deleteMultipleCartItems = async (itemIds) => {
//         try {
//             const response = await fetch(`${baseUrl}/cart`, {
//                 method: 'DELETE',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({ itemIds })
//             });

//             if (!response.ok) {
//                 throw new Error('Failed to delete items from cart');
//             }

//             fetchCartItems();
//             toast.success(`${itemIds.length} item(s) removed from cart`);
//         } catch (error) {
//             console.error('Error deleting multiple items from cart:', error);
//             toast.error('Failed to remove items');
//         }
//     };

//     // Clear user's cart in database
//     const clearCart = async () => {
//         try {
//             const response = await fetch(`${baseUrl}/cart/clear/${user._id}`, {
//                 method: 'DELETE'
//             });

//             if (!response.ok) {
//                 throw new Error('Failed to clear cart');
//             }

//             fetchCartItems();
//             toast.success('Cart cleared');
//         } catch (error) {
//             console.error('Error clearing cart:', error);
//             toast.error('Failed to clear cart');
//         }
//     };

//     const handleSelectItem = (id) => {
//         setSelectedItems(prev =>
//             prev.includes(id)
//                 ? prev.filter(itemId => itemId !== id)
//                 : [...prev, id]
//         );
//     };

//     const handleSelectAll = () => {
//         if (selectedItems.length === items.length) {
//             setSelectedItems([]);
//         } else {
//             setSelectedItems(items.map(item => item._id));
//         }
//     };

//     const handleDeleteSelected = () => {
//         if (selectedItems.length === 0) return;

//         if (window.confirm(`Are you sure you want to remove ${selectedItems.length} item(s) from cart?`)) {
//             deleteMultipleCartItems(selectedItems);
//         }
//     };

//     const handleDeleteItem = (id) => {
//         if (window.confirm("Are you sure you want to remove this item from cart?")) {
//             deleteCartItem(id);
//         }
//     };

//     const parseAmount = (amount) => {
//         if (!amount && amount !== 0) return 0;
//         if (typeof amount === 'number') return amount;
//         if (typeof amount === 'string') {
//             const cleaned = amount.replace(/[₹$,¥\s]/g, '').replace(/,/g, '');
//             const parsed = parseFloat(cleaned);
//             return isNaN(parsed) ? 0 : parsed;
//         }
//         return 0;
//     };

//     const subTotal = items.reduce((acc, item) => {
//         const amount = parseAmount(item.totalAmount);
//         return acc + amount;
//     }, 0);

//     const totalItems = items.length;

//     const handleCheckout = () => {
//         if (items.length === 0) {
//             toast.warning("Your cart is empty");
//             return;
//         }
//         navigate("/billing_cart", {
//             state: {
//                 cartItems: items,
//                 subTotal: subTotal,
//                 totalItems: items.length,
//             }
//         });
//     };

//     return (
//         <MainLayout>
//             <div>
//                 <MainNavbar />
//                 <div className="container-fluid cart-container">

//                     {isLoading ? (
//                         <div className="container loading">
//                             <div className="spinner-border text-primary" role="status">
//                                 <span className="visually-hidden">Loading...</span>
//                             </div>
//                         </div>
//                     ) : (
//                         <>
//                             <div className='cart-items-main'>
//                                 <h1 className='cart-heading'>My Cart</h1>
//                                 <div className="cart-items">
//                                     <div className="form-group cart-option">
//                                         <div>
//                                             <label className="checkbox-container1">
//                                                 <input
//                                                     type="checkbox"
//                                                     checked={selectedItems.length === items.length && items.length > 0}
//                                                     onChange={handleSelectAll}
//                                                 />
//                                                 <span className="checkmark1">&#x2714;</span>
//                                                 <span className='check-content1'>Select all</span>
//                                             </label>
//                                         </div>
//                                         <div>
//                                             <button
//                                                 className="select-delete-button"
//                                                 onClick={handleDeleteSelected}
//                                                 disabled={selectedItems.length === 0}
//                                             >
//                                                 <img src='./images/Delete_icon.svg' className='select_delete' alt="Delete Selected" />
//                                             </button>
//                                         </div>
//                                     </div>
//                                     <div className='item-scroll'>
//                                         {items.length > 0 ? (
//                                             items.map((item) => {
//                                                 const priceAmount = parseAmount(item.price);
//                                                 const totalAmount = parseAmount(item.totalAmount);
//                                                 return (
//                                                     <div className="cart-item-content" key={item._id}>
//                                                         <div className='input-checks'>
//                                                             <label className="checkbox-container1">
//                                                                 <input
//                                                                     type="checkbox"
//                                                                     checked={selectedItems.includes(item._id)}
//                                                                     onChange={() => handleSelectItem(item._id)}
//                                                                 />
//                                                                 <span className="checkmark1">&#x2714;</span>
//                                                             </label>
//                                                         </div>


//                                                         {/* <div className='item-price'>{formatIndianCurrency(priceAmount, true)} / Per Day</div>
//                                                                 <div className="d-flex itemDateRange">
//                                                                     <div className='item-dateRange'>Campaign Date</div>
//                                                                     <div className='item-detailSection'> {item.dateRange}</div>
//                                                                 </div>
//                                                                 <div className="d-flex itemDateRange">
//                                                                     <div className='item-dateRange'>Total Amount</div>
//                                                                     <div className='item-detailSection'>{formatIndianCurrency(totalAmount, true)}</div>
//                                                                 </div>
//                                                                 <div className="d-flex itemSizeDimensions">
//                                                                     <div className='item-size'>Size & Dimensions</div>
//                                                                     <div className='item-detailSection'> W {item.sizeWidth} x H {item.sizeHeight} <span className='item-slash'> | </span> {item.dimension} Sq.ft</div>
//                                                                 </div>
//                                                                 <div className="d-flex itemAdType">
//                                                                     <div className='item-type'>Ad Type</div>
//                                                                     <div className='item-detailSection'> {item.adType}</div>
//                                                                 </div>
//                                                                 Big Bazaar street, near old bus stand
//                                                             Per Day Cost : ₹ 1,049
//                                                             Size & Dimensions : W 22 X H 22 | 484 Sq.ft
//                                                             Booking Period : 02 Apr - 17 Apr ( 16 Days )
//                                                             Booking Amount : ₹ 16,784
//                                                             Printing Cost : ₹ 5,808
//                                                             Mounting Cost : ₹ 2,420
//                                                             Base Price : ₹ 25,012

//                                                                  */}
//                                                         <div className="item-details d-flex">


//                                                             <div>
//                                                                 <img src={item.image} className='item-img' alt={item.title} />
//                                                             </div>
//                                                             <div>
//                                                                 <div className='item-title'>{item.prodName}</div>
//                                                                 <div className="d-flex itemDateRange">
//                                                                     <div className='item-dateRange'>Per Day Cost</div>
//                                                                     <div> : </div>
//                                                                     <div className='item-detailSection'> {formatIndianCurrency(priceAmount, true)} / Per Day</div>
//                                                                 </div>
//                                                                 <div className="d-flex itemSizeDimensions">
//                                                                     <div className='item-size'>Size & Dimensions</div>
//                                                                     <div> : </div>
//                                                                     <div className='item-detailSection'> W {item.sizeWidth} x H {item.sizeHeight} <span className='item-slash'> | </span> {item.dimension} Sq.ft</div>
//                                                                 </div>
//                                                                 <div className="d-flex itemDateRange">
//                                                                     <div className='item-dateRange'>Booking Period</div>
//                                                                     <div> : </div>
//                                                                     <div className='item-detailSection'> {item.dateRange} &nbsp; ( {item.totalDays} Days )</div>
//                                                                 </div>
//                                                                 <div className="d-flex itemDateRange">
//                                                                     <div className='item-dateRange'>Booking Amount</div>
//                                                                     <div> : </div>
//                                                                     <div className='item-detailSection'>{formatIndianCurrency(totalAmount, true)}</div>
//                                                                 </div>
//                                                                 <div className="d-flex itemDateRange">
//                                                                     <div className='item-dateRange'>Printing Cost</div>
//                                                                     <div> : </div>
//                                                                     <div className='item-detailSection'>{formatIndianCurrency(item.PrintingCost, true)}</div>
//                                                                 </div>
//                                                                 <div className="d-flex itemDateRange">
//                                                                     <div className='item-dateRange'>Mounting Cost</div>
//                                                                     <div> : </div>
//                                                                     <div className='item-detailSection'>{formatIndianCurrency(item.MountingCost, true)}</div>
//                                                                 </div>
//                                                                 {/* 
//                                                                 <div className="d-flex itemAdType">
//                                                                     <div className='item-type'>Ad Type</div>
//                                                                     <div className='item-detailSection'> {item.adType}</div>
//                                                                 </div> */}

//                                                             </div>
//                                                         </div>
//                                                         <div>
//                                                             <button
//                                                                 className="item-delete-button"
//                                                                 onClick={() => handleDeleteItem(item._id)}
//                                                             >
//                                                                 <i className="fa-solid fa-x"></i>
//                                                             </button>
//                                                         </div>
//                                                     </div>
//                                                 );
//                                             })
//                                         ) : (
//                                             <div className='text-center align-center'>
//                                                 <i className="fas fa-exclamation-circle" style={{ color: 'red', fontSize: '20px', marginRight: '5px' }}></i>
//                                                 <span className='NoItems'>No Items in the Cart</span>
//                                             </div>
//                                         )}
//                                     </div>
//                                 </div>
//                             </div>
//                             <div className='cart-items-mainR'>
//                                 <div className='cart-items-mainRight'>
//                                     <div className="cart-summary">
//                                         <div className='item-subTotal'>
//                                             <div> Subtotal<br />({totalItems} items)</div>
//                                             <div>{formatIndianCurrency(subTotal, true)}</div>
//                                         </div>
//                                         <div className='item-totalAmount'>
//                                             <div>Total Amount</div>
//                                             <div>{formatIndianCurrency(subTotal, true)}</div>
//                                         </div>
//                                         <button
//                                             className="me-4 cart-btn-pay"
//                                             onClick={handleCheckout}
//                                             disabled={items.length === 0}
//                                         >
//                                             Pay {formatIndianCurrency(subTotal, true)}
//                                         </button>
//                                     </div>
//                                     <div className="help-section">
//                                         <div className='help-section-content'>
//                                             Need Help? <br />
//                                             We're available by phone every day 24/7 <br />
//                                             Contact us at +91 9976274632.
//                                         </div>
//                                         <div className='help-section-content1'>
//                                             <p className='help-socialIcon'>
//                                                 <img src='./images/Help_phones.png' className='help-socialIconPhone' alt="Phone" />
//                                             </p>
//                                             <p className='help-socialIcon'>
//                                                 <i className="fa-brands fa-whatsapp help-socialIconWp"></i>
//                                             </p>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </>
//                     )}
//                 </div>
//                 <br></br> <br></br>
//                 <MainFooter />
//             </div>
//         </MainLayout>
//     );
// };

// export default Cart;


// E1MyCart.jsx - Complete Updated Version with Blur Effect & Permanent Popup
import React, { useState, useEffect, useRef } from 'react';
import './E1MyCart.css';
import { useNavigate } from 'react-router-dom';
import { useLogin } from './LoginContext';
import MainNavbar from './A1NAVBAR.jsx';
import MainFooter from './A1FOOTER.jsx';
import { MainLayout } from './MainLayout';
import { baseUrl } from '../Adminpanel/BASE_URL';
import { formatIndianCurrency } from './FORMATED_AMOUNT';
import { toast } from 'react-toastify';

const Cart = () => {
    const { user, openLogin, closeLogin, isLoggedIn, isLoginOpen } = useLogin();
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedItems, setSelectedItems] = useState([]);
    const [conflictItems, setConflictItems] = useState(new Set());
    const [isCheckingConflicts, setIsCheckingConflicts] = useState(false);
    const [conflictDetails, setConflictDetails] = useState({});
    const [orderedItems, setOrderedItems] = useState([]);
    const conflictItemRefs = useRef({});

    const navigate = useNavigate();
const conflictToastShown = useRef(false);
const queueToastShown = useRef(false);
    // // Fetch cart items from database
    // const fetchCartItems = async () => {
    //     try {
    //         if (!user || !user._id) {
    //             console.log('No user found, skipping cart fetch');
    //             setIsLoading(false);
    //             return;
    //         }

    //         setIsLoading(true);
    //         console.log('Fetching cart items for user:', user._id);

    //         const response = await fetch(`${baseUrl}/cart/user/${user._id}`);
    //         if (!response.ok) {
    //             throw new Error('Failed to fetch cart items');
    //         }
    //         const data = await response.json();
    //         console.log('Cart items fetched:', data.length);
    //         setItems(data);

    //         if (data.length > 0) {
    //             await checkAllCartItemsConflicts(data);
    //         } else {
    //             setOrderedItems([]);
    //         }
    //     } catch (error) {
    //         console.error('Error fetching cart items:', error);
    //         toast.error('Failed to load cart items');
    //     } finally {
    //         setIsLoading(false);
    //     }
    // };



    // Fetch cart items from database
const fetchCartItems = async () => {
    try {
        if (!user || !user._id) {
            console.log('No user found, skipping cart fetch');
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        console.log('Fetching cart items for user:', user._id);

        const response = await fetch(`${baseUrl}/cart/user/${user._id}`);
        if (!response.ok) {
            throw new Error('Failed to fetch cart items');
        }
        const data = await response.json();
        console.log('Cart items fetched:', data.length);
        setItems(data);

        if (data.length > 0) {
            await checkAllCartItemsConflicts(data, true); // true = show toast on initial load
        } else {
            setOrderedItems([]);
            // Reset toast flags when cart becomes empty
            conflictToastShown.current = false;
            queueToastShown.current = false;
        }
    } catch (error) {
        console.error('Error fetching cart items:', error);
        toast.error('Failed to load cart items');
    } finally {
        setIsLoading(false);
    }
};


    // // Check conflicts for all cart items using single API
    // const checkAllCartItemsConflicts = async (cartItems) => {
    //     if (!cartItems || cartItems.length === 0) return;

    //     setIsCheckingConflicts(true);

    //     try {
    //         const itemsToCheck = cartItems.map(item => ({
    //             cartItemId: item._id,
    //             productId: item.productId,
    //             productName: item.prodName,
    //             prodCode: item.prodCode,
    //             startDate: item.startDate,
    //             endDate: item.endDate
    //         }));

    //         const response = await fetch(`${baseUrl}/check-date-conflicts`, {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify({ items: itemsToCheck, userId: user?._id })
    //         });

    //         const data = await response.json();

    //         if (data.success && data.type === 'bulk') {
    //             const conflictedIds = new Set();
    //             const details = {};

    //             data.results.forEach(result => {
    //                 if (result.hasConflicts) {
    //                     conflictedIds.add(result.cartItemId);
    //                     details[result.cartItemId] = {
    //                         hasConflicts: true,
    //                         confirmedConflictCount: result.confirmedConflictCount,
    //                         message: result.message,
    //                         confirmedConflicts: result.confirmedConflicts,
    //                         isConflicted: true
    //                     };
    //                 } else if (result.hasQueueDates) {
    //                     details[result.cartItemId] = {
    //                         hasConflicts: false,
    //                         hasQueueDates: true,
    //                         pendingConflictCount: result.pendingConflictCount,
    //                         message: result.message,
    //                         isConflicted: false
    //                     };
    //                 } else {
    //                     details[result.cartItemId] = {
    //                         hasConflicts: false,
    //                         hasQueueDates: false,
    //                         message: result.message,
    //                         isConflicted: false
    //                     };
    //                 }
    //             });

    //             setConflictItems(conflictedIds);
    //             setConflictDetails(details);

    //             // Create ordered items: conflicted first, then non-conflicted
    //             const ordered = [...cartItems].sort((a, b) => {
    //                 const aIsConflicted = conflictedIds.has(a._id);
    //                 const bIsConflicted = conflictedIds.has(b._id);
    //                 if (aIsConflicted && !bIsConflicted) return -1;
    //                 if (!aIsConflicted && bIsConflicted) return 1;
    //                 return 0;
    //             });

    //             setOrderedItems(ordered);

    //             // Add infinite blink class to conflicted items
    //             setTimeout(() => {
    //                 conflictedIds.forEach(id => {
    //                     const element = conflictItemRefs.current[id];
    //                     if (element) {
    //                         element.classList.add('blink-infinite');
    //                     }
    //                 });
    //             }, 100);

    //             if (conflictedIds.size > 0) {
    //                 toast.warning(`${conflictedIds.size} item(s) in your cart have date conflicts. Please review them.`);
    //             }
    //         } else {
    //             setOrderedItems([...cartItems]);
    //         }
    //     } catch (error) {
    //         console.error('Error checking conflicts:', error);
    //         setOrderedItems([...cartItems]);
    //     } finally {
    //         setIsCheckingConflicts(false);
    //     }
    // };



    // Check conflicts for all cart items using single API
const checkAllCartItemsConflicts = async (cartItems, showInitialToast = true) => {
    if (!cartItems || cartItems.length === 0) return;

    setIsCheckingConflicts(true);

    try {
        const itemsToCheck = cartItems.map(item => ({
            cartItemId: item._id,
            productId: item.productId,
            productName: item.prodName,
            prodCode: item.prodCode,
            startDate: item.startDate,
            endDate: item.endDate
        }));

        const response = await fetch(`${baseUrl}/check-date-conflicts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ items: itemsToCheck, userId: user?._id })
        });

        const data = await response.json();

        if (data.success && data.type === 'bulk') {
            const conflictedIds = new Set();
            const details = {};

            data.results.forEach(result => {
                if (result.hasConflicts) {
                    conflictedIds.add(result.cartItemId);
                    details[result.cartItemId] = {
                        hasConflicts: true,
                        confirmedConflictCount: result.confirmedConflictCount,
                        message: result.message,
                        confirmedConflicts: result.confirmedConflicts,
                        isConflicted: true
                    };
                } else if (result.hasQueueDates) {
                    details[result.cartItemId] = {
                        hasConflicts: false,
                        hasQueueDates: true,
                        pendingConflictCount: result.pendingConflictCount,
                        message: result.message,
                        isConflicted: false
                    };
                } else {
                    details[result.cartItemId] = {
                        hasConflicts: false,
                        hasQueueDates: false,
                        message: result.message,
                        isConflicted: false
                    };
                }
            });

            setConflictItems(conflictedIds);
            setConflictDetails(details);

            // Create ordered items: conflicted first, then non-conflicted
            const ordered = [...cartItems].sort((a, b) => {
                const aIsConflicted = conflictedIds.has(a._id);
                const bIsConflicted = conflictedIds.has(b._id);
                if (aIsConflicted && !bIsConflicted) return -1;
                if (!aIsConflicted && bIsConflicted) return 1;
                return 0;
            });

            setOrderedItems(ordered);

            // Add infinite blink class to conflicted items
            setTimeout(() => {
                conflictedIds.forEach(id => {
                    const element = conflictItemRefs.current[id];
                    if (element) {
                        element.classList.add('blink-infinite');
                    }
                });
            }, 100);

            // Only show toast on initial load, not on re-checks
            if (showInitialToast && conflictedIds.size > 0 && !conflictToastShown.current) {
                toast.warning(`${conflictedIds.size} item(s) in your cart have date conflicts. Please review them.`);
                conflictToastShown.current = true;
            }
            
            // Show queue toast only once
            const hasQueue = data.results.some(r => r.hasQueueDates);
            if (showInitialToast && hasQueue && !queueToastShown.current) {
                const queueCount = data.results.filter(r => r.hasQueueDates).length;
                toast.info(`${queueCount} item(s) have dates in queue.`);
                queueToastShown.current = true;
            }
        } else {
            setOrderedItems([...cartItems]);
        }
    } catch (error) {
        console.error('Error checking conflicts:', error);
        setOrderedItems([...cartItems]);
    } finally {
        setIsCheckingConflicts(false);
    }
};


    // // Re-check conflicts when items change
    // useEffect(() => {
    //     if (items.length > 0) {
    //         checkAllCartItemsConflicts(items);
    //     } else {
    //         setOrderedItems([]);
    //         setConflictItems(new Set());
    //         setConflictDetails({});
    //     }
    // }, [items]);



    // Re-check conflicts when items change - but don't show toast again
useEffect(() => {
    if (items.length > 0) {
        checkAllCartItemsConflicts(items, false); // false = don't show toast
    } else {
        setOrderedItems([]);
        setConflictItems(new Set());
        setConflictDetails({});
        // Reset toast flags when cart becomes empty
        conflictToastShown.current = false;
        queueToastShown.current = false;
    }
}, [items]);


    useEffect(() => {
        if (user && user._id) {
            fetchCartItems();
        } else if (!isLoginOpen) {
            openLogin('login');
        }
    }, [user, isLoginOpen]);

    // Delete item from cart
    const deleteCartItem = async (id) => {
        try {
            const response = await fetch(`${baseUrl}/cart/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Failed to delete item from cart');
            }

            // Remove blink class if exists
            const element = conflictItemRefs.current[id];
            if (element) {
                element.classList.remove('blink-infinite');
            }

            setConflictItems(prev => {
                const newSet = new Set(prev);
                newSet.delete(id);
                return newSet;
            });
            setConflictDetails(prev => {
                const newDetails = { ...prev };
                delete newDetails[id];
                return newDetails;
            });

            delete conflictItemRefs.current[id];

            fetchCartItems();
            setSelectedItems(prev => prev.filter(itemId => itemId !== id));
            toast.success('Item removed from cart');
        } catch (error) {
            console.error('Error deleting from cart:', error);
            toast.error('Failed to remove item');
        }
    };

    // Delete multiple items from cart
    const deleteMultipleCartItems = async (itemIds) => {
        try {
            const response = await fetch(`${baseUrl}/cart`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ itemIds })
            });

            if (!response.ok) {
                throw new Error('Failed to delete items from cart');
            }

            itemIds.forEach(id => {
                const element = conflictItemRefs.current[id];
                if (element) {
                    element.classList.remove('blink-infinite');
                }
                delete conflictItemRefs.current[id];
            });

            itemIds.forEach(id => {
                setConflictItems(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(id);
                    return newSet;
                });
                setConflictDetails(prev => {
                    const newDetails = { ...prev };
                    delete newDetails[id];
                    return newDetails;
                });
            });

            fetchCartItems();
            toast.success(`${itemIds.length} item(s) removed from cart`);
        } catch (error) {
            console.error('Error deleting multiple items from cart:', error);
            toast.error('Failed to remove items');
        }
    };

    const handleSelectItem = (id) => {
        if (conflictItems.has(id)) {
            toast.warning("Cannot select conflicted items. Please remove them first.");
            return;
        }

        setSelectedItems(prev =>
            prev.includes(id)
                ? prev.filter(itemId => itemId !== id)
                : [...prev, id]
        );
    };

    const handleSelectAll = () => {
        const selectableItems = orderedItems.filter(item => !conflictItems.has(item._id));
        if (selectedItems.length === selectableItems.length && selectableItems.length > 0) {
            setSelectedItems([]);
        } else {
            setSelectedItems(selectableItems.map(item => item._id));
        }
    };

    const handleDeleteSelected = () => {
        if (selectedItems.length === 0) return;

        if (window.confirm(`Are you sure you want to remove ${selectedItems.length} item(s) from cart?`)) {
            deleteMultipleCartItems(selectedItems);
        }
    };

    const handleDeleteItem = (id) => {
        if (window.confirm("Are you sure you want to remove this item from cart?")) {
            deleteCartItem(id);
        }
    };

    const parseAmount = (amount) => {
        if (!amount && amount !== 0) return 0;
        if (typeof amount === 'number') return amount;
        if (typeof amount === 'string') {
            const cleaned = amount.replace(/[₹$,¥\s]/g, '').replace(/,/g, '');
            const parsed = parseFloat(cleaned);
            return isNaN(parsed) ? 0 : parsed;
        }
        return 0;
    };

    const calculateBasePrice = (item) => {
        const bookingAmount = parseAmount(item.totalAmount);
        const printingCost = parseAmount(item.PrintingCost);
        const mountingCost = parseAmount(item.MountingCost);
        return bookingAmount + printingCost + mountingCost;
    };

    const getValidItems = () => {
        return orderedItems.filter(item => !conflictItems.has(item._id));
    };

    const validItems = getValidItems();
    const totalBasePrice = validItems.reduce((acc, item) => {
        return acc + calculateBasePrice(item);
    }, 0);

    const gstAmount = totalBasePrice * 0.18;
    const formattedGstAmount = Math.floor(gstAmount);
    const overallTotal = totalBasePrice + formattedGstAmount;
    const conflictedCount = conflictItems.size;
    const validCount = validItems.length;

    // const handleCheckout = async () => {
    //     if (validItems.length === 0) {
    //         if (conflictedCount > 0) {
    //             toast.warning("Please remove conflicted items before proceeding to checkout");
    //         } else {
    //             toast.warning("Your cart is empty");
    //         }
    //         return;
    //     }

    //     setIsCheckingConflicts(true);
    //     try {
    //         const itemsToCheck = validItems.map(item => ({
    //             cartItemId: item._id,
    //             productId: item.productId,
    //             productName: item.prodName,
    //             prodCode: item.prodCode,
    //             startDate: item.startDate,
    //             endDate: item.endDate
    //         }));

    //         const response = await fetch(`${baseUrl}/check-date-conflicts`, {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify({ items: itemsToCheck, userId: user?._id })
    //         });

    //         const data = await response.json();

    //         if (data.success && data.type === 'bulk') {
    //             const newConflicts = new Set();
    //             data.results.forEach(result => {
    //                 if (result.hasConflicts) {
    //                     newConflicts.add(result.cartItemId);
    //                 }
    //             });

    //             if (newConflicts.size > 0) {
    //                 setConflictItems(newConflicts);
    //                 setTimeout(() => {
    //                     newConflicts.forEach(id => {
    //                         const element = conflictItemRefs.current[id];
    //                         if (element) {
    //                             element.classList.add('blink-infinite');
    //                         }
    //                     });
    //                 }, 100);
    //                 toast.error(`${newConflicts.size} item(s) are no longer available. Please remove them to proceed.`);
    //                 return;
    //             }
    //         }

    //         navigate("/billing_cart", {
    //             state: {
    //                 cartItems: validItems,
    //                 subTotal: totalBasePrice,
    //                 totalItems: validItems.length,
    //                 totalBasePrice: totalBasePrice,
    //                 gstAmount: formattedGstAmount,
    //                 overallTotal: overallTotal,
    //             }
    //         });
    //     } catch (error) {
    //         console.error('Error during checkout conflict check:', error);
    //         toast.error('Failed to verify availability. Please try again.');
    //     } finally {
    //         setIsCheckingConflicts(false);
    //     }
    // };



    const handleCheckout = async () => {
    if (validItems.length === 0) {
        if (conflictedCount > 0) {
            toast.warning("Please remove conflicted items before proceeding to checkout");
        } else {
            toast.warning("Your cart is empty");
            // Reset toast flags when cart becomes empty
            conflictToastShown.current = false;
            queueToastShown.current = false;
        }
        return;
    }

    setIsCheckingConflicts(true);
    try {
        const itemsToCheck = validItems.map(item => ({
            cartItemId: item._id,
            productId: item.productId,
            productName: item.prodName,
            prodCode: item.prodCode,
            startDate: item.startDate,
            endDate: item.endDate
        }));

        const response = await fetch(`${baseUrl}/check-date-conflicts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ items: itemsToCheck, userId: user?._id })
        });

        const data = await response.json();

        if (data.success && data.type === 'bulk') {
            const newConflicts = new Set();
            data.results.forEach(result => {
                if (result.hasConflicts) {
                    newConflicts.add(result.cartItemId);
                }
            });

            if (newConflicts.size > 0) {
                setConflictItems(newConflicts);
                setTimeout(() => {
                    newConflicts.forEach(id => {
                        const element = conflictItemRefs.current[id];
                        if (element) {
                            element.classList.add('blink-infinite');
                        }
                    });
                }, 100);
                // Show this error toast (it's fine to show as it's a user action)
                toast.error(`${newConflicts.size} item(s) are no longer available. Please remove them to proceed.`);
                return;
            }
        }

        navigate("/billing_cart", {
            state: {
                cartItems: validItems,
                subTotal: totalBasePrice,
                totalItems: validItems.length,
                totalBasePrice: totalBasePrice,
                gstAmount: formattedGstAmount,
                overallTotal: overallTotal,
            }
        });
    } catch (error) {
        console.error('Error during checkout conflict check:', error);
        toast.error('Failed to verify availability. Please try again.');
    } finally {
        setIsCheckingConflicts(false);
    }
};


    const isItemConflicted = (itemId) => conflictItems.has(itemId);
    
    const getConflictMessage = (itemId) => {
        const details = conflictDetails[itemId];
        if (details?.hasConflicts) {
            return `${details.confirmedConflictCount} date(s) are no longer available`;
        }
        if (details?.hasQueueDates) {
            return `${details.pendingConflictCount} date(s) are in queue`;
        }
        return null;
    };

    const handleHighlightConflicts = () => {
        conflictItems.forEach(id => {
            const element = conflictItemRefs.current[id];
            if (element) {
                element.classList.remove('blink-infinite');
                void element.offsetWidth;
                element.classList.add('blink-infinite');
            }
        });
        toast.info("Highlighting conflicted items");
    };

    return (
        <MainLayout>
            <div>
                <MainNavbar />
                <div className="container-fluid cart-container">

                    {isLoading ? (
                        <div className="container loading">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className='cart-items-main'>
                                <h1 className='cart-heading'>My Cart</h1>
                                <div className="cart-items">
                                    <div className="form-group cart-option">
                                        <div>
                                            <label className="checkbox-container1">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedItems.length === validItems.length && validItems.length > 0}
                                                    onChange={handleSelectAll}
                                                />
                                                <span className="checkmark1">&#x2714;</span>
                                                <span className='check-content1'>Select all</span>
                                            </label>
                                        </div>
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            {/* {conflictedCount > 0 && (
                                                <button
                                                    className="highlight-conflicts-btn"
                                                    onClick={handleHighlightConflicts}
                                                    title="Highlight conflicted items"
                                                >
                                                    <i className="fa-solid fa-eye"></i>
                                                    <span>Highlight</span>
                                                </button>
                                            )} */}
                                            <button
                                                className="select-delete-button"
                                                onClick={handleDeleteSelected}
                                                disabled={selectedItems.length === 0}
                                            >
                                                <img src='./images/Delete_icon.svg' className='select_delete' alt="Delete Selected" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className='item-scroll'>
                                        {orderedItems.length > 0 ? (
                                            orderedItems.map((item) => {
                                                const priceAmount = parseAmount(item.price);
                                                const totalAmount = parseAmount(item.totalAmount);
                                                const printingCost = parseAmount(item.PrintingCost);
                                                const mountingCost = parseAmount(item.MountingCost);
                                                const basePrice = calculateBasePrice(item);
                                                const isConflicted = isItemConflicted(item._id);
                                                const conflictMsg = getConflictMessage(item._id);

                                                return (
                                                    <div
                                                        ref={el => conflictItemRefs.current[item._id] = el}
                                                        className={`cart-item-content ${isConflicted ? 'cart-item-conflicted' : ''}`}
                                                        key={item._id}
                                                    >
                                                        <div className='input-checks'>
                                                            <label className="checkbox-container1">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={selectedItems.includes(item._id)}
                                                                    onChange={() => handleSelectItem(item._id)}
                                                                    disabled={isConflicted}
                                                                />
                                                                <span className="checkmark1">&#x2714;</span>
                                                            </label>
                                                        </div>

                                                        <div className={`item-details d-flex ${isConflicted ? 'blur-content' : ''}`}>
                                                            <div>
                                                                <img src={item.image} className='item-img' alt={item.title} />
                                                            </div>
                                                            <div>
                                                                <div className='item-title'>{item.prodName}</div>

                                                                {/* {!isConflicted && conflictDetails[item._id]?.hasQueueDates && (
                                                                    <div className="item-queue-badge">
                                                                        <i className="fa-solid fa-clock"></i>
                                                                        <span>{conflictDetails[item._id].message}</span>
                                                                    </div>
                                                                )} */}

                                                                <table className='item-cart-tableMain'>
                                                                    <tbody>
                                                                        <tr>
                                                                            <td className='item-dateRange'>Per Day Cost</td>
                                                                            <td className='item-cart_separation'> : </td>
                                                                            <td className='item-detailSection'> {formatIndianCurrency(priceAmount, true)} / Per Day</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td className='item-size'>Size & Dimensions</td>
                                                                            <td className='item-cart_separation'> : </td>
                                                                            <td className='item-detailSection'> W {item.sizeWidth} x H {item.sizeHeight} <span className='item-slash'> | </span> {item.dimension} Sq.ft</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td className='item-dateRange'>Booking Period</td>
                                                                            <td className='item-cart_separation'> : </td>
                                                                            <td className='item-detailSection'> {item.dateRange} &nbsp; ( {item.totalDays} Days )</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td className='item-dateRange'>Booking Amount</td>
                                                                            <td className='item-cart_separation'> : </td>
                                                                            <td className='item-detailSection'>{formatIndianCurrency(totalAmount, true)}</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td className='item-dateRange'>Printing Cost</td>
                                                                            <td className='item-cart_separation'> : </td>
                                                                            <td className='item-detailSection'>{formatIndianCurrency(printingCost, true)}</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td className='item-dateRange'>Mounting Cost</td>
                                                                            <td className='item-cart_separation'> : </td>
                                                                            <td className='item-detailSection'>{formatIndianCurrency(mountingCost, true)}</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td className='item-dateRange'>Base Price</td>
                                                                            <td className='item-cart_separation'> : </td>
                                                                            <td className='item-detailSection'>
                                                                                {formatIndianCurrency(basePrice, true)}
                                                                            </td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </div>
                                                        
                                                        {/* Permanent Popup for Conflicted Item - stays until deleted */}
                                                        {isConflicted && (
                                                            <div className="conflict-popup-permanent">
                                                                <div className="conflict-popup-content-permanent">
                                                                    <div className="popup-icon">
                                                                        <i >
                                                                            <img src='./images/Cart_CalendarIcon.png' className='cart_calendar_conflict_icon_img' alt="Conflict_Calendar" />
                                                                        </i>
                                                                    </div>
                                                                    <div className="popup-text">
                                                                        <strong>Booking Conflict Detected!</strong>
                                                                        <span>{"Selected dates are no longer available"}</span>
                                                                        {/* <span>
                                                                            These dates are currently unavailable.<br></br>
                                                                            → Remove item to continue checkout
                                                                        </span> */}
                                                                    </div>
                                                                    <button
                                                                        className="conflict-popup-delete-permanent"
                                                                        onClick={() => handleDeleteItem(item._id)}
                                                                    >
                                                                        <i className="fa-solid fa-trash"></i> Remove Now
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        )}
                                                        
                                                        <div>
                                                            <button
                                                                className={`item-delete-button ${isConflicted ? 'item-delete-button-warning' : ''}`}
                                                                onClick={() => handleDeleteItem(item._id)}
                                                            >
                                                                <i className="fa-solid fa-x"></i>
                                                            </button>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        ) : (
                                            <div className='text-center align-center'>
                                                <i className="fas fa-exclamation-circle" style={{ color: 'red', fontSize: '20px', marginRight: '5px' }}></i>
                                                <span className='NoItems'>No Items in the Cart</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                           
                             
                            {/* Attractive Conflict Note with Blink Effect */}
                            {conflictedCount > 0 && (
                                <div className='conflict-note-wrapper'>
                                    <div className='item-conflict-note-attractive'>
                                        <div className="conflict-note-icon">
                                            {/* <i className="fa-solid fa-circle-exclamation"></i> */}
                                             {/* <i >
                                                                            <img src='./images/Cart_AlertIcon.png' className='cart_calendar_conflict_icon_img' alt="Conflict" />
                                                                        </i> */}
                                        </div>
                                        <div className="conflict-note-text">
                                            {/* <span className="conflict-count"></span> */}
                                             <i >
                                                                            <img src='./images/Cart_AlertIcon.png' className='cart_calendar_conflict_icon_img' alt="Conflict" />
                                                                        </i>
                                            <span className='conflict-count'>{conflictedCount}</span>
                                            <span>  item(s) with conflicts excluded from total</span>
                                        </div>
                                        <div className="conflict-note-blink">
                                            <i className="fa-solid fa-bell"></i>
                                            <span>Action Required!</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div className='cart-items-mainR'>
                                <div className='cart-items-mainRight'>
                                    <div className="cart-summary">
                                        <div className='item-subTotal'>
                                            <div>Subtotal<br />({validCount} valid items)</div>
                                            <div>{formatIndianCurrency(totalBasePrice, true)}</div>
                                        </div>
                                       
                                        <div className='item-subTotal'>
                                            <div> GST @ (18%)</div>
                                            <div>{formatIndianCurrency(formattedGstAmount, true)}</div>
                                        </div>
                                        <div className='item-totalAmount'>
                                            <div>Total Amount</div>
                                            <div>{formatIndianCurrency(overallTotal, true)}</div>
                                        </div>
                                        <button
                                            className="cart-btn-pay"
                                            onClick={handleCheckout}
                                            disabled={validItems.length === 0 || isCheckingConflicts}
                                        >
                                            {isCheckingConflicts ? (
                                                <span><i className="fa-solid fa-spinner fa-spin"></i> Checking...</span>
                                            ) : (
                                                `Checkout`
                                            )}
                                        </button>
                                    </div>
                                    <div className="help-section">
                                        <div className='help-section-content'>
                                            Need Help? <br />
                                            We're available by phone every day 24/7 <br />
                                            Contact us at +91 7373785048.
                                        </div>
                                        <div className='help-section-content1'>
                                            <p className='help-socialIcon'>
                                                <img src='./images/Help_phones.png' className='help-socialIconPhone' alt="Phone" />
                                            </p>
                                            <p className='help-socialIcon'>
                                                <i className="fa-brands fa-whatsapp help-socialIconWp"></i>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
                <br></br> <br></br>
                <MainFooter />
            </div>
        </MainLayout>
    );
};

export default Cart;