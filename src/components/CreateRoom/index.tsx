import React from 'react';
import { useHistory } from 'react-router-dom';

const CreateRoom: React.SFC<{}> = props => {
  const history = useHistory();
  const onClick = React.useCallback(async () => {
    try {
      const response = await fetch('//127.0.0.1:1337/rooms/', {
        method: 'POST',
        mode: 'cors'
      });
      const data = await response.json()
      history.push(`/room/${data.identifiant}`)
    } catch (error) {
      console.log(error)
    }
  }, [history])
  return (
    <div>
      <button onClick={ onClick }>Create a room</button>
    </div>
  );
};

export default CreateRoom;
