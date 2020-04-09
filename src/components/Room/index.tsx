import React, { useReducer, useEffect, useMemo, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import axios from 'axios';
import Player from '../../models/Player';
import Map from '../Map';

const BASE_URL = 'http://127.0.0.1:1337';
const useSocket = (url) =>
  useMemo(() => io(url), [url])

type Room = {
  identifiant: String;
  players: Player[];
  gamemaster: Player;
}

type State = {
  player?: Player;
  room: Room;
}

const Room: React.SFC<{}> = props => {

  const params = useParams();
  const socket = useSocket(BASE_URL);
  const [state, dispatch] = useReducer<(state: State, action: any) => State >(
    (state, action) => {
      switch (action.type) {
        case 'USER_LOADED':
          return {
            ...state,
            player: action.payload
          };
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
      player: undefined,
      room: undefined,
    }
  )
  
  useEffect(() => {
    socket.on('connect', () => socket.emit('room', params.id));
    socket.on('message', (message) => dispatch(JSON.parse(message)))
    axios.get(`${BASE_URL}/rooms/join/${params.id}`, {withCredentials: true})
      .then((response) => dispatch({
        type: 'ROOM_UPDATE',
        payload: response.data,
      }))
    axios.get(`${BASE_URL}/players/me`, {withCredentials: true})
      .then((response) =>
        dispatch({
          type: 'USER_LOADED',
          payload: response.data,
        })
      )
  }, [params.id]);

  const [editName, setEditName] = useState(false);
  const onNameDoubleClick = useCallback(event => setEditName(state => !state), []);
  const playerId = state.player && state.player.id;
  const validateOnEnter = useCallback(async event => {
    console.log(event)
    if (event.key === 'Enter') {
      const response = await axios.put(`${BASE_URL}/players/${playerId}`, {name: event.target.value}, {withCredentials: true})
      dispatch({
        type: 'USER_LOADED',
        payload: response.data
      })
      setEditName(false)
    }
  }, [playerId]);

  return (
    <React.Fragment>
      <header className="App-header">
        <p>hello {
          state.player &&
            (editName ? <input onKeyDown={validateOnEnter} defaultValue={state.player.name} /> : <span onDoubleClick={onNameDoubleClick}>{state.player.name}</span>)
          }
        </p>
        {(state.player && state.room && state.player.id === state.room.gamemaster.id)
          ? <p>You are the game master</p>
          : <p>You are waiting for the game master { state.room && state.room.gamemaster && `(${state.room.gamemaster.name})`} to launch the party</p>}
        {state.room && (
          <ul>
            {state.room.players.map(player => (
              <li key={player.id}>{player.name}</li>
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