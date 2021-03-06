import { IUserProfile } from '@/interfaces';
import {MainState, AppNotification, Lection} from './state';
import { getStoreAccessors } from 'typesafe-vuex';
import { State } from '../state';


export const mutations = {
    setToken(state: MainState, payload: string) {
        state.token = payload;
    },
    setLoggedIn(state: MainState, payload: boolean) {
        state.isLoggedIn = payload;
    },
    setLogInError(state: MainState, payload: boolean) {
        state.logInError = payload;
    },
    setUserProfile(state: MainState, payload: IUserProfile) {
        state.userProfile = payload;
    },
    setDashboardMiniDrawer(state: MainState, payload: boolean) {
        state.dashboardMiniDrawer = payload;
    },
    setDashboardShowDrawer(state: MainState, payload: boolean) {
        state.dashboardShowDrawer = payload;
    },
    addNotification(state: MainState, payload: AppNotification) {
        state.notifications.push(payload);
    },
    removeNotification(state: MainState, payload: AppNotification) {
        state.notifications = state.notifications.filter((notification) => notification !== payload);
    },
    setSearchIsLoading(state: MainState, payload: boolean) {
        state.searchIsLoading = payload;
    },
    setSearchResult(state: MainState, payload: Lection[]) {
        payload.map(
          (lection) => {
              if (lection.date) {
                  lection.date = new Date(lection.date);
              }
          });
        state.searchResult = payload;
    },
    setCurrentLection(state: MainState, payload: Lection) {
        // TODO move needle to consts or api
        let idx = 0;
        let content = payload.content_ru.replace(
          /<\/span>\s<span class="highlight">/gi, ' ');

        content = content.replace(/<span class="highlight"/g,
          (match) => {
              return `${match} id="highlight${idx++}"`;
          },
        );
        payload.content_ru = content;
        if (payload.date) {
            payload.date = new Date(payload.date);
        }
        state.currentLection = payload;
    },
};

const {commit} = getStoreAccessors<MainState | any, State>('');

export const commitSetDashboardMiniDrawer = commit(mutations.setDashboardMiniDrawer);
export const commitSetDashboardShowDrawer = commit(mutations.setDashboardShowDrawer);
export const commitSetLoggedIn = commit(mutations.setLoggedIn);
export const commitSetLogInError = commit(mutations.setLogInError);
export const commitSetToken = commit(mutations.setToken);
export const commitSetUserProfile = commit(mutations.setUserProfile);
export const commitAddNotification = commit(mutations.addNotification);
export const commitRemoveNotification = commit(mutations.removeNotification);
export const commitSetSearchResult = commit(mutations.setSearchResult);
export const commitSetSearchIsLoading = commit(mutations.setSearchIsLoading);
export const commitSetCurrentLection = commit(mutations.setCurrentLection);
