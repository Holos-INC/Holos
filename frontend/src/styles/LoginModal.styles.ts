import { StyleSheet, Dimensions } from "react-native";
import colors from "@/src/constants/colors";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const styles = StyleSheet.create({
  /** Cubre toda la pantalla y centra el modal */
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  /** Barra superior que sirve de “handle” para arrastrar */
  handle: {
    height: 24,
    backgroundColor: colors.surfaceMuted,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  /** Caja del Dialog */
  dialog: {
    width: SCREEN_WIDTH * 0.9,
    maxWidth: 600,
    alignSelf: "center",
    paddingTop: 0,
  },
  title: { textAlign: "center", fontWeight: "bold" },
  input: { marginTop: 8, backgroundColor: colors.surfaceMuted },
  error: { color: colors.brandPrimary, marginTop: 4 },
  actions: { justifyContent: "space-between", paddingHorizontal: 8 },
  divider: { height: 1, backgroundColor: colors.surfaceMuted, marginVertical: 8 },
});

export default styles;
