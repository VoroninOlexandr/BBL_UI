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
            <form onSubmit={handleSubmit}>
                <h1>Login</h1>

                <div className="input-box">
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <FaUser className="icon" />
                </div>

                <button type="submit">CONFIRM</button>
            </form>
        </div>
    );
};

export default LoginForm;
