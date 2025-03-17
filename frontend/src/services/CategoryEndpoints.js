import { get } from "./HelperEndpoints/ApiEndpoints";

// Función para obtener todas las categorías
const getAllCategories = () => {
  return get("/categories");
};

// Función para obtener una categoría por ID
const getCategoryById = (id) => {
  return get(`/categories/${id}`);
};

export { getAllCategories, getCategoryById };
