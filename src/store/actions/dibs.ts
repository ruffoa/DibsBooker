import {DibsAction, DibsBookingPayload, DibsRoomHours} from "../../types/dibs";
import {DibsActionType} from "../../types/enums/dibs";
import * as httpm from 'typed-rest-client/HttpClient';
import rooms from "../reducers/rooms";
import {Room} from "../../types/room";
import {convertDibsTimesToQBookTimes} from "../../lib/dibsFuncs";
import {getDibsDayStrFromIntDay} from "../../lib/dateFuncs";

let httpc: httpm.HttpClient = new httpm.HttpClient('vsts-node-api');

export function bookDibsRoom(payload: DibsBookingPayload): DibsAction {
  return {
    type: DibsActionType.BookDibsRoom,
    payload
  };
}

export async function getDibsRooms(): Promise<DibsAction> {
  const res = await (await httpc.get('https://queensu.evanced.info/dibsapi/rooms')).readBody();
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