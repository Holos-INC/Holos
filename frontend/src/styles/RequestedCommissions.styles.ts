import { StyleSheet } from "react-native";

export const indexStyles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
    color: "#999",
  },
  cardGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 16,
  },
});

export const commissionCardstyles = StyleSheet.create({
  card: {
    width: "100%",
    maxWidth: 320,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#fff",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 16,
    paddingBottom: 16,
  },
  image: {
    width: "100%",
    height: 140,
    resizeMode: "cover",
  },
  content: {
    padding: 12,
  },
  titleContainer: {
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  artist: {
    fontSize: 12,
    color: "#666",
  },
  counter: {
    fontSize: 12,
    color: "#333",
    alignSelf: "flex-end",
  },
  buttonRow: {
    flexDirection: "row",
    marginTop: 12,
  },
});

export const progressDotsStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
});
