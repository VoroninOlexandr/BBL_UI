import React, { useState, useEffect } from "react";
import './LoginForm.css';
import { FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
    const [username, setUsername] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const storedUuid = sessionStorage.getItem("uuid");
        if (storedUuid) {
            navigate('/lobbies');
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const requestBody = {
            nickname: username,
        };

        try {
            // Відправка POST запиту на реальний бекенд
            const response = await fetch('http://localhost:8080/api/auth/login', { // Змінити URL на реальний
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(requestBody), // Відправляємо nickname
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Успішний логін:', data);

                // Отримуємо uuid з відповіді сервера та зберігаємо його в sessionStorage
                const { uuid } = data;
                sessionStorage.setItem("uuid", uuid);

                navigate('/lobbies');
            } else {
                const errorData = await response.json();
                console.error('Помилка при авторизації:', errorData);
            }
        } catch (error) {
            console.error('Помилка при відправці запиту:', error);
        }
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
