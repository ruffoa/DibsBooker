import {DibsActionType} from "./enums/dibs";
import {Room} from "./room";

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
}

export interface DibsAction {
  type: DibsActionType;
  payload: DibsBookingPayload | Array<Room> | Array<DibsRoom>;
}
