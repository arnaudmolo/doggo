import React, { useState, useCallback } from 'react';
import { take } from 'ramda';
import CardType from '../../models/Card';

import Card from '../Card';
import './styles.css';

const Drawer: React.SFC<{
  onDraw?: (nbCards: number) => any
}> = ({onDraw}) => {
  const [nbCards, setNbCards] = useState(6);
  const onClick = useCallback(() => {
    onDraw && onDraw(nbCards);
  }, [onDraw, nbCards]);
  return (
    <div>
      <input min="1" max="6" onChange={event => setNbCards(+event.target.value)} type={'number'} value={nbCards}></input>
      <button onClick={onClick}>Draw</button>
    </div>
  );
}

const Deck: React.SFC<{
  cards: CardType[];
  onDraw?: (nbCards: number) => any
  visible?: boolean;
}> = ({cards, onDraw, visible}) => {
  return (
    <div>
      <p>il y à { cards.length } cartes</p>
      <Drawer onDraw={onDraw} />
      {visible && <ul className="deck--deck__container">
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
      </ul>}
    </div>
  );
};

export default React.memo(Deck);
