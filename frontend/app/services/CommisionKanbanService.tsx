import axios from "axios";
import { Commision, emptyCommision } from "../src/screens/KanbanScreen/emptyCommission";

const API_BASE_URL = "http://localhost:8080/api/v1/commisions";

export const fetchCommissionsByArtist = async (artistUsername: string, token: string): Promise<Commision[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/kanban/${artistUsername}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
  
      return response.data.length > 0 ? response.data : [emptyCommision()];
    } catch (error) {
      console.error("Error fetching commissions:", error);
      return [emptyCommision()]; // If error, return an empty commission
    }
  };

export const organizeCommissions = (commissions: Commision[]): Record<string, Commision[]> => {
    // Step 1: Group commissions by `statusKanbanOrder.name`
    const groupedCommissions: Record<string, Commision[]> = {};

    commissions.forEach((commission) => {
        const statusName = commission.statusKanbanOrder?.name || "Uncategorized";

        if (!groupedCommissions[statusName]) {
            groupedCommissions[statusName] = [];
        }
        groupedCommissions[statusName].push(commission);
    });

    // Step 2: Sort groups by `statusKanbanOrder.order`
    const sortedGroups: Record<string, Commision[]> = Object.entries(groupedCommissions)
        .sort((a, b) => {
            const orderA = a[1][0]?.statusKanbanOrder?.order ?? 999;
            const orderB = b[1][0]?.statusKanbanOrder?.order ?? 999;
            return orderA - orderB;
        })
        .reduce((acc: Record<string, Commision[]>, [key, value]) => {
            acc[key] = value;
            return acc;
        }, {} as Record<string, Commision[]>);

    return sortedGroups;
};


export const moveToNextStage = async (commission: Commision, token: string): Promise<Commision> => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/next-stage`,
      commission,
      {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error moving commission to the next stage:", error);
    throw error;
  }
};