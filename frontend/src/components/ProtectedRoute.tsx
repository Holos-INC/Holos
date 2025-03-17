import { useEffect } from "react";
import { useRouter } from "expo-router";
import { View, Text, ActivityIndicator } from "react-native";
import { useAuth } from "@/src/hooks/useAuth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ("ADMIN" | "ARTIST" | "CLIENT")[];
}

export default function ProtectedRoute({ children, allowedRoles = [] }: ProtectedRouteProps) {
  const { isAuthenticated, isArtist, isAdmin } = useAuth();
  const router = useRouter();

  const userRole = isAdmin ? "ADMIN" : isArtist ? "ARTIST" : "CLIENT";

  useEffect(() => {
    if (!isAuthenticated || (allowedRoles.length > 0 && !allowedRoles.includes(userRole))) {
      router.replace("/");
    }
  }, [isAuthenticated, userRole]);

  if (!isAuthenticated || (allowedRoles.length > 0 && !allowedRoles.includes(userRole))) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="blue" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return <>{children}</>;
}
