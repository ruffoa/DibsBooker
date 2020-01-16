// https://scotch.io/tutorials/easy-node-authentication-setup-and-local#toc-database-config-configdatabasejs
import renderAppToString from "../server/renderAppToString";
import {compile} from "../server/compileSass";
import template from "../server/template";
import createStore from '../store/createStore';
import {setCurrentHour} from "../store/actions/rooms";
import {setAccountType, setLoggedIn} from "../store/actions/user";
import * as accountFuncs from "../lib/userFunctions";
import {UserAccountType} from "../types/enums/user";

var express = require('express');
var router = express.Router();

async function createStoreInstance(req, current_hour) {
    const store = createStore({});
    await store.dispatch(setCurrentHour(current_hour));
    await store.dispatch(setLoggedIn(req.isAuthenticated()));

    const accountType = accountFuncs.getAdminStatus(req) ? UserAccountType.Admin : UserAccountType.Regular;
    await store.dispatch(setAccountType(accountType));
    return store;
}

router.get('/signup', async function (req, res, next) { //the request to render the page
    if (req.isAuthenticated())
        return res.redirect('/accounts');

    const msg = req.flash('signupMessage');
    let hasMsg = false;
    if (msg != undefined && msg.length > 0) {
        const msgTxt = msg[0];
        hasMsg = (msgTxt.length > 0) ? true : false;
    }

    const dateObj = new Date();
    let current_hour = dateObj.getHours();
    const current_min = dateObj.getMinutes();

    if (current_min < 30)   // logic here is that we are returning the status based on the start hour.  Since the min booking time is
        current_hour--;       // 1 hour, if the current minute is less than 30, we are still within the previous booking slot
                              // and we should therefore subtract 1 from the hour to get the right data (eg. if it is 7:10pm
                              // right now, then we really want the data from 6:30 - 7:30, not 7:30 - 8:30)

    const store = await createStoreInstance(req, current_hour);
    const context = {};
    const { html: body, css: MuiCss } = renderAppToString(req, context, store);
    const title = 'Signup';
    const theme = req.theme === "custom" ? false : req.theme || 'default';
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

export default router;
