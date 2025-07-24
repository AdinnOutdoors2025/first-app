import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLogin } from './LoginContext';

//BASE URL OF http://localhost:3001 FILE IMPORT 
import { baseUrl } from '../Adminpanel/BASE_URL';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const { user } = useLogin();
    const [cartItems, setCartItems] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    // const API_BASE_URL = 'http://localhost:3001';

    // Fetch cart items from server
    const fetchCartItems = async () => {
        setIsLoading(true);
        try {
            if (user) {
                // For logged-in users - fetch from database
                const response = await fetch(`${baseUrl}/cart/user/${user._id}`);
                if (!response.ok) throw new Error('Failed to fetch cart items');
                const data = await response.json();
                setCartItems(data);
            } else {
                // For guest users - use localStorage
                const guestCartItems = JSON.parse(localStorage.getItem("guestCartItems")) || [];
                setCartItems(guestCartItems);
            }
        } catch (error) {
            console.error('Error fetching cart items:', error);
            setCartItems([]);
        } finally {
            setIsLoading(false);
        }
    };

    // Add item to cart
    const addToCart = async (item) => {
        try {
            if (user) {
                // For logged-in users - add to database
                const response = await fetch(`${baseUrl}/cart`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        ...item,
                        userId: user._id
                    })
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to add item to cart');
                }

                const newItem = await response.json();
                setCartItems(prev => [...prev, newItem]);
            } else {
                // For guest users - add to localStorage
                const guestCartItems = JSON.parse(localStorage.getItem("guestCartItems")) || [];
                
                // Check if item already exists with same dates
                const existingItemIndex = guestCartItems.findIndex(
                    cartItem => cartItem.productId === item.productId && 
                               cartItem.booking?.startDate === item.booking?.startDate &&
                               cartItem.booking?.endDate === item.booking?.endDate
                );

                if (existingItemIndex >= 0) {
                    throw new Error('Item with these dates already in cart');
                }

                const newItem = {
                    ...item,
                    id: `guest-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
                };
                
                const updatedItems = [...guestCartItems, newItem];
                localStorage.setItem("guestCartItems", JSON.stringify(updatedItems));
                setCartItems(updatedItems);
            }
            
            // Notify other components of cart update
            window.dispatchEvent(new Event('cartUpdated'));
            return true;
        } catch (error) {
            console.error('Error adding to cart:', error);
            throw error;
        }
    };

    // Update cart item
    const updateCartItem = async (id, updates) => {
        try {
            if (user) {
                // For logged-in users - update in database
                const response = await fetch(`${baseUrl}/cart/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updates)
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to update cart item');
                }

                const updatedItem = await response.json();
                setCartItems(prev => 
                    prev.map(item => item._id === id ? updatedItem : item)
                );
            } else {
                // For guest users - update in localStorage
                const guestCartItems = JSON.parse(localStorage.getItem("guestCartItems")) || [];
                const itemIndex = guestCartItems.findIndex(item => item.id === id);
                
                if (itemIndex === -1) {
                    throw new Error('Cart item not found');
                }

                const updatedItems = [...guestCartItems];
                updatedItems[itemIndex] = { ...updatedItems[itemIndex], ...updates };
                localStorage.setItem("guestCartItems", JSON.stringify(updatedItems));
                setCartItems(updatedItems);
            }
            
            window.dispatchEvent(new Event('cartUpdated'));
            return true;
        } catch (error) {
            console.error('Error updating cart item:', error);
            throw error;
        }
    };

    // Remove item from cart
    const removeFromCart = async (id) => {
        try {
            if (user) {
                // For logged-in users - remove from database
                const response = await fetch(`${baseUrl}/cart/${id}`, {
                    method: 'DELETE'
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to remove item from cart');
                }

                setCartItems(prev => prev.filter(item => item._id !== id));
            } else {
                // For guest users - remove from localStorage
                const guestCartItems = JSON.parse(localStorage.getItem("guestCartItems")) || [];
                const updatedItems = guestCartItems.filter(item => item.id !== id);
                localStorage.setItem("guestCartItems", JSON.stringify(updatedItems));
                setCartItems(updatedItems);
            }
            
            window.dispatchEvent(new Event('cartUpdated'));
            return true;
        } catch (error) {
            console.error('Error removing from cart:', error);
            throw error;
        }
    };

    // Clear cart
    const clearCart = async () => {
        try {
            if (user) {
                // For logged-in users - clear database cart
                const response = await fetch(`${baseUrl}/cart/clear/${user._id}`, {
                    method: 'DELETE'
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to clear cart');
                }

                setCartItems([]);
            } else {
                // For guest users - clear localStorage
                localStorage.removeItem("guestCartItems");
                setCartItems([]);
            }
            
            window.dispatchEvent(new Event('cartUpdated'));
            return true;
        } catch (error) {
            console.error('Error clearing cart:', error);
            throw error;
        }
    };

    // Migrate guest cart to user cart after login
    const migrateGuestCart = async (userId) => {
        const guestCartItems = JSON.parse(localStorage.getItem("guestCartItems")) || [];
        if (guestCartItems.length === 0) return;

        try {
            // First, clear any existing cart items for this user
            await fetch(`${baseUrl}/cart/clear/${userId}`, { method: 'DELETE' });

            // Then add all guest items to the database
            await Promise.all(
                guestCartItems.map(item => 
                    fetch(`${baseUrl}/cart`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            ...item,
                            userId: userId,
                            // Ensure we don't send the temporary ID
                            id: undefined
                        })
                    })
                )
            );

            // Clear guest cart
            localStorage.removeItem("guestCartItems");
        } catch (error) {
            console.error('Error migrating cart items:', error);
            // Optionally keep guest items if migration fails
        }
    };

    // Load cart items when component mounts or user changes
    useEffect(() => {
        fetchCartItems();
        
        // Listen for cart updates from other components
        const handleCartUpdate = () => fetchCartItems();
        window.addEventListener('cartUpdated', handleCartUpdate);
        
        return () => {
            window.removeEventListener('cartUpdated', handleCartUpdate);
        };
    }, [user]);

    return (
        <CartContext.Provider value={{
            cartItems,
            isLoading,
            addToCart,
            updateCartItem,
            removeFromCart,
            clearCart,
            migrateGuestCart
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);