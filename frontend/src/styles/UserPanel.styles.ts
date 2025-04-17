import { StyleSheet } from "react-native";
import COLORS from "@/src/constants/colors";

export const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surfaceBase,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    margin: 16,
    gap: 8,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.brandPrimary,
  },
  role: {
    fontSize: 16,
    color: COLORS.brandSecondary
  },
});
