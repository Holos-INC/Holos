import React, { useState, useEffect, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView } from "react-native";
import { useRouter, useNavigation, useLocalSearchParams } from "expo-router";
import { styles } from "@/src/styles/UploadNewWorkArtist";
import popUpMovilWindows from "@/src/components/PopUpAlertMovilWindows";
import Icon from "react-native-vector-icons/MaterialIcons";
import { object, string, number } from "yup";
import { Formik } from "formik";
import * as ImagePicker from "expo-image-picker";
import ProtectedRoute from "@/src/components/ProtectedRoute";
import { updateWorkdone } from "@/src/services/uploadNewWorkArtist";
import { AuthenticationContext } from "@/src/contexts/AuthContext";

/**
 * Interfaz para los parámetros que le pasamos a esta pantalla.
 * Ajusta según tu forma de navegación.
 */
interface RouteParams {
    artistId?: string;
    worksDoneId?: string;
    currentName?: string;
    currentDescription?: string;
    currentPrice?: string;
  }
// const MaskedInput: any = TextInputMask;
const cameraIcon = "photo-camera";

export default function UpdateWorkArtist() {
  const { isArtist, loggedInUser } = useContext(AuthenticationContext);
  const router = useRouter();
  const navigation = useNavigation();
  const searchParams = useLocalSearchParams(); 
  // Obtenemos los parámetros de la ruta
  const {
    artistId,
    worksDoneId,
    currentName,
    currentDescription,
    currentPrice,
  } = searchParams as RouteParams;

  // Estados para la imagen y el precio enmascarado
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    // Ajusta el título de la pantalla
    navigation.setOptions({
      title: "Editar Obra",
    });
    // Si quieres que se precargue el precio enmascarado, puedes hacerlo:
    if (currentPrice) {
      setInputValue(`${currentPrice} €`);
    }
  }, [navigation, currentPrice]);

  // Validación con Yup
  const updateWorkValidationSchema = object({
    name: string().trim().required("El título de la obra es requerido"),
    description: string()
      .trim()
      .required("La descripción de la obra es requerida"),
    price: number()
      .typeError("El precio debe ser un número")
      .required("La obra debe tener un precio")
      .positive("El precio debe ser positivo"),
    image: string().trim(), // No lo marcamos required, porque puede ser opcional
  });

  // Función para abrir el selector de imágenes
  const pickImage = async (
    setFieldValue: (field: string, value: any) => void,
    setLocalImage: (uri: string) => void
  ) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setLocalImage(uri);
      setFieldValue("image", uri);
    }
  };

  // Función para enviar los datos al backend (PUT)
  const updateWork = async (
    values: {
      name: string;
      description: string;
      price: number;
      image: string;
    },
    resetForm: () => void
  ) => {
    try {
      if (!artistId || !worksDoneId) {
        popUpMovilWindows("Error", "Faltan parámetros para actualizar la obra.");
        return;
      }

      // Objeto con los datos de la obra (newWorkArtist)
const workToUpdate = {
  name: values.name,
  description: values.description,
  price: values.price,
};

// Llamada correcta al servicio:
await updateWorkdone(
  workToUpdate,         // <-- newWorkArtist
  selectedImage,        // <-- string | null
  Number(artistId),     // <-- number
  Number(worksDoneId),  // <-- number
  loggedInUser.token    // <-- string
);


      popUpMovilWindows("Éxito", "¡Obra actualizada correctamente!");

      // Reseteamos formulario e imagen
      resetForm();
      setSelectedImage(null);
      setInputValue("");

      // Redirigimos a la pantalla que prefieras
      router.push({ pathname: "/" });
    } catch (error) {
      console.error(error);
      popUpMovilWindows(
        "Error",
        "No se pudo actualizar la obra. Inténtalo de nuevo más tarde."
      );
    }
  };

  // Componente que contiene todo el formulario (cuando SÍ es artista)
  const enableUpload = () => {
    return (
      <Formik
        initialValues={{
          name: currentName || "",
          description: currentDescription || "",
          price: currentPrice ? parseFloat(currentPrice) : 0,
          image: "",
        }}
        onSubmit={(values, { resetForm }) => updateWork(values, resetForm)}
        validationSchema={updateWorkValidationSchema}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          setFieldValue,
          values,
          errors,
          touched,
        }) => (
          <ScrollView
            style={{ flex: 1, backgroundColor: "#fff" }}
            contentContainerStyle={{ flexGrow: 1 }}
          >
            <View style={styles.formWrapper}>
              <Text style={styles.uploadTitle}>Editar la obra</Text>

              <Text style={styles.formLabel}>Título de la obra</Text>
              <TextInput
                style={styles.inputNameWork}
                placeholder="Introduzca el nombre de la obra"
                placeholderTextColor="#777"
                value={values.name}
                onChangeText={handleChange("name")}
                onBlur={handleBlur("name")}
              />
              {errors.name && touched.name && (
                <Text style={styles.errorText}>{errors.name}</Text>
              )}

              <Text style={styles.formLabel}>Descripción de la obra</Text>
              <View style={styles.inputDescriptionBox}>
                <TextInput
                  style={styles.inputDescriptionWork}
                  placeholder="Introduzca la descripción"
                  placeholderTextColor="#777"
                  value={values.description}
                  onChangeText={handleChange("description")}
                  onBlur={handleBlur("description")}
                  multiline
                />
              </View>
              {errors.description && touched.description && (
                <Text style={styles.errorText}>{errors.description}</Text>
              )}

              <Text style={styles.formLabel}>Precio de la obra</Text>
              <TextInput
                keyboardType="numeric"
                onChangeText={handleChange("price")}
                value={String(values.price)}
              />
              <Text style={styles.inputCostWork}>
                {values.price > 0 ? `${values.price.toFixed(2)} €` : "0,00 €"}
              </Text>

              {errors.price && touched.price && (
                <Text style={styles.errorText}>Por favor, inserte un valor</Text>
              )}

              {/* Preview de la imagen */}
              <View style={styles.previewImageContainer}>
                {values.image ? (
                  <Image
                    source={{ uri: values.image }}
                    style={styles.previewImage}
                  />
                ) : (
                  <Text style={styles.placeholderText}>
                    No hay imagen seleccionada
                  </Text>
                )}
              </View>
              {/* Fin Preview */}

              {/* Botones */}
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  onPress={() =>
                    pickImage(setFieldValue, (uri) => setSelectedImage(uri))
                  }
                >
                  <Icon name={cameraIcon} style={styles.iconButton} />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.sendButton}
                  onPress={() => handleSubmit()}
                >
                  <Text style={styles.sendButtonText}>Actualizar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        )}
      </Formik>
    );
  };

  // Si NO es artista, mostramos mensaje de acceso no permitido
  const unableUpload = () => {
    return (
      <View style={styles.containerUnableUpload}>
        <Text style={styles.textContainerUnableUpload}>
          Acceso no permitido.
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ProtectedRoute allowedRoles={["ARTIST", "ARTIST_PREMIUM"]}>
        {!isArtist ? enableUpload() : unableUpload()}
      </ProtectedRoute>
    </View>
  );
}
