import React, { useState } from "react";
import { View } from "react-native";
import { Button } from "react-native-paper";
import { useRouter, usePathname } from "expo-router";
import colors from "@/src/constants/colors";
import LoginModal from "@/src/components/LoginModal";
import { useAuth } from "@/src/hooks/useAuth";
import { ArtistDTO } from "@/src/constants/ExploreTypes";
import { BaseUserDTO } from "@/src/constants/CommissionTypes";

type ActionButtonsProps = {
  isClient: boolean;
  isCurrentUser: boolean;
  user: ArtistDTO | BaseUserDTO | null;
};

const ActionButtons: React.FC<ActionButtonsProps> = ({
  isClient,
  isCurrentUser,
  user
}) => {
  const router = useRouter();
  const pathname = usePathname();          
  const { isAuthenticated, isArtist, isPremium, isAdmin } = useAuth();
  const [showLogin, setShowLogin] = useState(false);

  
  if (isCurrentUser) {
    if(isArtist){
      if(isPremium){
        return(
        <View
        style={{ margin: 10, flexDirection: "row", alignSelf: "center", gap: 10 }}
        >
        <Button
        icon="credit-card"
        mode="contained"
        buttonColor={colors.brandPrimary}
        style={{ padding: 5 }}
        labelStyle={{ fontWeight: "bold", fontSize: 16 }}
        onPress={() => router.push("/profile/stripe-setup")}
        >
          Conectar Stripe
        </Button>
        <Button
          icon="crown"
          mode="contained"
          buttonColor={colors.brandSecondary}
          style={{ padding: 5 }}
          labelStyle={{ fontWeight: "bold", fontSize: 16 }}
          onPress={async () => {
            try {
              alert("¿Estás seguro de que deseas cancelar tu suscripción?");
              const response = await fetch("/api/v1/stripe-subscription/delete", {
                method: "DELETE",
                headers: {
                  "Content-Type": "application/json",
                },
              });

              if (response.ok) {
                alert("Suscripción cancelada con éxito.");
              } else {
                const errorData = await response.json();
                console.log(`Error al cancelar la suscripción: ${errorData.message}`);
              }
            } catch (error) {
              alert("Ocurrió un error al cancelar la suscripción.");
            }
          }}
        >
          Dejar de ser Premium
        </Button>
        </View>
      )
      }else{
        return(
        <View
        style={{ margin: 10, flexDirection: "row", alignSelf: "center", gap: 10 }}
        >
        <Button
          icon="credit-card"
          mode="contained"
          buttonColor={colors.brandPrimary}
          style={{ padding: 5 }}
          labelStyle={{ fontWeight: "bold", fontSize: 16 }}
          onPress={() => router.push("/profile/stripe-setup")}
        >
          Conectar Stripe
        </Button>
        <Button
          icon="crown"
          mode="contained"
          buttonColor={colors.brandPrimary}
          style={{ padding: 5 }}
          labelStyle={{ fontWeight: "bold", fontSize: 16 }}
          onPress={() => router.push("/profile/premium")}
        >
          Holos Premium
        </Button>
        </View>
      )
      }  
    }
  }else{
    if(isArtist){
    }else if(isAdmin){
    }else{
      return(
        <Button
        icon="email"
        mode="contained"
        buttonColor={colors.brandSecondary}
        style={{ padding: 5, alignSelf: "center" }}
        labelStyle={{ fontWeight: "bold", fontSize: 16 }}
        onPress={() => {
          if (isAuthenticated) {
            router.push(`/commissions/request/${user?.username}`);
          } else {
            setShowLogin(true); 
          }
        }}
        >
        Solicitar trabajo personalizado
        </Button>
      )
    }
  }

  
  return (
    <>
      <LoginModal
        visible={showLogin}
        onDismiss={() => setShowLogin(false)}
        onLoginSuccess={() => {
          setShowLogin(false);
          router.replace(pathname as any);   
         
        }}
      />
    </>
  );
};

export default ActionButtons;
