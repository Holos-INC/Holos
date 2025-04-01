import React, { useState, useEffect, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView } from "react-native";
import { uploadNewWorkArtist } from "@/src/services/uploadNewWorkArtist";
import { AuthenticationContext } from "@/src/contexts/AuthContext";
import { useRouter, useNavigation } from "expo-router";
import {styles} from "@/src/styles/UploadNewWorkArtist";
import popUpMovilWindows from "@/src/components/PopUpAlertMovilWindows";
import { TextInputMask } from 'react-native-masked-text';
import Icon from "react-native-vector-icons/MaterialIcons";
import { object, string, number } from "yup";
import { Formik } from "formik";
import * as ImagePicker from "expo-image-picker"; 
import ProtectedRoute from "@/src/components/ProtectedRoute";
import {newWorkArtist } from "@/src/constants/uploadNewWorkArtist";

const MaskedInput = TextInputMask as any;
const cameraIcon = "photo-camera";

export default function UploadWorkArtist() {
  const { isArtist } = useContext(AuthenticationContext);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const router = useRouter();
  const navigation = useNavigation();
  const [inputValue, setInputValue] = useState("");


  useEffect(() => {
    navigation.setOptions("Subir una nueva obra al portafolio");
  }, [navigation]);


  const uploadNewWorkValidationSchema = object({
    name: string().trim().required("El título de la obra es requerido"),
    description: string().trim().required("La descripción de la obra es requerida"),
    price: number().typeError("El precio debe ser un número").required("La obra debe tener un precio").positive("El precio debe ser positivo"),
    image: string().trim().required("La imagen de la obra es requerida"),
  });

const pickImage = async ( setFieldValue: (field: string, value: any) => void) => {
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



  const sendWork = async (values: newWorkArtist, resetForm: () => void) => {
    try {
      const uploadWork = {
              name: values.name,
              description: values.description,
              price: values.price,
              image: values.image
            };
      await uploadNewWorkArtist(uploadWork);
      popUpMovilWindows("Éxito", " Enviado correctamente");
      resetForm();
      setInputValue("");
      setSelectedImage(null); 
      router.push({ pathname: "/explore" });
    } catch (error: any) {
      popUpMovilWindows("Error", "No se pudo enviar el reporte. Intentelo de nuevo más tarde");
    }
  };

  const enableUpload = () => {
    return  (
      <Formik
        initialValues={{ name: "", description: "", price: 0, image: "" }}
        onSubmit={(values, { resetForm }) => sendWork(values, resetForm)}
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

              <Text style={styles.formLabel}>Dalé una descripción a tu obra</Text>
              <TextInput
                style={styles.inputDescriptionWork}
                placeholder="Introduzca una descripción"
                placeholderTextColor="#777"
                value={values.description}
                onChangeText={handleChange("description")}
                multiline
              />
              {errors.description && touched.description && (<Text style={styles.errorText}>{errors.description}</Text>)}

              <Text style={styles.formLabel}>¿Cuál es el precio de la obra?</Text>
              <MaskedInput
                type={"money"}
                options={{
                  precision: 2,
                  separator: ",",
                  delimiter: ".",
                  unit: "",
                  suffixUnit: " €",
                  }}
                keyboardType="numeric" 
                value={inputValue}
                onChangeText={(text: string) => {
                  setInputValue(text);

                const cleaned = text
                  .replace(/\s/g, "")
                  .replace("€", "")
                  .replace(/\./g, "")
                  .replace(",", ".");

                if (cleaned.trim() === "" || isNaN(Number(cleaned))) {
                  setFieldValue("price", null); 
                } else {
                  setFieldValue("price", Number(cleaned));
                }
                }}
                onBlur={handleBlur("price")}
                placeholder="0,00 €"
                placeholderTextColor="#888"
                style={styles.inputCostWork}
            />
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
                <TouchableOpacity onPress={() => pickImage(setFieldValue)}>
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


  // isArtist se deberá  modificar por un booleano que indique si el usuario puede subir una obra o no, en base  si tiene o no
  //  una cuenta gratuita y si ya ha subido más de 7 obras en el caso de que no tenga cuenta premium
  return (
    <View style={styles.container}>
      <ProtectedRoute allowedRoles={["ARTIST"]}>
      {!isArtist ? enableUpload() : unableUpload()}  

      </ProtectedRoute>
    </View>
  );
}
