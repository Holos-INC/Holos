import { CommissionDTO } from "@/src/constants/CommissionTypes";
import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import colors from "@/src/constants/colors";
import { BASE_URL } from "@/src/constants/api";

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
    <View style={styles.ticket}>
      <View style={[styles.row, { justifyContent: "center" }]}>
        <Text style={styles.header}>Detalles del pago: </Text>
        <Text style={[styles.header, { color: colors.brandPrimary }]}>
          {commission.name}
        </Text>
      </View>
      <View style={styles.separator} />
      <View style={styles.row}>
        <Text style={styles.label}>Artista:</Text>
        <View style={styles.dots} />
        <Text style={styles.value}>@{commission.artistUsername}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Cliente:</Text>
        <View style={styles.dots} />
        <Text style={styles.value}>@{commission.clientUsername}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Descripción:</Text>
        <View style={styles.dots} />
        <Text style={styles.description} numberOfLines={3} ellipsizeMode="tail">
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
        <View style={styles.dots} />
        <Text style={styles.value}> {(commission.price).toFixed(2)}€</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Tarifa de Holos (6%):</Text>
        <View style={styles.dots} />
        <Text style={styles.value}>
          {(Math.round(FEE * commission.price * 100) / 100).toFixed(2)}€
        </Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Tarifa de Stripe (1,5%):</Text>
        <View style={styles.dots} />
        <Text style={styles.value}>
        {( Math.round((0.015 * commission.price + 0.25) * 100) / 100 ).toFixed(2)}€
        </Text>
      </View>
      <View style={styles.separator} />
      <View style={styles.row}>
        <Text style={styles.label}>Precio neto:</Text>
        <View style={styles.dots} />
        <Text style={[styles.value]}>
          {((Math.round(commission.price * (1-FEE-STRIPE_FEE)*100) / 100)-0.25).toFixed(2)}€
        </Text>
      </View>
    </View>
  );
};

export default PaymentDetails;

const styles = StyleSheet.create({
  ticket: {
    backgroundColor: "white",
    borderRadius: 5,
    padding: 20,
    alignSelf: "center",
    shadowColor: colors.brandPrimary,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 6,
    maxWidth: "100%",
  },
  header: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.contentStrong,
    marginBottom: 12,
    textAlign: "center",
  },
  separator: {
    height: 2,
    backgroundColor: colors.contentStrong,
    marginVertical: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 6,
  },
  label: {
    color: colors.contentStrong,
    fontSize: 14,
    minWidth: 80,
  },
  dots: {
    flex: 1,
    borderBottomWidth: 1,
    borderStyle: "dotted",
    borderColor: colors.accentInfo,
    marginHorizontal: 6,
  },
  value: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.brandPrimary,
  },
  total: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.brandPrimary,
  },
  imageWrapper: {
    paddingHorizontal: 16,
    paddingTop: 12,
    alignItems: "center",
  },
  image: {
    height: 220,
    width: "100%",
    borderRadius: 12,
  },
  description: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.brandPrimary,
    textAlign: "justify",
  },
});
