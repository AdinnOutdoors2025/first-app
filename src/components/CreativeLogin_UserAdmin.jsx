import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLogin } from './LoginContext';
import './creativelogin.css';
//BASE URL OF http://localhost:3001 FILE IMPORT 
import { baseUrl } from '../Adminpanel/BASE_URL';

const AdminAuth = () => {
    const [isRegistering, setIsRegistering] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        secretCode: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showSecretCode, setShowSecretCode] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { loginUser, closeLogin } = useLogin();
    const navigate = useNavigate();
    const location = useLocation();
    const [authField, setAuthField] = useState('password'); // New state for auth method



    useEffect(() => {
        if (location.state?.registrationSuccess) {
            setIsRegistering(false);
            setSuccessMessage('Registration successful! Please login.');
        }
    }, [location.state]);

    const handleChange = (e) => {
        setFormData({
            ...formData,

            [e.target.name]: e.target.value
        });
    };

    const handleAuthMethodChange = (method) => {
        setAuthField(method);
        // Clear the other field when switching
        setFormData({
            ...formData,
            password: method === 'password' ? formData.password : '',
            secretCode: method === 'secretCode' ? formData.secretCode : ''
        });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Submitting with:', formData);  // Add this line
        setError('');
        setIsLoading(true);
        
        const endpoint = isRegistering
            ? `${baseUrl}/adminUserLogin/register-admin`
            : `${baseUrl}/adminUserLogin/admin`;

        try {

            // For registration, send all fields
            // For login, only send username and password
            const payload = isRegistering
                ? formData
                : {
                    // username: formData.username, secretCode: formData.secretCode };

                    username: formData.username,
                    // ...(formData.password ? { password: formData.password } : {}),
                    // ...(formData.secretCode ? { secretCode: formData.secretCode } : {})
                    [authField] : formData[authField]
                };
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (response.ok) {
                if (isRegistering) {
                    setSuccessMessage('Registration successful! Please login.');
                    setIsRegistering(false);
                    // Clear form except username
                    setFormData({
                        ...formData,
                        password: '',
                        secretCode: ''
                    });
                } else {
                    loginUser({
                        username: data.user.username,
                        role: data.user.role,
                        token: data.token,
                        _id: data.user.id
                    }, rememberMe);

                    closeLogin();
                    // navigate('/admin');
                    // Redirect based on role
                // if (data.user.role === 'admin') {
                //     navigate('/admin');
                // } else {
                //     navigate('/');
                // }
                // Redirect to the originally requested page or admin dashboard
                const from = location.state?.from || '/admin';
                navigate(from, { replace: true });
                }
            } else {
                setError(data.message || (isRegistering ? "Registration Failed!" : "Authentication Failed!"));
            }
        } catch (err) {
            setError('Network error. Please try again.');
            console.error(isRegistering ? 'Registration error:' : 'Login error:', err);
        } 
        finally {
            setIsLoading(false);
        }
    };

    const toggleAuthMode = () => {
        setIsRegistering(!isRegistering);
        setError('');
        setSuccessMessage('');
        // Clear form when toggling
        setFormData({
            username: '',
            password: '',
            secretCode: ''
        });
    };

    return (
        <div className="admin-user-auth-container">
            <div className="admin-user-auth-card">
                <h2 className="auth-title">
                    {isRegistering ? 'Admin Registration' : 'Admin Login'}
                </h2>
                <p className="auth-subtitle">
                    {isRegistering ? 'Create your admin account' : 'Access the admin dashboard'}
                </p>

                {successMessage && (
                    <div className="admin-user-success-message">
                        {successMessage}
                    </div>
                )}

                {error && <div className="admin-user-error-message">{error}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                   {/* USER NAME FOR BOTH REGISTER AND LOGIN  */}
                    <div className="admin-user-form-group">
                        <label>Username</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            minLength={isRegistering ? "4" : undefined}
                            maxLength={isRegistering ? "20" : undefined}
                            pattern={isRegistering ? "[a-zA-Z0-9]+" : undefined}
                            title={isRegistering ? "Only alphanumeric characters (4-20)" : undefined}
                            className="auth-input"
                        />
                    </div>


{isRegistering ? (
                        /* REGISTRATION FIELDS */
                        <>

                    <div className="admin-user-form-group password-group">
                        <label>
                            Password {isRegistering && '(min 6 characters)'}
                        </label>
                        <div className="password-input-container">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                minLength={isRegistering ? "6" : undefined}
                                className="auth-input"
                                placeholder={isRegistering ? "Required" : "Optional (use password or secret code)"}
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? '👁️' : '👁️‍🗨️'}
                                {/* {showPassword ? '<i class="fa-regular fa-eye"></i>' : '<i class="fa-regular fa-eye-slash"></i>‍🗨️'} */}

                            </button>
                        </div>
                    </div>

                    <div className="admin-user-form-group password-group">
                        <label>Secret Code</label>
                        <div className="password-input-container">
                            <input
                                type={showSecretCode ? "text" : "password"}
                                name="secretCode"
                                value={formData.secretCode}
                                onChange={handleChange}
                                required
                                className="auth-input"
                                placeholder={isRegistering ? "Required" : "Optional (use password or secret code)"}
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowSecretCode(!showSecretCode)}
                            >
                                {showSecretCode ? '👁️' : '👁️‍🗨️'}
                                {/* {showSecretCode ? '<i class="fa-regular fa-eye"></i>' : '<i class="fa-regular fa-eye-slash"></i>'} */}

                            </button>
                        </div>
                    </div>

                    </>
 ) : (
                        /* LOGIN FIELDS */
                        <>
 <div className="admin-user-form-group">
                                <div className="auth-method-selector">
                                    <button
                                        type="button"
                                        className={`auth-method-btn ${authField === 'password' ? 'active' : ''}`}
                                        onClick={() => handleAuthMethodChange('password')}
                                    >
                                        Password
                                    </button>
                                    <button
                                        type="button"
                                        className={`auth-method-btn ${authField === 'secretCode' ? 'active' : ''}`}
                                        onClick={() => handleAuthMethodChange('secretCode')}
                                    >
                                        Secret Code
                                    </button>
                                </div>
                                
                                <div className="password-input-container">
                                    <input
                                        type={authField === 'password' ? 
                                            (showPassword ? "text" : "password") : 
                                            (showSecretCode ? "text" : "password")
                                        }
                                        name={authField}
                                        value={formData[authField]}
                                        onChange={handleChange}
                                        className="auth-input"
                                        placeholder={
                                            authField === 'password' ? 
                                            "Enter your password" : 
                                            "Enter secret code"
                                        }
                                    />
                                    <button 
                                        type="button" 
                                        className="password-toggle"
                                        onClick={() => 
                                            authField === 'password' ? 
                                            setShowPassword(!showPassword) : 
                                            setShowSecretCode(!showSecretCode)
                                        }
                                    >
                                        {authField === 'password' ? 
                                            (showPassword ? '👁️' : '👁️‍🗨️') : 
                                            (showSecretCode ? '👁️' : '👁️‍🗨️')

                                           
                                        }
                                    </button>
                                </div>
                            </div>
                            

                        <div className="admin-user-remember-me">
                            <input
                                type="checkbox"
                                id="rememberMe"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="remember-checkbox"
                            />
                            <label htmlFor="rememberMe">Remember me</label>
                        </div>     



                        </>
 )}

                    {/* {!isRegistering && (
                        <div className="admin-user-remember-me">
                            <input
                                type="checkbox"
                                id="rememberMe"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="remember-checkbox"
                            />
                            <label htmlFor="rememberMe">Remember me</label>
                        </div>
                    )} */}

                    <button
                        type="submit"
                        className="admin-user-auth-button"
                        disabled={isLoading}
                    >
                        {isLoading
                            ? (isRegistering ? 'Registering...' : 'Logging in...')
                            : (isRegistering ? 'Register Admin' : 'Login as Admin')}
                    </button>

                    <div className="auth-footer">
                        {isRegistering ? 'Already have an account?' : 'Need an admin account?'}
                        <button
                            type="button"
                            className="auth-switch-button"
                            onClick={toggleAuthMode}
                        >
                            {isRegistering ? 'Login here' : 'Register here'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminAuth;