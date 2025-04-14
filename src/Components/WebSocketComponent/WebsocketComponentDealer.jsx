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

const WebSocketComponentDealer = ({ players }) => {
  const [communityCards, setCommunityCards] = useState([]);
  const [privateCards, setPrivateCards] = useState([]);
  const [pot, setPot] = useState(0);
  const [bestHand, setBestHand] = useState("");
  const [winner, setWinner] = useState(null);
  const [webSocketService] = useState(new WebSocketService());
  const [isGrayscale, setIsGrayscale] = useState(false);

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
      console.log(data);
      setBestHand(BestHand[data.ordinal]);
    } else if (data.actionType === 3) {
      const { playerId, amount, newPot } = data;
      console.log("Pot changed");
      setPot(newPot);
    } else if (data.actionType === 8){
      setCommunityCards([]);
      setPrivateCards([]);
      setPot(0);
      setBestHand("");
      setIsGrayscale(false);
    } else if (data.actionType === 6){
      setCommunityCards([]);
      setPrivateCards([]);
      setPot(0);
      setBestHand("");
    } else if (data.actionType === 4){
      const playerId = sessionStorage.getItem("playerId");

      if (data.playerId === playerId) setIsGrayscale(true);
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

      {bestHand && (
        <div className="best-hand-announcement">{bestHand}</div>
      )}


      <div className="cards-container">
        {communityCards.map((card, index) => (
          <div
            key={index}
            className="card public-card"
            style={{ animationDelay: `${index * 0.2}s` }}
          >
            <img
              src={`/images/suits/${Suit[card.suit]}_${Rank[card.rank]}.png`}
              alt={`${Rank[card.rank]} of ${Suit[card.suit]}`}
              className="card-image"
            />
          </div>
        ))}
      </div>

      <div className="private-cards-container">
        {privateCards.map((card, index) => (
          <div
            key={index}
            className={`card-private-card ${
              index === 0
                ? "private-card-first"
                : index === 1
                ? "private-card-second"
                : ""
            }`}
          >
            <img
              src={`/images/suits/${Suit[card.suit]}_${Rank[card.rank]}.png`}
              alt={`${Rank[card.rank]} of ${Suit[card.suit]}`}
              className="card-image"
              style={{ filter: isGrayscale ? "grayscale(100%)" : "none" }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default WebSocketComponentDealer;
