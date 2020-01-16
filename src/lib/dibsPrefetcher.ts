import {
  getDibsBookingsForAllRooms,
  getDibsBookingsForAllRoomsForDayRange,
  getDibsBookingsForAllRoomsForSpecifiedDays
} from "./serverSideDibsFuncs";
import {getListOfRoomState} from "./roomDatabase";
import {ExtendedRoom, Room} from "../types/room";

const fiveMinutes = 5 * 60 * 1000;
const daysToFetch = 3;

let dibsDayData: Array<ExtendedRoom> = [];
let rooms: Array<ExtendedRoom> = [];
let daysWithData = new Set<number>();

async function refreshData() {
  dibsDayData = await getDibsBookingsForAllRoomsForSpecifiedDays(rooms, daysWithData);
  console.log(dibsDayData);
}

export async function setupPrefetcher() {
  rooms = await getListOfRoomState(0, -1, undefined);
  dibsDayData = rooms;
  Array.from(Array(daysToFetch).keys()).forEach((i => { daysWithData.add(i) }));

  await refreshData();

  setTimeout(async function () {
    console.log('getting new data from Dibs!');
    await refreshData()
  }, fiveMinutes);
}

export function getLatestDibsData(): Array<Room> {
  return dibsDayData;
}

export async function fetchDibsDataForSpecificDayIfNotPresent(day: number) {
  if (daysWithData.has(day)) {
    return dibsDayData;
  }

  const currentDibsData = dibsDayData;
  dibsDayData = await getDibsBookingsForAllRooms(currentDibsData, day);
  console.log(dibsDayData);
  daysWithData.add(day);

  return dibsDayData;
}