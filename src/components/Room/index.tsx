import React, { useReducer, useEffect, useMemo, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import axios from 'axios';
import Player from '../../models/Player';
import Map from '../Map';
import { usePlayer } from '../../AuthProvider';
import { range } from 'ramda';

const BASE_URL = `http://${window.location.hostname}:1337`;
const useSocket = (url) =>
  useMemo(() => io(url), [url])

type Room = {
  identifiant: String;
  players: Player[];
  gamemaster: Player;
}

type State = {
  room: Room;
}

const Room: React.SFC<{}> = props => {

  const {player, loading, changeName} = usePlayer();
  const params = useParams();
  const socket = useSocket(BASE_URL);
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
    socket.on('message', (message) => dispatch(JSON.parse(message)))
    axios.get(`${BASE_URL}/rooms/join/${params.id}`, {withCredentials: true})
      .then((response) => dispatch({
        type: 'ROOM_UPDATE',
        payload: response.data,
      }))
  }, [params.id, socket]);

  const [editName, setEditName] = useState(false);
  const onNameDoubleClick = useCallback(event => setEditName(state => !state), []);

  const validateOnEnter = useCallback(async event => {
    if (event.key === 'Enter') {
      await changeName(event.target.value);
      setEditName(false)
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
        {(player && state.room && state.room.gamemaster && player.id === state.room.gamemaster.id)
          ? <p>You are the game master</p>
          : <p>You are waiting for the game master { state.room && state.room.gamemaster && `(${state.room.gamemaster.name})`} to launch the party</p>}
        {state.room && (
          <ul>
            {state.room.players.map(player => (
              <li key={player.id}>
                <p><span>{player.name}{range(0, 4).map(heart => heart < player.life ? '❤️' : '🖤')}</span></p>
              </li>
            ))}
          </ul>
        )}
      </header>

      <div className="map-container">
        <Map lines={7} cols={6} />
      </div>
    </React.Fragment>
  );
}

export default Room;

/* <div className="map-container">
<Map lines={7} cols={6} />
</div> */