// COULD USE SINGLETON DESIGN PATTERN

import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:4000/api",
  // You can include additional configurations here
});

export default instance;
