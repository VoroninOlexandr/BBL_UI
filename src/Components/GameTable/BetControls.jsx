import React, { useEffect, useState } from "react";
import "./BetControls.css";
import WebSocketService from "../../WebSocketService";
import { useGame } from "./GameContext";

import foldSoundFile from "/src/Components/Assets/sounds/fold.mp3";
import callSoundFile from "/src/Components/Assets/sounds/call.mp3";
import raiseSoundFile from "/src/Components/Assets/sounds/raise.mp3";

const PlayerActions = ({ onFold, onCall, onRaise, minRaise, maxRaise }) => {
  const [raiseAmount, setRaiseAmount] = useState(minRaise);
  const [showRaiseSlider, setShowRaiseSlider] = useState(false);
  const [isPlayerTurn, setIsPlayerTurn] = useState(false);
  const [showButtons, setShowButtons] = useState(false);
  const webSocketService = new WebSocketService();

  const { players } = useGame();

  const foldSound = new Audio(foldSoundFile);
  const callSound = new Audio(callSoundFile);
  const raiseSound = new Audio(raiseSoundFile);

  const handlePlayerTurn = (data) => {
    console.log("Player turn data:", data.playerId, data.actionType);
    const playerId = sessionStorage.getItem("playerId");
    if (data.actionType === 5 && data.playerId === playerId) {
      setIsPlayerTurn(true);
      setShowButtons(true);
    }
  };

  const handleFold = () => {
    foldSound.play();
    const gameId = sessionStorage.getItem("lobbyId");
    const playerId = sessionStorage.getItem("playerId");

    const message = {
      actionType: 4, // Fold
      playerId,
      gameId,
    };
    webSocketService.sendMessage(gameId, message);
    setIsPlayerTurn(false);
    setShowButtons(false);
  };

  const handleCall = () => {
    callSound.play();
    const gameId = sessionStorage.getItem("lobbyId");
    const playerId = sessionStorage.getItem("playerId");

    const message = {
      actionType: 3, // Call
      playerId,
      gameId,
    };
    webSocketService.sendMessage(gameId, message);
    setIsPlayerTurn(false);
    setShowButtons(false);
  };

  const handleRaise = () => {
    raiseSound.play();
    const gameId = sessionStorage.getItem("lobbyId");
    const playerId = sessionStorage.getItem("playerId");

    const message = {
      actionType: 3, // Raise
      playerId,
      gameId,
      amount: raiseAmount,
    };
    webSocketService.sendMessage(gameId, message);
    setShowRaiseSlider(false);
    setIsPlayerTurn(false);
    setShowButtons(false);
  };

  const handleRaiseClick = () => {
    setShowRaiseSlider(true);
  };

  const handleCloseSlider = () => {
    setShowRaiseSlider(false);
  };

  useEffect(() => {
    const gameId = sessionStorage.getItem("lobbyId");
    const playerId = sessionStorage.getItem("playerId");
    if (gameId && playerId) {
      webSocketService.connect(gameId, playerId, handlePlayerTurn);
    }
  }, []);

  return (
    <div className="player-actions">
      {showButtons && (
        <>
          <button onClick={handleFold} disabled={!isPlayerTurn}>
            Fold
          </button>
          <button onClick={handleCall} disabled={!isPlayerTurn}>
            Call
          </button>
          <button onClick={handleRaiseClick} disabled={!isPlayerTurn}>
            Raise
          </button>
        </>
      )}

      {showRaiseSlider && (
        <div className="raise-controls">
          <button className="close-button" onClick={handleCloseSlider}>
            &times;
          </button>
          <input
            type="range"
            min={minRaise}
            max={maxRaise}
            value={raiseAmount}
            onChange={(e) => setRaiseAmount(Number(e.target.value))}
          />
          <span>{raiseAmount}</span>
          <button onClick={handleRaise}>Confirm</button>
        </div>
      )}
    </div>
  );
};

export default PlayerActions;
