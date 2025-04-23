import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  ScrollView,
  TouchableOpacity,
  Platform,
  useWindowDimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { Formik } from "formik";
import * as Yup from "yup";
import { AuthenticationContext } from "@/src/contexts/AuthContext";
import { BASE_URL } from "@/src/constants/api";
import LoadingScreen from "@/src/components/LoadingScreen";
import { getUser } from "@/src/services/userApi";
import { ArtistDTO } from "@/src/constants/ExploreTypes";
import { getArtistById } from "@/src/services/artistApi";
import { useFonts } from "expo-font";
import { updateUserArtist } from "@/src/services/artistApi";
import popUpMovilWindows from "@/src/components/PopUpAlertMovilWindows";
import { artistUser } from "@/src/constants/user";
import { desktopStyles, mobileStyles } from "@/src/styles/userProfile.styles";

const validationSchema = Yup.object().shape({
  firstName: Yup.string()
    .trim("El nombre no puede tener solo espacios")
    .max(30, "No puede escribir más de 30 caracteres")
    .required("El nombre es obligatorio"),
  username: Yup.string().notRequired(),
  email: Yup.string()
    .trim("El correo no puede tener solo espacios")
    .email("Formato de correo inválido")
    .required("El correo es obligatorio"),
  phoneNumber: Yup.string()
    .trim("El teléfono no puede tener solo espacios")
    .matches(/^[0-9]+$/, "Solo se permiten números")
    .min(9, "Debe tener al menos 7 dígitos")
    .max(12, "Debe tener como máximo 12 dígitos")
    .required("El teléfono es obligatorio"),
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
  const [tableCommisionsPrice, setTableCommisionsPrice] = useState<
    string | null
  >(null);
  const [isEditing, setIsEditing] = useState(false);
  const [shouldRefresh, setShouldRefresh] = useState(false);

  const [fontsLoaded] = useFonts({
    "Merriweather-Bold": require("../../../assets/fonts/Merriweather_24pt-Bold.ttf"),
  });

  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === "web" && width > 775;
  const styles = isDesktop ? desktopStyles : mobileStyles;

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
    field: "imageProfile" | "tableCommissionsPrice"
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
      } else if (field === "tableCommissionsPrice") {
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

      await updateUserArtist(clientUser, loggedInUser.token);
      popUpMovilWindows("Éxito", " Enviado correctamente");
      setShouldRefresh((prev) => !prev);
      setIsEditing(!isEditing);
    } catch (error: any) {
      console.log(error);
      popUpMovilWindows(
        "Error",
        "No se puede actualizar el perfil. Intentelo de nuevo más tarde"
      );
    }
  };

  return (
    <Formik
      enableReinitialize
      initialValues={{
        firstName: artist?.name || "",
        username: artist?.username || "",
        email: artist?.email || "",
        phoneNumber: artist?.phoneNumber || "",
        description: artist?.description || "",
        linkToSocialMedia: artist?.linkToSocialMedia || "",
        tableCommissionsPrice: artist?.tableCommissionsPrice || "",
        imageProfile: artist?.imageProfile || "",
        numSlotsOfWork: artist?.numSlotsOfWork || 0,
      }}
      validationSchema={validationSchema}
      onSubmit={sendWork}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        errors,
        touched,
        setFieldValue,
        setValues,
        setErrors,
        setTouched,
      }) => {
        const cancelChange = () => {
          if (!artist) return;

          const originalValues = {
            firstName: artist.name,
            username: artist.username,
            email: artist.email,
            phoneNumber: artist.phoneNumber,
            description: artist.description,
            linkToSocialMedia: artist.linkToSocialMedia,
            tableCommissionsPrice: artist.tableCommissionsPrice,
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
                        ? { uri: `data:image/jpeg;base64,${artist.imageProfile}` }
                        : undefined
                    }
                    style={styles.imageProfile}
                  />

                  {isEditing ? (
                    <TouchableOpacity
                      onPress={() => pickImage(setFieldValue, "imageProfile")}
                      style={styles.stripeButtonSmall}
                    >
                      <Text style={styles.stripeButtonText}>
                        Cambiar Foto de Perfil
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <></>
                  )}
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
                  {touched.firstName && errors.firstName && (
                    <Text style={styles.error}>{errors.firstName}</Text>
                  )}

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
                  {touched.email && errors.email && (
                    <Text style={styles.error}>{errors.email}</Text>
                  )}

                  <Text style={styles.label}>Teléfono</Text>
                  <TextInput
                    style={styles.input}
                    value={values.phoneNumber}
                    onChangeText={handleChange("phoneNumber")}
                    onBlur={handleBlur("phoneNumber")}
                    editable={isEditing}
                    keyboardType="phone-pad"
                  />
                  {touched.phoneNumber && errors.phoneNumber && (
                    <Text style={styles.error}>{errors.phoneNumber}</Text>
                  )}

                  <Text style={styles.label}>Descripción</Text>
                  <TextInput
                    style={[styles.input, { height: 80 }]}
                    multiline
                    value={values.description}
                    onChangeText={handleChange("description")}
                    onBlur={handleBlur("description")}
                    editable={isEditing}
                  />
                  {touched.description && errors.description && (
                    <Text style={styles.error}>{errors.description}</Text>
                  )}

                  <Text style={styles.label}>Redes Sociales</Text>
                  <TextInput
                    style={styles.input}
                    value={values.linkToSocialMedia}
                    onChangeText={handleChange("linkToSocialMedia")}
                    onBlur={handleBlur("linkToSocialMedia")}
                    editable={isEditing}
                  />
                  {touched.linkToSocialMedia && errors.linkToSocialMedia && (
                    <Text style={styles.error}>{errors.linkToSocialMedia}</Text>
                  )}

                  <Text style={styles.label}>Slots de trabajo disponibles</Text>
                  <View style={styles.readOnlyBox}>
                    <Text style={styles.readOnlyText}>
                      {artist.numSlotsOfWork}
                    </Text>
                  </View>

                  <Text style={styles.label}>Tabla de Precios</Text>
                  <Image
                    source={
                      tableCommisionsPrice
                        ? { uri: tableCommisionsPrice }
                        : artist.tableCommissionsPrice
                        ? { uri: `data:image/jpeg;base64,${artist.tableCommissionsPrice}`}
                        : undefined
                    }
                    style={styles.priceImage}
                  />
                  {isEditing && (
                    <>
                      {touched.tableCommissionsPrice &&
                        errors.tableCommissionsPrice && (
                          <Text style={styles.error}>
                            {errors.tableCommissionsPrice}
                          </Text>
                        )}
                      <TouchableOpacity
                        onPress={() =>
                          pickImage(setFieldValue, "tableCommissionsPrice")
                        }
                        style={styles.stripeButton}
                      >
                        <Text style={styles.stripeButtonText}>
                          Cambiar Imagen de Precios
                        </Text>
                      </TouchableOpacity>
                    </>
                  )}

                  <View style={styles.buttonContainer}>
                    {isEditing ? (
                      <View style={styles.secondButtonContainer}>
                        <TouchableOpacity
                          onPress={() =>
                            navigation.navigate("profile/stripe-setup")
                          }
                          style={styles.stripeButton}
                        >
                          <Text style={styles.stripeButtonText}>
                            Conectate con Stripe
                          </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          onPress={() => handleSubmit()}
                          style={styles.stripeButton}
                        >
                          <Text style={styles.stripeButtonText}>
                            Guardar Cambios
                          </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          onPress={cancelChange}
                          style={styles.stripeButton}
                        >
                          <Text style={styles.stripeButtonText}>
                            Cancelar los cambios
                          </Text>
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <TouchableOpacity
                        onPress={() => setIsEditing(true)}
                        style={styles.stripeButton}
                      >
                        <Text style={styles.stripeButtonText}>
                          Editar Perfil
                        </Text>
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
