import api from "./axiosInstance";
import { Category } from "@/src/constants/CommissionTypes";
import { API_URL } from "@/src/constants/api";

const CATEGORY_URL = `${API_URL}/categories`;
const ADMINISTRATOR_CATEGORY_URL = `${API_URL}/categories/administrator/categories`;

export const getAllCategories = async (): Promise<Category[]> => {
  const response = await api.get(ADMINISTRATOR_CATEGORY_URL);
  return response.data;
};

export const getCategoryById = async (id: number): Promise<Category> => {
  const response = await api.get(`${CATEGORY_URL}/${id}`);
  return response.data;
};

export const createCategory = async (category: Partial<Category>): Promise<Category> => {
  const response = await api.post(ADMINISTRATOR_CATEGORY_URL, category);
  return response.data;
};

export const updateCategory = async (id: number, category: Partial<Category>): Promise<Category> => {
  const response = await api.put(`${ADMINISTRATOR_CATEGORY_URL}/${id}`, category);
  return response.data;
};

export const deleteCategory = async (id: number): Promise<void> => {
  await api.delete(`${ADMINISTRATOR_CATEGORY_URL}/${id}`);
};
