import template from '../server/template';
import createStore from '../store/createStore';
import {setCurrentHour, setDate, setRooms, setTimeCount} from '../store/actions/rooms';
import {setLoggedIn, setUserInfo} from '../store/actions/user';
import renderAppToString from '../server/renderAppToString';
import { compile } from '../server/compileSass';
import { Room } from '../types/room';
import { getFreeTable, getInfoByName, getListOfRoomState } from '../lib/roomDatabase';
import { getDaysFromToday } from '../lib/dateFuncs';
import { getInfo } from '../../models/roomDatabase';
import { getTimecount } from '../lib/roomBooking';
import {getUserID, getUserInfo} from '../lib/userFunctions';
import {UserInfo} from "../types/user";
import {getDibsBookingsForAllRooms} from "../lib/serverSideDibsFuncs";

const express = require('express');
const router = express.Router();
const accountFuncs = require('../lib/userFunctions');

function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

async function createStoreInstance(req, data, current_hour, timeCount, userInfo: UserInfo, date) {
  const store = createStore({});
  await store.dispatch(setRooms(data));
  await store.dispatch(setCurrentHour(current_hour));
  await store.dispatch(setTimeCount(timeCount));
  await store.dispatch(setLoggedIn(req.isAuthenticated()));
  await store.dispatch(setUserInfo(userInfo));
  await store.dispatch(setDate(date));

  return store;
}

router.get('/book-v2/:roomName/', async function (req, res, next) {
  const dateObj = new Date();
  let current_hour = dateObj.getHours();
  const day = 0;

  let room = req.params.roomName;
  room = room.toUpperCase();
  room = room.replace(/-/g, ' '); // strip out dashes

  const roomInfo: Room = await getInfoByName(room);
  if (!roomInfo) { // invalid room, the user specified an invalid room, so we will show the 404 page
    // do nothing here, and end the "render" call
    return null;
  }

  const roomID = roomInfo.roomID;
  const roomFreeTable = await getFreeTable(roomID);
  const userid = accountFuncs.getUserID(req);

  const imgID = room.replace(/\s+/g, '') + '.jpg';
  roomInfo.userId = userid;
  roomInfo.Free = roomFreeTable;
  roomInfo.Picture = '/img/' + imgID;
  roomInfo.day = 0;

  const themeColors = req.colors;

  const listFree = await getListOfRoomState(day, -1, userid); // gives back data for EVERY day if -1 for time
  const dibsFree = await getDibsBookingsForAllRooms(listFree, day);
  const timecount = getTimecount(day, userid, current_hour, dibsFree.payload);

  const store = await createStoreInstance(req, listFree, current_hour, timecount, getUserInfo(req), day);
  const context = {};
  const { html: body, css: MuiCss } = renderAppToString(req, context, store);
  const title = `QBook - Book ${roomInfo.room} for ${dateObj.toDateString()}`;
  const theme = req.theme === 'custom' ? false : req.theme || 'default';
  const cssPath = [`/CSS/room-style/${theme}-room-style.css`];
  const compiledCss = compile('src/SCSS/main.scss');

  res.send(template({
    body,
    title,
    compiledCss,
    cssPath,
    MuiCss
  }));
});

router.get('/book-v2/:roomName/:date', async function (req, res, next) {
  const dateObj = new Date();
  let current_hour = dateObj.getHours();
  const day = 0;
  const userid = getUserID(req);

  const datestr = req.params.date;
  let room = req.params.roomName;
  room = room.toUpperCase();
  room = room.replace(/-/g, ' '); // strip out dashes

  const parts = datestr.split('-');
  // new Date(year, month [, day [, hours[, minutes[, seconds[, ms]]]]])
  const date = new Date(parts[0], parts[1] - 1, parts[2]); // Note: months are 0-based
  const today = new Date();
  const diff = getDaysFromToday(date);

  if (isNaN(date.getTime()) || !diff) {  // invalid date, the user only specified the room, not the date as well...
    // do nothing here, and end the "render" call
    return null;
  } else if (diff < 0 || diff > 14) {
    let max = addDays(today, 14);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    const message = diff < 0 ? '<p>You cannot book in the past! Stop being dumb :P </p>' : '<p>You cannot book that far ahead!  The limit is ' + max.toLocaleDateString('en-CA', options) + '</p>';

    res.status(404).send(message);
  }

  console.log("THE DATE IS: ", diff, date);
  const roomInfo: Room = await getInfoByName(room);
  if (!roomInfo) { // invalid room, the user specified an invalid room, so we will show the 404 page
    // do nothing here, and end the "render" call
    return null;
  }

  const listFree = await getListOfRoomState(day, -1, userid); // gives back for all days, so date passed is irrelevant
  const dibsFree = await getDibsBookingsForAllRooms(listFree, diff);
  const timecount = getTimecount(diff, userid, current_hour, dibsFree.payload);

  const roomID = roomInfo.roomID;
  const roomFreeTable = await getFreeTable(roomID);
  const usrid = accountFuncs.getUserID(req);
  const imgID = room.replace(/\s+/g, '') + '.jpg';
  roomInfo.userId = usrid;
  roomInfo.Free = roomFreeTable;
  roomInfo.Picture = '/img/' + imgID;
  roomInfo.day = diff;

  const themeColors = req.colors;

  const store = await createStoreInstance(req, listFree, current_hour, timecount, getUserInfo(req), diff);
  const context = {};
  const { html: body, css: MuiCss } = renderAppToString(req, context, store);
  const title = `QBook - Book ${roomInfo.room} for ${date.toDateString()}`;
  const theme = req.theme === 'custom' ? false : req.theme || 'default';
  const cssPath = [`/CSS/room-style/${theme}-room-style.css`];
  const compiledCss = compile('src/SCSS/main.scss');

  res.send(template({
    body,
    title,
    compiledCss,
    cssPath,
    MuiCss
  }));
});

router.post('/book-v2', async (req, res) => {
  console.log('got the post! ***************** ', req.isAuthenticated());

  const usrid = accountFuncs.getUserID(req);

  const data = JSON.stringify(req.body);
  const dataObj = JSON.parse(data);

  const roomName = dataObj.roomName;

  const roomInfo: Room = await getInfo(roomName);
  if (!roomInfo) { // invalid room, the user specified an invalid room, so we will show the 404 page
    // do nothing here, and end the "render" call
    return null;
  }

  const roomFreeTable = await getFreeTable(roomInfo.roomID);

  const imgID = roomInfo.Name.replace(/\s+/g, '') + '.jpg';
  roomInfo.userId = usrid;
  roomInfo.Free = roomFreeTable;
  roomInfo.Picture = '../img/' + imgID;
  roomInfo.day = 0;

  res.send(roomInfo);
});

export default router;
