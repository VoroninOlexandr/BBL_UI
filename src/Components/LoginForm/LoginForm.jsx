import React, { useState, useEffect } from "react";
import './LoginForm.css';
import { FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
    const [username, setUsername] = useState('');
    const navigate = useNavigate();
    
    useEffect(() => {
          const handleWheel = (e) => {
            if (e.ctrlKey) {
              e.preventDefault(); 
            }
          };
          window.addEventListener("wheel", handleWheel, { passive: false });
          return () => {
            window.removeEventListener("wheel", handleWheel);
          };
        }, []); 


        

    useEffect(() => {
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        sessionStorage.setItem("username", username);
        sessionStorage.setItem("avatar", Math.floor(Math.random() * 6));
        navigate('/home');
    };

    return (
        <div className="wrapper">
            <form onSubmit={handleSubmit} className="login-form">
                <h1 className="main-heading">Welcome to BBL Poker!</h1>
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
    