import React from 'react';
import { take } from 'ramda';
import CardType from '../../models/Card';

import Card from '../Card';
import './styles.css';

const Deck: React.SFC<{
  cards: CardType[];
  onDraw?: (card: CardType) => any;
}> = ({cards, onDraw}) => {
  return (
    <div>
      il y à { cards.length } cartes
      <ul className="deck--deck__container">
        {
          take(5, cards).map((card) =>
            <li
              key={`${card.family}-${card.value}`}
              className="deck--card__container"
            >
              <Card card={card} hidden />
            </li>
          )
        }
      </ul>
    </div>
  );
};

export default React.memo(Deck);
