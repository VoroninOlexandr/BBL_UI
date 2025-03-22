import React, { useState, useEffect } from "react";
import "./WebSocketComponentDealer.css";

const Suit = {
  CLUBS: "clubs",
  DIAMONDS: "diamonds",
  HEARTS: "hearts",
  SPADES: "spades",
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
  const [cards, setCards] = useState([]);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/game/card");
        const data = await response.json();

        if (data.actionType === 2) {
          handleCardData(data);
        }
      } catch (error) {
        console.error("Error fetching cards:", error);
      }
    };

    fetchCards();
    const intervalId = setInterval(fetchCards, 5000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const handleCardData = (data) => {
    const { ordinalPBS } = data;

    const updatedCards = ordinalPBS.map((card) => {
      const suit = Suit[card.suit]; // Виправлено
      const rank = Rank[card.rank]; // Виправлено
      const imagePath = `/src/Components/Assets/suits/${suit}_${rank}.png`; // Виправлено

      return { ...card, imagePath };
    });

    setCards(updatedCards);
  };

  return (
    <div className="game-table-container">
      <div className="cards-container">
        {cards.length === 0 ? (
          <p>No cards to display</p>
        ) : (
          cards.map((card, index) => (
            <div
              key={index}
              className="card"
              style={{ top: `${index * 20}px`, left: `${index * 30}px` }}
            >
              <img
                src={card.imagePath}
                alt={`${Rank[card.rank]} of ${Suit[card.suit]}`}
                className="card-image"
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default WebSocketComponentDealer;
