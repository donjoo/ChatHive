import axios from "axios";
import { ACCESS_TOKEN } from "./constants";

const api = axios.create({
//   baseURL: import.meta.env.REACT_APP_API_BASE_URL,
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 0,
  validateStatus: function (status) {
    return status >= 200 && status < 500;
  },
});

api.interceptors.request.use(
  (config) => {
    console.log(import.meta.env.REACT_API_BASE_URL)
    console.log("requested url :", config.url);
    if (config.url.includes("login/") || config.url.includes("signup/")) {
      return config;
    }

    const token = localStorage.getItem("ACCESS_TOKEN");
    console.log("tokn", token);
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

    

      try {
        const refreshToken = localStorage.getItem("REFRESH_TOKEN");
        const response = await axios.post(
          `${import.meta.env.REACT_API_BASE_URL}/token/refresh/`,
          { refresh: refreshToken }
        );

        const newAccessToken = response.data.access;
        localStorage.setItem("ACCESS_TOKEN", newAccessToken);
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Clear storage and redirect on refresh failure
        localStorage.clear();
        window.location.href = "/login";
        // return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;