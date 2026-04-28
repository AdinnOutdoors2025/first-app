// CaptchaModal.js
import React, { useState, useEffect } from 'react';
import './CaptchaModal.css';
import { FaSyncAlt, FaPaperPlane } from 'react-icons/fa';


const CaptchaModal = ({ isOpen, onClose, onVerify }) => {
    const [num1, setNum1] = useState(0);
    const [num2, setNum2] = useState(0);
    const [userAnswer, setUserAnswer] = useState('');
    const [error, setError] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);

    // Generate random numbers for captcha
    const generateCaptcha = () => {
        const randomNum1 = Math.floor(Math.random() * 20) + 1; // Numbers between 1-20
        const randomNum2 = Math.floor(Math.random() * 20) + 1;
        setNum1(randomNum1);
        setNum2(randomNum2);
        setUserAnswer('');
        setError('');
    };

    // Reset when modal opens
    useEffect(() => {
        if (isOpen) {
            generateCaptcha();
        }
    }, [isOpen]);

    const handleVerify = async () => {
        if (!userAnswer) {
            setError('Please enter the answer');
            return;
        }

        const answer = parseInt(userAnswer);
        if (isNaN(answer)) {
            setError('Please enter a valid number');
            return;
        }

        const correctAnswer = num1 + num2;
        
        if (answer === correctAnswer) {
            setIsVerifying(true);
            try {
                await onVerify();
                onClose();
            } catch (error) {
                console.error('Verification failed:', error);
                setError('Verification failed. Please try again.');
            } finally {
                setIsVerifying(false);
            }
        } else {
            setError('Invalid captcha. Please try again.');
            // generateCaptcha(); // Generate new numbers on wrong answer
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleVerify();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="captcha-overlay">
            <div className="captcha-modal">
                <div className="captcha-header">
                    <h3>Verify you're human</h3>
                    <button className="captcha-close" onClick={onClose}>×</button>
                </div>
                
                <div className="captcha-body">
                    <div className="captcha-question">
                        <span className="captcha-number">{num1}</span>
                        <span className="captcha-operator">+</span>
                        <span className="captcha-number">{num2}</span>
                        <span className="captcha-operator">=</span>
                        <input
                            type="number"
                            className="captcha-input"
                            value={userAnswer}
                            onChange={(e) => {
                                setUserAnswer(e.target.value);
                                setError('');
                            }}
                            onKeyPress={handleKeyPress}
                            placeholder="?"
                            autoFocus
                        />
                    </div>
                    
                    {error && (
                        <div className="captcha-error">
                            {error}
                        </div>
                    )}
                    
                    <div className="captcha-buttons">
                        <button 
                            className="captcha-btn captcha-refresh"
                            onClick={generateCaptcha}
                            type="button"
                        >
                         <FaSyncAlt className="icon spin" /> &nbsp;
                            Refresh
                        </button>
                        <button 
                            className="captcha-btn captcha-verify"
                            onClick={handleVerify}
                            disabled={isVerifying}
                        >
                         <FaPaperPlane className="icon" />  &nbsp;
                            {isVerifying ? 'Verifying...' : 'Submit'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CaptchaModal;