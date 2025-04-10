import axios from 'axios';
import api from "./axiosInstance";
import { API_URL } from "../constants/api";
const CLIENT_URL = `${API_URL}/users`;

export const getClientById = async (baseUserId: number) => {
  try {
    const response = await axios.get(`/clients/byBaseUser/${baseUserId}`);
    return response.data;
  } catch (error) {
    console.error(`Error obteniendo cliente con baseUserId ${baseUserId}:`, error);
    throw error;
  }
  
};

export const deleteClient = async (id: number, token:string): Promise<void> => {
  await api.delete(`${CLIENT_URL}/administrator/clients/${id}`, { headers: { Authorization: `Bearer ${token}`}});
};