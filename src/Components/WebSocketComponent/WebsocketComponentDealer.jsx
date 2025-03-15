import React, { useState } from "react";
import "./WebSocketComponentDealer.css";

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

const WebSocketComponentDealer = () => {
  const [communityCards, setCommunityCards] = useState([]);
  const [privateCards, setPrivateCards] = useState([]);

  const handleCardData = (data) => {
    if (data.actionType === 1) {
      setCommunityCards((prev) => {
        const exists = prev.some(
          (card) => card.rank === data.ordinalCard.rank && card.suit === data.ordinalCard.suit
        );
        return exists ? prev : [...prev, data.ordinalCard];
      });
    } else if (data.actionType === 0) {
      setPrivateCards((prev) => {
        const exists = prev.some(
          (card) => card.rank === data.ordinalCard.rank && card.suit === data.ordinalCard.suit
        );
        return exists ? prev : [...prev, data.ordinalCard];
      });
    }
  };

  return (
    <div className="game-table-container">
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
