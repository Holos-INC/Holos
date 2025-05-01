import { StyleSheet } from "react-native";
import {
  mobileStyles as exploreMobile,
  desktopStyles as exploreDesktop,
} from "@/src/styles/Explore.styles";

import { ViewStyle } from "react-native";

const headerBase: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
};

export const mobileStyles = StyleSheet.create({
  ...exploreMobile,

  /* ---------- cabeceras de sección ---------- */
  sectionWrapper: {
    backgroundColor: "#FFFFFF",
  },
  sectionHeader: {
    ...headerBase,
    paddingHorizontal: 16,
    paddingTop: 10,
    marginBottom: 10,
  },
  sectionHeaderText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    fontFamily: "Merriweather-Bold",
    paddingLeft: 26,
  },

  /* ---------- fondo gris artistas (reuse Explore) ---------- */
  bottomSection: {
    ...exploreMobile.bottomSection,
  },
  bottomSectionHeader: {
    ...exploreMobile.bottomSectionHeader,
  },
  bottomSectionHeaderText: {
    ...exploreMobile.bottomSectionHeaderText,
  },

  /* ---------- mensaje vacío ---------- */
  noResultsText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#888",
  },
});

export const desktopStyles = StyleSheet.create({
  ...exploreDesktop,

  sectionWrapper: {
    backgroundColor: "#FFFFFF",
  },
  sectionHeader: {
    ...headerBase,
    paddingHorizontal: 250,
    paddingTop: 10,
    marginBottom: 10,
  },
  sectionHeaderText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    fontFamily: "Merriweather-Bold",
  },

  bottomSection: {
    ...exploreDesktop.bottomSection,
  },
  bottomSectionHeader: {
    ...exploreDesktop.bottomSectionHeader,
  },
  bottomSectionHeaderText: {
    ...exploreDesktop.bottomSectionHeaderText,
  },

  noResultsText: {
    fontSize: 16,
    color: "#888",
    marginTop: 20,
    textAlign: "center",
  },
});
