import {DibsActionType} from "./enums/dibs";
import {Room} from "./room";
import {UserInfo} from "./user";

export interface DibsBookingPayload {
  room: Room;
  emailAddress: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  reservationLength: number;
  startDate: number;
  startTime: number;
}

export interface DibsMultipleBookingPayload {
  room: Room;
  times: Array<number>;
  day: number;
  userInfo: UserInfo;
}

export interface DibsRoomHours {
  EndTime: string;
  RoomID: number;
  SpaceName: string;
  StartTime: string;
}

export interface DibsRoom {
  BuildingID: number;
  Description: string;
  Map: string;
  Name: string;
  Picture: string;
  RoomID: number;
}

export interface Booking extends DibsBookingPayload{
  bookingInfo: string;
  bookingStatus: boolean;
}

export interface DibsState {
  bookingStatus: boolean;
  bookingInfo: string;
  bookings: Array<Booking>;
  rooms: Array<DibsRoom>
}

export interface DibsAction {
  type: DibsActionType;
  payload: DibsBookingPayload | Array<Room> | Array<DibsRoom>;
}
