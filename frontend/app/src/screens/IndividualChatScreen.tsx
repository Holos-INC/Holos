import React, { useState, useCallback } from 'react';
import { View, StyleSheet} from 'react-native';
import { GiftedChat, IMessage } from 'react-native-gifted-chat';

const API_URL = "http://localhost:3000/messages"; // URL del JSON Server

 {/* para arrancar el "backend" insertar en la consola de comando json-server --watch db.json --port 3000*/}


 {/*Variables de imagenes*/}
const artistAvatar= "https://cdn.pixabay.com/photo/2016/03/31/19/56/avatar-1295395_960_720.png "


export default function IndividualChatScreen({ navigation }) {
    
    const [messages, setMessages] = useState<IMessage[]>([]);
          
    {/*Publicación de los mensajes*/}
    const onSend = useCallback(async (newMessages: IMessage[] = []) => {

        if (newMessages.length === 0) return; 

        {/*Creación del mensaje*/}
        const message = {
            _id: new Date().getTime(), 
            text:  newMessages[0].text, 
            createdAt: new Date(),
            user: {
                _id: 1,
                name: "Usuario",
                avatar: artistAvatar,
            },
        };


        {/*Formateo del json del GiftedChat al json de la base de datos*/}
        const formattedMessage = {
            id: message._id,
            text: message.text,
            createdAt: message.createdAt,
            user: {
                id: message.user._id,
                name: message.user.name,
                avatar: message.user.avatar || artistAvatar,
            },
        };
    
        {/*Envía los mensajes al "backend" */}
        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" }, 
                body: JSON.stringify(formattedMessage),
            });

            if (!response.ok) {
                throw new Error("Error al enviar el mensaje");
            }

            
            setMessages((previousMessages) =>
                GiftedChat.append(previousMessages, [message])
            );

          
          
        } catch (error) {
            console.error("Error enviando mensaje:", error);
        }
    }, []); 

  
    return (
        <View style={styles.container}>
            <GiftedChat
                messages={messages}
                onSend={(messages: IMessage[]) => onSend(messages)}
                user={{ _id: 1, name: "Usuario", avatar: artistAvatar }}
                showUserAvatar={true}
                textInputProps={{
                    placeholder: "Escribe un mensaje...",
                    editable: true,
                }}
            
            />
         
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
