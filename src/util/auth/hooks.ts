import {createContext, useContext, useEffect, useState} from "react";
import AuthAPI, {User} from "@util/auth/api";
import {collection, doc, getFirestore, onSnapshot} from "@firebase/firestore";
import {useAsyncEffect} from "@util/hooks/useAsyncEffect";

type AuthState = { loading: boolean, isAuthenticated: boolean, currentUser: User | undefined, isTA: (courseID: string) => boolean };
const initialAuthState: AuthState = {
    loading: true,
    isAuthenticated: false,
    currentUser: undefined,
    isTA: () => false
};

const authContext = createContext(initialAuthState);

/** AuthProvider is a provider component that allows children to subscribe to authContext changes */
export const AuthProvider = authContext.Provider;

/** useSession is a hook that fetches a user session from the Acropolis API */
export function useSession(): AuthState {
    const [authState, setAuthState] = useState(initialAuthState);
    let unsubscribe = () => {};

    useAsyncEffect(async (): Promise<void> => {
        try {
            const sessionUser = await AuthAPI.getCurrentUser();
            const db = getFirestore();
            unsubscribe = onSnapshot(doc(db, "user_profiles", sessionUser.id), (doc) => {
                if (doc.exists()) {
                    const user = doc.data();
                    setAuthState({
                        loading: false,
                        isAuthenticated: true,
                        currentUser: {id: user.id, ...doc.data()} as User,
                        isTA: courseID => (user.coursePermissions != null) && (user.coursePermissions[courseID] != undefined)
                    });
                }
            });
        } catch {
            setAuthState({loading: false, isAuthenticated: false, currentUser: undefined, isTA: () => false});
        }
    }, [], () => unsubscribe());

    return authState;
}

/** useAuth is a hook that fetches an AuthState from the context provided by AuthProvider */
export function useAuth(): AuthState {
    return useContext(authContext);
}

/** useAdmins is a hook that fetches all admins. */
// TODO(n-young): should use a query.
export default function useAdmins(): [User[] | undefined, boolean] {
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState<User[] | undefined>(undefined);

    useEffect(() => {
        const db = getFirestore();
        const unsubscribe = onSnapshot(collection(db, "user_profiles"), (querySnapshot) => {
            const res: User[] = [];
            querySnapshot.forEach((doc) => {
                if (doc.data().isAdmin) res.push({id: doc.id, ...doc.data()} as User);
            });

            setUsers(res);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return [users, loading];
}
