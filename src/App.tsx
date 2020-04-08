import React, { useReducer } from 'react';
import { List } from "immutable";
import './App.css';
import Map from './components/Map';
import Deck from './components/Deck';
import Card from './models/Card';

const weaponsDeck: List<Card> = List([
  new Card({
    name: 'Tenue de camouflage',
  }),
  new Card({
    name: 'Poële'
  })
])

function App() {
  const [state, dispatch] = useReducer(
    (state: {
      weapons: List<Card>
    }, action: any) => {
      if (action.type === 'REMOVE_WEAPON') {
        return {
          ...state,
          weapons: state.weapons.remove(state.weapons.indexOf(action.payload))
        }
      }
      return state;
    },
    {
      weapons: weaponsDeck
    }
  );

  const drawWeapon = React.useCallback((card: Card) => {
    dispatch({
      type: 'REMOVE_WEAPON',
      payload: card
    })
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <Deck
          cards={ state.weapons }
          onDraw={ drawWeapon }
        />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
      </header>
      <div className="map-container">
        <Map lines={7} cols={6} />
      </div>
    </div>
  );
}

export default App;
