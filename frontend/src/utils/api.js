import axios from 'axios';

// Erstelle eine Axios-Instanz
const api = axios.create({
  baseURL: 'http://localhost:8080/api', // Basis-URL für deine Backend-API
});

export default api; // Stelle sicher, dass die Instanz als Default-Export exportiert wird
