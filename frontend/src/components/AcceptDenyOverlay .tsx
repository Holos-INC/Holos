import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Image,
  StyleSheet,
  Text,
  useWindowDimensions,
} from "react-native";
import { IconButton } from "react-native-paper";
import { acceptArtistImage, denyArtistImage } from "../services/commisionApi";
import { handleError } from "../utils/handleError";
import { CommissionDTO } from "../constants/CommissionTypes";
import { getImageSource } from "../utils/getImageSource";
import { BlurView } from "expo-blur";
import colors from "../constants/colors";

type Props = {
  commission: CommissionDTO;
  token: string;
  onDone: () => void;
};

export const AcceptDenyOverlay: React.FC<Props> = ({
  commission,
  token,
  onDone,
}) => {
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const { width: imageNaturalWidth, height: imageNaturalHeight } = imageSize;
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();

  const padding = 24;

  const { displayWidth, displayHeight } = useMemo(() => {
    if (!imageNaturalWidth || !imageNaturalHeight)
      return { displayWidth: 0, displayHeight: 0 };

    const maxWidth = windowWidth - padding * 2;
    const maxHeight = windowHeight * 0.6;

    let width = maxWidth;
    let height = maxWidth * (imageNaturalHeight / imageNaturalWidth);

    if (height > maxHeight) {
      height = maxHeight;
      width = maxHeight * (imageNaturalWidth / imageNaturalHeight);
    }

    return { displayWidth: width, displayHeight: height };
  }, [imageNaturalWidth, imageNaturalHeight, windowWidth, windowHeight]);

  const handleDecision = async (type: "APPROVED" | "REJECTED") => {
    try {
      if (type === "APPROVED") {
        await acceptArtistImage(commission.id, token);
      } else {
        await denyArtistImage(commission.id, token);
      }

      onDone();
    } catch (err) {
      handleError("Error", "No se pudo procesar tu decisión.");
      console.error("Error in image decision:", err);
    }
  };

  useEffect(() => {
    const source = getImageSource(commission.newImage || "");
    const uri = typeof source === "string" ? source : source.uri;

    if (!uri) return;

    Image.getSize(
      uri,
      (width, height) => setImageSize({ width, height }),
      (error) =>
        console.warn("No se pudo obtener el tamaño de la imagen", error)
    );
  }, [commission.newImage]);

  return (
    <BlurView intensity={25} style={styles.overlay} tint="light">
      <IconButton
        icon="close"
        size={24}
        iconColor="#666"
        onPress={onDone}
        style={styles.closeButton}
      />

      <Text style={styles.title}>¿Qué te parece esta entrega?</Text>
      <Image
        source={getImageSource(commission.newImage || "")}
        style={{
          width: displayWidth,
          height: displayHeight,
        }}
        resizeMode="contain"
      />

      <View style={styles.iconRow}>
        <IconButton
          icon="heart-broken"
          iconColor={colors.brandPrimary}
          size={50}
          onPress={() => handleDecision("REJECTED")}
        />
        <IconButton
          icon="heart"
          iconColor={colors.brandPrimary}
          size={50}
          onPress={() => handleDecision("APPROVED")}
        />
      </View>
    </BlurView>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
  },
  iconRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  closeButton: {
    position: "absolute",
    top: 16,
    right: 16,
    zIndex: 200,
    borderRadius: 999,
  },
});
