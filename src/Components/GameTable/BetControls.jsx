import React, { useState } from "react";


const BetControls = ({ onRaise, onCheck, onPass }) => {
  const [bet, setBet] = useState(0);

  return (
    <div className="betting-controls">
      <input
        type="range"
        min="0"
        max="1000"
        value={bet}
        onChange={(e) => setBet(e.target.value)}
      />
      <span>Bet: ${bet}</span>
      <button onClick={() => onRaise(bet)}>Raise</button>
      <button onClick={onCheck}>Check</button>
      <button onClick={onPass}>Pass</button>
    </div>
  );
};

export default BetControls;
