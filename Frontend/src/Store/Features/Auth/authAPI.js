import axios from "axios";
import { BACKEND_URL } from "../../../config/urls.js";

export const getUser = async () => {
  const res = await axios.get(`${BACKEND_URL}/api/auth/me`, {
    withCredentials: true,
  });
  return res.data.user;         
};

export const logout = async () => {
  await axios.post(
    `${BACKEND_URL}/api/auth/logout`,
    {},
    { withCredentials: true }
  );
  return null;
};
