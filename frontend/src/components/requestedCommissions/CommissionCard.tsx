import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, ViewStyle } from "react-native";
import { ProgressDots } from "@/src/components/requestedCommissions/ProgressDots";
import { commissionCardstyles } from "@/src/styles/RequestedCommissions.styles";
import { useRouter } from "expo-router";  

type CommissionCardProps = {
  id: number;
  title: string;
  image: string;
  artistUsername: string;
  totalSteps: number;
  currentStep: number;
};

export const CommissionCard: React.FC<CommissionCardProps> = ({ id, title, image, artistUsername, totalSteps, currentStep }) => {
  const router = useRouter();  // Usamos useRouter de expo-router
  
  
  return (
    <TouchableOpacity style={commissionCardstyles.card}
    onPress={() => {
      console.log("a");
      router.push(
          `/chats/${id}`
        )                
      }}>
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
