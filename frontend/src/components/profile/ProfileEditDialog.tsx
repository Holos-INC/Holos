import * as Yup from "yup";
import { Formik } from "formik";
import React, { useContext, useState } from "react";
import colors from "@/src/constants/colors";
import * as ImagePicker from "expo-image-picker";
import { artistUser } from "@/src/constants/user";
import { Text, Image, ScrollView } from "react-native";
import { ArtistDTO } from "@/src/constants/ExploreTypes";
import { updateUserArtist } from "@/src/services/artistApi";
import { updateUserClient } from "@/src/services/clientApi";
import { Platform, useWindowDimensions } from "react-native";
import { BaseUserDTO } from "@/src/constants/CommissionTypes";
import { Dialog, Portal, Button, TextInput } from "react-native-paper";
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
  const isArtist = isArtistUser(user);
  const [imageProfile, setImageProfile] = useState<string | null>(null);
  const [tableCommissionsPrice, setTableCommisionsPrice] = useState<
    string | null
  >(null);
  const { signOut } = useContext(AuthenticationContext);
  const router = useRouter();

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

  const initialValues: artistUser = {
    username: user.username ?? "",
    firstName: user.name ?? "",
    email: user.email ?? "",
    phoneNumber: user.phoneNumber ?? "",
    description: user.description ?? "",
    imageProfile: user.imageProfile ?? "",
    linkToSocialMedia: isArtist
      ? (user as ArtistDTO).linkToSocialMedia ?? ""
      : "",
    tableCommissionsPrice: isArtist
      ? (user as ArtistDTO).tableCommissionsPrice ?? ""
      : "",
  };

  function isArtistUser(user: any): user is ArtistDTO {
    return (
      typeof user === "object" &&
      "authorityName" in user &&
      (user.authorityName === "ARTIST" ||
        user.authorityName === "ARTIST_PREMIUM")
    );
  }

  const sendProfile = async (values: any) => {
    try {
      const usernameChanged = values.username !== user.username;

      if (isArtist) {
        await updateUserArtist(values, token);
      } else {
        const { tableCommissionsPrice, linkToSocialMedia, ...baseUserValues } =
          values;
        await updateUserClient(baseUserValues, token);
      }

      // filter large fields before updating global user state
      const { imageProfile, tableCommissionsPrice, ...safeValues } = values;
      setUser({ ...user, ...safeValues }); // safe copy

      if (usernameChanged) {
        router.replace("/login");
        signOut(() => console.log("Logged out!"));
      } else {
        await refreshUser();
        onDismiss();
      }
      onDismiss();
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
          borderWidth: 0,
          overflow: "hidden",
        }}
      >
        <Dialog.ScrollArea
          style={{
            borderTopWidth: 0,
            borderBottomWidth: 0,
          }}
        >
          <ScrollView
            contentContainerStyle={{ paddingHorizontal: 24 }}
            showsVerticalScrollIndicator={false}
          >
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={(values) => {
                sendProfile(values);
                onDismiss();
              }}
            >
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                errors,
                touched,
                setFieldValue,
              }) => (
                <>
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
                    * ¡Si cambias de nombre de usuario tendrás que volver a
                    iniciar sesión!
                  </Text>

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

                  <Text style={styles.label}>Foto de Perfil</Text>
                  <Image
                    source={
                      imageProfile
                        ? { uri: imageProfile }
                        : user.imageProfile?.startsWith("data:image")
                        ? { uri: user.imageProfile }
                        : undefined
                    }
                  />

                  <Button
                    icon={"camera"}
                    mode="contained"
                    onPress={() => pickImage(setFieldValue, "imageProfile")}
                    labelStyle={{
                      color: "#FFF",
                      fontSize: 20,
                    }}
                    style={{ borderRadius: 10 }}
                    buttonColor={colors.brandSecondary}
                  >
                    Foto de perfil
                  </Button>

                  {isArtist && (
                    <>
                      <Text style={styles.label}>Redes Sociales</Text>
                      <TextInput
                        value={values.linkToSocialMedia ?? ""}
                        onChangeText={handleChange("linkToSocialMedia")}
                        onBlur={handleBlur("linkToSocialMedia")}
                        mode="outlined"
                        theme={{ roundness: 999 }}
                      />
                      {touched.linkToSocialMedia &&
                        errors.linkToSocialMedia && (
                          <Text style={styles.error}>
                            {errors.linkToSocialMedia}
                          </Text>
                        )}

                      <Text style={styles.label}>Tabla de Precios</Text>
                      <Image
                        source={
                          tableCommissionsPrice
                            ? { uri: tableCommissionsPrice }
                            : user.tableCommissionsPrice?.startsWith(
                                "data:image"
                              )
                            ? { uri: user.tableCommissionsPrice }
                            : undefined
                        }
                      />

                      <Button
                        icon={"camera"}
                        mode="contained"
                        onPress={() =>
                          pickImage(setFieldValue, "tableCommissionsPrice")
                        }
                        labelStyle={{
                          color: "#FFF",
                          fontSize: 20,
                        }}
                        style={{ borderRadius: 10 }}
                        buttonColor={colors.brandSecondary}
                      >
                        Tabla de comisiones
                      </Button>
                    </>
                  )}

                  <Dialog.Actions style={{ marginTop: 20 }}>
                    <Button
                      labelStyle={{
                        color: "#FFF",
                        fontSize: 20,
                      }}
                      style={{ borderRadius: 10 }}
                      buttonColor={colors.brandPrimary}
                      onPress={onDismiss}
                    >
                      Cancelar
                    </Button>
                    <Button
                      labelStyle={{
                        color: "#FFF",
                        fontSize: 20,
                      }}
                      style={{ borderRadius: 10 }}
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
