import { IUserProfile } from '@/interfaces';

export interface AppNotification {
    content: string;
    color?: string;
    showProgress?: boolean;
}

export interface Lection {
    id: number;
    content_ru: string;
    title: string;
    city?: string;
    date?: string;
}

export interface MainState {
    token: string;
    isLoggedIn: boolean | null;
    logInError: boolean;
    userProfile: IUserProfile | null;
    dashboardMiniDrawer: boolean;
    dashboardShowDrawer: boolean;
    notifications: AppNotification[];
    searchQuery: string | null;
    searchResult: Lection[];
    currentLection: Lection | null;
}
