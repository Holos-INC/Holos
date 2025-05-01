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
    isWaitingPayment: boolean;
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
    name: string;
    color: string;
    description: string;
}

export type StatusKanbanCreateDTO = {
    name: string;
    color: string;
    description: string;
}