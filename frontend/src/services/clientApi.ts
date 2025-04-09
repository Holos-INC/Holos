import axios from 'axios';

export const getClientById = async (baseUserId: number) => {
  try {
    const response = await axios.get(`/clients/byBaseUser/${baseUserId}`);
    return response.data;
  } catch (error) {
    console.error(`Error obteniendo cliente con baseUserId ${baseUserId}:`, error);
    throw error;
  }
  
};

export const deleteClient = async (id: number, token:string): Promise<void> => {
  await api.delete(`${CLIENT_URL}/administrator/clients/${id}`, { headers: { Authorization: `Bearer ${token}`}});
};