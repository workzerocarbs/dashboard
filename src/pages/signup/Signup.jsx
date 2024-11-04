/* eslint-disable no-unused-vars */
import React, { useEffect } from 'react'
import '../signup/style.scss'
import Button from '@mui/material/Button';
import { Link, useNavigate } from 'react-router-dom'

const Signup = () => {
    const navigate = useNavigate();

    const handleSubmitForm = (e) => {
        e.preventDefault();
        navigate('/login')
    }

    useEffect(() => {
        document.title = "ZeroCarbs | Signup"
      }, [])

    return (
        <div className='signup-container'>
            <div className="signup-form">
                <h2>Sign-up your account</h2>
                <form onSubmit={handleSubmitForm}>
                    <div className="input-field">
                        <label>Username</label>
                        <input type="text" placeholder='Enter your username'/>
                    </div>
                    <div className="input-field">
                        <label>Email</label>
                        <input type="text" placeholder='Enter your email'/>
                    </div>
                    <div className="input-field">
                        <label>Password</label>
                        <input type="text" placeholder='Enter your password'/>
                    </div>
                    <Button className='submit-btn' type='submit'>Submit</Button>
                </form>
                <div className="login-signup">
                    <span className="text">Already have an account?</span>
                    <Link to="/login" className="signup-link">Login</Link>
                </div>
            </div>
        </div>
    )
}

export default Signup