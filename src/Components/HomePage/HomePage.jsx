import './HomePage.css'
import React from "react";
import WebSocketComponent from '../WebSocketComponent/WebSocketComponent';

const HomePage = () => {
    return (
        <div className="lobbywrapper">
            <h1>Welcome!</h1>
            <WebSocketComponent/>
        </div>
    );
};

export default HomePage;
