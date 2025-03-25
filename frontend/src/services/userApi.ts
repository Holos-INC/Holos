import { API_URL } from "../constants/api";
import { User } from "../constants/CommissionTypes";
import { handleError } from "../utils/handleError";
import api from "./axiosInstance";

const COMMISION_URL = `${API_URL}/users`;

export const getUser = async (token:string): Promise<User> => {
    try {
        const response = await api.get(`${COMMISION_URL}/profile`, {headers: { Authorization: `Bearer ${token}`}});
        return response.data;
    } catch (error) {
        handleError(error, "Error fetching commissions");
        throw error;
}
};
