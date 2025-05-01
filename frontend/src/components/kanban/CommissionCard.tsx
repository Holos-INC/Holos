import { StatusKanbanWithCommissionsDTO } from "@/src/constants/kanbanTypes";
import { getImageSource } from "@/src/utils/getImageSource";
import { cardStyles, dialogStyles } from "@/src/styles/Kanban.styles";
import { useRouter } from "expo-router";
import { View, TouchableOpacity, Image, Text } from "react-native";
import { Dialog, Portal, Button, IconButton } from "react-native-paper";
import Icon from "react-native-vector-icons/Feather";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import colors from "@/src/constants/colors";
import { updateCommisionImage } from "@/src/services/commisionApi";

interface CommissionCardProps {
  commission: StatusKanbanWithCommissionsDTO;
  statusIndex: number;
  maxIndex: number;
  onMoveBack: () => void;
  onMoveForward: () => void;
  token: string;
}

export const CommissionCard: React.FC<CommissionCardProps> = ({
  commission,
  statusIndex,
  maxIndex,
  onMoveBack,
  onMoveForward,
  token,
}) => {
  const canMoveBack = statusIndex > 0;
  const isLastColumn = statusIndex === maxIndex;
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const goToCommissionDetails = () => {
    router.push(`/commissions/${commission.id}/details`);
  };
  const goToUserProfile = () => {
    router.push(`/profile/${commission.clientUsername}`);
  };

  const showDialog = () => setVisible(true);
  const hideDialog = () => {
    setVisible(false);
    setSelectedImage(null);
  };

  const handleMoveForward = () => {
    showDialog();
  };

  const confirmMoveForward = async () => {
    if (!selectedImage) {
      setError("Please upload an image of the completed artwork.");
      return;
    }

    try {
      await updateCommisionImage(commission.id, selectedImage, token);
      onMoveForward();
      setError(null);
      hideDialog();
    } catch (err) {
      setError("Error uploading image. Please try again.");
      console.error(err);
    }
  };

  const handleImageSelection = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setSelectedImage(uri);
      setError(null);
    }
  };

  return (
    <View style={cardStyles.card}>
      {commission.image && (
        <TouchableOpacity onPress={goToCommissionDetails}>
          <Image
            source={getImageSource(commission.image)}
            style={cardStyles.image}
            onError={() =>
              console.log("Error loading image:", commission.image)
            }
          />
        </TouchableOpacity>
      )}

      <View style={cardStyles.content}>
        <View style={[cardStyles.topRow, { marginBlockEnd: 3 }]}>
          <Text style={cardStyles.title} numberOfLines={1} ellipsizeMode="tail">
            {commission.name}
          </Text>
          <View style={cardStyles.priceWrapper}>
            <Text style={cardStyles.price}>{commission.price}€</Text>
          </View>
          {commission.isWaitingPayment && (
        <Text style={[cardStyles.client, { color: 'red', fontWeight: 'bold' }]}>
          Pendiente de pago
        </Text>)}
        </View>

        <View style={cardStyles.bottomRow}>
          <Text
            style={cardStyles.client}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            Pedido de{" "}
            <TouchableOpacity onPress={goToUserProfile}>
              <Text style={cardStyles.username}>
                @{commission.clientUsername}
              </Text>
            </TouchableOpacity>
          </Text>

          <View style={cardStyles.buttonRow}>
            {canMoveBack && (
              <TouchableOpacity style={cardStyles.button} onPress={onMoveBack}>
                <Icon name="arrow-left" size={16} color="#444" />
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={cardStyles.button}
              onPress={handleMoveForward}
            >
              <Icon
                name={isLastColumn ? "archive" : "arrow-right"}
                size={16}
                color="#444"
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <Portal>
        <Dialog
          visible={visible}
          onDismiss={hideDialog}
          style={dialogStyles.dialogContainer}
        >
          <Dialog.Title>
            {isLastColumn
              ? "¿Finalizar y archivar la comisión?"
              : "¿Listo para avanzar?"}
          </Dialog.Title>
          <Dialog.Content>
            {isLastColumn ? (
              <Text>
                Al confirmar, esta comisión será archivada y aparecerá en la
                pestaña de "Pedidos". ¡No olvides subir la imagen final de la
                obra maestra!
              </Text>
            ) : (
              <Text>
                Solo falta una foto para pasar al siguiente estado, ¡a capturar
                esa obra maestra!
              </Text>
            )}

            {selectedImage && (
              <Image
                source={{ uri: selectedImage }}
                style={dialogStyles.previewImage}
              />
            )}
            {error && <Text style={dialogStyles.errorText}>{error}</Text>}
          </Dialog.Content>
          <Dialog.Actions style={dialogStyles.dialogActions}>
            <View style={dialogStyles.selectButtons}>
              <IconButton
                icon="image-outline"
                size={24}
                iconColor={colors.brandPrimary}
                onPress={handleImageSelection}
                style={dialogStyles.icon}
              />
              <IconButton
                icon="file-gif-box"
                size={24}
                iconColor={colors.brandPrimary}
                onPress={() => setError("¡Por implementar!")}
                style={dialogStyles.icon}
              />
              <IconButton
                icon="script-text-outline"
                size={24}
                iconColor={colors.brandPrimary}
                onPress={() => setError("¡Por implementar!")}
                style={dialogStyles.icon}
              />
              <IconButton
                icon="album"
                size={24}
                iconColor={colors.brandPrimary}
                onPress={() => setError("¡Por implementar!")}
                style={dialogStyles.icon}
              />
              <IconButton
                icon="video-outline"
                size={24}
                iconColor={colors.brandPrimary}
                onPress={() => setError("¡Por implementar!")}
                style={dialogStyles.icon}
              />
            </View>

            <View style={dialogStyles.buttonRow}>
              <Button onPress={hideDialog}>Cancel</Button>
              <Button onPress={confirmMoveForward}>Confirm</Button>
            </View>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};