import React from 'react';
import CardType from '../../models/Card';

import './styles.css';
import Card from '../Card';
import take from 'ramda/src/take';

const Cemetery: React.SFC<{
  cards: CardType[];
}> = props => {
  console.log(props.cards)
  return (
    <div
      className="cemetery-container"
    >
      {take(5, props.cards).map(card =>
        <div ref={console.log} key={card.id} className="cemetry--card__container">
          <Card card={card} />
        </div>
      )}
    </div>
  );
};

export default Cemetery;
