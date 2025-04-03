import { progressDotsStyles } from "@/src/styles/RequestedCommissions.styles";
import React from "react";
import { View } from "react-native";

type ProgressDotsProps = {
  totalSteps: number;
  currentStep: number;
  activeColor?: string;
};
  
export const ProgressDots: React.FC<ProgressDotsProps> = ({ totalSteps, currentStep, activeColor = "#F05A7E"}) => {
  return (
    <View style={progressDotsStyles.container}>
      {Array.from({ length: totalSteps }).map((_, index) => (
        <View
          key={index}
          style={[ progressDotsStyles.dot, {
              backgroundColor: index < currentStep ? activeColor : "#ccc",
              borderWidth: index === currentStep ? 2 : 0,
              borderColor: index === currentStep ? "#999" : "transparent",},
          ]}
        />
      ))}
    </View>
  );
};
  