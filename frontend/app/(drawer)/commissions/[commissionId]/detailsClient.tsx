import { useLocalSearchParams, useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { acceptCommission, rejectCommission, getCommissionByIdDetails, requestChangesCommission, toPayCommission, waitingCommission } from "@/src/services/commisionApi";
import { CommissionProtected } from "@/src/constants/CommissionTypes";
import { AuthenticationContext } from "@/src/contexts/AuthContext";
import ProtectedRoute from "@/src/components/ProtectedRoute";
import { styles } from "@/src/styles/CommissionDetail.styles";
import * as yup from 'yup';

export default function CommissionDetailsScreen() {
  const { commissionId } = useLocalSearchParams();
  const router = useRouter();
  const [commission, setCommission] = useState<CommissionProtected | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditingPrice, setIsEditingPrice] = useState(false);
  const [newPrice, setNewPrice] = useState<string>("");
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const { loggedInUser } = useContext(AuthenticationContext);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const priceValidationSchema = yup.object().shape({
    newPrice: yup
      .string()
      .required("El precio es obligatorio")
      .matches(/^\d+(\.\d{1,2})?$/, "El precio debe ser un número con hasta 2 decimales"),
  });

  useEffect(() => {
    const fetchCommission = async () => {
      try {
        if (commissionId) {
          const data = await getCommissionByIdDetails(Number(commissionId));
          setCommission(data);
          setNewPrice(data.price.toString());
          setTotalPrice(data.price + data.price * 0.06);
        }
      } catch (error) {
        console.error("Error al obtener detalles de la comisión:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCommission();
  }, [commissionId]);

  useEffect(() => {
    const price = parseFloat(newPrice) || 0;
    setTotalPrice(price + price * 0.06);
  }, [newPrice]);

  

  const handleAccept = async () => {
    if (commission && commission.status == "NOT_PAID_YET" ) {
      router.push(`/commissions/${commission.id}/checkout`);

    } else {
      alert("La comisión no está disponible para pagar");
    }
  };

  const handleReject = async () => {
    if (commission) {
      try {
        await rejectCommission(commission.id, loggedInUser.token);
        alert("Comisión rechazada");
      } catch (error:any) {
        let errorMessage = "Hubo un error al rechazar la comisión";
        if (error.response?.data) {
          if (typeof error.response.data === "string") {
            errorMessage = error.response.data.replace(/^Error:\s*/, '');
          }
          else if (typeof error.response.data === "object" && error.response.data.message) {
            errorMessage = error.response.data.message;
          }
        }
        setErrorMessage(errorMessage);
      }
    }
  };

  const handleSavePrice = async () => {
    if (!commission || !commission.id || !loggedInUser.token) return;

    try {
      if (isEditingPrice) {
        await priceValidationSchema.validate({ newPrice });
        const updatedCommission = { ...commission, price: parseFloat(newPrice) };
        await requestChangesCommission(commission.id, updatedCommission, loggedInUser.token);
        await waitingCommission(commission.id, loggedInUser.token);
        setIsEditingPrice(!isEditingPrice);
      }
      alert("Precio actualizado con éxito");
    } catch (error: any) {
      let errorMessage = "Hubo un error al actualizar el precio";
  
      if (error instanceof yup.ValidationError) {
        errorMessage = error.message;
      } else if (error.response?.data) {
        if (typeof error.response.data === "string") {
          errorMessage = error.response.data.replace(/^Error:\s*/, '');
        } else if (
          typeof error.response.data === "object" &&
          error.response.data.message
        ) {
          errorMessage = error.response.data.message;
        }
      }
  
      setErrorMessage(errorMessage);
      console.error("Error al actualizar el precio:", error);
    }
  };

  const handleEditPrice = () => {
    setIsEditingPrice(true); 
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#183771" />
      </View>
    );
  }

  if (!commission) {
    return (
      router.push(`/`)
    );
  }

  return (
    <ProtectedRoute allowedRoles={["CLIENT"]}>
      <ScrollView style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
          <Text style={styles.backButtonText}>ATRÁS</Text>
        </TouchableOpacity>

        <View style={styles.card}>
          <View style={styles.leftSection}>
            <Text style={styles.clientTitle}>Artista</Text>
            <Text style={styles.clientName}>{commission.artistUsername || "Artista desconocido"}</Text>
            <Text style={styles.priceLabel}>Precio de la obra: €{commission.price}</Text>
            <Text style={styles.detailTitle}>Detalle de solicitud</Text>
            <Text style={styles.text}>{commission.description}</Text>
          </View>

          <View style={styles.rightSection}>
            <Text style={styles.errorText}>{errorMessage}</Text>
            <View style={styles.imagePlaceholder}>
              {commission.imageProfile ? (
                <Image source={{ uri: commission.imageProfile }} style={styles.clientImage} />
              ) : (
                <Text style={styles.imagePlaceholderText}>Imagen del artista</Text>
              )}
            </View>

            <Text style={styles.priceLabel}>Fijar precio</Text>

            {isEditingPrice ? (
              <TextInput
                style={styles.priceInput}
                value={newPrice}
                onChangeText={setNewPrice}
                keyboardType="numeric"
              />
            ) : (
              <Text style={styles.priceInput}>€{newPrice}</Text>
            )}

            <TouchableOpacity
              style={styles.adjustButton}
              onPress={isEditingPrice ? handleSavePrice : handleEditPrice}
            >
              <Text style={styles.buttonText}>{isEditingPrice ? "GUARDAR" : "AJUSTAR PRECIO"}</Text>
            </TouchableOpacity>

            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.acceptButton} onPress={handleAccept}>
                <Text style={styles.buttonText}>PAGAR</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.rejectButton} onPress={handleReject}>
                <Text style={styles.buttonText}>RECHAZAR</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.totalPrice}>Total + % = €{totalPrice.toFixed(2)}</Text>
          </View>
        </View>
      </ScrollView>
    </ProtectedRoute>
  );
}
