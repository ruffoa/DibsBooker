import {DibsAction, DibsBookingPayload} from "../../types/dibs";
import {DibsActionType} from "../../types/enums/dibs";

export function bookDibsRoom(payload: DibsBookingPayload): DibsAction {
  return {
    type: DibsActionType.BookDibsRoom,
    payload
  };
}
