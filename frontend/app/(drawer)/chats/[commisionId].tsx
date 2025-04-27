import React, { useState, useEffect, useCallback, useContext } from 'react';
import { View, Button, Image, TouchableOpacity, Modal } from 'react-native';
import { GiftedChat, IMessage } from 'react-native-gifted-chat';
import { useLocalSearchParams,  useNavigation } from "expo-router";
import { AuthenticationContext } from "@/src/contexts/AuthContext";
import { getConversation, sendMessage, getNewMessages } from "@/src/services/chatService";
import * as ImagePicker from 'expo-image-picker';
import LoadingScreen from '@/src/components/LoadingScreen';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { MessageChat, MessageRecieved } from "@/src/constants/message";
import { Platform } from "react-native";
import { Send } from 'react-native-gifted-chat';
import { Ionicons } from '@expo/vector-icons';
import popUpMovilWindows  from "@/src/components/PopUpAlertMovilWindows";
import { Message } from 'react-native-gifted-chat';
import { styles } from "@/src/styles/Chat.styles";
import { getCommissionById } from "@/src/services/commisionApi";



 {/*Variables de imagenes*/}

const isWeb = Platform.OS === "web"
const icon ="📷"


export default function IndividualChatScreen({  }) {

      const params = useLocalSearchParams() as {
        commisionId?: string;
      };

    const { commisionId } = params;
    const { loggedInUser } = useContext(AuthenticationContext);
    
    const [messages, setMessages] = useState<IMessage[]>([]);
    const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);
    const [inputText, setInputText] = useState<string>(""); 
    const [loading, setLoading] = useState<boolean>(true);
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [imageToPreview, setImageToPreview] = useState<string | null>(null);
    const [lastFetchedDate, setLastFetchedDate] = useState<string >(new Date().toString());
    const [canSendMessage, setcanSendMessage] = useState<boolean >();
    const navigation = useNavigation();
    


    {/*Obtención del historial del chat*/}
    useEffect(() => {
        const fetchMessages = async () => {
            try {
              if (!commisionId) return;

              const dataCommision = await getCommissionById(Number(commisionId));

              const dataMessage = await getConversation(Number(commisionId), loggedInUser.token);
          
            if(dataCommision.status == 'ACCEPTED'){
                setcanSendMessage(true)
              }


          
              
          if (dataMessage.length < 0 ) return; 

              const formattedMessages: IMessage[] = dataMessage
                .map((msg: MessageRecieved) => {
                  return {
                    _id: msg.id,
                    text: msg.text,
                    createdAt: new Date(msg.creationDate),
                    user: {
                      _id: msg.senderId,
                      name: msg.senderName,
                    },
                    image: msg.image ? `data:image/jpeg;base64,${msg.image}` : undefined,
                  };
                })
                .sort((a: IMessage, b: IMessage) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          
              setMessages(formattedMessages);
              setSelectedImage(undefined);
              setLastFetchedDate(dataMessage[0].creationDate); 

            } catch (error) {
              console.error("Error obteniendo mensajes:", error);
            }
          };

        fetchMessages();
        setLoading(false);

        navigation.setOptions({ title: "Chat" });
    }, [loggedInUser, commisionId]); 
    
    
    
    useEffect(() => {
      if (!commisionId || !loggedInUser ) return;
    
      const interval = setInterval(async () => {
        try {
        
          const newMessages = await getNewMessages(
            Number(commisionId),
            loggedInUser.token,
            lastFetchedDate
          );

          


          if (newMessages.length > 0) {
            const formattedNewMessages: IMessage[] = newMessages.map((msg: MessageRecieved) => {
              return {
                _id: msg.id,
                text: msg.text,
                createdAt: new Date(msg.creationDate),
                user: {
                  _id: msg.senderId,
                  name: msg.senderName,
                },
                image: msg.image ? `data:image/jpeg;base64,${msg.image}` : undefined,
              };
            });
    
            setMessages((prevMessages) => {
              const nuevosSinDuplicados = formattedNewMessages.filter(
                (msg) =>
                  !prevMessages.some(
                    (m) =>
                      m.user._id === msg.user._id &&
                      new Date(m.createdAt).getTime() === new Date(msg.createdAt).getTime()
                  )
              );
    
              if (nuevosSinDuplicados.length > 0) {
                const latestDate = nuevosSinDuplicados[0].createdAt.toString();
                setLastFetchedDate(latestDate);
              }


              
    
              return GiftedChat.append(prevMessages, nuevosSinDuplicados);
            });
          
            if(newMessages[0].statusCommision == 'ACCEPTED' && canSendMessage == true ){
             
              
                setLastFetchedDate(newMessages[0].creationDate); 
            }else{
              setcanSendMessage(false);
              clearInterval(interval)
            }

          }
        } catch (err) {
          console.error(" Error al obtener nuevos mensajes:", err);
        }
      }, 500); // cada medio segundo
    
      return () => clearInterval(interval);
    }, [canSendMessage]);

    
        
    {/*Publicación de los mensajes*/}
    const onSend = useCallback(async (newMessages: IMessage[] = []) => {

        if (newMessages.length === 0 && !selectedImage) return; 
        const messageSend = newMessages[0]; 
        const textContent = messageSend.text.replace(icon, "").trim(); 

     

        if (textContent.trim().length === 0 && !selectedImage) {
          popUpMovilWindows("Mensaje inválido", "No se puede enviar un mensaje vacío.");
          return;
        }
        
        if (textContent.length > 125) {
          popUpMovilWindows("Mensaje demasiado largo", "El mensaje no puede tener más de 125 caracteres.");
          return;
        }

        if (textContent.length > 125) {
          popUpMovilWindows("Mensaje demasiado largo", "El mensaje no puede tener más de 125 caracteres.");
          return;
        }

        {/*Creación del mensaje para el backend*/}
        const formattedMessage: MessageChat = {
            text: textContent,
            createdAt: messageSend.createdAt.toString(),
            image: selectedImage || undefined, 
            commision: commisionId,   
        };
    
        {/*Envío del mensajes al "backend" */}
        try {
   
          await sendMessage(formattedMessage, loggedInUser.token);
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
            key={`chat-${loggedInUser.id}`}
                messages={messages}
                onSend={(messages: IMessage[]) => onSend(messages)}
                user={{ _id: loggedInUser.id, name: loggedInUser.username }}
                renderAvatar={() => null} 
                text={ canSendMessage
                  ? (((selectedImage && inputText !== icon ) && inputText.length == 0 ) ? icon : inputText): ""}
                onInputTextChanged={(text) => setInputText(text)}
                textInputProps={{
                    placeholder: canSendMessage ? "Escribe un mensaje...": "Ya no se puede enviar mensajes",
                    editable: true,
                }}
          
                renderSend={(props) => {
                    return (
                      <Send {...props}>
                        <View style={{ marginRight: 10, marginBottom: 5 }}>
                          <Ionicons name="send" size={28} color="#007aff" />
                        </View>
                      </Send>
                    );
                  
                 
                }}

                renderMessage={(props) => {
                  const isCurrentUser = props.currentMessage?.user._id === loggedInUser.id;
                
                  return (
                    <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: isCurrentUser ? 'flex-end' : 'flex-start',
                      paddingHorizontal: 10, // Espacio entre burbuja y borde de pantalla
                    }}
                  >
                    <View
                      style={{
                        maxWidth: '80%',
                      }}
                    >
                      <Message
                        {...props}
                        containerStyle={{
                          left: { marginLeft: 0, paddingLeft: 0 },
                          right: { marginRight: 0, paddingRight: 0 },
                        }}
                      />
                    </View>
                  </View>
                  );
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
           {canSendMessage && (
                 <View style={styles.imagePickerContainer}>
                 <Button title="Seleccionar Imagen" onPress={pickImage} />
                {selectedImage && (
                    <Image
                   source={{ uri: selectedImage }}
                  style={styles.imagePreview}
                    />
                  )}
                  </View>
                  )}

            {modalVisible && imageToPreview && (
                <Modal visible={modalVisible} transparent={true}>
                    <View style={{ flex: 1, backgroundColor: "#000000cc", justifyContent: "center", alignItems: "center" }}>
                      <View style={styles.closeButtonContainer}>
                        <TouchableOpacity onPress={() => setModalVisible(false)}>
                          <Ionicons name="close" size={28} color="white" />
                        </TouchableOpacity>
                      </View>

                      <Image
                        source={{ uri: imageToPreview }}
                        style={{ width: 300, height: 300, borderRadius: 15 }}
                        resizeMode="contain"
                        />
                      <Button title="Descargar imagen" onPress={() => downloadImage(imageToPreview)} />
                    </View>
                </Modal>
                )}
        </View>

        
    );
}