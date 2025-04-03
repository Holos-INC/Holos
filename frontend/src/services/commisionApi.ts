import { API_URL } from "@/src/constants/api";
import api from "@/src/services/axiosInstance";
import { handleError } from "@/src/utils/handleError";
import { Commission, HistoryCommisionsDTO } from "@/src/constants/CommissionTypes";

const COMMISSION_URL = `${API_URL}/commisions`;

export const getAllCommissions = async (): Promise<Commission[]> => {
  try {
    const response = await api.get(COMMISSION_URL);
    return response.data;
  } catch (error) {
    handleError(error, "Error fetching commissions");
    throw error;
  }
};

export const getAllRequestedCommissions = async (token:string): Promise<HistoryCommisionsDTO> => {
  try {
    const response = await api.get(`${COMMISSION_URL}/historyOfCommisions`, {headers: {Autorization: `Bearer ${token}`}});
    return response.data;
  } catch (error) {
    handleError(error, "Error fetching requested commissions");
    throw error;
  }
};

export const getCommissionById = async (id: number): Promise<Commission> => {
  try {
    const response = await api.get(`${COMMISSION_URL}/${id}`);
    return response.data;
  } catch (error) {
    handleError(error, "Error fetching commission by ID");
    throw error;
  }
};


export const createCommission = async ( commissionData: Partial<Commission>, artistId: number ): Promise<Commission> => {
  try {
    const response = await api.post(`${COMMISSION_URL}/${artistId}`, commissionData);
    return response.data;
  } catch (error) {
    handleError(error, "Error creating commission");
    throw error;
  }
};

export const updateCommissionStatus = async ( id: number, artistId: number, accept: boolean, token:string ): Promise<Commission> => {
  try {
    const response = await api.put(`${COMMISSION_URL}/${id}/status`, null, {
      params: { artistId, accept }, 
      headers: {Autorization: `Bearer ${token}`}
    });
    return response.data;
  } catch (error) {
    handleError(error, "Error updating commission status");
    throw error;
  }
};

export const cancelCommission = async ( id: number, clientId: number ): Promise<void> => {
  try {
    await api.put(`${COMMISSION_URL}/cancel/${id}`, null, {
      params: { clientId },
    });
  } catch (error) {
    handleError(error, "Error cancelling commission");
    throw error;
  }
};
