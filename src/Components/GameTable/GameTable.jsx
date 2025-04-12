import React, { useState, useEffect, useRef } from "react";
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
    { top: "5%", left: "50%", transform: "translateX(-50%)" },
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

const BestHand = {
  0: "HIGH CARD",
  1: "ONE PAIR",
  2: "TWO PAIRS",
  3: "THREE OF A KIND",
  4: "STRAIGHT",
  5: "FLUSH",
  6: "FULL HOUSE",
  7: "FOUR OF A KIND",
  8: "STRAIGHT FLUSH",
  9: "ROYAL FLUSH",
};

const GameTable = () => {
  const { players, balances, setPlayers, setBalances } = useGame();
  const [webSocketService] = useState(new WebSocketService());
  const playersRef = useRef(players);
  const [winnerInfo, setWinnerInfo] = useState(null);

  const [activePanel, setActivePanel] = useState(null);
  const togglePanel = (panel) => {
    setActivePanel((prev) => (prev === panel ? null : panel));
  };

  const [muted, setMuted] = useState(false);
  const audioRef = useRef(null);

  const toggleMute = () => {
    setMuted((prev) => !prev);
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = muted;
    }
  }, [muted]);

  const changePot = (data) => {
    if (data.actionType === 3) {
      const { playerId, amount } = data;
      setPlayers((prevPlayers) =>
        prevPlayers.map((player) =>
          player.id === playerId ? { ...player, balance: player.balance - amount } : player
        )
      );
    } else if (data.actionType === 6) {
      fetchLobby();
    } else if (data.actionType === 7) {
      const winners = data.winnerList;
      const winner = winners[0];
      const player = playersRef.current.find((p) => p.id === winner.playerId);
      if (player) {
        setWinnerInfo({
          name: player.name,
          hand: BestHand[winner.combination],
        });
      }
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

  const fetchLobby = () => {
    const playerId = sessionStorage.getItem("playerId");
    const lobbyId = sessionStorage.getItem("lobbyId");

    fetch(`http://localhost:8080/api/games/get/${lobbyId}`)
      .then((response) => response.json())
      .then((data) => {
        if (!data.players || !Array.isArray(data.players)) return;

        let sortedPlayers = data.players.map((p) => ({
          id: p.id,
          name: p.nickname,
          avatar: "/public/Assets/player-icon.png",
          balance: 1000,
        }));

        const mainPlayerIndex = sortedPlayers.findIndex((p) => p.id === playerId);
        if (mainPlayerIndex !== -1) {
          sortedPlayers = [
            sortedPlayers[mainPlayerIndex],
            ...sortedPlayers.slice(mainPlayerIndex + 1),
            ...sortedPlayers.slice(0, mainPlayerIndex),
          ];
        }

        setPlayers(sortedPlayers);
      });
  };

  useEffect(() => {
    playersRef.current = players;
  }, [players]);

  useEffect(() => {
    const lobbyId = sessionStorage.getItem("lobbyId");
    const playerId = sessionStorage.getItem("playerId");

    if (lobbyId && playerId) {
      webSocketService.connect(lobbyId, playerId, changePot);
    }

    fetchLobby();
  }, []);

  const updateBalances = (newBalances) => {
    setBalances(newBalances);
  };

  const positions = positionsByPlayerCount[players.length] || [];

  return (
    <div className="game-table-container">
      <audio ref={audioRef} src="/public/Assets/chat.mp3" autoPlay loop />

      <div className="top-bar">
        <div className="left-section">
          <img src="/public/Assets/logo.png" alt="Logo" className="logo" />
          <span className="brand-name">BBL Poker</span>
        </div>
        <div className="center-section">
          <button onClick={() => togglePanel("about")} className="top-button">About Us</button>
          <button onClick={() => togglePanel("help")} className="top-button">Help</button>
        </div>
        <div className="right-section">
          <img
            src={muted ? "/public/Assets/soundoff.png" : "/public/Assets/soundon.png"}
            alt="Toggle Sound"
            className="sound-icon"
            onClick={toggleMute}
          />
        </div>
      </div>

      <div className="panel-container">
        {activePanel === "about" && (
          <div className="info-panel">
            <img src="/public/Assets/aboutus.png" alt="About Us" className="panel-image about-img" />
          </div>
        )}
        {activePanel === "help" && (
          <div className="info-panel">
            <img src="/public/Assets/help.png" alt="Help" className="panel-image help-img" />
          </div>
        )}  
      </div>

      <div className="game-table">
        <img src="/public/Assets/tableback.png" alt="Background" className="background" />
        <img src="/public/Assets/tablefront.png" alt="Poker Table" className="table" />

        <WebSocketComponentDealer players={players} updateBalances={updateBalances} />

        {players.map((player, index) => (
          <div
            key={player.id}
            className={`player player-${index + 1}`}
            style={positions[index] || {}}
          >
            <img src={player.avatar} alt={player.name} className="avatar" />
            <span className="player-name">{player.name}</span>
            <span className="player-balance">
              <img src="/public/Assets/chip.png" alt="Chip" className="chip-icon" />
              {player.balance}
            </span>
          </div>
        ))}
      </div>

      {winnerInfo && (
        <div className="winner-overlay">
          <img src="/public/Assets/winner.png" alt="Winner" className="winner-image" />
          <div className="winner-text">
            <h1>WINNER: {winnerInfo.name}</h1>
            <h2>{winnerInfo.hand}</h2>
          </div>
        </div>
      )}

      <BetControls players={players} />
      <WebSocketComponentChat />
    </div>
  );
};

export default GameTable;
