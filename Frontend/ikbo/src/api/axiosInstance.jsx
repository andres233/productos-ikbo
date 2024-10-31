import axios from 'axios';

// Crear una instancia de Axios
const axiosInstance = axios.create();

// Agregar un interceptor para agregar el token a las cabeceras
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Agregar un interceptor para manejar las respuestas
axiosInstance.interceptors.response.use(
  (response) => {
    return response; // Devuelve la respuesta si es exitosa
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Aquí puedes hacer el logout si hay un error 401
      //localStorage.removeItem('user');
      //localStorage.removeItem('token');
      
      // Llama a la función de logout en tu contexto (si tienes acceso a ella)
      if (typeof window.logout === 'function') {
        window.logout();
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;