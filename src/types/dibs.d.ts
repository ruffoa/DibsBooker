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
  payload: DibsBookingPayload;
}
