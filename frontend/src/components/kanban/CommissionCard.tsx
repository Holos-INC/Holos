import React from "react";
import { View, TouchableOpacity, Image, StyleSheet, Text } from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { StatusKanbanWithCommissionsDTO } from "@/src/constants/kanbanTypes";
import { cardStyles } from "@/src/styles/Kanban.styles";
import { getImageSource } from "@/src/utils/getImageSource";

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

  return (
    <View style={cardStyles.card}>
      {commission.image && (
        <Image
          source={getImageSource(commission.image)}
          style={cardStyles.image}
          onError={() => console.log("Error loading image:", commission.image)}
        />
      )}

      <View style={cardStyles.content}>
        <Text style={cardStyles.title} numberOfLines={1} ellipsizeMode="tail">
          {commission.name}
        </Text>
        <Text style={cardStyles.client} numberOfLines={2} ellipsizeMode="tail">
          {commission.description}
        </Text>
        <Text style={cardStyles.client} numberOfLines={1} ellipsizeMode="tail">
          Ordered by @{commission.clientUsername}
        </Text>

        <View style={cardStyles.bottomRow}>
          <Text style={cardStyles.client}>{commission.price}€</Text>
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
