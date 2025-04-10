import React, { useState, useEffect, useContext } from "react";
import { View, Text, TextInput, Image, ScrollView, StyleSheet, TouchableOpacity, Platform} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { Formik } from "formik";
import * as Yup from "yup";
import { AuthenticationContext } from "@/src/contexts/AuthContext";
import {  BASE_URL } from "@/src/constants/api";
import LoadingScreen from "@/src/components/LoadingScreen";
import { getUser } from "@/src/services/userApi";
import { ArtistDTO } from "@/src/constants/ExploreTypes";
import { getArtistById } from "@/src/services/artistApi";
import { useFonts } from "expo-font";
import { updateUserArtist } from "@/src/services/artistApi";
import popUpMovilWindows from "@/src/components/PopUpAlertMovilWindows";
import { artistUser } from "@/src/constants/user";




const isWeb = Platform.OS === "web";

const validationSchema = Yup.object().shape({
  firstName: Yup.string().trim("El nombre no puede tener solo espacios").max(30, "No puede escribir más de 30 caracteres").required("El nombre es obligatorio"),
  username: Yup.string().notRequired(),
  email: Yup.string().trim("El correo no puede tener solo espacios").email("Formato de correo inválido").required("El correo es obligatorio"),
  phoneNumber: Yup.string().trim("El teléfono no puede tener solo espacios").matches(/^[0-9]+$/, "Solo se permiten números").min(9, "Debe tener al menos 7 dígitos").max(12, "Debe tener como máximo 12 dígitos").required("El teléfono es obligatorio"),
  description: Yup.string().max(200, "No puede escribir más de 200 carácteres"),
  imageProfile: Yup.string().notRequired(),
  tableCommissionsPrice: Yup.string().notRequired(),

});

const userArtistProfileScreen = () => {
  const navigation = useNavigation<any>();
  const { loggedInUser } = useContext(AuthenticationContext);
  const [artist, setArtist] = useState<ArtistDTO | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [imageProfile, setImageProfile] = useState<string | null>(null);
  const [tableCommisionsPrice, setTableCommisionsPrice] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [shouldRefresh, setShouldRefresh] = useState(false);

  const [fontsLoaded] = useFonts({
    "Merriweather-Bold": require("../../../assets/fonts/Merriweather_24pt-Bold.ttf"),
  });


  useEffect(() => {
    const fetchData = async () => {
      try {
        const usuario = await getUser(loggedInUser.token);
        const artistData: ArtistDTO = await getArtistById(Number(usuario.id));
        setArtist(artistData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [loggedInUser.token, isEditing]);

    useEffect(() => {
      navigation.setOptions("Su perfil");
    }, [navigation]);


  const pickImage = async (
    setFieldValue: (field: string, value: any) => void,
    field: "imageProfile" | "tableCommisionsPrice"
  ) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
  
    if (!result.canceled) {
      const img = result.assets[0].uri;
      setFieldValue(field, img);
      if (field === "imageProfile") {
        setImageProfile(img);
      } else if (field === "tableCommisionsPrice") {
        setTableCommisionsPrice(img);
      } else {
        console.warn("Campo de imagen no reconocido:", field);
      }
    }
  };


  if (!fontsLoaded || loading || !artist) return <LoadingScreen />;


  const sendWork = async (values: artistUser) => {
    try {
      const clientUser = {
        username: values.username,
        firstName: values.firstName,
        email: values.email,
        phoneNumber: values.phoneNumber,
        tableCommissionsPrice: values.tableCommissionsPrice,
        imageProfile: values.imageProfile,
        description: values.description ?? "",
        linkToSocialMedia: values.linkToSocialMedia ?? "",
            };
            
      await updateUserArtist(clientUser, loggedInUser.token );
      popUpMovilWindows("Éxito", " Enviado correctamente"); 
      setShouldRefresh(prev => !prev);
      setIsEditing(!isEditing)
    } catch (error: any) {
      console.log(error)
      popUpMovilWindows("Error", "No se puede actualizar el perfil. Intentelo de nuevo más tarde");
    }
  };




  return (
    <Formik
     enableReinitialize={true}
      initialValues={{
        firstName: artist.name,
        username: artist.username,
        email: artist.email,
        phoneNumber: artist.phoneNumber,
        description: artist.description,
        linkToSocialMedia: artist.linkToSocialMedia,
        tableCommissionsPrice: artist.tableCommisionsPrice ,
        imageProfile: artist.imageProfile,
        numSlotsOfWork: artist.numSlotsOfWork,
      }}
      validationSchema={validationSchema}
      onSubmit={(values) => sendWork(values)}
    >
      {({ handleChange, handleBlur, handleSubmit,values, errors, touched, setFieldValue, setValues, setErrors, setTouched }) => {
        const cancelChange = () => {
          if (!artist) return;
  
          const originalValues = {
            firstName: artist.name,
            username: artist.username,
            email: artist.email,
            phoneNumber: artist.phoneNumber,
            description: artist.description,
            linkToSocialMedia: artist.linkToSocialMedia,
            tableCommissionsPrice: artist.tableCommisionsPrice,
            imageProfile: artist.imageProfile,
            numSlotsOfWork: artist.numSlotsOfWork,
          };
  
          setValues(originalValues);
          setErrors({});
          setTouched({});
          setImageProfile(null);
          setTableCommisionsPrice(null);
          setIsEditing(false);
        };
  
        return (
          <ScrollView style={styles.scrollView}>
            <View style={styles.container}>
              <View style={styles.headerRow}>
                <View style={styles.imageSection}>
                  <Image
                    source={
                      imageProfile
                        ? { uri: imageProfile }
                        : artist?.imageProfile
                        ? { uri: `${BASE_URL}${atob(artist.imageProfile)}` }
                        : undefined
                    }
                    style={styles.imageProfile}
                  />

                  {isEditing ?
                  <TouchableOpacity
                    onPress={() => pickImage(setFieldValue, "imageProfile")}
                    style={styles.stripeButtonSmall}
                  >
                    <Text style={styles.stripeButtonText}>Cambiar Foto de Perfil</Text>
                  </TouchableOpacity> : <></>}
                </View>
  
                <View style={styles.formSection}>
                  <Text style={styles.title}>Editar Perfil de Artista</Text>
  
                  <Text style={styles.label}>Nombre</Text>
                  <TextInput
                    style={styles.input}
                    value={values.firstName}
                    onChangeText={handleChange("firstName")}
                    onBlur={handleBlur("firstName")}
                    editable={isEditing}
                  />
                  {touched.firstName && errors.firstName && <Text style={styles.error}>{errors.firstName}</Text>}
            
                  <Text style={styles.label}>Usuario</Text>
                  <View style={styles.readOnlyBox}>
                    <Text style={styles.readOnlyText}>{artist.username}</Text>
                  </View>
  
                  <Text style={styles.label}>Correo Electrónico</Text>
                  <TextInput
                    style={styles.input}
                    value={values.email}
                    onChangeText={handleChange("email")}
                    onBlur={handleBlur("email")}
                    editable={isEditing}
                    keyboardType="email-address"
                  />
                  {touched.email && errors.email && <Text style={styles.error}>{errors.email}</Text>}
  
                  <Text style={styles.label}>Teléfono</Text>
                  <TextInput
                    style={styles.input}
                    value={values.phoneNumber}
                    onChangeText={handleChange("phoneNumber")}
                    onBlur={handleBlur("phoneNumber")}
                    editable={isEditing}
                    keyboardType="phone-pad"
                  />
                  {touched.phoneNumber && errors.phoneNumber && <Text style={styles.error}>{errors.phoneNumber}</Text>}
  
                  <Text style={styles.label}>Descripción</Text>
                  <TextInput
                    style={[styles.input, { height: 80 }]}
                    multiline
                    value={values.description}
                    onChangeText={handleChange("description")}
                    onBlur={handleBlur("description")}
                    editable={isEditing}
                  />
                  {touched.description && errors.description && <Text style={styles.error}>{errors.description}</Text>}
  
                  <Text style={styles.label}>Redes Sociales</Text>
                  <TextInput
                    style={styles.input}
                    value={values.linkToSocialMedia}
                    onChangeText={handleChange("linkToSocialMedia")}
                    onBlur={handleBlur("linkToSocialMedia")}
                    editable={isEditing}
                  />
                  {touched.linkToSocialMedia && errors.linkToSocialMedia && <Text style={styles.error}>{errors.linkToSocialMedia}</Text>}
  
                  <Text style={styles.label}>Slots de trabajo disponibles</Text>
                  <View style={styles.readOnlyBox}>
                    <Text style={styles.readOnlyText}>{artist.numSlotsOfWork}</Text>
                  </View>
  
                  <Text style={styles.label}>Tabla de Precios</Text>
                  <Image
                    source={
                      tableCommisionsPrice
                        ? { uri: tableCommisionsPrice }
                        : artist.tableCommisionsPrice
                        ? { uri: `${BASE_URL}${atob(artist.tableCommisionsPrice)}` }
                        : undefined
                    }
                    style={styles.priceImage}
                  />
                  {isEditing && (
                    <>
                      {touched.tableCommissionsPrice && errors.tableCommissionsPrice && (
                        <Text style={styles.error}>{errors.tableCommissionsPrice}</Text>
                      )}
                      <TouchableOpacity
                        onPress={() => pickImage(setFieldValue, "tableCommisionsPrice")}
                        style={styles.stripeButton}
                      >
                        <Text style={styles.stripeButtonText}>Cambiar Imagen de Precios</Text>
                      </TouchableOpacity>
                    </>
                  )}
  
                  <View style={styles.buttonContainer}>
                    
                    {isEditing ? (
                      <View style={styles.secondButtonContainer}>
                        <TouchableOpacity
                      onPress={() => navigation.navigate("profile/stripe-setup")}
                      style={styles.stripeButton}
                    >
                      <Text style={styles.stripeButtonText}>Conectate con Stripe</Text>
                    </TouchableOpacity>
  
                        <TouchableOpacity onPress={() => handleSubmit()} style={styles.stripeButton}>
                          <Text style={styles.stripeButtonText}>Guardar Cambios</Text>
                        </TouchableOpacity>
  
                        <TouchableOpacity onPress={cancelChange} style={styles.stripeButton}>
                          <Text style={styles.stripeButtonText}>Cancelar los cambios</Text>
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <TouchableOpacity onPress={() => setIsEditing(true)} style={styles.stripeButton}>
                        <Text style={styles.stripeButtonText}>Editar Perfil</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
        );
      }}
    </Formik>
  );
    
 
};

export default userArtistProfileScreen;

const styles = StyleSheet.create({
    container: {
      paddingTop: 20,
      paddingHorizontal: 20,
      backgroundColor: "#F9FAFB",
      flex: 1,
      alignItems: "center",
    },
    scrollView: {
      backgroundColor: "#F9FAFB",
    },
    headerRow: {
      flexDirection: isWeb ? "row" : "column",
      alignItems: "center",
      justifyContent: "space-between",
      width: "100%",
      flexWrap: "wrap",
      gap: 20,
    },
    buttonContainer: {
      flexDirection: isWeb ? "row" : "column",
      alignItems: "center",
      width: "100%",
      flexWrap: "wrap",
      justifyContent: "center",
      paddingTop:20,
      gap: 20,
    },
    
    imageSection: {
      width: isWeb ? "30%" : "100%",
      alignItems: "center",
      justifyContent: "center",
    },
    formSection: {
      width: isWeb ? "68%" : "100%",
      backgroundColor: "#FFFFFFDD",
      padding: 20,
      borderRadius: 12,
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 8,
      elevation: 3,
    },
    
    
    title: {
      paddingTop:20,
      fontFamily: "Merriweather-Bold",
      fontSize: 30, 
      marginBottom: 24,
      textAlign: "center",
    },
    imageProfile: {
      width: "80%",
      aspectRatio: 3 / 4, 
      borderRadius: 16,
      resizeMode: "cover",
      backgroundColor: "#EEE",
      marginBottom: 10,
    },
    secondButtonContainer:{
      width: isWeb ? "30%" : "20%",
    },
   

    image: {
      width: 120,
      height: 120,
      borderRadius: 60,
      marginBottom: 10,
    },
    
    priceImage: {
      width: "20%",
      aspectRatio: 3 / 4, 
      resizeMode: "contain",
      borderRadius: 10,
      marginTop: 10,
      alignSelf: "center",
    },
    stripeButton: {
      backgroundColor: "#3D2C47",
      padding: 20,
      borderRadius: 10,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 10,
      textAlign:"center",
      alignSelf: "center",
      minWidth: 180,         
      maxWidth: "90%",   
      flexWrap: "wrap",  
    },

    stripeButtonSmall: {
      backgroundColor: "#3D2C47",
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 8,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 10,
      alignSelf: "center", 
      maxWidth: "90%",     
    },
      stripeButtonSmallAlt: {
    backgroundColor: "#3D2C47",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
    alignSelf: "center",
    width: "60%", 
  },
    stripeButtonText: {
      color: "#FFF",
      fontWeight: "bold",
      fontSize: 16,
      textAlign: "center", 
      textAlignVertical: "center",
      
    },
    label: {
      alignSelf: "flex-start",
      fontFamily: "Merriweather-Bold",
      marginTop: 12,
      fontSize:24, 
      color: "#374151",
    },
    input: {
      width: "100%",
      padding: 10,
      borderWidth: 1,
      borderColor: "#E5E7EB",
      borderRadius: 8,
      backgroundColor: "#FFFFFF",
      marginTop: 5,
      fontSize:20
    },
    error: {
      color: "red",
      alignSelf: "flex-start",
      fontSize: 12,
    },
    readOnlyBox: {
      backgroundColor: "#F3F4F6",
      padding: 10,
      borderRadius: 8,
      width: "100%",
      marginBottom: 10,
    },
    readOnlyText: {
      color: "#1F2937",
      fontSize: 20,
      paddingStart: 40
    },
  });


  