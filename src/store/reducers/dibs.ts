import {DibsAction, DibsBookingPayload, DibsState} from "../../types/dibs";
import {Room, RoomDataAction, RoomState, TimeCountObject} from "../../types/room";
import {RoomsActionType} from "../../types/enums/room";
import {DibsActionType} from "../../types/enums/dibs";
import {getDateFromIntDayTime, getDaysFromToday} from "../../lib/dateFuncs";

const $ = require('najax');

const initialState: DibsState = {
  bookingInfo: null,
  bookings: null,
  bookingStatus: null
};

async function tryToBook(bookingParams: DibsBookingPayload) {
  const dibsWSURL = 'https://queensu.evanced.info/admin/dibs/api/reservations/post';
  const { room, emailAddress, firstName, lastName, phoneNumber, reservationLength, startDate, startTime } = bookingParams;

  if (emailAddress.endsWith('@queensu.ca') && room !== null && firstName !== null && lastName !== null && reservationLength !== null && startDate !== null) {
    if (startDate > 14 || startDate < 0) {
      return null;
    }

    let result = null;
    const roomid = room.roomID;
    const date = getDateFromIntDayTime(startDate, startTime);

    await $.post({
      url: dibsWSURL,
      data: JSON.stringify({ roomid, emailAddress, firstName, lastName, phoneNumber, reservationLength, startDate: startTime }),
      contentType: "application/json; charset=utf-8",
      async: true,
      success: function (objReturn) {
        if (objReturn.IsSuccess === true) {
          console.log('Submitted!');
        } else {
          console.log('Booking Success: ' + objReturn);
          result = objReturn;
        }
      },
      error: function (xmlHttpRequest) {
        console.log("SEVERE ERROR trying to contact the dibs server");
      }
    });

    return result;
  }
}

export default async function dibsReducer(state: DibsState = initialState, action: DibsAction): Promise<DibsState> {
  const {type, payload} = action;

  if (type === DibsActionType.BookDibsRoom) {
    const res = await tryToBook(payload as DibsBookingPayload);
    return {
      ...state,
      bookings: [...state.bookings, { bookingInfo: "", bookingStatus: false}]
    };
  }

  return state;
}
