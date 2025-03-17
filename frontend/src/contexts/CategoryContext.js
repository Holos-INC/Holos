import React, { createContext, useState, useEffect } from "react";
import { getAllCategories } from "../services/CategoryEndpoints";

const CategoryContext = createContext();

export default function CategoryContextProvider({ children }) {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Función para cargar todas las categorías desde la API
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await getAllCategories();
      setCategories(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // Cargar las categorías al montar el provider
  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <CategoryContext.Provider
      value={{
        categories,
        selectedCategory,
        setSelectedCategory,
        fetchCategories,
        loading,
        error,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
}

export { CategoryContext };
