import axios from "axios";
const instance = axios.create({
  baseURL: "https://todoapp-g8k3.onrender.com/api",
});
export default instance;
