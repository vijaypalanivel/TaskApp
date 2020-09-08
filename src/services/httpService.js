import axios from "axios";
import logger from "./logService";
import { toast } from "react-toastify";



function setJwt(jwt) {
  axios.defaults.headers.common["x-auth-token"] = jwt;
}

 const instance = axios.create({
  baseURL: 'http://localhost:3900/api',
});

instance.interceptors.response.use(null, error => {
  const expectedError =
    error.response &&
    error.response.status >= 400 &&
    error.response.status < 500;

  if (!expectedError) {
    logger.log(error);
    toast.error("An unexpected error occurrred.");
  }

  return Promise.reject(error);
});

export default {
  get: instance.get,
  post: instance.post,
  put: instance.put,
  delete: instance.delete,
  setJwt
};
