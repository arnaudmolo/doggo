import React, { useCallback } from 'react';
import CardType from '../../models/Card';
import './styles.css';
import back from './dos.png'

type Props = {
  card: CardType;
  hidden?: boolean;
  onClick?: (Card) => any;
}

// -35
// -225
// -415

const families = ['Pikes', 'Hearts', 'Clovers', 'Tiles', 'black', 'red'];

export default ({onClick, card, hidden}: Props) => {
  const onCardClick = useCallback(() => onClick && onClick(card), [onClick, card]);
  if (hidden) {
    return (
      <div className="card hidden-card" onClick={onCardClick}>
        <img className="hidden-card__img" alt="Back of a card" src={back} />
      </div>
    );
  } else {

    let x = 35 + (card.value - 1) * 191.5;
    let y = 35 + families.indexOf(card.family) * 262;

    if (card.family === 'red') {
      x = 225;
      y = 1090;
    } else if (card.family === 'black') {
      x = 35;
      y = 1090;
    }

    return (
      <div style={{backgroundPosition: `-${x}px -${y}px`}} className={`card visible-card card__${card.family} `} onClick={onCardClick} />
    );
  }
};
