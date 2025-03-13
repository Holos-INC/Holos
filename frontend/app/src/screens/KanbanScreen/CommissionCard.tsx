import React, { useContext } from "react";
import { View, Text, Pressable } from "react-native";
import { Commision } from "./emptyCommission";
import { moveToNextStage } from "@/app/services/CommisionKanbanService";
import { AuthenticationContext } from "@/app/context/AuthContext";

interface CommissionCardProps {
    commission: Commision;
}

const CommissionCard: React.FC<CommissionCardProps> = ({ commission }) => {

    const { loggedInUser } = useContext(AuthenticationContext);

    const handleMoveToNextStage = async (commission: Commision) => {
        if (!loggedInUser?.token) {
            console.error("No authentication token found!");
            return;
        }

        try {
            await moveToNextStage(commission, loggedInUser.token);
            console.log("Commission moved to next stage successfully!");
        } catch (error) {
            console.error("Failed to move commission:", error);
        }
    };

    const handlePress = () => {
        handleMoveToNextStage(commission);
    };
    return (
        <View style={{ marginTop: 10, padding: 10, backgroundColor: "#FEF4FA", borderRadius: 5 }}>
            <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>{commission.name || "Unnamed Commission"}</Text>
            <Text style={{ fontSize: 15, fontWeight: "light", marginBottom: 10 }}>{commission.description || "No description"}</Text>
            <Text style={{ fontSize: 15, fontWeight:"ultralight", fontStyle:"italic"}}>Ordered by @{commission.client?.name ?? "Unknown"}</Text> {/* TODO Use the username */}
            <Pressable 
                style={({ pressed }) => ({
                    marginTop: 10,
                    paddingVertical: 8,
                    paddingHorizontal: 12,
                    backgroundColor: pressed ? "#FECEF1" : "#F05A7E",
                    borderRadius: 5,
                    alignItems: "center",
                })}
                onPress={handlePress}
            >
                <Text style={{ color: "#fff", fontWeight: "bold" }}>Move to next stage</Text>
            </Pressable>
        </View>
    );
};

export default CommissionCard;
