import axios from "axios";
import { BACKEND_URL } from "../config/urls.js";

export const problemSetLoader = async () => {
  const res = await axios.get(`${BACKEND_URL}/api/problems`, {
    withCredentials: true,
  });
  return { problems: res.data.problems };
};
