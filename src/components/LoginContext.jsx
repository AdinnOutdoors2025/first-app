// //LOGOUT LOADING - PERFECT CODE 
import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';

const LoginContext = createContext();

export const LoginProvider = ({ children }) => {
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isUserLoading, setIsUserLoading] = useState(true);
    const [user, setUser] = useState(() => {
        try {
            const savedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
            return savedUser ? JSON.parse(savedUser) : null;
        } catch (error) {
            console.error("Error parsing user data:", error);
            return null;
        }
    });
    
    // NEW: State for logout loading
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    // Track if we're on a protected page to prevent double loading
    const isProtectedPage = useRef(false);
    
    // Using useRef for timer to ensure stability across re-renders
    const inactivityTimer = useRef(null);
    const lastActivityTime = useRef(Date.now());
    const INACTIVITY_TIMEOUT = 2 * 60 * 60 * 1000; // 2 hours
    
    const [loginMode, setLoginMode] = useState('login'); // 'login' or 'signup'
    const toggleLogin = () => setIsLoginOpen(!isLoginOpen);
    const closeLogin = () => setIsLoginOpen(false);

    const openLogin = (mode = 'login', redirectPath = null) => {
        setLoginMode(mode);
        setIsLoginOpen(true);
        if (redirectPath) {
            sessionStorage.setItem('loginRedirect', redirectPath);
        }
    };

    const loginUser = (userData, rememberMe = false, isSignUp = false) => {
        console.log("Login user called with:", userData);
        
        if (!userData || !userData._id) {
            console.error("Invalid user data received during login:", userData);
            toast.error("Failed to login. Please try again.", {
                position: "bottom-right",
                autoClose: 3000,
            });
            return;
        }
        
        const userWithId = {
            ...userData,
            _id: userData._id || userData.id,
            isAdmin: userData.role === 'admin'
        };
        
        console.log("Setting user in context:", userWithId);
        
        setUser(userWithId);
        if (rememberMe) {
            localStorage.setItem('user', JSON.stringify(userWithId));
            sessionStorage.removeItem('user');
        } else {
            sessionStorage.setItem('user', JSON.stringify(userWithId));
            localStorage.removeItem('user');
        }
        
        // // Show success message
        // toast.success(`Welcome back, ${userData.userName || 'User'}!`, {
        //     position: "bottom-right",
        //     autoClose: 2000,
        // });

         // Show different messages for login vs signup
        if (isSignUp) {
            toast.success(`Account created successfully, ${userData.userName || 'User'}!`, {
                position: "bottom-right",
                autoClose: 2000,
            });
        } else {
            toast.success(`Welcome back, ${userData.userName || 'Admin'}!`, {
                position: "bottom-right",
                autoClose: 2000,
            });
        }
        
        // Handle redirect
        const redirectPath = sessionStorage.getItem('loginRedirect');
        if (redirectPath) {
            sessionStorage.removeItem('loginRedirect');
            setTimeout(() => {
                window.location.href = redirectPath;
            }, 500);
        }
    };

    const logoutUser = (redirectToHome = true, showMessage = true) => {
        console.log('Starting logout process...');
        
        // Check if we're on a protected page BEFORE setting the loading state
        const currentPath = window.location.pathname;
        const isOnProtectedPage = currentPath.includes('/billing') || 
                                  currentPath.includes('/thank_you') ||
                                  currentPath.includes('/order');
        
        // Set the ref for use in other components
        isProtectedPage.current = isOnProtectedPage;
        
        // Only show loading state if NOT on a protected page OR if we won't redirect immediately
        if (!isOnProtectedPage) {
            setIsLoggingOut(true);
        }
        
        if (showMessage && user) {
            toast.info(`Logging out, ${user.userName}...`, {
                position: "bottom-right",
                autoClose: 2000,
            });
        }
        
        // Clear inactivity timer immediately
        clearInactivityTimer();
        
        // Wait for 1.5 seconds before completing logout (reduced from 2 seconds)
        setTimeout(() => {
            console.log('Completing logout process...');
            
            // Clear user data
            setUser(null);
            localStorage.removeItem('user');
            sessionStorage.removeItem('user');
            localStorage.removeItem('cartItems');
            
            // Dispatch logout event
            window.dispatchEvent(new Event('user-logged-out'));
            
            // Reset loading state
            setIsLoggingOut(false);
            
            // If on protected page and need to redirect, do it immediately
            if (isOnProtectedPage && redirectToHome) {
                // Use replaceState to prevent back navigation to protected page
                window.history.replaceState(null, '', '/');
                // Force reload to ensure clean state
                window.location.reload();
            }
        }, 1500); // Reduced delay for better UX
    };

    const startInactivityTimer = () => {
        clearInactivityTimer();
        inactivityTimer.current = setTimeout(() => {
            if (Date.now() - lastActivityTime.current >= INACTIVITY_TIMEOUT) {
                logoutUser(true); // Redirect to home on inactivity logout
            }
        }, INACTIVITY_TIMEOUT);
    };

    const clearInactivityTimer = () => {
        if (inactivityTimer.current) {
            clearTimeout(inactivityTimer.current);
            inactivityTimer.current = null;
        }
    };

    const handleUserActivity = () => {
        lastActivityTime.current = Date.now();
        if (user && !localStorage.getItem('user')) {
            startInactivityTimer();
        }
    };

    useEffect(() => {
        const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
        events.forEach(event => {
            window.addEventListener(event, handleUserActivity, { passive: true });
        });

        if (user && !localStorage.getItem('user')) {
            startInactivityTimer();
        }

        return () => {
            events.forEach(event => {
                window.removeEventListener(event, handleUserActivity);
            });
            clearInactivityTimer();
        };
    }, [user]);

    // Check for existing user on initial load
    useEffect(() => {
        const checkUser = async () => {
            try {
                setIsUserLoading(true);
                const savedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
                if (savedUser) {
                    const parsedUser = JSON.parse(savedUser);
                    if (parsedUser && parsedUser._id) {
                        setUser(parsedUser);
                    } else {
                        localStorage.removeItem('user');
                        sessionStorage.removeItem('user');
                        setUser(null);
                    }
                }
            } catch (error) {
                console.error("Error checking user:", error);
                setUser(null);
            } finally {
                setIsUserLoading(false);
            }
        };
        
        checkUser();
    }, []);

    const isAdmin = user?.role === 'admin';

    return (
        <LoginContext.Provider value={{
            isLoginOpen, 
            toggleLogin, 
            closeLogin, 
            openLogin,
            loginUser, 
            logoutUser, 
            user, 
            loginMode, 
            isAdmin,
            isUserLoading,
            isAdmin: user?.role === 'admin',
            isLoggingOut,
            isProtectedPage: isProtectedPage.current, // Export for components to check
        }}>
            {children}
        </LoginContext.Provider>
    );
};

export const useLogin = () => useContext(LoginContext);
