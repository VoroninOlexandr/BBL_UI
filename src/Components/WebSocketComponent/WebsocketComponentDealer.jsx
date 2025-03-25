import React, { useEffect, useState } from "react";
import "./WebSocketComponentDealer.css";
import WebSocketService from "../../WebSocketService";

const Suit = {
  0: "clubs",
  1: "diamonds",
  2: "hearts",
  3: "spades",
};

const Rank = {
  0: "TWO",
  1: "THREE",
  2: "FOUR",
  3: "FIVE",
  4: "SIX",
  5: "SEVEN",
  6: "EIGHT",
  7: "NINE",
  8: "TEN",
  9: "JACK",
  10: "QUEEN",
  11: "KING",
  12: "ACE",
};

const WebSocketComponentDealer = ({ players }) => {
  const [communityCards, setCommunityCards] = useState([]);
  const [privateCards, setPrivateCards] = useState([]);
  const [pot, setPot] = useState(Math.floor(Math.random() * 5000) + 1000);
  const [playerBalances, setPlayerBalances] = useState(
    players.map((player) => ({ ...player, balance: Math.floor(Math.random() * 5000) + 1000 }))
  );

  const handleCardData = (data) => {
    const newCard = {
      suit: data.ordinalCard.suit,
      rank: data.ordinalCard.rank,
    };

    if (data.actionType === 1) {
      setCommunityCards((prev) => [...prev, newCard]);
    } else if (data.actionType === 0) {
      setPrivateCards((prev) => [...prev, newCard]);
    }
  };

  useEffect(() => {
    const gameId = sessionStorage.getItem("lobbyId");
    const playerId = sessionStorage.getItem("playerId");

    if (gameId && playerId) {
      WebSocketService.connect(gameId, playerId, handleCardData);
    }
  }, []);

  return (
    <div className="game-table-container">
      <div className="pot-container">Pot: ${pot}</div>

      <div className="cards-container">
        {communityCards.map((card, index) => (
          <div key={index} className="card">
            <img
              src={`/src/Components/Assets/suits/${Suit[card.suit]}_${Rank[card.rank]}.png`}
              alt={`${Rank[card.rank]} of ${Suit[card.suit]}`}
              className="card-image"
            />
          </div>
        ))}
      </div>

      <div className="private-cards-container">
        {privateCards.map((card, index) => (
          <div key={index} className="card">
            <img
              src={`/src/Components/Assets/suits/${Suit[card.suit]}_${Rank[card.rank]}.png`}
              alt={`${Rank[card.rank]} of ${Suit[card.suit]}`}
              className="card-image"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default WebSocketComponentDealer;
