const app = require('express').Router()
const axios = require('axios');
const cfg = require("../cfg/config.whatsapp");
const { sendMessage, getTextMessageInput } = require("../utl/messageHelper");

// https://developers.facebook.com/blog/post/2022/10/31/sending-messages-with-whatsapp-in-your-nodejs-application/
// https://www.youtube.com/watch?v=6bAp_cvZet8
// https://github.com/leifermendez/api-whatsapp-ts/blob/main/src/infrastructure/repositories/ws.external.ts

app.get('/', function (req, res, next) {

    const recipient = req.query.recipient;
    const text = req.query.text || 'Welcome to the Movie Ticket Demo App for Node.js!';
    const data = getTextMessageInput(recipient, text);

    sendMessage(data, cfg.access_token)
        .then(function (response) {
            res.redirect('/');
            res.sendStatus(200);
            return;
        })
        .catch(function (error) {
            console.log(error);
            console.log(error.response.data);
            res.sendStatus(500);
            return;
        });
});

module.exports = app;
