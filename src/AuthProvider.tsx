import React, { useContext, useReducer, useEffect, createContext, useCallback, useMemo } from "react";
import axios from 'axios';
import SocketProvider, { useSocket } from './SocketProvider';

import Player from './models/Player';

const BASE_URL = `http://${window.location.hostname}:1337`;

export const Context = createContext<any>(null);

type PlayerState = {
  player?: Player;
  loading: boolean;
};

interface PlayerHook extends PlayerState {
  changeName: (name: string) => Promise<any>;
}

export const usePlayer: () => PlayerHook = () => useContext(Context);

const Component = ({children}) => {
  const socket = useSocket();
  const [playerState, dispatch] = useReducer<(state: PlayerState, action: any) => PlayerState>(
    (state, action) => {
      console.log('recois bien ?', action);
      switch (action.type) {
        case 'ROOM_UPDATE':
          const found = action.payload.players.find(player => state.player.id === player.id)
          console.log('on parle de toi', found);
          return {
            ...state,
            player: found,
          }
        case 'USER_LOAD':
          return {
            ...state,
            loading: true
          }
        case 'USER_LOADED':
          return {
            ...state,
            player: action.payload,
            loading: false
          };
        default:
          return state;
      }
    },
    {
      player: undefined,
      loading: true,
    }
  );
  useEffect(() => {
    axios.get(`${BASE_URL}/players/me`, {withCredentials: true})
      .then((response) =>
        dispatch({
          type: 'USER_LOADED',
          payload: response.data,
        })
      )
  }, []);
  const playerId = playerState.player && playerState.player.id;
  const changeName = useCallback(async (name) => {
    dispatch('USER_LOAD');
    const response = await axios.put(`${BASE_URL}/players/${playerId}`, {name}, {withCredentials: true});
    dispatch({
      type: 'USER_LOADED',
      payload: response.data
    });
  }, [playerId]);
  const value = useMemo(() => ({ ...playerState, changeName }), [playerState, changeName]);
  useEffect(() => {
    if (playerId) {
      socket.emit('player', playerId);
    }
  }, [playerId, socket]);
  useEffect(() => {
    socket.on('message', (message) => {
      console.log('ha merde');
      dispatch(JSON.stringify(message));
    })
  }, [playerId, socket])

  return (
    <Context.Provider value={value}>
      {children}
    </Context.Provider>
  )
};

export default ({children}) => (
  <SocketProvider>
    <Component>
      {children}
    </Component>
  </SocketProvider>
);
