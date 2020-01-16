import { UserAccountType, UserActionType } from '../../types/enums/user';
import {UserDataAction, UserInfo, UserState} from '../../types/user';

const initialState: UserState = {
  accountType: null,
  theme: null,
  isLoggedIn: false,
  userInfo: null
};

export default function roomsReducer(
  state: UserState = initialState,
  action: UserDataAction
): UserState {
  const { type, payload } = action;

  if (type === UserActionType.SetUserData) {
    return {
      ...state,
      theme: payload as string
    };
  }

  if (type === UserActionType.SetLoggedIn) {
    return {
      ...state,
      isLoggedIn: payload as boolean
    };
  }

  if (type === UserActionType.SetAccountType) {
    return {
      ...state,
      accountType: payload as UserAccountType
    };
  }

  if (type === UserActionType.SetUser) {
    return {
      ...state,
      userInfo: payload as UserInfo
    };
  }

  return state;
}
