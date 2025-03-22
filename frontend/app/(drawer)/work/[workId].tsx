
import React, { useEffect, useState  } from "react";
import { View, Text, ActivityIndicator, Image, ScrollView, Dimensions, TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import { getWorksDoneById } from "@/src/services/WorksDoneApi";
import staticStyles, { createDynamicStyles } from "@/src/styles/WorkDetail.styles";
import { useNavigation, useLocalSearchParams, useRouter } from "expo-router";
import ReportDropdown from "@/src/components/report/ReportDropDown";
import { API_URL } from "@/src/constants/api";


export interface Artist {
  id: number;
  name: string;
  username: string;
  email: string;
  phoneNumber?: string;
  imageProfile?: string;
  tableCommisionsPrice?: string;
}

export interface Work {
  id: number;
  name: string;
  description: string | null;
  price: number | null;
  artist: Artist;
  image: string;
}

export default function WorkDetailScreen() {

  const router = useRouter();
  const navigation = useNavigation();
  const { workId } = useLocalSearchParams();

  const [work, setWork] = useState<Work | null>(null);
  const [loading, setLoading] = useState(true);

  const screenWidth = Dimensions.get("window").width;
  const isLargeScreen = screenWidth >= 1024;

  const dynamicStyles = createDynamicStyles(isLargeScreen);
  
  const [menuVisibleId, setMenuVisibleId] = useState<number| null>(null);
  

  useEffect(() => {
    const fetchWork = async () => {
      try {
        const data = (await getWorksDoneById(Number(workId))) as Work;
        setWork(data);
      } catch (error) {
        console.error("Error fetching work details:", error);
        setWork(null);
      } finally {
        setLoading(false);
      }
    };

    fetchWork();
  }, [workId]);

  useEffect(() => {
    navigation.setOptions({ title: `${work?.name}` });
  }, [navigation, work]);

  if (loading) {
    return (
      <View style={staticStyles.loaderContainer}>
        <ActivityIndicator size="large" color="#333" />
      </View>
    );
  }

  if (!work) {
    return (
      <View style={staticStyles.notFoundContainer}>
        <Text style={staticStyles.notFoundText}>No se encontró la obra</Text>
      </View>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={() => {
          if (menuVisibleId !== null) {
            setMenuVisibleId(null); // Cierra el menú al tocar fuera
          }
        }}>

    <ScrollView
      style={staticStyles.container}
      contentContainerStyle={dynamicStyles.scrollContent}
    >

 
      <View style={dynamicStyles.contentContainer}>
     
      <View style={[dynamicStyles.imageContainer, { position: "relative" }]}>

          {work.image ? (

            <Image
              source={{ uri: `${API_URL}${work.image}` }}
              style={dynamicStyles.image}
            />       
          ) : (
            <View style={staticStyles.placeholder}>
              <Text style={{ color: "#aaa" }}>Sin imagen</Text>
            </View>
          )}
           { work.image && (
        <View style={staticStyles.reportDropdownContatiner}>
            <ReportDropdown  workId={work.id}  menuVisibleId={menuVisibleId}  setMenuVisibleId={setMenuVisibleId}  isBigScreen={false} />
            </View>
        )}
          
        </View>
     
        <View style={staticStyles.infoContainer}>
          <Text style={staticStyles.title}>
            {work.name ? work.name.toUpperCase() : "TÍTULO OBRA"}
          </Text>

          <Text style={dynamicStyles.label}>ARTISTA:</Text>
          <TouchableOpacity
            onPress={() => {
              if (work.artist && work.artist.id) {
                router.push(`/profile/${work.artist.id}`);
              } else {
                console.warn("No se encontró el artista");
              }
            }}
          >
            <Text style={dynamicStyles.artistName}>
              {work.artist?.username || "Artista desconocido"}
            </Text>
          </TouchableOpacity>
          <Text style={dynamicStyles.label}>DESCRIPCIÓN:</Text>
          <Text style={dynamicStyles.description}>
            {work.description || "Sin descripción disponible"}
          </Text>
          <Text style={staticStyles.label}>PRECIO:</Text>

          <Text style={staticStyles.price}>
            {work.price ? `${work.price} €` : "No disponible"}
          </Text>

          <View style={staticStyles.buttonRow}>
            
            <TouchableOpacity style={staticStyles.messageButton}>
              <Text style={staticStyles.messageButtonText}>
                MANDAR UN MENSAJE
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={staticStyles.buyButton} onPress={() => navigation.navigate("Payment", { workId: work.id, price: work.price ?? 0 }) } > {/*TODO Change navigation*/}
              <Text style={staticStyles.buyButtonText}>
                COMPRAR
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

    </ScrollView>
    </TouchableWithoutFeedback>
  );
}
