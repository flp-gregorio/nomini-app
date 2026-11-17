import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
});

function isPublicGetRequest(method?: string, url?: string): boolean {
  if ((method || "get").toLowerCase() !== "get" || !url) return false;
  const path = url.split("?")[0];
  return (
    path === "/event" ||
    path === "/categories" ||
    path.startsWith("/categories/")
  );
}

api.interceptors.request.use((config) => {
  if (!isPublicGetRequest(config.method, config.url)) {
    const token = localStorage.getItem("jwt");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("jwt");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
