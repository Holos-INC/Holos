import ContactUsTextInput from "@/src/components/ContactUsTextInput";
import popUpMovilWindows from "@/src/components/PopUpAlertMovilWindows";
import React, { useState } from "react";
import { Linking, ScrollView, Text,  TouchableOpacity,  View, } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome6";
import emailjs from "@emailjs/browser";
import { Platform } from "react-native";
import { useFonts } from "expo-font";
import LoadingScreen from "@/src/components/LoadingScreen";
import { styles } from "@/src/styles/contactUs.styles";

const defaultPlaceholderColor = "#888";
const colorIncon = "#16366E";
const sizeIcon = 30;
const maxShotLenthInput = 50;
const maxLongLenthInput = 500;
const isWeb = Platform.OS === "web";

const serviceId = "service_bmdk6qb";
const templateId = "template_makvnca";
const publicKey = "VN4LEZ-O4uZ8g7sRH";

export default function ContactUs() {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [fontsLoaded] = useFonts({
    "Montserrat-Regular": require("@/assets/fonts/Montserrat/Montserrat-Regular.ttf"),
    "Montserrat-Bold": require("@/assets/fonts/Montserrat/Montserrat-Bold.ttf"),
  });

  const handleSendMessage = () => {
    if (!name.trim()) {
      popUpMovilWindows("Error", "El nombre es obligatorio");
      return;
    }
    if (!email.trim()) {
      popUpMovilWindows("Error", "El email es obligatorio");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      popUpMovilWindows("Error", "El email no es válido");
      return;
    }
    if (!message.trim()) {
      popUpMovilWindows("Error", "El mensaje es obligatorio");
      return;
    }

    emailjs
      .send(
        serviceId!,
        templateId!,
        {
          from_name: name,
          reply_to: email,
          message: message,
        },
        publicKey!
      )
      .then(() => {
        popUpMovilWindows(
          "Éxito",
          "¡Tu mensaje ha sido enviado correctamente!"
        );
        setName("");
        setEmail("");
        setMessage("");
      })
      .catch(() => {
        popUpMovilWindows("Error", "Hubo un problema al enviar el mensaje.");
      });
  };

  if (!fontsLoaded && serviceId && templateId && publicKey) {
    return <LoadingScreen />;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={[styles.contentWrapper]}>
        <Text style={styles.title}>
          ¡¡No dudes en ponerte en contacto con nosotros!!
        </Text>
        <Text style={styles.subtitle}>
          ¿Tienes dudas, ideas o simplemente quieres decir hola? ¡Escríbenos!
        </Text>
        <View style={styles.infoSection}>
          <View style={styles.infoBlock}>
            <Text style={styles.sectionHeader}>Puedes encontrarnos en: </Text>
            <View style={styles.mapWrapper}>
              <View style={{ flex: 1 }}>
                <iframe
                  title="Ubicacion"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6342.67312084915!2d-5.989684023552625!3d37.358212536045464!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd126dd4a3055555%3A0x29c3f634f8a021b8!2sEscuela%20T%C3%A9cnica%20Superior%20de%20Ingenier%C3%ADa%20Inform%C3%A1tica!5e0!3m2!1ses!2ses!4v1741824402518!5m2!1ses!2ses"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                />
              </View>
            </View>
          </View>

          <View style={styles.infoBlock}>
            <Text style={styles.sectionHeader}>Envianos un mensaje</Text>
            <View style={styles.formWrapper}>
              <ContactUsTextInput
                placeholder="Nombre"
                placeholderTextColor={defaultPlaceholderColor}
                maxLength={maxShotLenthInput}
                value={name}
                onChangeText={setName}
                isWeb={isWeb}
              />
              <ContactUsTextInput
                placeholder="Correo electrónico"
                placeholderTextColor={defaultPlaceholderColor}
                keyboardType="email-address"
                maxLength={maxShotLenthInput}
                value={email}
                onChangeText={setEmail}
                isWeb={isWeb}
              />
              <ContactUsTextInput
                style={[styles.messageInput]}
                placeholder="Escribe aquí tu mensaje..."
                placeholderTextColor={defaultPlaceholderColor}
                maxLength={maxLongLenthInput}
                multiline
                numberOfLines={4}
                value={message}
                onChangeText={setMessage}
                isWeb={isWeb}
              />
              <TouchableOpacity
                style={styles.button}
                onPress={handleSendMessage}
              >
                <Text style={styles.buttonText}>Enviar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.additionalInfoWrapper}></View>
        {!isWeb ? (
          <TouchableOpacity
            onPress={() => Linking.openURL("mailto:holos.soporte@gmail.com")}
          >
            <Text style={styles.textemail}>
              Pss... Si tienes ganas de charlar largo y tendido, mándanos un
              correo a <Text style={styles.email}>holos.soporte@gmail.com</Text>{" "}
              😎✉️
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() =>
              (window.location.href = "mailto:holos.soporte@gmail.com")
            }
          >
            <Text style={styles.textemail}>
              Pss... Si tienes ganas de charlar largo y tendido, mándanos un
              correo a <Text style={styles.email}>holos.soporte@gmail.com</Text>{" "}
              😎✉️
            </Text>
          </TouchableOpacity>
        )}
        <View style={styles.socialMediaWrapper}>
          <Text style={styles.sectionHeader}>
            ¡Síguenos y únete a la aventura!
          </Text>
          <View style={styles.socialIconsRow}>
            <TouchableOpacity
              style={styles.socialIconButton}
              onPress={() =>
                Linking.openURL("http://www.youtube.com/@holosapp")
              }
            >
              <Icon name="youtube" size={sizeIcon} color={colorIncon} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.socialIconButton}
              onPress={() =>
                Linking.openURL("https://www.instagram.com/holosapp/")
              }
            >
              <Icon name="instagram" size={sizeIcon} color={colorIncon} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.socialIconButton}
              onPress={() =>
                Linking.openURL("https://www.tiktok.com/@holosapp")
              }
            >
              <Icon name="tiktok" size={sizeIcon} color={colorIncon} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.socialIconButton}
              onPress={() =>
                Linking.openURL("https://sites.google.com/view/holos/inicio")
              }
            >
              <Icon name="globe" size={sizeIcon} color={colorIncon} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
