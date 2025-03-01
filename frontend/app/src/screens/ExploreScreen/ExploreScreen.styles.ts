import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");
const isBigScreen = width >= 1024;

export default StyleSheet.create({
  container: {
    flex: 1,
    // OJO: este paddingHorizontal: 16 se suma al que calculas en horizontalPadding
    // Para que no haya conflicto, puedes dejarlo en 0 y manejarlo
    // en tu cálculo itemWidth. O lo mantienes, pero ajusta el horizontalPadding.
    paddingHorizontal: 16,
    paddingVertical: 16,
  },

  searchBar: {
    width: "80%", // No ocupa todo el ancho
    alignSelf: "center", // Centrada
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 24, // Bordes más redondeados, estilo pill
    paddingHorizontal: 16,
    paddingVertical: isBigScreen ? 14 : 10,
    marginBottom: 16,
    backgroundColor: "#f9f9f9", // Fondo claro
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2, // Para Android
    fontSize: 18, // Aquí defines el tamaño de la letra
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#333",
    marginTop: 16,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingBottom: 4,
    letterSpacing: 0.5,
  },

  categoriesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
  },

  categoryItem: {
    marginTop: 6,
    aspectRatio: 0.94,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    elevation: 3,
  },

  categoryImageContainer: {
    width: "80%",
    aspectRatio: 1,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 5,
    overflow: "hidden",
  },

  categoryImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  categoryText: {
    marginTop: 2,
    fontSize: isBigScreen ? 20 : 12,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
  },

  seeMoreButton: {
    width: "100%",
    height: 50,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 16,
    marginBottom: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },

  artistsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
  },

  artistItem: {
    aspectRatio: 0.94,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    elevation: 3,
  },

  artistImageContainer: {
    width: "80%",
    aspectRatio: 1,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 5,
    overflow: "hidden",
  },

  artistImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  artistText: {
    fontSize: isBigScreen ? 20 : 12,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
  },
});
