import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import LoginForm from "./Components/LoginForm/LoginForm";
import HomePage from "./Components/HomePage/HomePage";
import GameTable from "./Components/GameTable/GameTable";

const App = () => {
  return (
    <div className="App">
      <Router>
        <Routes>
          {}
          <Route path="/" element={<LoginForm />} />
          <Route path="/table" element={<GameTable />} />
          <Route path="/home" element={<HomePage />} />
        </Routes>
      </Router>
    </div>
  );
};


export default App;
