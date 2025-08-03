import axios from "axios";

export const getUser = async () => {
  const res = await axios.get("http://localhost:8000/api/auth/me", {
    withCredentials: true,
  });
  return res.data.user;         
};

export const logout = async () => {
  await axios.post(
    "http://localhost:8000/api/auth/logout",
    {},
    { withCredentials: true }
  );
  return null;
};
