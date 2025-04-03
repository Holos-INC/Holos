import { StatusKanbanDTO, StatusKanbanWithCommissionsDTO, StatusWithCommissions, StatusKanbanUpdateDTO  } from "@/src/constants/kanbanTypes";
import api from "./axiosInstance";

export async function fetchStatusesWithCommissions(token:string): Promise<StatusWithCommissions[]> {
    const res = await api.get('/status-kanban-order', { headers: { Authorization: `Bearer ${token}`}});
    const statuses: StatusKanbanDTO[] = res.data.statuses;
    const commissions: StatusKanbanWithCommissionsDTO[] = res.data.commissions;
  
    const grouped: StatusWithCommissions[] = statuses.map(status => ({
      status,
      commissions: commissions.filter(c => c.statusKanbanName === status.name),
    }));
  
    return grouped;
  }

export async function updateStatusColumn( dto: StatusKanbanUpdateDTO, token: string ) {
  await api.put('/status-kanban-order/update', dto, { headers: { Authorization: `Bearer ${token}` } });
}    

  export async function moveCommissionForward(id: number, token:string) {
  await api.put(`/status-kanban-order/${id}/next`, null, { headers: { Authorization: `Bearer ${token}`}});
}

export async function moveCommissionBack(id: number, token:string) {
  await api.put(`/status-kanban-order/${id}/previous`, null, { headers: { Authorization: `Bearer ${token}`}});
}

export async function deleteStatusColumn(id: number, token: string) {
  await api.delete(`/status-kanban-order/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
}
