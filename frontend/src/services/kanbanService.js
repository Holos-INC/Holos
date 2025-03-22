import axios from "axios";
import { API_URL } from "@/src/constants/api";

const TASKS_URL = API_URL +"/status-kanban-order";

// Obtener todas las tareas
export const getAllTasks = async () => {
  try {
    const response = await axios.get(TASKS_URL);
    return response.data;
  } catch (error) {
    console.error("Error al obtener las tareas", error);
    throw error;
  }
};

// Obtener una tarea por ID
export const getTaskById = async (id) => {
  try {
    const response = await axios.get(`${TASKS_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener la tarea", error);
    throw error;
  }
};

// Crear una nueva tarea
export const createTask = async (task) => {
  try {
    const response = await axios.post(TASKS_URL, task);
    return response.data;
  } catch (error) {
    console.error("Error al crear la tarea", error);
    throw error;
  }
};

// Actualizar una tarea existente
export const updateTask = async (id, task) => {
  try {
    const response = await axios.put(`${TASKS_URL}/${id}`, task);
    return response.data;
  } catch (error) {
    console.error("Error al actualizar la tarea", error);
    throw error;
  }
};

// Eliminar una tarea
export const deleteTask = async (id) => {
  try {
    await axios.delete(`${TASKS_URL}/${id}`);
  } catch (error) {
    console.error("Error al eliminar la tarea", error);
    throw error;
  }
};

export const updateStatusKanbanOrder = async (taskId, newOrder) => {
    try {
      const response = await axios.put(
        TASKS_URL+`/${taskId}/updateKanbanOrder`,
        { id: taskId, order: newOrder }
      );
      return response.data;
    } catch (error) {
      console.error("Error al actualizar el kanban_order", error);
      throw error;
    }
  };
  
