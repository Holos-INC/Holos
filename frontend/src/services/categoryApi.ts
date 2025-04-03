import api from "./axiosInstance";
import { Category } from "@/src/constants/CommissionTypes";
import { API_URL } from "@/src/constants/api";
import { del } from "./HelperEndpoints/ApiEndpoints";

const CATEGORY_URL = `${API_URL}/categories`;
const ADMINISTRATOR_CATEGORY_URL = `${API_URL}/categories/administrator/categories`;

export const getAllCategories = async (): Promise<Category[]> => {
  const response = await api.get(CATEGORY_URL);
  return response.data;
};

export const getCategoryById = async (id: number): Promise<Category> => {
  const response = await api.get(`${CATEGORY_URL}/${id}`);
  return response.data;
};

export const getAllCategoriesAdmin = async (token:string): Promise<Category[]> => {
  const response = await api.get(ADMINISTRATOR_CATEGORY_URL, { headers: { Authorization: `Bearer ${token}`}});
  return response.data;
};

export const createCategory = async (category: Partial<Category>, token:string): Promise<Category> => {
  const response = await api.post(ADMINISTRATOR_CATEGORY_URL, category, { headers: { Authorization: `Bearer ${token}`}});
  return response.data;
};

export const updateCategory = async (id: number, category: Partial<Category>, token:string): Promise<Category> => {
  const response = await api.put(`${ADMINISTRATOR_CATEGORY_URL}/${id}`, category, { headers: { Authorization: `Bearer ${token}`}});
  return response.data;
};

export const deleteCategory = async (id: number, token:string): Promise<void> => {
  await api.delete(`${ADMINISTRATOR_CATEGORY_URL}/${id}`, { headers: { Authorization: `Bearer ${token}`}});
};
