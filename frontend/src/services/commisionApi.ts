import { API_URL } from "@/src/constants/api";
import api from "@/src/services/axiosInstance";
import { handleError } from "@/src/utils/handleError";
import { Commission, CommissionDTO, CommissionProtected, HistoryCommisionsDTO } from "@/src/constants/CommissionTypes";

const COMMISSION_URL = `${API_URL}/commisions`;

// Obtener todas las comisiones
export const getAllCommissions = async (): Promise<Commission[]> => {
  try {
    const response = await api.get(COMMISSION_URL);
    return response.data;
  } catch (error) {
    handleError(error, "Error fetching commissions");
    throw error;
  }
};

// Obtener el historial de comisiones
export const getAllRequestedCommissions = async (token: string): Promise<HistoryCommisionsDTO> => {
  try {
    const response = await api.get(`${COMMISSION_URL}/historyOfCommisions`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    handleError(error, "Error fetching requested commissions");
    throw error;
  }
};

export const getCommissionById = async (id: number): Promise<CommissionDTO> => {
  try {
    const response = await api.get(`${COMMISSION_URL}/${id}`);
    return response.data;
  } catch (error) {
    handleError(error, "Error fetching commission by ID");
    throw error;
  }
};

export const getCommissionByIdDetails = async (id: number): Promise<CommissionProtected> => {
  try {
    const response = await api.get(`${COMMISSION_URL}/${id}`);
    return response.data;
  } catch (error) {
    handleError(error, "Error fetching commission by ID");
    throw error;
  }
};

// Crear una nueva comisión
export const createCommission = async (commissionData: Partial<Commission>, artistId: number): Promise<Commission> => {
  try {
    const response = await api.post(`${COMMISSION_URL}/${artistId}`, commissionData);
    return response.data;
  } catch (error) {
    handleError(error, "Error creating commission");
    throw error;
  }
};

// Aceptar una comisión
export const acceptCommission = async (id: number, token: string): Promise<void> => {
  try {
    await api.put(`${COMMISSION_URL}/${id}/accept`, null, {
      headers: { Authorization: `Bearer ${token}` }, 
    });
  } catch (error) {
    handleError(error, "Error accepting commission");
    throw error;
  }
};

// Rechazar una comisión
export const rejectCommission = async (id: number, token: string): Promise<void> => {
  try {
    await api.put(`${COMMISSION_URL}/${id}/reject`, null, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    handleError(error, "Error rejecting commission");
    throw error;
  }
};

// Cambiar el estado de la comisión a 'espera' (waiting)
export const waitingCommission = async (id: number, token: string): Promise<void> => {
  try {
    await api.put(`${COMMISSION_URL}/${id}/waiting`, null, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    handleError(error, "Error setting commission to waiting");
    throw error;
  }
};

// Cambiar el estado de la comisión a 'pago' (toPay)
export const toPayCommission = async (id: number, token: string): Promise<void> => {
  try {
    await api.put(`${COMMISSION_URL}/${id}/toPay`, null, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    handleError(error, "Error setting commission to pay");
    throw error;
  }
};

// Cancelar una comisión
export const cancelCommission = async (id: number, token: string): Promise<void> => {
  try {
    await api.put(`${COMMISSION_URL}/${id}/cancel`, null, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    handleError(error, "Error cancelling commission");
    throw error;
  }
};

export const requestChangesCommission = async (id: number, updatedCommission: CommissionProtected, token: string) => {
  try {
    await api.put(`${COMMISSION_URL}/${id}/requestChanges`, updatedCommission, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    handleError(error, "Error requesting changes to commission");
    throw error;
  }
};


