import { StyleSheet } from "react-native";

/* -------------------------  MOBILE  ------------------------- */
export const mobileStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  /* ---------- top ---------- */
  topSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 20,
    marginBottom: 10,
  },
  topSectionText: {
    fontSize: 22,
    fontWeight: "600",
    color: "#000",
    fontFamily: "Merriweather-Bold",
    paddingLeft: 26,
  },
  topSectionSecondText: {
    fontFamily: "Merriweather-Italic",
    fontSize: 14,
    color: "#666",
  },
  topSectionRight: {
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 26,
  },
  /* ---------- works ---------- */
  worksContainer: {
    paddingHorizontal: 12,
    paddingBottom: 24,
  },
  workItem: {
    backgroundColor: "#FFF",
    overflow: "hidden",
  },
  workImage: {
    width: "100%",
    height: 180,
    resizeMode: "contain",
  },
  workTextContainer: {
    padding: 8,
  },
  workTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#222",
    marginBottom: 2,
    fontFamily: "Merriweather-Bold",
  },
  workArtist: {
    fontSize: 14,
    fontWeight: "500",
    color: "#555",
    fontFamily: "Merriweather-Bold",
    marginBottom: 2,
  },
  workSubtitle: {
    fontSize: 12,
    fontWeight: "400",
    fontFamily: "Merriweather-Italic",
    color: "#777",
  },
  /* ---------- search bar ---------- */
  searchBar: {
    backgroundColor: "#F4F4F2",
    padding: 10,
    marginHorizontal: 16,
    borderRadius: 8,
    fontSize: 16,
    color: "#333",
    marginBottom: 16,
  },
  /* ---------- pagination ---------- */
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 8,
  },
  paginationButton: {
    padding: 4,
  },
  paginationDisabled: {
    opacity: 0.3,
  },
  /* ---------- bottom (featured artists) ---------- */
  bottomSection: {
    paddingTop: 20,
    paddingBottom: 40,
    backgroundColor: "#F4F4F2", // gris clarito
  },
  bottomSectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  bottomSectionHeaderText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    fontFamily: "Merriweather-Bold",
    paddingLeft: 26,
  },
  artistsContainer: {
    flexDirection: "column",
    paddingHorizontal: 50,
  },
  artistCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F4F4F2",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  artistImage: {
    width: 80,
    height: 80,
    resizeMode: "cover",
    marginRight: 16,
    backgroundColor: "#DDD",
  },
  artistTextContainer: {
    flex: 1,
    justifyContent: "center",
  },
  artistName: {
    fontFamily: "Merriweather-Regular",
    fontSize: 16,
    color: "#222",
    marginBottom: 2,
  },
  artistLocation: {
    fontFamily: "Merriweather-Italic",
    fontSize: 12,
    color: "#666",
  },
  suggestionsContainer: {
    position: "absolute",
    top: 85,
    left: 16,
    right: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    zIndex: 999,
  },
  suggestionItem: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  suggestionText: {
    fontSize: 14,
    color: "#333",
  },
});

/* ------------------------  DESKTOP  ------------------------ */
export const desktopStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  /* ---------- top ---------- */
  topSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 250,
    marginTop: 5,
    marginBottom: 10,
  },
  topSectionText: {
    fontSize: 28,
    fontWeight: "600",
    color: "#333",
    fontFamily: "Merriweather",
  },
  topSectionSecondText: {
    fontFamily: "Merriweather-Italic",
    fontSize: 14,
    color: "#666",
  },
  topSectionRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  /* ---------- works ---------- */
  worksContainer: {},
  workItem: {
    backgroundColor: "#FFF",
    overflow: "hidden",
  },
  workImage: {
    width: "100%",
    height: 220,
    resizeMode: "contain",
  },
  workTextContainer: {
    padding: 10,
    marginLeft: 80,
    marginTop: 20,
  },
  workTitle: {
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "Merriweather-Bold",
    color: "#222",
    marginBottom: 4,
  },
  workArtist: {
    fontSize: 14,
    fontWeight: "500",
    fontFamily: "Merriweather",
    color: "#555",
    marginBottom: 2,
  },
  workSubtitle: {
    fontSize: 12,
    fontWeight: "400",
    color: "#777",
  },
  /* ---------- search bar ---------- */
  searchBar: {
    backgroundColor: "#F4F4F2",
    padding: 12,
    marginHorizontal: 250,
    borderRadius: 8,
    fontSize: 18,
    color: "#333",
    marginBottom: 24,
  },
  /* ---------- pagination ---------- */
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 8,
  },
  paginationButton: {
    padding: 4,
  },
  paginationDisabled: {
    opacity: 0.3,
  },
  /* ---------- bottom (featured artists) ---------- */
  bottomSection: {
    backgroundColor: "#F4F4F2",
    paddingVertical: 10,
    alignItems: "center",
    margin: 10,
  },
  bottomSectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "90%",
    marginBottom: 16,
  },
  bottomSectionHeaderText: {
    marginLeft: 245,
    marginTop: 20,
    marginBottom: 10,
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
    fontFamily: "Merriweather-Regular",
  },
  artistsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  artistCard: {
    width: 280,
    height: 70,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F4F4F2",
    marginBottom: 25,
    borderWidth: 2,
    borderColor: "#E0E0E0",
    marginHorizontal: 10,
  },
  artistImage: {
    width: 70,
    height: 70,
    resizeMode: "cover",
    marginRight: 16,
    backgroundColor: "#DDD",
  },
  artistTextContainer: {
    flex: 1,
  },
  artistName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  artistLocation: {
    fontFamily: "Merriweather-Italic",
    fontSize: 12,
    color: "#666",
  },
  suggestionsContainer: {
    position: "absolute",
    top: 120, // ajusta según el input
    left: 250,
    right: 250,
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5, // para Android
    zIndex: 999, // para iOS y web
  },

  suggestionItem: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  suggestionText: {
    fontSize: 16,
    color: "#333",
  },
});
