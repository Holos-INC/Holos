import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { createContext, useState } from 'react';
import { login } from '../api/AuthEndpoints';

const AuthenticationContext = createContext();

export default function AuthenticationContextProvider (props) {
    const [loggedInUser, setLoggedInUser] = useState()

    const signOut = async (onSuccess = null, onError = null) => {
        try {
            setLoggedInUser(null);

            if (Platform.OS === 'ios' || Platform.OS === 'android') {
                SecureStore.deleteItemAsync('user', JSON.stringify(loggedInUser))
            } else {
                AsyncStorage.removeItem('user', JSON.stringify(loggedInUser))
            }

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

    return (
        <AuthenticationContext.Provider value={{
            loggedInUser: loggedInUser,
            signIn: signIn,
            signOut: signOut
        }}>
            {props.children}
        </AuthenticationContext.Provider>
    );
};

export { AuthenticationContext }