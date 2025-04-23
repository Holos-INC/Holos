import { StyleSheet } from "react-native";
import COLORS from "@/src/constants/colors";

export const styles = StyleSheet.create({
  formContainer: {
    backgroundColor: COLORS.surfaceBase,
    padding: 16,
    borderRadius: 12,
    margin: 16,
    gap: 12,
  },

  title: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: COLORS.surfaceMuted,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 16,
    color: COLORS.contentStrong,
  },

  input: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: COLORS.surfaceMuted,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 16,
    color: COLORS.contentStrong,
    minHeight: 90,
    textAlignVertical: "top",
  },

  dateButton: {
    backgroundColor: COLORS.brandSecondary,
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },

  dateButtonText: {
    color: "white",
    fontWeight: "500",
  },

  errorText: {
    color: COLORS.semanticError || "red",
    fontSize: 12,
  },

  previewContainer: {
    backgroundColor: COLORS.surfaceMuted,
    borderRadius: 8,
    height: 180,
    justifyContent: "center",
    alignItems: "center",
  },

  previewImage: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },

  placeholderText: {
    color: COLORS.brandSecondary,
    fontSize: 14,
  },

  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
    gap: 12,
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

  submitButton: {
    backgroundColor: COLORS.accentInfo,
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },

  submitButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },

  webDateInput: {
    padding: 8,
    borderRadius: 6,
    borderColor: COLORS.brandSecondary,
    borderWidth: 1,
  },

  textArea: {
    minHeight: 90,
    textAlignVertical: "top",
  },

  label: {
    fontSize: 18,
    fontWeight: "500",
    color: COLORS.brandPrimary,
    marginBottom: 4,
    marginTop: 8,
  },

  subtext: {
    fontSize: 16,
    color: COLORS.brandSecondary,
  },

  pageTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: COLORS.brandPrimary,
    textAlign: "center",
    marginTop: 16,
    marginBottom: 12,
  },

  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
    gap: 12,
  },

  cancelButton: {
    backgroundColor: COLORS.semanticError,
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },

  cancelButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },

  priceTableContainer: {
    backgroundColor: COLORS.surfaceBase,
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 24,
    gap: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },

  priceTableText: {
    fontSize: 16,
    color: COLORS.brandSecondary,
  },

  priceTableImage: {
    width: "100%",
    maxWidth: 400,
    paddingHorizontal: 750,
    aspectRatio: 1.5,
    resizeMode: "contain",
  },

  imageWrapper: {
    marginVertical: 12,
    alignItems: "center",
    paddingHorizontal: 16,
  },
  removeButton: {
    backgroundColor: "#FFEEEE",
    borderColor: "#FF6666",
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 10,
  },

  removeButtonText: {
    color: "#FF3333",
    fontWeight: "600",
  },
});
