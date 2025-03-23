export type StatusKanbanDTO = {
    name: string;
    order: number;
    description: string;
    color: string;
};
  
export type StatusKanbanWithCommissionsDTO = {
    id: number;
    name: string;
    description: string;
    price: number;
    numMilestones: number;
    paymentArrangement: string;
    statusKanbanName: string;
    clientUsername: string;
};
  
export type StatusWithCommissions = {
    status: StatusKanbanDTO;
    commissions: StatusKanbanWithCommissionsDTO[];
};