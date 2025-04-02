import axios from "axios";

// const instance = axios.create({
//   baseURL: 'http://localhost:5051/'
// })

const instance = axios.create({
  baseURL: `${window.location.origin}`, // например, https://example.com/api
});

instance.interceptors.request.use((config) => {
  config.headers.Authorization = localStorage.getItem('tvPlanToken');
  return config;
})

export default instance;