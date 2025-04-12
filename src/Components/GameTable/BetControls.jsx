import React, { useEffect, useState } from "react";
import "./BetControls.css";
import WebSocketService from "../../WebSocketService";
import { useGame } from "./GameContext";

const PlayerActions = () => {
  const [raiseAmount, setRaiseAmount] = useState(0);
  const [showRaiseSlider, setShowRaiseSlider] = useState(false);
  const [isPlayerTurn, setIsPlayerTurn] = useState(false);
  const [showButtons, setShowButtons] = useState(false);
  const [webSocketService] = useState(new WebSocketService());
  const [amountToCall, setAmountToCall] = useState(0);
  const { players } = useGame();
  const currentPlayer = players.find((p) => p.id === sessionStorage.getItem("playerId"));
  const maxRaise = currentPlayer ? currentPlayer.balance : 0;

  const foldSound = new Audio("/images/sounds/fold.mp3");
  const callSound = new Audio("/images/sounds/call.mp3");
  const raiseSound = new Audio("/images/sounds/raise.mp3");

  const handlePlayerTurn = (data) => {
    console.log("Player turn data:", data.playerId, data.actionType);
    const playerId = sessionStorage.getItem("playerId");
    if (data.actionType === 5 && data.playerId === playerId) {
      console.log(data);
      setIsPlayerTurn(true);
      setShowButtons(true);
      setAmountToCall(data.currentBet);

      console.log("Amount to call = ", amountToCall);
    }
  };

  const handleFold = () => {
    foldSound.play();
    const gameId = sessionStorage.getItem("lobbyId");
    const playerId = sessionStorage.getItem("playerId");

    const message = {
      actionType: 4, // Fold
      playerId : playerId,
      gameId : gameId
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
      playerId : playerId,
      gameId : gameId,
      amount : amountToCall
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
      playerId : playerId,
      gameId : gameId,
      amount: raiseAmount
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

  useEffect(() => {
      setRaiseAmount(amountToCall);
    }, [amountToCall]);

  return (
    <div className="player-actions">
      {showButtons && (
  <div className="action-buttons-animated">
    <button onClick={handleFold} disabled={!isPlayerTurn}>
      Fold
    </button>
    <button onClick={handleCall} disabled={!isPlayerTurn}>
      Call
    </button>
    <button onClick={handleRaiseClick} disabled={!isPlayerTurn}>
      Raise
    </button>
  </div>
)}
      {showRaiseSlider && (
        <div className="raise-controls">
          <button className="close-button" onClick={handleCloseSlider}>
            &times;
          </button>
          <input
            type="range"
            min={amountToCall}
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
