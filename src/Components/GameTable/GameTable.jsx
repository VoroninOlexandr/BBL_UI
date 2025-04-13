import React, { useState, useEffect, useRef } from "react";
import "./GameTable.css";
import { useGame } from "./GameContext";
import WebSocketComponentChat from "../WebSocketComponent/WebSocketComponentChat";
import WebSocketComponentDealer from "../WebSocketComponent/WebSocketComponentDealer";
import BetControls from "./BetControls";
import WebSocketService from "../../WebSocketService";

const positionsByPlayerCount = {
  1: [{ left: "50%", top: "50%", transform: "translate(-50%, 190px)"  }],
  2: [
    { left: "50%", top: "50%", transform: "translate(-50%, 190px)"  },
    { left: "50%", top: "50%", transform: "translate(-50%, -400px)"  },
  ],
  3: [
    { left: "50%", top: "50%", transform: "translate(-50%, 190px)"  },
    { left: "50%", top: "50%", transform: "translate(-565px, -260px)"  },
    { left: "50%", top: "50%", transform: "translate(440px, -260px)"  },
  ],
  4: [
    { left: "50%", top: "50%", transform: "translate(-50%, 190px)"  },
    { left: "50%", top: "50%", transform: "translate(-565px, -260px)"  },
    { left: "50%", top: "50%", transform: "translate(-50%, -400px)"  },
    { left: "50%", top: "50%", transform: "translate(440px, -260px)"  },
  ],
  5: [
    { left: "50%", top: "50%", transform: "translate(-50%, 190px)"  },
    { left: "50%", top: "50%", transform: "translate(-565px, 30px)"  },
    { left: "50%", top: "50%", transform: "translate(-565px, -260px)"  },
    { left: "50%", top: "50%", transform: "translate(440px, -260px)"  },
    { left: "50%", top: "50%", transform: "translate(440px, 35px)"  },
  ],
  6: [
    { left: "50%", top: "50%", transform: "translate(-50%, 190px)"  },
    { left: "50%", top: "50%", transform: "translate(-565px, 35px)"  },
    { left: "50%", top: "50%", transform: "translate(-565px, -260px)"  },
    { left: "50%", top: "50%", transform: "translate(-50%, -400px)"  },
    { left: "50%", top: "50%", transform: "translate(440px, -260px)"  },
    { left: "50%", top: "50%", transform: "translate(440px, 35px)"  },
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
  const [showEndGameButtons, setShowEndGameButtons] = useState(false);

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
        setShowEndGameButtons(true);
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
          avatar: "/images/avatar_" + p.avatar + ".png",
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

  const handlePlayAgain = () => {
    
    setWinnerInfo(null);
    setShowEndGameButtons(false);
    fetchLobby(); 
  };

  const handleLeaveTable = () => {
    window.location.href = "/home";
  };

  const positions = positionsByPlayerCount[players.length] || [];

  return (
    <div className="game-table-container">
      <audio ref={audioRef} src="/images/chat.mp3" autoPlay loop />

      <div className="top-bar">{/* ... */}</div>

      <div className="panel-container">{/* ... */}</div>

      <div className="game-table">
        <img src="/images/tableback.png" alt="Background" className="background" />
        <img src="/images/tablefront.png" alt="Poker Table" className="table" />
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
              <img src="/images/chip.png" alt="Chip" className="chip-icon" />
              {player.balance}
            </span>
          </div>
        ))}
      </div>

      {winnerInfo && (
        <div className="winner-overlay">
          <img src="/images/winner.png" alt="Winner" className="winner-image" />
          <div className="winner-text">
            <h1>WINNER: {winnerInfo.name}</h1>
            <h2>{winnerInfo.hand}</h2>
          </div>

          {showEndGameButtons && (
            <div className="end-game-buttons">
              <button className="play-again-button" onClick={handlePlayAgain}>
                PLAY AGAIN
              </button>
              <button className="leave-table-button" onClick={handleLeaveTable}>
                LEAVE TABLE
              </button>
            </div>
          )}
        </div>
      )}

      <BetControls players={players} />
      <WebSocketComponentChat />
    </div>
  );
};

export default GameTable;
