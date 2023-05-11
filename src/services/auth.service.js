import axios from "axios";
import authHeader from "./auth-header";

const API_URL =
  "https://irzh7zwl0a.execute-api.eu-north-1.amazonaws.com/api/accounts";
const UI_URL = "https://d1m8cftr87o4s5.cloudfront.net";

const register = (email, password, confirmpassword) => {
  return axios
    .post(API_URL + "/registration", {
      email,
      password,
      confirmpassword,
    })
    .then((response) => {
      return response.data;
    });
};

const login = (email, password) => {
  return axios
    .post(API_URL + "/login", {
      email,
      password,
    })
    .then((response) => {
      if (response.data.data) {
        localStorage.setItem("token", JSON.stringify(response.data.data));
      }

      return response.data;
    });
};

const forgotpassword = (email) => {
  const clientUri = UI_URL + "/resetpassword";
  return axios.post(API_URL + "/forgotpassword", {
    email,
    clientUri,
  });
};

const resetpassword = (password, confirmPassword, email, token) => {
  return axios.post(API_URL + "/resetpassword", {
    password,
    confirmPassword,
    email,
    token,
  });
};

const updateAccountInfo = async (
  nicknameToUpdate,
  email,
  oldpassword,
  password,
  confirmPassword
) => {
  const response = await axios.post(
    API_URL + `/changesettings`,
    {
      Nickname: nicknameToUpdate,
      Email: email,
      OldPassword: oldpassword,
      Password: password,
      ConfirmPassword: confirmPassword,
    },
    { headers: authHeader() }
  );
  return response.data;
};

const getAccountInfo = async (email) => {
  const response = await axios.get(API_URL + `/accountinfo/${email}`, {
    headers: authHeader(),
  });
  return response.data;
};

const externalLogin = async (provider, idToken) => {
  const response = await axios.post(API_URL + `/externallogin`, {
    provider,
    idToken,
  });
  return response.data;
};

const getAllUsers = async () => {
  const response = await axios.get(API_URL + `/getall`, {
    headers: authHeader(),
  });
  return response.data;
};

const logout = () => {
  localStorage.removeItem("token");
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("token"));
};

const AuthService = {
  register,
  login,
  logout,
  getCurrentUser,
  forgotpassword,
  resetpassword,
  updateAccountInfo,
  getAccountInfo,
  externalLogin,
  getAllUsers,
};

export default AuthService;
