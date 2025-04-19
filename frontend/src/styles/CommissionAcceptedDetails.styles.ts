import { StyleSheet } from "react-native";
import colors from "../constants/colors";

export const styles = StyleSheet.create({
    scroll: {
      flexGrow: 1,
      justifyContent: "center",
      padding: 24,
      backgroundColor: colors.surfaceMuted,
    },
    card: {
      backgroundColor: "white",
      padding: 24,
      borderRadius: 20,
      shadowColor: colors.brandPrimary,
      shadowOffset: { width: 0, height: 5 },
      shadowOpacity: 0.25,
      shadowRadius: 15,
      elevation: 6,
    },
    progressSection: {
      alignItems: "center",
      marginTop: 16,
      gap: 8,
    },
    center: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 24,
    },
  });