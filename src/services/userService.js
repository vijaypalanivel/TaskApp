import http from "./httpService";

const apiEndpoint = "/users";

export function register(user) {
  return http.post(apiEndpoint, {
    email: user.username,
    password: user.password,
    name: user.name
  });


}

export function getUsers() {
  return http.get(apiEndpoint);
}


export default {
  register,
  getUsers
};