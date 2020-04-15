import React, { useReducer, useEffect, useMemo, useState, useCallback } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import io from 'socket.io-client';
import axios from '../../AxiosProvider';
import Player from '../../models/Player';
import { usePlayer } from '../../AuthProvider';
import Deck from '../Deck';
import CardType from '../../models/Card';
import Board from '../Board';
import Hand from '../Hand';

import './styles.css';
import { useSocket } from '../../SocketProvider';

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

  const [state, dispatch] = useReducer<(state: State, action: any) => State >(
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

  const { room } = state;

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

  const drawCards = useCallback(async () => {
    const response = await axios.get(`/rooms/draw/${state.room.id}/2`);
    // console.log(response);
  }, [state.room]);

  return (
    <React.Fragment>
      <header className="App-header">
        <button onClick={drawCards}>Tirer les cartes</button>
        <p>hello {
          player &&
            (editName ? <input disabled={ loading } onKeyDown={validateOnEnter} defaultValue={player.name} /> : <span onDoubleClick={onNameDoubleClick}>{player && player.name}</span>)
          }
        </p>
        {state.room && <Deck
          cards={ state.room.cards.deck }
        />}
        {state.room && (
          <ul>
            {state.room.players.map(player => (
              <li key={player.id}>
                <p><span>{player.name}</span></p>
              </li>
            ))}
          </ul>
        )}
      </header>
      <div className="map-container">
        {state.room && <Board pawns={state.room.pawns.value} setPawns={updatePawns} />}
      </div>
      <div className="room__hand-container">
        {state.room && player && player.cards && (
          <Hand players={state.room.players.filter(p => p.id !== player.id)} />
        )}
      </div>
    </React.Fragment>
  );
}

export default Room;
