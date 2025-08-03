import axios from "axios";

export const getUser = async () => {
  const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/auth/me`, {
    withCredentials: true,
  });
  return res.data.user;         
};

export const logout = async () => {
  await axios.post(
    `${import.meta.env.VITE_BACKEND_URL}/api/auth/logout`,
    {},
    { withCredentials: true }
  );
  return null;
};
