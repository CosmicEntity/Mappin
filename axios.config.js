import axios from "axios";

const Axios = axios.create({
  baseURL: "https://mappinappbackend.onrender.com/api",
});

export default Axios;
