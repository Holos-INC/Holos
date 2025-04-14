import { useEffect, useMemo } from "react";
import { useRouter } from "expo-router";
import type { Href } from "expo-router";
import { useAuth } from "@/src/hooks/useAuth";
import LoadingScreen from "./LoadingScreen";

// Agregar "ARTIST_PREMIUM" al tipo UserRole
type UserRole = "ADMIN" | "ARTIST" | "ARTIST_PREMIUM" | "CLIENT";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  redirectTo?: Href;
}

export default function ProtectedRoute({ children, allowedRoles = [], redirectTo = "/" }: ProtectedRouteProps) {
  const { isAuthenticated, isArtist, isAdmin, loggedInUser, loading } = useAuth();
  const router = useRouter();

// Nota: isArtist incluye tanto ARTIST como ARTIST_PREMIUM.
  // En la mayoría de los casos, se ha puesto ARTIST y ARTIST_PREMIUM pero realmente con ARTIST, admite ambos roles.
  const userRole: UserRole = useMemo(() => {
    if (isAdmin) return "ADMIN";
    if (loggedInUser?.roles?.includes("ARTIST_PREMIUM")) return "ARTIST_PREMIUM";
    if (isArtist) return "ARTIST"; 
    return "CLIENT";
  }, [isAdmin, isArtist, loggedInUser]);

  const notAllowed = !isAuthenticated || (allowedRoles.length > 0 && !allowedRoles.includes(userRole));

  useEffect(() => {
    if (!loading && notAllowed) {
      router.replace(redirectTo);
    }
  }, [loading, notAllowed]);

  if (loading || notAllowed) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
}
