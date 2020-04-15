import React, { useReducer, useEffect, useMemo, useState, useCallback } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import io from 'socket.io-client';
import axios from 'axios';
import Player from '../../models/Player';
import { usePlayer } from '../../AuthProvider';
import Deck from '../Deck';
import CardType from '../../models/Card';
import Board from '../Board';
import Hand from '../Hand';

import './styles.css';

const BASE_URL = `http://${window.location.hostname}:1337`;
const useSocket = (url) => useMemo(() => io(url), [url])

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

  const {player, loading, changeName} = usePlayer();
  const params = useParams();
  const socket = useSocket(BASE_URL);
  const history = useHistory();

  const [state, dispatch] = useReducer<(state: State, action: any) => State >(
    (state, action) => {
      console.log('reducer', action);
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
    const response = await axios.put(
      `${BASE_URL}/rooms/${room.id}`,
      newRoom,
      {withCredentials: true}
    );
  }, [room]);
  
  useEffect(() => {
    console.log('tu dois pas voir trop ce message')
    socket.emit('room', params.id);
    socket.on('message', (message) => {
      const json = JSON.parse(message);
      try {
        json.payload.cards = JSON.parse(json.payload.cards);
        json.payload.pawns = JSON.parse(json.payload.pawns);
      } catch (error) {
        console.log('quoi jsuis ivre');
        console.error(error);
      }
      console.log('message', json);
      return dispatch(json);
    })
    axios.get(`${BASE_URL}/rooms/join/${params.id}`, {withCredentials: true})
      .then((response: any) => dispatch({
        type: 'ROOM_UPDATE',
        payload: response.data,
      })).catch(reason => {
        console.error(reason);
        console.log('reason', reason)
        history.push('/');
      })
  }, [params.id, socket, history]);

  const [editName, setEditName] = useState(false);
  const onNameDoubleClick = useCallback(() => setEditName(state => !state), []);
  const validateOnEnter = useCallback(async event => {
    if (event.key === 'Enter') {
      await changeName(event.target.value);
      setEditName(false);
    }
  }, [changeName]);

  const drawCards = useCallback(async () => {
    const response = await axios.get(`${BASE_URL}/rooms/draw/${state.room.id}/6`);
    console.log(response);
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
        {player && player.cards && <Hand cards={player.cards} />}
      </div>
    </React.Fragment>
  );
}

export default Room;

/* <div className="map-container">
<Map lines={7} cols={6} />
</div> */