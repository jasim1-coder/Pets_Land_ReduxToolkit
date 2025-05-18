import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL, // Use VITE environment variable
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Axios Request Interceptor (Automatically Adds Token)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Get JWT token from local storage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Attach token to request
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


const refreshAccessToken = async () => {
  try {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) throw new Error("No refresh token available");

    const response = await api.post(`/auth/refresh`, {
      refreshtoken: refreshToken,
    });

    const newAccessToken = response.data.data.token;
    const newRefreshToken = response.data.data.refreshToken;

    localStorage.setItem("token", newAccessToken);
    localStorage.setItem("refreshToken", newRefreshToken);
    return newAccessToken;
  } catch (error) {
    toast.error("Session expired. Please log in again.");
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    // localStorage.removeItem("role");
    window.location.href = "/";
    throw error;
  }
};


let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (token) {
      prom.resolve(token);
    } else {
      prom.reject(error);
    }
  });

  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api.request(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newAccessToken = await refreshAccessToken();
        processQueue(null, newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api.request(originalRequest);
      } catch (err) {
        processQueue(err, null);
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);



export default api;
