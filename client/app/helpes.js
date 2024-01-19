import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "http://localhost:7000"
})

module.exports = axiosInstance