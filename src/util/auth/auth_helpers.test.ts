import {AuthService, User, UserRole} from "./auth_helpers";

class TestUser implements User {
    email: string;
    image: string;
    name: string;
    role: UserRole;

    constructor(email: string, image: string, name: string, role: UserRole) {
        this.email = email;
        this.image = image;
        this.name = name;
        this.role = role;
    }
}

class TestAuthService implements AuthService {
    currentUser: TestUser | undefined;
    isAuthenticated: boolean;
    userDatabase: TestUser[];

    constructor() {
        this.isAuthenticated = false;

        const demoUser = new TestUser("demo@test.com", "/vercel.svg", "John Doe", UserRole.USER);
        const demoAdmin = new TestUser("admin@test.com", "/vercel.svg", "Jane Doe", UserRole.ADMIN);
        this.userDatabase = [demoAdmin, demoUser];
    }

    loginWithEmailAndPassword(email: string, password: string): Promise<TestUser> {
        if (this.userDatabase.some(user => user.email === email) && password === "asdf") {
            return Promise.resolve(this.userDatabase.find(user => user.email === email)!);
        } else {
            return Promise.reject({
                message: "Invalid email or password"
            });
        }
    }

    registerWithEmailAndPassword(name: string, email: string, password: string): Promise<TestUser> {
        if (this.userDatabase.some(user => user.email === email) && password === "asdf") {
            return Promise.reject({
                message: "This user already exists"
            });
        } else {
            const newUser = new TestUser(email, "/vercel.svg", name, UserRole.USER);
            this.userDatabase.push(newUser);
            return Promise.resolve(newUser);
        }
    }
}

describe('auth service', () => {
    let authService: TestAuthService;

    beforeEach(() => {
        authService = new TestAuthService();
    });

    it('returns a user when logged in successfully', () => {
        const demoUser = new TestUser("demo@test.com", "/vercel.svg", "John Doe", UserRole.USER);
        authService.loginWithEmailAndPassword("demo@test.com", "asdf")
            .then(user => {
                expect(user).toBe(demoUser);
            });
    });

    it('returns a user when logged in succesfully', () => {
        const demoUser = new TestUser("demo@test.com", "/vercel.svg", "John Doe", UserRole.USER);
        authService.loginWithEmailAndPassword("demo@test.com", "asdf")
            .then(user => {
                expect(user).toBe(demoUser);
            });
    });
});