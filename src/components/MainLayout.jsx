// //LOGOUT LOADING - PERFECT CODE 
import React, { useState, useEffect } from 'react';
import { useLogin } from './LoginContext';
import LoginPageMain from './C1LoginMain';
import LoginPortal from './LoginPortal';
import '../components/MainLayout.css';

export const MainLayout = ({ children, onClose }) => {
    const { isLoginOpen, closeLogin, loginMode, isLoggingOut } = useLogin();
    const [showLogoutOverlay, setShowLogoutOverlay] = useState(false);
    const [isRedirecting, setIsRedirecting] = useState(false);

    const handleClose = () => {
        closeLogin();
        if (onClose) onClose();
    };

    useEffect(() => {
        // Track when we start logging out
        if (isLoggingOut) {
            setShowLogoutOverlay(true);
            
            // Auto-hide after 2 seconds (should match logout timeout)
            const timer = setTimeout(() => {
                setShowLogoutOverlay(false);
            }, 2000);
            
            return () => clearTimeout(timer);
        } else {
            setShowLogoutOverlay(false);
        }
    }, [isLoggingOut]);

    // Handle page visibility to prevent double loading on redirect
    useEffect(() => {
        const handleBeforeUnload = () => {
            // Set flag when page is about to unload
            setIsRedirecting(true);
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

    // Only show overlay if logging out AND not redirecting
    const shouldShowOverlay = showLogoutOverlay && !isRedirecting;

    return (
        <div className={`main-layout ${isLoginOpen ? 'login-open' : ''}`}>
            {children}
            <LoginPortal isOpen={isLoginOpen}>
                <LoginPageMain onClose={handleClose} loginMode={loginMode} />
            </LoginPortal>
            
            {/* Simple Logout Loading Overlay */}
            {shouldShowOverlay && (
                <div className="logout-overlay">
                    <img src="./images/preload.svg" alt="Logging out..." />
                </div>
            )}
        </div>
    );
};