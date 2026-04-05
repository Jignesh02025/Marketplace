import axios from "axios";

const API = axios.create({
  baseURL: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiaWF0IjoxNzc1NDEyNzEwfQ.ye0j-LbXfm7uq8vmINrDZdANexVCBsVEUsBoO_p7jRU",
});

// 🔐 Auto attach token
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

export default API;