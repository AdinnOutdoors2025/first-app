import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLogin } from '../components/LoginContext';

export const AdminAuthWrapper = ({ children }) => {
    const { user, isAdmin } = useLogin();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!user || !isAdmin) {
            navigate('/adminLogin', { 
                state: { from: location.pathname },
                replace: true 
            });
        }
    }, [user, isAdmin, navigate, location]);

    return children;
};