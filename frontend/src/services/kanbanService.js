import axios from "axios";

const API_URL = "http://localhost:8080/status-kanban-order";

// Obtener todas las tareas
export const getAllTasks = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error al obtener las tareas", error);
    throw error;
  }
};

// Obtener una tarea por ID
export const getTaskById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener la tarea", error);
    throw error;
  }
};

// Crear una nueva tarea
export const createTask = async (task) => {
  try {
    const response = await axios.post(API_URL, task);
    return response.data;
  } catch (error) {
    console.error("Error al crear la tarea", error);
    throw error;
  }
};

// Actualizar una tarea existente
export const updateTask = async (id, task) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, task);
    return response.data;
  } catch (error) {
    console.error("Error al actualizar la tarea", error);
    throw error;
  }
};

// Eliminar una tarea
export const deleteTask = async (id) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
  } catch (error) {
    console.error("Error al eliminar la tarea", error);
    throw error;
  }
};

export const updateStatusKanbanOrder = async (taskId, newOrder) => {
    try {
      const response = await axios.put(
        `http://localhost:8080/status-kanban-order/${taskId}/updateKanbanOrder`,
        { id: taskId, order: newOrder }
      );
      return response.data;
    } catch (error) {
      console.error("Error al actualizar el kanban_order", error);
      throw error;
    }
  };
  
