import { UserAccountType, UserActionType } from './enums/user';

export interface UserState {
  accountType: UserAccountType;
  theme: string;
  isLoggedIn: boolean;
  userInfo: UserInfo;
}

export interface UserInfo {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
}

export interface UserDataAction {
  type: UserActionType;
  payload: string | boolean | UserAccountType | UserInfo;
}
