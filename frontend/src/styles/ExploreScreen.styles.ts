import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");
const isBigScreen = width >= 1024;

const MOBILE_CATEGORY_WIDTH = 180;
const MOBILE_CATEGORY_HEIGHT = 200;
const MOBILE_ARTIST_WIDTH = 160;
const MOBILE_ARTIST_HEIGHT = 180;

export default StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 16,
  },

  searchBar: {
    width: "80%",
    alignSelf: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: isBigScreen ? 14 : 10,
    marginBottom: 16,
    backgroundColor: "#f9f9f9",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    fontSize: 18,
    color: "#000",
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
    paddingHorizontal: 16,
  },

  categoriesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  categoryItemBig: {
    marginTop: 6,
    aspectRatio: 0.94,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    elevation: 3,
  },
  categoryImageContainerBig: {
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
  categoryTextBig: {
    marginTop: 2,
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
  },

  categoriesContainerMobile: {},
  categoryItemMobile: {
    width: MOBILE_CATEGORY_WIDTH,
    height: MOBILE_CATEGORY_HEIGHT,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  categoryImageContainerMobile: {
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
  categoryTextMobile: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
  },

  seeMoreButton: {
    width: "95%",
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
    alignSelf: "center",
  },

  artistsContainer: {
    paddingHorizontal: 16,

    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
  },

  artistItemBig: {
    aspectRatio: 0.94,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    elevation: 3,
  },
  artistImageContainerBig: {
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
  artistTextBig: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
  },

  artistItemMobile: {
    aspectRatio: 0.94,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    elevation: 3,
  },
  artistImageContainerMobile: {
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
  artistTextMobile: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
  },

  categoryImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  artistImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  leftArrow: {
    position: "absolute",
    left: 0,
    top: "50%",
    transform: [{ translateY: -12 }],
    zIndex: 10,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 6,
    elevation: 5,
    marginLeft: 7,
  },
  rightArrow: {
    position: "absolute",
    right: 0,
    top: "50%",
    transform: [{ translateY: -12 }],
    zIndex: 10,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 6,
    elevation: 5,
    marginRight: 7,
  },
});
