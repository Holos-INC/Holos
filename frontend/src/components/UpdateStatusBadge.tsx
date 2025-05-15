import React, { useState } from "react";
import { View, Pressable, StyleSheet } from "react-native";
import { Portal, Dialog, Text, Button } from "react-native-paper";
import {
  UpdateStatus,
  UpdateStatusColors,
} from "@/src/constants/CommissionTypes";

type Props = {
  status: UpdateStatus;
};

export const UpdateStatusBadge: React.FC<Props> = ({ status }) => {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <Pressable onPress={() => setVisible(true)} style={styles.dotWrapper}>
        <View
          style={[styles.dot, { backgroundColor: UpdateStatusColors[status] }]}
        />
      </Pressable>

      <Portal>
        <Dialog
          visible={visible}
          onDismiss={() => setVisible(false)}
          style={{ alignItems: "center", alignSelf: "center" }}
        >
          <Dialog.Content style={{ gap: 8 }}>
            <View style={styles.statusRow}>
              <View style={styles.labelContainer}>
                <View
                  style={[
                    styles.dot,
                    {
                      backgroundColor: UpdateStatusColors[UpdateStatus.PENDING],
                    },
                  ]}
                />
                <Text style={styles.bold}>Pendiente.</Text>
              </View>
              <Text style={styles.description}>
                ¡Hay una actualización del artista!
              </Text>
            </View>

            <View style={styles.statusRow}>
              <View style={styles.labelContainer}>
                <View
                  style={[
                    styles.dot,
                    {
                      backgroundColor:
                        UpdateStatusColors[UpdateStatus.APPROVED],
                    },
                  ]}
                />
                <Text style={styles.bold}>Aprobado.</Text>
              </View>
              <Text style={styles.description}>
                Se aceptó la última entrega.
              </Text>
            </View>

            <View style={styles.statusRow}>
              <View style={styles.labelContainer}>
                <View
                  style={[
                    styles.dot,
                    {
                      backgroundColor:
                        UpdateStatusColors[UpdateStatus.REJECTED],
                    },
                  ]}
                />
                <Text style={styles.bold}>Rechazado.</Text>
              </View>
              <Text style={styles.description}>
                Se rechazó la última entrega.
              </Text>
            </View>

            <View style={styles.statusRow}>
              <View style={styles.labelContainer}>
                <View
                  style={[
                    styles.dot,
                    { backgroundColor: UpdateStatusColors[UpdateStatus.NONE] },
                  ]}
                />
                <Text style={styles.bold}>Sin cambios.</Text>
              </View>
              <Text style={styles.description}>
                No hay nuevas actualizaciones.
              </Text>
            </View>
          </Dialog.Content>
        </Dialog>
      </Portal>
    </>
  );
};

const styles = StyleSheet.create({
  dotWrapper: {
    position: "absolute",
    top: 12,
    right: 12,
    zIndex: 5,
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: "white",
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flexShrink: 0,
  },
  description: {
    flex: 1,
    textAlign: "right",
    fontStyle: "italic",
    fontSize: 14,
    color: "#444",
  },
  bold: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#444",
  },
});
