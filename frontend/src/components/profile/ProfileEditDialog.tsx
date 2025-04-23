import * as Yup from "yup";
import { Formik } from "formik";
import React, { useContext, useState } from "react";
import { Text, Image, ScrollView, View } from "react-native";
import { Dialog, Portal, Button, TextInput } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { Platform, useWindowDimensions } from "react-native";
import colors from "@/src/constants/colors";
import { artistUser } from "@/src/constants/user";
import { ArtistDTO } from "@/src/constants/ExploreTypes";
import { updateUserArtist } from "@/src/services/artistApi";
import { updateUserClient } from "@/src/services/clientApi";
import { BaseUserDTO } from "@/src/constants/CommissionTypes";
import { desktopStyles, mobileStyles } from "@/src/styles/userProfile.styles";
import { AuthenticationContext } from "@/src/contexts/AuthContext";
import { useRouter } from "expo-router";

interface ArtistProfileDialogProps {
  visible: boolean;
  onDismiss: () => void;
  user: BaseUserDTO | ArtistDTO;
  setUser: (user: BaseUserDTO | ArtistDTO) => void;
  token: string;
  refreshUser: () => Promise<void>;
}

// Form values interface
interface FormValues extends artistUser {
  linkToSocialMedia: string;
  tableCommissionsPrice: string;
}

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
    .min(9, "Debe tener al menos 9 dígitos")
    .max(12, "Debe tener como máximo 12 dígitos")
    .required("El teléfono es obligatorio"),
  description: Yup.string().max(200, "No puede escribir más de 200 carácteres"),
  imageProfile: Yup.string().notRequired(),
  linkToSocialMedia: Yup.string()
    .url("Debe ser una URL válida (https://...)")
    .notRequired(),
  tableCommissionsPrice: Yup.string().notRequired(),
});

const ArtistProfileDialog: React.FC<ArtistProfileDialogProps> = ({
  visible,
  onDismiss,
  user,
  setUser,
  token,
  refreshUser,
}) => {
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === "web" && width > 775;
  const styles = isDesktop ? desktopStyles : mobileStyles;
  const { signOut } = useContext(AuthenticationContext);
  const router = useRouter();

  // Local URI state for preview
  const [localImage, setLocalImage] = useState<string | null>(null);
  const [localTable, setLocalTable] = useState<string | null>(null);

  // Detect if user is artist by checking linkToSocialMedia property
  const isArtist = (u: BaseUserDTO | ArtistDTO): u is ArtistDTO =>
    (u as ArtistDTO).linkToSocialMedia !== undefined;

  // Initial form values
  const initialValues: FormValues = {
    firstName: user.name,
    username: user.username,
    email: user.email,
    phoneNumber: user.phoneNumber ?? "",
    description: user.description ?? "",
    imageProfile: user.imageProfile ?? "",
    linkToSocialMedia: isArtist(user) ? user.linkToSocialMedia : "",
    tableCommissionsPrice: isArtist(user) ? user.tableCommisionsPrice : "",
  };

  // Image picker helper
  const pickImage = async (
    setFieldValue: (field: string, value: any) => void,
    field: keyof FormValues
  ) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setFieldValue(field, uri);
      if (field === "imageProfile") setLocalImage(uri);
      if (field === "tableCommissionsPrice") setLocalTable(uri);
    }
  };

  // Submit handler
  const handleSubmitProfile = async (values: FormValues) => {
    try {
      const usernameChanged = values.username !== user.username;

      if (isArtist(user)) {
        await updateUserArtist(values, token);
      } else {
        // strip artist-only fields
        const { linkToSocialMedia, tableCommissionsPrice, ...clientVals } = values;
        await updateUserClient(clientVals, token);
      }

      // Update parent state
      setUser({ ...user, ...values });

      if (usernameChanged) {
        router.replace("/login");
        signOut(() => {});
      } else {
        await refreshUser();
        onDismiss();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Portal>
      <Dialog
        visible={visible}
        onDismiss={onDismiss}
        style={{
          maxHeight: "90%",
          width: isDesktop ? 500 : "90%",
          alignSelf: "center",
          borderRadius: 16,
          backgroundColor: colors.surfaceBase,
          overflow: "hidden",
        }}
      >
        <Dialog.ScrollArea style={{ borderTopWidth: 0, borderBottomWidth: 0 }}>
          <ScrollView
            contentContainerStyle={{ padding: 24 }}
            showsVerticalScrollIndicator={false}
          >
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmitProfile}
            >
              {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
                <>
                  {/* Nombre */}
                  <Text style={styles.label}>Nombre</Text>
                  <TextInput
                    value={values.firstName}
                    onChangeText={handleChange("firstName")}
                    onBlur={handleBlur("firstName")}
                    mode="outlined"
                    theme={{ roundness: 999 }}
                  />
                  {touched.firstName && errors.firstName && (
                    <Text style={styles.error}>{errors.firstName}</Text>
                  )}

                  {/* Usuario */}
                  <Text style={styles.label}>Usuario</Text>
                  <TextInput
                    value={values.username}
                    onChangeText={handleChange("username")}
                    onBlur={handleBlur("username")}
                    mode="outlined"
                    theme={{ roundness: 999 }}
                  />
                  {touched.username && errors.username && (
                    <Text style={styles.error}>{errors.username}</Text>
                  )}
                  <Text style={{ color: colors.brandPrimary, fontSize: 12 }}>
                    * Si cambias de usuario deberás volver a iniciar sesión
                  </Text>

                  {/* Correo */}
                  <Text style={styles.label}>Correo</Text>
                  <TextInput
                    value={values.email}
                    onChangeText={handleChange("email")}
                    onBlur={handleBlur("email")}
                    mode="outlined"
                    keyboardType="email-address"
                    theme={{ roundness: 999 }}
                  />
                  {touched.email && errors.email && (
                    <Text style={styles.error}>{errors.email}</Text>
                  )}

                  {/* Teléfono */}
                  <Text style={styles.label}>Teléfono</Text>
                  <TextInput
                    value={values.phoneNumber}
                    onChangeText={handleChange("phoneNumber")}
                    onBlur={handleBlur("phoneNumber")}
                    mode="outlined"
                    keyboardType="phone-pad"
                    theme={{ roundness: 999 }}
                  />
                  {touched.phoneNumber && errors.phoneNumber && (
                    <Text style={styles.error}>{errors.phoneNumber}</Text>
                  )}

                  {/* Descripción */}
                  <Text style={styles.label}>Descripción</Text>
                  <TextInput
                    value={values.description}
                    onChangeText={handleChange("description")}
                    onBlur={handleBlur("description")}
                    multiline
                    numberOfLines={4}
                    mode="outlined"
                    theme={{ roundness: 20 }}
                  />
                  {touched.description && errors.description && (
                    <Text style={styles.error}>{errors.description}</Text>
                  )}

                  {/* Foto Perfil */}
                  <Text style={styles.label}>Foto de Perfil</Text>
                  <Image
                    source={
                      localImage
                        ? { uri: localImage }
                        : user.imageProfile?.startsWith("data:image")
                        ? { uri: user.imageProfile }
                        : undefined
                    }
                    style={{ width: 100, height: 100, borderRadius: 8, marginBottom: 8 }}
                  />
                  <Button
                    icon="camera"
                    mode="contained"
                    onPress={() => pickImage(setFieldValue, "imageProfile")}
                    labelStyle={{ color: "#FFF" }}
                    buttonColor={colors.brandSecondary}
                  >
                    Foto de perfil
                  </Button>

                  {/* Campos extra para artista */}
                  {isArtist(user) && (
                    <>
                      <Text style={styles.label}>Redes Sociales</Text>
                      <TextInput
                        value={values.linkToSocialMedia}
                        onChangeText={handleChange("linkToSocialMedia")}
                        onBlur={handleBlur("linkToSocialMedia")}
                        mode="outlined"
                        placeholder="https://instagram.com/usuario"
                        autoCapitalize="none"
                        theme={{ roundness: 999 }}
                      />
                      {touched.linkToSocialMedia && errors.linkToSocialMedia && (
                        <Text style={styles.error}>{errors.linkToSocialMedia}</Text>
                      )}

                      <Text style={styles.label}>Tabla de Comisiones</Text>
                      <Image
                        source={
                          localTable
                            ? { uri: localTable }
                            : values.tableCommissionsPrice.startsWith("data:image")
                            ? { uri: values.tableCommissionsPrice }
                            : undefined
                        }
                        style={{ width: 100, height: 100, borderRadius: 8, marginBottom: 8 }}
                      />
                      <Button
                        icon="camera"
                        mode="contained"
                        onPress={() => pickImage(setFieldValue, "tableCommissionsPrice")}
                        labelStyle={{ color: "#FFF" }}
                        buttonColor={colors.brandSecondary}
                      >
                        Tabla de comisiones
                      </Button>
                    </>
                  )}

                  {/* Acciones */}
                  <Dialog.Actions style={{ marginTop: 20 }}>
                    <Button
                      labelStyle={{ color: "#FFF" }}
                      buttonColor={colors.brandPrimary}
                      onPress={onDismiss}
                    >
                      Cancelar
                    </Button>
                    <Button
                      labelStyle={{ color: "#FFF" }}
                      buttonColor={colors.brandSecondary}
                      onPress={() => handleSubmit()}
                    >
                      Guardar
                    </Button>
                  </Dialog.Actions>
                </>
              )}
            </Formik>
          </ScrollView>
        </Dialog.ScrollArea>
      </Dialog>
    </Portal>
  );
};

export default ArtistProfileDialog;