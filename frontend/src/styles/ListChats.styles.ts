import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  // Fondo principal
  container: {
    flex: 1,
    backgroundColor: "#ADD8E6", // Azul pastel suave
  },
  // Contenedor de la lista
  listContainer: {
    padding: 10,
  },
  // Burbuja rosita (TouchableOpacity) que se puede pulsar
  chatItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: "#FFE4EC", // Rosita pastel
    // Sombras suaves
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
  chatImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  chatInfo: {
    flex: 1,
  },
  chatTitle: {
    fontSize: 16,
    fontFamily: "DancingScript-Regular",
    color: "#333",
    marginBottom: 2,
  },
  chatSubtitle: {
    fontSize: 14,
    fontFamily: "DancingScript-Regular",
    color: "#666",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontFamily: "DancingScript-Regular",
    fontSize: 16,
    color: "#333",
  },
});
