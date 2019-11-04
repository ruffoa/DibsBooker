# DibsBooker / QBook
This project is a fork of [QBook](https://github.com/essdev-team/dibs-wrapper), with an emphasis on allowing users to book rooms with the current D!bs system, bypassing the existing UI.

## Getting Started

QBook is programmed in Javascript and Typescript, running a Node.js Express server on the backend and a mix of standard Javascript and React on the front end. We use Babel and Webpack to bundle our ES6 / Typescript code into native JS.  The new React pages also use React Router to enable client side routing between different pages.  It utilizes MongoDB for the database and either Handlebars or React to create pages. For this app to run correctly, the MongoDB server will need to be running (cmd command: `mongod` in the bin directory of MongoDB; go to https://docs.mongodb.com/tutorials/install-mongodb-on-windows/ to learn more). To initialize and setup the server run the databaseSetup.ts, with node, found in developer_tools. See a detailed version below or in the developer_tools README.

### Dependencies

This program requires that you have Node.js version 10.x or greater and npm version 6.x or greater. If you are unsure, make sure you have Node.js and npm installed and in command prompt run: `node -v` for Node version and `npm -v` for npm version.

Numerous Node.js modules are needed for this project. Go to the main directory in command prompt and run `npm install`.
Check the dependencies object in package.json.

## Prerequisites
* Install all of the required packages by running `npm install` in the project root directory.
* Install MongoDB
* Make sure that the MongoDB server is running on 127.0.0.1:27017 (this should be the default setting), and that it has been initialized with both the admin database, and the rooms database.
  * To initialize the roomsDB, run either createOfflineDB.ts or createDatabase.js (this one needs an internet connection to work)
  * To initialize the adminDB, run adminDBSetup.js

## Running the server
Once you have completed the prerequisites, you can run the server by doing the following:

### For OSX / Linux users
Once this is done, all you have to do is type `npm run debug` into a shell to start the app using Webpack and Babel.

### For Windows users
Once this is done, all you have to do is type `npm run debug:windows` into CMD to start the app using Webpack and Babel.

### Running Tests

Automated tests are currently being created. Check the test folder for current progress or check back later. We are using Mocha as our testing framework and Sinon for sandboxing.

Thanks to BrowserStack
<a href="https://browserstack.com"> <img src="archive/Browserstack-logo.png" width="12%"> </a>
