import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, ViewStyle } from "react-native";
import { ProgressDots } from "@/src/components/requestedCommissions/ProgressDots";
import { commissionCardstyles } from "@/src/styles/RequestedCommissions.styles";

type CommissionCardProps = {
  title: string;
  image: string;
  artistUsername: string;
  totalSteps: number;
  currentStep: number;
};

export const CommissionCard: React.FC<CommissionCardProps> = ({ title, image, artistUsername, totalSteps, currentStep }) => {
  return (
    <TouchableOpacity style={commissionCardstyles.card}>
      <Image source={{ uri: image }} style={commissionCardstyles.image} />

      <View style={commissionCardstyles.content}>
        <View style={commissionCardstyles.titleContainer}>
          <Text style={commissionCardstyles.title}>{title}</Text>
          <Text style={commissionCardstyles.artist}>por @{artistUsername}</Text>
        </View>
        <ProgressDots totalSteps={totalSteps} currentStep={currentStep} />
        <Text>{currentStep}/{totalSteps}</Text>
      </View>
    </TouchableOpacity>
  );
};
