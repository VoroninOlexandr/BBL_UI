import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import LoginForm from "./Components/LoginForm";
import GameLobbies from "./Components/GameLobbies";
import GameTable from "./Components/GameTable";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Головний маршрут */}
        <Route path="/" element={<AuthRoute />} />
        {/* Інші маршрути */}
        <Route path="/lobbies" element={<GameLobbies />} />
        <Route path="/table" element={<GameTable />} />
      </Routes>
    </Router>
  );
};

// Перевірка наявності uuid і перенаправлення
const AuthRoute = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const uuid = sessionStorage.getItem("uuid");

    if (uuid) {
      console.log("UUID знайдено, перенаправляємо до /lobbies");
      navigate("/lobbies"); // Перенаправлення
    } else {
      console.log("UUID не знайдено, показуємо LoginForm");
    }
  }, [navigate]);

  return <LoginForm />;
};

export default App;
