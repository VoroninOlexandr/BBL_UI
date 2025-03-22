import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const cardImages = {
  "2c": "/src/Components/suits/2c.png",
  "2d": "/src/Components/suits/2d.png",
  "2h": "/src/Components/suits/2h.png",
  "2s": "/src/Components/suits/2s.png",
  "3c": "/src/Components/suits/3c.png",
  "3d": "/src/Components/suits/3d.png",
  "3c": "/src/Components/suits/3c.png",
};

const deck = Object.keys(cardImages);

const shuffleDeck = (deck) => {
  return [...deck].sort(() => Math.random() - 0.5);
};

const dealCards = (playersCount) => {
  const shuffledDeck = shuffleDeck(deck);
  const hands = {};
  for (let i = 0; i < playersCount; i++) {
    hands[i] = [shuffledDeck.pop(), shuffledDeck.pop()];
  }
  return hands;
};

export default function PokerTable({ players = 4 }) {
  const [hands, setHands] = useState({});

  useEffect(() => {
    setHands(dealCards(players));
  }, [players]);

  return (
    <div className="flex flex-col items-center p-4 bg-green-800 min-h-screen">
      <h1 className="text-white text-2xl mb-4">Poker Game</h1>
      <div className="grid grid-cols-2 gap-4">
        {Object.entries(hands).map(([player, cards]) => (
          <div key={player} className="flex flex-col items-center">
            <h2 className="text-white">Гравець {+player + 1}</h2>
            <div className="flex gap-2">
              {cards.map((card, index) => (
                <motion.img
                  key={index}
                  src={cardImages[card]}
                  alt={card}
                  className="w-20 h-32 rounded-lg shadow-lg"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.3 }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
