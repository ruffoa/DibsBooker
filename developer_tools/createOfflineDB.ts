// To run this helper file, add this to the "Node Parameters" option in Webstorm (or run with these params from the command line)
// ` -r @babel/register `

const monk = require('monk');
const env = process.env.NODE_ENV || 'dev';

let db = null;

if (env == 'dev')
    db = monk('localhost:27017/roomDatabase');
else
    db = monk('mongodb://heroku_qzc36wmm:v43ef6m8l71r0do13ckhjoqp2t@ds241308.mlab.com:41308/heroku_qzc36wmm');

const roomInfo = db.get('roomDatabase');
const shouldDownloadAPIInfo = false;

console.log("Starting database setup program...\n");

if (roomInfo != null){
    roomInfo.findOne({}).then(function (data, i) {
        if (data != null && data.Name != null && data.Name.length > 0) {
            console.log("\x1b[31m", "There is currently data in the DB, this script will thus clear the existing DB and re-set it with the default information in 4 seconds.");
            console.log("\x1b[31m", "please stop the program if you do not want to do this");
            setTimeout(function () {
                console.log("\x1b[31m", 'deleting the DB now :)');
                roomInfo.drop();
                console.log("\x1b[32m", "DB Deleted!");
                console.log("\x1b[0m", "\nGrabbing Data and generating database...");
                getAPIInfo();
            }, 4000);
        }
        else
            getAPIInfo();
    });
}
else
    getAPIInfo();

async function getAPIInfo() {
    var request = require('request');
    var fs = require('fs'); // file system calls, in order to see if we have a local copy of the photo on the server
    var str = "https://queensu.evanced.info/dibsAPI/rooms";

    await request(str, async function (err, res, body) {
        if (shouldDownloadAPIInfo) {

            var json = JSON.parse(body);
            var jsonStr = JSON.stringify(json);
            fs.writeFile('offlineDBSetupFile.json', jsonStr, (err) => {
                // throws an error, you could also catch it here
                if(err) throw err;

                // success case, the file was saved
                console.log('JSON API Info saved!');
            });
        }
        else
        {
            const obj = JSON.parse(fs.readFileSync('offlineDBSetupFile.json', 'utf8'));

            for (const json in obj) {
                let data = JSON.parse(body)[json];
                if (data) {
                    if (data && data.Name && data.Name.indexOf("BMH 111") >= 0)
                        data.Name = "BMH 111";

                    const description = data.Description;
                    if (description.indexOf("TV") > 0 || description.indexOf("Projector") > 0)
                        data.tv = true;
                    else
                        data.tv = false;

                    if (description.indexOf("Small") >= 0 || description.indexOf("small") >= 0)
                        data.size = 0;  // set 0 as small
                    else if (description.indexOf("Medium") >= 0)
                        data.size = 1;    // set 1 as medium
                    else if (description.indexOf("Large") >= 0)
                        data.size = 2;  // set 2 as large
                    else {
                        data.size = 3; // this is room 111, or the "other" type room
                        data.special = true;
                    }

                    const roomNum = data.Name.match(/\d+/)[0]; // get the number from the room
                    const roomPicName = "BMH" + roomNum + ".jpg";
                    if (fs.existsSync("../public/img/" + roomPicName)) {
                        data.Picture = "/img/" + roomPicName;
                    }

                    if (description.indexOf("phone") >= 0 || description.indexOf("Phone") >= 0)
                        data.phone = true;
                    else
                        data.phone = false;

                    data.Free = createFreeArray(true, 16, 2);

                    await roomInfo.insert(data);
                    console.log(data);
                }
            }
            console.log("-------------------------------------------\n       DONE           \n-------------------------------------------")
            setTimeout(killProcess, 2000);  // the delay ensures that the DB has been fully written to prior to
            // ending the process, this was the reason as to why this function
            // was not working before :(
        }
    });
}

function createFreeArray(val, len, weeks) {
    let out = new Array(weeks * 7);
    for (let j = 0; j < weeks * 7; j++) {
        let curDay = new Array(len);
        for (let i = 0; i < len; i++) {
            curDay[i] = {
                free: val,
                time: ((7 + i) >= 10 ? (7 + i) : "0" + (7 + i)) + ":30 - " + ((8 + i) >= 10 ? (8 + i) : "0" + (8 + i)) + ":30",
                startTime: 7 + i,
                owner: 0,
                bookingHash: ""
            };
        }
        out[j] = curDay;
    }
    return out;
}

function killProcess() {
    process.exit(0);
}
