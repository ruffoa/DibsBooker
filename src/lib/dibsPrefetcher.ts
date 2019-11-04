import {getDibsBookingsForAllRoomsForGivenDays} from "./serverSideDibsFuncs";
import {getListOfRoomState} from "./roomDatabase";
import {ExtendedRoom, Room} from "../types/room";

const fiveMinutes = 5 * 60 * 1000;

let dibsDayData: Array<ExtendedRoom> = [];
let rooms: Array<ExtendedRoom> = [];

async function refreshData() {
  dibsDayData = await getDibsBookingsForAllRoomsForGivenDays(rooms, 3);
  console.log(dibsDayData);
}

export async function setupPrefetcher() {
  rooms = await getListOfRoomState(0, -1, undefined);
  dibsDayData = rooms;
  await refreshData();

  setTimeout(async function () {
    console.log('getting new data from Dibs!');
    await refreshData()
  }, fiveMinutes);
}

export function getLatestDibsData(): Array<Room> {
  return dibsDayData;
}