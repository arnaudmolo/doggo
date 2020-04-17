import React, { useReducer, useEffect, useState, useCallback } from 'react';
import { useParams, useHistory } from 'react-router-dom';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import axios from '../../AxiosProvider';
import Player from '../../models/Player';
import { usePlayer } from '../../AuthProvider';
import Deck from '../Deck';
import CardType from '../../models/Card';
import Board from '../Board';
import Hand from '../Hand';
import Popup from 'reactjs-popup';

import './styles.css';
import { useSocket } from '../../SocketProvider';
import Cemetery from '../Cemetery';
import AxiosProvider from '../../AxiosProvider';

const COLORS = [
  "black",
  "blue",
  "green",
  "white",
  "yellow",
  "red",
];

type Room = {
  id: number;
  identifiant: String;
  players: Player[];
  gamemaster: Player;
  started: boolean;
  cards: {
    deck: CardType[];
    cemetery: CardType[];
  },
  pawns: {
    value: {
      position: number,
      color: string
    }[]
  }
}

type State = {
  room: Room;
}

const Room: React.SFC<{}> = props => {

  const {player, loading, changeName, dispatch: dispatchUser} = usePlayer();
  const params = useParams();
  const socket = useSocket();
  const history = useHistory();
  const playerId = player && player.id;

  const [{room}, dispatch] = useReducer<(state: State, action: any) => State>(
    (state, action) => {
      switch (action.type) {
        case 'ROOM_UPDATE':
          return {
            ...state,
            room: action.payload
          }
        default:
          return state;
      }
    },
    {
      room: undefined,
    }
  );

  const updatePawns = useCallback(async (pawns: any[]) => {
    const newRoom = {
      ...room,
      pawns: {
        value: pawns
      }
    };
    dispatch({
      type: 'ROOM_UPDATE',
      payload: newRoom
    });
    await axios.put(
      `/rooms/${room.id}`,
      newRoom
    );
  }, [room]);
  
  useEffect(() => {
    socket.emit('room', params.id);
    socket.on('message', (message) => {
      const json = JSON.parse(message);
      try {
        json.payload.cards = JSON.parse(json.payload.cards);
        json.payload.pawns = JSON.parse(json.payload.pawns);
      } catch (error) {
        console.log('quoi jsuis ivre');
        console.log(json.payload)
      }
      console.log('recois un message de socket depuis la room', json);
      dispatchUser(json);
      return dispatch(json);
    });
    axios.get(`/rooms/join/${params.id}`)
      .then((response: any) => dispatch({
        type: 'ROOM_UPDATE',
        payload: response.data,
      })).catch(reason => {
        console.error(reason);
        console.log('reason', reason);
        history.push('/');
      });
  }, [params.id, socket, history, dispatchUser]);

  const [editName, setEditName] = useState(false);
  const onNameDoubleClick = useCallback(() => setEditName(state => !state), []);
  const validateOnEnter = useCallback(async event => {
    if (event.key === 'Enter') {
      await changeName(event.target.value);
      setEditName(false);
    }
  }, [changeName]);

  const drawCards = useCallback(async (nb) =>
    axios.get(`/rooms/draw/${room.id}/${nb}`)
  , [room]);

  const onPlayCard = useCallback((card: CardType) => {
    axios.put(`/rooms/${room.id}`, {
      cards: {
        deck: room.cards.deck,
        cemetery: [...room.cards.cemetery, card]
      }
    });
    axios.put(`/players/${player.id}`, {
      cards: {
        ...player.cards,
        hand: player.cards.hand.filter(c => c.id !== card.id),
      }
    });
  }, [room, player]);

  const onColorClick = useCallback((color) => {
    AxiosProvider.put(`/players/${playerId}`, {
      color: color
    });
  }, [playerId]);

  const takenColors = room ? room.players.reduce(
    (colors, player) => player.color ? [...colors, player.color] : colors, []
  ) : [];

  return (
    <div className="room__container">
      <div className="room__main">
        {room && (
          <Board pawns={room.pawns.value} setPawns={updatePawns} />
        )}
      </div>
      <aside className="room__aside">
        {room && <Cemetery cards={room.cards.cemetery} />}
        <div>hello {
          player &&
            (editName ?
              <input
                disabled={ loading }
                onKeyDown={validateOnEnter}
                defaultValue={player.name}
              /> :
              <Popup
                trigger={<span onDoubleClick={onNameDoubleClick}>{player && player.name}</span>}
              >
                <div className="color-picker color-picker__container ">
                  {COLORS.map(color => {
                    const colorTaken = takenColors.includes(color);
                    return (
                      <div
                        key={color}
                        onClick={() => !colorTaken && onColorClick(color)}
                        className={`color-picker__color color-picker__color__${color} ${colorTaken && 'color-picker__color__disable'}`}
                      />
                    );
                  })}
                </div>
              </Popup>
            )
          }
        </div>
        {room && <Deck
          cards={ room.cards.deck }
          onDraw={ drawCards }
        />}
        {room && (
          <div className={'player-liste'}>
            <List dense>
              {room.players.sort((a, b) => b.cards.hand.length - a.cards.hand.length).map(player => (
                <ListItem key={player.id} className={`player-list__player player-list__player__${player.color}`}>
                  <ListItemText
                    primary={player.name}
                    secondary={`${player.cards.hand.length} cards`}
                  />
                </ListItem>
              ))}
            </List>
          </div>
        )}
      </aside>
      <footer className="room__footer room__hand-container">
        {room && player && player.cards && (
          <Hand players={room.players.filter(p => p.id !== player.id)} onDrawCard={onPlayCard} />
        )}
      </footer>
    </div>
  );
}

export default Room;
