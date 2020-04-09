import React from 'react';
import { useHistory } from 'react-router-dom';

const CreateRoom: React.SFC<{}> = props => {
  const history = useHistory()
  const onClick = React.useCallback(async () => {
    try {
      const response = await fetch('//localhost:1337/rooms/', {
        method: 'POST',
        mode: 'cors'
      });
      const data = await response.json()
      history.push(`/room/${data.identifiant}`)
    } catch (error) {
      console.log(error)
    }
  }, [])
  console.log(history)
  return (
    <div>
      <button onClick={ onClick }>Create a room</button>
    </div>
  );
};

export default CreateRoom;
