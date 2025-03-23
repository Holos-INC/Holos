import { StyleSheet } from "react-native";

export const mobileStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

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
    color: "#000000",
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

  middleSection: {
    paddingBottom: 16,
  },
  worksScrollContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 16,
    marginTop: 18,
  },
  workItem: {
    width: 260,
    marginRight: 35,
  },
  workImage: {
    width: "100%",
    height: 200,
    resizeMode: "contain",
    marginBottom: 20,
  },
  workTextContainer: {
    paddingHorizontal: 8,
    paddingVertical: 8,
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

  bottomSection: {
    paddingTop: 20,
    paddingBottom: 40,
    backgroundColor: "#F4F4F2",
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
    marginVertical: 10,
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
});

export const desktopStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  topSection: {
    height: "10%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 250,
    marginTop: 50,
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
  middleSection: {
    height: "80%",
    marginTop: 45,
  },
  worksScrollContainer: {
    alignItems: "center",
    paddingHorizontal: 40,
  },
  workItem: {
    width: 220,
    height: "100%",
    marginRight: 90,
    backgroundColor: "#FFF",
    overflow: "hidden",
  },
  workImage: {
    width: "auto",
    height: "80%",
    padding: 10,
    resizeMode: "contain",
  },
  workTextContainer: {
    marginBottom: 60,
  },
  workTitle: {
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "Merriweather-Bold",
    color: "#222",
    marginBottom: 4,
    paddingHorizontal: 4,
  },
  workArtist: {
    fontSize: 14,
    fontWeight: "500",
    fontFamily: "Merriweather",
    color: "#555",
    marginBottom: 2,
    paddingHorizontal: 4,
  },
  workSubtitle: {
    fontSize: 12,
    fontWeight: "400",
    color: "#777",
    paddingHorizontal: 4,
  },

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
  artistsScrollContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
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
    fontSize: 12,
    fontStyle: "italic",
    color: "#666",
  },

  artistsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
});
