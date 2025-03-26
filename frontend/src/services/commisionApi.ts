import { API_URL } from "@/src/constants/api";
import api from "@/src/services/axiosInstance";
import { handleError } from "@/src/utils/handleError";
import { Commission } from "@/src/constants/CommissionTypes";

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

export const getAllRequestedCommissions = async (): Promise<Commission[]> => {
  try {
    const response = await api.get(`${COMMISSION_URL}/requested`);
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

export const getClientCommissions = async (): Promise<Commission[]> => {
  try {
    const response = await api.get(`${COMMISSION_URL}/clientRequested`);
    return response.data;
  } catch (error) {
    handleError(error, "Error fetching client commissions");
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

export const updateCommissionStatus = async ( id: number, artistId: number, accept: boolean ): Promise<Commission> => {
  try {
    const response = await api.put(`${COMMISSION_URL}/${id}/status`, null, {
      params: { artistId, accept },
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
