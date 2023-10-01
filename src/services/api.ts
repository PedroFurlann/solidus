import { storageTokenGet } from "@/storage/storageToken";
import { AppError } from "@/utils/AppError";
import axios, { AxiosInstance } from "axios";

type SignOut = () => void;

type APIInstanceProps = AxiosInstance & {
  registerInterceptTokenManager: (signOut: SignOut) => () => void;
};

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
}) as APIInstanceProps;

api.registerInterceptTokenManager = (singOut) => {
  const interceptTokenManager = api.interceptors.response.use(
    (response) => response,
    async (requestError) => {
      const token = storageTokenGet();

      if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }

      if (requestError.response?.status === 401) {
        if (
          requestError.response.data?.message ===
            "Formato de token inválido. Faça login novamente." ||
          requestError.response.data?.message ===
            "Sua sessão expirou. Por favor, faça login novamente."
        ) {
          singOut();
        }
      }

      if (requestError.response && requestError.response.data) {
        return Promise.reject(new AppError(requestError.response.data.message));
      } else {
        return Promise.reject(requestError);
      }
    }
  );

  return () => {
    api.interceptors.response.eject(interceptTokenManager);
  };
};

export { api };