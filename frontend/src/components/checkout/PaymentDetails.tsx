import { CommissionDTO } from "@/src/constants/CommissionTypes";
import React from "react";
import { View, Text, StyleSheet, Image, ImageBackground } from "react-native";
import { BASE_URL } from "@/src/constants/api";
import colors from "@/src/constants/colors";
import {
  getHolosFee,
  getNetPrice,
  getStripeFee,
  HOLOS,
  STRIPE_FIXED,
} from "@/src/utils/priceUtils";

type Props = {
  commission: CommissionDTO;
};
const FEE = 0.06;
const STRIPE_FEE = 0.015;

const PaymentDetails = ({ commission }: Props) => {
  const isBase64Path = (base64: string): boolean => {
    try {
      const decoded = atob(base64);
      return decoded.startsWith("/images/");
    } catch (e) {
      return false;
    }
  };
  return (
    <ImageBackground
      source={require("@/assets/images/paper.png")}
      style={styles.ticket}
      imageStyle={{ resizeMode: "cover" }}
    >
      <View style={{ alignItems: "center" }}>
        <Text style={[styles.label, { fontSize: 14 }]}>
          ORDER #{commission.id.toString().padStart(4, "0")} — {commission.name}
        </Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>DEADLINE: </Text>
        <Text style={styles.value}>
          {new Date(commission.milestoneDate)
            .toLocaleDateString("es-ES", {
              weekday: "long",
              day: "numeric",
              month: "short",
              year: "numeric",
            })
            .toUpperCase()}
        </Text>
      </View>

      <View style={styles.separator} />
      <View style={styles.row}>
        <Text style={styles.label}>Descripción:</Text>
        <Text style={styles.value} numberOfLines={3} ellipsizeMode="tail">
          {commission.description}
        </Text>
      </View>
      {commission.image && (
        <View style={{ marginTop: 8 }}>
          <View style={styles.imageWrapper}>
            <Image
              source={{
                uri: isBase64Path(commission.image)
                  ? `${BASE_URL}${atob(commission.image)}`
                  : `data:image/jpeg;base64,${commission.image}`,
              }}
              style={styles.image}
              resizeMode="contain"
              onError={() =>
                console.log("Error cargando imagen:", commission.image)
              }
            />
          </View>
        </View>
      )}

      <View style={styles.separator} />

      <View style={styles.row}>
        <Text style={styles.label}>Precio bruto:</Text>
        <Text style={styles.value}> {commission.price.toFixed(2)}€</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Tarifa de Holos ({HOLOS * 100}%):</Text>
        <Text style={styles.value}>
          {getHolosFee(commission.price).toFixed(2)}€
        </Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Stripe (1.5%):</Text>
        <Text style={styles.value}>
          {(commission.price * STRIPE_FEE).toFixed(2)}€
        </Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Stripe (fijo):</Text>
        <Text style={styles.value}>{STRIPE_FIXED}€</Text>
      </View>

      <View style={styles.separator} />
      <View style={styles.row}>
        <Text style={styles.label}>Precio neto:</Text>
        <Text style={[styles.value]}>
          {getNetPrice(commission.price).toFixed(2)}€
        </Text>
      </View>
      <View style={{ gap: 5, alignItems: "center" }}>
        <Text style={styles.value}>
          ARTISTA RESPONSABLE: {commission.artistUsername.toUpperCase()}
        </Text>
        <Text style={[styles.value]}>¡GRACIAS POR ELEGIR ARTE REAL!</Text>
      </View>
    </ImageBackground>
  );
};

export default PaymentDetails;

const styles = StyleSheet.create({
  ticket: {
    backgroundColor: "#fff",
    padding: 20,
    width: 300,
    alignSelf: "center",
    justifyContent: "center",
    gap: 6,
    shadowColor: colors.brandPrimary,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 6,
    maxWidth: "100%",
    overflow: "hidden",
  },
  header: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.contentStrong,
    marginBottom: 12,
    textAlign: "center",
  },
  separator: {
    height: 1,
    backgroundColor: "#444",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 2,
  },
  label: {
    fontFamily: "courier",
    minWidth: 110,
    fontWeight: "bold",
    color: "#444",
    fontSize: 12,
    textTransform: "uppercase",
  },
  value: {
    fontFamily: "courier",
    color: "#444",
    fontSize: 12,
    textTransform: "uppercase",
    textAlign: "justify",
  },
  imageWrapper: {
    paddingVertical: 8,
    alignItems: "center",
  },
  image: {
    height: 200,
    width: "100%",
    borderRadius: 4,
  },
});
