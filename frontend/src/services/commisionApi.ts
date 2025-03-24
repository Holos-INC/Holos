import { API_URL } from "@/src/constants/api";
import api from "@/src/services/axiosInstance";
import { handleError } from "@/src/utils/handleError";
import { Commission } from "@/src/constants/CommissionTypes";

const COMMISION_URL = `${API_URL}/commisions`;

export const getAllCommisions = async (token:string): Promise<Commission[]> => {
  try {
    const response = await api.get(COMMISION_URL, {headers: { Authorization: `Bearer ${token}`}});
    return response.data;
  } catch (error) {
    handleError(error, "Error fetching commissions");
    throw error;
  }
};

export const getAllRequestedCommisions = async (token:string): Promise<Commission[]> => {
  try {
    const response = await api.get(`${COMMISION_URL}/requested`, {headers: { Authorization: `Bearer ${token}`}});
    return response.data;
  } catch (error) {
    handleError(error, "Error fetching commissions");
    throw error;
  }
};

export const getCommisionById = async (id: number): Promise<Commission> => {
  try {
    const response = await api.get(`${COMMISION_URL}/${id}`);
    return response.data;
  } catch (error) {
    handleError(error, "Error fetching commission by ID");
    throw error;
  }
};

export async function getClientCommissions(token:string) {
  const response = await api.get(`${COMMISION_URL}/clientRequested`,{ headers: { Authorization: `Bearer ${token}`}});
  console.log(response.data)
  return response.data;
}

export const createCommision = async (
  commisionData: Partial<Commission>,
  artistId: number
): Promise<Commission> => {
  try {
    const response = await api.post(`${COMMISION_URL}/${artistId}`, commisionData);
    return response.data;
  } catch (error) {
    handleError(error, "Error creating commission");
    throw error;
  }
};

export const updateCommisionStatus = async ( id: number, artistId: number, accept: boolean, token:string): Promise<Commission> => {
  try {
    const response = await api.put(`${COMMISION_URL}/${id}/status`, null, {
      headers: { Authorization: `Bearer ${token}`},
      params: { artistId, accept },
    });
    return response.data;
  } catch (error) {
    handleError(error, "Error updating commission status");
    throw error;
  }
};

export const cancelCommision = async (id: number, clientId: number, token:string): Promise<void> => {
  try {
    await api.put(`${COMMISION_URL}/cancel/${id}`, null, {
      headers: { Authorization: `Bearer ${token}`},
      params: { clientId },
    });
  } catch (error) {
    handleError(error, "Error cancelling commission");
    throw error;
  }
};
