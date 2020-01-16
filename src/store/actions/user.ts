import {UserDataAction, UserInfo} from '../../types/user';
import { UserAccountType, UserActionType } from '../../types/enums/user';

export function setLoggedIn(payload: boolean): UserDataAction {
  return {
    type: UserActionType.SetLoggedIn,
    payload
  };
}

export function setAccountType(payload: UserAccountType): UserDataAction {
  return {
    type: UserActionType.SetAccountType,
    payload
  };
}

export function setUserInfo(payload: UserInfo): UserDataAction {
  return {
    type: UserActionType.SetUser,
    payload
  };
}