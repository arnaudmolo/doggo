import React from 'react';
import Card from '../../models/Card';
import { List } from 'immutable';

const Deck: React.SFC<{
  cards: List<Card>;
  onDraw: (card: Card) => any;
}> = ({cards, onDraw}) => {
  return (
    <div>
      il y à { cards.size }
      <button
        onClick={ React.useCallback(() => onDraw(cards.first()), [cards, onDraw]) }
      >Tirer une carte</button>
    </div>
  );
}

export default Deck;
