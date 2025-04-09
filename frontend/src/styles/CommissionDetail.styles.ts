import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF", padding: 30 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#FFFFFF" },
  backButton: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  backButtonText: { color: "#000", fontSize: 16, marginLeft: 8 },
  errorText: { color: "#FF0000", fontSize: 16, textAlign: "center", marginTop: 20 },
  card: { flexDirection: "row", backgroundColor: "#F8F8F8", padding: 30, borderRadius: 8, marginBottom: 20, justifyContent: "space-between" },
  leftSection: { flex: 2, paddingRight: 40 },
  rightSection: { flex: 1, alignItems: "center" },
  clientTitle: { fontSize: 22, fontWeight: "bold", marginBottom: 5 },
  clientName: { fontSize: 20, fontWeight: "bold", marginBottom: 5 },
  priceLabel: { fontSize: 18, fontWeight: "bold", marginBottom: 5 },
  detailTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  text: { fontSize: 16, color: "#333", textAlign: "justify" },
  buttonRow: { flexDirection: "row", justifyContent: "space-between", width: "100%" },
  totalPrice: { fontSize: 18, fontWeight: "bold", color: "#183771", alignSelf: "flex-start", marginBottom: 10 },
  imagePlaceholder: { width: 150, height: 150, borderRadius: 8, backgroundColor: "#E0E0E0", justifyContent: "center", alignItems: "center", marginBottom: 20 },
  clientImage: { width: 150, height: 150, borderRadius: 8 },
  imagePlaceholderText: { fontSize: 14, color: "#888", textAlign: "center" },
  priceInput: { fontSize: 18, fontWeight: "bold", color: "#183771", textAlign: "center", marginBottom: 10, borderWidth: 1, borderColor: "#E5E7EB", borderRadius: 5, padding: 8, width: "80%" },
  adjustButton: { backgroundColor: "#D4A5F7", paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8 },
  acceptButton: { backgroundColor: "#4CAF50", paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8 },
  rejectButton: { backgroundColor: "#F44336", paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8 },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16, textAlign: "center" }
});