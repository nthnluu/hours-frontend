import {createContext, useContext, useEffect, useState} from "react";
import AuthAPI, {User} from "@util/auth/api";

type AuthState = { loading: boolean, isAuthenticated: boolean, currentUser: User | undefined };
const initialAuthState: AuthState = {
    loading: true,
    isAuthenticated: false,
    currentUser: undefined
};

const authContext = createContext(initialAuthState);

/** AuthProvider is a provider component that allows children to subscribe to authContext changes */
export const AuthProvider = authContext.Provider;

/** useSession is a hook that fetches a user session from the Acropolis API */
export function useSession(): AuthState {
    const [authState, setAuthState] = useState(initialAuthState);

    useEffect(() => {
        AuthAPI.getCurrentUser()
            .then(user => setAuthState({loading: false, isAuthenticated: true, currentUser: user}))
            .catch(() => setAuthState({loading: false, isAuthenticated: false, currentUser: undefined}));
    }, []);

    return authState;
}

/** useAuth is a hook that fetches an AuthState from the context provided by AuthProvider */
export function useAuth(): AuthState {
    return useContext(authContext);
}