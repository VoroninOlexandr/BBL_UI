import React, { useState, useEffect } from "react";
import "./GameTable.css";
import { useGame } from "./GameContext";
import WebSocketComponentChat from "../WebSocketComponent/WebSocketComponentChat";
import WebSocketComponentDealer from "../WebSocketComponent/WebSocketComponentDealer";
import BetControls from "./BetControls";
import WebSocketService from "../../WebSocketService";

const positionsByPlayerCount = {
  1: [{ bottom: "9%", left: "50%", transform: "translateX(-50%)" }],
  2: [
    { bottom: "9%", left: "50%", transform: "translateX(-50%)" },
    { top: "5%", left: "50%", transform: "translateX(-60%)" },
  ],
  3: [
    { bottom: "9%", left: "50%", transform: "translateX(-60%)" },
    { top: "21%", left: "17%" },
    { top: "21%", right: "17%" },
  ],
  4: [
    { bottom: "9%", left: "50%", transform: "translateX(-60%)" },
    { top: "21%", left: "17%" },
    { top: "5%", left: "50%", transform: "translateX(-60%)" },
    { top: "21%", right: "17%" },
  ],
  5: [
    { bottom: "9%", left: "50%", transform: "translateX(-60%)" },
    { bottom: "28%", left: "17%" },
    { top: "21%", left: "17%" },
    { top: "21%", right: "17%" },
    { bottom: "28%", right: "17%" },
  ],
  6: [
    { bottom: "9%", left: "50%", transform: "translateX(-60%)" },
    { bottom: "28%", left: "17%" },
    { top: "21%", left: "17%" },
    { top: "5%", left: "50%", transform: "translateX(-60%)" },
    { top: "21%", right: "17%" },
    { bottom: "28%", right: "17%" },
  ],
};

const GameTable = () => {
  const { players, balances, setPlayers, setBalances } = useGame();
  const webSocketService = new WebSocketService();

  const changePot = (data) => {
    if (data.actionType === 3) {
      console.log("Pushak");
      const { playerId, amount, newPot} = data;
      setPlayers((prevPlayers) =>
        prevPlayers.map((player) =>
          player.id === playerId ? { ...player, balance: player.balance - amount } : player
        )
      );
  }

  if (data.actionType === 6){
    
  }
};

  useEffect(() => {
    const handleWheel = (e) => {
      if (e.ctrlKey) {
        e.preventDefault(); 
      }
    };
    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, []);

  useEffect(() => {
    const lobbyId = sessionStorage.getItem("lobbyId");
    const playerId = sessionStorage.getItem("playerId");

    if (lobbyId && playerId) {
      webSocketService.connect(lobbyId, playerId, changePot);
    }

    fetch(`http://localhost:8080/api/games/get/${lobbyId}`)
      .then((response) => response.json())
      .then((data) => {
        if (!data.players || !Array.isArray(data.players)) return;

        let sortedPlayers = data.players.map((p) => ({
          id: p.id,
          name: p.nickname,
          avatar: "/src/Components/Assets/player-icon.png",
          balance: 1000,
        }));

        const mainPlayerIndex = sortedPlayers.findIndex(p => p.id === playerId);

        if (mainPlayerIndex !== -1) {
          sortedPlayers = [
            sortedPlayers[mainPlayerIndex], 
            ...sortedPlayers.slice(mainPlayerIndex + 1),
            ...sortedPlayers.slice(0, mainPlayerIndex)
          ];
        }

        setPlayers(sortedPlayers);
      })
      .catch((error) => console.error("Error fetching players:", error));
  }, []);

  const updateBalances = (newBalances) => {
    setBalances(newBalances);
  };

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
  
        <WebSocketComponentDealer players={players} updateBalances={updateBalances} />
  
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
              <span className="player-balance">
                <img src="/src/Components/Assets/chip.png" alt="Chip" className="chip-icon" />
                {player.balance}
              </span>
            </div>
          ))
        )}
      </div>
  
      <BetControls players={players} />
      <WebSocketComponentChat />
    </div>
  );
};

export default GameTable;