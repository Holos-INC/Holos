import api from "./axiosInstance"; // Assuming you have an axios instance set up
import {BaseUserDTO, User, BaseUser } from "@/src/constants/CommissionTypes"; // Adjust to match your data type
import { API_URL } from "@/src/constants/api";

const USER_URL = `${API_URL}/baseUser`;
const ADMINISTRATOR_USER_URL = `${API_URL}/baseUser/administrator/users`;

export const getAllUsers = async (token: string): Promise<BaseUser[]> => {
  const response = await api.get(ADMINISTRATOR_USER_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getUserById = async (
  id: number,
  token: string
): Promise<BaseUser> => {
  const response = await api.get(`${ADMINISTRATOR_USER_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getUserByUsername = async (
  username: string,
  token: string
): Promise<BaseUserDTO> => {
  const response = await api.get(`${API_URL}/baseUser/username/${username}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getUser = async (token: string): Promise<User> => {
  const response = await api.get(`${API_URL}/users/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const updateUser = async (
  id: number,
  user: Partial<BaseUser>,
  token: string
): Promise<BaseUser> => {
  const response = await api.put(`${ADMINISTRATOR_USER_URL}/${id}`, user, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const deleteUser = async (id: number, token: string): Promise<void> => {
  await api.delete(`${ADMINISTRATOR_USER_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
