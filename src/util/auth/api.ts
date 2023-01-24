import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
} from "firebase/auth";
import APIClient from "@util/APIClient";
import {Timestamp} from "@firebase/firestore";

const enum Endpoint {
    ME = '/users/me',
    USER = '/users',
    UPDATE = '/users/update',
    UPDATE_BY_EMAIL = '/users/updateByEmail',
    GET_SESSION = '/users/session',
    SIGN_OUT = '/users/signout',
    CLEAR_NOTIFICATION = '/users/clearNotification',
    CLEAR_ALL_NOTIFICATIONS = '/users/clearAllNotifications',

    ADD_FAVORITE_COURSES = '/users/addFavoriteCourses',
    REMOVE_FAVORITE_COURSES = '/users/removeFavoriteCourses',
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
    pronouns?: string;
    meetingLink?: string;
    coursePermissions: { [key: string]: CoursePermission };
    notifications: Notification[]
    favoriteCourses: string[];
}

export const enum NotificationType {
    NotificationClaimed = "CLAIMED",
    NotificationAnnouncement = "ANNOUNCEMENT"
}

export interface Notification {
    ID: string;
    Title: string;
    Body: string;
    Timestamp: Timestamp;
    Type: NotificationType;
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
 * Fetches profile information corresponding to the currently logged-in user.
 */
async function updateUser(displayName: string, pronouns: string, meetingLink: string): Promise<void> {
    try {
        return await APIClient.post(`${Endpoint.UPDATE}`, {
            displayName, pronouns, meetingLink
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

    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
        'hd': 'brown.edu'
    });

    return signInWithPopup(auth, provider)
        .then((userCredential) => {
            // Signed in
            return userCredential.user.getIdToken(true)
                .then((idToken) => {
                    // Session login endpoint is queried and the session cookie is set.
                    // TODO: CSRF protection should be taken into account.
                    return APIClient.post(Endpoint.GET_SESSION, {token: idToken.toString()});
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

/**
 * Clears the given notification.
 */
async function clearNotification(notification: Notification): Promise<void> {
    try {
        return await APIClient.post(Endpoint.CLEAR_NOTIFICATION, {notificationId: notification.ID});
    } catch (e) {
        throw e;
    }
}

/**
 * Clears the given notification.
 */
async function clearAllNotifications(): Promise<void> {
    try {
        return await APIClient.post(Endpoint.CLEAR_ALL_NOTIFICATIONS, {});
    } catch (e) {
        throw e;
    }
}

/**
 * Adds the course ID to favorite courses.
 */
async function addFavoriteCourse(courseID: string): Promise<void> {
    try {
        return await APIClient.post(Endpoint.ADD_FAVORITE_COURSES, {courseID});
    } catch (e) {
        throw e;
    }
}

/**
 * Removes the course ID from favorite courses.
 */
async function removeFavoriteCourse(courseID: string): Promise<void> {
    try {
        return await APIClient.post(Endpoint.REMOVE_FAVORITE_COURSES, {courseID});
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
    signOut,
    clearNotification,
    clearAllNotifications,
    addFavoriteCourse,
    removeFavoriteCourse
};


export default AuthAPI;