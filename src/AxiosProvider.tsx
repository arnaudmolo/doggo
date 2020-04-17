import Axios from 'axios';

export default Axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? '//api.doggo.molo.cool' : `http://${window.location.hostname}:1337/`,
  withCredentials: true,
});
