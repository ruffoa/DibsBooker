import {DibsAction, DibsBookingPayload} from "../types/dibs";
import {DibsActionType} from "../types/enums/dibs";
import {Room} from "../types/room";
import {getDateFromIntDayTime, getDibsDayStrFromIntDay} from "./dateFuncs";
import {convertDibsTimesToQBookTimes} from "./dibsFuncs";
import * as httpm from "typed-rest-client/HttpClient";

let httpc: httpm.HttpClient = new httpm.HttpClient('vsts-node-api');
const $ = require('najax');

export async function getDibsBookingsForRoom(roomID: number, date: string): Promise<DibsAction> {
  const res = await (await httpc.get(`https://queensu.evanced.info/dibsapi/reservations/${date}/${roomID}`)).readBody();
  let payload = [];

  try {
    payload = JSON.parse(res)
  } catch (e) {
    console.error("Error at getDibsRooms action: ", e);
  }

  return {
    type: DibsActionType.GetDibsRooms,
    payload
  }
}

export async function getDibsBookingsForAllRooms(rooms: Room[], date: number): Promise<DibsAction> {
  let roomBookings: Array<Room> = [];

  for (const room of rooms) {
    if (room.roomID) {
      const dateStr = getDibsDayStrFromIntDay(date);
      const res = await (await httpc.get(`https://queensu.evanced.info/dibsapi/reservations/${dateStr}/${room.id}`)).readBody();

      try {
        const times = JSON.parse(res);

        const freeArr = convertDibsTimesToQBookTimes(times);
        const free = room.Free;
        free[date] = freeArr;

        roomBookings.push({ ...room, Free: free });
      } catch (e) {
        console.error("Error at getDibsRooms action: ", e);
      }
    }
  }

  return {
    type: DibsActionType.GetAllDibsRooms,
    payload: roomBookings
  }
}

export async function tryToBook(bookingParams: DibsBookingPayload) {
  const dibsWSURL = 'https://queensu.evanced.info/admin/dibs/api/reservations/post';
  const { room, emailAddress, firstName, lastName, phoneNumber, reservationLength, startDate, startTime } = bookingParams;

  if (emailAddress.endsWith('@queensu.ca') && room !== null && firstName !== null && lastName !== null && reservationLength !== null && startDate !== null) {
    console.log("Checking params!");

    if (startDate > 14 || startDate < 0) {
      return null;
    }

    let result = null;
    const roomid = room.roomID;
    const date = getDateFromIntDayTime(startDate, startTime);

    console.log("BOOKING! ", date, roomid, emailAddress, phoneNumber, firstName, lastName, reservationLength, startTime);

    await $.post({
      url: dibsWSURL,
      data: JSON.stringify({ roomid, emailAddress, firstName, lastName, phoneNumber, reservationLength, startDate: date, langCode: "en-US", staffAccess: false }),
      contentType: "application/json; charset=utf-8",
      async: true,
      success: function (objReturn) {
        if (objReturn.IsSuccess === true) {
          console.log('Submitted!');
        } else {
          console.log('Booking Result: ' + objReturn);
          result = objReturn;
        }
      },
      error: function (xmlHttpRequest) {
        console.error("SEVERE ERROR trying to contact the dibs server");
      }
    });

    return result;
  }
}
