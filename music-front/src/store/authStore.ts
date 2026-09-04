import { create } from 'zustand';
import type { User } from '../types';

interface AuthState {
    user: User | null;
    login: (user: User) => void;
    logout: () => void;
}

const getStoredUser = (): User | null => {
    const storedUser = localStorage.getItem('user');

    if (!storedUser) {
        return null;
    }

    try {
        const user = JSON.parse(storedUser) as User;

        if (!user._id || !user.username || !user.token || !user.role) {
            localStorage.removeItem('user');
            return null;
        }

        return user;
    } catch {
        localStorage.removeItem('user');
        return null;
    }
};

export const useAuthStore = create<AuthState>((set) => ({
    user: getStoredUser(),

    login: (user) => {
        localStorage.setItem('user', JSON.stringify(user));

        set({ user });
    },

    logout: () => {
        localStorage.removeItem('user');

        set({ user: null });
    },
}));