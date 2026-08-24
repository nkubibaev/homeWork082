import { create } from 'zustand';

interface User {
    username: string;
    token: string;
}

interface AuthState {
    user: User | null;
    login: (user: User) => void;
    logout: () => void;
}

const storedUser = localStorage.getItem('user');

const initialUser: User | null = storedUser
    ? JSON.parse(storedUser)
    : null;

export const useAuthStore = create<AuthState>((set) => ({
    user: initialUser,

    login: (user) => {
        localStorage.setItem('user', JSON.stringify(user));

        set({
            user,
        });
    },

    logout: () => {
        localStorage.removeItem('user');

        set({
            user: null,
        });
    },
}));