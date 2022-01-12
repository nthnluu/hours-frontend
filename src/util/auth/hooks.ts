import {createContext, useContext, useEffect, useState} from "react";
import AuthAPI, {User} from "@util/auth/api";
import {collection, getFirestore, onSnapshot} from "@firebase/firestore";
import { useAsyncEffect } from "@util/hooks/useAsyncEffect";

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

    useAsyncEffect(async (): Promise<void> => {
        try {
            const user = await AuthAPI.getCurrentUser();
            setAuthState({ loading: false, isAuthenticated: true, currentUser: user });
        } catch {
            setAuthState({ loading: false, isAuthenticated: false, currentUser: undefined });
        }
    }, []);

    return authState;
}

/** useAuth is a hook that fetches an AuthState from the context provided by AuthProvider */
export function useAuth(): AuthState {
    return useContext(authContext);
}

/** useAdmins is a hook that fetches all admins. */
// TODO: should use a query.
export default function useAdmins(): [User[] | undefined, boolean] {
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState<User[] | undefined>(undefined);

    useEffect(() => {
        const db = getFirestore();
        onSnapshot(collection(db, "user_profiles"), (querySnapshot) => {
            const res: User[] = [];
            querySnapshot.forEach((doc) => {
                if (doc.data().isAdmin) res.push({id: doc.id, ...doc.data()} as User);
            });

            setUsers(res);
            setLoading(false);
        });
    }, []);

    return [users, loading];
}
