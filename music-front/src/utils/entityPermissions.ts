import type { User } from '../types';

interface EntityOwner {
    user: string;
    isPublished: boolean;
}

export const canDeleteEntity = (currentUser: User | null, entity: EntityOwner) => {
    if (currentUser === null) {
        return false;
    }

    if (currentUser.role === 'admin') {
        return true;
    }

    return (!entity.isPublished && entity.user === currentUser._id);
};

export const canPublishEntity = (currentUser: User | null) => {
    return currentUser !== null && currentUser.role === 'admin';
};