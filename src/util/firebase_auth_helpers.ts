import {createContext, useContext, useEffect, useState} from 'react';
import firebase_app from "./firebase_app";
import {
    getAuth,
    GoogleAuthProvider,
    onAuthStateChanged,
    signInWithPopup,
    User as FirebaseUser,
    signOut as signOutFirebase
} from "firebase/auth";

export interface User {
    id: string;
    email: string;
    name: string;
    profilePicture: string;
}

export interface AuthState {
    /** Indicates if the current user is logged in. */
    isAuthenticated: boolean;
    /** Indicates whether the auth session is currently being loaded. */
    isLoading: boolean;
    /** The current user, if logged in. */
    user?: User;
    /** Signs the current user out, if logged in. */
    signOut: () => void;
    /** Signs a user in with Google. */
    signInWithGoogle: () => Promise<User>;
}

const auth = getAuth(firebase_app);

/** Converts the user returns from Firebase into the User object. */
function firebaseUserToUser(firebaseUser: FirebaseUser): User {
    return {
        id: firebaseUser.uid,
        email: firebaseUser.email!,
        name: firebaseUser.displayName!,
        profilePicture: firebaseUser.photoURL!
    };
}

function signOut() {
    signOutFirebase(auth);
}

/** Opens a Google sign-in popup and authenticates the user. */
async function signInWithGoogle(): Promise<User> {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({'hd': 'brown.edu'});

    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    return firebaseUserToUser(user);
}

/** Creates an auth state object */
function createAuthState(isAuthenticated = false, isLoading = true, user: User | undefined = undefined): AuthState {
    return {isAuthenticated, isLoading, user, signOut, signInWithGoogle};
}

/** The initial authentication state */
export const defaultAuthState: AuthState = createAuthState();

const FirebaseAuthContext = createContext<AuthState>(defaultAuthState);
export const FirebaseAuthProvider = FirebaseAuthContext.Provider;

/** Hook that provides a session listener and various session methods */
export function useFirebaseAuth() {
    const [authState, setAuthState] = useState(defaultAuthState);

    useEffect(() => {
        // create authentication state listener
        onAuthStateChanged(auth, (user) => {
            if (user) {
                // User is signed in.
                setAuthState(createAuthState(true, false, firebaseUserToUser(user)));
            } else {
                // User is signed out.
                setAuthState(createAuthState(false, false));
            }
        });
    }, []);

    return authState;
}

/** Hook for reading and interacting with the app's current Firebase auth session */
export function useAuth() {
    return useContext(FirebaseAuthContext);
}