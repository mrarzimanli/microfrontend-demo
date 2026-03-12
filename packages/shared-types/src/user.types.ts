export type UserRole = "admin" | "editor" | "viewer";

export interface User {
    id: string;
    fullName: string;
    email: string;
    role: UserRole;
    avatarUrl?: string;
    bio?: string;
}

export interface SessionContextValue {
    user: User | null;
    isAuthenticated: boolean;
    login: (user: User) => void;
    logout: () => void;
}

export interface ActivityItem {
    action: string;
    item: string;
    date: string;
}

export interface UserProfile extends Omit<User, "bio"> {
    bio: string;
    marketingEmails: boolean;
    stats: {
        orders: number;
        reviews: number;
        wishlist: number;
    };
    recentActivity: ActivityItem[];
}
