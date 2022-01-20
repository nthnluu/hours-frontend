import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
} from "firebase/auth";
import APIClient from "@util/APIClient";

const enum Endpoint {
    ME = '/users/me',
    USER = '/users',
    UPDATE = '/users/update',
    UPDATE_BY_EMAIL = '/users/updateByEmail',
    GET_SESSION = '/users/session',
    SIGN_OUT = '/users/signout',
}

export const enum CoursePermission {
    CourseAdmin = "ADMIN",
    CourseStaff = "STAFF"
}

/** A User in the authentication system */
export interface User {
    id: string;
    email: string;
    displayName: string;
    photoUrl: string;
    isAdmin: boolean;
    coursePermissions: { [key: string]: CoursePermission };
    zoomLink?: string;
}

/**
 * Fetches profile information corresponding to the currently logged in user.
 */
async function getCurrentUser(): Promise<User> {
    try {
        return await APIClient.get(Endpoint.ME);
    } catch (e) {
        throw e;
    }
}

/**
 * Fetches profile information corresponding to the currently logged in user.
 */
async function getUserById(id: string): Promise<User> {
    try {
        return await APIClient.get(`${Endpoint.USER}/${id}`);
    } catch (e) {
        throw e;
    }
}

/**
 * Fetches profile information corresponding to the currently logged in user.
 */
async function updateUser(userID: string, displayName: string, isAdmin: boolean): Promise<void> {
    try {
        return await APIClient.post(`${Endpoint.UPDATE}/${userID}`, {
            displayName, isAdmin
        });
    } catch (e) {
        throw e;
    }
}

/**
 * Fetches profile information corresponding to the currently logged in user.
 */
async function updateUserByEmail(email: string, isAdmin: boolean): Promise<void> {
    try {
        return await APIClient.post(Endpoint.UPDATE_BY_EMAIL, {
            email, isAdmin
        });
    } catch (e) {
        throw e;
    }
}

/**
 * Redirects the user to a Google sign in page, then creates a session with the SMU API.
 */
async function signInWithGoogle() {
    const auth = getAuth();

    // As httpOnly cookies are to be used, do not persist any state client side.

    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
        'hd': 'brown.edu'
    });

    return signInWithPopup(auth, provider)
        .then((userCredential) => {
            // Signed in
            return userCredential.user.getIdToken(true)
                .then(async (idToken) => {
                    // Session login endpoint is queried and the session cookie is set.
                    // TODO: CSRF protection should be taken into account.
                    return await APIClient.post(Endpoint.GET_SESSION, {token: idToken.toString()});
                });
        })
        .catch(() => {
            throw Error("Invalid credentials");
        });
}

/**
 * Signs out the current user by removing the session cookie.
 */
async function signOut(): Promise<void> {
    try {
        await APIClient.post(Endpoint.SIGN_OUT);
        const auth = getAuth();
        await auth.signOut();
        return;
    } catch (e) {
        throw e;
    }
}

const AuthAPI = {
    getCurrentUser,
    getUserById,
    updateUser,
    updateUserByEmail,
    signInWithGoogle,
    signOut
};


export default AuthAPI;