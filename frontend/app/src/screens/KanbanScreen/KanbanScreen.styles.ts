import { Dimensions, StyleSheet } from "react-native";

const { width } = Dimensions.get("window");
const isMobile = width < 768;
const isBigScreen = width >= 1024;

export const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#F0F0F0",
      padding: isBigScreen ? 40 : 20,
    },
    banner: {
      backgroundColor: "#183771",
      paddingVertical: isBigScreen ? 15 : 10,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 5,
    },
    taskText: {
      fontSize: isMobile ? 14 : 16,
    },
    bannerText: {
      color: "#FFFFFF",
      fontWeight: "bold",
      fontSize: isBigScreen ? 24 : 18,
    },
    kanbanBoard: {
      flexDirection: "row",
      justifyContent: isBigScreen ? "space-between" : "flex-start",
      marginTop: 20,
      paddingHorizontal: isMobile ? 10 : 0,
    },
    kanbanColumn: {
      flex: isBigScreen ? 1 : 0,
      margin: isMobile ? 5 : 10,
      padding: isMobile ? 5 : 15,
      width: isMobile ? 300 : 400,
    },
    taskCard: {
      backgroundColor: "#FFFFFF",
      padding: isMobile ? 10 : 15,
      marginTop: 15,
      borderRadius: 8,
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 2 },
      elevation: 3,
    },
    moveButton: {
      backgroundColor: "#183771",
      padding: 7,
      marginTop: 10,
      borderRadius: 5,
      width: isMobile ? "80%" : "33%",
      alignItems: "center",
      alignSelf: "center",
    },
  });
  