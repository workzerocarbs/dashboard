/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import '../reset-password/style.scss';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

const ForgotPasswordForm = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [formPhase, setFormPhase] = useState('email'); // 'email', 'otp', 'resetPassword'
    const navigate = useNavigate()

    const handleSendOTP = (e) => {
        e.preventDefault();
        // Logic to send OTP to the provided email
        alert('OTP sent to ' + email);
        setFormPhase('otp');
    };

    const handleVerifyOTP = (e) => {
        e.preventDefault();
        // Logic to verify the OTP
        alert('OTP verified: ' + otp);
        setFormPhase('resetPassword');
    };

    const handleResetPassword = (e) => {
        e.preventDefault();
        // Logic to reset the password
        if (newPassword === confirmPassword) {
            alert('Password has been reset successfully');
            // Redirect or update UI as needed
            navigate('/login');
        } else {
            alert('Passwords do not match');
        }
    };

    const handleGoToLogin = () =>{
        navigate('/login')
    }

    return (
        <div className="reset-container">
            <div className="forgot-password-form">
                {formPhase === 'email' && (
                    <>
                        <h2>Forgot Password</h2>
                        <h4>Enter the email address associated with your account and we&apos;ll send you an OTP to reset your password</h4>
                        <form onSubmit={handleSendOTP}>
                            <div className="input-field">
                                <label>Enter your email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <Button className='send-otp-btn' type='submit'>Send OTP</Button>
                        </form>
                        <div className="back-to-login">
                            <button type='button' onClick={handleGoToLogin} className="back-to-login-link">Back to <span>Zero<span className='carbs'>Carbs</span></span> Login</button>
                        </div>
                    </>
                )}
                {formPhase === 'otp' && (
                    <>
                        <h2>Verify OTP</h2>
                        <form onSubmit={handleVerifyOTP}>
                            <div className="input-field">
                                <label>Enter OTP</label>
                                <input
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                />
                            </div>
                            <Button className='send-otp-btn' type='submit'>Verify</Button>
                        </form>
                    </>
                )}
                {formPhase === 'resetPassword' && (
                    <>
                        <h2>Reset Password</h2>
                        <form onSubmit={handleResetPassword}>
                            <div className="input-field">
                                <label>Create new password</label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                            </div>
                            <div className="input-field margin">
                                <label>Confirm new password</label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                            </div>
                            <Button className='send-otp-btn' type='submit'>Submit</Button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

export default ForgotPasswordForm;
