import { API_URL } from "@/src/constants/api";
import api from "@/src/services/axiosInstance";
import { handleError } from "@/src/utils/handleError";
import { ClientCommissionDTO, Commission, CommissionDTO, CommissionProtected, HistoryCommisionsDTO } from "@/src/constants/CommissionTypes";


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
export const getAllRequestedCommissions = async (
  token: string
): Promise<HistoryCommisionsDTO> => {
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

export const payCommissionById = async (id: number): Promise<String> => {
  try {
    const response = await api.put(`${COMMISSION_URL}/${id}/accept`);
    return response.data;
  } catch (error) {
    handleError(error, "Error fetching commission by ID");
    throw error;
  }
};

// Crear una nueva comisión
export const createCommission = async (
  commissionData: Partial<Commission>,
  artistId: number
): Promise<Commission> => {
  try {
    const response = await api.post(
      `${COMMISSION_URL}/${artistId}`,
      commissionData
    );
    return response.data;
  } catch (error) {
    handleError(error, "Error creating commission");
    throw error;
  }
};

// Aceptar una comisión
export const acceptCommission = async (
  id: number,
  token: string
): Promise<void> => {
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
export async function reject(id: number, token: string) {
  try {
    return await api.put(`${COMMISSION_URL}/${id}/reject`, null, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error: any) {
    if (error.response?.data) {
      const raw = error.response.data;
      if (typeof raw === "string")
        throw new Error(raw.replace(/^Error:\s*/, ""));
      if (typeof raw === "object" && raw.message) throw new Error(raw.message);
    }
    throw new Error("Hubo un error al rechazar la comisión");
  }
}

// Cambiar el estado de la comisión a 'espera' (waiting)
export async function waiting(
  id: number,
  updatedCommission: any,
  token: string
) {
  try {
    return await api.put(`${COMMISSION_URL}/${id}/waiting`, updatedCommission, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error: any) {
    if (error.response?.data) {
      const raw = error.response.data;
      if (typeof raw === "string")
        throw new Error(raw.replace(/^Error:\s*/, ""));
      if (typeof raw === "object" && raw.message) throw new Error(raw.message);
    }
    throw new Error("Hubo un error al actualizar el precio");
  }
}

// Cambiar el estado de la comisión a 'pago' (toPay)
export async function toPay(id: number, token: string) {
  try {
    return await api.put(`${COMMISSION_URL}/${id}/toPay`, null, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error: any) {
    if (error.response?.data) {
      const raw = error.response.data;
      if (typeof raw === "string")
        throw new Error(raw.replace(/^Error:\s*/, ""));
      if (typeof raw === "object" && raw.message) throw new Error(raw.message);
    }
    throw new Error("Hubo un error al aceptar la comisión");
  }
}

// Cancelar una comisión
export const cancelCommission = async (
  id: number,
  token: string
): Promise<void> => {
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

export const getAcceptedCommissions = async (token: string): Promise<ClientCommissionDTO[]> => {
  try {
    const response = await api.get(`${COMMISSION_URL}/historyOfCommisions`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    // asume que response.data.accepted es un array de ClientCommissionDTO
    return response.data.accepted;
  } catch (error) {
    handleError(error, "Error fetching accepted commissions");
    throw error;
  }
};
