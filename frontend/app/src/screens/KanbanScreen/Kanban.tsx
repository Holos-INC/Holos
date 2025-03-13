import { useContext, useEffect, useState } from "react";
import { Commision, emptyCommision } from "./emptyCommission";
import { fetchCommissionsByArtist, organizeCommissions } from "@/app/services/CommisionKanbanService";
import { AuthenticationContext } from "@/app/context/AuthContext";
import { View, Text, ScrollView, Alert } from "react-native";
import CommissionCard from "./CommissionCard";
import CommissionColumn from "./CommissionColumn";
import { getArtistById } from "@/app/services/ArtistService";
import { getClientById } from "@/app/services/ClientService";

interface Order {
  id: number;
  name: string;
  description: string;
  prize: number;
}

interface ClientUser {
  id: number;
  name: string;
  username: string;
  password: string;
  email: string;
  phoneNumber: string;
  imageProfile: string;
  createdUser: string;
  orders: Order[];
}

interface Artist {
  id: number;
  name: string;
  username: string;
  password: string;
  email: string;
  phoneNumber: string;
  imageProfile: string;
  createdUser: string;
  authority: {
    id: number;
    authority: string;
  };
  numSlotsOfWork: number;
  tableCommisionsPrice?: string;
}

type User = ClientUser | Artist;

export default function Kanban() {
    const [commissions, setCommissions] = useState<Commision[]>([]);
    const { loggedInUser } = useContext(AuthenticationContext);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
          if (!loggedInUser || !loggedInUser.id) {
            Alert.alert("Error", "No se encontró el usuario autenticado.");
            return;
          } try {
            const client = await getClientById(loggedInUser.id);
            setUser(client);
          } catch (error) {
            try {
              const artist = await getArtistById(loggedInUser.id);
              setUser(artist);
            } catch (err) {
              Alert.alert("Error", "No se pudo cargar el usuario.");
            }
          }
        };
    
        fetchUser();
      }, [loggedInUser]);

    if (!loggedInUser) {
      return <Text>¡Inicia sesión para ver tu propio Kanban!</Text>;
    }

    useEffect(() => {
      const loadCommissions = async () => {
        if (loggedInUser.username) {
          const commissionsData = await fetchCommissionsByArtist(loggedInUser.username, loggedInUser.token);
          setCommissions(commissionsData);
        }
      };
  
      loadCommissions();
    }, [loggedInUser.username]);

  const groupedCommissions = organizeCommissions(commissions);

    return (
        <ScrollView horizontal>
            <View style={{ flexDirection: "row", padding: 10 }}>
                {Object.entries(groupedCommissions).map(([status, commissions]) => (
                    <CommissionColumn key={status} status={status} commissions={commissions} />
                ))}
            </View>
        </ScrollView>
    );
}