import axios, { AxiosError, type AxiosRequestConfig } from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

const client = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // send cookies for httpOnly auth
});

// Refresh handling queue to avoid concurrent refresh calls
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (err: any) => void;
  config: AxiosRequestConfig & { _retry?: boolean };
}> = [];

const processQueue = (error: any) => {
  failedQueue.forEach((p) => {
    if (error) p.reject(error);
    else p.resolve(true);
  });
  failedQueue = [];
};

async function refreshToken() {
  // Try to refresh session via backend endpoint. Assumes backend uses httpOnly cookies
  return client.post("/auth/refresh");
}

client.interceptors.response.use(
  (response) => response,
  async (error: AxiosError | any) => {
    const originalRequest = error?.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error?.response?.status !== 401) {
      // Not an auth error we handle here
      return Promise.reject(error);
    }

    // If there's no original request or we already retried, bail out
    if (!originalRequest) return Promise.reject(error);

    if (originalRequest._retry) {
      // Already retried, force logout
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("app:logout"));
      }
      return Promise.reject(error);
    }

    if (isRefreshing) {
      // Queue the request until refresh completes
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject, config: originalRequest });
      })
        .then(() => client(originalRequest))
        .catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      await refreshToken();
      processQueue(null);
      isRefreshing = false;
      return client(originalRequest);
    } catch (err) {
      isRefreshing = false;
      processQueue(err);
      // notify app to logout
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("app:logout"));
      }
      return Promise.reject(err);
    }
  }
);

export default client;
