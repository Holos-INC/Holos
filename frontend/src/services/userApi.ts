import api from "./axiosInstance"; // Assuming you have an axios instance set up
import { BaseUser } from "@/src/constants/CommissionTypes"; // Adjust to match your data type
import { API_URL } from "@/src/constants/api";

const USER_URL = `${API_URL}/baseUser`;
const ADMINISTRATOR_USER_URL = `${API_URL}/baseUser/administrator/users`;

export const getAllUsers = async (): Promise<BaseUser[]> => {
  const response = await api.get(ADMINISTRATOR_USER_URL);
  return response.data;
};

export const getUserById = async (id: number): Promise<BaseUser> => {
  const response = await api.get(`${USER_URL}/administrator/users/${id}`);
  return response.data;
};

export const updateUser = async (id: number, user: Partial<BaseUser>): Promise<BaseUser> => {
  const response = await api.put(`${USER_URL}/administrator/users/${id}`, user);
  return response.data;
};

export const deleteUser = async (id: number): Promise<void> => {
  await api.delete(`${USER_URL}/administrator/users/${id}`);
};

