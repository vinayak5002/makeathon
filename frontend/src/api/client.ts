import axios from "axios";

const PORT = import.meta.env.VITE_PORT;

console.log("PORT: ", PORT);

export const apiClient = axios.create({
  baseURL: `http://localhost:${PORT}/api`,
});
