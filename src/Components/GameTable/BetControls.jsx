import React, { useState } from "react";
import "./BetControls.css";
import { useGame } from "./GameContext";

const BetControls = ({ onFold, onCall, onRaise, minRaise, maxRaise }) => {
  const { players, balances } = useGame();
  console.log("pushachki:", players);
  
  const [raiseAmount, setRaiseAmount] = useState(minRaise);
  const [showRaiseSlider, setShowRaiseSlider] = useState(false);

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

export default BetControls;
