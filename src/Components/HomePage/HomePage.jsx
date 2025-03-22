import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";

const HomePage = () => {
  const [lobbies, setLobbies] = useState([]);
  const [newLobbyName, setNewLobbyName] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Блокування масштабування при натисканні Ctrl + Scroll
    const handleWheel = (e) => {
      if (e.ctrlKey) {
        e.preventDefault(); // Запобігаємо стандартному дії масштабування
      }
    };

    // Додаємо обробник події
    window.addEventListener("wheel", handleWheel, { passive: false });

    // Очищуємо обробник події при розмонтуванні компонента
    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, []); // Виконати тільки один раз після рендеру компонента
  
  useEffect(() => {
    fetchLobbies();
  }, []);

  const fetchLobbies = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/games/get-all");
      setLobbies(response.data);
    } catch (err) {
      setError("Failed to fetch game lobbies");
    }
  };

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

  const handleJoinTable = async (lobbyId) => {
    const username = sessionStorage.getItem("username");
    if (!username) {
      setError("You must be logged in to join a lobby.");
      return;
    }
    try {
      const response = await axios.post(`http://localhost:8080/api/games/join/${lobbyId}`, { playerName: username });
      const { playerId, lobbyId: gameId } = response.data;
      if (!playerId || !gameId) {
        setError("Failed to join the game. Invalid server response.");
        return;
      }
      sessionStorage.setItem("playerId", playerId);
      sessionStorage.setItem("gameId", gameId);
      sessionStorage.setItem("lobbyId", lobbyId);
      
      navigate(`/table/${playerId}`);
    } catch (err) {
      setError("Failed to join the table.");
    }
  };

  return (
    <div className="home-page">
      <h4>Lobby List</h4>
      <h3>Choose available lobby from the list or create one</h3>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleAddLobby} className="create-lobby-form">
        <input
          type="text"
          value={newLobbyName}
          onChange={(e) => setNewLobbyName(e.target.value)}
          placeholder="Enter lobby name"
          required
          className="lobby-input"
        />
        <button type="submit" className="create-lobby-button">Create</button>
      </form>

      
      <table className="lobby-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Number of Players</th>
            <th>State</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {lobbies.length === 0 ? (
            <tr>
              <td colSpan="4" className="no-lobbies">No lobbies found</td>
            </tr>
          ) : (
            lobbies.map((lobby) => (
              <tr key={lobby.id}>
                <td>{lobby.lobbyName}</td>
                <td>{lobby.playerCount}</td>
                <td  className="lock-icon">
                {lobby.playerCount >= 6 ? '🔒' : '🔓'}
                </td>
                <td>
                <button 
                  onClick={() => handleJoinTable(lobby.id)}
                  disabled={lobby.playerCount >= 6} 
                  className={`join-button ${lobby.playerCount >= 6 ? 'disabled' : ''}`}
                  >
                    Join
                  </button>


                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>


    </div>
  );
};

export default HomePage;
