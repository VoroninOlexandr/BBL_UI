import React, { createContext, useContext, useState } from "react";

const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [players, setPlayers] = useState([]);
  const [balances, setBalances] = useState([]);

  return (
    <GameContext.Provider value={{ players, balances, setPlayers, setBalances }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => useContext(GameContext);
