import React from 'react';
import { useHistory } from 'react-router-dom';
import AxiosProvider from '../../AxiosProvider';

const CreateRoom: React.SFC<{}> = props => {
  const history = useHistory();
  const onClick = React.useCallback(async () => {
    try {
      const response = await AxiosProvider.post('/rooms/',);
      const data = response.data;
      history.push(`/room/${data.identifiant}`);
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
