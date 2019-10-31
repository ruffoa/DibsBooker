import {DibsRoomHours} from "../types/dibs";
import {RoomFreeTable} from "../types/room";
import {generateFreeTable} from "./roomDatabase";
import {day_length, start_hour} from "../../config/config";
import {parseTimeStr} from "./dateFuncs";

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