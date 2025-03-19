import { Alert, Platform } from "react-native";
import api from "@/src/services/axiosInstance";
import { API_URL } from "@/src/constants/api";
import { Commission } from "@/src/constants/CommissionTypes";
import { handleError } from "@/src/utils/handleError";

const COMMISION_URL = `${API_URL}/commisions`;
const isLaptop = Platform.OS === "web";

const showAlert = (msg: string) => {
  if (isLaptop) {
    window.alert(msg);
  } else {
    Alert.alert("Notification", msg);
  }
};

export const createCommission = async (
  artistId: number,
  commissionData: Partial<Commission>,
  token: string
): Promise<Commission> => {
  try {
    const response = await api.post(`${COMMISION_URL}/${artistId}`, commissionData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    showAlert("Commission created successfully!");
    return response.data;
  } catch (error) {
    handleError(error, "Failed to create commission.");
    showAlert("Failed to create commission. Please try again.");
    throw error;
  }
};
