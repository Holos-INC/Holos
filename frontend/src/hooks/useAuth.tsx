import { useContext } from 'react';
import { AuthenticationContext } from '@/src/contexts/AuthContext';

export const useAuth = () => {
  const { loggedInUser, isAuthenticated, loading } = useContext(AuthenticationContext);

  const isArtist = Array.isArray(loggedInUser?.roles) && 
                   (loggedInUser.roles.includes("ARTIST") || loggedInUser.roles.includes("ARTIST_PREMIUM"));
  const isClient = Array.isArray(loggedInUser?.roles) && loggedInUser.roles.includes("CLIENT");
  const isAdmin = Array.isArray(loggedInUser?.roles) && loggedInUser.roles.includes("ADMIN");

  return { loggedInUser, isAuthenticated, isArtist, isClient, isAdmin, loading };
};
