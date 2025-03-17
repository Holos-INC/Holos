import { Alert, Platform } from "react-native";
import axios from "axios";

const API_URL = "http://localhost:8080/api/v1/commisions";

const isLaptop = Platform.OS === 'web';
const showAlert = (msg: string) => {
  if (isLaptop) {
    window.alert(msg);
  } else {
    Alert.alert("Notification", msg);
  }
};


export const createCommission = async (artistId: number, commissionData: any, token: any) => {
  try {
    const response = await axios.post(`${API_URL}/${artistId}`, commissionData, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    showAlert("Commission created successfully!");
    return response.data;

  } catch (error) {
    console.error("Error creating commission:", error);
    
    showAlert("Failed to create commission. Please try again.");
    throw error;
  }
};
