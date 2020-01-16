import { createSelector } from 'reselect';
import { StoreState } from '../../types/store';
import {UserInfo, UserState} from '../../types/user';
import { UserAccountType } from '../../types/enums/user';

function getUser(state: StoreState): UserState {
  return state.user;
}

export const selectIsLoggedIn = createSelector<StoreState, UserState, boolean>(
  [getUser],
  (userState: UserState): boolean => userState.isLoggedIn
);

export const selectIsAdmin = createSelector<StoreState, UserState, boolean>(
  [getUser],
  (userState: UserState): boolean => userState.accountType === UserAccountType.Admin
);

export const selectUserInfo = createSelector<StoreState, UserState, UserInfo>(
  [getUser],
  (userState: UserState): UserInfo => userState.userInfo
);
