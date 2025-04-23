import { StyleSheet } from "react-native";
import COLORS from "@/src/constants/colors";
import colors from "@/src/constants/colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surfaceMuted,
  },
  formWrapper: {
    backgroundColor: COLORS.surfaceBase,
    padding: 16,
    borderRadius: 12,
    margin: 16,
    gap: 12,
    alignItems: "center",
  },

  uploadTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.brandPrimary,
    textAlign: "center",
    marginBottom: 16,
  },

  formLabel: {
    fontSize: 18,
    fontWeight: "500",
    color: COLORS.brandPrimary,
    marginTop: 8,
    textAlign: "left",
    alignSelf: "flex-start",
    marginLeft: 8,
    marginBottom: 4,
  },

  inputNameWork: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: COLORS.surfaceMuted,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    width: "100%",
  },

  inputDescriptionBox: {
    width: "100%",
  },

  inputDescriptionWork: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: COLORS.surfaceMuted,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    height: 100,
    textAlignVertical: "top",
    width: "100%",
  },

  inputCostWork: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: COLORS.surfaceMuted,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    width: "100%",
  },

  previewImageContainer: {
    backgroundColor: COLORS.surfaceMuted,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.surfaceMuted,
    width: "100%",
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
  },

  previewImage: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
    resizeMode: "contain",
  },

  placeholderText: {
    color: COLORS.brandSecondary,
    fontSize: 14,
  },

  errorText: {
    color: COLORS.semanticError || "red",
    fontSize: 12,
  },

  buttonContainer: {
    marginTop: 20,
    gap: 12,
    width: "100%",
  },

  containerUnableUpload: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.surfaceMuted,
    padding: 20,
  },

  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginTop: 20,
    width: "100%",
  },

  sendButton: {
    backgroundColor: COLORS.accentInfo,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },

  sendButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },

  cancelButton: {
    backgroundColor: COLORS.semanticError,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },

  cameraButton: {
    flexDirection: "row",
    backgroundColor: COLORS.brandPrimary,
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    flex: 1,
  },

  cameraButtonText: {
    color: "white",
    fontWeight: "500",
    fontSize: 14,
  },

  cancelButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },

  textContainerUnableUpload: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.contentStrong,
    textAlign: "center",
  },
  removeButton: {
    backgroundColor: "#FFEEEE",
    borderColor: "#FF6666",
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 6,
  },

  removeButtonText: {
    color: "#FF3333",
    fontWeight: "600",
  },
});
