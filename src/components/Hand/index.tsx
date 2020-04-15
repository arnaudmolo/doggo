import React, { useCallback } from 'react';
import CardType from '../../models/Card';
import Card from '../Card';

const Hand: React.SFC<{
  cards: CardType[];
  onCardClick?: (card: CardType) => any;
}> = ({cards, onCardClick}) => {
  const onClick = useCallback((card: CardType) => {
    console.log(card);
    onCardClick && onCardClick(card)
  }, [onCardClick]);
  return (
    <div className="hand-container">
      <ul>
        {cards.map(card => (
          <li key={`${card.value}-${card.family}-${card.id}`}>
            <Card card={ card } onClick={onClick} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Hand;
