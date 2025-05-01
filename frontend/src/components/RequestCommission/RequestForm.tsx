import {
  View,
  TextInput,
  Image,
  Text,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { styles } from "@/src/styles/RequestCommissionUserScreen.styles";
import { Formik } from "formik";
import { Picker } from "@react-native-picker/picker";
import { object, string, number, date } from "yup";
import * as ImagePicker from "expo-image-picker";
import { useContext, useEffect, useState } from "react";
import { createCommission } from "@/src/services/formService";
import { AuthenticationContext } from "@/src/contexts/AuthContext";
import { Artist, PaymentArrangement } from "@/src/constants/CommissionTypes";
import DateTimePicker from "@react-native-community/datetimepicker";
import { router } from "expo-router";
import UserPanel from "./UserPanel";
import COLORS from "@/src/constants/colors";
import { ArtistDTO } from "@/src/constants/CommissionTypes";
import { getImageSource } from "@/src/utils/getImageSource";
import { API_URL } from "@/src/constants/api";

const commissionTablePrice = "@/assets/images/image.png";

interface RequestFormProps {
  artist: ArtistDTO;
}

type FormValues = {
  name: string;
  description: string;
  price: number;
  paymentArrangement: PaymentArrangement;
  image: string;
  milestoneDate: Date | null;
};

export default function RequestForm({ artist }: RequestFormProps) {
  const { loggedInUser } = useContext(AuthenticationContext);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [kanbanColumnsCount, setKanbanColumnsCount] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");


  const commissionValidationSchema = object({
    name: string().required("El título es necesario"),
    description: string().required("La descripción es necesaria"),
    price: string()
      .required("El precio es necesario")
      .matches(
        /^[0-9]+([.,][0-9]{1,2})?$/,
        "Debe ser un número válido con hasta 2 decimales"
      ),
    image: string(),
    milestoneDate: date()
      .nullable()
      .min(
        new Date(new Date().setDate(new Date().getDate() + 1)),
        "La fecha debe ser posterior a la actual (más de un día)"
      ),
      paymentArrangement: string().oneOf(Object.values(PaymentArrangement)),

     
  });

  const pickImage = async (
    setFieldValue: (field: string, value: any) => void
  ) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setFieldValue("image", uri);
    }
  };

  const handleFormSubmit = async (
    values: FormValues,
    resetForm: () => void
  ) => {
    try {
      const commissionData = {
        name: values.name,
        description: values.description,
        price: values.price,
        paymentArrangement: values.paymentArrangement,
        image: values.image,
        milestoneDate: values.milestoneDate?.toISOString().slice(0, 10),
      };

      await createCommission(
        artist.artistId,
        commissionData,
        loggedInUser.token
      );
      router.push(`/commissions`);

      Alert.alert("Success", "Commission request sent!");
    } catch (error) {
      Alert.alert("Error", "Failed to create commission.");
    }
  };

useEffect(() => {
  if (artist?.username) {
    fetch(`${API_URL}/status-kanban-order/count/${artist.username}`, {
      headers: {
        Authorization: `Bearer ${loggedInUser.token}`,
      },
    })
      .then(response => {
        if (!response.ok) {
          return response.json().then(error => {
            throw new Error(error.message);
          });
        }
        return response.json();
      })
      .then(data => {
        setKanbanColumnsCount(data);
      })
      .catch(error => {
        console.error("Error fetching data: ", error);
        setErrorMessage(error.message);
      });

  }
}, [artist.username]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: COLORS.surfaceMuted,
        paddingVertical: 16,
      }}
    >
      {/* Título principal */}
      <Text style={styles.pageTitle}>Encarga una Obra a: </Text>

      {/* Tarjeta del artista */}
      <UserPanel artist={artist} />

      {/* Tarjeta de la tabla de precios */}
      <View style={styles.priceTableContainer}>
        <Text style={styles.label}>
          Precios orientativos establecidos por el artista según el tipo de
          obra:
        </Text>

        <Text style={styles.priceTableText}>
          Puedes usar esta tabla para ayudarte a decidir el precio de tu
          encargo.
        </Text>

        <View style={styles.imageWrapper}>
          <Image
            source={getImageSource(artist.tableCommisionsPrice)}
            style={styles.priceTableImage}
            resizeMode="contain"
          />
        </View>
      </View>

      {/* Formulario */}
      <Formik<FormValues>
        initialValues={{
          name: "",
          description: "",
          price: 0,
          paymentArrangement: PaymentArrangement.INITIAL,
          image: "",
          milestoneDate: null,
        }}
        validationSchema={commissionValidationSchema}
        onSubmit={(values, { resetForm }) =>
          handleFormSubmit(values, resetForm)
        }
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          setFieldValue,
          values,
          errors,
          touched,
          resetForm,
        }) => (
          <View style={styles.formContainer}>
            {/* Title */}
            <Text style={styles.label}>Título de la Obra: </Text>
            <TextInput
              style={styles.title}
              placeholder="Título"
              value={values.name}
              onChangeText={handleChange("name")}
              onBlur={handleBlur("name")}
            />
            {errors.name && touched.name && (
              <Text style={styles.errorText}>{errors.name}</Text>
            )}

            {/* Description */}
            <Text style={styles.label}>
              Descripción de lo que espera ver en la Obra:
            </Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Describa su pedido..."
              multiline
              value={values.description}
              onChangeText={handleChange("description")}
              onBlur={handleBlur("description")}
            />
            {errors.description && touched.description && (
              <Text style={styles.errorText}>{errors.description}</Text>
            )}

            {/* Price */}
            <Text style={styles.label}>
              Precio que cree adecuado pagar por la Obra:
            </Text>
            <Text style={styles.subtext}>
              El artista tendrá derecho a negociar el precio si lo cree
              necesario
            </Text>
            <TextInput
              style={styles.title}
              placeholder="Introduzca el precio"
              keyboardType="default"
              value={values.price}
              onChangeText={(text) => {
                const cleaned = text
                  .replace(/-/g, "")
                  .replace(",", ".")
                  .replace(/[^0-9.]/g, "")
                  .replace(/(\..*?)\..*/g, "$1");
                setFieldValue("price", cleaned);
              }}
              onBlur={handleBlur("price")}
            />
            {errors.price && touched.price && (
              <Text style={styles.errorText}></Text>
            )}

            {/* Payment Arrangement Selector */}
<Text style={styles.label}>Tipo de Pago:</Text>
<View style={{ 
  backgroundColor: COLORS.brandPrimary, 
  borderRadius: 12, 
  borderWidth: 1, 
  borderColor: "#ccc", 
  marginBottom: 12, 
  overflow: "hidden" 
}}>
  <Picker
    selectedValue={values.paymentArrangement}
    onValueChange={(itemValue) =>
      setFieldValue("paymentArrangement", itemValue)
    }
    style={{
      height: 50,
      paddingHorizontal: 20,
      color: "#333", // texto oscuro
    }}
    dropdownIconColor="#666"
  >
    <Picker.Item label="Pago Inicial (Realiza 1 solo pago al principio)" value={PaymentArrangement.INITIAL} />
    <Picker.Item label="Pago Final (Realiza 1 solo pago al final)" value={PaymentArrangement.FINAL} />
    <Picker.Item label="50/50 (Realiza 1 pago al principio y otro al final)" value={PaymentArrangement.FIFTYFIFTY} />
    <Picker.Item label={`Moderador (Realiza 1 pago por cada una de las ${kanbanColumnsCount} etapas de trabajo del artista)`}value={PaymentArrangement.MODERATOR}
/>
  </Picker>
</View>


            {/* Delivery date */}
            <Text style={styles.label}>Fecha de Entrega de la Obra:</Text>

            {/* Solo mostrar el botón en plataformas móviles */}
            {Platform.OS !== "web" && (
              <TouchableOpacity
                onPress={() => setShowDatePicker(true)}
                style={styles.dateButton}
              >
                <Text style={styles.dateButtonText}>
                  {values.milestoneDate
                    ? `Seleccionada: ${values.milestoneDate.toLocaleDateString()}`
                    : "Seleccione una fecha de entrega a continuación:"}
                </Text>
              </TouchableOpacity>
            )}

            {errors.milestoneDate && touched.milestoneDate && (
              <Text style={styles.errorText}>{errors.milestoneDate}</Text>
            )}

            {/* En web usamos el input nativo */}
            {Platform.OS === "web" ? (
              <input
                type="date"
                value={
                  values.milestoneDate
                    ? values.milestoneDate.toISOString().split("T")[0]
                    : ""
                }
                onChange={(e) => {
                  const date = new Date(e.target.value);
                  setFieldValue(
                    "milestoneDate",
                    isNaN(date.getTime()) ? null : date
                  );
                }}
                style={styles.webDateInput}
              />
            ) : (
              showDatePicker && (
                <DateTimePicker
                  value={values.milestoneDate || new Date()}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => {
                    setShowDatePicker(false);
                    if (selectedDate) {
                      setFieldValue("milestoneDate", selectedDate);
                    }
                  }}
                />
              )
            )}

            {/* Image preview */}
            <Text style={styles.label}>Imagen de Referencia (Opcional):</Text>
            <View style={styles.previewContainer}>
              {values.image ? (
                <Image
                  source={{ uri: values.image }}
                  style={styles.previewImage}
                />
              ) : (
                <Text style={styles.placeholderText}>
                  No se ha seleccionado ninguna imagen
                </Text>
              )}
            </View>

            {/* Botón de subir imagen */}
            {values.image ? (
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => setFieldValue("image", "")}
              >
                <Text style={styles.removeButtonText}>Quitar imagen</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.cameraButton}
                onPress={() => pickImage(setFieldValue)}
              >
                <Icon name="photo-camera" size={20} color="white" />
                <Text style={styles.cameraButtonText}>Subir Imagen</Text>
              </TouchableOpacity>
            )}

            {/* Botones de acción */}
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  resetForm();
                  router.back();
                }}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.submitButton}
                onPress={() => handleSubmit()}
              >
                <Text style={styles.submitButtonText}>Enviar Solicitud</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Formik>
    </View>
  );
}
