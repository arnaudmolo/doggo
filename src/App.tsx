import React, { useReducer } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom';
import { List } from 'immutable';

import './App.css';
import Map from './components/Map';
import Card from './models/Card';
import CreateRoom from './components/CreateRoom';
import Room from './components/Room';

const Home = () => {
  return (
    <div>
      <Link to='/create'>Create a game</Link>
      <form>
        <input placeholder="Entrez le nom de la room" />
        <button>Join</button>
      </form>
    </div>
  );
}

const weaponsDeck: List<Card> = List([
  new Card({
    name: 'Tenue de camouflage',
  }),
  new Card({
    name: 'Poële'
  })
]);

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
      <Router>
        <Switch>
          <Route path='/room/:id'>
            <Room />
          </Route>
          <Route path='/'>
            <header className="App-header">
              <Route exact path='/'>
                <Home />
              </Route>
              <Route exact path='/create'>
                <CreateRoom />
              </Route>
            </header>
            <div className="map-container">
              <Map lines={7} cols={6} />
            </div>
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;

/* <Route exact path='/room/:id'>
<Deck
  cards={ state.weapons }
  onDraw={ drawWeapon }
/>
</Route> */