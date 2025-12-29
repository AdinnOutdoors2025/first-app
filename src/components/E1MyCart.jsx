import React, { useState, useEffect } from 'react';
import './E1MyCart.css';
import { useNavigate } from 'react-router-dom';
import { useLogin } from './LoginContext';
import MainNavbar from './A1NAVBAR.jsx';
import NavbarWrapper from './NavbarWrapper.jsx';
import MainFooter from './A1FOOTER.jsx';
import { MainLayout } from './MainLayout';
import { baseUrl } from '../Adminpanel/BASE_URL';
import { formatIndianCurrency } from './FORMATED_AMOUNT';



const Cart = () => {
    const { user, openLogin, closeLogin, isLoggedIn, isLoginOpen } = useLogin();
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedItems, setSelectedItems] = useState([]);
    const navigate = useNavigate();


    const handleLoginClose = () => {
        // When user closes login without logging in, redirect to home
        navigate("/home");
    };


    // Fetch cart items from database
    const fetchCartItems = async () => {
        try {
            if (!user) {
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
            console.log('Cart items fetched:', data);
            setItems(data);
            // setIsLoading(false); 
        } catch (error) {
            console.error('Error fetching cart items:', error);
            // setIsLoading(false);
        }
        finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        if (user) {
            fetchCartItems();
        } else if (!isLoginOpen) {
            openLogin('login');
        }
    }, [user, isLoginOpen]);

    // Add debugging to see what's happening
    useEffect(() => {
        console.log('User state changed:', user);
        console.log('Items state:', items);
    }, [user, items]);


    const handleLoginSuccess = () => {
        // This will be called after successful login
        fetchCartItems();
    };

    // Add item to cart in database
    const addToCart = async (item) => {
        try {
            const response = await fetch(`${baseUrl}/cart`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(item)
            });

            if (!response.ok) {
                throw new Error('Failed to add item to cart');
            }

            fetchCartItems(); // Refresh cart items
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
    };

    // Delete item from cart in database
    const deleteCartItem = async (id) => {
        try {
            const response = await fetch(`${baseUrl}/cart/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Failed to delete item from cart');
            }

            fetchCartItems(); // Refresh cart items
            setSelectedItems(prev => prev.filter(itemId => itemId !== id));

        } catch (error) {
            console.error('Error deleting from cart:', error);
        }
    };

    // Delete multiple items from cart in database
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

            fetchCartItems(); // Refresh cart items
        } catch (error) {
            console.error('Error deleting multiple items from cart:', error);
        }
    };

    // Clear user's cart in database
    const clearCart = async () => {
        try {
            const response = await fetch(`${baseUrl}/cart/clear/${user._id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Failed to clear cart');
            }

            fetchCartItems(); // Refresh cart items
        } catch (error) {
            console.error('Error clearing cart:', error);
        }
    };

    // Select/deselect an item
    const handleSelectItem = (id) => {
        setSelectedItems(prev =>
            prev.includes(id)
                ? prev.filter(itemId => itemId !== id)
                : [...prev, id]
        );
    };

    // Select all items
    const handleSelectAll = () => {
        if (selectedItems.length === items.length) {
            setSelectedItems([]);
        } else {
            setSelectedItems(items.map(item => item._id));
        }
    };

    // Delete selected items
    const handleDeleteSelected = () => {
        if (selectedItems.length === 0) return;

        if (window.confirm(`Are you sure you want to remove ${selectedItems.length} item(s) from cart?`)) {
            deleteMultipleCartItems(selectedItems);
            setSelectedItems([]);
        }
    };

    // Delete a single item
    const handleDeleteItem = (id) => {
        if (window.confirm("Are you sure you want to remove this item from cart?")) {
            deleteCartItem(id);
            setSelectedItems(prev => prev.filter(itemId => itemId !== id));
        }
    };

    // Calculate totals
    const subTotal = items.reduce((acc, item) => {
        const amount = typeof item.totalAmount === 'string'
            ? parseFloat(item.totalAmount.replace(/,/g, ''))
            : item.totalAmount || 0;
        return acc + amount;
    }, 0);

    const totalItems = items.length;
    const cartAmount = items.length > 0 ? items[0]?.SpotPay : 0;
    const cartOffer = items.length > 0 ? items[0]?.Offer : 0;

    // Handle checkout
    const handleCheckout = () => {
        if (items.length === 0) {
            alert("Your cart is empty");
            return;
        }
        navigate("/billing1", {
            state: {
                cartItems: items,
                subTotal: subTotal,
                totalItems: items.length,
                SpotPay: cartAmount,
                Offer: cartOffer
            }
        });
    };



    //FORMAT THE AMOUNT INTO INDIAN CURRENCY
    const parseAmount = (amount) => {
        if (!amount && amount !== 0) return 0;
        
        if (typeof amount === 'number') return amount;
        
        if (typeof amount === 'string') {
            // Remove any commas, currency symbols, and spaces
            const cleaned = amount.replace(/[₹$,¥\s]/g, '').replace(/,/g, '');
            const parsed = parseFloat(cleaned);
            return isNaN(parsed) ? 0 : parsed;
        }
        
        return 0;
    };


    return (
        <MainLayout>
            <div>
                {/* <MainNavbar /> */}
                <NavbarWrapper />
                <div className="container-fluid cart-container">

                    {isLoading ? (
                        <div className="container loading">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : (

                        <div className='cart-items-main'>
                            <h1 className='cart-heading'>My Cart</h1>
                            <div className="cart-items">
                                <div className="form-group cart-option">
                                    <div>
                                        <label className="checkbox-container1">
                                            <input
                                                type="checkbox"
                                                checked={selectedItems.length === items.length && items.length > 0}
                                                onChange={handleSelectAll}
                                            />
                                            <span className="checkmark1">&#x2714;</span>
                                            <span className='check-content1'>Select all</span>
                                        </label>
                                    </div>
                                    <div>
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
                                    {items.length > 0 ? (
                                        items.map((item) => {
                                            // Parse amounts for this item
                                            const priceAmount = parseAmount(item.price);
                                            const totalAmount = parseAmount(item.totalAmount);
                                            return (
                                            <div className="cart-item-content" key={item._id}>
                                                <div className='input-checks'>
                                                    <label className="checkbox-container1">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedItems.includes(item._id)}
                                                            onChange={() => handleSelectItem(item._id)}
                                                        />
                                                        <span className="checkmark1">&#x2714;</span>
                                                    </label>
                                                </div>
                                                <div className="item-details d-flex">
                                                    <div>
                                                        <img src={item.image} className='item-img' alt={item.title} />
                                                    </div>
                                                    <div>
                                                        <div className='item-title'>{item.prodName}</div>
                                                        <div className='item-price'>{formatIndianCurrency(priceAmount, true)} / Per Day</div>
                                                        <div className="d-flex itemDateRange">
                                                            <div className='item-dateRange'>Campaign Date</div>
                                                            <div className='item-detailSection'> {item.dateRange}</div>
                                                        </div>
                                                        <div className="d-flex itemDateRange">
                                                            <div className='item-dateRange'>Total Amount</div>
                                                            <div className='item-detailSection'>{formatIndianCurrency(totalAmount, true)}</div>
                                                        </div>
                                                        <div className="d-flex itemSizeDimensions">
                                                            <div className='item-size'>Size & Dimensions</div>
                                                            <div className='item-detailSection'> W {item.sizeWidth} x H {item.sizeHeight} <span className='item-slash'> | </span> {item.dimension} Sq.ft</div>
                                                        </div>
                                                        <div className="d-flex itemAdType">
                                                            <div className='item-type'>Ad Type</div>
                                                            <div className='item-detailSection'> {item.adType}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <button
                                                        className="item-delete-button"
                                                        onClick={() => handleDeleteItem(item._id)}
                                                    >
                                                        <i className="fa-solid fa-x"></i>
                                                    </button>
                                                </div>
                                            </div>
                                            )
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
                    )}
                    <div className='cart-items-mainR'>
                        <div className='cart-items-mainRight'>
                            <div className="cart-summary">
                                <div className='item-subTotal'>
                                    <div> Subtotal<br />({totalItems} items)</div>
                                    {/* <div>₹{subTotal.toLocaleString()}</div> */}
                                    <div>{formatIndianCurrency(subTotal, true)}</div>

                                </div>
                                <div className='item-totalAmount'>
                                    <div>Total Amount</div>
                                    <div>{formatIndianCurrency(subTotal, true)}</div>
                                </div>
                                <button
                                    className="me-4 cart-btn-pay"
                                    onClick={handleCheckout}
                                    disabled={items.length === 0}
                                >
                                    {/* Pay ₹{cartAmount.toLocaleString()} */}
                                    Pay {formatIndianCurrency(subTotal, true)}

                                </button>
                                {/* <div className="item-reserve-button">
                                    Reserve at ₹{cartAmount.toLocaleString()} & Get {cartOffer.toLocaleString()}% Off
                                </div> */}
                            </div>
                            <div className="help-section">
                                <div className='help-section-content'>
                                    Need Help? <br />
                                    We're available by phone every day 24/7 <br />
                                    Contact us at +91 9976274632.
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
                </div>
                <br></br> <br></br>
                <MainFooter />
            </div>
        </MainLayout>
    );
};
export default Cart;