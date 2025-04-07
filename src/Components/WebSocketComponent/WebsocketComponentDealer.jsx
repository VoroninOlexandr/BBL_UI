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
  const [pot, setPot] = useState(0);
  const [bestHand, setBestHand] = useState(""); // 👈 новий стейт для найкращої комбінації
  const [playerBalances, setPlayerBalances] = useState(
    players.map((player) => ({ ...player, balance: 1000 }))
  );
  const [webSocketService] = useState(new WebSocketService());

  const handleCardData = (data) => {
    if (data.actionType === 1) {
      const newCard = {
        suit: data.ordinalCard.suit,
        rank: data.ordinalCard.rank,
      };
      setCommunityCards((prev) => [...prev, newCard]);
    } else if (data.actionType === 0) {
      const newCard = {
        suit: data.ordinalCard.suit,
        rank: data.ordinalCard.rank,
      };
      setPrivateCards((prev) => [...prev, newCard]);
    } else if (data.actionType === 2) {
      if (data.PlayerBestHand) {
        setBestHand(data.PlayerBestHand);
      }
    } else if (data.actionType === 3) {
      const { playerId, amount, newPot } = data;
      setPlayerBalances((prevBalances) =>
        prevBalances.map((player) =>
          player.id === playerId
            ? { ...player, balance: player.balance - amount }
            : player
        )
      );
      setPot(() => newPot);
    }
  };

  useEffect(() => {
    const gameId = sessionStorage.getItem("lobbyId");
    const playerId = sessionStorage.getItem("playerId");
    if (gameId && playerId) {
      webSocketService.connect(gameId, playerId, handleCardData);
    }
  }, []);

  return (
    <div className="game-table-container">
      <div className="pot-container">Pot: ${pot}</div>

      <div className="pot-container">Pot: ${pot}</div>

<button
  onClick={() =>
    handleCardData({
      actionType: 2,
      PlayerBestHand: "TWO PAIRS"
    })
  }
>
  Test Best Hand
</button>

      {bestHand && (
        <div className="best-hand-announcement">
        {bestHand}
        </div>
      )}

      <div className="cards-container">
        {communityCards.map((card, index) => (
          <div key={index} className="card public-card">
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
          <div key={index} className="card-private-card">
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
