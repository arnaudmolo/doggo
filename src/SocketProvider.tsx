import React, { createContext, useContext } from "react";
import io from 'socket.io-client';

const BASE_URL = `http://${window.location.hostname}:1337`;

export const Context = createContext(null);

export const useSocket = () => useContext(Context);

export default ({children}) => (
  <Context.Provider value={io(BASE_URL)}>
    {children}
  </Context.Provider>
)
