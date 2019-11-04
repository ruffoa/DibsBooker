import {DibsAction, DibsBookingPayload, DibsMultipleBookingPayload } from "../../types/dibs";
import {DibsActionType} from "../../types/enums/dibs";

export function bookDibsRoom(payload: DibsBookingPayload): DibsAction {
  return {
    type: DibsActionType.BookDibsRoom,
    payload
  };
}

export function bookMultipleDibsRoom(payload: DibsMultipleBookingPayload): DibsAction {
  const { times, room, day, userInfo } = payload;

  const combinedTimes = [];

  let lastTime = 0;

  times.map((time) => {
    if (lastTime === time - 1)
      combinedTimes[combinedTimes.length - 1] = ({ time, length: combinedTimes[combinedTimes.length - 1].length + 1 });
    else
      combinedTimes.push({ time, length: 1 });
  });

  console.log("CALCULATED TIMES ARE: ", JSON.stringify(combinedTimes));

  return {
    type: DibsActionType.BookDibsRoom,
    payload: { startTime: combinedTimes[0].time, reservationLength: combinedTimes[0].length, startDate: day, lastName: userInfo.lastName, firstName: userInfo.firstName, emailAddress: userInfo.email, phoneNumber: userInfo.phoneNumber, room }
  };
}

export function getDibsRooms(): DibsAction {
  return {
    type: DibsActionType.GetDibsRooms,
    payload: null
  }
}