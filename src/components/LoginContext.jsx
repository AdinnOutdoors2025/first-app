import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';

const LoginContext = createContext();
export const LoginProvider = ({ children }) => {
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [user, setUser] = useState(() => { 

                //LOADING ERROR HANDLING WHILE LOGOUT

        // const savedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
        // return savedUser ? JSON.parse(savedUser) : null;


        try {
            const savedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
            return savedUser ? JSON.parse(savedUser) : null;
        } catch (error) {
            console.error("Error parsing user data:", error);
            return null;
        } 
                //LOADING ERROR HANDLING WHILE LOGOUT

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




    const openLogin = (mode = 'login', redirectPath = null) => {
        setLoginMode(mode);
        setIsLoginOpen(true);
         // Store the path where login was triggered
    if (redirectPath) {
        sessionStorage.setItem('loginRedirect', redirectPath);
    }
    };




//     const loginUser = (userData, rememberMe = false) => {
//         const userWithId = {
//             ...userData,
//             _id: userData._id || userData.id,
//                         isAdmin: userData.role === 'admin' // Add admin flag


//         };
//         setUser(userWithId);
//         if (rememberMe) {
//             localStorage.setItem('user', JSON.stringify(userWithId));
//             sessionStorage.removeItem('user');
//         } else {
//             sessionStorage.setItem('user', JSON.stringify(userWithId));
//             localStorage.removeItem('user');
//             // startInactivityTimer();
//              if (!userWithId.isAdmin) {
//                 startInactivityTimer();
//             }
//         }
//        // For admin users, don't start inactivity timer
//         if (userWithId.isAdmin) {
//             clearInactivityTimer();
//         }
















//         // Handle redirect
//   const redirectPath = sessionStorage.getItem('loginRedirect');
//   if (redirectPath) {
//     sessionStorage.removeItem('loginRedirect');
//     window.location.href = redirectPath; // Full refresh to ensure cart loads
//   }
//     };


        //LOADING ERROR HANDLING WHILE LOGOUT
 // Add user loading state
    const [isUserLoading, setIsUserLoading] = useState(true);

    // Check user on mount
    useEffect(() => {
        const checkUser = async () => {
            try {
                setIsUserLoading(true);
                const savedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
                if (savedUser) {
                    const parsedUser = JSON.parse(savedUser);
                    // Verify user is still valid (optional: could make API call)
                    if (parsedUser && parsedUser._id) {
                        setUser(parsedUser);
                    } else {
                        // Clear invalid user data
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


// const loginUser = (userData, rememberMe = false) => {
//     console.log("Login user called with:", userData); // Debug log
    
//     // Ensure userData has _id
//     if (!userData || !userData._id) {
//         console.error("Invalid user data received:", userData);
//         // If this happens during signup, we might need to handle it differently
//         return;
//     }
    
//     const userWithId = {
//         ...userData,
//         _id: userData._id || userData.id,
//         isAdmin: userData.role === 'admin'
//     };
    
//     console.log("Setting user in context:", userWithId); // Debug log
    
//     setUser(userWithId);
//     if (rememberMe) {
//         localStorage.setItem('user', JSON.stringify(userWithId));
//         sessionStorage.removeItem('user');
//     } else {
//         sessionStorage.setItem('user', JSON.stringify(userWithId));
//         localStorage.removeItem('user');
//     }
    
//     // Start inactivity timer for non-admin users
//     if (!userWithId.isAdmin) {
//         startInactivityTimer();
//     }

//     // Handle redirect
//     const redirectPath = sessionStorage.getItem('loginRedirect');
//     if (redirectPath) {
//         sessionStorage.removeItem('loginRedirect');
//         window.location.href = redirectPath;
//     }
// };
    // {/* //ADD LOADING STATES WHEN LOGIN / SIGNUP */}

    // const logoutUser = () => {
    //     console.log('Logging out due to inactivity');
    //     setUser(null);
    //     localStorage.removeItem('user');
    //     sessionStorage.removeItem('user');
    //     localStorage.removeItem('cartItems');
    //     clearInactivityTimer();
    // };


    // LoginContext.js - Update logoutUser function

const loginUser = (userData, rememberMe = false) => {
        console.log("Login user called with:", userData);
        
        // Validate user data
        if (!userData || !userData._id) {
            console.error("Invalid user data received during login:", userData);
            toast.error("Failed to login. Please try again.", {
                position: "top-center",
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
        
        // Show success message
        toast.success(`Welcome back, ${userData.userName || 'User'}!`, {
            position: "top-center",
            autoClose: 2000,
        });
        
        // Handle redirect
        const redirectPath = sessionStorage.getItem('loginRedirect');
        if (redirectPath) {
            sessionStorage.removeItem('loginRedirect');
            setTimeout(() => {
                window.location.href = redirectPath;
            }, 500);
        }
    };



//     const logoutUser = (redirectToHome = true) => {
//     console.log('Logging out');
    
//     // Get current path
//     const currentPath = window.location.pathname;
    
//     // Clear user data
//     setUser(null);
//     localStorage.removeItem('user');
//     sessionStorage.removeItem('user');
//     localStorage.removeItem('cartItems');
//     clearInactivityTimer();
    
//     // Check if we're on a protected page
//     const isOnProtectedPage = currentPath.includes('/billing') || 
//                               currentPath.includes('/thankyou1') ||
//                               currentPath.includes('/order');
    
//     // Redirect to home if on protected page and redirectToHome is true
//     if (isOnProtectedPage && redirectToHome) {
//         // Use window.location for full page reload to clear state
//         window.location.href = '/';
//     }
    
//     // Dispatch custom event for components to listen to
//     window.dispatchEvent(new Event('user-logged-out'));
// };
   

const logoutUser = (redirectToHome = true, showMessage = true) => {
        console.log('Logging out user:', user?.userName);
        
        if (showMessage && user) {
            toast.info(`Goodbye, ${user.userName}!`, {
                position: "top-center",
                autoClose: 2000,
            });
        }
        
        // Get current path
        const currentPath = window.location.pathname;
        
        // Clear user data
        setUser(null);
        localStorage.removeItem('user');
        sessionStorage.removeItem('user');
        localStorage.removeItem('cartItems');
        clearInactivityTimer();
        
        // Dispatch logout event
        window.dispatchEvent(new Event('user-logged-out'));
        
        // Check if we're on a protected page
        const isOnProtectedPage = currentPath.includes('/billing') || 
                                  currentPath.includes('/thankyou1') ||
                                  currentPath.includes('/order');
        
        // Redirect to home if on protected page and redirectToHome is true
        if (isOnProtectedPage && redirectToHome) {
            setTimeout(() => {
                window.location.href = '/';
            }, 100);
        }
    };


// {/* //ADD LOADING STATES WHEN LOGIN / SIGNUP */}


    const startInactivityTimer = () => {
        clearInactivityTimer();
        inactivityTimer.current = setTimeout(() => {
            // Only logout if no recent activity
            if (Date.now() - lastActivityTime.current >= INACTIVITY_TIMEOUT) {
                   // {/* //ADD LOADING STATES WHEN LOGIN / SIGNUP */}

                // logoutUser();

                            logoutUser(true); // Redirect to home on inactivity logout
    // {/* //ADD LOADING STATES WHEN LOGIN / SIGNUP */}

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
        // console.log('User activity detected at', new Date().toISOString());
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
                    //LOADING ERROR HANDLING WHILE LOGOUT
isAdmin,
            isUserLoading, // Export loading state
        //LOADING ERROR HANDLING WHILE LOGOUT

                        isAdmin: user?.role === 'admin' // Explicit isAdmin check


        }}>
            {children}
        </LoginContext.Provider>
    );
};

export const useLogin = () => useContext(LoginContext);
