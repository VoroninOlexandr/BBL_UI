import React, { useEffect, useState } from "react";
import "./BetControls.css"
import WebSocketService from "../../WebSocketService";

const PlayerActions = ({ onFold, onCall, onRaise, minRaise, maxRaise }) => {
  const [raiseAmount, setRaiseAmount] = useState(minRaise);
  const [showRaiseSlider, setShowRaiseSlider] = useState(false);
  const webSocketService = new WebSocketService();

  const handlePlayerTurn = (data) => {
    if (data.actionType === 5){}
  };


  const handleRaiseClick = () => {
    setShowRaiseSlider(true);
  };

  const handleConfirmRaise = () => {
    onRaise(raiseAmount);
    setShowRaiseSlider(false);
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
      <button onClick={onFold}>Fold</button>
      <button onClick={onCall}>Call</button>
      <button onClick={handleRaiseClick}>Raise</button>

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
          <button onClick={handleConfirmRaise}>Confirm</button>
        </div>
      )}
    </div>
  );
};

export default PlayerActions;
