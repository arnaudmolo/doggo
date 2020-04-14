import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom';

import './App.css';
import Map from './components/Map';
import CreateRoom from './components/CreateRoom';
import Room from './components/Room';
import AuthProvider, { usePlayer } from './AuthProvider';

const Home = () => {

  const playerState = usePlayer();

  console.log(playerState);

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

function App() {
  return (
    <div className="App">
      <AuthProvider>
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
      </AuthProvider>
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