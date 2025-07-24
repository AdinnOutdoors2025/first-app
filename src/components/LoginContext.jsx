import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
const LoginContext = createContext();
export const LoginProvider = ({ children }) => {
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    // Using useRef for timer to ensure stability across re-renders
    const inactivityTimer = useRef(null);
    const lastActivityTime = useRef(Date.now());
    
    //const INACTIVITY_TIMEOUT = 5 * 1000; // 5 seconds for testing
    const INACTIVITY_TIMEOUT = 2 * 60 * 60 * 1000; // 2hours for production (if the user not used that site then automatically logged out)


    // In LoginContext.js (or wherever your context is defined)
    const [loginMode, setLoginMode] = useState('login'); // 'login' or 'signup'
    const toggleLogin = () => setIsLoginOpen(!isLoginOpen);
    const closeLogin = () => setIsLoginOpen(false);
    // const openLogin = () => setIsLoginOpen(true);


    const openLogin = (mode = 'login') => {
        setLoginMode(mode);
        setIsLoginOpen(true);
    };


    const loginUser = (userData, rememberMe = false) => {
        const userWithId = {
            ...userData,
            _id: userData._id || userData.id,
                        isAdmin: userData.role === 'admin' // Add admin flag

        };
        setUser(userWithId);
        if (rememberMe) {
            localStorage.setItem('user', JSON.stringify(userWithId));
            sessionStorage.removeItem('user');
        } else {
            sessionStorage.setItem('user', JSON.stringify(userWithId));
            localStorage.removeItem('user');
            // startInactivityTimer();
             if (!userWithId.isAdmin) {
                startInactivityTimer();
            }
        }
       // For admin users, don't start inactivity timer
        if (userWithId.isAdmin) {
            clearInactivityTimer();
        }
    };

    const logoutUser = () => {
        console.log('Logging out due to inactivity');
        setUser(null);
        localStorage.removeItem('user');
        sessionStorage.removeItem('user');
        localStorage.removeItem('cartItems');
        clearInactivityTimer();
    };

    const startInactivityTimer = () => {
        clearInactivityTimer();
        inactivityTimer.current = setTimeout(() => {
            // Only logout if no recent activity
            if (Date.now() - lastActivityTime.current >= INACTIVITY_TIMEOUT) {
                logoutUser();
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
        console.log('User activity detected at', new Date().toISOString());
        lastActivityTime.current = Date.now();
        if (user && !localStorage.getItem('user')) {
            startInactivityTimer();
        }
    };

    useEffect(() => {
        // Set up activity listeners
        const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];

        events.forEach(event => {
            window.addEventListener(event, handleUserActivity, { passive: true });
        });

        // Initialize timer if needed
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
        const savedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
        if (savedUser) {
            const parsedUser = JSON.parse(savedUser);
            setUser(parsedUser);
        }
    }, []);


    // const isAdmin = () => {
    //     return user?.role === 'admin';
    // };
    // In your LoginContext provider value
const isAdmin = user?.role === 'admin';


    return (
        <LoginContext.Provider value={{
            isLoginOpen, toggleLogin, closeLogin, openLogin,
            loginUser, logoutUser, user, loginMode, isAdmin,
                        isAdmin: user?.role === 'admin' // Explicit isAdmin check

        }}>
            {children}
        </LoginContext.Provider>
    );
};

export const useLogin = () => useContext(LoginContext);