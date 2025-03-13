import React from "react";
import { View, Text } from "react-native";
import { Commision } from "./emptyCommission";
import CommissionCard from "./CommissionCard";

interface CommissionColumnProps {
    status: string;
    commissions: Commision[];
}

const CommissionColumn: React.FC<CommissionColumnProps> = ({ status, commissions }) => {
    return (
        <View style={{ flex: 1, minWidth: 300, padding: 10,  backgroundColor: "#2A4479", borderRadius: 10, marginHorizontal: 5 }}>
            <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10, color: "#fff" }}>{status}</Text>
            {commissions.map((comm) => (
                <CommissionCard key={comm.id} commission={comm} />
            ))}
        </View>
    );
};

export default CommissionColumn;
