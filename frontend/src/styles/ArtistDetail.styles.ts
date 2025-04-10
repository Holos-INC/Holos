import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");
const isMobile = width < 768; // Ajusta el umbral según tus necesidades

/* ESTILOS PARA ESCRITORIO */
const desktopStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
    paddingTop: 40,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  backArrow: {
    fontSize: 15,
    marginRight: 5,
    transform: [{ translateY: -3 }],
  },
  backText: {
    fontFamily: "Merriweather-Regular",
    fontSize: 15,
    marginLeft: 5,
  },
  divider: {
    height: 1,
    backgroundColor: "#ccc",
    margin: 8,
    marginBottom: 20,
  },
  topContainer: {
    flexDirection: "row",
    marginBottom: 0,
  },
  profileContainer: {
    height: 250,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    width: "40%",
    marginHorizontal: 80,
  },
  profileImage: {
    height: "100%",
    resizeMode: "contain",
    marginRight: 16,
  },
  profileTextContainer: {
    flex: 1,
    justifyContent: "center",
    paddingLeft: 16,
    marginRight: 16,
  },
  artistName: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 8,
    fontFamily: "Merriweather",
  },
  artistLocation: {
    fontSize: 18,
    color: "#666",
    fontFamily: "Merriweather",
  },
  topRight: {
    flex: 1,
    marginTop: 20,
  },
  descriptionTitle: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 8,
    fontFamily: "Merriweather",
  },
  descriptionText: {
    marginTop: 20,
    fontSize: 18,
    lineHeight: 30,
    fontFamily: "Merriweather",
    color: "#65635F",
    paddingRight: 20,
  },
  button: {
    backgroundColor: "#3E334E",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginBottom: 24,
    marginTop: 16,
    marginLeft: 80,
    width: "40%",
  },
  buttonText: {
    alignSelf: "center",
    color: "#fff",
    fontSize: 16,
  },
  bottomContainer: {
    height: 250,
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
    borderRadius: 8,
  },
  workImage: {
    width: "100%",
    height: "80%",
    padding: 10,
    resizeMode: "contain",
  },
  workTextContainer: {
    paddingHorizontal: 4,
    paddingBottom: 10,
  },
  workTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  workArtist: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 2,
  },
  workSubtitle: {
    fontSize: 12,
    fontWeight: "400",
  },
});

/* ESTILOS PARA MÓVILES MODIFICADOS */
const mobileStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 16,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  backArrow: {
    fontSize: 18,
    marginRight: 5,
  },
  backText: {
    fontFamily: "Merriweather-Regular",
    fontSize: 16,
  },
  divider: {
    height: 1,
    backgroundColor: "#ccc",
    marginVertical: 10,
  },
  /* El contenedor principal se organiza en columna */
  topContainer: {
    flexDirection: "column",
    marginBottom: 15,
  },
  /* Perfil: la imagen y el texto se muestran en columna y centrados */
  profileContainer: {
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    marginBottom: 15,
  },
  profileImage: {
    height: 150,
    width: 150,
    borderRadius: 10, // Para imagen circular (opcional)
    resizeMode: "cover",
    marginBottom: 5,
  },
  profileTextContainer: {
    alignItems: "center",
  },
  artistName: {
    fontSize: 24, // Reducido respecto al escritorio (32)
    fontWeight: "bold",
    color: "#000",
    marginBottom: 4,
    fontFamily: "Merriweather-Regular",
  },
  artistLocation: {
    fontSize: 16,
    color: "#666",
    fontFamily: "Merriweather",
  },
  /* Descripción: se coloca debajo del perfil */
  topRight: {
    width: "100%",
    paddingHorizontal: 10,
    marginTop: 10,
    alignItems: "center",
  },
  descriptionTitle: {
    fontSize: 24, // Reducido respecto al escritorio (30)
    fontWeight: "bold",
    marginBottom: 8,
    fontFamily: "Merriweather-Bold",
  },
  descriptionText: {
    fontSize: 16, // Reducido respecto al escritorio (18)
    lineHeight: 24,
    fontFamily: "Merriweather-Regular",
    color: "#65635F",
    textAlign: "center",
  },
  /* Botón: ocupa el ancho completo */
  button: {
    backgroundColor: "#3E334E",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: "center",
    marginVertical: 15,
    width: "100%",
  },
  buttonText: {
    alignSelf: "center",
    color: "#fff",
    fontSize: 16,
  },
  /* Scroll de works */
  bottomContainer: {
    width: "100%",
    height: 250,
  },
  worksScrollContainer: {
    alignItems: "center",
    paddingHorizontal: 10,
    marginBottom: 40,
  },
  workItem: {
    width: 220,
    height: "100%",
    marginRight: 16,
    backgroundColor: "#FFF",
    overflow: "hidden",
  },
  workImage: {
    width: "100%",
    height: "80%",
    padding: 10,
    resizeMode: "contain",
  },
  workTextContainer: {
    paddingHorizontal: 4,
    paddingBottom: 10,
  },
  workTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  workArtist: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 2,
  },
  workSubtitle: {
    fontSize: 12,
    fontWeight: "400",
  },
});

/* Selección de estilos según el ancho de la pantalla */
const styles = isMobile ? mobileStyles : desktopStyles;

export default styles;
