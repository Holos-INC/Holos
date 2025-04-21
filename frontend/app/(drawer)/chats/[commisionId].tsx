import React, { useState, useEffect, useCallback, useContext } from 'react';
import { View, StyleSheet, Button, Image, TouchableOpacity, Modal } from 'react-native';
import { GiftedChat, IMessage } from 'react-native-gifted-chat';
import { useLocalSearchParams } from "expo-router";
import { AuthenticationContext } from "@/src/contexts/AuthContext";
import { getConversation, sendMessage } from "@/src/services/chatService";
import * as ImagePicker from 'expo-image-picker';
import LoadingScreen from '@/src/components/LoadingScreen';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { Message } from "@/src/constants/message";
import { Platform } from "react-native";

 {/*Variables de imagenes*/}
const artistAvatar= "https://cdn.pixabay.com/photo/2016/03/31/19/56/avatar-1295395_960_720.png "
const icon =". "
const isWeb = Platform.OS === "web"

export default function IndividualChatScreen({  }) {

      const params = useLocalSearchParams() as {
        commisionId?: string;
        otherUsername?: string;
      };

    const { commisionId } = params;
    const { loggedInUser } = useContext(AuthenticationContext);
    
    const [messages, setMessages] = useState<IMessage[]>([]);
    const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);
    const [inputText, setInputText] = useState<string>(""); 
    const [loading, setLoading] = useState<boolean>(true);
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [imageToPreview, setImageToPreview] = useState<string | null>(null);

    {/*Obtención del historial del chat*/}
    useEffect(() => {
        const fetchMessages = async () => {
            try {
              if (!commisionId) return;
          
              const data = await getConversation(Number(commisionId), loggedInUser.token);
              console.log("Mensajes recibidos del backend:", data);
          
              const currentUserId = loggedInUser.id;
          
              const formattedMessages: IMessage[] = data
                .map((msg: any) => {
                  const isFromArtist = msg.commision.artist.id === currentUserId;
                  const sender = isFromArtist ? msg.commision.artist : msg.commision.client;
          
                  return {
                    _id: msg.id,
                    text: msg.text,
                    createdAt: new Date(msg.creationDate),
                    user: {
                      _id: sender.id,
                      name: isFromArtist ? msg.commision.artist.baseUser.username : msg.commision.artist.baseUser.username,
                      avatar: sender.baseUser?.imageProfile || artistAvatar,
                    },
                    image: msg.image ? `data:image/jpeg;base64,${msg.image}` : undefined,
                  };
                })
                .sort((a: IMessage, b: IMessage) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          
              setMessages(formattedMessages);
              setSelectedImage(undefined);
            } catch (error) {
              console.error("Error obteniendo mensajes:", error);
            }
          };

        fetchMessages();
        setLoading(false);
    }, []);

        
        
    {/*Publicación de los mensajes*/}
    const onSend = useCallback(async (newMessages: IMessage[] = []) => {

        if (newMessages.length === 0 && !selectedImage) return; 

        {/*Creación del mensaje*/}
        const message = {
            _id: new Date().getTime(), 
            text:  newMessages[0].text, 
            createdAt: new Date(),
            user: {
                _id: loggedInUser.id,
                name: loggedInUser.username,
                avatar: loggedInUser.image,
            },
            image: selectedImage || undefined,
        };


        {/*Creación del mensaje para el backend*/}
        const formattedMessage: Message = {
            text: message.text ?? " ",
            createdAt: message.createdAt.toISOString(),
            image: selectedImage || undefined, 
            commision: commisionId
        };
    
        {/*Envío del mensajes al "backend" */}
        try {
           
            await sendMessage(formattedMessage, loggedInUser.token);

            
            setMessages((previousMessages) =>
                GiftedChat.append(previousMessages, [message])
            );

            setSelectedImage(undefined); 
          
        } catch (error) {
            console.error("Error enviando mensaje:", error);
        }
    }, [selectedImage]); 

     {/*Permite seleccionar imagenes*/}
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled && result.assets.length > 0) {
            setSelectedImage(result.assets[0].uri); 
        }
    };

    const downloadImageWeb  = (uri: string, filename = "imagen.png") => {
      const link = document.createElement("a");
      link.href = uri;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    const downloadImageMobile = async (uri: string) => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
    
      if (status !== 'granted') {
        alert("Se necesita permiso para guardar la imagen");
        return;
      }
    
      const filename = uri.substring(uri.lastIndexOf('/') + 1);
      const fileUri = FileSystem.documentDirectory + filename;
    
      const downloadResumable = await FileSystem.downloadAsync(uri, fileUri);
      const asset = await MediaLibrary.createAssetAsync(downloadResumable.uri);
      await MediaLibrary.createAlbumAsync('ChatApp', asset, false);
    
      alert("Imagen guardada en la galería");
    };


    const downloadImage = (uri: string) => {
      if (isWeb) {
        downloadImageWeb(uri);
      } else {
        downloadImageMobile(uri);
      }
    };


 if (loading) return <LoadingScreen />;

    return (
        <View style={styles.container}>
            <GiftedChat
                messages={messages}
                onSend={(messages: IMessage[]) => onSend(messages)}
                user={{ _id: 1, name: "Usuario", avatar: artistAvatar }}
                showUserAvatar={true}
                text={((selectedImage && inputText !== icon ) && inputText.length ===0 ) ? icon : inputText}
                onInputTextChanged={(text) => setInputText(text)}
                textInputProps={{
                    placeholder: "Escribe un mensaje...",
                    editable: true,
                }}

                renderMessageImage={(props) => {
                    const uri = props.currentMessage?.image;
                    return (
                      <TouchableOpacity onPress={() => {
                        setImageToPreview(uri ?? null);
                        setModalVisible(true);
                      }}>
                        <Image
                          source={{ uri }}
                          style={{ width: 200, height: 200, borderRadius: 10, margin: 5 }}
                          resizeMode="cover"
                        />
                      </TouchableOpacity>
                    );
                  }}
            
            />
            <View style={styles.imagePickerContainer}>
                <Button title="Seleccionar Imagen" onPress={pickImage} />
                {selectedImage && <Image source={{ uri: selectedImage }} style={styles.imagePreview} />}
            </View>

            {modalVisible && imageToPreview && (
                <Modal visible={modalVisible} transparent={true}>
                    <View style={{ flex: 1, backgroundColor: "#000000cc", justifyContent: "center", alignItems: "center" }}>
                    <Image
                        source={{ uri: imageToPreview }}
                        style={{ width: 300, height: 300, borderRadius: 15 }}
                        resizeMode="contain"
                    />
                    <Button title="Descargar imagen" onPress={() => downloadImage(imageToPreview)} />
                    <Button title="Cerrar" onPress={() => setModalVisible(false)} />
                    </View>
                </Modal>
)}
        </View>

        
    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1,
        backgroundColor: "#f5f5f5"
        },

    imagePickerContainer: { 
        padding: 10,
        alignItems: 'center'
        },

    imagePreview: { 
        width: 100,
        height: 100,
        marginTop: 10,
        borderRadius: 10
        }
});
