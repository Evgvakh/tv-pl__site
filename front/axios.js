import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.MODE === 'production'
       ? 'https://neurostudio-tvt.site' :
         'http://localhost:5051/'
})
// const baseUrl = import.meta.env.MODE === 'production'
//   ? 'https://neurostudio-tvt.site'
//   : window.location.origin;

// const instance = axios.create({
//   baseURL: baseUrl, 
// });

instance.interceptors.request.use((config) => {
  config.headers.Authorization = localStorage.getItem('tvPlanToken');
  return config;
})

export default instance;