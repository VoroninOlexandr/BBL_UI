import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import unlockIcon from "../Assets/unlock.png";
import lockIcon from "../Assets/lock.png";
import "./HomePage.css";
import img1 from "../Assets/1.png";
import img2 from "../Assets/2.png";
import img3 from "../Assets/3.png";
import img4 from "../Assets/4.png";
import img5 from "../Assets/5.png";
import img6 from "../Assets/6.png";
import zeroImage from "../Assets/0.png";
import noLobbiesImage from "../Assets/nolobbies.png";

const HomePage = () => {
  const [lobbies, setLobbies] = useState([]);
  const [newLobbyName, setNewLobbyName] = useState("");
  const [maxPlayers, setMaxPlayers] = useState(2);
  const [error, setError] = useState(null);
  const [columnWidths, setColumnWidths] = useState({ name: 200, players: 150, state: 100 });
  const [hoveredLobby, setHoveredLobby] = useState(null);
const [previewImageVisible, setPreviewImageVisible] = useState(false);
  const navigate = useNavigate();

  const playerImages = {
    0: zeroImage,
    1: img1,
    2: img2,
    3: img3,
    4: img4,
    5: img5,
    6: img6,
  };

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
      const response = await axios.get("/api/games/get-all");
      setLobbies(response.data);
    } catch {
      setError("Failed to fetch game lobbies");
    }
  };

  const handleAddLobby = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/games/create", {
        lobbyName: newLobbyName,
        playerRequirement : maxPlayers
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
    const avatar = sessionStorage.getItem("avatar");
    if (!username) {
      setError("You must be logged in to join a lobby.");
      return;
    }
    try {
      const response = await axios.post(`/api/games/join/${lobbyId}`, {
        playerName: username,
        playerAvatar : avatar
      });
      const { playerId, lobbyId: gameId} = response.data;
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

        {/* Додано top-bar з логотипом */}
      <div className="top-bar">
        <div className="left-section">
          <img src="/images/logo.png" alt="Logo" className="logo" />
          <span className="brand-name">BBL Poker</span>
        </div>
      </div>
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

        <div className={`lobby-list-container ${lobbies.length === 0 ? "no-lobbies-mode" : ""}`}>
          <div className="lobby-headers">
            <span className="lobby-column" style={{ width: columnWidths.name }}>Name</span>
            <span className="lobby-column" style={{ width: columnWidths.players }}>Number of Players</span>
            <span className="lobby-column" style={{ width: columnWidths.state }}>State</span>
          </div>

          <div className="lobby-list">
          {lobbies.length === 0 ? (
  <div className="no-lobbies">
    <img src={noLobbiesImage} alt="No lobbies available" className="no-lobbies-image" />
  </div>
  
) : (

    lobbies.map((lobby, index) => {
      const isFull = lobby.playerCount >= lobby.playerRequirement;
      return (
        <div
          key={lobby.id}
          className={`lobby-card clickable-lobby ${index % 2 === 0 ? 'even' : 'odd'} ${isFull ? 'disabled' : ''}`}
          onClick={() => {
            if (!isFull) handleJoinTable(lobby.id);
          }}
          onMouseEnter={() => {
            setPreviewImageVisible(false); // сховаємо
            setTimeout(() => {
              setHoveredLobby(lobby); // змінимо фото
              setPreviewImageVisible(true); // знову покажемо
            }, 50);
          }}
        >
          <span className="lobby-column" style={{ width: columnWidths.name }}>{lobby.lobbyName}</span>
          <span className="lobby-column" style={{ width: columnWidths.players }}>
            {lobby.playerCount}/{lobby.playerRequirement}
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

      {/* Незалежний контейнер з фото */}
      <div className="hover-preview-container">
  {hoveredLobby && (
    <img
      src={playerImages[hoveredLobby.playerCount]}
      alt={`Preview for ${hoveredLobby.playerCount} players`}
      className={`hover-preview-image ${previewImageVisible ? "visible" : ""}`}
    />
  )}
</div>
    </div>

    
  );
};

export default HomePage;
