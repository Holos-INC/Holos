import { useEffect, useState } from "react";
import { CommissionDTO } from "../constants/CommissionTypes";
import { getCommissionById } from "../services/commisionApi";

export function useCommissionDetails(
  commissionId: string | string[] | undefined
) {
  const [commission, setCommission] = useState<CommissionDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchCommission = async () => {
    setLoading(true);
    try {
      if (commissionId) {
        const data = await getCommissionById(Number(commissionId));
        setCommission(data);
      }
    } catch {
      setErrorMessage("No se pudo obtener la comisión.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommission();
  }, [commissionId]);

  const refreshCommission = () => {
    fetchCommission();
  };

  return {
    commission,
    setCommission,
    loading,
    errorMessage,
    setErrorMessage,
    refreshCommission,
  };
}
