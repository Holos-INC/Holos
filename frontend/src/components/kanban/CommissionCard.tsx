import React from "react";
import { View, TouchableOpacity, Image, StyleSheet, Text } from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { StatusKanbanWithCommissionsDTO } from "@/src/constants/kanbanTypes";
import { cardStyles } from "@/src/styles/Kanban.styles";
import { getImageSource } from "@/src/utils/getImageSource";
import { useRouter } from "expo-router";

interface CommissionCardProps {
  commission: StatusKanbanWithCommissionsDTO;
  statusIndex: number;
  maxIndex: number;
  onMoveBack: () => void;
  onMoveForward: () => void;
}

export const CommissionCard: React.FC<CommissionCardProps> = ({
  commission,
  statusIndex,
  maxIndex,
  onMoveBack,
  onMoveForward,
}) => {
  const canMoveBack = statusIndex > 0;
  const isLastColumn = statusIndex === maxIndex;
  const router = useRouter();
  const goToCommissionDetails = () => {
    router.push(`/commissions/${commission.id}/details`);
  };
  const goToUserProfile = () => {
    router.push(`/profile/${commission.clientUsername}`);
  };
  return (
    <View style={cardStyles.card}>
      {commission.image && (
        <TouchableOpacity onPress={goToCommissionDetails}>
          <Image
            source={getImageSource(commission.image)}
            style={cardStyles.image}
            onError={() =>
              console.log("Error loading image:", commission.image)
            }
          />
        </TouchableOpacity>
      )}

      <View style={cardStyles.content}>
        <View style={[cardStyles.topRow, { marginBlockEnd: 3 }]}>
          <Text style={cardStyles.title} numberOfLines={1} ellipsizeMode="tail">
            {commission.name}
          </Text>
          <View style={cardStyles.priceWrapper}>
            <Text style={cardStyles.price}>{commission.price}€</Text>
          </View>
        </View>

        <View style={cardStyles.bottomRow}>
          <Text
            style={cardStyles.client}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            Pedido de{" "}
            <TouchableOpacity onPress={goToUserProfile}>
              <Text style={cardStyles.username}>
                @{commission.clientUsername}
              </Text>
            </TouchableOpacity>
          </Text>

          <View style={cardStyles.buttonRow}>
            {canMoveBack && (
              <TouchableOpacity style={cardStyles.button} onPress={onMoveBack}>
                <Icon name="arrow-left" size={16} color="#444" />
              </TouchableOpacity>
            )}

            <TouchableOpacity style={cardStyles.button} onPress={onMoveForward}>
              <Icon
                name={isLastColumn ? "archive" : "arrow-right"}
                size={16}
                color="#444"
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};
