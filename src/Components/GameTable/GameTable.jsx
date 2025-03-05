import React, { useState, useEffect } from "react";
import "./GameTable.css";
import WebSocketComponentChat from "../WebSocketComponent/WebSocketComponentChat";
import BetControls from "./BetControls";
import WebSocketService from "../../WebSocketService";


const handleRaise = (bet) => {
  console.log(`Raised bet to $${bet}`);
  // You can implement further logic here for raising the bet
};

const handleCheck = () => {
  console.log("Checked");
  // You can implement further logic here for checking
};

const handlePass = () => {
  console.log("Passed");
  // You can implement further logic here for passing
};


const positionsByPlayerCount = {
  0: [],
  1: [{ bottom: "9%", left: "49%", transform: "translateX(-50%)" }],

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

  const [players, setPlayers] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);

  useEffect(() => {
    const lobbyId = sessionStorage.getItem("lobbyId");
    if (!lobbyId) {
      console.log("Lobby ID is missing");
      return;
    }

    const url = `http://localhost:8080/api/games/get/${lobbyId}`;
    console.log("Fetching from URL:", url);

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched data:", data);
        if (!data.players || !Array.isArray(data.players)) {
          console.error("Invalid players data:", data.players);
          return;
        }

        setPlayers(
          data.players.map((p) => ({
            id: p.id,
            name: p.nickname,
            avatar: "/src/Components/Assets/player-icon.png",
          }))
        );
      })
      .catch((error) => console.error("Error fetching players:", error));
  }, []);

  const positions = positionsByPlayerCount[players.length] || [];

  return (
    <div className="game-table-container">
      <div className="game-table">
        <img
          src="/src/Components/Assets/tableback.png"

          alt="Background"
          className="background"
        />
        <img

          src="/src/Components/Assets/tablefront.png"
          alt="Poker Table"
          className="table"
        />
        {players.length === 0 ? (
          <p>No players in the game yet.</p>
        ) : (
          players.map((player, index) => (
            <div
              key={player.id}
              className={`player player-${index + 1}`}
              style={positions[index] || {}}
            >
              <img src={player.avatar} alt={player.name} className="avatar" />
              <span className="player-name">{player.name}</span>
            </div>
          ))
        )}
      </div>

      {}
      <div className="players-list">
        <h3>Players in Lobby:</h3>
        <ul>
          {players.map((player) => (
            <li key={player.id}>{player.name}</li>
          ))}
        </ul>
      </div>

      <BetControls onRaise={handleRaise} onCheck={handleCheck} onPass={handlePass}/>

      <WebSocketComponentChat chatMessages={chatMessages} setChatMessages={setChatMessages} />
    </div>
  );
};

export default GameTable;
