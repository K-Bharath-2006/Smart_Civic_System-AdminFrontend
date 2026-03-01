import api from "./api";
import { auth } from "../auth/firebase";

export const officerLogin = async (token) => {
  const res = await api.post(
    "/officer/login",
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return res.data;
};
export const addOfficer = async (officerData) => {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("User not logged in");
  }

  const token = await user.getIdToken(true);

  const res = await api.post("/admin/officer", officerData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};