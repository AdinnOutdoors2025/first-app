import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useLogin } from './LoginContext';
import { toast } from 'react-toastify';

const ProtectedRoute = ({ children, adminOnly = false, requireLogin = false  }) => {
  const { user, isAdmin, isUserLoading } = useLogin();  
  const location = useLocation();


          //LOADING ERROR HANDLING WHILE LOGOUT

  // if (!user) {
  //   // User not logged in, redirect to login
  //  // return <Navigate to="/adminLogin" state={{ from: location.pathname }} replace />;
  //  // For non-admin routes, redirect to home and open login modal
  //   if (!adminOnly) {
  //     return <Navigate to="/" state={{ openLoginModal: true, from: location.pathname }} replace />;
  //   } else {
  //     return <Navigate to="/adminLogin" state={{ from: location.pathname }} replace />;
  //   }
  
  // }

 // Show loading while checking authentication
    if (isUserLoading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Checking authentication...</p>
            </div>
        );
    }
    
    if (!user) {
        if (requireLogin) {
            // Store the intended destination
            sessionStorage.setItem('loginRedirect', location.pathname);
            
            // Show notification
            toast.info("Please login to access this page", {
                position: "top-center",
                autoClose: 3000,
            });
            
            // Redirect to home which will show login modal
            return <Navigate to="/" replace />;
        }
        
        if (adminOnly) {
            return <Navigate to="/adminLogin" replace />;
        }
    }

           


  // if (adminOnly && !isAdmin) {
  //   // User is not admin but trying to access admin route
  //   return <Navigate to="/" replace />;
  // }


    if (adminOnly && !isAdmin) {
        toast.error("Access denied. Admin privileges required.", {
            position: "top-center",
            autoClose: 3000,
        });
        return <Navigate to="/" replace />;
    }

       //LOADING ERROR HANDLING WHILE LOGOUT
  
  // User is authenticated and has proper role
  return children;
};

export default ProtectedRoute;