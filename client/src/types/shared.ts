export interface AppNotification {
    id: string
    type: "success" | "error" | "warning" | "info"
    title: string
    message: string
    timestamp: string
}

export interface AppUser {
    id: string
    name: string
    email: string
    role: string
    avatar?: string
}

export interface AuthUser {
    _id: string; // Auth user uses _id
    name: string;
    email: string;
    role: "user" | "admin";
}
