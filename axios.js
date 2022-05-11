import axios from "axios"
const instance = axios.create({
  baseURL: "https://ska-pfe-server.herokuapp.com",
  // baseURL: "http://localhost:8001",
})
export default instance
