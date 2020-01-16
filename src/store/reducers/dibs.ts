import {DibsAction, DibsBookingPayload, DibsState} from "../../types/dibs";
import {DibsActionType} from "../../types/enums/dibs";
import {getDateFromIntDayTime} from "../../lib/dateFuncs";
// import * as httpm from "typed-rest-client/HttpClient";

const initialState: DibsState = {
  bookingInfo: null,
  bookings: null,
  bookingStatus: null,
  rooms: null,

};

// let httpc: httpm.HttpClient = new httpm.HttpClient('vsts-node-api');

export default async function dibsReducer(state: DibsState = initialState, action: DibsAction): Promise<DibsState> {
  const {type, payload} = action;

  if (type === DibsActionType.BookDibsRoom) {
    // console.log("Trying to book the room!!");
    // const res = await tryToBook(payload as DibsBookingPayload);
    //
    // return {
    //   ...state,
    //   bookings: [...state.bookings, { bookingInfo: res, bookingStatus: false}]
    // };
  }

  if (type === DibsActionType.GetDibsRooms) {

    // const res = await (await httpc.get('https://queensu.evanced.info/dibsapi/rooms')).readBody();
    let payload = [];

    try {
      // payload = JSON.parse(res)
    } catch (e) {
      console.error("Error at getDibsRooms action: ", e);
    }

    return {
      ...state,
      rooms: payload || null
    }
  }

  return state;
}
