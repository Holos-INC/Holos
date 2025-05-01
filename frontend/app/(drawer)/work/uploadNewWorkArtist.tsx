import React, { useState, useEffect, useContext, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import {
  postWorkdone,
  getAbilityPost,
} from "@/src/services/uploadNewWorkArtist";
import { AuthenticationContext } from "@/src/contexts/AuthContext";
import { useRouter, useNavigation, useLocalSearchParams } from "expo-router";
import {styles} from "@/src/styles/UploadNewWorkArtist";
import popUpMovilWindows from "@/src/components/PopUpAlertMovilWindows";
import Icon from "react-native-vector-icons/MaterialIcons";
import { object, string } from "yup";
import { Formik } from "formik";
import * as ImagePicker from "expo-image-picker";
import ProtectedRoute from "@/src/components/ProtectedRoute";
import { useFocusEffect } from "@react-navigation/native";
import { Button } from "react-native-paper";
import { Commission, PaymentArrangement } from "@/src/constants/CommissionTypes";

const cameraIcon = "photo-camera";

export default function UploadWorkArtist() {
  const { commissionId } = useLocalSearchParams();
  const { isArtist, loggedInUser } = useContext(AuthenticationContext);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const router = useRouter();
  const navigation = useNavigation();
  const [inputValue, setInputValue] = useState<string>("");
  const [abilityPost, setAbilityPost] = useState<Boolean>(false);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  useEffect(() => {
    navigation.setOptions("Subir una nueva obra al portafolio");
  }, [navigation]);

  useFocusEffect(
    useCallback(() => {
      const fetchAbilityPost = async () => {
        try {
          const data = await getAbilityPost(loggedInUser.token);
          setAbilityPost(data);
        } catch (error) {
          console.error(
            "Error fetching whether the artist is allowed to post:",
            error
          );
        }
      };
      fetchAbilityPost();
    }, [])
  );

  const uploadNewWorkValidationSchema = object({
    name: string().trim().required("El título de la obra es requerido"),
    description: string()
      .trim()
      .required("La descripción de la obra es requerida"),
    price: string()
      .required("La obra debe tener un precio")
      .matches(
        /^[0-9]+([.,][0-9]{1,2})?$/,
        "Debe ser un número válido con hasta 2 decimales"
      ),
    image: string().trim().required("La imagen de la obra es requerida"),
  });

  const pickImage = async (
    setFieldValue: (field: string, value: any) => void,
    setSelectedImage: (uri: string) => void
  ) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setSelectedImage(uri);
      setFieldValue("image", uri);
    }
  };

  const sendWork = async (values: any, resetForm: () => void) => {
    try {
      if (!selectedImage) {
        popUpMovilWindows("Error", "No has seleccionado una imagen válida.");
        return;
      }
      const uploadWork = {
              name: values.name,
              description: values.description,
              price: values.price
            };
      await postWorkdone(uploadWork, selectedImage, loggedInUser.token );
      popUpMovilWindows("Éxito", " Enviado correctamente");
      resetForm();
      setSelectedImage(null);
      router.push({ pathname: "/" });
    } catch (error: any) {
      console.log(error);
      popUpMovilWindows(
        "Error",
        "No se pudo subir la obra. Inténtelo de nuevo más tarde."
      );
    }
  };

  const enableUpload = () => {
    return (
      <Formik
        initialValues={{ name: "", description: "", price: 0, image: "" }}
        onSubmit={(values, { resetForm }) => {
          sendWork({ ...values}, resetForm);
        }}
        validationSchema={uploadNewWorkValidationSchema}
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
          <ScrollView
            style={{ flex: 1, backgroundColor: "transparent" }}
            contentContainerStyle={{ paddingBottom: 40 }}
          >
            <Button
              icon="arrow-left"
              onPress={() => router.back()}
              style={{
                position: "absolute",
                top: 24,
                left: 16,
                zIndex: 10,
                backgroundColor: "transparent",
              }}
              labelStyle={{ color: "grey" }}
            >
              ATRÁS
            </Button>
            <View style={styles.formWrapper}>
              <Text style={styles.uploadTitle}>Sube una nueva obra</Text>

              <Text style={styles.formLabel}>Título de la obra</Text>
              <TextInput
                style={styles.inputNameWork}
                placeholder="Introduzca el nombre de la obra"
                placeholderTextColor="#777"
                value={values.name}
                onChangeText={handleChange("name")}
              />
              {errors.name && touched.name && (
                <Text style={styles.errorText}>{errors.name}</Text>
              )}

              <Text style={styles.formLabel}>Descripción</Text>
              <View style={styles.inputDescriptionBox}>
                <TextInput
                  style={styles.inputDescriptionWork}
                  placeholder="Describa la obra"
                  placeholderTextColor="#777"
                  value={values.description}
                  onChangeText={handleChange("description")}
                  multiline
                />
              </View>
              {errors.description && touched.description && (
                <Text style={styles.errorText}>{errors.description}</Text>
              )}

              <Text style={styles.formLabel}>Precio</Text>
              <TextInput
                style={styles.inputCostWork}
                placeholder="0,00"
                placeholderTextColor="#888"
                keyboardType="default"
                value={values.price}
                onChangeText={(text) => {
                  setFieldValue("price", text.replace(/-/g, ""));
                }}
                onBlur={handleBlur("price")}
              />
              {errors.price && touched.price && (
                <Text style={styles.errorText}>
                  Por favor, inserte un valor válido
                </Text>
              )}

            {errors.price && touched.price && (<Text style={styles.errorText}>Por favor, inserte un valor</Text>)}
            <Text style={styles.formLabel}>Imagen de la obra</Text>
              {/* Image Preview */}
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
              {errors.image && touched.image && (
                <Text style={styles.errorText}>{errors.image}</Text>
              )}

              <View style={{ alignItems: "center", marginTop: 16 }}>
                {values.image ? (
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => {
                      setSelectedImage(null);
                      setFieldValue("image", "");
                    }}
                  >
                    <Text style={styles.removeButtonText}>Quitar imagen</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={styles.cameraButton}
                    onPress={() => pickImage(setFieldValue, setSelectedImage)}
                  >
                    <Icon name="photo-camera" size={20} color="white" />
                    <Text style={styles.cameraButtonText}>Subir Imagen</Text>
                  </TouchableOpacity>
                )}
              </View>

              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => {
                    resetForm();
                    router.push("/");
                  }}
                >
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.sendButton}
                  onPress={() => handleSubmit()}
                >
                  <Text style={styles.sendButtonText}>Enviar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        )}
      </Formik>
    );
  };

  

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
        {abilityPost ? enableUpload() : unableUpload()}
      </ProtectedRoute>
    </View>
  );
}
