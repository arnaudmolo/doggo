import React, { createContext, useContext, useMemo } from "react";
import io from 'socket.io-client';

const BASE_URL = process.env.NODE_ENV === 'production' ? '//api.doggo.molo.cool/api/' : `http://${window.location.hostname}:1337/`;

export const Context = createContext(null);

export const useSocket = () => useContext(Context);

export default ({children}) => {
  const socket = useMemo(() => io(BASE_URL), []);
  return (
    <Context.Provider value={socket}>
      {children}
    </Context.Provider>
  )
};
