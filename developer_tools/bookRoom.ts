// To run this helper file, add this to the "Node Parameters" option in Webstorm (or run with these params from the command line)
// ` -r @babel/register `
const $ = require('najax');

export async function checkReservation(firstName, lastName, phoneNumber, emailAddress, roomID, dateTime, resLength) {
  const dibsWSURL = 'https://queensu.evanced.info/admin/dibs/api/reservations/post';
  let reservationSent = false;
  if (!reservationSent) {
    reservationSent = true;

    const postData = {
      firstName: firstName,
      lastName: lastName,
      roomid: roomID,
      startDate: dateTime,
      reservationLength: resLength,
      phoneNumber: phoneNumber,
      emailAddress: emailAddress,
      langCode: "en-US",
      staffAccess: false
    };

    $.post({
      url: dibsWSURL,
      data: JSON.stringify(postData),
      contentType: "application/json; charset=utf-8",
      async: true,
      success: function(objReturn) {
        if (objReturn.IsSuccess === true) {
          console.log('Submitted!');
        } else {
          console.log('Booking Success: ' + objReturn);
        }
      },
      error: function(xmlHttpRequest) {
        console.log("SEVERE ERROR trying to contact the dibs server");
      }
    });
  }
}
