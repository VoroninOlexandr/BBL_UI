import React, { useState, useEffect } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import './WebSocketComponentChat.css';

const WebSocketComponentChat = () => {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [nickname, setNickname] = useState('');

    const [stompClient, setStompClient] = useState(null);

    useEffect(() => {

        const storedNickname = sessionStorage.getItem("nickname");
        if (storedNickname) {
            setNickname(storedNickname);
        }

        const socket = new SockJS('http://localhost:8080/ws');
        const client = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000, // Якщо підключення падає, повторюємо спробу через 5 сек
        });

        client.onConnect = () => {
            console.log("Connected to WebSocket");

            client.subscribe('/topic/messages', (message) => {
                const receivedMessage = JSON.parse(message.body);
                setMessages((prevMessages) => [...prevMessages, receivedMessage]);
            });
        };

        client.activate();
        setStompClient(client);

        return () => {
            client.deactivate();
        };
    }, []);

    
    const handleMessageChange = (e) => setMessage(e.target.value);

    const sendMessage = () => {
        if (stompClient && message.trim()) {
            const chatMessage = { from: nickname, content: message };
            stompClient.publish({ destination: '/app/sendMessage', body: JSON.stringify(chatMessage) });
            setMessage(''); // Очищуємо поле після відправки
        }
    };

    return (
        <div className="chat-container">
            <div className="chat-box">
                <p><strong></strong> {nickname}</p>
                <textarea
                    placeholder="Enter your message"
                    value={message}
                    onChange={handleMessageChange}
                />
                <button onClick={sendMessage}>Send</button>
            </div>
            <div className="messages-box">
                <h3>Messages:</h3>
                <ul>
                    {messages.map((msg, index) => (
                        <li key={index}><strong>{msg.from}:</strong> {msg.content}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default WebSocketComponentChat;
