import React, { useReducer, useEffect, useMemo, useState, useCallback } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import axios from '../../AxiosProvider';
import Player from '../../models/Player';
import { usePlayer } from '../../AuthProvider';
import Deck from '../Deck';
import CardType from '../../models/Card';
import Board from '../Board';
import Hand from '../Hand';

import './styles.css';
import { useSocket } from '../../SocketProvider';
import Cemetery from '../Cemetery';

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

  const [{room}, dispatch] = useReducer<(state: State, action: any) => State >(
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
      type: 'UPDATE_ROOM',
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

  const drawCards = useCallback(async (nb) => {
    const response = await axios.get(`/rooms/draw/${room.id}/${nb}`);
    // console.log(response);
  }, [room]);

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

  return (
    <React.Fragment>
      <header className="App-header">
        {room && <Cemetery cards={room.cards.cemetery} />}
        <p>hello {
          player &&
            (editName ? <input disabled={ loading } onKeyDown={validateOnEnter} defaultValue={player.name} /> : <span onDoubleClick={onNameDoubleClick}>{player && player.name}</span>)
          }
        </p>
        {room && <Deck
          cards={ room.cards.deck }
          onDraw={ drawCards }
        />}
        {room && (
          <ul>
            {room.players.map(player => (
              <li key={player.id}>
                <p><span>{player.name}</span></p>
              </li>
            ))}
          </ul>
        )}
      </header>
      <div className="map-container">
        {room && (
          <div className="room--board-container">
            <Board pawns={room.pawns.value} setPawns={updatePawns} />
          </div>
        )}
      </div>
      <div className="room__hand-container">
        {room && player && player.cards && (
          <Hand players={room.players.filter(p => p.id !== player.id)} onDrawCard={onPlayCard} />
        )}
      </div>
    </React.Fragment>
  );
}

export default Room;
