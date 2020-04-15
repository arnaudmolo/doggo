import React, { useContext, useReducer, useEffect, createContext, useCallback, useMemo } from "react";
import axios from './AxiosProvider';
import SocketProvider, { useSocket } from './SocketProvider';

import Player from './models/Player';

export const Context = createContext<any>(null);

type PlayerState = {
  player?: Player;
  loading: boolean;
};

interface PlayerHook extends PlayerState {
  changeName: (name: string) => Promise<any>;
  dispatch: (action: {
    type: string;
    payload: any;
  }) => any;
}

export const usePlayer: () => PlayerHook = () => useContext(Context);

const initialState = {
  player: undefined,
  loading: true,
};

const reducer: (state: PlayerState, action: any) => PlayerState = (state, action) => {
  switch (action.type) {
    case 'ROOM_UPDATE':
      if (!state.player) {
        return state;
      }
      const found = action.payload.players.find(player => state.player.id === player.id)
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
};

const Component = ({children}) => {
  const socket = useSocket();
  const [playerState, dispatch] = useReducer<(state: PlayerState, action: any) => PlayerState>(
    reducer,
    initialState,
  );
  const playerId = playerState.player && playerState.player.id;

  useEffect(() => {
    axios.get(`/players/me`, {withCredentials: true})
      .then((response) =>
        dispatch({
          type: 'USER_LOADED',
          payload: response.data,
        })
      )
  }, []);
  useEffect(() => {
    if (playerId) {
      socket.emit('player', playerId);
    }
  }, [playerId, socket]);

  const changeName = useCallback(async (name) => {
    dispatch('USER_LOAD');
    const response = await axios.put(`/players/${playerId}`, {name}, {withCredentials: true});
    dispatch({
      type: 'USER_LOADED',
      payload: response.data
    });
  }, [playerId]);
  const value = useMemo(() =>
    ({...playerState, changeName, dispatch})
  , [playerState, changeName]);

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
