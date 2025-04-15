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
    fontSize: 16,
    fontWeight: "500",
    color: COLORS.contentStrong,
    marginBottom: 4,
    marginTop: 8,
  },

  pageTitle: {
    fontSize: 24,
    fontWeight: "800",
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
  }
    
});
