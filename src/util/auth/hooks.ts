import {createContext, useContext, useEffect, useState, useRef} from "react";
import AuthAPI, {Notification, User} from "@util/auth/api";
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
    let unsubscribe = () => {
    };

    useAsyncEffect(async (): Promise<void> => {
        try {
            const sessionUser = await AuthAPI.getCurrentUser();
            const db = getFirestore();
            unsubscribe = onSnapshot(doc(db, "user_profiles", sessionUser.id), (doc) => {
                if (doc.exists()) {
                    const user = doc.data() as User;
                    setAuthState({
                        loading: false,
                        isAuthenticated: true,
                        currentUser: {...user, notifications: user.notifications.reverse()},
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


/** useUser is a hook that fetches a user session from the Acropolis API */
export function useUser(userID: string | undefined): [User | undefined, boolean] {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User | undefined>(undefined);

    useEffect(() => {
        if (userID) {
            const db = getFirestore();
            const unsubscribe = onSnapshot(doc(db, "user_profiles", userID), (doc) => {
                if (doc.exists()) {
                    const user = doc.data();
                    setUser({id: user.id, ...doc.data()} as User);
                    setLoading(false);
                }
            });
            return () => unsubscribe();
        }
    }, [userID]);

    return [user, loading];
}

/** useAdmins is a hook that fetches all admins. */
// TODO(n-young): should use a query.
export function useAdmins(): [User[] | undefined, boolean] {
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

export function useNotifications(user: User | undefined, cb: (a: Notification) => void): void {
    const prevNotifications = useRef<number | null>(null);

    useEffect(() => {
        const notifications = user?.notifications ?? undefined;

        // If the queue doesn't exist yet, no need to run any logic.
        if (notifications === undefined) {
            return;
        }

        // If the prev is null, we're getting the Notifications array for the first time.
        // We won't handle notifications on the first render, since that would lead to notifying
        // people about Notifications that may have happened in the past.
        if (prevNotifications.current === null) {
            prevNotifications.current = notifications.length;
            return;
        }

        // However, if previous Notifications is defined and its length is less than the number of
        // Notifications we currently have, we can run the callback.
        if (prevNotifications.current < notifications.length) {
            // Run the callback for all Notifications starting at prevNotifications.current.
            for (let i = prevNotifications.current; i < notifications.length; i++) {
                cb(notifications[i]);
            }

            // First, set prevNotifications to prevent race conditions of the effect firing multiple
            // times, between which the following line isn't called. Thus, we run this first before
            // calling cb.
            // 
            // (Consider the alternative case: we run the callbacks and then set prev.
            // An execution could be:
            //      1. Prev is 1
            //      2. We get 2 more Notifications #2 and #3. So we run them.
            //      3. We get 2 _more_, #4 and #5. Step 2 hasn't set prev. So we run #2 through #5.
            //      4. Prev is set by 2 and 3, but the damage has already happened.
            //
            // This would be very hard to make happen, but you don't take cs1760 for naught.)
            prevNotifications.current = notifications.length;
        }
    }, [user, cb]);
};
