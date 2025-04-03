export type StatusKanbanDTO = {
    id: number,
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

export type StatusKanbanUpdateDTO = {
    id: number;
    nombre: string;
    color: string;
    description: string;
}
