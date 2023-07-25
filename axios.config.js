import axios from "axios";

const Axios = axios.create({
  baseURL: "https://mappinappbackend.onrender.com/api",
  headers: {
    "Access-Control-Allow-Origin": "*",
  },
});

export default Axios;
