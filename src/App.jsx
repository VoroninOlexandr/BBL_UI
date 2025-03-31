import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { GameProvider } from "./Components/GameTable/GameContext"; // Імпортуємо GameProvider
import LoginForm from "./Components/LoginForm/LoginForm";
import HomePage from "./Components/HomePage/HomePage";
import GameTable from "./Components/GameTable/GameTable";

const App = () => {
  return (
    <GameProvider>  
      <Router>
        <Routes>
          <Route path="/" element={<LoginForm />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/table/:lobbyId" element={<GameTable />} />
        </Routes>
      </Router>
    </GameProvider>
  );
};

export default App;
