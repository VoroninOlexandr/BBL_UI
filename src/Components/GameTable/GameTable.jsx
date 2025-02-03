import React, { useState } from "react";
import "./GameTable.css";
import WebSocketComponentChat from "../WebSocketComponent/WebSocketComponentChat";

// Мок-дані гравців
const allPlayers = [    
  { id: 1, name: "You", avatar: "/src/Components/assets/player-icon.png" },
  { id: 2, name: "Player 2", avatar: "/src/Components/Assets/player-icon.png" },
  { id: 3, name: "Player 3", avatar: "/src/Components/Assets/player-icon.png" },
  { id: 4, name: "Player 4", avatar: "/src/Components/Assets/player-icon.png" },
  { id: 5, name: "Player 5", avatar: "/src/Components/Assets/player-icon.png" },
  { id: 6, name: "Player 6", avatar: "/src/Components/Assets/player-icon.png" },
];

const positionsByPlayerCount = {
  0: [],
  1: [
    { bottom: "9%", left: "49%", transform: "translateX(-50%)" },
  ],
  2: [
    { bottom: "9%", left: "49%", transform: "translateX(-50%)" },
    { top: "4%", left: "49%", transform: "translateX(-50%)" },
  ],
  3: [
    { bottom: "9%", left: "49%", transform: "translateX(-50%)" },
    { top: "21%", right: "18%" },
    { top: "21%", left: "16%" },
  ],
  4: [
    { bottom: "9%", left: "49%", transform: "translateX(-50%)" },
    { top: "4%", left: "49%", transform: "translateX(-50%)" },
    { top: "37%", right: "16%" },
    { top: "37%", left: "14%" },
  ],
  5: [
    { bottom: "9%", left: "49%", transform: "translateX(-50%)" },
    { top: "13%", right: "22%" },
    { top: "13%", left: "20%" },
    { bottom: "28%", right: "18%" },
    { bottom: "28%", left: "16%" },
  ],
  6: [
    { bottom: "9%", left: "49%", transform: "translateX(-50%)" },
    { top: "4%", left: "49%", transform: "translateX(-50%)" },
    { top: "21%", right: "18%" },
    { top: "21%", left: "16%" },
    { bottom: "28%", right: "18%" },
    { bottom: "28%", left: "16%" },
  ],
};

const GameTable = () => {
  const [playerCount, setPlayerCount] = useState(6);
  const [chatMessages, setChatMessages] = useState([]); // Додаємо стани для чат-повідомлень

  const increasePlayers = () => {
    if (playerCount < allPlayers.length) {
      setPlayerCount(playerCount + 1);
    }
  };

  const decreasePlayers = () => {
    if (playerCount > 0) {
      setPlayerCount(playerCount - 1);
    }
  };

  const players = allPlayers.slice(0, playerCount);
  const positions = positionsByPlayerCount[playerCount];

  return (
    <div className="game-table-container">
      <div className="controls">
        <button onClick={decreasePlayers} disabled={playerCount === 0}>
          Remove Player
        </button>
        <button onClick={increasePlayers} disabled={playerCount === allPlayers.length}>
          Add Player
        </button>
      </div>
      <div className="game-table">
        <img
          src="/src/Components/Assets/table-background.png"
          alt="Background"
          className="background"
        />
        <img
          src="/src/Components/Assets/poker-table.png"
          alt="Poker Table"
          className="table"
        />

        {players.map((player, index) => (
          <div
            key={player.id}
            className={`player player-${index + 1}`}
            style={positions[index]}
          >
            <img
              src={player.avatar}
              alt={player.name}
              className={`avatar ${player.name === "You" ? "main-player" : ""}`}
            />
            <span className="player-name">
              {player.name === "You" ? "You" : player.name}
            </span>
          </div>
        ))}
      </div>
      <WebSocketComponentChat chatMessages={chatMessages} setChatMessages={setChatMessages} />
    </div>
  );
};

export default GameTable;
