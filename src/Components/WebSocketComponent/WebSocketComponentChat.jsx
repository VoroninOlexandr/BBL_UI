import React, { useState, useEffect } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

const WebSocketComponentChat = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [nickname, setNickname] = useState("");
  const [stompClient, setStompClient] = useState(null);

  useEffect(() => {
    const storedNickname = sessionStorage.getItem("username");
    if (storedNickname) {
      setNickname(storedNickname);
    }

    const socket = new SockJS("http://localhost:8080/chat");
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
    });

    client.onConnect = () => {
      console.log("Connected to WebSocket");

      client.subscribe("/topic/messages", (message) => {
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
      stompClient.publish({
        destination: "/app/sendMessage",
        body: JSON.stringify(chatMessage),
      });
      setMessage("");
    }
  };

  return (
    <div className="chat-container">
      <div className="messages-box">
        <h9>Messages:</h9>
        <ul>
          {messages.map((msg, index) => (
            <li key={index}>
              <strong>{msg.from}:</strong> {msg.content}
            </li>
          ))}
        </ul>
      </div>
      <div className="chat-input">
        <textarea
          placeholder="Enter your message"
          value={message}
          onChange={handleMessageChange}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default WebSocketComponentChat;
