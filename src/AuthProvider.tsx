import React, { useContext, useReducer, useEffect, createContext } from "react";
import axios from 'axios';
import SocketProvider from './SocketProvider';

import Player from './models/Player';

const BASE_URL = `http://${window.location.hostname}:1337`;

export const Context = createContext<any>(null);

type PlayerState = {
  player?: Player;
  loading: boolean;
}

export const usePlayer: () => PlayerState = () => useContext(Context);

const Component = ({children}) => {
  const [playerState, dispatch] = useReducer<(state: PlayerState, action: any) => PlayerState>(
    (state, action) => {
      switch (action.type) {
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
  }, [])
  return (
    <Context.Provider value={playerState}>
      {children}
    </Context.Provider>
  )
}

export default ({children}) => (
  <SocketProvider>
    <Component>
      {children}
    </Component>
  </SocketProvider>
)