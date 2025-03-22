import axios from "axios";
import api from "@/src/services/axiosInstance";
import { API_URL } from "@/src/constants/api";
import { Client } from "@/src/constants/CommissionTypes";

const CLIENT_URL = `${API_URL}/users`;

export const getClientById = async (id: number): Promise<Client> => {
  try {
    const response = await api.get(`${CLIENT_URL}/${id}`);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error fetching client:", error.response?.data || error.message);
    } else {
      console.error("Unexpected error:", (error as Error).message);
    }
    throw error;
  }
};
