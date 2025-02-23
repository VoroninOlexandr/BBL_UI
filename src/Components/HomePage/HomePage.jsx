
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Додайте useNavigate

const HomePage = () => {
  const [lobbies, setLobbies] = useState([]);
  const [newLobbyName, setNewLobbyName] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate(); // Ініціалізація useNavigate

  const fetchLobbies = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/games/get-all");
      setLobbies(response.data);
    } catch (err) {
      setError("Failed to fetch game lobbies");
    }
  };

  useEffect(() => {
    fetchLobbies();
  }, []);

  const handleAddLobby = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/api/games/create", { lobbyName: newLobbyName });
      setNewLobbyName("");
      fetchLobbies();
    } catch (err) {
      setError("Failed to create a new lobby");
    }
  };

  if (error) return <div>{error}</div>;

  const handleJoinTable = async(lid) => {
    const response = await axios.post("http://localhost:8080/api/games/join/" + lid, {playerName : sessionStorage.getItem("username")});

    const playerId = response.data.playerId;
    
    navigate("/table/" + playerId); // Перенаправлення на сторінку покерного столу
  };

  return (
    <div>
      <h1>Game Lobbies</h1>

      <form onSubmit={handleAddLobby} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          value={newLobbyName}
          onChange={(e) => setNewLobbyName(e.target.value)}
          placeholder="Enter lobby name"
          required
          style={{ padding: "5px", marginRight: "10px" }}
        />
        <button type="submit" style={{ padding: "5px 10px" }}>
          Add Lobby
        </button>
      </form>

      {lobbies.length === 0 ? (
        <p>No lobbies found</p>
      ) : (
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {lobbies.map((lobby) => (
            <li
              key={lobby.id}
              style={{
                margin: "10px 0",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "5px",
              }}
            >
              <strong>{lobby.lobbyName}</strong> - Players: {lobby.playerCount}
              <button onClick={() => handleJoinTable(lobby.id)} style={{ padding: "10px 20px", marginTop: "20px" }}>
        Join Poker Table
      </button>
            </li>
          ))}
        </ul>
      )}      
    </div>
  );
};

export default HomePage;
