import Axios from 'axios';

export default Axios.create({
  baseURL: `http://${window.location.hostname}:1337`,
  withCredentials: true,
});
