import React, { useCallback } from 'react';
import CardType from '../../models/Card';
import './styles.css';
import back from './dos.png'

type Props = {
  card: CardType;
  hidden?: boolean;
  onClick?: (Card) => any;
}

export default ({onClick, card, hidden}: Props) => {
  const onCardClick = useCallback(() => onClick && onClick(card), [onClick, card]);
  if (hidden) {
    return (
      <div className="card hidden-card" onClick={onCardClick}>
        <img className="hidden-card__img" alt="Back of a card" src={back} />
      </div>
    );
  } else {
    // console.log('card', card);
    return (
      <div className="card visible-card" onClick={onCardClick}>
        <p>{card.value} {card.family}</p>
      </div>
    );
  }
};
