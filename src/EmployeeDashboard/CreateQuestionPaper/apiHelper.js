import axios from "axios";
import { API_BASE_URL } from "../../api/api";

const API = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

export default API;