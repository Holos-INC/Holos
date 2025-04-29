import React, { useState, useEffect, useContext, useCallback } from "react";
import { View, Text, TouchableOpacity, Image, ScrollView, Pressable } from "react-native";
import {Button, TextInput} from "react-native-paper";
import { postWorkdone, getAbilityPost } from "@/src/services/uploadNewWorkArtist";
import { AuthenticationContext } from "@/src/contexts/AuthContext";
import { useRouter, useNavigation, useLocalSearchParams } from "expo-router";
import {styles} from "@/src/styles/UploadNewWorkArtist";
import popUpMovilWindows from "@/src/components/PopUpAlertMovilWindows";
import Icon from "react-native-vector-icons/MaterialIcons";
import { object, string, number } from "yup";
import { Formik } from "formik";
import * as ImagePicker from "expo-image-picker"; 
import ProtectedRoute from "@/src/components/ProtectedRoute";
import {newWorkArtist } from "@/src/constants/uploadNewWorkArtist";
import { useFocusEffect } from '@react-navigation/native';
import { Feather } from "@expo/vector-icons";
import colors from "@/src/constants/colors";
import { useCommissionDetails } from "@/src/hooks/useCommissionDetails";
import { createCommission } from "@/src/services/commisionApi";
import { Commission, PaymentArrangement } from "@/src/constants/CommissionTypes";

const cameraIcon = "photo-camera";

export default function UploadWorkArtist() {
  const { commissionId } = useLocalSearchParams();
  const { isArtist, loggedInUser } = useContext(AuthenticationContext);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const router = useRouter();
  const navigation = useNavigation();
  const [inputValue, setInputValue] = useState<string>("");
  const [abilityPost, setabilityPost] = useState<Boolean>(false);
  const [paymentArrangement, setPaymentArrangement] = useState("INITIAL");
  const [totalPayments, setTotalPayments] = useState("4");
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
          setabilityPost(data);
        } catch (error) {
          console.error("Error fetching whether the artist is allowed to post:", error);
        }
      };
       fetchAbilityPost();
    }, []) 
  );
  const uploadNewWorkValidationSchema = object({
    name: string().trim().required("El título de la obra es requerido"),
    description: string().trim().required("La descripción de la obra es requerida"),
    price: number().typeError("El precio debe ser un número").required("La obra debe tener un precio").positive("El precio debe ser positivo"),
    image: string().trim().required("La imagen de la obra es requerida"),
  });

  const pickImage = async (
    setFieldValue: (field: string, value: any) => void,
    setSelectedImage: (uri: string) => void,
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
           setFieldValue("image", uri)
         }
  };
  



  const sendWork = async (values: newWorkArtist, resetForm: () => void) => {
    try {
      if (!selectedImage) {
        popUpMovilWindows("Error", "No has seleccionado una imagen válida.");
        return;
      }
      const uploadWork = {
              name: values.name,
              description: values.description,
              price: values.price,
              paymentArrangement: values.paymentArrangement,
              totalPayments: values.totalPayments,
            };
      await postWorkdone(uploadWork, selectedImage, loggedInUser.token );
      popUpMovilWindows("Éxito", " Enviado correctamente");
      resetForm();
      setInputValue("");
      setSelectedImage(null); 
      router.push({ pathname: "/" });
    } catch (error: any) {
      console.log(error)
      popUpMovilWindows("Error", "No se pudo enviar el reporte. Intentelo de nuevo más tarde");
    }
  };

  const enableUpload = () => {
    return  (
      <Formik
        initialValues={{ name: "", description: "", price: 0, image: "" }}
        onSubmit={(values, { resetForm }) => {
          const parsedTotalPayments = totalPayments ? parseInt(totalPayments) : 0;  // Si es null o undefined, asignamos 0
          sendWork({ ...values, paymentArrangement: paymentArrangement as PaymentArrangement, totalPayments: parsedTotalPayments }, resetForm);
        }}
        validationSchema={uploadNewWorkValidationSchema}
      >
        {({ handleChange,handleBlur, handleSubmit, setFieldValue,values,  errors, touched }) => (
        <ScrollView
          style={{ flex: 1, backgroundColor: "#fff" }}
          contentContainerStyle={{ flexGrow: 1 }}>
            <View style={styles.formWrapper}>
              <Text style={styles.uploadTitle}>¡Sube una obra!</Text>

              <Text style={styles.formLabel}>¿Cuál es el nombre de tu nueva obra?</Text>
              <TextInput
                style={styles.inputNameWork}
                placeholder="Introduzca el nombre de la obra"
                placeholderTextColor="#777"
                value={values.name}
                onChangeText={handleChange("name")}
              />
              {errors.name && touched.name && (<Text style={styles.errorText}>{errors.name}</Text>)}

              <Text style={styles.formLabel}>Dale una descripción a tu obra</Text>
              <View style={styles.inputDescriptionBox}>
              <TextInput
                style={styles.inputDescriptionWork}
                placeholder="Introduzca una descripción"
                placeholderTextColor="#777"
                value={values.description}
                onChangeText={handleChange("description")}
                multiline
              />
              </View>
              {errors.description && touched.description && (<Text style={styles.errorText}>{errors.description}</Text>)}

              <Text style={styles.formLabel}>¿Cuál es el precio de la obra?</Text>
              <TextInput
                style={styles.inputCostWork}
                placeholder="0,00"
                placeholderTextColor="#888"
                keyboardType="decimal-pad"
                value={values.price ? String(values.price) : ""}
                onChangeText={(text) => {
                  const cleaned = text
                    .replace(/\s/g, "")
                    .replace(",", ".")
                    .replace(/[^\d.]/g, ""); // remove everything except numbers and dot
                  setFieldValue("price", Number(cleaned));
                }}
                onBlur={handleBlur("price")}
              />
              <Text style={styles.inputCostWork}>
                {values.price ? `${values.price.toFixed(2)} €` : "0,00 €"}
              </Text>

            {errors.price && touched.price && (<Text style={styles.errorText}>Por favor, inserte un valor</Text>)}

              {/* Image Preview */}
              <View style={styles.previewImageContainer}>
                {values.image ? (
                  <Image source={{ uri: values.image }} style={styles.previewImage} />
                  ) : (
                  <Text style={styles.placeholderText}>No hay imagen seleccionada</Text>
                  )}
                </View>
                {errors.image && touched.image && ( <Text style={styles.errorText}>{errors.image}</Text>)}
              {/* Image Picker + Submit */}
              <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={() => pickImage(setFieldValue, setSelectedImage)}>
                  <Icon name={cameraIcon} style={styles.iconButton} />
                </TouchableOpacity>
                <TouchableOpacity  style={styles.sendButton} onPress={() => handleSubmit()}>
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
        <View style={styles.containerUnableUpload}>
          <Text style={styles.textContainerUnableUpload}>Acceso no permitido.</Text>
        </View>
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
