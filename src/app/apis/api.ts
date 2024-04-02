import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";

const ApiClient = () => {
  const instance = axios.create();
  instance.interceptors.request.use(async (request) => {
    const tokenProvider = document.querySelector("#app_root_cmp");
    if (tokenProvider) {
      request.headers.Authorization = tokenProvider.getAttribute("accessKey");
    }
    request.baseURL = import.meta.env.VITE_BASE_URL;
    return request;
  });

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      const errorObj = error as AxiosError;
      if (errorObj.response?.status == 401) {
        window.location.href = "/login";
      } else {
        const errorData = errorObj.response?.data as Record<string, string>;
        const errorMessage = errorData
          ? errorData.message || errorData.error || errorObj.message
          : "Failed";
        toast.error(errorMessage);
      }
      return Promise.reject(error);
    },
  );
  return instance;
};

export default ApiClient();
