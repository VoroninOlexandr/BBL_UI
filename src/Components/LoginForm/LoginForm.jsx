import React, { useState, useEffect } from "react";
import './LoginForm.css';
import { FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
    const [username, setUsername] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        sessionStorage.setItem("username", username);
        navigate('/home');
    };

    return (
        <div className="wrapper">
            <form onSubmit={handleSubmit} className="login-form">
                <h1 className="main-heading">Hello, Welcome to BBL Poker!</h1>
                <h2 className="sub-heading">Please enter your nickname</h2>

                <div className="input-container">
                    <input
                        type="text"
                        placeholder="Enter nickname..."
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="nickname-input"
                    />
                    <button type="submit" className="login-button">Log In</button>
                </div>
            </form>
        </div>
    );
};

export default LoginForm;
    