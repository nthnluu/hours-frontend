/** The roles a user can be */
export enum UserRole {
    'SUPER_ADMIN',
    'ADMIN',
    'USER'
}

/** A User in the authentication system */
export interface User {
    email: string;
    name: string;
    image: string;
    role: UserRole;
}

export interface AuthService {
    loginWithEmailAndPassword: (email: string, password: string) => Promise<User>;
    registerWithEmailAndPassword: (name: string, email: string, password: string) => Promise<User>;
    currentUser: User | undefined;
    isAuthenticated: boolean;
}

export function testUser(overrides?: { [key: string]: string | UserRole }) {
    return {
        email: "nate1299@me.com",
        image: "/sample_avatar.jpg",
        name: "Nathan Benavides-Luu",
        role: UserRole.USER,
        ...overrides
    };
}