import api from "./axiosInstance"; // Assuming you have an axios instance set up
import { BaseUser } from "@/src/constants/CommissionTypes"; // Adjust to match your data type
import { API_URL } from "@/src/constants/api";

const USER_URL = `${API_URL}/baseUser`;
const ADMINISTRATOR_USER_URL = `${API_URL}/baseUser/administrator/users`;

// Fetch all users
export const getAllUsers = async (): Promise<BaseUser[]> => {
  const response = await api.get(ADMINISTRATOR_USER_URL);
  return response.data;
};

// Fetch a single user by ID
export const getUserById = async (id: number): Promise<BaseUser> => {
  const response = await api.get(`${USER_URL}/administrator/users/${id}`);
  return response.data;
};

// Create a new user (if needed, otherwise use `updateUser`)
export const createUser = async (user: Partial<BaseUser>): Promise<BaseUser> => {
  const response = await api.post(ADMINISTRATOR_USER_URL, user);
  return response.data;
};

// Update user information
export const updateUser = async (id: number, user: Partial<BaseUser>): Promise<BaseUser> => {
  const response = await api.put(`${USER_URL}/administrator/users/${id}`, user);
  return response.data;
};

// Delete a user by ID
export const deleteUser = async (id: number): Promise<void> => {
  await api.delete(`${USER_URL}/administrator/users/${id}`);
};

// Change a user's role
export const changeUserRole = async (id: number, newRole: string): Promise<any> => {
  const response = await api.put(
    `${USER_URL}/administrator/users/${id}/role`,
    null,
    { params: { newRole } }
  );
  return response.data;
};
