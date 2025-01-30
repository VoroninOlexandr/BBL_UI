import React, { useEffect, useState } from "react";
import io from "socket.io-client"; 

const socket = io.connect("http://localhost:5174")


const WebSocketComponent = () => {
  
  
  const [message, setMessage] = useState("");
  const [messagereceive, setMessageReceive] = useState("");

  const handleSend = () => {
    if (message.trim()) {
      socket.emit("send_message", {message}); 
      setMessage(""); 
    }
  };


  useEffect (() => {
    socket.on("receive_message", (data) => {
      setMessageReceive(data.message);
    })
  },[socket])


  return (
    <div className="Chatwapper">
      
      
      <h2> Chat</h2>
      
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)} 
        placeholder="Enter message"
      />
      <button onClick={handleSend}>Send</button>
      
      {messagereceive}
    </div>
  );

};




export default WebSocketComponent;
