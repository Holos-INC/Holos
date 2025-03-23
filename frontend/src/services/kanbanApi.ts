import { StatusKanbanDTO, StatusKanbanWithCommissionsDTO, StatusWithCommissions } from "@/src/constants/kanbanTypes";
import api from "./axiosInstance";

export async function fetchStatusesWithCommissions(token:string): Promise<StatusWithCommissions[]> {
  console.log(token)
    const res = await api.get('/status-kanban-order', { headers: { Authorization: `Bearer ${token}`}});
    const statuses: StatusKanbanDTO[] = res.data.first;
    const commissions: StatusKanbanWithCommissionsDTO[] = res.data.second;
  
    const grouped: StatusWithCommissions[] = statuses.map(status => ({
      status,
      commissions: commissions.filter(c => c.statusKanbanName === status.name),
    }));
  
    return grouped;
  }
  
  export async function moveCommissionForward(id: number, token:string) {
    await api.put(`/status-kanban-order/${id}/next`, null, { headers: { Authorization: `Bearer ${token}`}});
  }
  
  export async function moveCommissionBack(id: number, token:string) {
    await api.put(`/status-kanban-order/${id}/previous`, null, { headers: { Authorization: `Bearer ${token}`}});
  }