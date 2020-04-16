import React, { useCallback, useState } from 'react';
import Popup from 'reactjs-popup';
import CardType from '../../models/Card';
import Card from '../Card';
import './styles.css';
import Player from '../../models/Player';
import AxiosProvider from '../../AxiosProvider';
import { usePlayer } from '../../AuthProvider';

const Hand: React.SFC<{
  onCardClick?: (card: CardType) => any;
  players: Player[];
  onDrawCard?: (card: CardType) => any;
}> = ({onCardClick, players, onDrawCard}) => {

  const [selectedCard, setSelectedCcard] = useState<CardType>(null);

  const onClick = useCallback((card: CardType) => {
    setSelectedCcard(card);
    onCardClick && onCardClick(card);
  }, [onCardClick]);

  const {player} = usePlayer();

  const onGiftClick = useCallback(async (teamate, selectedCard) => {
    AxiosProvider.put(`/players/${teamate.id}`, {
      cards: {
        ...teamate.cards,
        gift: {
          card: selectedCard,
          from: player,
        },
      }
    });
    AxiosProvider.put(`/players/${player.id}`, {
      cards: {
        ...player.cards,
        hand: player.cards.hand.filter(card => card !== selectedCard)
      }
    });
  }, [player]);

  const onDiscardGift = useCallback(() => {
    const teamate = players.find(p => p.id === player.cards.gift.from.id);
    AxiosProvider.put(`/players/${player.id}`, {
      cards: {
        ...player.cards,
        gift: null,
      }
    });
    AxiosProvider.put(`/players/${teamate.id}`, {
      cards: {
        ...teamate.cards,
        hand: [...teamate.cards.hand, player.cards.gift.card]
      }
    });
  }, [player.cards, player.id, players]);

  const onAcceptGift = useCallback(() => {
    AxiosProvider.put(`/players/${player.id}`, {
      cards: {
        hand: [...player.cards.hand, player.cards.gift.card],
        gift: null,
      }
    });
  }, [player.id, player.cards]);

  return (
    <div className="hand-container">
      {player.cards.hand.map(card => (
        <div
          key={`${card.value}-${card.family}-${card.id}`}
          className="hand-container__card-container"
        >
          {card === selectedCard && (
            <div className="hand-container__choice-container">
              <div onClick={() => onDrawCard(selectedCard)} className="choice-container__button__play choice-container__button">
                <p>Play</p>
              </div>
              <Popup
                trigger={
                  <div className="choice-container__button__give choice-container__button">
                    <p>Give</p>
                  </div>
                }
                position="top center"
                on="hover"
              >
                <ul>
                  {players.map((player) => <button key={player.id} onClick={ () => onGiftClick(player, selectedCard) }>{player.name}</button>)}
                </ul>
              </Popup>
            </div>
          )}
          <Card card={card} onClick={onClick} />
        </div>
      ))}
      {player.cards.gift && (
        <div className="hand-container__card-container hand-container__card-container__gift">
          <div className="hand-container__choice-container">
            <div onClick={onAcceptGift} className="choice-container__button__play choice-container__button">
              <p>Accept</p>
            </div>
            <div onClick={onDiscardGift} className="choice-container__button__give choice-container__button">
              <p>Discard Gift</p>
            </div>
          </div>
          <Card card={ player.cards.gift.card } />
        </div>
      )}
    </div>
  );
}

export default Hand;
