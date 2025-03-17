import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { createContext, useEffect, useState } from 'react';
import { login } from "@/src/services/AuthEndpoints";
import { Platform } from 'react-native';

const AuthenticationContext = createContext();

export default function AuthenticationContextProvider (props) {
    const [loggedInUser, setLoggedInUser] = useState()

    const signOut = async (onSuccess = null, onError = null) => {
        try {
            await axios.post('/logout').catch(console.log);

            setLoggedInUser(null);

            if (Platform.OS === 'ios' || Platform.OS === 'android') {
                await SecureStore.deleteItemAsync('user');
            } else {
                await AsyncStorage.removeItem('user');
            }

            setLoggedInUser(null);
            delete axios.defaults.headers.common['Authorization'];

            if (onSuccess) { onSuccess() }
        } catch (error) {
            console.log(error)
            if (onError) { onError() }
        }
    }

    const signIn = async (data, onSuccess = null, onError = null) => {
        try {
            const user = await login(data);
            axios.defaults.headers.common = { Authorization: `bearer ${user.token}`}
            setLoggedInUser(user)

            if (Platform.OS === 'ios' || Platform.OS === 'android') {
                SecureStore.setItemAsync('user', JSON.stringify(user))
            } else {
                AsyncStorage.setItem('user', JSON.stringify(user))
            }

            if (onSuccess) { onSuccess(user) }
        } catch (error) {
            console.log(error)
            if (onError) { onError(error) }
        }
    };

    useEffect(() => {
        const loadUser = async () => {
            const storedUser = Platform.OS === 'web'
                ? await AsyncStorage.getItem('user')
                : await SecureStore.getItemAsync('user');

            if (storedUser) {
                const parsedUser = JSON.parse(storedUser);
                setLoggedInUser(parsedUser);
                axios.defaults.headers.common = { Authorization: `bearer ${parsedUser.token}` };
            }
        };

        loadUser();
    }, []);

    return (
        <AuthenticationContext.Provider value={{
            loggedInUser: loggedInUser,
            isAuthenticated: !!loggedInUser,
            signIn: signIn,
            signOut: signOut
        }}>
            {props.children}
        </AuthenticationContext.Provider>
    );
};

export { AuthenticationContext }