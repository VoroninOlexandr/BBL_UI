
export const createDeck = () => {
    const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
    const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    const deck = [];
  
    for (let suit of suits) {
      for (let rank of ranks) {
        deck.push({ rank, suit });
      }
    }
  
    return deck;
  };
  