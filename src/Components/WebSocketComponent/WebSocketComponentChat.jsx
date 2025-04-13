import React, { useState, useEffect, useRef } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

const WebSocketComponentChat = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [nickname, setNickname] = useState("");
  const [stompClient, setStompClient] = useState(null);
  const sendSound = new Audio("/images/sounds/chat.mp3");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const storedNickname = sessionStorage.getItem("username");
    if (storedNickname) {
      setNickname(storedNickname);
    }

    const socket = new SockJS("https://bblpoker.win/chat");
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

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleMessageChange = (e) => setMessage(e.target.value);

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  const sendMessage = () => {
    if (stompClient && message.trim()) {
      const chatMessage = { from: nickname, content: message };
      stompClient.publish({
        destination: "/app/sendMessage",
        body: JSON.stringify(chatMessage),
      });
      sendSound.play();
      setMessage("");
    }
  };

  return (
    <div className="chat-container">
      <div className="messages-box">
        <ul>
          {messages.map((msg, index) => (
            <li key={index} className="chat-message animated-message">
              <strong>{msg.from}:</strong> {msg.content}
            </li>
          ))}
          <div ref={messagesEndRef} />
        </ul>
      </div>
      <div className="chat-input">
        <textarea
          placeholder="Enter message..."
          value={message}
          onChange={handleMessageChange}
          onKeyDown={handleKeyDown}
        />
      </div>
    </div>
  );
};

export default WebSocketComponentChat;
