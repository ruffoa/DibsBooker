import {DibsRoomHours} from "../types/dibs";
import {RoomFreeTable} from "../types/room";
import {day_length, start_hour} from "../../config/config";
import {parseTimeStr} from "./dateFuncs";

function generateFreeTable(days: number, dayLength: number, isFree: boolean = false): Array<Array<RoomFreeTable>> {
  const newFreeTable: Array<Array<RoomFreeTable>> = new Array(days);
  for (let j = 0; j < days; j++) {
    const curDay: Array<RoomFreeTable> = new Array(dayLength);

    for (let i = 0; i < dayLength; i++) {
      curDay[i] = {
        free: isFree,
        time: ((7 + i) >= 10 ? (7 + i) : '0' + (7 + i)) + ':30 - ' + ((8 + i) >= 10 ? (8 + i) : '0' + (8 + i)) + ':30',
        startTime: 7 + i,
        owner: 0,
        bookingHash: ''
      };
    }
    newFreeTable[j] = curDay;
  }

  return newFreeTable;
}

export function convertDibsTimesToQBookTimes(times: Array<DibsRoomHours>): Array<RoomFreeTable> {
  if (!times || !times.length)
    return [];

  const free = generateFreeTable(1, day_length, true);

  times.map((time) => {
    const sTime = parseTimeStr(time.StartTime);
    const eTime = parseTimeStr(time.EndTime);
    const len = eTime - sTime;

    for (let i = 0; i < len; i++) {
      free[0][sTime - start_hour + i] = {
        free: false,
        owner: 0,
        startTime: sTime + i,
        time: ((sTime + i) >= 10 ? (sTime + i) : '0' + (sTime + i)) + ':30 - ' + ((sTime + 1 + i) >= 10 ? (sTime + 1 + i) : '0' + (sTime + 1 + i)) + ':30'
      }
    }
  });

  return free[0];
}
