import express from 'express';
import { getUserID } from '../lib/userFunctions';
import { bookMultiple, bookMultipleByName } from '../lib/roomBooking';
import {bookDibsRoom} from "../store/actions/dibs";
import {DibsMultipleBookingPayload} from "../types/dibs";
import {tryToBook} from "../lib/serverSideDibsFuncs";

const router = express.Router();
router.post('/bookroom', async function (req, res) { // similar to the book function with a few changes which will be commented below
  console.log('got the post! ', req.body);
  const roomToBook = JSON.stringify(req.body);
  const postData: DibsMultipleBookingPayload = JSON.parse(roomToBook);

  const { times, room, day, userInfo } = postData;

  const combinedTimes = [];

  let lastTime = 0;

  times.map((time) => {
    if (lastTime === time - 1)
      combinedTimes[combinedTimes.length - 1] = ({ time, length: combinedTimes[combinedTimes.length - 1].length + 1 });
    else
      combinedTimes.push({ time, length: 1 });
  });

  console.log("CALCULATED TIMES ARE: ", JSON.stringify(combinedTimes));
  const usrid = getUserID(req);

  if (usrid === -1 || usrid === undefined) {
    req.flash('bookingMessage', roomToBook);
    res.send({
      HeaderMsg: 'You must login',
      BookingStatusMsg: room.room + '-' + times[0] + '-' + 1 + '-' + day,
      BookStatus: false
    });
  } else {
    console.log('booking');

    const data = await tryToBook({ startTime: combinedTimes[0].time, reservationLength: combinedTimes[0].length, startDate: day, lastName: userInfo.lastName, firstName: userInfo.firstName, emailAddress: userInfo.email, phoneNumber: userInfo.phoneNumber, room })
    res.send({ HeaderMsg: data.Message, BookingStatusMsg: data.Message, BookStatus: data.IsSuccess });
  }
});

async function book(day, times, roomName, usrid, req, res) {
  console.log('booking: ', day, times, roomName, usrid, req, res);
  const data = await bookMultipleByName(day, times, roomName, usrid, req); //Similar to the bookRoom function with a few minor differences
  console.log('Request Body: ' + JSON.stringify(req.body) + ' room id: ' + roomName + ' Success: ' + data.success);
  res.send({ HeaderMsg: data.header, BookingStatusMsg: data.bookMsg, BookStatus: data.success });
}

export default router;
