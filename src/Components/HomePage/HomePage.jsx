import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import unlockIcon from "../Assets/unlock.png";
import lockIcon from "../Assets/lock.png";
import "./HomePage.css";

const HomePage = () => {
  const [lobbies, setLobbies] = useState([]);
  const [newLobbyName, setNewLobbyName] = useState("");
  const [maxPlayers, setMaxPlayers] = useState(2);
  const [error, setError] = useState(null);
  const [columnWidths, setColumnWidths] = useState({ name: 200, players: 150, state: 100 });
  const navigate = useNavigate();

  useEffect(() => {
    const handleWheel = (e) => {
      if (e.ctrlKey) e.preventDefault();
    };
    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, []);

  useEffect(() => {
    fetchLobbies();
  }, []);

  const fetchLobbies = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/games/get-all");
      setLobbies(response.data);
    } catch {
      setError("Failed to fetch game lobbies");
    }
  };

  const handleAddLobby = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/api/games/create", {
        lobbyName: newLobbyName,
        maxPlayers: maxPlayers
      });
      setNewLobbyName("");
      setMaxPlayers(2);
      fetchLobbies();
    } catch {
      setError("Failed to create a new lobby");
    }
  };

  const handleJoinTable = async (lobbyId) => {
    const username = sessionStorage.getItem("username");
    if (!username) {
      setError("You must be logged in to join a lobby.");
      return;
    }
    try {
      const response = await axios.post(`http://localhost:8080/api/games/join/${lobbyId}`, {
        playerName: username
      });
      const { playerId, lobbyId: gameId } = response.data;
      if (!playerId || !gameId) {
        setError("Failed to join the game. Invalid server response.");
        return;
      }
      sessionStorage.setItem("playerId", playerId);
      sessionStorage.setItem("gameId", gameId);
      sessionStorage.setItem("lobbyId", lobbyId);
      navigate(`/table/${playerId}`);
    } catch {
      setError("Failed to join the table.");
    }
  };

  return (
    <div className="home-page-container">
      <div className="home-page">
        <h4>Lobby List</h4>
        <h3>Choose available lobby from the list or create one</h3>
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleAddLobby} className="create-lobby-form">
          <div className="lobby-input-wrapper">
            <input
              type="text"
              value={newLobbyName}
              onChange={(e) => setNewLobbyName(e.target.value)}
              placeholder="Enter lobby name"
              required
              className="lobby-input"
            />
            <select
              className="player-count-select"
              value={maxPlayers}
              onChange={(e) => setMaxPlayers(Number(e.target.value))}
            >
              {[2, 3, 4, 5, 6].map((num) => (
                <option key={num} value={num}>
                  {num} Players
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className="create-lobby-button">Create</button>
        </form>

        <div className="lobby-list-container">
          <div className="lobby-headers">
            <span className="lobby-column" style={{ width: columnWidths.name }}>Name</span>
            <span className="lobby-column" style={{ width: columnWidths.players }}>Number of Players</span>
            <span className="lobby-column" style={{ width: columnWidths.state }}>State</span>
          </div>

          <div className="lobby-list">
            {lobbies.length === 0 ? (
              <div className="no-lobbies">No lobbies found</div>
            ) : (
              lobbies.map((lobby, index) => {
                const isFull = lobby.playerCount >= lobby.maxPlayers;
                return (
                  <div
                    key={lobby.id}
                    className={`lobby-card clickable-lobby ${index % 2 === 0 ? 'even' : 'odd'} ${isFull ? 'disabled' : ''}`}
                    onClick={() => {
                      if (!isFull) handleJoinTable(lobby.id);
                    }}
                  >
                    <span className="lobby-column" style={{ width: columnWidths.name }}>{lobby.lobbyName}</span>
                    <span className="lobby-column" style={{ width: columnWidths.players }}>
                      {lobby.playerCount}/{lobby.maxPlayers}
                    </span>
                    <span className="lobby-column" style={{ width: columnWidths.state }}>
                      <img 
                        src={isFull ? lockIcon : unlockIcon} 
                        alt={isFull ? "Locked" : "Unlocked"} 
                        className="lock-icon" 
                      />
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
