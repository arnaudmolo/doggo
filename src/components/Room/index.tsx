import React, { useReducer, useEffect, useMemo, useState, useCallback } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import io from 'socket.io-client';
import axios from 'axios';
import Player from '../../models/Player';
import Map from '../Map';
import { usePlayer } from '../../AuthProvider';
import Deck from '../Deck';
import Card from '../../models/Card';
import Board from '../Board';

const BASE_URL = `http://${window.location.hostname}:1337`;
const useSocket = (url) =>
  useMemo(() => io(url), [url])

type Room = {
  identifiant: String;
  players: Player[];
  gamemaster: Player;
  started: boolean;
  cards: {
    deck: Card[];
    cemetery: Card[];
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
  )
  
  useEffect(() => {
    console.log('tu dois pas voir trop ce message')
    socket.on('connect', () => socket.emit('room', params.id));
    socket.on('message', (message) => {
      const json = JSON.parse(message)
      console.log(json.payload.cards = JSON.parse(json.payload.cards))
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

  return (
    <React.Fragment>
      <header className="App-header">
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
        {state.room && <Board players={state.room.players} />}
      </div>
    </React.Fragment>
  );
}

export default Room;

/* <div className="map-container">
<Map lines={7} cols={6} />
</div> */