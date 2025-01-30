import React, { useState, useEffect } from "react";
import axios from "axios";

const Games = () => {
  const [players, setPlayers] = useState([{ id: "", name: "", chips: "" }]);
  const [gameId, setGameId] = useState("");
  const [gameData, setGameData] = useState(null);
  const [error, setError] = useState(null);

  // Функція для оновлення даних про гравців
  const handlePlayerChange = (index, field, value) => {
    const updatedPlayers = [...players];
    updatedPlayers[index][field] = value;
    setPlayers(updatedPlayers);
  };

  // Додати нового гравця
  const addPlayer = () => {
    setPlayers([...players, { id: "", name: "", chips: "" }]);
  };

  // Функція для створення гри
  const createGame = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:8080/api/game/create", players);
      setGameId(response.data.id);
      setError(null);
    } catch (err) {
      console.error("Error creating game:", err);
      setError("Failed to create game");
    }
  };

  // Функція для отримання даних гри за ID
  const fetchGameData = async () => {
    if (gameId) {
      try {
        const response = await axios.get(`http://127.0.0.1:8080/api/game/${gameId}`);
        setGameData(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching game data:", err);
        if (err.response) {
          setError(`Error: ${err.response.status} - ${err.response.data}`);
        } else {
          setError("Failed to fetch game data. Please check the server.");
        }
      }
    } else {
      setError("Please enter a valid game ID.");
    }
  };

  return (
    <div>
      <h1>Games</h1>

      {/* Форма для створення гри */}
      <div style={{ marginBottom: "20px" }}>
        <h2>Create New Game</h2>
        {players.map((player, index) => (
          <div key={index} style={{ marginBottom: "10px" }}>
            <input
              type="text"
              placeholder="Player ID"
              value={player.id}
              onChange={(e) => handlePlayerChange(index, "id", e.target.value)}
              style={{ marginRight: "10px" }}
            />
            <input
              type="text"
              placeholder="Player Name"
              value={player.name}
              onChange={(e) => handlePlayerChange(index, "name", e.target.value)}
              style={{ marginRight: "10px" }}
            />
            <input
              type="number"
              placeholder="Chips"
              value={player.chips}
              onChange={(e) => handlePlayerChange(index, "chips", e.target.value)}
            />
          </div>
        ))}
        <button onClick={addPlayer} style={{ marginRight: "10px" }}>
          Add Player
        </button>
        <button onClick={createGame}>Create Game</button>
      </div>

      {/* Виведення ID новоствореної гри */}
      {gameId && (
        <div style={{ marginBottom: "20px" }}>
          <h3>Game Created Successfully!</h3>
          <p>Game ID: {gameId}</p>
        </div>
      )}

      {/* Форма для отримання даних гри */}
      <div>
        <h2>Get Game Data</h2>
        <input
          type="text"
          placeholder="Enter Game ID"
          value={gameId}
          onChange={(e) => setGameId(e.target.value)}
          style={{ marginRight: "10px" }}
        />
        <button onClick={fetchGameData}>Get Game</button>
      </div>

      {/* Виведення даних про гру */}
      {gameData && (
        <div style={{ marginTop: "20px" }}>
          <h3>Game Data</h3>
          <pre>{JSON.stringify(gameData, null, 2)}</pre>
        </div>
      )}

      {/* Виведення помилок */}
      {error && <div style={{ color: "red" }}>{error}</div>}
    </div>
  );
};

export default Games;
