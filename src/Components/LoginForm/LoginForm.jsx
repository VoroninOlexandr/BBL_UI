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
            navigate('/home'); 
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

      
        const requestBody = {
            nickname: username,
        };

        try {
            // Відправка POST запиту на сервер
            const response = await fetch('https://57f7a27d-7e2d-4c80-b002-bf669aea8c49.mock.pstmn.io/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(requestBody), // Відправляємо тільки nickname
            });

            // Перевірка на успішний статус відповіді
            if (response.ok) {
                const data = await response.json();
                console.log('Успішний логін:', data);

                // Отримуємо uuid з відповіді сервера та зберігаємо його в sessionStorage
                const { uuid } = data;
                sessionStorage.setItem("uuid", uuid);

                navigate('/home');
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
